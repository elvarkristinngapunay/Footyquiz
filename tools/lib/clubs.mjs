// One name for every club, so a club written three ways ("Manchester Utd" in the hand-made Legends, "Man United" in the logo table, "Manchester United" at
// Wikipedia / FotMob / API-Football) is the same club. The name returned is the key in data/club-logos.js, so the badge shows. Used by tools/build-daily.mjs.
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\b(fc|cf|afc|sc|ac|as|ss|ssc|rc|rcd|ud|sv|vfl|vfb|fsv|tsg|1)\b/g, ' ').replace(/\s+/g, ' ').trim();
const ALIAS = {
  'manchester city': 'Man City', 'manchester united': 'Man United', 'manchester utd': 'Man United', 'man utd': 'Man United', 'paris saint germain': 'PSG', 'paris sg': 'PSG',
  'bayern munchen': 'Bayern Munich', 'bayern munich': 'Bayern Munich', 'atletico madrid': 'Atlético Madrid', 'inter': 'Inter Milan', 'internazionale': 'Inter Milan', 'milan': 'AC Milan',
  'wolves': 'Wolverhampton', 'wolverhampton wanderers': 'Wolverhampton', 'olympique lyonnais': 'Lyon', 'olympique de marseille': 'Marseille', 'as monaco': 'Monaco', 'monaco': 'Monaco',
  'tottenham hotspur': 'Tottenham', 'spurs': 'Tottenham', 'newcastle united': 'Newcastle', 'west ham united': 'West Ham', 'leicester city': 'Leicester City', 'borussia monchengladbach': 'Borussia Mönchengladbach'
};
export function makeClubCanon(logos) {
  const idx = new Map(Object.keys(logos).map(k => [norm(k), k]));
  const parent = t => String(t || '').replace(/\s*\(.*?\)\s*/g, ' ').replace(/[\s-]+(B|C|II|III|IV|2|Castilla|U\d\d)$/i, '').replace(/^Jong\s+/i, '').replace(/-2(\s|$)/, '$1').replace(/\s+/g, ' ').trim();
  const logoKey = t => { const n = norm(t); return ALIAS[n] || idx.get(n) || [...idx].find(([k]) => k.length > 3 && (n.includes(k) || k.includes(n)))?.[1]; };
  return { norm, parent, logoKey, canon: name => { const p = parent(name); return logoKey(p) || p; } };
}
