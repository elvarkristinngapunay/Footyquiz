// The players the Assists category cannot confirm, with the exact season and competitions where the sources disagree — for checking by hand.
//   node tools/assist-check-list.mjs   (run tools/build-hol.mjs and tools/assist-lines.mjs first)  → data/generated/assist-check.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const G = f => path.join(ROOT, 'data/generated', f);
const deck = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/players-modern.js'), 'utf8').match(/const PLAYERS_MODERN = (\[.*?\]);\nconst PLAYERS_MODERN_INFO/s)[1]);
const inDeck = new Set(deck.map(p => p.name));
const notes = JSON.parse(fs.readFileSync(G('assist-notes.json'), 'utf8'));
const csv = fs.readFileSync(G('assist-lines.csv'), 'utf8').split('\n').slice(1).filter(Boolean).map(l => (l.match(/"((?:[^"]|"")*)"/g) || []).map(x => x.slice(1, -1).replace(/""/g, '"')))
  .map(c => ({ player: c[0], season: c[1], club: c[2], comp: c[3], tmApps: c[4], tmAs: c[6], apiApps: c[7], apiAs: c[8], fmApps: c[9], fmAs: c[10] }));
const rankOf = new Map(deck.map((p, i) => [p.name, i]));
const todo = notes.map(n => ({ name: n.split(':')[0], why: n.slice(n.indexOf(':') + 2) })).filter(x => inDeck.has(x.name)).sort((a, b) => (rankOf.get(a.name) ?? 999) - (rankOf.get(b.name) ?? 999));
const out = [`# Assists we cannot confirm yet — ${todo.length} players in the game`, '', 'FM = FotMob (the number we show), TM = Transfermarkt, API = API-Football, WP = Wikipedia. "games" = appearances.', ''];
const groups = { games: [], national: [], nofm: [], other: [] };
for (const t of todo) (/^\d{4}: FotMob has/.test(t.why) ? groups.games : /^national team/.test(t.why) ? groups.national : /no FotMob/.test(t.why) ? groups.nofm : groups.other).push(t);
out.push(`## 1. A season where FotMob's games differ from Wikipedia and Transfermarkt (${groups.games.length})`, '', 'Check: did he really play that many games for that club in that season (club or league site)? The rows show which competition is missing or extra in FotMob.', '');
for (const t of groups.games) {
  const m = t.why.match(/^(\d{4}): (.*)$/); const y = m[1], season = `${y}/${String(Number(y) + 1).slice(2)}`;
  out.push(`### ${t.name} — ${season}`, `${m[2]}`, '', '| Club | Competition | TM games | TM assists | FM games | FM assists | API games | API assists |', '|---|---|---|---|---|---|---|---|');
  for (const r of csv.filter(r => r.player === t.name && r.season === season)) out.push(`| ${r.club} | ${r.comp} | ${r.tmApps || '–'} | ${r.tmAs || '–'} | ${r.fmApps || '–'} | ${r.fmAs || '–'} | ${r.apiApps || '–'} | ${r.apiAs || '–'} |`);
  out.push('');
}
out.push(`## 2. National-team games 2016–2024 differ (${groups.national.length})`, '', 'Check: his caps for the senior national team in those years (federation site).', '');
for (const t of groups.national) out.push(`- **${t.name}** — ${t.why.replace('national team 2016–2024: ', '')}`);
out.push('', `## 3. No FotMob page (${groups.nofm.length})`, '', groups.nofm.map(t => t.name).join(', '), '');
if (groups.other.length) out.push(`## 4. Other (${groups.other.length})`, '', ...groups.other.map(t => `- **${t.name}** — ${t.why}`), '');
fs.writeFileSync(G('assist-check.md'), out.join('\n'));
console.log(`${todo.length} players in the game without confirmed assists: ${groups.games.length} season mismatches, ${groups.national.length} national-team, ${groups.nofm.length} no FotMob page, ${groups.other.length} other → data/generated/assist-check.md`);
