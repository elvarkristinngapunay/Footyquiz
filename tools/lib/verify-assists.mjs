// Assists since the 2016/17 season for a current player — FotMob's (Opta's) numbers, released only when they pass checks against two other sources.
//
// Why 2016: API-Football leaves assists empty in 83–90% of player-seasons before 2015, about half until 2023 and has them in nearly every line only from 2024.
// FotMob has assists from about 2008, but its counts per game are 10–30% too low before 2016 and stable from 2016/17 on (measured on 390 players, see the notes in memory).
//
// What has to hold, season by season (a player failing any of it is left out of the Assists category — nothing is rounded or guessed):
//   1. completeness   FotMob's appearances for the season equal Wikipedia's career-table row within 10% (min 3 games) — proof that FotMob covers every match he played.
//                     Seasons 2024 on are not checked this way (Wikipedia lags); they have check 3.
//   2. API-Football   league and UEFA-competition lines (every season; from 2024 the API has assists everywhere): where FotMob and the API differ, FotMob stands unless Transfermarkt ALSO
//                     differs from FotMob and agrees with the API. Lines the API left empty — and its cup lines, which it often undercounts — are not used as evidence.
//   (whole-season totals are not compared any more: the API's cup undercounting made them differ for reasons that have nothing to do with FotMob)
//   4. national team  FotMob's national-team games 2016–2024 must be close to Wikipedia's year-by-year caps (±25%, min 6: the two cut seasons and calendar years differently).
// The number shown is FotMob's (checked by hand against the competitions' own sites: FotMob is right where API-Football and Transfermarkt differ; Transfermarkt counts more assists on the same league line,
// API-Football undercounts cups). Transfermarkt is an independent witness for 1 and 4, and together with API-Football it can overrule FotMob only when the two AGREE against it (2 and 3).
// Club by club, the same FotMob rows are shown, so the rows add up to the total.

import { isReserve } from './verify-current.mjs';
import { tmSeasons } from './tm-seasons.mjs';

export const ASSISTS_FROM = 2016;
export const TOLERANCE = 2;
const startYear = s => Number(String(s).slice(0, 4));
// providers score assists a little differently (a won penalty, a deflected pass), so a big total may differ by 6% — a small one by 2
export const within = (a, b, rel = 0.06) => Math.abs(a - b) <= Math.max(TOLERANCE, Math.round(rel * Math.max(a, b)));

// club names from different sources: "Al Nassr FC" / "Al-Nassr", "VfL Wolfsburg" / "Wolfsburg", "Los Angeles Galaxy" / "LA Galaxy" are the same club
const STOP = new Set(['fc', 'cf', 'afc', 'sc', 'ac', 'ss', 'ssc', 'club', 'de', 'the', 'calcio', 'vfl', 'vfb', 'sv', 'fk', 'sk', 'cd', 'ud', 'cr', 'ec', 'se', 'rc', 'rcd', 'cfc', 'as', 'us', 'ssd', 'ca']);
const ALIASES = [[/^los angeles galaxy$/, 'la galaxy'], [/^los angeles fc$/, 'lafc'], [/^paris saint germain$/, 'psg'], [/^manchester united$/, 'man united'], [/^manchester city$/, 'man city'], [/^internazionale$/, 'inter'], [/^bayern munchen$/, 'bayern munich'], [/^wolverhampton wanderers$/, 'wolves'], [/^wolverhampton$/, 'wolves'], [/^al qadisiyah( fc)?$/, 'al qadsiah'], [/^newcastle united$/, 'newcastle'], [/^tottenham hotspur$/, 'tottenham'], [/^west ham united$/, 'west ham'], [/^brighton and hove albion$/, 'brighton'], [/^leeds united$/, 'leeds'], [/^leicester city$/, 'leicester'], [/^atletico madrid$/, 'atletico']];
const toks = name => {
  let n = String(name || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  for (const [re, to] of ALIASES) if (re.test(n)) n = to;
  return new Set(n.split(' ').filter(t => t && !STOP.has(t)));
};
export const sameClub = (a, b) => {
  const A = toks(a), B = toks(b); if (!A.size || !B.size) return false;
  const [s, l] = A.size <= B.size ? [A, B] : [B, A];
  if (![...s].every(t => l.has(t))) return false;
  return s.size >= 2 || [...s][0].length >= 6 || s.size === l.size;
};

// competitions the API is reliable for: leagues and the three UEFA club competitions (cups are often undercounted there)
const CUPLIKE = /cup|copa|coppa|pokal|taça|taca|shield|super|trophy|troph[ée]e|friendl|qualif|nations|euro\b|euro |world|olympic|play-?off|relegation|promotion|international/i;
export const LEAGUE_LIKE = name => /champions league|europa league|conference league/i.test(name || '') || !CUPLIKE.test(name || '');
const compKey = n => String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/uefa|major league soccer|\bmls\b/g, m => (m === 'uefa' ? '' : 'mls')).replace(/[^a-z0-9]+/g, '');
export const sameComp = (a, b) => { const x = compKey(a), y = compKey(b); return !!x && x === y; };

