// One Transfermarkt player (the per-game harvest in data/raw/transfermarkt/tm-harvest.json) → club seasons and senior national-team seasons from a given year on.
// Youth leagues, reserve teams and national youth teams ("Portugal U21", "Olympic Team") are left out. Used as an independent witness in verify-assists.mjs.
import { isReserve } from './verify-current.mjs';

const YOUTH_TYPES = new Set([7, 15, 16, 18, 20, 23]);                    // youth leagues/cups, youth qualifiers, reserve leagues (Transfermarkt competition type ids)
const YOUTH_TEAM = /\bU-?\d{2}\b|olympic|\bB\b|amateur|\bXI\b/i;           // national youth teams are separate "clubs": "Portugal U21", "Olympic Team"

// one player's harvested per-game rows → club seasons and national-team seasons from 2016 on
export function tmSeasons(tmPlayer, clubs, comps, from = 2016) {
  const club = new Map();                                                // season → { assists, apps, teams: Map(name → { assists, apps }), lines: [{ team, comp, assists, apps }] }
  const nat = new Map();                                                 // season → { assists, apps }
  for (const [key, v] of Object.entries(tmPlayer.agg)) {
    const [season, clubId, compId, isNat] = key.split('|'), y = Number(season); if (!(y >= from)) continue;
    const c = clubs[clubId], comp = comps[compId]; if (!c) continue;
    const [apps, , assists] = v;
    if (isNat === '1') {
      if (!c.nt || YOUTH_TEAM.test(c.n)) continue;
      const e = nat.get(y) || { assists: 0, apps: 0 }; e.assists += assists; e.apps += apps; nat.set(y, e); continue;
    }
    if (YOUTH_TYPES.has(comp?.ty) || isReserve(c.n)) continue;
    const e = club.get(y) || { assists: 0, apps: 0, teams: new Map(), lines: [] };
    e.assists += assists; e.apps += apps;
    const t = e.teams.get(c.n) || { assists: 0, apps: 0 }; t.assists += assists; t.apps += apps; e.teams.set(c.n, t);
    e.lines.push({ team: c.n, comp: comp?.n || compId, assists, apps });
    club.set(y, e);
  }
  return { club, nat };
}

