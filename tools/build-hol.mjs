#!/usr/bin/env node
// Builds data/players-modern.js — the "Modern Stars" deck for Higher or Lower — from the cached API answers. Makes no API requests.
//
//   node tools/build-hol.mjs
//
// What the numbers mean (the game labels them the same way):
//   goals / appearances             the whole career from the first season the API has lines for (2002/03 at the earliest): club competitions (league, cups, Europe, club world cups) + every senior national-team game, friendlies included (that is how caps/goals are quoted)
//                                   club friendlies and pre-season tournaments are left out (Transfermarkt's club tables leave them out too)
//   intl caps / intl goals          national-team games over the same seasons (no youth teams)
//   trophies                        the player's whole career: league titles, domestic cups, super cups, Europe, club world cups, national-team tournaments
// Only players whose lines passed the quality checks (or were repaired, see tools/lib/aggregate.mjs) AND the league-line cross-check (tools/crosscheck.mjs — run it first) are included.
// A player is in the deck only when every season from his 16th birthday (or 2002) was requested, so "career" is not a half-pulled career.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { isMajorTrophy, trophyLabel, hasWomensTrophy, fotmobHonours } from './lib/trophies.mjs';
import { tmTrophies } from './lib/tm-trophies.mjs';
import { kitFor } from './lib/kits.mjs';
import { parseArticle } from './lib/wikipedia.mjs';
import { verifyCurrent, apiClubSeasons, startYear } from './lib/verify-current.mjs';
import { verifyAssists } from './lib/verify-assists.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const stats = readJson(path.join(ROOT, 'data/generated/player-stats.json'), null);
if (!stats) { console.error('data/generated/player-stats.json is missing'); process.exit(1); }
// players pulled back to 2002 (tools/fetch-players.mjs --seasons=2002-2026 --out=data/generated/career-pilot.json) replace their since-2010 records
Object.assign(stats.players, readJson(path.join(ROOT, 'data/generated/career-pilot.json'), { players: {} }).players);
// tools/crosscheck.mjs marks players whose seasons have a missing league line (the API has holes) — they stay out until looked at
const crosscheck = readJson(path.join(ROOT, 'data/generated/crosscheck.json'), {});
const RAW = path.join(ROOT, 'data/raw/players'), LISTS = path.join(ROOT, 'data/raw/lists');

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/club-logos.js'), 'utf8') + ';this.L=CLUB_LOGOS', ctx);
const LOGOS = ctx.L;
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\b(fc|cf|afc|sc|ac|as|ss|ssc|rc|rcd|ud|sv|vfl|vfb|fsv|tsg|1)\b/g, ' ').replace(/\s+/g, ' ').trim();
const ALIAS = { 'manchester city': 'Man City', 'manchester united': 'Man United', 'paris saint germain': 'PSG', 'bayern munchen': 'Bayern Munich', 'bayern munich': 'Bayern Munich', 'atletico madrid': 'Atlético Madrid', 'inter': 'Inter Milan', 'milan': 'AC Milan', 'wolves': 'Wolverhampton', 'olympique lyonnais': 'Lyon', 'olympique de marseille': 'Marseille', 'as monaco': 'Monaco' };
const idx = new Map(Object.keys(LOGOS).map(k => [norm(k), k]));
const logoKey = t => { const n = norm(t); return ALIAS[n] || idx.get(n) || [...idx].find(([k]) => k.length > 3 && (n.includes(k) || k.includes(n)))?.[1]; };

