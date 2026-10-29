#!/usr/bin/env node
// Builds data/players-era.js — retired players of the "2000s era" deck for Higher or Lower — from Wikipedia's career tables, checked against FotMob.
// Makes no API-Football requests.
//
//   node tools/build-era.mjs --shortlist     Wikipedia only → data/generated/era-shortlist.json (who needs an API-Football lookup)
//   node tools/build-era.mjs                 Wikipedia + API-Football (+ FotMob) → data/players-era.js and data/generated/era-report.json
//
// A player is in the deck only when ALL of this holds (anything else is listed in the report with the reason — nothing is guessed):
//   • retired (the infobox career has ended before 2025) and he played at least three seasons from 2000 on; a man (Wikidata)
//   • well known: 200+ games in the five big leagues or 70+ caps
//   • Wikipedia's club rows add up to its own career row (goals ±1, games ±4%) and the senior national-team total exists (or he never played for a country)
//   • API-Football agrees: for every season from 2002 on it must not have MORE goals/games than Wikipedia (it may have fewer — it has holes), and its national-team
//     totals must not exceed Wikipedia's by more than 3 caps / 2 goals (tools/lib/verify-current.mjs, the same check the current players pass). FotMob is a third witness when it has the player.
//   • at least a third of the career lies in 2002 or later — before that API-Football has nothing to compare with
// Career goals / games = everything: all club competitions (first teams) + every senior national-team game (friendlies included); club friendlies are not counted.
// The two steps in between need the key:   node --env-file=.env tools/fetch-players.mjs --players=data/generated/era-shortlist.json --seasons=2002-2026 --out=data/generated/era-stats.json

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { parseArticle, parseInfobox, leagueTotals } from './lib/wikipedia.mjs';
import { isReserve, verifyCurrent, apiClubSeasons, startYear as startYr } from './lib/verify-current.mjs';
import { kitFor } from './lib/kits.mjs';
import { FLAGS } from './lib/flags.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const startYear = s => Number(String(s).slice(0, 4));
const PAGES = path.join(ROOT, 'data/raw/wikipedia/era'), FOTMOB = path.join(ROOT, 'data/raw/fotmob');
const THIS_YEAR = 2026;

// ── who we already have ─────────────────────────────────────────────────────────────────────────────────────────
const ctx = {}; vm.createContext(ctx);
for (const f of ['data/players.js', 'data/legends-verified.js', 'data/legends-extra.js', 'data/players-modern.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8') + ';', ctx);
const haveNames = vm.runInContext('PLAYERS.concat(PLAYERS_MODERN)', ctx).map(p => p.name);
const have = new Set(haveNames.map(fold));
// the same man under another spelling ("Marcelo Vieira" / "Marcelo", "Xavi Hernández" / "Xavi"): one name's words are all inside the other's
const SAME_MAN = { 'xavi hernandez': 'Xavi', 'daniel alves': 'Dani Alves', 'marcelo vieira': 'Marcelo' };
const haveRecords = vm.runInContext('PLAYERS.concat(PLAYERS_MODERN)', ctx);
const sameNumbers = (g, a, caps) => haveRecords.find(p => p.career_goals === g && p.career_appearances === a && p.intl_caps === caps);
const sameMan = name => haveNames.find(h => { const a = fold(name).split(' '), b = fold(h).split(' '); const [sm, lg] = a.length <= b.length ? [a, b] : [b, a]; return sm.every(t => lg.includes(t)) && (sm.length > 1 || sm[0].length >= 5); });
const logoCtx = {}; vm.createContext(logoCtx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/club-logos.js'), 'utf8') + ';this.L=CLUB_LOGOS', logoCtx);
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/\b(fc|cf|afc|ac|as|sc|ss|ssc|rc|rcd|ud|sv|vfl|vfb|club|calcio|de|the|utd|united)\b/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const CLUB_ALIAS = { 'milan': 'AC Milan', 'internazionale': 'Inter Milan', 'inter': 'Inter Milan', 'manchester': 'Man United', 'paris saint germain': 'PSG', 'bayern munchen': 'Bayern Munich', 'atletico madrid': 'Atlético Madrid' };
const logoIdx = new Map(Object.keys(logoCtx.L).map(k => [norm(k), k]));
const parentClub = n => String(n || '').replace(/\((loan|youth|reserves?)[^)]*\)/gi, '').replace(/[\s-]+(B|C|II|III|IV|2|Juvenil|Castilla|Reserves|U\d\d)$/i, '').replace(/^Jong\s+/i, '').replace(/\s+/g, ' ').trim();
const canonical = name => { const n = norm(parentClub(name)); return CLUB_ALIAS[n] || logoIdx.get(n) || parentClub(name); };
const clubKey = name => norm(canonical(name));

