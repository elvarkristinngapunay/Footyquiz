// Turns one player-season from API-Football (`/players?id=…&season=…` → response[0].statistics[]) into plain totals.
//
// Rules (so the game's numbers match what fans mean by "goals"):
//   · club friendlies and pre-season tournaments are dropped; national-team friendlies count (that is how caps and international goals are quoted)
//   · youth national teams (U17, U21, Olympic…) are dropped
//   · everything else counts: league, cups, Europe, qualifiers, tournaments
//   · matches for the player's national team go into `intl`, the rest into `club`
//   · the API sends `null` instead of 0 — null counts as 0

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

// Friendlies and pre-season exhibitions are not official matches. The API files them under many names ("Friendlies", "Club Friendlies", "International Champions Cup" …).
const EXHIBITION = /international champions cup|emirates cup|asia trophy|summer series|kirin|all-star|trofeo de campeones|audi cup|florida cup|world challenge|joan gamper|testimonial|international cup|summer cup|tournoi/i;
export const isFriendly = leagueName => /friendl/i.test(leagueName || '') || EXHIBITION.test(leagueName || '');
// National-team competitions are recognised by name too, because the country in the team name is not always spelled like the nationality (Côte d'Ivoire / Ivory Coast)
const NATIONAL_COMP = /world cup|wc qualif|european championship|euro championship|nations league|copa america|africa cup|asian cup|gold cup|confederations|finalissima|qualif/i;
const NOT_NATIONAL_COMP = /club|champions league|libertadores|sudamericana|olympic|\bU-?\d{2}\b|women/i;
export const isNationalCompetition = n => NATIONAL_COMP.test(n || '') && !NOT_NATIONAL_COMP.test(n || '');
export const isYouthOrOlympic = teamName => /\bU-?\d{2}\b|olympic/i.test(teamName || '');

// A national-team entry has the country as its "team" ("Argentina"). Nationalities are sometimes spelled differently
// ("Korea Republic" / "South Korea"), so also accept one containing the other.
export function isNationalTeam(teamName, nationality) {
  const t = norm(teamName), n = norm(nationality);
  if (!t || !n) return false;
  return t === n || t.includes(n) || n.includes(t);
}

export const FIELDS = ['apps', 'minutes', 'goals', 'assists', 'yellow', 'red', 'shots', 'shotsOn', 'passes', 'keyPasses', 'tackles', 'dribblesWon', 'penScored', 'penMissed', 'saves'];
// The five leagues where this API is cleanest (and that fans mean by "the big five"). Checked by country too — Brazil also has a "Serie A".
const BIG5 = { 'Premier League': 'England', 'La Liga': 'Spain', 'Serie A': 'Italy', 'Bundesliga': 'Germany', 'Ligue 1': 'France' };
export const isBigFive = league => !!league && BIG5[league.name] === league.country;

const zero = () => Object.fromEntries(FIELDS.map(f => [f, 0]));
const add = (acc, s) => {
  acc.apps += s.games?.appearences || 0;      // (sic) the API spells it "appearences"
  acc.minutes += s.games?.minutes || 0;
  acc.goals += s.goals?.total || 0;
  acc.assists += s.goals?.assists || 0;
  acc.saves += s.goals?.saves || 0;
  acc.yellow += s.cards?.yellow || 0;
  acc.red += (s.cards?.red || 0) + (s.cards?.yellowred || 0);
  acc.shots += s.shots?.total || 0;
  acc.shotsOn += s.shots?.on || 0;
  acc.passes += s.passes?.total || 0;
  acc.keyPasses += s.passes?.key || 0;
  acc.tackles += s.tackles?.total || 0;
  acc.dribblesWon += s.dribbles?.success || 0;
  acc.penScored += s.penalty?.scored || 0;
  acc.penMissed += s.penalty?.missed || 0;
};

export function aggregateSeason(statistics, nationality, dropIdx = new Set()) {
  const out = { club: zero(), intl: zero(), big5: zero(), perClub: {}, skipped: { friendlies: zero(), youth: zero(), duplicates: zero() }, clubs: [], entries: [] };
  for (const [i, s] of (statistics || []).entries()) {
    if (dropIdx.has(i)) { add(out.skipped.duplicates, s); continue; }   // a copy of a line that is already counted elsewhere
    const e = { league: s.league?.name, team: s.team?.name, apps: s.games?.appearences || 0, goals: s.goals?.total || 0, assists: s.goals?.assists || 0 };
    // National-team friendlies DO count (caps and goals are always quoted that way — Transfermarkt: Messi 208 / 126, Ronaldo 143 goals for Portugal);
    // club friendlies and pre-season tournaments do not (Transfermarkt's club tables only list competitive matches).
    const nationalFriendly = isFriendly(s.league?.name) && isNationalTeam(s.team?.name, nationality) && !/tournoi|women/i.test(s.league?.name || '');
    if (isFriendly(s.league?.name) && !nationalFriendly) { add(out.skipped.friendlies, s); continue; }
    if (isYouthOrOlympic(s.team?.name)) { add(out.skipped.youth, s); continue; }
    if (nationalFriendly) { add(out.intl, s); continue; }   // not part of the quality checks (those look for repeated competition lines)
    out.entries.push(e);                      // kept only to run the quality checks; stripped before anything is published
    if (isNationalTeam(s.team?.name, nationality) || isNationalCompetition(s.league?.name)) add(out.intl, s);
    else {
      add(out.club, s);
      if (isBigFive(s.league)) add(out.big5, s);
      if (s.team?.name) out.perClub[s.team.name] = (out.perClub[s.team.name] || 0) + (s.goals?.total || 0);
      if (s.team?.name && !out.clubs.includes(s.team.name)) out.clubs.push(s.team.name);
    }
  }
  return out;
}

