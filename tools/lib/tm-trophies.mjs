// Transfermarkt honours → the game's "Major Trophies". Input: one honour row from the harvest, { n: 6, t: 'English Champion', rows: [[season, club], …] }.
// A major trophy is a team title won at senior level: league titles, domestic cups, league cups, super cups, continental and world club titles, national-team tournaments.
// Not counted: individual awards (Ballon d'Or, Footballer of the Year, top scorer …), youth and reserve titles, second-tier titles, state championships, regional and exhibition tournaments.

const NOT_TEAM_TROPHY = new RegExp([
  'player of|footballer of|top goal|ballon|golden (boot|boy|ball)|best (player|fifa)|newcomer|\\bmvp\\b|medal',     // individual awards and medals
  'under-?\\s?\\d|\\bu-?\\d{2}\\b|youth|primavera|juniores|viareggio|algarve|u21 premier|international cup',        // youth, reserve
  'zweit|2nd tier|second tier|3rd tier|third tier|2nd league|second league|regionalliga|série b|serie b|primera nacional|champion 2nd', // lower tiers
  'campe(ã|a)o (paulista|carioca|gaúcho|gaucho|mineiro)|recopa gáucha|aliança|campeonato brasileiro s',             // Brazilian state titles
  'derby of the americas|challenger cup|east asian|cafa|baden|sudwest|middle rhine|ui cup|suruga|supporters|olympic|asian games', // exhibitions, regional
  'auf (apertura|clausura)|champion liga auf|trofeo de campeones|proyección|regular season|j1 league 100|j\\. league',          // partial seasons, one-off formats
].join('|'), 'i');

// league titles: "<Nationality> champion" → league name
const LEAGUE = { English: 'Premier League', Spanish: 'La Liga', German: 'Bundesliga', Italian: 'Serie A', French: 'Ligue 1', Portuguese: 'Primeira Liga', Dutch: 'Eredivisie',
  Turkish: 'Süper Lig', Scottish: 'Scottish Premiership', Belgian: 'Belgian Pro League', Russian: 'Russian Premier League', 'Saudi Arabian': 'Saudi Pro League', Japanese: 'J1 League',
  Swiss: 'Swiss Super League', Austrian: 'Austrian Bundesliga', Croatian: 'Croatian First League', Serbian: 'Serbian SuperLiga', Greek: 'Super League Greece', Ukrainian: 'Ukrainian Premier League',
  Argentinian: 'Argentine Primera División', Brazilian: 'Brasileirão', Uruguayan: 'Uruguayan Primera División', Chilean: 'Chilean Primera División', Colombian: 'Colombian Primera A',
  Swedish: 'Allsvenskan', Qatari: 'Qatar Stars League', UAE: 'UAE Pro League', Icelandic: 'Icelandic Premier League', Danish: 'Danish Superliga', Chinese: 'Chinese Super League',
  Cypriot: 'Cypriot First Division', Hungarian: 'Hungarian NB I', Polish: 'Ekstraklasa', Czech: 'Czech First League', Ecuadorian: 'Ecuadorian Serie A', 'Hong Kong': 'Hong Kong Premier League',
  'Cape Verdean': 'Cape Verdean Championship' };
const CUP = { English: 'FA Cup', Spanish: 'Copa del Rey', German: 'DFB-Pokal', Italian: 'Coppa Italia', French: 'Coupe de France', Portuguese: 'Taça de Portugal', Dutch: 'KNVB Cup',
  Turkish: 'Turkish Cup', Belgian: 'Belgian Cup', Russian: 'Russian Cup', Scottish: 'Scottish Cup', Japanese: "Emperor's Cup", Brazilian: 'Copa do Brasil', Argentinian: 'Copa Argentina' };
const LEAGUE_CUP = { English: 'League Cup', French: 'Coupe de la Ligue', Portuguese: 'Taça da Liga', Scottish: 'Scottish League Cup', Japanese: 'J.League Cup' };
const SUPER_CUP = { English: 'Community Shield', Spanish: 'Supercopa de España', German: 'DFL-Supercup', Italian: 'Supercoppa Italiana', French: 'Trophée des Champions', Portuguese: 'Supertaça',
  Dutch: 'Johan Cruyff Shield' };

