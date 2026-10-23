// Career numbers for a CURRENT player that two sources stand behind.
//
//   finished seasons  → Wikipedia's career table (club rows season by season, senior national-team total)
//   the running season → API-Football (so the numbers move every week; Wikipedia's current-season row is ignored — it lags)
//
// A player's numbers are only released when the checks pass; otherwise the fields stay null and the player is left out of that category:
//   goals   Wikipedia's club rows must add up to its own career row (±1), AND Wikipedia must not be missing goals the API has for 2010 → last season
//           (the API is the witness for the modern era; it is allowed to be LOWER than Wikipedia — it has holes before 2010 — but not higher)
//   apps    the same, for appearances
//   intl    Wikipedia's senior total must exist and the API must not exceed it by more than 3 caps / 2 goals; the larger of the two is used (Wikipedia lags a few days)

import fs from 'node:fs';
import path from 'node:path';
import { findDuplicateDrops, isFriendly, isYouthOrOlympic, isNationalTeam, isNationalCompetition } from './aggregate.mjs';

export const startYear = season => Number(String(season).slice(0, 4));
// reserve and youth sides (Barcelona B / C, Real Madrid Castilla, Bayern II, Jong Ajax …) are rows in Wikipedia's career total, but the numbers fans know — "672 for Barcelona" — are first-team numbers
export const isReserve = club => /\s(B|C|II|III|IV|Castilla|Reserves?|Juvenil|U\d{2})$/i.test(String(club).replace(/\s*\(.*?\)\s*$/, '')) || /^Jong\s/i.test(club);


// The API's club numbers per season, first team only — the same lines p.seasons is built from, minus reserve sides, so both sides of the comparison mean the same thing.
export function apiClubSeasons(p, rawDir) {
  const raw = {};
  for (const y of Object.keys(p.seasons)) { try { raw[y] = JSON.parse(fs.readFileSync(path.join(rawDir, `${p.id}-${y}.json`), 'utf8')).response?.[0]?.statistics || []; } catch { raw[y] = []; } }
  const { drops } = findDuplicateDrops(raw);
  const bySeason = {}, perClub = {};
  for (const [y, lines] of Object.entries(raw)) lines.forEach((l, i) => {
    const team = l.team?.name;
    if (drops[y]?.has(i) || isFriendly(l.league?.name) || isYouthOrOlympic(team) || isNationalTeam(team, p.nationality) || isNationalCompetition(l.league?.name) || isReserve(team)) return;
    (bySeason[y] ||= { goals: 0, apps: 0 }); bySeason[y].goals += l.goals?.total || 0; bySeason[y].apps += l.games?.appearences || 0;
    if (team) { (perClub[y] ||= {}); perClub[y][team] = (perClub[y][team] || 0) + (l.goals?.total || 0); }
  });
  return { bySeason, perClub };
}

export function verifyCurrent(p, wp, current, api) {   // api = apiClubSeasons(p, rawDir)
  const fail = why => ({ ok: { goals: false, apps: false, intl: false }, why });
  if (!p || !wp || !wp.career || !wp.seasonRows?.length) return fail('no usable Wikipedia table');

  const sumRowsGoals = wp.seasonRows.reduce((a, r) => a + r.goals, 0);
  const tableAddsUp = Math.abs(sumRowsGoals - wp.career.goals) <= 1;

  // finished seasons from Wikipedia, per season (2010 onwards for the witness check)
  const wpBySeason = {};
  let wpFinishedGoals = 0, wpFinishedApps = 0;
  for (const r of wp.seasonRows) {
    if (isReserve(r.club)) continue;                                  // (the table-adds-up check above still uses every row)
    const y = startYear(r.season); if (!(y < current)) continue;
    wpFinishedGoals += r.goals; wpFinishedApps += r.apps;
    if (y >= 2010) { (wpBySeason[y] ||= { a: 0, g: 0 }); wpBySeason[y].a += r.apps; wpBySeason[y].g += r.goals; }
  }
  let missG = 0, missA = 0, winG = 0, winA = 0;
  const years = new Set([...Object.keys(wpBySeason).map(Number), ...Object.keys(api.bySeason).map(Number).filter(y => y >= 2010 && y < current)]);
  for (const y of years) {
    const a = api.bySeason[y] || { goals: 0, apps: 0 }, w = wpBySeason[y] || { g: 0, a: 0 };
    winG += w.g; winA += w.a;
    if (a.goals > w.g) missG += a.goals - w.g;
    if (a.apps > w.a) missA += a.apps - w.a;
  }
  const goalsOk = tableAddsUp && missG <= Math.max(3, 0.03 * winG);
  const appsOk = goalsOk && missA <= Math.max(8, 0.03 * winA);

  // national team
  let intl = null, intlOk = false;
  if (wp.intl) {
    const ai = p.since?.intl || { apps: 0, goals: 0 };
    intlOk = ai.apps <= wp.intl.apps + 3 && ai.goals <= wp.intl.goals + 2;
    if (intlOk) intl = { apps: Math.max(wp.intl.apps, ai.apps), goals: Math.max(wp.intl.goals, ai.goals) };
  }

  // the running season from the API (club lines only)
  const now = api.bySeason[current] || { goals: 0, apps: 0 };
  return {
    ok: { goals: goalsOk, apps: appsOk, intl: intlOk },
    clubGoals: wpFinishedGoals + now.goals, clubApps: wpFinishedApps + now.apps, intl,
    finishedRows: wp.seasonRows.filter(r => !isReserve(r.club) && startYear(r.season) < current),
    currentPerClub: api.perClub[current] || {},
    diag: { tableAddsUp, missG, missA, winG, winA }
  };
}
