#!/usr/bin/env node
// Cross-check: does the per-player data (/players?id&season) contain every league line the API's own top-scorer lists say exists?
//
//   node tools/crosscheck.mjs [--stats=data/generated/player-stats.json,data/generated/career-pilot.json] [--json=data/generated/crosscheck.json]
//
// Why: the API sometimes leaves a whole competition out of a player's season (Rooney 2011–13: no Premier League line at all, so 103 goals instead of ~313).
// The duplicate/impossible-number checks cannot see a MISSING line. The top-scorer lists (data/raw/lists/topscorers-<league>-<season>.json) are fetched separately and
// give, for the 20 best scorers of every big-five league and season, their league goals — if a player is in that list and his own season has no line with the same goals,
// the season is incomplete. Players with an incomplete season are marked and kept out of the game until fixed (re-pulled, or an override is added by hand).
//
// Makes no API requests.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isFriendly, isYouthOrOlympic, isNationalTeam } from './lib/aggregate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const RAW = path.join(ROOT, 'data/raw/players'), LISTS = path.join(ROOT, 'data/raw/lists');

const players = {};
for (const f of String(args.stats || 'data/generated/player-stats.json,data/generated/career-pilot.json').split(',')) Object.assign(players, readJson(path.join(ROOT, f), { players: {} }).players);

// league goals the API itself lists: { "<playerId>|<season>": [{ league, goals, apps, team }] }
const listed = {};
for (const f of fs.readdirSync(LISTS).filter(f => /^topscorers-(39|140|135|78|61)-\d{4}\.json$/.test(f))) {
  const [, league, season] = f.match(/topscorers-(\d+)-(\d{4})/);
  for (const r of readJson(path.join(LISTS, f), { response: [] }).response || []) {
    const s = r.statistics?.[0]; if (!s) continue;
    (listed[`${r.player.id}|${season}`] ||= []).push({ league: Number(league), goals: s.goals?.total || 0, apps: s.games?.appearences || 0, team: s.team?.name });
  }
}

// Test 2 — a club season with cup/European games but no domestic-league line at all. The top-scorer lists cannot catch this
// (they have the same holes: the API has no Manchester United league games for 2011–13, so Rooney's 27 goals are in neither place).
const LEAGUE_IDS = new Set((readJson(path.join(LISTS, 'leagues-type-league.json'), { response: [] }).response || []).map(l => l.league.id));
if (!LEAGUE_IDS.size) console.log('(no leagues-type-league.json — test 2 skipped)');

const CUPLIKE = /cup|copa|coupe|pokal|ta[cç]a|coppa|beker|champions|europa|conference|qualif|super ?cup|supercopa|community shield|troph|intercontinental|club world|finalissima|play-?off|promotion|relegation|olympic|u-?\d{2}/i;
const report = {}; let checked = 0, ok = 0, missingLeagueSeasons = 0;
for (const p of Object.values(players)) {
  const problems = [];
  for (const season of Object.keys(p.seasons)) {
    if (!LEAGUE_IDS.size) break;
    const lines = (readJson(path.join(RAW, `${p.id}-${season}.json`), null)?.response?.[0]?.statistics || [])
      .filter(l => l.team?.name && !isFriendly(l.league?.name) && !isYouthOrOlympic(l.team?.name) && !isNationalTeam(l.team?.name, p.nationality));   // lines without a team are academy/unknown rows
    // a line is a league line when the API says so (post-2010 ids) or, failing that, when its name is not obviously a cup / European / super-cup competition
    const isLeague = l => LEAGUE_IDS.has(l.league?.id) || !CUPLIKE.test(l.league?.name || '');
    const leagueApps = lines.filter(isLeague).reduce((a, l) => a + (l.games?.appearences || 0), 0);
    const cupApps = lines.filter(l => !isLeague(l)).reduce((a, l) => a + (l.games?.appearences || 0), 0);
    if (leagueApps === 0 && cupApps >= 3) { problems.push(`${season}: ${cupApps} cup/European games but no domestic-league line (${[...new Set(lines.map(l => l.team?.name))].join(', ')})`); missingLeagueSeasons++; }
  }
  for (const season of Object.keys(p.seasons)) {
    const want = listed[`${p.id}|${season}`]; if (!want) continue;
    const lines = readJson(path.join(RAW, `${p.id}-${season}.json`), null)?.response?.[0]?.statistics || [];
    for (const w of want) {
      checked++;
      const mine = lines.filter(l => l.league?.id === w.league);
      const myGoals = mine.reduce((a, l) => a + (l.goals?.total || 0), 0);
      if (!mine.length) problems.push(`${season}: the list has ${w.goals} league goals for ${w.team}, but the player's data has no line for that league`);
      else if (myGoals !== w.goals) problems.push(`${season}: list says ${w.goals} league goals, player data adds up to ${myGoals}`);
      else ok++;
    }
  }
  report[p.id] = { name: p.name, born: p.born, status: problems.length ? 'incomplete' : 'verified-or-unchecked', problems };
}

const bad = Object.values(report).filter(r => r.status === 'incomplete');
const confirmed = Object.entries(report).filter(([id, r]) => r.status !== 'incomplete' && Object.keys(players[id].seasons).some(s => listed[`${id}|${s}`])).length;
console.log(`${Object.keys(players).length} players · ${checked} season/league lines compared with the top-scorer lists · ${ok} match exactly`);
console.log(`${confirmed} players have at least one season confirmed by the lists and no problems · ${bad.length} players have a problem (${missingLeagueSeasons} seasons with cup/Europe games but no league line)\n`);
for (const r of bad.sort((a, b) => b.problems.length - a.problems.length).slice(0, 40)) console.log(`${r.name.padEnd(24)} ${r.problems.length}× — ${r.problems[0]}`);
if (args.json) fs.writeFileSync(path.resolve(ROOT, args.json), JSON.stringify(report));
