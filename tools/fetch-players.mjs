#!/usr/bin/env node
// Pulls player statistics from API-Football for a roster and writes a compact file the games can read.
//
//   node --env-file=.env tools/fetch-players.mjs --roster --top=40                 pilot: the 40 best-known players of tools/roster-candidates.json
//   node --env-file=.env tools/fetch-players.mjs --roster --top=300 --skip=40       the next 260
//   node --env-file=.env tools/fetch-players.mjs --players=tools/test-players.json  a hand-made list [{name, born, id?}]
//   options: --seasons=2010-2026 (default)  --reserve=300 (requests always left unused)  --refresh (ignore the local cache)  --dry (only print the plan)
//            --refresh-current  (fetch the running season again, keep older seasons cached — what the weekly job uses)
//            --offline  (never calls the API: re-aggregates what is already cached under data/raw/ — use it after changing tools/lib/aggregate.mjs)
//
// Safe by design:
//   · every API answer is cached under data/raw/ (git-ignored): a player-season is never paid for twice
//   · it stops before the daily quota is gone (--reserve)
//   · the API often answers HTTP 200 with the problem inside "errors" — checked on every call
//   · a player is only matched to the API when the BIRTH DATE is identical (no "wrong Ronaldo")
//   · players with suspicious numbers are marked quality:"review" and listed — see tools/lib/aggregate.mjs
//   · the output file is written only when the run finished cleanly
//   · the key is read from the environment and never printed

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aggregateSeason, sumInto, qualityIssues, findDuplicateDrops, FIELDS } from './lib/aggregate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const now = new Date();
const CURRENT_SEASON = now.getUTCMonth() >= 6 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;   // API season 2026 = 2026/27, starts in the summer
const [S1, S2] = String(args.seasons || `2010-${CURRENT_SEASON}`).split('-').map(Number);
const RESERVE = Number(args.reserve ?? 300);
const OUT = path.resolve(ROOT, args.out || 'data/generated/player-stats.json');
const RAW = path.join(ROOT, 'data/raw/players');
const IDS_FILE = path.join(ROOT, 'tools/player-ids.json');

const KEY = process.env.APISPORTS_KEY;
if (!KEY && !args.dry && !args.offline) { console.error('No key. Put it in .env (bash tools/set-key.sh) and run with: node --env-file=.env tools/fetch-players.mjs …'); process.exit(1); }

const BASE = 'https://v3.football.api-sports.io';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
let gap = 250, remaining = null, calls = 0;

async function call(p, attempt = 0) {
  if (args.offline) throw new Error('--offline: no API calls allowed');
  let res;
  try { res = await fetch(BASE + p, { headers: { 'x-apisports-key': KEY } }); }
  catch (e) { if (attempt < 6) { await sleep(5000 * (attempt + 1)); return call(p, attempt + 1); } throw e; }   // network blip (ECONNRESET, DNS) → wait and retry
  calls++;
  const left = res.headers.get('x-ratelimit-requests-remaining');
  if (left !== null) remaining = Number(left);
  if (res.status === 429 && attempt < 3) { await sleep(20000 * (attempt + 1)); return call(p, attempt + 1); }
  let body;
  try { body = await res.json(); } catch { if (attempt < 6) { await sleep(5000 * (attempt + 1)); return call(p, attempt + 1); } throw new Error(`${p}: HTTP ${res.status}, not JSON`); }   // cut-off answer → try again
  // Pro allows 300 requests/minute. Going over is answered with HTTP 200 + an "errors.rateLimit" text — wait and retry instead of failing.
  if (body.errors && body.errors.rateLimit && attempt < 8) { await sleep(12000 + attempt * 4000); return call(p, attempt + 1); }
  const errs = body.errors && (Array.isArray(body.errors) ? body.errors : Object.values(body.errors));
  if (!res.ok || (errs && errs.length)) { const e = new Error(`${p}: ${JSON.stringify(body.errors)}`); e.api = body.errors; throw e; }
  await sleep(gap);
  return body;
}
const outOfQuota = () => remaining !== null && remaining <= RESERVE;

fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(path.dirname(OUT), { recursive: true });

