// Builds data/iceland.js: games, goals and cards per player in the Icelandic top flight (Besta deild karla), counted from the 1992 season on.
//
// Source: KSÍ (ksi.is). Every team page of a competition lists all its players with games, goals, yellow and red cards:
//   /oll-mot/mot/lid?id=<team>&competitionId=<competition>
// The pages were collected in the browser pane (same-origin fetches, one page at a time) and saved by a small local receiver into
//   data/raw/ksi/team-seasons.json        1985–2026 (main phase + the top/bottom halves from 2022)
//   data/raw/ksi/team-seasons-1983-84.json
// KSÍ has no player numbers before 1983, and this game counts from 1992 for everyone, so careers are compared on equal terms.
// Checked when it was built: all 294 entries on KSÍ's own top-scorer lists equal the team pages; Tryggvi Guðmundsson = 131 goals (Wikipedia: 131).
// Re-run once a year after the season ends (Oct–Nov): collect the new season's pages, then `node tools/build-iceland.mjs`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = p => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/raw/ksi', p), 'utf8'));
const FROM = 1992;
const MIN = { goals: 20, games: 100, cards: 15 };       // a player is kept when he reaches one of these

const A = RAW('team-seasons.json'), B = RAW('team-seasons-1983-84.json');
const teamName = { ...B.teamNames, ...A.teamNames };
const P = new Map();
for (const r of [...B.rows, ...A.rows]) {
  const [season, , , team, id, name, birth, games, goals, yellow, red] = r;
  if (season < FROM) continue;
  let p = P.get(id);
  if (!p) { p = { id, n: name, b: birth || null, f: 9999, l: 0, g: 0, m: 0, c: 0, clubGames: new Map() }; P.set(id, p); }
  p.g += games; p.m += goals; p.c += yellow + red;
  p.f = Math.min(p.f, season); p.l = Math.max(p.l, season);
  if (birth && !p.b) p.b = birth;
  const club = (teamName[team] || String(team)).replace(/\s+Fullorðnir Karlar$/, '');   // KSÍ labels some adult teams like this
  p.clubGames.set(club, (p.clubGames.get(club) || 0) + games);
}
const players = [...P.values()]
  .filter(p => p.m >= MIN.goals || p.g >= MIN.games || p.c >= MIN.cards)
  .map(p => ({ n: p.n, b: p.b, f: p.f, l: p.l, g: p.g, m: p.m, c: p.c, k: [...p.clubGames].sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]) }))
  .sort((a, b) => b.m - a.m || b.g - a.g);

const lastSeason = Math.max(...A.rows.map(r => r[0]));
const out = `// Games, goals and cards in the Icelandic top flight from ${FROM} to ${lastSeason} — built by tools/build-iceland.mjs from KSÍ's team pages. Do not edit by hand.\n`
  + `// n name · b born · f first season (from ${FROM}) · l last season · g games · m goals · c cards (yellow + red) · k clubs with the most games\n`
  + `const ICE_DATA = { from: ${FROM}, season: ${lastSeason}, updated: '${new Date().toISOString().slice(0, 10)}', players: [\n`
  + players.map(p => JSON.stringify(p)).join(',\n') + '\n] };\n';
fs.writeFileSync(path.join(ROOT, 'data/iceland.js'), out);
console.log(`wrote data/iceland.js — ${players.length} players (of ${P.size} since ${FROM}), ${(out.length / 1024).toFixed(0)} KB`);
const top = k => [...players].sort((a, b) => b[k] - a[k]).slice(0, 3).map(p => `${p.n} ${p[k]}`).join(' · ');
console.log('goals:', top('m')); console.log('games:', top('g')); console.log('cards:', top('c'));