export function sumInto(total, part) {
  for (const k of FIELDS) total[k] = (total[k] || 0) + (part[k] || 0);
  return total;
}

// ── quality checks ─────────────────────────────────────────────────────────────────────
// The API has bad lines now and then (we saw one Saudi line repeated under 3 competition names, and half a Miami season missing).
// A player with any of these is marked "review" and is not published until someone has looked at them.
export function qualityIssues(seasonsObj, fromSeason, toSeason) {
  const issues = [];
  // 1) the same BIG (apps, goals, assists) line under different competitions/seasons — small lines like 6/1/0 repeat by coincidence,
  //    but 24 apps / 19 goals / 3 assists five times is the API's Saudi bug.
  const seen = new Map();
  for (const [season, s] of Object.entries(seasonsObj)) for (const e of s.entries || []) {
    if (e.apps < 6 || (e.goals === 0 && e.assists === 0)) continue;
    const k = `${e.apps}/${e.goals}/${e.assists}`;
    (seen.get(k) || seen.set(k, []).get(k)).push(`${season} ${e.league}`);
  }
  for (const [k, where] of seen) {
    const [apps, goals, assists] = k.split('/').map(Number);
    const big = apps >= 14 && goals + assists >= 5;
    const mid = apps >= 10 && goals + assists >= 3;          // a small line repeated 4× (6 games, 1 goal) is coincidence; a medium one is not
    if ((big && where.length > 1) || (mid && where.length >= 4)) issues.push(`same line ${k} appears ${where.length}× (${where.join('; ')})`);
  }
  // 2) impossible numbers
  for (const [season, s] of Object.entries(seasonsObj)) {
    const apps = s.club.apps + s.intl.apps, goals = s.club.goals + s.intl.goals;
    if (apps > 85) issues.push(`${season}: ${apps} appearances`);
    if (apps >= 5 && goals > apps * 2.2) issues.push(`${season}: ${goals} goals in ${apps} games`);
    if (s.club.minutes > 0 && s.club.apps > 0 && s.club.minutes / s.club.apps > 100) issues.push(`${season}: ${Math.round(s.club.minutes / s.club.apps)} min per game`);
  }
  // 3) a hole in the middle of a career (a season with no entries between seasons that have some)
  const have = Object.entries(seasonsObj).filter(([, s]) => (s.entries || []).length).map(([y]) => Number(y)).sort((a, b) => a - b);
  const notes = [];
  for (let y = have[0] + 1; y < have[have.length - 1]; y++) if (!have.includes(y)) notes.push(`no data for ${y} between ${have[0]} and ${have[have.length - 1]}`);
  issues.notes = notes;
  return issues;
}


// ── repairing the API's repeated lines ───────────────────────────────────────────────
// The same big line (e.g. 24 apps / 19 goals / 3 assists) sometimes shows up under several competitions or seasons (Saudi data especially).
// For career totals it does not matter WHICH season holds the real one, only that it is counted once. So: keep one, drop the copies.
// Which one is kept: a big-five league line first, then any league-like competition, then the earliest season.
export const leagueLike = n => /league|liga|serie|bundesliga|ligue|primera|eredivisie|super lig|premiership/i.test(n || '') && !/cup|champions|europa|conference|super cup|supercopa|supercup/i.test(n || '');
export function findDuplicateDrops(statsBySeason) {          // { season: statistics[] }  →  { season: Set(index) } + a readable list
  const groups = new Map();
  for (const [season, list] of Object.entries(statsBySeason)) (list || []).forEach((s, i) => {
    if (isFriendly(s.league?.name) || isYouthOrOlympic(s.team?.name)) return;
    const apps = s.games?.appearences || 0, goals = s.goals?.total || 0, assists = s.goals?.assists || 0;
    if (apps < 14 || goals + assists < 5) return;             // small lines repeat by coincidence — only big ones are treated as copies
    const k = `${apps}/${goals}/${assists}`;
    (groups.get(k) || groups.set(k, []).get(k)).push({ season: Number(season), i, league: s.league?.name, team: s.team?.name, big5: isBigFive(s.league) });
  });
  const drops = {}, notes = [];
  for (const [k, occ] of groups) {
    if (occ.length < 2) continue;
    occ.sort((a, b) => (b.big5 - a.big5) || (leagueLike(b.league) - leagueLike(a.league)) || (a.season - b.season));
    const keep = occ[0];
    for (const o of occ.slice(1)) { (drops[o.season] ||= new Set()).add(o.i); }
    notes.push(`line ${k}: kept ${keep.season} ${keep.league}, dropped ${occ.slice(1).map(o => `${o.season} ${o.league}`).join('; ')}`);
  }
  return { drops, notes };
}
