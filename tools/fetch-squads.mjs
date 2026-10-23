#!/usr/bin/env node
// Shirt numbers for the "Current players" cards: one /players/squads request per club (about 100–150 requests), cached in data/raw/lists/.
//
//   node --env-file=.env tools/fetch-squads.mjs [--reserve=500] [--refresh]
//
// Writes data/raw/lists/squad-numbers.json = { "<playerId>": <number> } — tools/build-hol.mjs puts the number on the player's kit.
// Players are looked up by the club they last played for (taken from their latest season in the cached statistics).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNationalTeam } from './lib/aggregate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const KEY = process.env.APISPORTS_KEY;
if (!KEY) { console.error('No key — run with: node --env-file=.env tools/fetch-squads.mjs'); process.exit(1); }
const RESERVE = Number(args.reserve ?? 500);
const LISTS = path.join(ROOT, 'data/raw/lists'), RAW = path.join(ROOT, 'data/raw/players');
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const BASE = 'https://v3.football.api-sports.io';
let remaining = null, fetched = 0;

async function call(p, attempt = 0) {
  let res;
  try { res = await fetch(BASE + p, { headers: { 'x-apisports-key': KEY } }); }
  catch (e) { if (attempt < 6) { await sleep(5000 * (attempt + 1)); return call(p, attempt + 1); } throw e; }
  const left = res.headers.get('x-ratelimit-requests-remaining'); if (left !== null) remaining = Number(left);
  let body;
  try { body = await res.json(); } catch { if (attempt < 6) { await sleep(5000 * (attempt + 1)); return call(p, attempt + 1); } throw new Error(`${p}: not JSON`); }
  if (body.errors && body.errors.rateLimit && attempt < 8) { await sleep(12000 + attempt * 4000); return call(p, attempt + 1); }
  const errs = body.errors && (Array.isArray(body.errors) ? body.errors : Object.values(body.errors));
  if (errs && errs.length) throw new Error(`${p}: ${JSON.stringify(body.errors)}`);
  await sleep(250);
  return body;
}

const players = { ...readJson(path.join(ROOT, 'data/generated/player-stats.json'), { players: {} }).players, ...readJson(path.join(ROOT, 'data/generated/career-pilot.json'), { players: {} }).players };
const current = readJson(path.join(ROOT, 'data/generated/player-stats.json'), {}).currentSeason || new Date().getUTCFullYear();

// player → team id of his latest club line
const teamOf = new Map();
for (const p of Object.values(players)) {
  const years = Object.keys(p.seasons).map(Number).filter(y => y >= current - 1).sort((a, b) => b - a);
  for (const y of years) {
    const lines = (readJson(path.join(RAW, `${p.id}-${y}.json`), null)?.response?.[0]?.statistics || []).filter(l => l.team?.id && (l.games?.appearences || 0) > 0 && !isNationalTeam(l.team.name, p.nationality) && !/friendl/i.test(l.league?.name || ''));
    if (lines.length) { teamOf.set(p.id, lines.sort((a, b) => (b.games.appearences || 0) - (a.games.appearences || 0))[0].team.id); break; }
  }
}
const teams = [...new Set(teamOf.values())];
console.log(`${teamOf.size} current players at ${teams.length} clubs`);

const numbers = readJson(path.join(LISTS, 'squad-numbers.json'), {});
for (const id of teams) {
  const file = path.join(LISTS, `squad-${id}.json`);
  let body = !args.refresh && fs.existsSync(file) ? readJson(file, null) : null;
  if (!body) {
    if (remaining !== null && remaining <= RESERVE) { console.log(`stopped: ${remaining} requests left (reserve ${RESERVE})`); break; }
    body = await call(`/players/squads?team=${id}`); fs.writeFileSync(file, JSON.stringify(body)); fetched++;
  }
  for (const pl of body.response?.[0]?.players || []) if (pl.number) numbers[pl.id] = pl.number;
}
fs.writeFileSync(path.join(LISTS, 'squad-numbers.json'), JSON.stringify(numbers));
const have = [...teamOf.keys()].filter(id => numbers[id]).length;
console.log(`fetched ${fetched} squads · shirt numbers known for ${have} of ${teamOf.size} players · requests left ≈ ${remaining}`);