const FIXED = [
  [/^English FA Cup winner$/i, 'FA Cup'], [/^UEFA Champions League winner$/i, 'UEFA Champions League'], [/^Uefa Supercup winner$/i, 'UEFA Super Cup'], [/^Europa League winner$/i, 'UEFA Europa League'],
  [/^Uefa Cup winner$/i, 'UEFA Cup'], [/^Conference League winner$/i, 'UEFA Conference League'], [/^FIFA Club World Cup winner$/i, 'FIFA Club World Cup'],
  [/^(FIFA )?Intercontinental Cup winner$/i, 'Intercontinental Cup'], [/^Winner UEFA Nations League$/i, 'UEFA Nations League'], [/^World Cup winner$/i, 'World Cup'],
  [/^European champion$/i, 'European Championship'], [/^Copa América winner$/i, 'Copa América'], [/^Africa Cup winner$/i, 'Africa Cup of Nations'],
  [/^Confederations Cup winner$/i, 'Confederations Cup'], [/^Asian Cup winner$/i, 'AFC Asian Cup'], [/^Gold Cup winner$/i, 'CONCACAF Gold Cup'],
  [/^CONCACAF Nations League Winner$/i, 'CONCACAF Nations League'], [/^CONMEBOL-UEFA Cup of Champions winner$/i, 'Finalissima'],
  [/^Copa Libertadores winner$/i, 'Copa Libertadores'], [/^Copa Sudamericana winner$/i, 'Copa Sudamericana'], [/^Recopa Sudamericana winner$/i, 'Recopa Sudamericana'],
  [/^AFC Champions League winner$/i, 'AFC Champions League'], [/^CONCACAF Champions League winner$/i, 'CONCACAF Champions League'], [/^Leagues Cup Winner$/i, 'Leagues Cup'],
  [/^Campeones Cup Winner$/i, 'Campeones Cup'], [/^MLS Cup Champion$/i, 'MLS Cup'], [/^Mexican (Clausura champion|Champion Apertura)$/i, 'Liga MX'],
  [/^Mexican Campe(ó|o)n de Campe(ó|o)nes$/i, 'Campeón de Campeones'], [/^Winner Supercopa do Brasil$/i, 'Supercopa do Brasil'], [/^Campe(ó|o)n Supercopa Argentina$/i, 'Supercopa Argentina'],
  [/^US Open Cup Winner$/i, 'US Open Cup'], [/^Saudi Super Cup Winner$/i, 'Saudi Super Cup'], [/^Saudi Cup Winner$/i, "Saudi King's Cup"], [/^Saudi Crown Prince Cup Winner$/i, 'Crown Prince Cup'],
  [/^Qatari Cup Winner/i, 'Emir of Qatar Cup'], [/^Qatari Stars Cup Winner$/i, 'Qatar Stars Cup'], [/^UAE League Cup Winner$/i, 'UAE League Cup'], [/^UAE President's Cup winner$/i, "UAE President's Cup"],
  [/^UAE Supercup Winner$/i, 'UAE Super Cup'],
];

// → the label to show, or null when the honour is not a major trophy
export function tmTrophyLabel(title) {
  const t = title.trim();
  if (NOT_TEAM_TROPHY.test(t)) return null;
  for (const [re, label] of FIXED) if (re.test(t)) return label;
  let m;
  if ((m = t.match(/^(.+?) champions?$/i))) { const nat = m[1].replace(/^Winner /i, ''); return LEAGUE[nat] || `${nat} league`; }
  if ((m = t.match(/^(.+?) league cup winner$/i))) return LEAGUE_CUP[m[1]] || `${m[1]} League Cup`;
  if ((m = t.match(/^(.+?) super ?cup winner$/i))) return SUPER_CUP[m[1]] || `${m[1]} Super Cup`;
  if ((m = t.match(/^(.+?) cup winner$/i))) return CUP[m[1]] || `${m[1]} Cup`;
  return null;
}

// harvested honours for one player → [{ label, n }] sorted most-won first, plus the total
export function tmTrophies(honours) {
  const by = new Map();
  for (const h of honours || []) { const label = tmTrophyLabel(h.t); if (label) by.set(label, (by.get(label) || 0) + h.n); }
  const list = [...by].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n || a.label.localeCompare(b.label));
  return { list, total: list.reduce((s, x) => s + x.n, 0) };
}
