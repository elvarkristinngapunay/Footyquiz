// What counts as a "trophy" in the game, and what it is called. Shared by build-top10.mjs and build-hol.mjs so both boards agree.
//
// /trophies?player= returns every honour the API knows — including youth tournaments, women's competitions, pre-season exhibitions,
// state championships and second-tier titles. Those are not what a fan means by "trophies won", so they are filtered out here.
// A row with no season is the API's per-competition summary of the rows that do have one, so it is never counted either.

const EXHIBITION = /gamper|catalunya|audi cup|international champions|emirates cup|friendl|testimonial|tournoi|trofeo|sky cup|\bICC\b|asia trophy|world challenge|florida cup|summer series|kirin|all-star|atlantic cup|carolina|queensland|lunar new year|algarve|tournament of nations|china cup|club challenge|euroamericana|liga pokal|copa (de la liga|dr|america of)/i;
const YOUTH = /\bU-?\d{2}\b|juvenil|junior|júnior|youth|premier league 2\b|división de honor|divisie 1/i;
const WOMEN = /women|femen|féminin|feminin|nwsl|\bwps\b|damallsvenskan|shebelieves/i;
const QUALIFIERS = /qualif/i;
const LOWER_TIER = /^(serie b|championship|segunda división|2\. bundesliga|3\. liga|j2 league|eerste divisie|primera división rfef|national league)$/i;
const STATE_CHAMPIONSHIP = /gaúcho|paulista|carioca|mineiro|paranaense|baiano/i;

export const isWomensTrophy = t => WOMEN.test(t.league || '');
export const hasWomensTrophy = rows => (rows || []).some(isWomensTrophy);

export function isMajorTrophy(t) {
  if (!/winner/i.test(t.place || '') || !String(t.season || '').trim()) return false;
  const n = t.league || '';
  return !(EXHIBITION.test(n) || YOUTH.test(n) || WOMEN.test(n) || QUALIFIERS.test(n) || LOWER_TIER.test(n) || STATE_CHAMPIONSHIP.test(n));
}

// Names that only make sense with their country ("Cup", "Premier League" …). The English Premier League stays plain.
const NEEDS_COUNTRY = { 'Cup': null, 'Super Cup': null, 'Premier League': 'England', 'Premiership': null, 'Super League': null, 'Super Liga': null, 'Superliga': null, 'First League': null,
  'Primera División': null, 'Primera A': null, 'Liga 1': null, 'Liga Pro': null, 'Super Copa': null, 'HNL': null, 'First Division A': null };
const COUNTRY = { 'Holland': 'Netherlands', 'Türkiye': 'Turkey', 'China PR': 'China', 'United-Arab-Emirates': 'UAE', 'Saudi-Arabia': 'Saudi Arabia' };
const SAME = { 'European Championship': 'UEFA European Championship', 'World Cup': 'FIFA World Cup', 'Copa America': 'CONMEBOL Copa America', 'Africa Cup of Nations': 'CAF Africa Cup of Nations',
  'Olympics Men': 'Olympic Games', 'Olympics': 'Olympic Games', 'AFC Champions League Elite': 'AFC Champions League', 'Holland Super Cup': 'Netherlands Super Cup', 'Türkiye Super Cup': 'Turkey Super Cup' };

export function trophyLabel(t) {
  const country = COUNTRY[t.country] || t.country || '';
  let name = t.league || '';
  if (name in NEEDS_COUNTRY) {
    if (name === 'Super Cup') name = `${country} Super Cup`;
    else if (name === 'Cup') name = `${country} Cup`;
    else if (NEEDS_COUNTRY[name] !== country) name = `${name} (${country})`;
  }
  for (const [from, to] of Object.entries(COUNTRY)) name = name.replace(from, to);
  return SAME[name] || name;
}