const FLAGS = { Argentina: '🇦🇷', Brazil: '🇧🇷', France: '🇫🇷', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Spain: '🇪🇸', Germany: '🇩🇪', Italy: '🇮🇹', Portugal: '🇵🇹', Netherlands: '🇳🇱', Belgium: '🇧🇪', Croatia: '🇭🇷', Uruguay: '🇺🇾', Colombia: '🇨🇴', Mexico: '🇲🇽', USA: '🇺🇸', 'United States': '🇺🇸', Japan: '🇯🇵', Senegal: '🇸🇳', Nigeria: '🇳🇬', Ghana: '🇬🇭', 'Ivory Coast': '🇨🇮', "Cote d'Ivoire": '🇨🇮', Egypt: '🇪🇬', Morocco: '🇲🇦', Cameroon: '🇨🇲', Sweden: '🇸🇪', Denmark: '🇩🇰', Poland: '🇵🇱', Norway: '🇳🇴', Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', Ireland: '🇮🇪', Serbia: '🇷🇸', Chile: '🇨🇱', Switzerland: '🇨🇭', 'Czech Republic': '🇨🇿', Ukraine: '🇺🇦', Turkey: '🇹🇷', 'South Korea': '🇰🇷', 'Korea Republic': '🇰🇷', Algeria: '🇩🇿', Austria: '🇦🇹', Greece: '🇬🇷', Paraguay: '🇵🇾', Ecuador: '🇪🇨', Iceland: '🇮🇸', Russia: '🇷🇺', Australia: '🇦🇺', Hungary: '🇭🇺', Romania: '🇷🇴', Gabon: '🇬🇦', Guinea: '🇬🇳', Mali: '🇲🇱', 'DR Congo': '🇨🇩', Slovakia: '🇸🇰', Slovenia: '🇸🇮', Finland: '🇫🇮', Venezuela: '🇻🇪', Peru: '🇵🇪', 'Costa Rica': '🇨🇷', Tunisia: '🇹🇳', Bosnia: '🇧🇦', 'Bosnia and Herzegovina': '🇧🇦', Armenia: '🇦🇲', Georgia: '🇬🇪', Kosovo: '🇽🇰', Albania: '🇦🇱', 'North Macedonia': '🇲🇰', Montenegro: '🇲🇪', 'Cape Verde Islands': '🇨🇻', 'Burkina Faso': '🇧🇫', Togo: '🇹🇬', Canada: '🇨🇦', Israel: '🇮🇱', Iran: '🇮🇷', 'Saudi Arabia': '🇸🇦' };
const POS = { Attacker: 'Forward', Midfielder: 'Midfielder', Defender: 'Defender', Goalkeeper: 'Goalkeeper' };
const PALETTE = [['#1a3a6b', '#5a8fd4'], ['#6b1a1a', '#e07070'], ['#1a5a3a', '#6fd49a'], ['#5a4a1a', '#e0c25a'], ['#3a1a6b', '#a07ae0'], ['#1a5a5a', '#5ad4d4'], ['#5a1a4a', '#e07ac0'], ['#3a3a3a', '#bdbdbd']];
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const FIRST_SEASON = 2002;   // the earliest season the API has player lines for (Cristiano Ronaldo, Sporting 2002/03); nobody born from 1985 on started earlier

// goals per club: the same club under two spellings or its reserve side ("Monaco" / "AS Monaco", "Real Madrid II") is one row; top 8 by goals
const parent = t => String(t || '').replace(/\s*\(.*?\)\s*/g, ' ').replace(/[\s-]+(B|C|II|III|IV|2|Castilla|U\d\d)$/i, '').replace(/^Jong\s+/i, '').replace(/-2(\s|$)/, '$1').replace(/\s+/g, ' ').trim();
function clubGoalsFor(p) {
  const rows = new Map();
  for (const c of p.clubGoals || []) { const key = logoKey(parent(c.team)) || parent(c.team); rows.set(key, (rows.get(key) || 0) + c.goals); }
  return [...rows].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, n]) => ({ c, n, col: '#444' }));
}
const currentClub = p => { const ys = Object.keys(p.seasons).filter(y => p.seasons[y].club.apps > 0).sort(); const last = p.seasons[ys.at(-1)]; return (last?.clubs || []).slice(-1)[0] || ''; };
// API-Football only has assist data from the 2024/25 season on (before that 50–90% of the lines are empty), so for current players "assists" means assists since then
const ASSISTS_FROM = 2024;
const assistsSince = p => Object.entries(p.seasons).filter(([y]) => Number(y) >= ASSISTS_FROM).reduce((a, [, ss]) => a + ss.club.assists + ss.intl.assists, 0);

