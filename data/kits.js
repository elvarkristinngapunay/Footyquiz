// Kit data and SVG generator for player cards
// Each kit: body colour, accent colour, optional stripe colour + style, shirt number, back name

const KIT_DATA = {
  "Diego Maradona":       { body:"#087cc4", accent:"#ffffff", stripe:null,      num:10, label:"MARADONA" },
  "Johan Cruyff":         { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:14, label:"CRUYFF" },
  "Michel Platini":       { body:"#ffffff", accent:"#f5c518", stripe:"#111111", style:"juve",  num:10, label:"PLATINI" },
  "Franz Beckenbauer":    { body:"#dc052d", accent:"#ffffff", stripe:null,      num:5,  label:"BECKENBAUER" },
  "Gerd Müller":          { body:"#dc052d", accent:"#ffffff", stripe:null,      num:13, label:"G. MÜLLER" },
  "Marco van Basten":     { body:"#fb090b", accent:"#ffffff", stripe:"#111111", style:"milan", num:9,  label:"VAN BASTEN" },
  "Ruud Gullit":          { body:"#fb090b", accent:"#ffffff", stripe:"#111111", style:"milan", num:10, label:"GULLIT" },
  "Bobby Charlton":       { body:"#da291c", accent:"#ffe500", stripe:null,      num:9,  label:"CHARLTON" },
  "Ronaldinho":           { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:10, label:"RONALDINHO" },
  "David Beckham":        { body:"#da291c", accent:"#ffe500", stripe:null,      num:7,  label:"BECKHAM" },
  "Zlatan Ibrahimović":   { body:"#004170", accent:"#ee0000", stripe:null,      num:10, label:"IBRAHIMOVIĆ" },
  "Ronaldo Nazário":      { body:"#f5f5f5", accent:"#d4a017", stripe:null,      num:9,  label:"RONALDO" },
  "Zinedine Zidane":      { body:"#f5f5f5", accent:"#d4a017", stripe:null,      num:5,  label:"ZIDANE" },
  "Thierry Henry":        { body:"#ef0107", accent:"#ffffff", stripe:null,      num:14, label:"HENRY" },
  "Steven Gerrard":       { body:"#c8102e", accent:"#ffffff", stripe:null,      num:8,  label:"GERRARD" },
  "Frank Lampard":        { body:"#034694", accent:"#ffffff", stripe:null,      num:8,  label:"LAMPARD" },
  "Paul Scholes":         { body:"#da291c", accent:"#ffe500", stripe:null,      num:18, label:"SCHOLES" },
  "Didier Drogba":        { body:"#034694", accent:"#ffffff", stripe:null,      num:11, label:"DROGBA" },
  "Mohamed Salah":        { body:"#c8102e", accent:"#ffffff", stripe:null,      num:11, label:"SALAH" },
  "Wayne Rooney":         { body:"#da291c", accent:"#ffe500", stripe:null,      num:10, label:"ROONEY" },
  "Diego Costa":          { body:"#034694", accent:"#ffffff", stripe:null,      num:19, label:"D. COSTA" },
  "Samuel Eto'o":         { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:9,  label:"ETO'O" },
  "Fernando Torres":      { body:"#c8102e", accent:"#ffffff", stripe:null,      num:9,  label:"TORRES" },
  "Rivaldo":              { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:10, label:"RIVALDO" },
  "Arjen Robben":         { body:"#dc052d", accent:"#ffffff", stripe:null,      num:10, label:"ROBBEN" },
  "Franck Ribéry":        { body:"#dc052d", accent:"#ffffff", stripe:null,      num:7,  label:"RIBÉRY" },
  "David Villa":          { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:7,  label:"VILLA" },
  "Ruud van Nistelrooy":  { body:"#da291c", accent:"#ffe500", stripe:null,      num:10, label:"VAN NISTELROOY" },
  "Robin van Persie":     { body:"#ef0107", accent:"#ffffff", stripe:null,      num:11, label:"VAN PERSIE" },
  "Dennis Bergkamp":      { body:"#ef0107", accent:"#ffffff", stripe:null,      num:10, label:"BERGKAMP" },
  "Michael Owen":         { body:"#c8102e", accent:"#ffffff", stripe:null,      num:10, label:"OWEN" },
  "Xavi":                 { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:6,  label:"XAVI" },
  "Andrés Iniesta":       { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:8,  label:"INIESTA" },
  "Francesco Totti":      { body:"#cc0000", accent:"#f5a800", stripe:null,      num:10, label:"TOTTI" },
  "Alessandro Del Piero": { body:"#ffffff", accent:"#f5c518", stripe:"#111111", style:"juve",  num:10, label:"DEL PIERO" },
  "Gianfranco Zola":      { body:"#034694", accent:"#ffffff", stripe:null,      num:25, label:"ZOLA" },
  "Dani Alves":           { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:22, label:"DANI ALVES" },
  "Jordi Alba":           { body:"#003da5", accent:"#f5a800", stripe:"#a50044", style:"barca", num:18, label:"JORDI ALBA" },
  "Marcelo":              { body:"#f5f5f5", accent:"#d4a017", stripe:null,      num:12, label:"MARCELO" },
};

