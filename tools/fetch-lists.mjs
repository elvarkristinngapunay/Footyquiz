#!/usr/bin/env node
// League-level data for the Top 10 boards (separate from the per-player pull):
//   standings  → who won each league every season           (league titles since 2010)
//   topscorers / topassists per season                       (Golden Boots since 2010, this season's leaders)
//   topyellowcards / topredcards for the current season      (this season's card leaders)
//   teams                                                    (each club's stadium + capacity)
//   trophies for every player in data/generated/player-stats.json
//
//   node --env-file=.env tools/fetch-lists.mjs [--refresh] [--reserve=300] [--no-trophies]
// Everything is cached under data/raw/lists/ (git-ignored), so a rerun only pays for what is new — the weekly refresh passes --refresh-current.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const KEY = process.env.APISPORTS_KEY;
if (!KEY) { console.error('No key — run with: node --env-file=.env tools/fetch-lists.mjs'); process.exit(1); }
const now = new Date();
const CURRENT = now.getUTCMonth() >= 6 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
const RESERVE = Number(args.reserve ?? 300);
const DIR = path.join(ROOT, 'data/raw/lists');
fs.mkdirSync(DIR, { recursive: true });

const LEAGUES = { 39: 'Premier League', 140: 'La Liga', 135: 'Serie A', 78: 'Bundesliga', 61: 'Ligue 1' };
const FROM = 2010;
const BASE = 'https://v3.football.api-sports.io';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let remaining = null, fetched = 0, cached = 0;

async function call(p, attempt = 0) {
  const res = await fetch(BASE + p, { headers: { 'x-apisports-key': KEY } });
  const left = res.headers.get('x-ratelimit-requests-remaining'); if (left !== null) remaining = Number(left);
  if (res.status === 429 && attempt < 3) { await sleep(20000 * (attempt + 1)); return call(p, attempt + 1); }
  const body = await res.json();
  // Pro allows 300 requests/minute. Going over is answered with HTTP 200 + an "errors.rateLimit" text — wait and retry instead of failing.
  if (body.errors && body.errors.rateLimit && attempt < 8) { await sleep(12000 + attempt * 4000); return call(p, attempt + 1); }
  const errs = body.errors && (Array.isArray(body.errors) ? body.errors : Object.values(body.errors));
  if (!res.ok || (errs && errs.length)) { const e = new Error(`${p}: ${JSON.stringify(body.errors)}`); e.api = body.errors; throw e; }
  await sleep(250);
  return body;
}
// cached GET; the current season is refetched when --refresh-current is passed (weekly job), everything older never changes
async function get(name, p, { volatile = false } = {}) {
  const file = path.join(DIR, `${name}.json`);
  if (fs.existsSync(file) && !args.refresh && !(volatile && args['refresh-current'])) { cached++; return JSON.parse(fs.readFileSync(file, 'utf8')); }
  if (remaining !== null && remaining <= RESERVE) throw Object.assign(new Error(`quota reserve reached (${remaining} left)`), { quota: true });
  const body = await call(p); fetched++;
  fs.writeFileSync(file, JSON.stringify(body)); return body;
}

try {
  for (const [id, name] of Object.entries(LEAGUES)) {
    for (let y = FROM; y <= CURRENT; y++) {
      const cur = y === CURRENT;
      await get(`standings-${id}-${y}`, `/standings?league=${id}&season=${y}`, { volatile: cur });
      await get(`topscorers-${id}-${y}`, `/players/topscorers?league=${id}&season=${y}`, { volatile: cur });
      await get(`topassists-${id}-${y}`, `/players/topassists?league=${id}&season=${y}`, { volatile: cur });
    }
    await get(`topyellow-${id}-${CURRENT}`, `/players/topyellowcards?league=${id}&season=${CURRENT}`, { volatile: true });
    await get(`topred-${id}-${CURRENT}`, `/players/topredcards?league=${id}&season=${CURRENT}`, { volatile: true });
    await get(`teams-${id}-${CURRENT}`, `/teams?league=${id}&season=${CURRENT}`);
    console.log(`${name}: done (fetched ${fetched}, cached ${cached}, left ≈ ${remaining})`);
  }
  for (let y = 2011; y <= CURRENT; y++) await get(`topscorers-2-${y}`, `/players/topscorers?league=2&season=${y}`, { volatile: y === CURRENT });
  console.log('Champions League top scorers: done');

  if (!args['no-trophies']) {
    const stats = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/generated/player-stats.json'), 'utf8'));
    let n = 0;
    for (const p of Object.values(stats.players)) { await get(`trophies-${p.id}`, `/trophies?player=${p.id}`); if (++n % 50 === 0) console.log(`trophies: ${n}/${Object.keys(stats.players).length} (left ≈ ${remaining})`); }
    console.log('trophies: done');
  }
} catch (e) {
  if (e.quota) { console.log('Stopped:', e.message, '— cached files are kept; run again later.'); process.exit(2); }
  throw e;
}
console.log(`\nfetched ${fetched} · from cache ${cached} · requests left ≈ ${remaining}`);