// FotMob calls Barcelona's B team "Barça Atlètic", which the shared isReserve() does not recognise
const BARCA_B = /(bar[cç]a|barcelona)\s+atl[eè]tic/i;
// FotMob's club seasons from 2016 on: first teams, no friendlies
function fotmobClubSeasons(fm) {
  const by = new Map();                                              // year → { assists, apps, teams: [{ name, assists, apps }] }
  for (const s of fm?.seasons || []) {
    const y = startYear(s.season); if (!(y >= ASSISTS_FROM) || isReserve(s.team || '') || BARCA_B.test(s.team || '')) continue;
    const played = s.tournaments.filter(t => !t.friendly);
    const apps = played.reduce((a, t) => a + (t.apps || 0), 0), assists = played.reduce((a, t) => a + (t.assists || 0), 0);
    if (!apps) continue;
    const e = by.get(y) || { assists: 0, apps: 0, teams: [] };
    e.assists += assists; e.apps += apps; e.teams.push({ name: s.team, assists, apps });
    by.set(y, e);
  }
  return by;
}
// the senior national team only: FotMob's list also holds England U21, U19 … ("England U21")
const senior = fm => (fm?.national || []).filter(s => !/\bU-?\d{2}\b|olympic|under/i.test(s.team || ''));
function fotmobNational(fm) {
  let assists = 0, apps = 0;
  for (const s of senior(fm)) if (startYear(s.season) >= ASSISTS_FROM) for (const t of s.tournaments) { assists += t.assists || 0; apps += t.apps || 0; }
  return { assists, apps };
}