function generateKitSVG(playerName) {
  const k = KIT_DATA[playerName];
  if (!k) return null;

  const W = 340, H = 380;
  const bodyPath = "M 125 68 Q 170 88 215 68 L 275 92 L 312 108 L 308 168 L 268 150 L 264 310 Q 264 326 248 326 L 92 326 Q 76 326 76 310 L 72 150 L 28 168 L 24 108 L 65 92 Z";

  let stripesHTML = "";
  if (k.stripe && k.style === "barca") {
    stripesHTML = `<g clip-path="url(#kc)">
      <rect x="26"  y="60" width="27" height="280" fill="${k.stripe}"/>
      <rect x="80"  y="60" width="27" height="280" fill="${k.stripe}"/>
      <rect x="134" y="60" width="27" height="280" fill="${k.stripe}"/>
      <rect x="188" y="60" width="27" height="280" fill="${k.stripe}"/>
      <rect x="242" y="60" width="27" height="280" fill="${k.stripe}"/>
      <rect x="296" y="60" width="27" height="280" fill="${k.stripe}"/>
    </g>`;
  } else if (k.stripe && k.style === "juve") {
    stripesHTML = `<g clip-path="url(#kc)">
      <rect x="22"  y="60" width="40" height="280" fill="${k.stripe}"/>
      <rect x="102" y="60" width="40" height="280" fill="${k.stripe}"/>
      <rect x="182" y="60" width="40" height="280" fill="${k.stripe}"/>
      <rect x="262" y="60" width="40" height="280" fill="${k.stripe}"/>
    </g>`;
  } else if (k.stripe && k.style === "milan") {
    stripesHTML = `<g clip-path="url(#kc)">
      <rect x="22"  y="60" width="38" height="280" fill="${k.stripe}"/>
      <rect x="98"  y="60" width="38" height="280" fill="${k.stripe}"/>
      <rect x="174" y="60" width="38" height="280" fill="${k.stripe}"/>
      <rect x="250" y="60" width="38" height="280" fill="${k.stripe}"/>
    </g>`;
  }

  const bodyStroke = k.body === "#f5f5f5" ? "#cccccc" : k.body;
  const isLight = k.body === "#f5f5f5";
  const numColor = isLight ? (k.accent === "#d4a017" ? k.accent : "#111111") : k.accent;
  const nameColor = numColor;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">
  <defs>
    <filter id="ds">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#00000045"/>
    </filter>
    <clipPath id="kc">
      <path d="${bodyPath}"/>
    </clipPath>
  </defs>
  <g filter="url(#ds)">
    <path d="${bodyPath}" fill="${k.body}" stroke="${bodyStroke}" stroke-width="1.5"/>
    ${stripesHTML}
    <path d="${bodyPath}" fill="none" stroke="${bodyStroke}" stroke-width="1.5"/>
    <path d="M 140 68 Q 170 84 200 68 L 197 58 Q 170 72 143 58 Z" fill="${k.accent}" stroke="${k.accent === "#ffffff" ? "#cccccc" : k.accent}" stroke-width="1"/>
  </g>
  <text x="170" y="148" font-family="Arial Black,Arial,sans-serif" font-size="24" font-weight="900" fill="${nameColor}" text-anchor="middle" letter-spacing="1.5">${k.label}</text>
  <text x="170" y="278" font-family="Arial Black,Arial,sans-serif" font-size="125" font-weight="900" fill="${numColor}" text-anchor="middle">${k.num}</text>
</svg>`;
}