// ── who ──
let wanted;
if (args.roster) {
  const minBorn = Number(args.minborn ?? 0);       // e.g. --minborn=1985 leaves out most retired players
  const all = readJson(path.join(ROOT, 'tools/roster-candidates.json'), []).filter(r => Number(r.born.slice(0, 4)) >= minBorn);
  const skip = Number(args.skip ?? 0), top = Number(args.top ?? 40);
  wanted = all.slice(skip, top).map(r => ({ name: r.name, born: r.born }));
} else if (args.extra) wanted = readJson(path.join(ROOT, 'tools/extra-players.json'), []).slice(Number(args.skip ?? 0), Number(args.top ?? 100000));   // players the top lists mention: [{name, born, id}] — ids come straight from the API
else wanted = readJson(path.resolve(ROOT, args.players || 'tools/test-players.json'), []);
const ids = readJson(IDS_FILE, {});
// `to` (optional, per player in --players files): the last season to ask for — retired players do not need the empty seasons after their last game
const seasonsFor = (born, to) => { const from = Math.max(S1, Number(String(born).slice(0, 4)) + 16), last = Math.min(S2, to ?? S2); return Array.from({ length: Math.max(0, last - from + 1) }, (_, i) => from + i); };

if (args.dry) {
  const reqs = wanted.reduce((n, w) => n + seasonsFor(w.born, w.to).length + (ids[w.name]?.id ? 0 : 2), 0);
  console.log(`${wanted.length} players · up to ~${reqs} requests (cached ones are free) · seasons ${S1}–${S2}`); process.exit(0);
}

// ── 0. plan → pacing ──
const st = args.offline ? { response: { subscription: { plan: 'offline' } } } : await call('/status');
const plan = st.response?.subscription?.plan || '?';
gap = /free/i.test(plan) ? 6500 : 250;
console.log(`plan: ${plan} · requests today: ${st.response?.requests?.current}/${st.response?.requests?.limit_day} · seasons ${S1}–${S2} · players ${wanted.length} · reserve ${RESERVE}`);

// ── 1. resolve ids (birth date must match exactly) ──
async function resolve(w) {
  const tokens = [...new Set(norm(w.name).split(' ').filter(t => t.length >= 4))].sort((a, b) => b.length - a.length).slice(0, 3);   // the search needs 4+ letters
  for (const t of tokens) {
    if (outOfQuota()) return null;
    const found = (await call(`/players/profiles?search=${encodeURIComponent(t)}`)).response || [];
    const hit = found.find(x => x.player?.birth?.date === w.born && tokens.some(k => norm([x.player?.name, x.player?.firstname, x.player?.lastname].join(' ')).includes(k)));
    if (hit) return { id: hit.player.id, born: w.born, via: t };
  }
  return null;
}
let unresolved = [];
for (const w of wanted) {
  if (w.id && !ids[w.name]?.id) ids[w.name] = { id: w.id, born: w.born, via: 'list' };
  if (ids[w.name]?.id) continue;
  if (args.offline) { unresolved.push(w.name); continue; }
  if (outOfQuota()) { console.log('quota reserve reached while resolving ids'); process.exitCode = 2; break; }
  let r = null;
  try { r = await resolve(w); } catch (e) { console.log(`  (could not look up ${w.name}: ${e.message.slice(0, 90)})`); }
  if (r) { ids[w.name] = r; } else unresolved.push(w.name);
  if ((Object.keys(ids).length % 25) === 0) fs.writeFileSync(IDS_FILE, JSON.stringify(ids, null, 1));
}
fs.writeFileSync(IDS_FILE, JSON.stringify(ids, null, 1));
console.log(`ids: ${wanted.length - unresolved.length} matched by birth date · ${unresolved.length} not found${unresolved.length ? ': ' + unresolved.slice(0, 15).join(', ') + (unresolved.length > 15 ? ' …' : '') : ''}`);

