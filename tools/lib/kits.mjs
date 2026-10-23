// Shirt colours for the "Current players" deck, so their cards look exactly like the Legends (data/kits.js draws the same SVG from { body, accent, stripe, style, num, label }).
// Colours are the clubs' main home colours; clubs that are not listed get a stable colour from their name, so a card never looks "unfinished".
// style: 'barca' (wide stripes), 'juve' (stripes), 'milan' (narrow stripes) — see generateKitSVG in data/kits.js. body '#f5f5f5' is the "white shirt" the generator knows.

const W = '#f5f5f5';
// [pattern matched against the club name, kit]
const CLUBS = [
  [/real madrid/, { body: W, accent: '#d4a017' }],
  [/barcelona/, { body: '#003da5', accent: '#f5a800', stripe: '#a50044', style: 'barca' }],
  [/atl[eé]tico madrid|atletico madrid/, { body: '#cb3524', accent: '#1d3a8a', stripe: '#ffffff', style: 'milan' }],
  [/sevilla/, { body: W, accent: '#d4131b' }],
  [/real sociedad/, { body: '#1a5fb4', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/real betis|betis/, { body: '#0bb363', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/villarreal/, { body: '#ffe667', accent: '#005187' }],
  [/valencia/, { body: W, accent: '#111111' }],
  [/athletic/, { body: '#e50b1c', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/levante|granada|deportivo/, { body: '#004a9f', accent: '#ffffff' }],
  [/bayern/, { body: '#dc052d', accent: '#ffffff' }],
  [/dortmund/, { body: '#fde100', accent: '#111111' }],
  [/leverkusen/, { body: '#e32221', accent: '#111111' }],
  [/leipzig/, { body: W, accent: '#dd0741' }],
  [/eintracht|frankfurt/, { body: '#e1000f', accent: '#111111' }],
  [/stuttgart/, { body: W, accent: '#e32219' }],
  [/wolfsburg/, { body: '#65b32e', accent: '#ffffff' }],
  [/hertha/, { body: '#005ca9', accent: '#ffffff' }],
  [/schalke/, { body: '#004d9d', accent: '#ffffff' }],
  [/freiburg|mainz|union berlin|hoffenheim|werder|augsburg|bochum|heidenheim|koln|k[oö]ln/, { body: '#d4131b', accent: '#ffffff' }],
  [/liverpool/, { body: '#c8102e', accent: '#ffffff' }],
  [/manchester united|man united/, { body: '#da291c', accent: '#ffe500' }],
  [/manchester city|man city/, { body: '#6cabdd', accent: '#ffffff' }],
  [/arsenal/, { body: '#ef0107', accent: '#ffffff' }],
  [/chelsea/, { body: '#034694', accent: '#ffffff' }],
  [/tottenham/, { body: W, accent: '#132257' }],
  [/newcastle/, { body: '#111111', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/aston villa/, { body: '#7b003c', accent: '#95bfe5' }],
  [/west ham/, { body: '#7a263a', accent: '#1bb1e7' }],
  [/brighton/, { body: '#0057b8', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/everton/, { body: '#003399', accent: '#ffffff' }],
  [/nottingham|forest/, { body: '#dd0000', accent: '#ffffff' }],
  [/wolverhampton|wolves/, { body: '#fdb913', accent: '#111111' }],
  [/crystal palace/, { body: '#1b458f', accent: '#c4122e', stripe: '#c4122e', style: 'milan' }],
  [/leeds/, { body: W, accent: '#1d428a' }],
  [/burnley/, { body: '#6c1d45', accent: '#99d6ea' }],
  [/bournemouth/, { body: '#da291c', accent: '#111111', stripe: '#111111', style: 'milan' }],
  [/fulham/, { body: W, accent: '#111111' }],
  [/brentford/, { body: '#e30613', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/sunderland/, { body: '#eb172b', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/paris saint|psg/, { body: '#004170', accent: '#ee0000' }],
  [/monaco/, { body: '#e2231a', accent: '#ffffff' }],
  [/marseille/, { body: W, accent: '#2faee0' }],
  [/lyon/, { body: W, accent: '#1a3a8a' }],
  [/lille/, { body: '#e01e13', accent: '#ffffff' }],
  [/nice|rennes|lens|nantes|strasbourg|toulouse/, { body: '#d4131b', accent: '#111111' }],
  [/inter miami/, { body: '#f7b5cd', accent: '#231f20' }],
  [/juventus/, { body: W, accent: '#f5c518', stripe: '#111111', style: 'juve' }],
  [/inter\b|internazionale/, { body: '#0a3a8a', accent: '#f5c518', stripe: '#111111', style: 'milan' }],
  [/ac milan|^milan/, { body: '#fb090b', accent: '#ffffff', stripe: '#111111', style: 'milan' }],
  [/napoli/, { body: '#12a0d7', accent: '#ffffff' }],
  [/roma/, { body: '#8e1f2f', accent: '#f0bc42' }],
  [/lazio/, { body: '#87d8f7', accent: '#ffffff' }],
  [/atalanta/, { body: '#1e71b8', accent: '#ffffff', stripe: '#111111', style: 'milan' }],
  [/fiorentina/, { body: '#5b2d90', accent: '#ffffff' }],
  [/bologna/, { body: '#1a2f5a', accent: '#ffffff', stripe: '#a50044', style: 'barca' }],
  [/como/, { body: '#1d4ea1', accent: '#ffffff' }],
  [/genoa/, { body: '#a50044', accent: '#0b2e6f' }],
  [/torino/, { body: '#8b1a1a', accent: '#ffffff' }],
  [/udinese|pisa|cagliari|verona|sassuolo|lecce|parma|cremonese/, { body: W, accent: '#111111' }],
  [/benfica/, { body: '#e30613', accent: '#ffffff' }],
  [/porto/, { body: W, accent: '#003da5', stripe: '#003da5', style: 'milan' }],
  [/sporting/, { body: '#00a859', accent: '#ffffff' }],
  [/ajax/, { body: W, accent: '#d2122e' }],
  [/psv/, { body: '#e30613', accent: '#ffffff' }],
  [/feyenoord/, { body: '#e30613', accent: '#ffffff' }],
  [/anderlecht/, { body: '#4b2a86', accent: '#ffffff' }],
  [/antwerp|club brugge|genk|st\.? truiden|standard/, { body: '#d4131b', accent: '#ffffff' }],
  [/celtic/, { body: '#00a650', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/rangers/, { body: '#1b458f', accent: '#ffffff' }],
  [/galatasaray/, { body: '#a90432', accent: '#fdb912' }],
  [/fenerbah/, { body: '#002d72', accent: '#f9d900' }],
  [/trabzon/, { body: '#7b1e3a', accent: '#0d9bd9' }],
  [/be[sş]ikta[sş]/, { body: '#111111', accent: '#ffffff' }],
  [/ba[sş]ak[sş]ehir/, { body: '#ff6a13', accent: '#1a2a5a' }],
  [/al[ -]?nassr/, { body: '#ffd400', accent: '#003a8c' }],
  [/al[ -]?hilal/, { body: '#0a4aa6', accent: '#ffffff' }],
  [/al[ -]?ittihad/, { body: '#ffd400', accent: '#111111' }],
  [/al[ -]?ahli/, { body: '#0b8a4a', accent: '#ffffff' }],
  [/al[ -]?qadsiah|al[ -]?qadisiyah/, { body: '#d4131b', accent: '#ffffff' }],
  [/los angeles galaxy|la galaxy/, { body: W, accent: '#00245d' }],
  [/los angeles fc|lafc/, { body: '#111111', accent: '#c39e6d' }],
  [/chicago fire/, { body: '#c8102e', accent: '#001f5c' }],
  [/orlando/, { body: '#633492', accent: '#ffffff' }],
  [/vancouver|seattle|portland|san jose|minnesota|montreal|toronto|new york|atlanta|nashville|columbus|dc united|cincinnati|houston|dallas|colorado|kansas|salt lake|st\.? louis|charlotte|austin|philadelphia|new england/, { body: '#0a2a5a', accent: '#ffffff' }],
  [/vissel/, { body: '#8b0000', accent: '#ffffff' }],
  [/santos|corinthians|botafogo|atletico-?mg|atl[eé]tico mineiro/, { body: W, accent: '#111111' }],
  [/flamengo|vasco|fluminense|palmeiras|s[aã]o paulo|internacional|gr[eê]mio|cruzeiro/, { body: '#c8102e', accent: '#111111' }],
  [/boca/, { body: '#003876', accent: '#f5c518' }],
  [/river plate/, { body: W, accent: '#e30613' }],
  [/guadalajara|chivas/, { body: '#d4131b', accent: '#ffffff', stripe: '#ffffff', style: 'milan' }],
  [/spartak|cska|zenit|lokomotiv|dynamo/, { body: '#d4131b', accent: '#ffffff' }],
];
const PALETTE = [['#1a3a6b', '#ffffff'], ['#6b1a1a', '#ffffff'], ['#1a5a3a', '#ffffff'], ['#5a4a1a', '#ffe9a0'], ['#3a1a6b', '#ffffff'], ['#1a5a5a', '#ffffff'], ['#5a1a4a', '#ffffff'], ['#3a3a3a', '#ffffff']];
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const clean = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function kitFor(clubName, fullName, number) {
  const name = clean(clubName);
  const hit = CLUBS.find(([re]) => re.test(name));
  const base = hit ? { ...hit[1] } : (() => { const [body, accent] = PALETTE[hash(name || fullName) % PALETTE.length]; return { body, accent }; })();
  const parts = String(fullName || '').trim().split(/\s+/);
  // the name on the back: the surname (two words for "van Dijk", "de Jong", "Alexander-Arnold" stays one word)
  const particles = new Set(['van', 'de', 'der', 'den', 'di', 'da', 'dos', 'del', 'le', 'la', 'von', 'ter', 'ten']);
  let surname = parts.length > 1 ? parts.slice(-1)[0] : parts[0] || '';
  if (parts.length > 2 && particles.has(parts.at(-2).toLowerCase())) surname = parts.slice(-2).join(' ');
  // text on a striped shirt must be readable on both colours: with white stripes use dark text (gold on a dark body)
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  if (base.stripe && /^#f(f|5)f/i.test(base.stripe) && lum(base.accent) > 0.7) base.accent = lum(base.body) < 0.25 ? '#f5c518' : '#111111';
  return { body: base.body, accent: base.accent, stripe: base.stripe || null, ...(base.style ? { style: base.style } : {}), num: number ?? null, label: surname.toUpperCase().slice(0, 13) };
}