// ── candidates ──────────────────────────────────────────────────────────────────────────────────────────────────
const roster = [...readJson(path.join(ROOT, 'tools/roster-older.json'), []), ...readJson(path.join(ROOT, 'tools/roster-candidates.json'), [])];
const byQid = new Map(roster.map(r => [r.qid, r]));
const POS = [[/goalkeeper/i, 'Goalkeeper'], [/back|defend|sweeper|centre-half|center-half/i, 'Defender'], [/forward|striker|winger|second striker|attack/i, 'Forward'], [/midfield|playmaker/i, 'Midfielder']];
const posOf = t => (POS.find(([re]) => re.test(t || '')) || [0, 'Midfielder'])[1];
const PALETTE = [['#1a3a6b', '#5a8fd4'], ['#6b1a1a', '#e07070'], ['#1a5a3a', '#6fd49a'], ['#5a4a1a', '#e0c25a'], ['#3a1a6b', '#a07ae0'], ['#1a5a5a', '#5ad4d4'], ['#5a1a4a', '#e07ac0'], ['#3a3a3a', '#bdbdbd']];
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const male = readJson(path.join(ROOT, 'data/raw/wikipedia/era-male.json'), {});   // tools/check-male.mjs — the decks are men's football
const report = [], shortlist = [], records = [];
const files = fs.existsSync(PAGES) ? fs.readdirSync(PAGES).filter(f => f.endsWith('.html')) : [];
for (const f of files) {
  const qid = f.replace('.html', ''), r = byQid.get(qid); if (!r) continue;
  const row = { name: r.name, qid, fame: r.fame, status: 'left out', why: '' };
  report.push(row);
  const fail = why => { row.why = why; return null; };
  if (have.has(fold(r.name)) || sameMan(r.name) || SAME_MAN[fold(r.name)]) { row.why = 'already in another deck'; continue; }
  if (male[qid] !== true) { row.why = male[qid] === false ? "women's football (not part of the decks)" : 'gender not checked yet (node tools/check-male.mjs)'; continue; }
  const html = fs.readFileSync(path.join(PAGES, f), 'utf8');
  const wp = parseArticle(html), ib = parseInfobox(html);
  if (!wp.clubs.length || !wp.career || !wp.seasonRows.length) { fail('no career table on the page'); continue; }
  if (!ib.born || ib.born.slice(0, 4) !== r.born.slice(0, 4)) { fail('the page is about someone else (birth year differs)'); continue; }
  const lastSeason = Math.max(...wp.seasonRows.map(x => startYear(x.season)));
  if (ib.careerTo === 9999 || (ib.careerTo ?? 0) >= 2025 || lastSeason >= 2025) { fail('still playing (or ended 2025+)'); continue; }
  const post2000 = new Set(wp.seasonRows.filter(x => startYear(x.season) >= 2000).map(x => startYear(x.season))).size;
  if (post2000 < 3 || (ib.careerTo ?? 0) < 2004) { fail('career not mainly in the 2000s'); continue; }
  const big5 = Object.values(leagueTotals(wp.leagueRows)).reduce((a, x) => a + x.a, 0);
  const caps = wp.intl?.apps ?? 0;
  if (big5 < 200 && caps < 70) { fail(`not well known enough (${big5} big-five games, ${caps} caps)`); continue; }
  // the tables must add up (same rules as tools/verify-legends.mjs)
  let usable = wp.clubs;
  const sumG = l => l.reduce((a, c) => a + (c.goals || 0), 0), sumA = l => l.reduce((a, c) => a + (c.apps || 0), 0);
  const isRes = c => isReserve(c.club);
  if (Math.abs(sumG(usable) - wp.career.goals) > 1 && wp.clubs.some(isRes)) { const w = wp.clubs.filter(c => !isRes(c)); if (Math.abs(sumG(w) - wp.career.goals) <= 1) usable = w; }
  const goals = sumG(usable), apps = sumA(usable);
  if (Math.abs(goals - wp.career.goals) > 1) { fail(`clubs add up to ${goals} goals, the table says ${wp.career.goals}`); continue; }
  if (Math.abs(apps - wp.career.apps) > Math.max(4, wp.career.apps * 0.04)) { fail(`clubs add up to ${apps} games, the table says ${wp.career.apps}`); continue; }
  let intl = wp.intl;
  if (!intl) { if (ib.nationalTeam) { fail('national-team total not found on the page'); continue; } intl = { apps: 0, goals: 0 }; }
  // how much of the career lies in the FotMob years
  const postRows = wp.seasonRows.filter(x => startYear(x.season) >= 2002 && !isReserve(x.club || ''));
  const postApps = postRows.reduce((a, x) => a + x.apps, 0);
  if (postApps < apps * 0.33) { fail('less than a third of the career is in 2002 or later — API-Football cannot double-check it'); continue; }
  row.big5 = big5; row.caps = caps;
  // clubs (merged spells and reserve sides)
  const merged = new Map();
  for (const c of usable) { const k = clubKey(c.club); const m = merged.get(k) || { c: canonical(c.club), a: 0, g: 0 }; m.a += c.apps || 0; m.g += c.goals || 0; merged.set(k, m); }
  const clubs = [...merged.values()];
  const main = [...clubs].sort((a, b) => b.a - a.a)[0]?.c || '';
  const draft = {
    name: r.name, born: ib.born, pos: posOf(ib.position), nat: ib.nationalTeam || '',
    career_goals: goals + intl.goals, career_appearances: wp.career.apps + intl.apps, assists: null,
    intl_caps: intl.apps, intl_goals: intl.goals, trophies: null,
    club_goals: clubs.filter(c => c.g > 0).sort((a, b) => b.g - a.g).map(c => ({ c: c.c, n: c.g, col: '#444' })),
    club_apps: Math.abs(apps - wp.career.apps) <= 2 ? clubs.filter(c => c.a > 0).sort((a, b) => b.a - a.a).map(c => ({ c: c.c, n: c.a, col: '#444' })) : [],
    intl_breakdown: { flag: FLAGS[ib.nationalTeam] || '🌍', country: ib.nationalTeam || '', n: intl.goals },
    trophies_list: [], main, _rows: { postRows, clubs }
  };
  shortlist.push({ key: qid, name: r.name, born: ib.born, to: Math.min(2026, (ib.careerTo ?? lastSeason) + 1) });
  row.status = 'shortlisted'; row._wp = wp; row._ib = ib; row._draft = draft;
}

