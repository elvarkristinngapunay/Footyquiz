#!/usr/bin/env node
// Looks at the API-Football endpoints we might build games on and prints what they really return (about 20 requests).
//   node --env-file=.env tools/api-explore.mjs
const KEY = process.env.APISPORTS_KEY;
if (!KEY) { console.error('No key — run with: node --env-file=.env tools/api-explore.mjs'); process.exit(1); }
const BASE = 'https://v3.football.api-sports.io';
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function call(p, attempt = 0) {
  const res = await fetch(BASE + p, { headers: { 'x-apisports-key': KEY } });
  if (res.status === 429 && attempt < 3) { await sleep(20000); return call(p, attempt + 1); }
  const body = await res.json();
  const errs = body.errors && (Array.isArray(body.errors) ? body.errors : Object.values(body.errors));
  await sleep(300);
  if (!res.ok || (errs && errs.length)) throw new Error(`${p}: ${JSON.stringify(body.errors)}`);
  return body;
}
const h = t => console.log(`\n── ${t} ${'─'.repeat(Math.max(0, 60 - t.length))}`);
const tryIt = async (title, fn) => { h(title); try { await fn(); } catch (e) { console.log('  FAILED:', e.message.slice(0, 220)); } };

await tryIt('TROPHIES — Messi (player 154)', async () => {
  const t = (await call('/trophies?player=154')).response || [];
  const won = t.filter(x => /winner/i.test(x.place)), second = t.filter(x => /2nd|runner/i.test(x.place));
  console.log(`  ${t.length} entries · ${won.length} won · ${second.length} runner-up`);
  const byLeague = {}; for (const x of won) byLeague[x.league] = (byLeague[x.league] || 0) + 1;
  console.log('  won, by competition:', Object.entries(byLeague).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ×${v}`).join(' · '));
  console.log('  sample entry:', JSON.stringify(t[0]));
});
await tryIt('TROPHIES — Cristiano Ronaldo (874)', async () => {
  const t = (await call('/trophies?player=874')).response || [];
  const won = t.filter(x => /winner/i.test(x.place));
  console.log(`  ${t.length} entries · ${won.length} won`);
  const byLeague = {}; for (const x of won) byLeague[x.league] = (byLeague[x.league] || 0) + 1;
  console.log('  won:', Object.entries(byLeague).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ×${v}`).join(' · '));
});
await tryIt('TOP LISTS — Premier League 2025 (goals / assists / yellow / red)', async () => {
  for (const [ep, label] of [['topscorers', 'goals'], ['topassists', 'assists'], ['topyellowcards', 'yellow'], ['topredcards', 'red']]) {
    const r = (await call(`/players/${ep}?league=39&season=2025`)).response || [];
    const val = x => label === 'goals' ? x.statistics[0].goals.total : label === 'assists' ? x.statistics[0].goals.assists : label === 'yellow' ? x.statistics[0].cards.yellow : x.statistics[0].cards.red;
    console.log(`  ${label.padEnd(8)} ${r.length} players · top 5: ${r.slice(0, 5).map(x => `${x.player.name} ${val(x)}`).join(', ')}`);
  }
});
await tryIt('STANDINGS — champions per season, Premier League', async () => {
  const out = [];
  for (const y of [2020, 2021, 2022, 2023, 2024, 2025]) {
    const r = (await call(`/standings?league=39&season=${y}`)).response?.[0]?.league?.standings?.[0] || [];
    out.push(`${y}: ${r[0]?.team?.name} (${r[0]?.points} pts)`);
  }
  console.log('  ' + out.join(' · '));
});
await tryIt('VENUES — stadium capacities, England', async () => {
  const v = (await call('/venues?country=England')).response || [];
  console.log(`  ${v.length} venues · biggest: ` + v.sort((a, b) => (b.capacity || 0) - (a.capacity || 0)).slice(0, 6).map(x => `${x.name} ${x.capacity}`).join(', '));
  console.log('  sample:', JSON.stringify(v[0]));
});
await tryIt('COACHES — Guardiola', async () => {
  const c = (await call('/coachs?search=guardiola')).response || [];
  const g = c.find(x => /pep|josep/i.test(x.firstname + x.name)) || c[0];
  console.log('  found:', g?.name, '· id', g?.id, '· career entries:', g?.career?.length);
  if (g) {
    const tr = (await call(`/trophies?coach=${g.id}`)).response || [];
    console.log(`  trophies as coach: ${tr.length} entries · ${tr.filter(x => /winner/i.test(x.place)).length} won`);
  }
});
await tryIt('TRANSFERS — Messi history', async () => {
  const t = (await call('/transfers?player=154')).response?.[0]?.transfers || [];
  console.log(`  ${t.length} moves · ` + t.slice(0, 6).map(x => `${x.date} ${x.teams.out.name}→${x.teams.in.name} [${x.type}]`).join(' | '));
});
await tryIt('SINGLE-SEASON CHECK — Messi 2011 (real life: 73 goals in 2011/12, all competitions)', async () => {
  const st = (await call('/players?id=154&season=2011')).response?.[0]?.statistics || [];
  let g = 0; for (const s of st) { if (/friendl/i.test(s.league.name)) continue; g += s.goals.total || 0; console.log(`  ${s.league.name.padEnd(28)} ${s.team.name.padEnd(12)} ${s.games.appearences} apps ${s.goals.total} goals`); }
  console.log(`  → ${g} goals (excluding friendlies)`);
});
await tryIt('RATINGS — does a season rating exist? (Haaland 2023)', async () => {
  const st = (await call('/players?id=1100&season=2023')).response?.[0]?.statistics || [];
  console.log('  ' + st.map(s => `${s.league.name}: rating ${s.games.rating ?? 'none'}`).join(' | '));
});
await tryIt('SQUADS — current team and player photos', async () => {
  const t = (await call('/players/squads?team=33')).response?.[0];
  console.log(`  ${t?.team?.name}: ${t?.players?.length} players · sample ${JSON.stringify(t?.players?.[0])}`);
});
console.log('\ndone');
