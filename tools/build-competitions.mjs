#!/usr/bin/env node
// Per-competition career numbers for the Auction / Closest Wins categories ("Premier League forwards — goals", "Champions League goalscorers" …).
//
//   node tools/build-competitions.mjs --fetch      downloads the missing Wikipedia pages first (one every 3 s), then builds
//   node tools/build-competitions.mjs              builds from the cached pages
//
// Sources, and why:
//   Premier League / La Liga / Serie A / Bundesliga   Wikipedia's career tables, season by season (the "Division" column) — exact division names, and they reach back before 2002,
//                                                     so Rooney, Henry, Lampard … are covered. Checked against known records (Rooney 208, Henry 175, Lampard 177, Gerrard 120).
//   Champions League                                  API-Football (since 2002/03) checked against Wikipedia's all-time top-scorers list; a player only gets a number when both agree.
// The running season is added from the API (cached, refreshed by tools/weekly.sh), so the numbers move every week.
// Writes data/competitions.js = COMP_STATS { "<display name>": { pl:{a,g}, ll:{a,g}, sa:{a,g}, bl:{a,g}, ucl:{a,g} } }.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { fetchArticle, parseArticle, leagueTotals } from './lib/wikipedia.mjs';
import { findDuplicateDrops, isFriendly, isYouthOrOlympic } from './lib/aggregate.mjs';
import { verifyCurrent, apiClubSeasons } from './lib/verify-current.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const DIR = path.join(ROOT, 'data/raw/wikipedia/legends');          // the same page cache the Legends check uses
const TITLE_FILE = path.join(ROOT, 'data/raw/wikipedia/titles.json');
const RAW = path.join(ROOT, 'data/raw/players');
fs.mkdirSync(DIR, { recursive: true });
const fileFor = name => path.join(DIR, name.replace(/[^A-Za-z]/g, '_') + '.html');

// every player the game can show
const ctx = {}; vm.createContext(ctx);
const load = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
vm.runInContext(load('data/players.js') + ';' + (fs.existsSync(path.join(ROOT, 'data/legends-extra.js')) ? load('data/legends-extra.js') : '') + ';' + load('data/players-modern.js') + ';this.L=PLAYERS;this.M=PLAYERS_MODERN', ctx);
const everyone = new Map();                                          // name → { name, apiId? }
for (const p of ctx.L) everyone.set(p.name, { name: p.name, apiId: p.apiId });
for (const p of ctx.M) everyone.set(p.name, { name: p.name, apiId: p.apiId });
// the 2000s-era deck (tools/build-era.mjs): its Wikipedia pages are cached by Wikidata id, so they are copied under the player's name once
if (fs.existsSync(path.join(ROOT, 'data/players-era.js'))) {
  vm.runInContext(load('data/players-era.js') + ';this.E=PLAYERS_ERA', ctx);
  const report = readJson(path.join(ROOT, 'data/generated/era-report.json'), []);
  for (const p of ctx.E) {
    if (!everyone.has(p.name)) everyone.set(p.name, { name: p.name, apiId: p.verified?.apiId });
    const src = report.find(r => r.name === p.name && r.qid)?.qid;
    const dst = fileFor(p.name);
    if (src && !fs.existsSync(dst) && fs.existsSync(path.join(ROOT, 'data/raw/wikipedia/era', src + '.html'))) fs.copyFileSync(path.join(ROOT, 'data/raw/wikipedia/era', src + '.html'), dst);
  }
}

// Wikipedia titles: the hand-made Legends keep their own spelling; everybody else comes from Wikidata (enwiki sitelink of the roster's QID)
const stats = { ...readJson(path.join(ROOT, 'data/generated/player-stats.json'), { players: {} }).players, ...readJson(path.join(ROOT, 'data/generated/career-pilot.json'), { players: {} }).players };
const byApi = new Map(Object.values(stats).map(p => [p.id, p]));
const roster = readJson(path.join(ROOT, 'tools/roster-candidates.json'), []);
const titles = readJson(TITLE_FILE, {});
const TITLES = { 'Ronaldo Nazário': 'Ronaldo_(Brazilian_footballer)', 'Marcelo': 'Marcelo_(footballer,_born_1988)', 'Xavi': 'Xavi_Hernández' };
const qidOf = e => { const sp = e.apiId && byApi.get(e.apiId); return roster.find(r => r.name === (sp?.name || e.name) && (!sp || r.born === sp.born))?.qid; };