if (args.shortlist) {
  fs.mkdirSync(path.join(ROOT, 'data/generated'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'data/generated/era-shortlist.json'), JSON.stringify(shortlist, null, 1));
  const why = {}; for (const r of report) if (r.status !== 'shortlisted') { const k = r.why.replace(/\d+/g, 'N'); why[k] = (why[k] || 0) + 1; }
  console.log(`${files.length} pages read · ${shortlist.length} shortlisted for the FotMob check · left out:`); for (const [k, n] of Object.entries(why).sort((a, b) => b[1] - a[1])) console.log('  ' + String(n).padStart(4), k);
  process.exit(0);
}

// ── API-Football as the second source (FotMob as a third witness when it has the player) ─────────────────────────────
const API = readJson(path.join(ROOT, 'data/generated/era-stats.json'), { players: {} }).players;
const apiOf = (name, born) => Object.values(API).find(p => p.name === name && p.born === born);
const RAW = path.join(ROOT, 'data/raw/players');
const fmIndex = readJson(path.join(FOTMOB, 'index.json'), {});
const logoKey = name => { const n = norm(parentClub(name)); return CLUB_ALIAS[n] || logoIdx.get(n) || parentClub(name); };
for (const row of report) {
  if (row.status !== 'shortlisted') continue;
  const d = row._draft, wp = row._wp;
  const bad = why => { row.status = 'left out'; row.why = why; };
  const p = apiOf(d.name, d.born);
  if (!p) { bad('API-Football has no data for this player yet (not pulled, or no id match by birth date)'); continue; }
  if (!['ok', 'repaired'].includes(p.quality)) { bad('API-Football data flagged for review'); continue; }
  const fmE = fmIndex[row.qid], fm = fmE?.id ? readJson(path.join(FOTMOB, fmE.id + '.json'), null) : null;
  const noNation = !row._ib.nationalTeam;
  if (noNation) wp.intl = wp.intl || { apps: 0, goals: 0 };
  const v = verifyCurrent(p, wp, 9999, apiClubSeasons(p, RAW), fm, 2002);
  if (!v.ok.goals || !v.ok.apps || !v.ok.intl) { bad(`numbers not confirmed by two sources: ${v.why || JSON.stringify(v.diag)}`); continue; }
  // the headline and every per-club row come from the same finished-season rows (first teams, spells and spellings merged), so the panel adds up
  const rows = new Map();
  for (const x of v.finishedRows) { const k = clubKey(x.club); const m = rows.get(k) || { c: logoKey(x.club), a: 0, g: 0 }; m.a += x.apps; m.g += x.goals; rows.set(k, m); }
  const clubs = [...rows.values()];
  if (clubs.reduce((a, c) => a + c.g, 0) !== v.clubGoals || clubs.reduce((a, c) => a + c.a, 0) !== v.clubApps) { bad('club rows do not add up to the career numbers'); continue; }
  const twin = sameNumbers(v.clubGoals + v.intl.goals, v.clubApps + v.intl.apps, v.intl.apps);
  if (twin) { bad(`same numbers as ${twin.name}, who is already in a deck`); continue; }
  // position: the one API-Football lists him in most often (the infobox text is not always there); nationality: the senior team of the infobox, else API-Football's
  const posCount = {};
  for (const y of Object.keys(p.seasons)) { const b = readJson(path.join(RAW, `${p.id}-${y}.json`), null); for (const st of b?.response?.[0]?.statistics || []) if (st.games?.position) posCount[st.games.position] = (posCount[st.games.position] || 0) + (st.games?.appearences || 1); }
  const apiPos = { Attacker: 'Forward', Midfielder: 'Midfielder', Defender: 'Defender', Goalkeeper: 'Goalkeeper' }[Object.entries(posCount).sort((a, b) => b[1] - a[1])[0]?.[0]];
  d.pos = apiPos || d.pos;
  d.nat = d.nat || p.nationality || '';
  d.intl_breakdown = { ...d.intl_breakdown, flag: FLAGS[d.nat] || d.intl_breakdown.flag, country: d.nat };
  row.status = 'in the deck';
  const [color, tc] = PALETTE[hash(d.name) % PALETTE.length];
  const rec = {
    ...d, career_goals: v.clubGoals + v.intl.goals, career_appearances: v.clubApps + v.intl.apps, intl_caps: v.intl.apps, intl_goals: v.intl.goals,
    club_goals: clubs.filter(c => c.g > 0).sort((a, b) => b.g - a.g).map(c => ({ c: c.c, n: c.g, col: '#444' })),
    club_apps: clubs.filter(c => c.a > 0).sort((a, b) => b.a - a.a).map(c => ({ c: c.c, n: c.a, col: '#444' })),
    intl_breakdown: { ...d.intl_breakdown, n: v.intl.goals },
    color, tc, initials: d.name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase(), kit: kitFor(d.main, d.name, null),
    verified: { goals: true, apps: true, intl: true, apiId: p.id, fotmob: !!fm }
  };
  delete rec._rows; delete rec.main; delete rec.born; records.push(rec);
}
records.sort((a, b) => b.career_goals - a.career_goals);
const js = `// GENERATED by tools/build-era.mjs on ${new Date().toISOString().slice(0, 10)} — retired players of the 2000s era (Higher or Lower, the shared categories).
// Every number: Wikipedia's career tables (club rows add up to the career row), checked against API-Football for the seasons from 2002 on (and FotMob where it has the player).
// career_goals / career_appearances = everything: all club competitions (first teams) + every senior national-team game (friendlies included). Assists and trophies are not released (null).
const PLAYERS_ERA = ${JSON.stringify(records)};
`;
fs.writeFileSync(path.join(ROOT, 'data/players-era.js'), js);
for (const r of report) { delete r._draft; delete r._wp; delete r._ib; }
fs.writeFileSync(path.join(ROOT, 'data/generated/era-report.json'), JSON.stringify(report, null, 1));
const why = {}; for (const r of report) if (r.status !== 'in the deck') { const k = r.why.replace(/[\d.]+/g, 'N').replace(/^[^:]*: /, ''); why[k] = (why[k] || 0) + 1; }
console.log(`${report.length} pages · ${records.length} players in data/players-era.js (${(js.length / 1024).toFixed(0)} KB) · left out, by reason:`);
for (const [k, n] of Object.entries(why).sort((a, b) => b[1] - a[1]).slice(0, 14)) console.log('  ' + String(n).padStart(4), k.slice(0, 150));
console.log('top 15:', records.slice(0, 15).map(p => `${p.name} ${p.career_goals}g/${p.career_appearances}`).join(', '));
