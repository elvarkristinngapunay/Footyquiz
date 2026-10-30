#!/usr/bin/env node
// Builds data/daily.js — the data behind the Daily Challenges (Daily Footle, Season Line, Football Chain, Season Higher or Lower, Younger/Older).
//
//   node tools/build-daily.mjs
//
// Makes no requests; reads what the other builders already made (data/players-*.js, data/raw/fotmob, data/raw/wikipedia/legends, data/generated/player-stats.json).
//   DAILY_CLUBS  every player of the three decks → the clubs he played for (one canonical name per club, = the key in data/club-logos.js)      [Football Chain]
//   DAILY_CUR    the current players with everything Footle needs: nationality, position, birth date, club, league, shirt number                  [Footle, Younger/Older]
//   DAILY_PATHS  every player's clubs in the order he played for them (stints; a return to a club counts again)                                              [Career Path]
//   DAILY_LINES  one club-season per row: games, goals, assists — ONLY seasons where Wikipedia and FotMob give exactly the same goals AND games (two sources,
//                no tolerance); assists only from 2016/17 and only for players whose assists passed tools/lib/verify-assists.mjs                 [Season Line, Season Higher or Lower]
// Birth dates are API-Football's (the same date FotMob and Wikipedia confirmed when the players were matched).

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { parseArticle } from './lib/wikipedia.mjs';
import { isReserve } from './lib/verify-current.mjs';
import { makeClubCanon } from './lib/clubs.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const ctx = {}; vm.createContext(ctx);
for (const f of ['data/kits.js', 'data/club-logos.js', 'data/players.js', 'data/legends-verified.js', 'data/legends-extra.js', 'data/players-era.js', 'data/players-modern.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8') + ';', ctx);
const LOGOS = vm.runInContext('CLUB_LOGOS', ctx), PLAYERS = vm.runInContext('PLAYERS', ctx), ERA = vm.runInContext('PLAYERS_ERA', ctx), MODERN = vm.runInContext('PLAYERS_MODERN', ctx);
const { canon } = makeClubCanon(LOGOS);
const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const sy = s => Number(String(s).slice(0, 4));

// ── Football Chain: clubs of every player ────────────────────────────────────────────────────────────
const CLUBS = {};
for (const p of [...PLAYERS, ...ERA, ...MODERN]) {
  if (CLUBS[p.name]) continue;
  const list = (p.club_apps?.length ? p.club_apps : p.club_goals) || [];
  const set = [...new Set(list.filter(c => c.n > 0).map(c => canon(c.c)).filter(Boolean))];
  if (set.length) CLUBS[p.name] = set;
}

// ── current players ───────────────────────────────────────────────────────────────────────────────────
const stats = { ...readJson(path.join(ROOT, 'data/generated/player-stats.json'), { players: {} }).players, ...readJson(path.join(ROOT, 'data/generated/career-pilot.json'), { players: {} }).players };
const fmIndex = readJson(path.join(ROOT, 'data/raw/fotmob/index.json'), {});
const fotmobOf = name => { const e = fmIndex[name]; return e?.id ? readJson(path.join(ROOT, 'data/raw/fotmob', e.id + '.json'), null) : null; };
const LEAGUES = { 47: 'Premier League', 87: 'La Liga', 55: 'Serie A', 54: 'Bundesliga', 53: 'Ligue 1', 71: 'Süper Lig', 57: 'Eredivisie', 61: 'Liga Portugal', 130: 'MLS', 536: 'Saudi Pro League', 268: 'Brasileirão',
  112: 'Liga Argentina', 535: 'Qatar Stars League', 48: 'Championship', 40: 'Belgian Pro League', 38: 'Belgian Pro League', 64: 'Scottish Premiership', 230: 'Liga MX', 223: 'J1 League', 135: 'Greek Super League', 196: 'Ekstraklasa' };
const leagueName = t => LEAGUES[t.id] || (/J1/i.test(t.name) ? 'J1 League' : null);
const latest = fm => { const y = Math.max(...fm.seasons.map(s => sy(s.season))); return { y, entries: fm.seasons.filter(s => sy(s.season) === y && !isReserve(s.team || '')) }; };
const cur = [], clubLeague = new Map();
const rows = [];
for (const m of MODERN) {
  const api = Object.values(stats).find(s => s.id === m.apiId); const fm = fotmobOf(m.name);
  if (!api?.born || !fm?.seasons?.length) continue;
  const { y, entries } = latest(fm);
  const best = entries.flatMap(s => s.tournaments.filter(t => !t.friendly && leagueName(t)).map(t => ({ team: s.team, apps: t.apps || 0, lg: leagueName(t) }))).sort((a, b) => b.apps - a.apps)[0];
  rows.push({ m, api, fm, y, best });
  if (best && y >= 2026) clubLeague.set(canon(best.team), best.lg);       // a running-season club → its league, so players who have not played yet this season still get one
}
for (const { m, api, fm, y, best } of rows) {
  const team = y >= 2026 && best ? best.team : (fm.team || best?.team); if (!team) continue;
  const cl = canon(team), lg = clubLeague.get(cl) || (y >= 2026 ? best?.lg : null);
  if (!cl || !lg) continue;
  cur.push({ n: m.name, nat: m.nat, fl: m.intl_breakdown?.flag || '', pos: m.pos, b: api.born, cl, lg, num: m.kit?.num ?? null, ca: m.career_goals ?? null, cp: m.intl_caps ?? null });
}