if (args.fetch) {
  const need = [...everyone.values()].filter(e => !titles[e.name] && !TITLES[e.name] && !fs.existsSync(fileFor(e.name))).map(e => ({ e, q: qidOf(e) })).filter(x => x.q);
  for (let i = 0; i < need.length; i += 50) {
    const chunk = need.slice(i, i + 50);
    const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${chunk.map(x => x.q).join('|')}&props=sitelinks&sitefilter=enwiki&format=json`, { headers: { 'User-Agent': 'FootballRoyalQuiz/1.0 (personal quiz project; low-volume)' } });
    const j = await r.json();
    for (const x of chunk) { const t = j.entities?.[x.q]?.sitelinks?.enwiki?.title; if (t) titles[x.e.name] = t.replace(/ /g, '_'); }
    await sleep(1500);
  }
  fs.writeFileSync(TITLE_FILE, JSON.stringify(titles, null, 1));
  let n = 0;
  for (const e of everyone.values()) {
    if (fs.existsSync(fileFor(e.name)) && fs.statSync(fileFor(e.name)).size > 50000) continue;
    const title = TITLES[e.name] || titles[e.name]; if (!title) continue;
    try { fs.writeFileSync(fileFor(e.name), await fetchArticle(title)); n++; if (n % 25 === 0) console.log(`downloaded ${n} pages…`); }
    catch (err) { console.log('could not download', e.name, '—', err.message); }
    await sleep(1500);
  }
  console.log(`downloaded ${n} pages`);
}

const CURRENT = readJson(path.join(ROOT, 'data/generated/player-stats.json'), {}).currentSeason || new Date().getUTCFullYear();
// Wikipedia gives every finished season; the running season comes from the API so it moves every week (Wikipedia's current-season row is ignored — it lags behind).
const LEAGUE_IDS = { 39: 'pl', 140: 'll', 135: 'sa', 78: 'bl' };
function apiCurrentSeason(apiId) {
  const t = {};
  const body = readJson(path.join(RAW, `${apiId}-${CURRENT}.json`), null);
  for (const l of body?.response?.[0]?.statistics || []) {
    const k = LEAGUE_IDS[l.league?.id]; if (!k) continue;
    t[k] ||= { a: 0, g: 0 }; t[k].a += l.games?.appearences || 0; t[k].g += l.goals?.total || 0;
  }
  return t;
}
const finishedRows = rows => (rows || []).filter(r => Number(String(r.season).slice(0, 4)) < CURRENT);

// Champions League from the API lines (since 2002/03), duplicates repaired the same way as everywhere else
const UCL = /^(UEFA )?Champions League$/;
function uclFromApi(apiId) {
  const p = byApi.get(apiId); if (!p) return null;
  const raw = {};
  for (const y of Object.keys(p.seasons)) raw[y] = readJson(path.join(RAW, `${p.id}-${y}.json`), null)?.response?.[0]?.statistics || [];
  const { drops } = findDuplicateDrops(raw);
  const t = { a: 0, g: 0 };
  for (const [y, lines] of Object.entries(raw)) lines.forEach((l, i) => {
    if (drops[y]?.has(i) || isFriendly(l.league?.name) || isYouthOrOlympic(l.team?.name) || !UCL.test(l.league?.name || '')) return;
    t.a += l.games?.appearences || 0; t.g += l.goals?.total || 0;
  });
  const startedBy = Math.max(2002, Number(String(p.born).slice(0, 4)) + 16);
  return p.fetchFrom !== undefined && p.fetchFrom <= startedBy && Number(String(p.born).slice(0, 4)) >= 1985 ? t : null;   // only complete careers
}

// Champions League: Wikipedia's all-time list (top ~55) is the second source. A player gets a number only when the API agrees (the API may be 0–4 goals ahead: the list lags a matchday).
const UCL_LIST_FILE = path.join(ROOT, 'data/raw/wikipedia/ucl-top-scorers.html');
if (args.fetch || !fs.existsSync(UCL_LIST_FILE)) fs.writeFileSync(UCL_LIST_FILE, await fetchArticle('List_of_UEFA_Champions_League_top_scorers'));
const strip = h => h.replace(/<sup[\s\S]*?<\/sup>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();
const keyName = n => String(n).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
const uclList = new Map();
{
  const html = fs.readFileSync(UCL_LIST_FILE, 'utf8');
  const table = [...html.matchAll(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/g)].map(m => m[1])[0];
  for (const m of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const cells = [...m[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map(c => strip(c[1]));
    // tied players share one rank cell (rowspan), so their rows start at the player name
    if (/^\d+$/.test(cells[0]) && /^\d+$/.test(cells[2])) uclList.set(keyName(cells[1]), { g: Number(cells[2]), a: Number(cells[3]) });
    else if (!/^\d+$/.test(cells[0]) && /^\d+$/.test(cells[1]) && /^\d+$/.test(cells[2]) && cells.length >= 5) uclList.set(keyName(cells[0]), { g: Number(cells[1]), a: Number(cells[2]) });
  }
}

const uclThisSeason = apiId => (readJson(path.join(RAW, `${apiId}-${CURRENT}.json`), null)?.response?.[0]?.statistics || []).filter(l => UCL.test(l.league?.name || '') && !isFriendly(l.league?.name)).reduce((a, l) => a + (l.goals?.total || 0), 0);
const out = {}; let withWiki = 0, withUcl = 0; const missing = [], dropped = [];
const currentNames = new Set(ctx.M.map(p => p.name));
for (const e of everyone.values()) {
  const entry = {};
  const f = fileFor(e.name);
  if (fs.existsSync(f)) {
    const wp = parseArticle(fs.readFileSync(f, 'utf8'));
    const rec = e.apiId ? byApi.get(e.apiId) : null;
    // a league number is released only when the Wikipedia table is trustworthy: for API players the same two-source check as the career numbers, for the hand-made Legends the table must add up
    let trusted = false;
    if (rec) trusted = verifyCurrent(rec, wp, CURRENT, apiClubSeasons(rec, RAW)).ok.goals;
    else trusted = !!wp.career && wp.seasonRows.length > 0 && Math.abs(wp.seasonRows.reduce((a, r) => a + r.goals, 0) - wp.career.goals) <= 1;
    if (trusted) {
      const t = leagueTotals(finishedRows(wp.leagueRows));
      const now = rec ? apiCurrentSeason(e.apiId) : {};
      for (const k of ['pl', 'll', 'sa', 'bl']) { const a = (t[k]?.a || 0) + (now[k]?.a || 0), g = (t[k]?.g || 0) + (now[k]?.g || 0); if (a || g) entry[k] = { a, g }; }
      withWiki++;
    } else dropped.push(e.name);
  } else missing.push(e.name);
  if (e.apiId) {
    const u = uclFromApi(e.apiId), w = uclList.get(keyName(e.name));
    // the list lags by matchdays: the API may be ahead by at most the Champions League goals the player scored THIS season (+1)
    if (u && w && u.g >= w.g - 1 && u.g <= w.g + uclThisSeason(e.apiId) + 1) { entry.ucl = { a: Math.max(u.a, w.a), g: Math.max(u.g, w.g) }; withUcl++; }
    else if (u && w) dropped.push(e.name + ' (Champions League: API ' + u.g + ', Wikipedia list ' + w.g + ')');
  }
  if (Object.keys(entry).length) out[e.name] = entry;
}
const js = `// GENERATED by tools/build-competitions.mjs on ${new Date().toISOString().slice(0, 10)} — per-competition career numbers for the Auction / Closest Wins categories.
// pl / ll / sa / bl = Premier League, La Liga, Serie A, Bundesliga (Wikipedia career tables, season by season). ucl = Champions League since 2002/03 (API-Football; only players whose whole career falls in that window).
// a = appearances, g = goals.
const COMP_STATS = ${JSON.stringify(out)};
`;
fs.writeFileSync(path.join(ROOT, 'data/competitions.js'), js);
console.log(`${Object.keys(out).length} players with competition numbers · league numbers released: ${withWiki} of ${everyone.size} (not released: ${dropped.length}) · Champions League numbers (two sources): ${withUcl} · no page cached: ${missing.length}`);
if (missing.length) console.log('  no page: ' + missing.slice(0, 30).join(', ') + (missing.length > 30 ? ' …' : ''));
