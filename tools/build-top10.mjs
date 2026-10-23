#!/usr/bin/env node
// Builds data/top10-api.js (new Top 10 boards) from the cached API answers. Makes no API requests.
//
//   node tools/build-top10.mjs              builds the boards (and lists players the top lists mention that we have not pulled yet)
//
// Boards (all numbers come from API-Football; the "last 3 seasons" ones count BIG-FIVE LEAGUE games only, because that is where the data is clean):
//   now      This Season        goals · assists · yellow cards                      (top-20 lists of the five leagues, merged)
//   last3    Last 3 Seasons     goals · assists · goals+assists · penalties · yellow cards · minutes
//   records  Since 2010         Golden Boots · league titles · stadiums · trophies

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { isMajorTrophy, hasWomensTrophy } from './lib/trophies.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LISTS = path.join(ROOT, 'data/raw/lists');
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const stats = readJson(path.join(ROOT, 'data/generated/player-stats.json'), null);
if (!stats) { console.error('data/generated/player-stats.json is missing — run tools/fetch-players.mjs first'); process.exit(1); }
Object.assign(stats.players, readJson(path.join(ROOT, 'data/generated/career-pilot.json'), { players: {} }).players);   // the career pulls replace the 2010-only records
const CURRENT = stats.currentSeason;
const LEAGUES = { 39: 'Premier League', 140: 'La Liga', 135: 'Serie A', 78: 'Bundesliga', 61: 'Ligue 1' };
const seasonLabel = y => `${y}/${String(y + 1).slice(2)}`;
const L3 = [CURRENT - 2, CURRENT - 1, CURRENT];

// ── club logo keys (so a board row can show the badge) ──
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/club-logos.js'), 'utf8') + ';this.L=CLUB_LOGOS', ctx);
const LOGOS = ctx.L;
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\b(fc|cf|afc|sc|ac|as|ss|ssc|rc|rcd|ud|sv|vfl|vfb|fsv|tsg|1)\b/g, ' ').replace(/\s+/g, ' ').trim();
const TEAM_ALIAS = { 'manchester city': 'Man City', 'manchester united': 'Man United', 'newcastle': 'Newcastle', 'paris saint germain': 'PSG', 'bayern munchen': 'Bayern Munich', 'bayern munich': 'Bayern Munich',
  'atletico madrid': 'Atlético Madrid', 'borussia dortmund': 'Borussia Dortmund', 'bayer leverkusen': 'Bayer Leverkusen', 'inter': 'Inter Milan', 'ac milan': 'AC Milan', 'milan': 'AC Milan', 'napoli': 'Napoli',
  'wolves': 'Wolverhampton', 'athletic club': 'Athletic Club', 'real betis': 'Real Betis', 'olympique lyonnais': 'Lyon', 'olympique de marseille': 'Marseille', 'as monaco': 'Monaco', 'monaco': 'Monaco' };
const CLUB_DISPLAY = { 'PSG': 'Paris Saint-Germain', 'Man City': 'Manchester City', 'Man United': 'Manchester United', 'Newcastle': 'Newcastle United', 'Atlético Madrid': 'Atlético Madrid' };
const logoIndex = new Map(Object.keys(LOGOS).map(k => [norm(k), k]));
function logoKey(team) {
  const n = norm(team); if (!n) return undefined;
  return TEAM_ALIAS[n] || logoIndex.get(n) || [...logoIndex].find(([k]) => n.includes(k) || k.includes(n))?.[1];
}

