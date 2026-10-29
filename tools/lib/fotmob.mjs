// FotMob (Opta data) as an independent second source: season by season, per competition, goals / assists / appearances, club and national team.
// Plain HTTP requests, one at a time with a pause — the same low-volume manners as the Wikipedia reader.
//
//   fotmobSearch(name)     → [{ id, name, team }]            the suggestions FotMob's own search box shows
//   fotmobPlayer(id)       → { id, name, born, seasons, national, clubs, trophies }   parsed from the player page
//
// seasons[]  = { season: '2024/2025' | '2024', team, apps, goals, assists, tournaments: [{ name, id, friendly, apps, goals, assists }] }
// FotMob only lists seasons from about 2002 on; before that a career is not covered (the teamEntries "clubs" totals carry a * when they are uncertain).

const UA = 'FootballRoyalQuiz/1.0 (personal quiz project; low-volume)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const int = v => { const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10); return Number.isFinite(n) ? n : null; };

async function get(url, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en' }, signal: AbortSignal.timeout(30000) });
      if (r.status === 429 || r.status >= 500) { last = new Error('HTTP ' + r.status); await sleep(4000 * (i + 1)); continue; }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.text();
    } catch (e) { last = e; await sleep(2500 * (i + 1)); }
  }
  throw last;
}

export async function fotmobSearch(term) {
  const body = await get(`https://apigw.fotmob.com/searchapi/suggest?term=${encodeURIComponent(term)}&lang=en`);
  const j = JSON.parse(body);
  const out = [];
  for (const g of j.squadMemberSuggest || []) for (const o of g.options || []) {
    if (o.payload?.isCoach) continue;
    const [name, id] = String(o.text).split('|');
    out.push({ id: Number(o.payload?.id || id), name, team: o.payload?.teamName || '' });
  }
  return out;
}

const parseSeasonEntry = s => ({
  season: String(s.seasonName),
  team: s.team || null,
  apps: int(s.appearances), goals: int(s.goals), assists: int(s.assists),
  tournaments: (s.tournamentStats || []).map(t => ({ name: t.leagueName, id: t.leagueId, friendly: !!t.isFriendly, apps: int(t.appearances), goals: int(t.goals), assists: int(t.assists) }))
});

export async function fotmobPlayer(id) {
  const html = await get(`https://www.fotmob.com/players/${id}/x`);
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('no page data');
  const pd = JSON.parse(m[1]).props?.pageProps?.data;
  if (!pd?.careerHistory) throw new Error('no career data');
  const items = pd.careerHistory.careerItems || {};
  const teamRow = t => ({ team: t.team, from: String(t.startDate || '').slice(0, 10) || null, to: String(t.endDate || '').slice(0, 10) || null, apps: int(t.appearances), goals: int(t.goals), assists: int(t.assists), uncertain: !!t.hasUncertainData || /\*/.test(String(t.appearances)) });
  return {
    id: Number(pd.id), name: pd.name, born: pd.birthDate?.utcTime?.slice(0, 10) || String(pd.birthDate || '').slice(0, 10) || null,
    team: pd.primaryTeam?.teamName || null,
    seasons: (items.senior?.seasonEntries || []).map(parseSeasonEntry),
    national: (items['national team']?.seasonEntries || []).map(parseSeasonEntry),
    clubs: (items.senior?.teamEntries || []).map(teamRow),
    nationalTotals: (items['national team']?.teamEntries || []).map(teamRow),
    trophies: (pd.trophies?.playerTrophies || []).flatMap(t => (t.tournaments || []).map(x => ({ team: t.teamName, league: x.leagueName, leagueId: x.leagueId, won: x.seasonsWon || [], runnerUp: x.seasonsRunnerUp || [] }))).filter(x => x.won.length),
    fetchedAt: new Date().toISOString().slice(0, 10)
  };
}

export const pause = sleep;