// Display name: the roster label comes from Wikidata. Nicknames are fine ("Andy Robertson", "Phil Foden", "Danny Welbeck" — the API has the legal names), but a few labels are
// plainly wrong (a typo, a Greek Α, an extra word). Those are corrected here, by hand, so every change is visible. Anything else the API disagrees with is only reported.
const NAME_FIXES = { 'Andrcu Onana': 'André Onana', 'Αrda Güler': 'Arda Güler', 'Marc Hagit Cucurella': 'Marc Cucurella', 'Juan Mata Pata': 'Juan Mata', 'Sergio Canales Madrazo': 'Sergio Canales', 'Marcos Alonso Mendoza': 'Marcos Alonso', 'Antony dos Santos': 'Antony' };
const tokensOf = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 -]/g, ' ').split(/[\s-]+/).filter(Boolean);
const nameNotes = [];
function displayNameFor(p) {
  if (NAME_FIXES[p.name]) return NAME_FIXES[p.name];
  const homoglyph = /[\u0370-\u03ff\u0400-\u04ff]/.test(p.name);                         // Greek / Cyrillic letters inside a Latin name
  if (homoglyph) nameNotes.push(`${p.name}: contains non-Latin letters — add it to NAME_FIXES`);
  return p.name;
}
// relevance: someone a fan would know — a real stretch in the big five leagues, or a regular for his country
const relevant = p => p.since.big5.apps >= 40 || p.since.intl.apps >= 20;
// players who were not in the deck that is live (git HEAD) must be better known: 100+ big-five games or 40+ caps — so a longer candidate list does not fill the deck with names few people know
let liveNames = new Set();
try { const c = {}; vm.createContext(c); vm.runInContext(execSync('git show HEAD:data/players-modern.js', { cwd: ROOT, encoding: 'utf8', maxBuffer: 50e6 }) + ';this.M=PLAYERS_MODERN', c); liveNames = new Set(c.M.map(x => x.name)); } catch { /* no history: every player counts as new */ }
const wellKnownNewcomer = p => p.since.big5.apps >= 100 || p.since.intl.apps >= 40;
// "Legend" = a name every fan knows: a long stretch at the top (200+ big-five games) with 50+ caps or 10+ trophies, or 80+ caps, or 20+ trophies
const legendWorthy = (p, r) => (p.since.big5.apps >= 200 && (r.intl_caps >= 50 || r.trophies >= 10)) || r.intl_caps >= 80 || r.trophies >= 20;
// every club of the career for the panel: Wikipedia's finished seasons + the API's running season, one row per club (reserve sides and spellings merged).
// club_goals / club_apps list ALL clubs (not just the top few), so the rows add up to the career number minus the national team.
function verifiedClubTables(v) {
  const rows = new Map();
  const add = (team, goals, apps) => { const key = logoKey(parent(team)) || parent(team); const r = rows.get(key) || { g: 0, a: 0 }; r.g += goals || 0; r.a += apps || 0; rows.set(key, r); };
  for (const r of v.finishedRows) add(r.club, r.goals, r.apps);
  for (const [team, st] of Object.entries(v.currentPerClubStats || {})) add(team, st.goals, st.apps);
  const list = key => [...rows].filter(([, r]) => r[key] > 0).sort((a, b) => b[1][key] - a[1][key]).map(([c, r]) => ({ c, n: r[key], col: '#444' }));
  return { club_goals: list('g'), club_apps: list('a') };
}
const SQUAD_NUMBERS = readJson(path.join(LISTS, 'squad-numbers.json'), {});   // { playerId: shirt number } from tools/fetch-squads.mjs
// FotMob (tools/fetch-fotmob.mjs) — the second source for assists
const FOTMOB_DIR = path.join(ROOT, 'data/raw/fotmob'), fmIndex = readJson(path.join(FOTMOB_DIR, 'index.json'), {});
const fotmobOf = name => { const e = fmIndex[name]; return e?.id ? readJson(path.join(FOTMOB_DIR, e.id + '.json'), null) : null; };
const assistNotes = []; const assistStats = { seasons: 0, compared: 0 };
// Transfermarkt (harvested in the browser, see tools/lib/tm-trophies.mjs) — the source for current players' trophies. FotMob is only compared, not used as a gate:
// it repeats honours (Kimpembe 10 Trophées des Champions, Maignan 3 for a club that won it once, Ronaldo 3 Community Shields), so where the two differ by more than TROPHY_TOLERANCE it is listed in data/generated/trophy-disagreements.json for a look
const TM_HARVEST = readJson(path.join(ROOT, 'data/raw/transfermarkt/tm-harvest.json'), null);
const TROPHY_TOLERANCE = 2; const trophyNotes = []; const trophyDisagree = []; const trophyStats = { released: 0 };
const out = []; const skipped = []; const retiredOut = [];   // retiredOut: no longer playing → candidates for the Legends deck (verified against Wikipedia by tools/verify-legends.mjs)
for (const p of Object.values(stats.players)) {
  // "career" is only honest if we asked for every season the player could have played: from 2002 (the API has nothing earlier), or from his 16th birthday year
  const startedBy = Math.max(FIRST_SEASON, Number(String(p.born).slice(0, 4)) + 16);
  const askedForAll = p.fetchFrom !== undefined && p.fetchFrom <= startedBy;
  if (!['ok', 'repaired'].includes(p.quality) || !p.since || !askedForAll) { skipped.push(`${p.name} (${p.quality}${askedForAll ? '' : `, seasons before ${p.fetchFrom} were not pulled`})`); continue; }
  if (crosscheck[p.id]?.status === 'incomplete') { skipped.push(`${p.name} (a season has no league line: ${crosscheck[p.id].problems[0].slice(0, 70)})`); continue; }
  // "Current players" = still playing: games in the running season or the one before (a long injury must not drop a star)
  const lastPlayed = Math.max(0, ...Object.entries(p.seasons).filter(([, ss]) => ss.club.apps + ss.intl.apps > 0).map(([y]) => Number(y)));
  const isCurrent = lastPlayed >= stats.currentSeason - 1;
  if (isCurrent && relevant(p) && !liveNames.has(displayNameFor(p)) && !wellKnownNewcomer(p)) { skipped.push(`${p.name} (new in the deck but not well known: ${p.since.big5.apps} big-five games, ${p.since.intl.apps} caps)`); continue; }
  if (!relevant(p)) { skipped.push(`${p.name} (not well known: ${p.since.big5.apps} big-five games, ${p.since.intl.apps} caps)`); continue; }
  const club = p.since.club, intl = p.since.intl;
  const apps = club.apps + intl.apps; if (apps < (isCurrent ? 150 : 300)) { skipped.push(`${p.name} (only ${apps} games)`); continue; }
  const trophyBody = readJson(path.join(LISTS, `trophies-${p.id}.json`), null);
  if (!trophyBody && !isCurrent) { skipped.push(`${p.name} (no trophies fetched yet)`); continue; }
  if (trophyBody && hasWomensTrophy(trophyBody.response)) { skipped.push(`${p.name} (women's football — not part of this deck)`); continue; }
  const tally = new Map();
  for (const t of trophyBody?.response || []) {
    if (!isMajorTrophy(t)) continue;
    const name = trophyLabel(t);
    tally.set(name, (tally.get(name) || 0) + 1);
  }
  const trophies_list = [...tally].sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ×${c}`);
  if (!trophies_list.length && !isCurrent) { skipped.push(`${p.name} (no trophies)`); continue; }
  // position = the one he is listed in most often
  const posCount = {};
  for (const y of Object.keys(p.seasons)) { const b = readJson(path.join(RAW, `${p.id}-${y}.json`), null); for (const s of b?.response?.[0]?.statistics || []) if (s.games?.position) posCount[s.games.position] = (posCount[s.games.position] || 0) + (s.games.appearences || 0); }
  const pos = POS[Object.entries(posCount).sort((a, b) => b[1] - a[1])[0]?.[0]] || 'Forward';
  const shownName = displayNameFor(p);
  const [color, tc] = PALETTE[hash(shownName) % PALETTE.length];
  const record = {
    name: shownName, pos, nat: p.nationality || '',
    career_goals: club.goals + intl.goals, career_appearances: apps, assists: assistsSince(p),
    intl_caps: intl.apps, intl_goals: intl.goals, trophies: trophies_list.reduce((s, t) => s + Number(t.match(/×(\d+)/)[1]), 0),
    color, tc, initials: shownName.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase(),
    club_goals: clubGoalsFor(p),
    intl_breakdown: { flag: FLAGS[p.nationality] || '🌍', country: p.nationality || '', n: intl.goals },
    kit: kitFor(currentClub(p), shownName, SQUAD_NUMBERS[p.id]),
    trophies_list, apiId: p.id, quality: p.quality
};
  if (isCurrent) {
    // career totals only when two sources stand behind them (see tools/lib/verify-current.mjs); trophies and assists are not released (the API lags new honours and has no assists before 2024/25)
    const wpFile = path.join(ROOT, 'data/raw/wikipedia/legends', shownName.replace(/[^A-Za-z]/g, '_') + '.html');
    const wpParsed = fs.existsSync(wpFile) ? parseArticle(fs.readFileSync(wpFile, 'utf8')) : null;
    const v = verifyCurrent(p, wpParsed, stats.currentSeason, apiClubSeasons(p, RAW), fotmobOf(shownName));
    record.career_goals = v.ok.goals && v.ok.intl ? v.clubGoals + v.intl.goals : null;
    record.career_appearances = v.ok.apps && v.ok.intl ? v.clubApps + v.intl.apps : null;
    record.intl_caps = v.ok.intl ? v.intl.apps : null;
    record.intl_goals = v.ok.intl ? v.intl.goals : null;
    // assists since 2016/17: checked season by season against Wikipedia (games) and API-Football (assists) — see tools/lib/verify-assists-tm.mjs (Transfermarkt) and verify-assists.mjs (FotMob)
    const apiTables = apiClubSeasons(p, RAW);
    // FotMob's numbers (Opta); Transfermarkt (when the harvest is there) and API-Football are witnesses — see tools/lib/verify-assists.mjs
    const va = verifyAssists({ apiTables, apiPlayer: p, wp: wpParsed, fm: fotmobOf(shownName), tm: TM_HARVEST, apiId: p.id });
    record.assists = va.ok ? va.value : null;
    if (!va.ok) assistNotes.push(`${shownName}: ${va.why}`);
    else { record.club_assists = va.clubs.map(c => ({ c: logoKey(parent(c.name)) || parent(c.name), n: c.n, col: '#444' })); record.intl_assists = va.intl; assistStats.seasons += va.seasons; assistStats.compared += va.comparedSeasons; }
    // trophies: Transfermarkt's team titles (a player with none on Transfermarkt stays hidden)
    record.trophies = null; record.trophies_list = [];
    const tmHonours = TM_HARVEST?.players?.[p.id]?.honours;
    if (tmHonours) {
      const tt = tmTrophies(tmHonours), fmTotal = fotmobHonours(fotmobOf(shownName)).length;
      if (tt.total) { record.trophies = tt.total; record.trophies_list = tt.list.map(x => `${x.label} ×${x.n}`); trophyStats.released++; }
      else trophyNotes.push(`${shownName}: no team trophies on Transfermarkt`);
      if (fmTotal && Math.abs(tt.total - fmTotal) > TROPHY_TOLERANCE) trophyDisagree.push({ name: shownName, transfermarkt: tt.total, fotmob: fmTotal });
    }
    const tables = v.finishedRows ? verifiedClubTables(v) : { club_goals: [], club_apps: [] };
    record.club_goals = v.ok.goals ? tables.club_goals : [];
    record.club_apps = v.ok.apps ? tables.club_apps : [];
    // the rows must add up to the career number minus the national team, otherwise the panel would show something that does not match the headline
    const sum = l => l.reduce((a, c) => a + c.n, 0);
    if (record.club_goals.length && sum(record.club_goals) !== v.clubGoals) { nameNotes.push(`${shownName}: club goals add up to ${sum(record.club_goals)}, headline ${v.clubGoals} — per-club goals dropped`); record.club_goals = []; }
    if (record.club_apps.length && sum(record.club_apps) !== v.clubApps) { nameNotes.push(`${shownName}: club games add up to ${sum(record.club_apps)}, headline ${v.clubApps} — per-club games dropped`); record.club_apps = []; }
    record.intl_breakdown = { ...record.intl_breakdown, n: v.intl ? v.intl.goals : 0 };
    record.verified = { goals: v.ok.goals, apps: v.ok.apps, intl: v.ok.intl, assists: va.ok };
    if (record.career_goals === null && record.intl_caps === null) { skipped.push(`${p.name} (numbers not confirmed by two sources: ${v.why || JSON.stringify(v.diag)})`); continue; }
    out.push(record);
  }
  else if (legendWorthy(p, record)) retiredOut.push({ ...record, assists: null, born: p.born, lastPlayed });
  else skipped.push(`${p.name} (retired, but not a name that fits a Legends deck: ${p.since.big5.apps} big-five games, ${intl.apps} caps, ${record.trophies} trophies)`);   // assists before 2024/25 do not exist in the API → left out of the assists category

}
out.sort((a, b) => (b.career_goals || 0) - (a.career_goals || 0));
const js = `// GENERATED by tools/build-hol.mjs on ${new Date().toISOString().slice(0, 10)} from API-Football — do not edit by hand.\n// Goals, assists, appearances, caps: whole career from the first season the API has lines for (2002/03 at the earliest), official matches only (no friendlies). Trophies: whole career.\nconst PLAYERS_MODERN = ${JSON.stringify(out)};\nconst PLAYERS_MODERN_INFO = ${JSON.stringify({ generatedAt: new Date().toISOString(), since: FIRST_SEASON, assistsFrom: ASSISTS_FROM, currentSeason: stats.currentSeason, count: out.length })};\n`;
fs.writeFileSync(path.join(ROOT, 'data/players-modern.js'), js);
retiredOut.sort((a, b) => b.career_goals - a.career_goals);
fs.mkdirSync(path.join(ROOT, 'data/generated'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data/generated/legends-candidates.json'), JSON.stringify(retiredOut));
console.log(`legends candidates (retired, full career): ${retiredOut.length}`);
fs.writeFileSync(path.join(ROOT, 'data/generated/hol-skipped.json'), JSON.stringify(skipped, null, 1));
console.log(`wrote data/players-modern.js — ${out.length} players (${(js.length / 1024).toFixed(0)} KB). skipped ${skipped.length}:`);
console.log('  ' + skipped.slice(0, 40).join('\n  ') + (skipped.length > 40 ? `\n  … and ${skipped.length - 40} more` : ''));
console.log(`assists since 2016/17 confirmed: ${out.filter(p => p.assists > 0).length} players (${assistStats.seasons} FotMob seasons checked against Wikipedia/Transfermarkt, ${assistStats.compared} league/UEFA lines also against API-Football); not confirmed: ${assistNotes.length}`);
fs.writeFileSync(path.join(ROOT, 'data/generated/assist-notes.json'), JSON.stringify(assistNotes, null, 1));
if (assistNotes.length) console.log('  ' + assistNotes.slice(0, 60).join('\n  ') + (assistNotes.length > 60 ? `\n  … ${assistNotes.length - 60} more in data/generated/assist-notes.json` : ''));
fs.writeFileSync(path.join(ROOT, 'data/generated/trophy-disagreements.json'), JSON.stringify(trophyDisagree, null, 1));
console.log(`trophies released (Transfermarkt): ${trophyStats.released} players; no trophies listed: ${trophyNotes.length}; FotMob differs by more than ${TROPHY_TOLERANCE}: ${trophyDisagree.length} (data/generated/trophy-disagreements.json)`);
if (trophyNotes.length) console.log('  ' + trophyNotes.slice(0, 60).join('\n  '));
if (nameNotes.length) console.log('\nnames to look at:\n  ' + nameNotes.join('\n  '));
console.log('\ntop 12 by career goals:\n  ' + out.slice(0, 12).map(p => `${p.name} ${p.career_goals}g ${p.assists}a ${p.career_appearances} games, ${p.trophies} trophies [${p.quality}]`).join('\n  '));
