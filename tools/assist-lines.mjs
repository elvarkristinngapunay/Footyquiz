// Where do Transfermarkt, API-Football and FotMob disagree on assists? One row per player × season × club × competition (2016/17 on),
// so a disagreement can be checked against the competition's own site ("EFL Cup 2023/24: Transfermarkt 2, API-Football 3").
//   node tools/assist-lines.mjs        → data/generated/assist-lines.csv  +  data/generated/assist-lines-summary.json  + a summary on screen
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiClubSeasons, isReserve } from './lib/verify-current.mjs';
import { sameClub } from './lib/verify-assists.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'data/raw/players');
const FROM = 2016;
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const tm = readJson(path.join(ROOT, 'data/raw/transfermarkt/tm-harvest.json'), null);
const fmIndex = readJson(path.join(ROOT, 'data/raw/fotmob/index.json'), {});
const deck = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/players-modern.js'), 'utf8').match(/const PLAYERS_MODERN = (\[.*?\]);\nconst PLAYERS_MODERN_INFO/s)[1]);

// one name for the same competition in the three sources ("League Cup" = "EFL Cup" = "Carabao Cup", "Italy Cup" = "Coppa Italia", "Franz-Beckenbauer-Supercup" = "DFL-Supercup" …)
const norm = n => String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const ALIAS = [
  [/(eflcup|leaguecup|carabaocup|capitalonecup|eflleaguecup)$/, 'EFL Cup'], [/communityshield/, 'Community Shield'], [/^(uefa)?supercup$|uefasupercup/, 'UEFA Super Cup'],
  [/championsleague.*(qualif|preliminary)|^(uefa)?championsleagueq/, 'Champions League qualifying'], [/^(uefa)?championsleague$/, 'Champions League'],
  [/europaleague.*(qualif|preliminary)/, 'Europa League qualifying'], [/^(uefa)?europaleague$/, 'Europa League'], [/conferenceleague.*(qualif|preliminary)/, 'Conference League qualifying'], [/^(uefa)?(europa)?conferenceleague$/, 'Conference League'],
  [/^(italycup|coppaitalia)$/, 'Coppa Italia'], [/^(supercoppaitaliana|supercoppa)$/, 'Supercoppa Italiana'], [/^(dfbpokal|dfbpokal)$/, 'DFB-Pokal'], [/(dflsupercup|franzbeckenbauersupercup|supercupgermany|germansupercup)/, 'DFL-Supercup'],
  [/^(copadelrey|spaincup)$/, 'Copa del Rey'], [/^(supercopa|supercopadeespana|supercopaespana|spanishsupercup|supercopaspain)$/, 'Supercopa de España'], [/^(coupedefrance|frenchcup)$/, 'Coupe de France'],
  [/^(trophedeschampions|frenchsupercup)$/, 'Trophée des Champions'], [/^(coupedelaligue|frenchleaguecup)$/, 'Coupe de la Ligue'], [/^(fifa)?clubworldcup$|^klub$/, 'Club World Cup'],
  [/^(premierleague|englishpremierleague)$/, 'Premier League'], [/^(laliga|laliga1|primeradivision|spanishlaliga)$/, 'La Liga'], [/^(seriea|italianseriea)$/, 'Serie A'], [/^(bundesliga|1bundesliga|germanbundesliga)$/, 'Bundesliga'],
  [/^(ligue1|frenchligue1)$/, 'Ligue 1'], [/^(eredivisie)$/, 'Eredivisie'], [/^(primeiraliga|ligaportugal|ligaportugalbetclic)$/, 'Primeira Liga'], [/^(superlig|sperlig|turkishsuperlig)$/, 'Süper Lig'], [/^(facup|theemiratesfacup)$/, 'FA Cup'],
];
const canon = name => { const n = norm(name); for (const [re, to] of ALIAS) if (re.test(n)) return to; return String(name || '').trim(); };