// apiTables = apiClubSeasons(p, rawDir); wp = parsed Wikipedia article; apiPlayer = the API record (for intl assists)
export function verifyAssists({ apiTables, apiPlayer, wp, fm, tm = null, apiId = null }) {
  if (!fm) return { ok: false, why: 'no FotMob page for this player' };
  const F = fotmobClubSeasons(fm);
  const T = tm && apiId != null && tm.players?.[apiId] ? tmSeasons(tm.players[apiId], tm.clubs, tm.comps, ASSISTS_FROM) : null;   // Transfermarkt: an independent witness, never the number shown
  const hasWp = !!wp?.seasonRows?.length;                                                                                          // without a Wikipedia table Transfermarkt is the only games witness
  if (!hasWp && !T) return { ok: false, why: 'no Wikipedia season table to check FotMob against' };
  let tmWitnessed = 0, apiDisputes = 0;
  if (!F.size) return { ok: false, why: `no club games since ${ASSISTS_FROM} in FotMob` };
  const wpApps = {};
  for (const r of wp?.seasonRows || []) if (!isReserve(r.club || '')) wpApps[startYear(r.season)] = (wpApps[startYear(r.season)] || 0) + r.apps;
  let compared = 0, windowRescued = 0;
  // Calendar-year leagues (Argentina, Colombia, Mexico, Saudi Arabia, Japan, MLS …) are filed under a different season by FotMob than by Wikipedia/Transfermarkt, so one season can differ while the games are the same.
  // The number shown is a total since 2016/17, so it is enough that the whole window agrees: FotMob's games 2016–2023 within 5% (min 5) of Wikipedia's OR Transfermarkt's.
  const sumF = [...F].filter(([y]) => y < 2024).reduce((a, [, f]) => a + f.apps, 0);
  const sumW = Object.entries(wpApps).filter(([y]) => Number(y) >= ASSISTS_FROM && Number(y) < 2024).reduce((a, [, n]) => a + n, 0);
  const sumT = T ? [...T.club].filter(([y]) => y < 2024).reduce((a, [, e]) => a + e.apps, 0) : null;
  const nearW = (a, b) => Math.abs(a - b) <= Math.max(5, Math.round(0.05 * Math.max(a, b)));
  const windowAgrees = () => (hasWp && nearW(sumF, sumW)) || (sumT != null && nearW(sumF, sumT));
  for (const [y, f] of [...F].sort((a, b) => a[0] - b[0])) {
    if (y < 2024) {
      const w = wpApps[y] || 0;                                      // 1. completeness
      const near = (a, b) => Math.abs(a - b) <= Math.max(3, Math.round(0.1 * Math.max(a, b)));
      if (!hasWp || !near(f.apps, w)) { if (T?.club.has(y) && near(f.apps, T.club.get(y).apps)) tmWitnessed++; else if (windowAgrees()) windowRescued++; else return { ok: false, why: `${y}: FotMob has ${f.apps} games, ${hasWp ? `Wikipedia ${w}` : 'no Wikipedia table'}${T?.club.has(y) ? `, Transfermarkt ${T.club.get(y).apps}` : ''}` }; }
    }
    for (const L of apiTables.lines?.[y] || []) {                    // 2. league and UEFA lines (every season: from 2024 the API has assists everywhere)
      if (L.assists == null || !L.apps || !LEAGUE_LIKE(L.league)) continue;
      for (const st of fm.seasons) if (startYear(st.season) === y && sameClub(st.team, L.team)) for (const t of st.tournaments) if (!t.friendly && sameComp(t.name, L.league)) {
        compared++;
        const fv = t.assists || 0;
        if (!within(fv, L.assists, 0.15)) {
          // FotMob (Opta) is the reference. API-Football alone does not overrule it; only API-Football AND Transfermarkt both contradicting it, and agreeing with each other, does.
          let tmv = null; if (T) for (const tl of T.club.get(y)?.lines || []) if (sameClub(tl.team, L.team) && sameComp(tl.comp, L.league)) tmv = (tmv || 0) + tl.assists;
          if (tmv != null && !within(fv, tmv, 0.15) && within(tmv, L.assists, 0.15)) return { ok: false, why: `${y} ${L.league} (${L.team}): FotMob ${fv} assists, API-Football ${L.assists} and Transfermarkt ${tmv}` };
          apiDisputes++;
        }
      }
    }
  }
  const nat = fotmobNational(fm);
  {                                                                  // 4. national team: year by year against Wikipedia's table
    const W = (wp?.intlRows || []).filter(r => r.year >= ASSISTS_FROM && r.year <= 2024).reduce((a, r) => a + r.apps, 0);
    const Fn = senior(fm).filter(s => startYear(s.season) >= ASSISTS_FROM && startYear(s.season) <= 2024).reduce((a, s) => a + s.tournaments.reduce((b, t) => b + (t.apps || 0), 0), 0);
    const nearN = (a, b) => Math.abs(a - b) <= Math.max(6, Math.round(0.25 * Math.max(a, b)));
    if ((W || Fn) && (!(wp?.intlRows || []).length || !nearN(W, Fn))) {
      const Tn = T ? [...T.nat].filter(([y]) => y <= 2024).reduce((a, [, e]) => a + e.apps, 0) : null;
      if (Tn != null && nearN(Fn, Tn)) tmWitnessed++; else return { ok: false, why: `national team ${ASSISTS_FROM}–2024: FotMob ${Fn} games, Wikipedia ${W}${Tn != null ? `, Transfermarkt ${Tn}` : ''}` };
    }
  }
  // the table: one row per club (spells and spellings merged), + the national team
  const clubs = [];
  for (const f of F.values()) for (const t of f.teams) { const hit = clubs.find(c => sameClub(c.name, t.name)); if (hit) hit.n += t.assists; else clubs.push({ name: t.name, n: t.assists }); }
  clubs.sort((a, b) => b.n - a.n);
  const total = clubs.reduce((a, c) => a + c.n, 0) + nat.assists;
  return { ok: true, value: total, clubs, intl: nat.assists, comparedSeasons: compared, seasons: F.size, tmWitnessed, apiDisputes, windowRescued };
}
