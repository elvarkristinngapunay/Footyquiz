// Which player belongs to which deck. Loaded after players.js, legends-*.js, players-era.js and players-modern.js.
//
//   Current players   PLAYERS_MODERN — still playing (games in the last two seasons), refreshed weekly
//   2000s era         retired players whose careers were played in 2000 or later (PLAYERS + PLAYERS_ERA), some are legends too
//   Legends           the all-time greats among the retired players — a hand-picked list, so the decks can overlap (Ronaldinho, Beckham …)
//
// A player who is still playing is only ever in Current players, even if an older deck holds his name.
const _foldName = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// careers that ended before 2000 → Legends only, never the 2000s era
const DECK_PRE2000 = ['Diego Maradona', 'Johan Cruyff', 'Michel Platini', 'Franz Beckenbauer', 'Gerd Müller', 'Marco van Basten', 'Ruud Gullit', 'Bobby Charlton'];
// legends who also played in the 2000s era (they are in both decks)
const DECK_LEGENDS_BOTH = [
  'Ronaldinho', 'David Beckham', 'Zlatan Ibrahimović', 'Ronaldo Nazário', 'Zinedine Zidane', 'Thierry Henry', 'Steven Gerrard', 'Frank Lampard', 'Paul Scholes',
  'Didier Drogba', 'Wayne Rooney', "Samuel Eto'o", 'Fernando Torres', 'Rivaldo', 'Arjen Robben', 'Franck Ribéry', 'David Villa', 'Ruud van Nistelrooy',
  'Robin van Persie', 'Dennis Bergkamp', 'Michael Owen', 'Xavi', 'Andrés Iniesta', 'Francesco Totti', 'Alessandro Del Piero', 'Gianfranco Zola', 'Dani Alves',
  'Marcelo', 'Sergio Agüero', 'Eden Hazard', 'Toni Kroos', 'Gerard Piqué',
  'Paolo Maldini', 'Roberto Baggio', 'Eric Cantona', 'Gabriel Batistuta', 'Raúl', 'Gianluigi Buffon', 'Iker Casillas', 'Carles Puyol', 'Andrea Pirlo', 'Kaká',
  'Luís Figo', 'Roberto Carlos', 'Cafu', 'Alessandro Nesta', 'Fabio Cannavaro', 'Patrick Vieira', 'Andriy Shevchenko', 'Pavel Nedvěd', 'Philipp Lahm',
  'Bastian Schweinsteiger', 'Miroslav Klose', 'Oliver Kahn', 'Edwin van der Sar', 'Ryan Giggs', 'John Terry', 'Rio Ferdinand', 'Nemanja Vidić', 'Alan Shearer',
  'Romário', 'Hristo Stoichkov', 'Xabi Alonso', 'Clarence Seedorf', 'Gennaro Gattuso', 'Javier Zanetti', 'Lilian Thuram', 'Claude Makélélé', 'Deco'
];
const DECK_LEGEND_SET = new Set(DECK_PRE2000.concat(DECK_LEGENDS_BOTH).map(_foldName));
const DECK_PRE2000_SET = new Set(DECK_PRE2000.map(_foldName));

// every retired player we hold (PLAYERS first: its record wins), minus anyone who is in the Current deck
function deckRetired() {
  const active = new Set((typeof PLAYERS_MODERN !== 'undefined' ? PLAYERS_MODERN : []).map(p => _foldName(p.name)));
  const seen = new Set(), out = [];
  const add = list => list.forEach(p => { const k = _foldName(p.name); if (active.has(k) || seen.has(k)) return; seen.add(k); out.push(p); });
  add(typeof PLAYERS !== 'undefined' ? PLAYERS : []);
  add(typeof PLAYERS_ERA !== 'undefined' ? PLAYERS_ERA : []);
  return out;
}
const deckLegends = () => deckRetired().filter(p => DECK_LEGEND_SET.has(_foldName(p.name)));
const deckEra = () => deckRetired().filter(p => !DECK_PRE2000_SET.has(_foldName(p.name)));
const deckCurrent = () => (typeof PLAYERS_MODERN !== 'undefined' ? PLAYERS_MODERN : []);