// ── season lines: Wikipedia == FotMob, exactly ───────────────────────────────────────────────────────
const lines = []; let compared = 0, agreed = 0;
for (const m of MODERN) {
  const fm = fotmobOf(m.name); if (!fm) continue;
  const wf = path.join(ROOT, 'data/raw/wikipedia/legends', m.name.replace(/[^A-Za-z]/g, '_') + '.html'); if (!fs.existsSync(wf)) continue;
  const wp = parseArticle(fs.readFileSync(wf, 'utf8')); if (!wp.seasonRows.length) continue;
  const W = new Map(), F = new Map();
  for (const r of wp.seasonRows) { if (isReserve(r.club || '')) continue; const y = sy(r.season); const k = y + '|' + canon(r.club); const e = W.get(k) || { y, c: canon(r.club), label: r.season, g: 0, a: 0 }; e.g += r.goals; e.a += r.apps; W.set(k, e); }
  for (const s of fm.seasons) { if (isReserve(s.team || '')) continue; const y = sy(s.season); const k = y + '|' + canon(s.team); const e = F.get(k) || { g: 0, a: 0, as: 0 };
    for (const t of s.tournaments) if (!t.friendly) { e.g += t.goals || 0; e.a += t.apps || 0; e.as += t.assists || 0; } F.set(k, e); }
  for (const [k, w] of W) {
    if (w.y < 2010 || w.y > 2025) continue;
    const f = F.get(k); if (!f) continue; compared++;
    if (f.g !== w.g || f.a !== w.a) continue; agreed++;
    const as = w.y >= 2016 && m.assists != null && m.club_assists?.length ? f.as : null;
    if (!((w.g >= 5 || (as ?? 0) >= 5) && w.a >= 15)) continue;
    const label = /^\d{4}[–-]\d{2}/.test(w.label) ? w.label.slice(0, 4) + '/' + w.label.slice(-2) : String(w.y);
    lines.push([m.name, w.y, label, w.c, w.g, w.a, as]);
  }
}

// ── Career Path: the clubs in the order of the career ────────────────────────────────────────────────────────────────
// Wikipedia's career table lists the senior clubs in order (a return to a club is a new block), reserve sides are left out, consecutive duplicates are merged.
const eraQid = Object.fromEntries(readJson(path.join(ROOT, 'data/generated/era-report.json'), []).filter(r => r.qid).map(r => [r.name, r.qid]));
const pageFor = name => {
  const a = path.join(ROOT, 'data/raw/wikipedia/legends', name.replace(/[^A-Za-z]/g, '_') + '.html'); if (fs.existsSync(a)) return a;
  const q = eraQid[name]; const b = q && path.join(ROOT, 'data/raw/wikipedia/era', q + '.html'); return b && fs.existsSync(b) ? b : null;
};
const paths = [];
for (const name of Object.keys(CLUBS)) {
  const f = pageFor(name); if (!f) continue;
  const wp = parseArticle(fs.readFileSync(f, 'utf8')); if (!wp.clubs?.length) continue;
  const seq = [];
  for (const c of wp.clubs) { if (isReserve(c.club || '') || !(c.apps > 0)) continue; const k = canon(c.club); if (k && seq[seq.length - 1] !== k) seq.push(k); }
  if (seq.length >= 4 && seq.length <= 9) paths.push([name, seq]);
}

const js = `// GENERATED by tools/build-daily.mjs on ${new Date().toISOString().slice(0, 10)} — the data behind the Daily Challenges. Do not edit by hand.
// DAILY_LINES rows: [player, first year of the season, label, club, goals, games, assists|null] — only seasons where Wikipedia and FotMob agree exactly on goals AND games.
const DAILY_CLUBS = ${JSON.stringify(CLUBS)};
const DAILY_CUR = ${JSON.stringify(cur)};
const DAILY_PATHS = ${JSON.stringify(paths)};
const DAILY_LINES = ${JSON.stringify(lines)};
`;
fs.writeFileSync(path.join(ROOT, 'data/daily.js'), js);
console.log(`wrote data/daily.js (${(js.length / 1024).toFixed(0)} KB): ${Object.keys(CLUBS).length} players with clubs · ${cur.length} current players for Footle · ${lines.length} season lines (${agreed} of ${compared} club-seasons agreed exactly) · ${paths.length} career paths`);
console.log('players with a shirt number:', cur.filter(p => p.num != null).length, '· leagues:', [...new Set(cur.map(p => p.lg))].join(', '));