// "Inter Milan" = "Inter", "Olympique Lyon" = "Lyon": the smaller name's words are all in the bigger one (the strict sameClub refuses one short word)
const LOOSE_STOP = new Set(['fc', 'cf', 'afc', 'sc', 'ac', 'ss', 'ssc', 'club', 'de', 'the', 'calcio', 'vfl', 'vfb', 'sv', 'fk', 'sk', 'cd', 'ud', 'cr', 'ec', 'se', 'rc', 'rcd', 'as', 'us', 'olympique', 'olympic', 'sporting', 'real', 'athletic', 'atletico', 'borussia', 'bayer', 'eintracht', 'tsg', 'rb', 'ca', 'fsv', 'ssd']);
const looseToks = name => new Set(norm0(name).split(' ').filter(t => t && !LOOSE_STOP.has(t)));
function norm0(n) { return String(n || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim(); }
const looseClub = (a, b) => { const A = looseToks(a), B = looseToks(b); if (!A.size || !B.size) return false; const [sm, lg] = A.size <= B.size ? [A, B] : [B, A]; return [...sm].every(t => lg.has(t)); };
const NOT_CLUB_COMP = /friendl|world cup|euro\b|european championship|nations league|copa am[eé]rica|africa cup|gold cup|asian cup|olympic|qualif.*(world|euro)|international/i;
const YOUTH_TYPES = new Set([7, 15, 16, 18, 20, 23]);

const rows = [];
for (const e of deck) {
  const tp = tm?.players?.[e.apiId]; if (!tp) continue;
  const fmId = fmIndex[e.name]?.id, fm = fmId ? readJson(path.join(ROOT, 'data/raw/fotmob', fmId + '.json'), null) : null;
  const years = fs.readdirSync(RAW).filter(f => f.startsWith(e.apiId + '-')).map(f => Number(f.replace(/^\d+-|\.json$/g, ''))).filter(Boolean);
  const api = apiClubSeasons({ id: e.apiId, nationality: e.nat, seasons: Object.fromEntries(years.map(y => [y, {}])) }, RAW);
  for (let y = FROM; y <= 2026; y++) {
    const T = [];
    for (const [k, v] of Object.entries(tp.agg)) {
      const [s, clubId, compId, isNat] = k.split('|'); if (Number(s) !== y || isNat === '1') continue;
      const c = tm.clubs[clubId], comp = tm.comps[compId]; if (!c || YOUTH_TYPES.has(comp?.ty) || isReserve(c.n)) continue;
      T.push({ team: c.n, comp: comp?.n || compId, canon: canon(comp?.n || compId), apps: v[0], goals: v[1], assists: v[2] });
    }
    const A = (api.lines?.[y] || []).filter(l => !NOT_CLUB_COMP.test(l.league || '')).map(l => ({ team: l.team, comp: l.league, canon: canon(l.league), apps: l.apps, assists: l.assists, used: false }));
    const F = []; for (const st of fm?.seasons || []) if (Number(String(st.season).slice(0, 4)) === y && !isReserve(st.team || '')) for (const t of st.tournaments) if (!t.friendly && !NOT_CLUB_COMP.test(t.name || '')) F.push({ team: st.team, comp: t.name, canon: canon(t.name), apps: t.apps || 0, assists: t.assists || 0, used: false });
    const take = (list, team, cn) => { const hit = list.filter(x => !x.used && x.canon === cn && (sameClub(x.team, team) || looseClub(x.team, team))); hit.forEach(x => x.used = true); return hit.length ? { apps: hit.reduce((a, x) => a + x.apps, 0), assists: hit.some(x => x.assists == null) ? null : hit.reduce((a, x) => a + x.assists, 0) } : null; };
    const push = (team, comp, t, a, f) => rows.push({ player: e.name, season: `${y}/${String(y + 1).slice(2)}`, y, club: team, comp, tmApps: t?.apps ?? '', tmGoals: t?.goals ?? '', tmAssists: t?.assists ?? '', apiApps: a?.apps ?? '', apiAssists: a ? (a.assists ?? 'empty') : '', fmApps: f?.apps ?? '', fmAssists: f?.assists ?? '' });
    for (const t of T) push(t.team, t.canon, t, take(A, t.team, t.canon), take(F, t.team, t.canon));
    for (const a of A) if (!a.used) { a.used = true; push(a.team, a.canon, null, { apps: a.apps, assists: a.assists }, take(F, a.team, a.canon)); }
    for (const f of F) if (!f.used) push(f.team, f.canon, null, null, { apps: f.apps, assists: f.assists });
  }
}
fs.mkdirSync(path.join(ROOT, 'data/generated'), { recursive: true });
const cols = ['player', 'season', 'club', 'comp', 'tmApps', 'tmGoals', 'tmAssists', 'apiApps', 'apiAssists', 'fmApps', 'fmAssists'];
fs.writeFileSync(path.join(ROOT, 'data/generated/assist-lines.csv'), [cols.join(','), ...rows.map(r => cols.map(c => `"${String(r[c]).replace(/"/g, '""')}"`).join(','))].join('\n'));

// ── summary per competition ─────────────────────────────────────────────────────────────────────────────────────────
const num = x => (x === '' || x === 'empty' || x == null) ? null : Number(x);
const S = {};
for (const r of rows) {
  const s = S[r.comp] ||= { lines: 0, tmOnly: 0, tmOnlyAssists: 0, vsApi: { n: 0, same: 0, tmHigher: 0, tmLower: 0, excess: 0 }, vsFm: { n: 0, same: 0, tmHigher: 0, tmLower: 0, excess: 0 }, apiFmAgreeTmDiff: 0, apiFmAgreeExcess: 0, apiEmpty: 0 };
  s.lines++;
  const t = num(r.tmAssists), a = num(r.apiAssists), f = num(r.fmAssists), tApps = num(r.tmApps);
  if (t != null && a == null && f == null && r.apiAssists === '' && r.fmAssists === '') { s.tmOnly++; s.tmOnlyAssists += t; }
  if (r.apiAssists === 'empty') s.apiEmpty++;
  if (t != null && a != null) { s.vsApi.n++; if (t === a) s.vsApi.same++; else if (t > a) { s.vsApi.tmHigher++; s.vsApi.excess += t - a; } else { s.vsApi.tmLower++; s.vsApi.excess += t - a; } }
  if (t != null && f != null) { s.vsFm.n++; if (t === f) s.vsFm.same++; else if (t > f) { s.vsFm.tmHigher++; s.vsFm.excess += t - f; } else { s.vsFm.tmLower++; s.vsFm.excess += t - f; } }
  if (t != null && a != null && f != null && a === f && t !== a) { s.apiFmAgreeTmDiff++; s.apiFmAgreeExcess += t - a; }
}
fs.writeFileSync(path.join(ROOT, 'data/generated/assist-lines-summary.json'), JSON.stringify(S, null, 1));
console.log(`${rows.length} lines written to data/generated/assist-lines.csv`);
const top = Object.entries(S).sort((a, b) => b[1].lines - a[1].lines).slice(0, 28);
console.log('\ncompetition'.padEnd(30), 'lines'.padStart(6), '| vs API: same / TM higher / TM lower (net Δ)'.padEnd(46), '| vs FotMob: same / higher / lower (net Δ) | API=FM≠TM | TM-only');
for (const [c, s] of top) console.log(c.slice(0, 28).padEnd(30), String(s.lines).padStart(6), '|', `${s.vsApi.same} / ${s.vsApi.tmHigher} / ${s.vsApi.tmLower} (${s.vsApi.excess >= 0 ? '+' : ''}${s.vsApi.excess})`.padEnd(44), '|', `${s.vsFm.same} / ${s.vsFm.tmHigher} / ${s.vsFm.tmLower} (${s.vsFm.excess >= 0 ? '+' : ''}${s.vsFm.excess})`.padEnd(30), '|', `${s.apiFmAgreeTmDiff} (${s.apiFmAgreeExcess >= 0 ? '+' : ''}${s.apiFmAgreeExcess})`.padEnd(9), '|', s.tmOnly ? `${s.tmOnly} lines, ${s.tmOnlyAssists} assists` : '');

// ── the cases to check against the competition's own site ───────────────────────────────────────────────────────────────
const rank = new Map(deck.map((p, i) => [p.name, i]));                                   // the deck is sorted by career goals: a rough "how well known"
const out = ['# Assists: where Transfermarkt (TM), API-Football (API) and FotMob (FM) disagree', '', 'Generated by tools/assist-lines.mjs. One line = one player in one competition for one club in one season. Check the right answer on the competition\'s own site.', ''];
const show = (title, filter, limit) => {
  const list = rows.filter(filter).sort((x, y) => (Math.abs(num(y.tmAssists) - num(y.apiAssists)) - Math.abs(num(x.tmAssists) - num(x.apiAssists))) || ((rank.get(x.player) ?? 999) - (rank.get(y.player) ?? 999)));
  out.push(`## ${title} (${list.length} lines${limit < list.length ? `, ${limit} shown` : ''})`, '', '| Player | Season | Club | TM | API | FotMob |', '|---|---|---|---|---|---|');
  for (const r of list.slice(0, limit)) out.push(`| ${r.player} | ${r.season} | ${r.club} | ${r.tmAssists} | ${r.apiAssists} | ${r.fmAssists === '' ? '–' : r.fmAssists} |`);
  out.push(''); return list;
};
for (const c of ['Champions League', 'Europa League', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']) show(c + ' — API and FotMob agree, TM differs', r => r.comp === c && num(r.tmAssists) != null && num(r.apiAssists) != null && num(r.apiAssists) === num(r.fmAssists) && num(r.tmAssists) !== num(r.apiAssists), 20);
for (const c of ['EFL Cup', 'FA Cup', 'Copa del Rey', 'Coppa Italia', 'DFB-Pokal', 'Coupe de France']) show(c + ' — any difference', r => r.comp === c && num(r.tmAssists) != null && num(r.apiAssists) != null && num(r.tmAssists) !== num(r.apiAssists), 25);
out.push('## Competitions only Transfermarkt counts (no line in API-Football or FotMob)', '', '| Competition | Player | Season | Club | TM assists |', '|---|---|---|---|---|');
for (const c of ['Club World Cup', 'Champions League qualifying', 'Europa League qualifying', 'DFL-Supercup', 'Copa Libertadores']) for (const r of rows.filter(r => r.comp === c && num(r.tmAssists) > 0 && r.apiAssists === '' && r.fmAssists === '').sort((x, y) => num(y.tmAssists) - num(x.tmAssists) || ((rank.get(x.player) ?? 999) - (rank.get(y.player) ?? 999))).slice(0, 8)) out.push(`| ${c} | ${r.player} | ${r.season} | ${r.club} | ${r.tmAssists} |`);
fs.writeFileSync(path.join(ROOT, 'data/generated/assist-disagreements.md'), out.join('\n'));
console.log('\nwrote data/generated/assist-disagreements.md');