// ── names ──
// letters that do not decompose under NFD (ø, æ, ß …) are transliterated the same way the game does it (t10Norm in index.html)
const strip = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ø/g, 'o').replace(/æ/g, 'ae').replace(/ß/g, 'ss').replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/ł/g, 'l').replace(/đ/g, 'd').replace(/[^a-z0-9' -]/g, '').replace(/\s+/g, ' ').trim();
function aliasesFor(display, extra = []) {
  const full = strip(display), parts = full.split(' ');
  const set = new Set([full, ...extra.map(strip)]);
  if (parts.length > 1) { set.add(parts[parts.length - 1]); set.add(parts.slice(-2).join(' ')); if (parts[0].length >= 4) set.add(parts[0]); }
  return [...set].filter(a => a && a.length >= 3 && a !== full).slice(0, 8);
}
const byApiId = new Map(Object.values(stats.players).map(p => [p.id, p]));
function displayName(apiPlayer) {   // roster label (Wikidata) when we have the player, otherwise build one from the API's first/last name
  const known = byApiId.get(apiPlayer.id); if (known) return known.name;
  return nameFromApi(apiPlayer);
}
function nameFromApi(apiPlayer) {
  const n = String(apiPlayer.name || '').trim(), givenNames = String(apiPlayer.firstname || '').split(' ').filter(Boolean);
  if (/^[A-ZÀ-Ý]\.\s/.test(n) && givenNames.length) {
    // "R. Cherki" with first names "Mathis Rayan" → pick the given name that starts with R (he plays under "Rayan", not "Mathis")
    const initial = n[0].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const first = givenNames.find(g => g.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().startsWith(initial)) || givenNames[0];
    return `${first} ${n.replace(/^\S+\s+/, '')}`.trim();
  }
  return n || `${first} ${apiPlayer.lastname || ''}`.trim();
}

// players pulled only because a top list mentioned them carry the name we built at that time — rebuild it with the current rule
const apiById = new Map();
for (const f of fs.readdirSync(LISTS).filter(f => /^top(scorers|assists|yellow|red)/.test(f))) for (const r of readJson(path.join(LISTS, f), { response: [] }).response || []) apiById.set(r.player.id, r.player);
for (const p of Object.values(stats.players)) if (p.since?.from >= 2024 && apiById.has(p.id)) p.name = nameFromApi(apiById.get(p.id));

const out = { now: {}, last3: {}, records: {} };
const missing = new Map();   // players the lists mention that we have no statistics for yet

const entryFor = (name, value, club, aliasExtra) => ({ name, value, aliases: aliasesFor(name, aliasExtra), ...(club ? { club } : {}) });
const trapFor = (e, what) => ({ name: e.name, aliases: e.aliases, note: `🔴 ${e.name} — <b>${typeof e.value === 'number' ? e.value.toLocaleString('en') : e.value}</b> ${what}, just outside the top 10.` });
function board(label, unit, rows, what) {            // rows already sorted, best first
  const players = rows.slice(0, 10), traps = rows.slice(10, 18).map(r => trapFor(r, what));
  return { label, unit, players, traps };
}

// ═══ NOW: merged top-20 lists of the five leagues, current season ═══
function mergedList(prefix, valueOf) {
  const rows = new Map();
  for (const id of Object.keys(LEAGUES)) {
    const body = readJson(path.join(LISTS, `${prefix}-${id}-${CURRENT}.json`), null); if (!body) continue;
    for (const r of body.response || []) {
      const v = valueOf(r.statistics?.[0]); if (!(v > 0)) continue;
      const cur = rows.get(r.player.id);
      if (!cur || v > cur.v) rows.set(r.player.id, { v, club: r.statistics[0].team?.name, player: r.player });
      if (!byApiId.has(r.player.id)) missing.set(r.player.id, r.player);
    }
  }
  return [...rows.values()].sort((a, b) => b.v - a.v).map(r => entryFor(displayName(r.player), r.v, logoKey(r.club)));
}
const nowGoals = mergedList('topscorers', s => s?.goals?.total), nowAssists = mergedList('topassists', s => s?.goals?.assists), nowYellow = mergedList('topyellow', s => s?.cards?.yellow);
if (nowGoals.length >= 10) out.now.goals = board(`Top Scorers ${seasonLabel(CURRENT)} — Big Five Leagues`, 'Goals', nowGoals, 'goals');
if (nowAssists.length >= 10) out.now.assists = board(`Most Assists ${seasonLabel(CURRENT)} — Big Five Leagues`, 'Assists', nowAssists, 'assists');
if (nowYellow.length >= 10) out.now.cards = board(`Most Yellow Cards ${seasonLabel(CURRENT)} — Big Five Leagues`, 'Yellow cards', nowYellow, 'yellow cards');

// the last three seasons' lists name every player who could be in a "last 3 seasons" top 10 — make sure we have all of them
const listed = new Map();   // goals + assists the top-20 lists already show for each missing player (a cheap way to rank who could still reach a top 10)
for (const y of L3) for (const id of Object.keys(LEAGUES)) for (const pre of ['topscorers', 'topassists']) {
  const body = readJson(path.join(LISTS, `${pre}-${id}-${y}.json`), null);
  for (const r of body?.response || []) if (!byApiId.has(r.player.id)) {
    missing.set(r.player.id, r.player);
    listed.set(r.player.id, (listed.get(r.player.id) || 0) + (r.statistics[0].goals?.total || 0) + (r.statistics[0].goals?.assists || 0));
  }
}

// ═══ LAST 3 SEASONS: big-five league games only ═══
const complete = Object.values(stats.players).filter(p => p.last3?.big5 && Object.keys(p.seasons).some(y => L3.includes(Number(y))));
function l3(valueOf) {
  return complete.map(p => ({ p, v: valueOf(p.last3.big5) })).filter(r => r.v > 0).sort((a, b) => b.v - a.v)
    .map(r => { const last = Object.keys(r.p.seasons).sort().pop(); return entryFor(r.p.name, r.v, logoKey(r.p.seasons[last]?.clubs?.[0])); });
}
const win = `${seasonLabel(L3[0])} → now`;
const g = l3(b => b.goals), a = l3(b => b.assists), ga = l3(b => b.goals + b.assists);
if (g.length >= 10) out.last3.goals = board(`Most League Goals, ${win} — Big Five`, 'Goals', g, 'goals');
if (a.length >= 10) out.last3.assists = board(`Most League Assists, ${win} — Big Five`, 'Assists', a, 'assists');
if (ga.length >= 10) out.last3.contrib = board(`Most Goals + Assists, ${win} — Big Five`, 'Goals + assists', ga, 'goal contributions');

// ═══ RECORDS SINCE 2010 ═══
// Golden Boots: the player at the top of each big-five league's scorers list, every completed season (ties share it)
const boots = new Map();
for (let y = 2010; y < CURRENT; y++) for (const id of Object.keys(LEAGUES)) {
  const body = readJson(path.join(LISTS, `topscorers-${id}-${y}.json`), null); const list = body?.response || []; if (!list.length) continue;
  const top = list[0].statistics[0].goals.total;
  for (const r of list) if (r.statistics[0].goals.total === top) {
    const cur = boots.get(r.player.id) || { n: 0, player: r.player, club: r.statistics[0].team?.name }; cur.n++; cur.club = r.statistics[0].team?.name; boots.set(r.player.id, cur);
  }
}
const bootRows = [...boots.values()].sort((a, b) => b.n - a.n).map(r => entryFor(displayName(r.player), r.n, logoKey(r.club)));
if (bootRows.length >= 10) out.records.boots = board('Most League Golden Boots Since 2010 — Big Five', 'Golden Boots', bootRows, 'golden boots');

// League titles per club (champion = rank 1 in a completed season)
const titles = new Map();
for (let y = 2010; y < CURRENT; y++) for (const id of Object.keys(LEAGUES)) {
  const raw = readJson(path.join(LISTS, `standings-${id}-${y}.json`), null)?.response?.[0]?.league?.standings?.[0]?.[0]?.team?.name; if (!raw) continue;
  const key = logoKey(raw) || raw;                       // canonical club ("Bayern München" and "Bayern Munich" are the same club)
  const cur = titles.get(key) || { n: 0, names: new Set() }; cur.n++; cur.names.add(raw); titles.set(key, cur);
}
const points = new Map();   // total league points since 2010 (all five leagues) — breaks ties between clubs with the same number of titles
for (let y = 2010; y < CURRENT; y++) for (const id of Object.keys(LEAGUES))
  for (const r of readJson(path.join(LISTS, `standings-${id}-${y}.json`), null)?.response?.[0]?.league?.standings?.[0] || []) { const k = logoKey(r.team.name) || r.team.name; points.set(k, (points.get(k) || 0) + (r.points || 0)); }
const titleRows = [...titles].sort((a, b) => b[1].n - a[1].n || (points.get(b[0]) || 0) - (points.get(a[0]) || 0)).map(([key, v]) => entryFor(CLUB_DISPLAY[key] || key, v.n, LOGOS[key] ? key : undefined, [...v.names, key]));
if (titleRows.length >= 10) out.records.titles = board('Most League Titles Since 2010 — Big Five Leagues (ties broken by league points)', 'Titles', titleRows, 'league titles');

// Stadiums
const venues = new Map();
for (const id of Object.keys(LEAGUES)) for (const r of readJson(path.join(LISTS, `teams-${id}-${CURRENT}.json`), { response: [] }).response)
  if (r.venue?.capacity) venues.set(r.venue.id, { name: r.venue.name, cap: r.venue.capacity, team: r.team.name });
const VENUE_ALIAS = { 'giuseppe meazza': ['san siro', 'meazza', 'san siro stadium'], 'santiago bernabeu': ['bernabeu', 'santiago bernabeu'], 'camp nou': ['camp nou', 'nou camp', 'spotify camp nou'], 'signal iduna park': ['westfalenstadion', 'signal iduna'], 'allianz arena': ['allianz'], 'old trafford': ['old trafford'], 'stade velodrome': ['velodrome'], 'olimpico': ['olimpico'], 'wanda metropolitano': ['metropolitano', 'civitas metropolitano'] };
const venueRows = [...venues.values()].sort((a, b) => b.cap - a.cap).map(v => {
  const extra = Object.entries(VENUE_ALIAS).filter(([k]) => strip(v.name).includes(k)).flatMap(([, al]) => al);
  const toks = strip(v.name).split(' ').filter(t => t.length >= 6 && !['stadium', 'stadion', 'stadio', 'estadio', 'olympic', 'olimpico', 'arena', 'park'].includes(t));
  return { ...entryFor(v.name, v.cap, logoKey(v.team), [...extra, ...toks]), };
});
// Stadium capacities are NOT published: the API's figures differ from the official ones (Old Trafford, Camp Nou…) by thousands.
void venueRows;

// Trophies: major honours won by the players we hold (league titles, cups, super cups, Europe, club world cups and national-team tournaments)
const trophyRows = [];
for (const p of Object.values(stats.players)) {
  const t = readJson(path.join(LISTS, `trophies-${p.id}.json`), null)?.response || [];
  if (hasWomensTrophy(t)) continue;           // the roster query had no gender filter — three women's-football players slipped in
  const won = t.filter(isMajorTrophy);        // rules (youth, women's, exhibitions, season-less summary rows …) live in tools/lib/trophies.mjs
  if (won.length) trophyRows.push({ name: p.name, value: won.length, club: logoKey(Object.values(p.seasons).slice(-1)[0]?.clubs?.[0]) });
}
const trophyEntries = trophyRows.sort((a, b) => b.value - a.value).map(r => entryFor(r.name, r.value, r.club));
if (trophyEntries.length >= 10) out.records.trophies = board('Most Trophies Won — Players Born 1985 or Later', 'Trophies', trophyEntries, 'trophies');

// ── write ──
const META = {
  now:     { name: `This Season ${seasonLabel(CURRENT)}`, badge: 'NOW', blurb: 'Live leaders — updated every week' },
  last3:   { name: 'Last 3 Seasons',                       badge: '3Y',  blurb: 'Big five leagues · refreshed weekly' },
  records: { name: 'Records Since 2010',                   badge: 'REC', blurb: 'Golden Boots, league titles, trophies' }
};
let js = `// GENERATED by tools/build-top10.mjs on ${new Date().toISOString().slice(0, 10)} from API-Football — do not edit by hand.\n// Season ${seasonLabel(CURRENT)} is in progress: the "now" and "last3" boards move every week.\n`;
const published = [];
for (const k of Object.keys(out)) {
  if (!Object.keys(out[k]).length) continue;
  js += `TOP10_DATA[${JSON.stringify(k)}] = ${JSON.stringify({ ...META[k], ...out[k] })};\n`;
  published.push(`${k}: ${Object.keys(out[k]).join(', ')}`);
}
js += `const TOP10_API_INFO = ${JSON.stringify({ generatedAt: new Date().toISOString(), currentSeason: CURRENT, meta: META })};\n`;
fs.writeFileSync(path.join(ROOT, 'data/top10-api.js'), js);
console.log('wrote data/top10-api.js\n  ' + published.join('\n  '));
for (const [k, b] of Object.entries(out)) for (const [s, v] of Object.entries(b)) console.log(`\n${k}/${s} — ${v.label}\n  ` + v.players.map((p, i) => `${i + 1}. ${p.name} ${p.value}`).join(' · '));

// players the lists mention that we have no statistics for → fetch them with --extra
const extra = [...missing.values()].filter(p => p.birth?.date).sort((a, b) => (listed.get(b.id) || 0) - (listed.get(a.id) || 0)).map(p => ({ name: displayName(p), born: p.birth.date, id: p.id, listed: listed.get(p.id) || 0 }));
fs.writeFileSync(path.join(ROOT, 'tools/extra-players.json'), JSON.stringify(extra, null, 1));
console.log(`\n${extra.length} players appear in the top lists but have no statistics yet → tools/extra-players.json (fetch with: --extra)`);