// ── 2. fetch every player-season once (cached), aggregate ──
const players = {}; let fetched = 0, cached = 0; const planBlocked = [];
const window3 = [CURRENT_SEASON - 2, CURRENT_SEASON - 1, CURRENT_SEASON];
for (const w of wanted) {
  const info = ids[w.name]; if (!info) continue;
  const rec = { name: w.name, id: info.id, born: info.born, nationality: null, seasons: {}, fetchFrom: seasonsFor(info.born, w.to)[0] };   // first season we asked for (not the first with data)
  const raw = {};
  for (const season of seasonsFor(info.born, w.to)) {
    const file = path.join(RAW, `${info.id}-${season}.json`);
    // --refresh-current (weekly job): only the running season changes — everything older stays cached
    const stale = args.refresh || (args['refresh-current'] && season === CURRENT_SEASON && !args.offline);
    let body = !stale && fs.existsSync(file) ? readJson(file, null) : null;
    if (body) cached++;
    else if (args.offline) continue;
    else {
      if (outOfQuota()) { console.log(`stopped: ${remaining} requests left (reserve ${RESERVE}). Run again tomorrow — cached seasons are free.`); process.exitCode = 2; break; }
      try { body = await call(`/players?id=${info.id}&season=${season}`); fs.writeFileSync(file, JSON.stringify(body)); fetched++; }
      catch (e) { if (e.api?.plan) { planBlocked.push(`${w.name} ${season}`); continue; } throw e; }
    }
    const p = body.response?.[0]; if (!p) continue;
    rec.nationality = rec.nationality || p.player?.nationality;
    rec.firstname = p.player?.firstname; rec.lastname = p.player?.lastname;
    raw[season] = p.statistics || [];
  }
  // repair repeated lines, then aggregate each season
  const { drops, notes: repairNotes } = findDuplicateDrops(raw);
  rec.repairs = repairNotes;
  for (const [season, stats] of Object.entries(raw)) rec.seasons[season] = aggregateSeason(stats, rec.nationality, drops[season] || new Set());
  if (process.exitCode === 2) break;
  if (!Object.keys(rec.seasons).length) continue;
  // totals: everything fetched, and the rolling last three seasons
  const blank = () => Object.fromEntries(FIELDS.map(f => [f, 0]));
  const all = { club: blank(), intl: blank(), big5: blank() }, last3 = { club: blank(), intl: blank(), big5: blank() };
  const perClub = {};
  let friendliesDropped = 0;
  for (const [y, s] of Object.entries(rec.seasons)) {
    sumInto(all.club, s.club); sumInto(all.intl, s.intl); sumInto(all.big5, s.big5); friendliesDropped += s.skipped.friendlies.goals;
    for (const [t, g] of Object.entries(s.perClub)) perClub[t] = (perClub[t] || 0) + g;
    if (window3.includes(Number(y))) { sumInto(last3.club, s.club); sumInto(last3.intl, s.intl); sumInto(last3.big5, s.big5); }
  }
  rec.since = { from: Math.min(...Object.keys(rec.seasons).map(Number)), ...all };
  rec.last3 = { seasons: window3, ...last3 };
  rec.friendliesDropped = friendliesDropped;
  rec.clubGoals = Object.entries(perClub).filter(([, g]) => g > 0).sort((a, b) => b[1] - a[1]).map(([team, goals]) => ({ team, goals }));
  rec.issues = qualityIssues(rec.seasons, S1, Math.min(S2, w.to ?? S2));
  rec.notes = rec.issues.notes || [];
  rec.quality = rec.issues.length ? 'review' : (rec.repairs.length ? 'repaired' : 'ok');
  for (const s of Object.values(rec.seasons)) delete s.entries;     // quality checks are done — keep the file small
  players[info.id] = rec;
}

if (process.exitCode === 2) { console.log('Incomplete run — output file NOT written.'); process.exit(2); }

// ── 3. sanity checks, then write ──
for (const r of Object.values(players)) for (const k of ['club', 'intl']) for (const v of Object.values(r.since[k])) if (!(v >= 0)) throw new Error(`bad number for ${r.name}`);
// merge with what earlier runs wrote, so pulling a few extra players never drops the others
const previous = readJson(OUT, { players: {} }).players || {};
fs.writeFileSync(OUT, JSON.stringify({ generatedAt: now.toISOString(), plan, seasons: [S1, S2], currentSeason: CURRENT_SEASON, players: { ...previous, ...players } }));

const list = Object.values(players);
console.log(`\nfetched ${fetched} · from cache ${cached} · requests left ≈ ${remaining}${planBlocked.length ? ` · blocked by plan: ${planBlocked.length}` : ''}`);
console.log(`wrote ${path.relative(ROOT, OUT)} — ${list.length} players: ${list.filter(r => r.quality === 'ok').length} ok, ${list.filter(r => r.quality === 'repaired').length} repaired, ${list.filter(r => r.quality === 'review').length} need review\n`);
for (const r of list.sort((a, b) => (b.since.club.goals + b.since.intl.goals) - (a.since.club.goals + a.since.intl.goals)).slice(0, 12))
  console.log(`${r.name.padEnd(22)} since ${r.since.from}: ${r.since.club.goals + r.since.intl.goals} goals, ${r.since.club.assists + r.since.intl.assists} assists | last 3 seasons: ${r.last3.club.goals + r.last3.intl.goals}g ${r.last3.club.assists + r.last3.intl.assists}a ${r.quality === 'review' ? '⚠ review' : ''}`);
console.log('\nplayers to review:');
for (const r of list.filter(r => r.quality === 'review')) console.log(`  ${r.name}: ${r.issues.slice(0, 2).join(' | ')}`);
