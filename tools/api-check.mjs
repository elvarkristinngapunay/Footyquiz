#!/usr/bin/env node
// API-Football (api-sports.io) coverage check — run this ONCE after you get your key.
//
//   APISPORTS_KEY=your_key_here node tools/api-check.mjs
//
// The key is only ever read from the environment: it is never printed and never written to a file.
// It makes ~12 requests (the Pro plan allows thousands a day) and prints:
//   · your plan and how many requests are left today
//   · per league: which seasons exist and what the API says it covers (players, top scorers, transfers…)
//   · how many pages a full "all players in a league" pull would take (20 players per page)
//   · a sample player so we can see the real response shape before building the pipeline
//
// Header name and base URL are the direct api-sports.io ones (not RapidAPI). If you subscribed through RapidAPI instead,
// tell me and I'll switch the headers.

const KEY = process.env.APISPORTS_KEY;
const BASE = 'https://v3.football.api-sports.io';
let gap = 1200;   // pause between calls; raised to 6.5 s automatically on the Free plan (10 requests per minute)

if (!KEY) {
  console.error('No key found. Run it like this:\n\n  APISPORTS_KEY=your_key_here node tools/api-check.mjs\n');
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
let remainingToday = null;

async function call(path, attempt = 0) {
  const res = await fetch(BASE + path, { headers: { 'x-apisports-key': KEY } });
  // The API often answers HTTP 200 even when something is wrong, with the reason in an "errors" field — check both.
  const left = res.headers.get('x-ratelimit-requests-remaining');
  if (left !== null) remainingToday = left;
  if (res.status === 429 && attempt < 2) { await sleep(65000); return call(path, attempt + 1); }   // per-minute limit: wait a full minute, retry
  let body;
  try { body = await res.json(); } catch { throw new Error(`${path}: HTTP ${res.status}, response was not JSON`); }
  const errs = body.errors && (Array.isArray(body.errors) ? body.errors : Object.values(body.errors));
  if (!res.ok || (errs && errs.length)) throw new Error(`${path}: ${res.ok ? '' : 'HTTP ' + res.status + ' — '}${JSON.stringify(body.errors)}`);
  await sleep(gap);
  return body;
}

const line = (...a) => console.log(...a);
const yn = v => (v === true ? 'yes' : v === false ? 'NO' : '?');

try {
  // 1) plan + quota
  const st = await call('/status');
  const r = st.response || {};
  line('── ACCOUNT ─────────────────────────────────────────');
  line('plan:            ', r.subscription?.plan ?? '?', r.subscription?.active === false ? '(NOT ACTIVE)' : '');
  if (/free/i.test(r.subscription?.plan || '')) { gap = 6500; line('(Free plan: pausing 6.5 s between calls — this run takes about two minutes)'); }
  line('requests today:  ', `${r.requests?.current ?? '?'} used of ${r.requests?.limit_day ?? '?'}`);
  if (remainingToday !== null) line('remaining (header):', remainingToday);

  // 2) leagues we care about. 39 PL · 140 La Liga · 135 Serie A · 78 Bundesliga · 61 Ligue 1 · 2 Champions League · 1 World Cup
  const IDS = [39, 140, 135, 78, 61, 2, 1];
  const leagues = [];
  for (const id of IDS) leagues.push(...((await call(`/leagues?id=${id}`)).response || []));

  line('\n── LEAGUES ─────────────────────────────────────────');
  for (const l of leagues) {
    const seasons = (l.seasons || []).map(s => s.year).sort((a, b) => a - b);
    const cur = (l.seasons || []).find(s => s.current) || (l.seasons || []).slice(-1)[0];
    const c = cur?.coverage || {};
    line(`${l.league.name} (id ${l.league.id}, ${l.country?.name}):`);
    line(`   seasons: ${seasons[0] ?? '?'}–${seasons[seasons.length - 1] ?? '?'}  (${seasons.length} seasons)   current: ${cur?.year ?? '?'}`);
    line(`   coverage now → players: ${yn(c.players)} · top scorers: ${yn(c.top_scorers)} · standings: ${yn(c.standings)} · injuries: ${yn(c.injuries)} · fixtures stats: ${yn(c.fixtures?.statistics_players)}`);
    // how far back do PLAYER statistics actually go?
    const withPlayers = (l.seasons || []).filter(s => s.coverage?.players === true).map(s => s.year).sort((a, b) => a - b);
    line(`   player stats available from: ${withPlayers[0] ?? 'none flagged'}`);
  }

  // 3) one real players call: shape + how many pages a full pull needs
  const pl = leagues.find(l => l.league.id === 39);
  let season = (pl?.seasons || []).find(s => s.current)?.year ?? new Date().getFullYear() - 1;
  let sample = null;
  // The current season needs a paid plan. If the plan refuses it, say so and fall back to 2024 (free plans allow 2022–2024) so the rest still runs.
  try { sample = await call(`/players?league=39&season=${season}&page=1`); }
  catch (e) {
    line(`\n(season ${season} refused by your plan: ${e.message.replace(/^[^:]*: /, '')})`);
    season = 2024;
    try { sample = await call(`/players?league=39&season=${season}&page=1`); } catch (e2) { line('(sample skipped:', e2.message + ')'); }
  }
  if (sample) {
    line('\n── SAMPLE: Premier League players, season', season, '──────────────');
    line('pages for a full league pull:', sample.paging?.total ?? '?', '→ that many requests per league per refresh');
  }
  const p0 = sample?.response?.[0];
  if (p0) {
    line('first player:', p0.player?.name, '| id', p0.player?.id, '| nationality', p0.player?.nationality, '| born', p0.player?.birth?.date);
    for (const s of p0.statistics || []) line('   stats entry →', s.team?.name, '| apps', s.games?.appearences, '| goals', s.goals?.total, '| assists', s.goals?.assists);
    line('   fields on a player object:', Object.keys(p0.player || {}).join(', '));
  }

  // 4) which competitions does ONE player's season include? (decides how we compute "career goals")
  //    Non-fatal: if the profile search isn't on your plan, the rest of the report above still stands.
  try {
    const prof = (await call('/players/profiles?search=messi')).response || [];
    const m = prof.find(x => /lionel/i.test(x.player?.firstname || '') || /^l\. messi$/i.test(x.player?.name || '')) || prof[0];
    if (m) {
      line('\n── ONE PLAYER, ONE SEASON: Messi 2022 ──────────────');
      const one = await call(`/players?id=${m.player.id}&season=2022`);
      const entries = one.response?.[0]?.statistics || [];
      let g = 0, a = 0, ap = 0;
      for (const s of entries) {
        line(`   ${String(s.league?.name ?? '?').padEnd(28)} ${String(s.team?.name ?? '?').padEnd(18)} apps ${s.games?.appearences ?? 0}  goals ${s.goals?.total ?? 0}  assists ${s.goals?.assists ?? 0}`);
        g += s.goals?.total || 0; a += s.goals?.assists || 0; ap += s.games?.appearences || 0;
      }
      line(`   → ${entries.length} competition entries · total apps ${ap} · goals ${g} · assists ${a}`);
      line('   Look at this list: are cups, Europe and the national team (World Cup) all in it? If yes, summing the entries gives true career totals.');
    }
  } catch (e) { line('\n(player probe skipped:', e.message + ')'); }

  line('\n── DONE ────────────────────────────────────────────');
  if (remainingToday !== null) line('requests left today:', remainingToday);
} catch (e) {
  console.error('\nStopped:', e.message);
  console.error('(Nothing was written. If this says the request limit or the plan is the problem, check the dashboard first.)');
  process.exit(1);
}
