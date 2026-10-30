// ═══════════════════════════ DAILY CHALLENGES ═══════════════════════════
// A category of its own: one challenge a day, the same for everyone (the date is the seed, UTC = Iceland time). Each day has TWO puzzles drawn from five games:
//   Daily Footle · Season Line · Football Chain · Season Higher or Lower · Younger/Older
// Data: data/daily.js (tools/build-daily.mjs) + the decks (data/decks.js). Everything is saved in localStorage per date, so a reload never gives a second try.
// Points: every puzzle is worth up to 100, a day up to 200. The streak counts days on which both puzzles were finished.
(function () {
  'use strict';

  // ── small helpers ───────────────────────────────────────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const pad = n => String(n).padStart(2, '0');
  const todayStr = () => { if (window.__dcDate) return window.__dcDate; const d = new Date(); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); };
  const dayNumber = ds => { const [y, m, d] = ds.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86400000); };
  const prettyDate = ds => { const [y, m, d] = ds.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }); };
  const hash = str => { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0; }; };
  const rngFrom = seed => { let a = hash(seed)(); return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const shuffle = (arr, rng) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  // a fixed shuffle of the pool walked one step per day: every candidate comes up once before any repeats
  const pickByDay = (pool, salt, dn) => { const a = pool.slice().sort((x, y) => (x.key || x.n || x).toString() < (y.key || y.n || y).toString() ? -1 : 1); shuffle(a, rngFrom('walk|' + salt)); return a[((dn % a.length) + a.length) % a.length]; };
  const badge = (club, cls) => { const u = typeof CLUB_LOGOS !== 'undefined' && CLUB_LOGOS[club]; return u ? `<img class="${cls || 'cb'}" src="${esc(u)}" alt="${esc(club)}" title="${esc(club)}" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:this.alt,className:'cbt'}))">` : `<span class="cbt" title="${esc(club)}">${esc(club)}</span>`; };
  const kit = name => { try { const p = (typeof PLAYERS_MODERN !== 'undefined' ? PLAYERS_MODERN : []).find(x => x.name === name); const s = typeof generateKitSVG === 'function' ? generateKitSVG(name, p && p.kit) : ''; return s || ''; } catch (e) { return ''; } };
  const ageAt = (born, ds) => { const [by, bm, bd] = born.split('-').map(Number), [y, m, d] = ds.split('-').map(Number); let a = y - by; if (m < bm || (m === bm && d < bd)) a--; return a; };

  // ── the data ──────────────────────────────────────────────────────────────────────────────────────────────────
  let _D = null;
  function D() {
    if (_D) return _D;
    const cur = DAILY_CUR, curBy = new Map(cur.map(p => [p.n, p]));
    const lines = DAILY_LINES.map(r => ({ p: r[0], y: r[1], s: r[2], c: r[3], g: r[4], a: r[5], as: r[6] })).filter(l => curBy.has(l.p));
    // a name people know: 80+ caps, or 150+ career goals, or 35+ caps while playing in one of the big leagues — so a puzzle is never a J-League veteran
    const TOP = new Set(['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'Saudi Pro League', 'MLS', 'Süper Lig', 'Eredivisie', 'Liga Portugal', 'Brasileirão']);
    const isStar = p => (p.cp || 0) >= 80 || (p.ca || 0) >= 150 || ((p.cp || 0) >= 35 && TOP.has(p.lg));
    const famousCur = cur.filter(isStar);
    const footleAns = famousCur.filter(p => p.num != null).map(p => Object.assign({ key: p.n }, p));
    const lineCands = lines.filter(l => { const p = curBy.get(l.p); return isStar(p) && (l.g >= 12 || (l.as != null && l.as >= 10)) && l.a >= 20; }).map(l => Object.assign({ key: l.p + l.y + l.c }, l));
    _D = { cur, curBy, lines, famousCur, footleAns, lineCands, chain: null };
    return _D;
  }
  function chainGraph() {
    const d = D(); if (d.chain) return d.chain;
    const people = new Map();
    [...deckLegends(), ...deckEra(), ...deckCurrent()].forEach(p => { if (!people.has(p.name) && DAILY_CLUBS[p.name]) people.set(p.name, p); });
    const names = [...people.keys()], byClub = new Map();
    names.forEach(n => DAILY_CLUBS[n].forEach(c => { if (!byClub.has(c)) byClub.set(c, []); byClub.get(c).push(n); }));
    const adj = new Map(names.map(n => [n, new Set()]));
    byClub.forEach(list => list.forEach(a => list.forEach(b => { if (a !== b) adj.get(a).add(b); })));
    const shared = (a, b) => DAILY_CLUBS[a].filter(c => DAILY_CLUBS[b].includes(c));
    const bfs = start => { const dist = new Map([[start, 0]]), par = new Map(), q = [start]; while (q.length) { const x = q.shift(); adj.get(x).forEach(y => { if (!dist.has(y)) { dist.set(y, dist.get(x) + 1); par.set(y, x); q.push(y); } }); } return { dist, par }; };
    // well known = long career or many caps AND at least one of the big clubs (25+ players of ours have played there) — so a puzzle is never "Beckham → a J-League veteran"
    const veryFamous = names.filter(n => { const p = people.get(n); return ((p.intl_caps || 0) >= 60 || (p.career_appearances || 0) >= 800) && DAILY_CLUBS[n].some(c => byClub.get(c).length >= 25); });
    const getPairs = () => {
      if (d.chain.pairsList) return d.chain.pairsList;
    // puzzles: two well-known players who share no club, linked by one player — but by only a handful of them (8 or fewer) — or by two players
    const pairs = [];
    veryFamous.forEach((a, i) => {
      const { dist } = bfs(a), an = adj.get(a);
      for (let j = i + 1; j < veryFamous.length; j++) {
        const b = veryFamous[j], dd = dist.get(b);
        if (dd === 3) pairs.push({ key: a + '|' + b, a, b });
        else if (dd === 2) { let c = 0; adj.get(b).forEach(x => { if (an.has(x)) c++; }); if (c <= 8) pairs.push({ key: a + '|' + b, a, b }); }
      }
    });
      return (d.chain.pairsList = pairs);
    };
    d.chain = { people, names, adj, shared, bfs, getPairs, veryFamous };
    return d.chain;
  }

  // ── name search (autocomplete) ─────────────────────────────────────────────────────────────────────────────────
  function search(q, pool, limit) {
    const qs = fold(q).split(' ').filter(Boolean); if (!qs.length) return [];
    const out = [];
    for (const n of pool) { const f = fold(n); if (qs.every(t => f.includes(t))) out.push([n, f.startsWith(qs[0]) ? 0 : f.split(' ').some(w => w.startsWith(qs[0])) ? 1 : 2]); }
    return out.sort((a, b) => a[1] - b[1] || a[0].length - b[0].length).slice(0, limit).map(x => x[0]);
  }
  function suggestBox(host, getPool, onPick, placeholder) {
    host.innerHTML = `<div class="dc-input"><input type="text" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder="${esc(placeholder)}"><div class="dc-sug"></div></div>`;
    const inp = host.querySelector('input'), sug = host.querySelector('.dc-sug');
    const update = () => { const l = inp.value.trim().length >= 2 ? search(inp.value, getPool(), 6) : []; sug.innerHTML = l.map(n => `<button type="button" data-n="${esc(n)}">${esc(n)}</button>`).join(''); };
    const pick = n => { inp.value = ''; sug.innerHTML = ''; onPick(n); };
    inp.addEventListener('input', update);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { const b = sug.querySelector('button'); if (b) { e.preventDefault(); pick(b.dataset.n); } } });
    sug.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pick(b.dataset.n); });
    return inp;
  }

  // ── state, saved per day ───────────────────────────────────────────────────────────────────────────────────────
  const KEY = 'fq_daily_', SKEY = 'fq_daily_streak';
  let S = null, curGame = null, timer = null;
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private window */ } } };
  function load(date) { try { const r = JSON.parse(ls.get(KEY + date)); if (r && r.v === 1) return r; } catch (e) { /* fresh */ } return { v: 1, date, res: {} }; }
  const save = () => ls.set(KEY + S.date, JSON.stringify(S));
  const streak = () => { try { return JSON.parse(ls.get(SKEY)) || { last: null, count: 0, best: 0 }; } catch (e) { return { last: null, count: 0, best: 0 }; } };
  function gamesOf(date) { const g = ['footle', 'line', 'chain', 'shl', 'yo', 'path', 'fee', 'stat']; return shuffle(g, rngFrom('games|' + date)).slice(0, 2); }
  function init() { const date = todayStr(); if (!S || S.date !== date) { S = load(date); S.games = gamesOf(date); } return S; }
  const doneCount = () => S.games.filter(g => S.res[g] && S.res[g].done).length;
  const totalScore = () => S.games.reduce((a, g) => a + ((S.res[g] && S.res[g].score) || 0), 0);
  function complete(g, score) {
    const r = (S.res[g] ||= {}); r.done = true; r.score = score; save();
    if (doneCount() === 2) {
      const st = streak(), y = (() => { const d = new Date(dayNumber(S.date) * 86400000 - 86400000); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); })();
      if (st.last !== S.date) { st.count = st.last === y ? st.count + 1 : 1; st.last = S.date; st.best = Math.max(st.best || 0, st.count); ls.set(SKEY, JSON.stringify(st)); }
    }
  }

  // ── the five games ─────────────────────────────────────────────────────────────────────────────────────────────
  const GAMES = {
    footle: { title: 'Daily Footle', short: 'Guess the mystery player', how: 'Guess today\'s mystery <b>current player</b> in 6 tries. After each guess the squares show how close you are: <b>green</b> = same, <b>yellow</b> = close, grey = no; the arrow says whether the answer is higher ▲ or lower ▼. Points: <b>100, 85, 70, 55, 40, 25</b> by the guess you get it on.' },
    line: { title: 'Season Line', short: 'Who had this season?', how: 'One season in numbers — who is it? Every wrong guess unlocks a clue (<b>nationality + position</b>, then the <b>club</b>, then the <b>birth year</b>). You have 4 guesses. Points: <b>100, 70, 45, 20</b>.' },
    chain: { title: 'Football Chain', short: 'Link two players through clubs', how: 'Connect the two players: each player you add must have <b>played for the same club</b> as the one before (any years). Fewest players in between wins. Points: <b>100</b> for the shortest chain, <b>75, 50, 30, 15</b> for each extra player. Up to 6 players, or give up for 0.' },
    shl: { title: 'Season Higher or Lower', short: '5 seasons to compare', how: 'Five rounds. The left player\'s season number is shown — did the right player have <b>more or fewer</b> in <i>his</i> season? <b>20 points</b> for every right answer.' },
    path: { title: 'Career Path', short: 'Follow the clubs', how: 'A mystery player\'s clubs, <b>oldest first</b>. You see the first club; every wrong guess shows the next one. Guess him as early as you can. Points: <b>100, 85, 70, 55, 40, 25</b> by the guess.' },
    fee: { title: 'Moneyball', short: 'Guess the transfer fee', how: 'One transfer, one fee in <b>€ millions</b> (the headline total, add-ons included). You have 4 guesses and get ▲ higher / ▼ lower after each. Within <b>€2.5M</b> counts as right. Points: <b>100, 75, 50, 25</b>.' },
    stat: { title: 'Stat Guess', short: 'How many? Get close', how: 'Three numbers about famous players. You get <b>one guess each</b> — the closer you are, the more points. An exact answer is <b>100%</b>, being off by half the real number or more is 0%. Your puzzle score is the average.' },
    yo: { title: 'Younger / Older', short: 'Who is older?', how: 'Five rounds. Tap the player who was <b>born first</b>. <b>20 points</b> for every right answer.' }
  };
  const HOST = () => $('dcBody');

  // ---- Daily Footle ----
  function footleCompare(g, a, date) {
    const ag = ageAt(g.b, date), aa = ageAt(a.b, date);
    const num = (g.num != null && a.num != null) ? (g.num === a.num ? 'ok' : Math.abs(g.num - a.num) <= 3 ? 'near' : 'bad') : 'bad';
    return [
      { s: g.nat === a.nat ? 'ok' : 'bad', h: `<span class="fl">${g.fl || ''}</span>`, t: g.nat },
      { s: g.pos === a.pos ? 'ok' : 'bad', h: POS3[g.pos] || g.pos, t: g.pos },
      { s: g.cl === a.cl ? 'ok' : 'bad', h: badge(g.cl), t: g.cl },
      { s: g.lg === a.lg ? 'ok' : 'bad', h: LG3[g.lg] || g.lg, t: g.lg },
      { s: ag === aa ? 'ok' : Math.abs(ag - aa) <= 2 ? 'near' : 'bad', h: `${ag}${ag === aa ? '' : `<span class="ar">${aa > ag ? '▲' : '▼'}</span>`}`, t: 'Age' },
      { s: num, h: g.num == null ? '–' : `${g.num}${g.num === a.num || a.num == null ? '' : `<span class="ar">${a.num > g.num ? '▲' : '▼'}</span>`}`, t: 'Shirt number' }
    ];
  }
  const POS3 = { Forward: 'FWD', Midfielder: 'MID', Defender: 'DEF', Goalkeeper: 'GK' };
  const LG3 = { 'Premier League': 'PL', 'La Liga': 'LL', 'Serie A': 'SA', 'Bundesliga': 'BL', 'Ligue 1': 'L1', 'Süper Lig': 'SL', 'Eredivisie': 'ERE', 'Liga Portugal': 'LP', 'MLS': 'MLS', 'Saudi Pro League': 'SPL', 'Brasileirão': 'BRA', 'Liga Argentina': 'ARG', 'Qatar Stars League': 'QSL', 'Championship': 'CHA', 'Belgian Pro League': 'BEL', 'Scottish Premiership': 'SCO', 'Liga MX': 'MX', 'J1 League': 'J1', 'Greek Super League': 'GRE', 'Ekstraklasa': 'EKS' };
  const FOOTLE_PTS = [100, 85, 70, 55, 40, 25];
  const SQ = { ok: '🟩', near: '🟨', bad: '⬛' };
  function renderFootle(host, r) {
    const d = D(), st = (r.st ||= { g: [] });
    if (!r.ans || !d.curBy.get(r.ans)) { r.ans = pickByDay(d.footleAns, 'footle', dayNumber(S.date)).n; save(); }     // today's answer is written down, so a data update can never change it mid-day
    const ans = d.curBy.get(r.ans);
    const rows = st.g.map(n => { const g = d.curBy.get(n); return `<div class="dc-fg"><div class="dc-fg-name">${esc(n)}</div><div class="dc-fg-cells">${footleCompare(g, ans, S.date).map(c => `<div class="dc-cell ${c.s}" title="${esc(c.t)}">${c.h}</div>`).join('')}</div></div>`; }).join('');
    const won = st.g.includes(ans.n), over = won || st.g.length >= 6;
    host.innerHTML = `<div class="dc-fh"><span>NATION</span><span>POS</span><span>CLUB</span><span>LEAGUE</span><span>AGE</span><span>SHIRT #</span></div>${rows}<div id="dcIn"></div><div class="dc-msg" id="dcMsg">${over ? '' : `Guess ${st.g.length + 1} of 6`}</div><div id="dcRes"></div>`;
    if (!over) suggestBox($('dcIn'), () => d.cur.map(p => p.n).filter(n => !st.g.includes(n)), n => { st.g.push(n); save(); const w = n === ans.n, fin = w || st.g.length >= 6; if (fin) complete('footle', w ? FOOTLE_PTS[st.g.length - 1] : 0); renderFootle(host, r); }, 'Type a current player…');
    else {
      const sc = won ? FOOTLE_PTS[st.g.length - 1] : 0, grid = st.g.map(n => footleCompare(d.curBy.get(n), ans, S.date).map(c => SQ[c.s]).join('')).join('\n');
      r.share = `Daily Footle ${won ? st.g.length + '/6' : 'X/6'}\n${grid}`;
      $('dcRes').innerHTML = resultBox(won ? `Got it in ${st.g.length}!` : 'Not today', `${won ? '' : 'It was '}<b>${esc(ans.n)}</b> · ${esc(ans.cl)}`, sc);
    }
  }

  // ---- Season Line ----
  const LINE_PTS = [100, 70, 45, 20];
  function renderLine(host, r) {
    const d = D(), st = (r.st ||= { g: [] });
    if (!r.line || !d.curBy.get(r.line.p)) { r.line = pickByDay(d.lineCands, 'line', dayNumber(S.date)); save(); }
    const L = r.line, P = d.curBy.get(L.p);
    const won = st.g.includes(L.p), wrong = st.g.filter(n => n !== L.p).length, over = won || st.g.length >= 4;
    const showAll = over;
    const clues = [
      [1, `<span class="fl" style="font-size:1.4rem">${P.fl}</span> ${esc(P.nat)} · ${esc(P.pos)}`, 'Nationality and position'],
      [2, `${badge(L.c)} ${esc(L.c)}`, 'The club'],
      [3, `Born in <b>${P.b.slice(0, 4)}</b>`, 'Birth year']
    ].map(([need, html, label]) => (wrong >= need || showAll) ? `<div class="dc-clue">${html}</div>` : `<div class="dc-clue locked">🔒 ${label} — after guess ${need}</div>`).join('');
    host.innerHTML = `<div class="dc-line"><div class="season">SEASON ${esc(L.s)}</div><div class="dc-stats">
        <div class="dc-stat"><div class="v">${L.g}</div><div class="k">goals</div></div>
        ${L.as != null ? `<div class="dc-stat"><div class="v">${L.as}</div><div class="k">assists</div></div>` : ''}
        <div class="dc-stat"><div class="v">${L.a}</div><div class="k">games</div></div></div>
        <div style="font-size:0.72rem;color:#9bb5a6;font-weight:700">all competitions for his club that season</div>
        <div class="dc-clues">${clues}</div></div>
      <div class="dc-guesses">${st.g.filter(n => n !== L.p).map(n => `<div class="dc-guess">✗ ${esc(n)}</div>`).join('')}</div>
      <div id="dcIn"></div><div class="dc-msg" id="dcMsg">${over ? '' : `Guess ${st.g.length + 1} of 4`}</div><div id="dcRes"></div>`;
    if (!over) suggestBox($('dcIn'), () => d.cur.map(p => p.n).filter(n => !st.g.includes(n)), n => { st.g.push(n); save(); const w = n === L.p, fin = w || st.g.length >= 4; if (fin) complete('line', w ? LINE_PTS[st.g.length - 1] : 0); renderLine(host, r); }, 'Who was it?');
    else {
      const sc = won ? LINE_PTS[st.g.length - 1] : 0;
      r.share = `Season Line ${won ? st.g.length + '/4' : 'X/4'}  ${'🟥'.repeat(Math.max(0, st.g.length - (won ? 1 : 0)))}${won ? '🟩' : ''}`;
      $('dcRes').innerHTML = resultBox(won ? `Got it on guess ${st.g.length}!` : 'Not this time', `<b>${esc(L.p)}</b> · ${esc(L.c)} ${esc(L.s)}`, sc);
    }
  }

  // ---- Football Chain ----
  const CHAIN_PTS = [100, 75, 50, 30, 15];
  function renderChain(host, r) {
    const g = chainGraph(), st = (r.st ||= { mid: [] });
    if (!r.pair || !g.people.has(r.pair.a) || !g.people.has(r.pair.b)) { r.pair = pickByDay(g.getPairs(), 'chain', dayNumber(S.date)); save(); }
    const pair = r.pair;
    const A = pair.a, B = pair.b, opt = g.bfs(A).dist.get(B) - 1;
    const path = [A, ...st.mid], last = path[path.length - 1];
    const closes = !!g.adj.get(last) && g.adj.get(last).has(B);
    const done = r.done || closes;
    if (closes && !r.done) { const n = st.mid.length; complete('chain', n <= opt ? 100 : (CHAIN_PTS[Math.min(4, n - opt)] || 15)); }
    const node = (n, cls, sub) => `<div class="dc-node ${cls}"><span>${esc(n)}</span><small>${sub || ''}</small></div>`;
    const link = (a, b) => { const c = g.shared(a, b); return `<div class="dc-link">${c.slice(0, 3).map(x => badge(x, 'cb')).join('')} ${esc(c.slice(0, 2).join(' · '))}</div>`; };
    let html = node(A, 'end', 'START');
    for (let i = 1; i < path.length; i++) html += link(path[i - 1], path[i]) + node(path[i], 'you', `#${i}`);
    if (done && closes) html += link(last, B);
    else html += `<div class="dc-link todo">${r.done ? 'gave up' : '? ' + esc(last) + ' → someone who shared a club'}</div>`;
    html += node(B, 'end', 'TARGET');
    host.innerHTML = `<div class="dc-chain">${html}</div><div id="dcIn"></div><div class="dc-msg" id="dcMsg">${done ? '' : `The shortest chain has ${opt} player${opt > 1 ? 's' : ''} in between · you have used ${st.mid.length} of 6`}</div><div class="dc-actions" id="dcAct"></div><div id="dcRes"></div>`;
    if (!done) {
      suggestBox($('dcIn'), () => g.names.filter(n => !path.includes(n) && n !== B), n => {
        const msg = $('dcMsg');
        if (!g.adj.get(last).has(n)) { msg.className = 'dc-msg bad'; msg.textContent = `${n} has not played for a club that ${last} played for.`; return; }
        st.mid.push(n); save();
        if (st.mid.length >= 6 && !(g.adj.get(n).has(B))) { complete('chain', 0); }
        renderChain(host, r);
      }, 'Name a player who shared a club with ' + last + '…');
      $('dcAct').innerHTML = `${st.mid.length ? '<button class="dc-btn sec" id="dcUndo">↩ Undo</button>' : ''}<button class="dc-btn sec" id="dcGive">Give up</button>`;
      const u = $('dcUndo'); if (u) u.onclick = () => { st.mid.pop(); save(); renderChain(host, r); };
      $('dcGive').onclick = () => { complete('chain', 0); r.gaveUp = true; save(); renderChain(host, r); };
    } else {
      const sc = r.score || 0, n = st.mid.length;
      r.share = `Football Chain ${sc ? n + ' in between (best ' + opt + ')' : 'X'}`;
      let extra = ''; if (!sc) { const { par } = g.bfs(A); const p = [B]; while (p[0] !== A) p.unshift(par.get(p[0])); extra = `<br>One shortest chain: ${p.map(esc).join(' → ')}`; }
      $('dcRes').innerHTML = resultBox(sc ? (n <= opt ? 'Shortest chain!' : 'Connected!') : (r.gaveUp ? 'Gave up' : 'Out of players'), `${sc ? `You used ${n} player${n > 1 ? 's' : ''} in between, the shortest is ${opt}.` : ''}${extra}`, sc);
    }
  }

  // ---- Season Higher or Lower ----
  const STATS = { g: ['goals', 'goals'], as: ['assists', 'assists'], a: ['games', 'games played'] };
  function shlRounds() {
    const d = D(), rng = rngFrom('shl|' + S.date), pool = d.lineCands.slice(), used = new Set(), out = [], kinds = shuffle(['g', 'as', 'a', 'g', 'as'], rng);
    for (const k of kinds) {
      for (let t = 0; t < 400; t++) {
        const A = pool[Math.floor(rng() * pool.length)], B = pool[Math.floor(rng() * pool.length)];
        if (!A || !B || A.p === B.p || used.has(A.p) || used.has(B.p) || A[k] == null || B[k] == null || Math.abs(A[k] - B[k]) < 2) continue;
        used.add(A.p); used.add(B.p); out.push({ A, B, k }); break;
      }
    }
    return out;
  }
  const lineCard = (l, show, cls, k, extra) => { const p = D().curBy.get(l.p); return `<div class="dc-pc ${cls || ''}" ${extra || ''}>${kit(l.p) || ''}<div class="nm">${esc(l.p)}</div><div class="sb">${badge(l.c)}<br>${esc(l.s)}</div><div class="val ${show ? '' : 'hid'}">${show ? l[k] : '?'}</div><div class="sb">${STATS[k][1]}</div></div>`; };
  function renderShl(host, r) {
    const fresh = !r.rounds, rounds = (r.rounds ||= shlRounds()), st = (r.st ||= { ans: [], reveal: false });
    if (fresh) save();
    const i = st.ans.length - (st.reveal ? 1 : 0), rd = rounds[Math.min(i, rounds.length - 1)];
    const dots = `<div class="dc-dots">${rounds.map((_, j) => `<i class="${st.ans[j] ? (st.ans[j].ok ? 'ok' : 'no') : (j === i ? 'now' : '')}"></i>`).join('')}</div>`;
    if (st.ans.length >= rounds.length && !st.reveal) {
      const ok = st.ans.filter(a => a.ok).length; r.share = `Season Higher or Lower ${ok}/5 ${st.ans.map(a => a.ok ? '🟩' : '⬛').join('')}`;
      host.innerHTML = dots + `<div id="dcRes">${resultBox(`${ok} of 5 right`, '', ok * 20)}</div>`; return;
    }
    const a = st.ans[i], show = !!st.reveal;
    host.innerHTML = dots + `<div class="dc-q">Round ${i + 1} of 5 — did the right player have <b>more</b> or <b>fewer</b> ${STATS[rd.k][0]} in his season?</div>
      <div class="dc-vs">${lineCard(rd.A, true, '', rd.k)}${lineCard(rd.B, show, show ? (a.ok ? 'right' : 'wrong') : '', rd.k)}</div>
      ${show ? `<div class="dc-msg ${a.ok ? '' : 'bad'}">${a.ok ? '✓ Right' : '✗ Wrong'} — ${rd.B[rd.k]} vs ${rd.A[rd.k]}</div><div class="dc-actions"><button class="dc-btn" id="dcNext">${i + 1 >= rounds.length ? 'See result' : 'Next ›'}</button></div>` : `<div class="dc-hl"><button class="up" id="dcUp">▲ More</button><button class="down" id="dcDown">▼ Fewer</button></div>`}`;
    const answer = pick => { const higher = rd.B[rd.k] > rd.A[rd.k]; st.ans.push({ pick, ok: (pick === 'up') === higher }); st.reveal = true; save(); renderShl(host, r); };
    if (!show) { $('dcUp').onclick = () => answer('up'); $('dcDown').onclick = () => answer('down'); }
    else $('dcNext').onclick = () => { st.reveal = false; if (st.ans.length >= rounds.length) complete('shl', st.ans.filter(x => x.ok).length * 20); save(); renderShl(host, r); };
  }

  // ---- Younger / Older ----
  function yoRounds() {
    const d = D(), rng = rngFrom('yo|' + S.date), pool = d.famousCur.slice(), used = new Set(), out = [];
    for (let k = 0; k < 5; k++) for (let t = 0; t < 600; t++) {
      const a = pool[Math.floor(rng() * pool.length)], b = pool[Math.floor(rng() * pool.length)];
      if (!a || !b || a.n === b.n || used.has(a.n) || used.has(b.n) || Math.abs(Date.parse(a.b) - Date.parse(b.b)) < 450 * 86400000) continue;
      used.add(a.n); used.add(b.n); out.push([a, b]); break;
    }
    return out;
  }
  const fmtBorn = b => new Date(b + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  function renderYo(host, r) {
    const fresh = !r.rounds, rounds = (r.rounds ||= yoRounds().map(p => [p[0].n, p[1].n])), st = (r.st ||= { ans: [], reveal: false }), d = D();
    if (fresh) save();
    const i = st.ans.length - (st.reveal ? 1 : 0), dots = `<div class="dc-dots">${rounds.map((_, j) => `<i class="${st.ans[j] ? (st.ans[j].ok ? 'ok' : 'no') : (j === i ? 'now' : '')}"></i>`).join('')}</div>`;
    if (st.ans.length >= rounds.length && !st.reveal) {
      const ok = st.ans.filter(a => a.ok).length; r.share = `Younger / Older ${ok}/5 ${st.ans.map(a => a.ok ? '🟩' : '⬛').join('')}`;
      host.innerHTML = dots + `<div id="dcRes">${resultBox(`${ok} of 5 right`, '', ok * 20)}</div>`; return;
    }
    const [na, nb] = rounds[i], pa = d.curBy.get(na), pb = d.curBy.get(nb), show = !!st.reveal, older = Date.parse(pa.b) < Date.parse(pb.b) ? na : nb;
    const card = (p, key) => `<div class="dc-pc ${show ? (p.n === older ? 'right' : 'wrong') : 'pick'}" ${show ? '' : `data-k="${key}"`}>${kit(p.n) || ''}<div class="nm">${esc(p.n)}</div><div class="sb">${p.fl} ${esc(p.nat)}</div><div class="val ${show ? '' : 'hid'}" style="font-size:1.1rem">${show ? fmtBorn(p.b) : 'born ?'}</div></div>`;
    host.innerHTML = dots + `<div class="dc-q">Round ${i + 1} of 5 — who is <b>older</b>?</div><div class="dc-vs">${card(pa, 'a')}${card(pb, 'b')}</div>` +
      (show ? `<div class="dc-msg ${st.ans[i].ok ? '' : 'bad'}">${st.ans[i].ok ? '✓ Right' : '✗ Wrong'} — ${esc(older)} is older</div><div class="dc-actions"><button class="dc-btn" id="dcNext">${i + 1 >= rounds.length ? 'See result' : 'Next ›'}</button></div>` : '');
    if (!show) host.querySelectorAll('.dc-pc.pick').forEach(el => el.onclick = () => { const chosen = el.dataset.k === 'a' ? na : nb; st.ans.push({ pick: chosen, ok: chosen === older }); st.reveal = true; save(); renderYo(host, r); });
    else $('dcNext').onclick = () => { st.reveal = false; if (st.ans.length >= rounds.length) complete('yo', st.ans.filter(x => x.ok).length * 20); save(); renderYo(host, r); };
  }

  // ---- Career Path ----
  const PATH_PTS = [100, 85, 70, 55, 40, 25];
  const known = () => { const d = D(); if (!d.known) d.known = new Set([...chainGraph().veryFamous, ...d.famousCur.map(p => p.n)]); return d.known; };
  const pathOf = name => { const d = D(); if (!d.pathBy) d.pathBy = new Map(DAILY_PATHS.map(p => [p[0], p[1]])); return d.pathBy.get(name); };
  function renderPath(host, r) {
    const g = chainGraph();
    if (!r.pn || !pathOf(r.pn)) { r.pn = pickByDay(DAILY_PATHS.filter(p => known().has(p[0])).map(p => ({ key: p[0], n: p[0] })), 'path', dayNumber(S.date)).n; save(); }
    const clubs = pathOf(r.pn), st = (r.st ||= { g: [] }), max = Math.min(6, clubs.length);
    const wrong = st.g.filter(n => n !== r.pn).length, won = st.g.includes(r.pn), over = won || st.g.length >= max;
    const shown = over ? clubs.length : Math.min(clubs.length, 1 + wrong);
    const rows = clubs.map((c, i) => i < shown ? `<div class="dc-pathrow"><span class="n">${i + 1}</span>${badge(c)}<span class="t">${esc(c)}</span></div>` : `<div class="dc-pathrow locked"><span class="n">${i + 1}</span><span class="t">🔒 ?</span></div>`).join('');
    host.innerHTML = `<div class="dc-line"><div class="season">CAREER · CLUBS IN ORDER</div><div class="dc-path">${rows}</div></div>
      <div class="dc-guesses">${st.g.filter(n => n !== r.pn).map(n => `<div class="dc-guess">✗ ${esc(n)}</div>`).join('')}</div>
      <div id="dcIn"></div><div class="dc-msg" id="dcMsg">${over ? '' : `Guess ${st.g.length + 1} of ${max}`}</div><div id="dcRes"></div>`;
    if (!over) suggestBox($('dcIn'), () => g.names.filter(n => !st.g.includes(n)), n => { st.g.push(n); save(); const w = n === r.pn, fin = w || st.g.length >= max; if (fin) complete('path', w ? PATH_PTS[st.g.length - 1] : 0); renderPath(host, r); }, 'Who is it?');
    else {
      const rec = g.people.get(r.pn) || {}, sc = won ? PATH_PTS[st.g.length - 1] : 0;
      r.share = `Career Path ${won ? st.g.length + '/' + max : 'X/' + max}  ${'🟥'.repeat(Math.max(0, st.g.length - (won ? 1 : 0)))}${won ? '🟩' : ''}`;
      $('dcRes').innerHTML = resultBox(won ? `Got it on guess ${st.g.length}!` : 'Not this time', `<b>${esc(r.pn)}</b>${rec.nat ? ' · ' + esc(rec.nat) : ''}`, sc);
    }
  }

  // ---- Moneyball ----
  const FEE_PTS = [100, 75, 50, 25];
  function renderFee(host, r) {
    if (!r.deal) { const pool = []; MONEYBALL_MANAGERS.forEach(m => m.transfers.forEach(t => { if (t.fee >= 15) pool.push(Object.assign({ key: t.player + t.year + t.to }, t)); })); r.deal = pickByDay(pool, 'fee', dayNumber(S.date)); save(); }
    const t = r.deal, st = (r.st ||= { g: [] }), won = st.g.some(x => Math.abs(x - t.fee) <= 2.5), over = won || st.g.length >= 4;
    const rows = st.g.map(x => Math.abs(x - t.fee) <= 2.5 ? `<div class="dc-guess ok">✓ €${x}M</div>` : `<div class="dc-guess">€${x}M · ${x < t.fee ? '▲ higher' : '▼ lower'}</div>`).join('');
    host.innerHTML = `<div class="dc-line"><div class="season">${esc(t.window.toUpperCase())} WINDOW · ${t.year}</div>
        <div style="font-family:'Anton',sans-serif;font-size:1.9rem;margin:6px 0 2px">${esc(t.player)}</div><div style="font-size:0.78rem;font-weight:800;color:#9bb5a6">${esc(t.pos || '')}</div>
        <div class="dc-stats" style="align-items:center;gap:10px"><div class="dc-stat">${badge(t.from)}<div class="k">${esc(t.from)}</div></div><div style="font-size:1.6rem">➜</div><div class="dc-stat">${badge(t.to)}<div class="k">${esc(t.to)}</div></div></div></div>
      <div class="dc-guesses">${rows}</div>
      ${over ? '' : `<div class="dc-input" style="display:flex;gap:8px"><input id="dcFee" type="number" inputmode="decimal" min="0" step="0.5" placeholder="Fee in € millions" style="flex:1"><button class="dc-btn" id="dcFeeGo">Guess</button></div><div class="dc-msg" id="dcMsg">Guess ${st.g.length + 1} of 4</div>`}
      <div id="dcRes"></div>`;
    if (!over) {
      const go = () => { const x = parseFloat($('dcFee').value); if (isNaN(x) || x < 0) { $('dcMsg').className = 'dc-msg bad'; $('dcMsg').textContent = 'Type the fee in € millions.'; return; } st.g.push(x); save(); const w = Math.abs(x - t.fee) <= 2.5, fin = w || st.g.length >= 4; if (fin) complete('fee', w ? FEE_PTS[st.g.length - 1] : 0); renderFee(host, r); };
      $('dcFeeGo').onclick = go; $('dcFee').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    } else {
      const sc = won ? FEE_PTS[st.g.length - 1] : 0;
      r.share = `Moneyball ${won ? st.g.length + '/4' : 'X/4'}`;
      $('dcRes').innerHTML = resultBox(won ? `Got it on guess ${st.g.length}!` : 'Not this time', `The fee was <b>€${t.fee}M</b>`, sc);
    }
  }

  // ---- Stat Guess ----
  const STAT_T = {
    plg: { q: p => `How many <b>Premier League goals</b> did <b>${esc(p.n)}</b> score?`, val: p => (typeof COMP_STATS !== 'undefined' && COMP_STATS[p.n] && COMP_STATS[p.n].pl) ? COMP_STATS[p.n].pl.g : null, min: 30 },
    pla: { q: p => `How many <b>Premier League games</b> did <b>${esc(p.n)}</b> play?`, val: p => (typeof COMP_STATS !== 'undefined' && COMP_STATS[p.n] && COMP_STATS[p.n].pl) ? COMP_STATS[p.n].pl.a : null, min: 150 },
    cg: { q: p => `How many <b>career goals</b> did <b>${esc(p.n)}</b> score — club and country together?`, val: p => p.career_goals, min: 120 },
    caps: { q: p => `How many <b>caps</b> did <b>${esc(p.n)}</b> win for ${esc(p.nat)}?`, val: p => p.intl_caps, min: 50 },
    ig: { q: p => `How many <b>goals for ${esc(p.nat)}</b> did <b>${esc(p.n)}</b> score?`, val: p => p.intl_goals, min: 15 },
    ast: { q: p => `How many <b>assists</b> did <b>${esc(p.n)}</b> record since 2016/17?`, val: p => (p.club_assists && p.club_assists.length) ? p.assists : null, min: 30 }
  };
  function statQuestions() {
    const g = chainGraph(), rng = rngFrom('stat|' + S.date), kinds = shuffle(Object.keys(STAT_T), rng).slice(0, 3), used = new Set(), out = [];
    const recs = [...g.people.values()].filter(p => known().has(p.name)).map(p => Object.assign({ n: p.name }, p));
    kinds.forEach(k => {
      const T = STAT_T[k], pool = recs.filter(p => { const v = T.val(p); return v != null && v >= T.min && !used.has(p.n); });
      if (!pool.length) return; const p = pool[Math.floor(rng() * pool.length)]; used.add(p.n);
      out.push({ k, n: p.n, nat: p.nat, a: T.val(p) });
    });
    return out;
  }
  const accuracy = (g, a) => Math.max(0, Math.round(100 * (1 - Math.abs(g - a) / Math.max(a * 0.5, 5))));
  function renderStat(host, r) {
    const fresh = !r.qs, qs = (r.qs ||= statQuestions()), st = (r.st ||= { ans: [], reveal: false });
    if (fresh) save();
    const i = st.ans.length - (st.reveal ? 1 : 0), dots = `<div class="dc-dots">${qs.map((_, j) => `<i class="${st.ans[j] ? (st.ans[j].acc >= 70 ? 'ok' : 'no') : (j === i ? 'now' : '')}"></i>`).join('')}</div>`;
    if (st.ans.length >= qs.length && !st.reveal) {
      const avg = Math.round(st.ans.reduce((a, x) => a + x.acc, 0) / qs.length); r.share = `Stat Guess ${avg}% ${st.ans.map(x => x.acc >= 90 ? '🟩' : x.acc >= 60 ? '🟨' : '⬛').join('')}`;
      host.innerHTML = dots + `<div id="dcRes">${resultBox(`${avg}% accurate`, st.ans.map((x, j) => `${esc(qs[j].n)}: you ${x.g} · actual ${qs[j].a}`).join('<br>'), avg)}</div>`; return;
    }
    const q = qs[Math.min(i, qs.length - 1)], T = STAT_T[q.k], a = st.ans[i], show = !!st.reveal;
    host.innerHTML = dots + `<div class="dc-line"><div class="season">QUESTION ${i + 1} OF ${qs.length}</div><div style="font-size:1.05rem;font-weight:800;margin:10px 4px 4px;line-height:1.35">${T.q({ n: q.n, nat: q.nat })}</div></div>` +
      (show ? `<div class="dc-result"><div class="rt">${a.acc}%</div><div class="sm">You said <b>${a.g}</b> · actual <b>${q.a}</b></div><div class="dc-actions" style="margin-top:10px"><button class="dc-btn" id="dcNext">${i + 1 >= qs.length ? 'See result' : 'Next ›'}</button></div></div>`
        : `<div class="dc-input" style="display:flex;gap:8px"><input id="dcNum" type="number" inputmode="numeric" min="0" step="1" placeholder="Your answer" style="flex:1"><button class="dc-btn" id="dcNumGo">Lock in</button></div><div class="dc-msg" id="dcMsg"></div>`);
    if (!show) {
      const go = () => { const x = parseFloat($('dcNum').value); if (isNaN(x) || x < 0) { $('dcMsg').className = 'dc-msg bad'; $('dcMsg').textContent = 'Type a number.'; return; } st.ans.push({ g: x, acc: accuracy(x, q.a) }); st.reveal = true; save(); renderStat(host, r); };
      $('dcNumGo').onclick = go; $('dcNum').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    } else $('dcNext').onclick = () => { st.reveal = false; if (st.ans.length >= qs.length) complete('stat', Math.round(st.ans.reduce((s2, x) => s2 + x.acc, 0) / qs.length)); save(); renderStat(host, r); };
  }

  const RENDER = { footle: renderFootle, line: renderLine, chain: renderChain, shl: renderShl, yo: renderYo, path: renderPath, fee: renderFee, stat: renderStat };
  const resultBox = (title, sub, score) => `<div class="dc-result"><div class="rt">${esc(title)}</div><div class="sm">${sub}</div><div class="dc-score" style="margin-top:8px">+${score}<small> / 100</small></div><div class="dc-actions" style="margin-top:10px"><button class="dc-btn big" onclick="dcBackHome()">Continue ›</button></div></div>`;

  // ── the screens ────────────────────────────────────────────────────────────────────────────────────────────────
  const SCREENS = ['landingScreen', 'higherOrLowerSection', 'elGrandeMenu', 'elGrandeGame', 'gameScreen', 'sxiScreen', 'mbScreen', 'top10Screen', 'careerScreen', 'closestWinsScreen', 'auctionScreen', 'catScreen'];
  function ready() { return typeof DAILY_CUR !== 'undefined' && typeof DAILY_LINES !== 'undefined' && typeof DAILY_CLUBS !== 'undefined' && typeof deckLegends === 'function'; }
  window.showDaily = function () {
    if (!ready()) { alert('The daily challenge could not load its data.'); return; }
    setBg(false); if (typeof closeAllOverlays === 'function') closeAllOverlays();
    SCREENS.forEach(id => { const e = $(id); if (e) e.style.display = 'none'; });
    $('dailyScreen').style.display = 'flex'; setBackBtn('← Back Home', window.showLanding);
    init(); curGame = null; renderHome(); window.scrollTo(0, 0);
  };
  window.dcBackHome = function () { curGame = null; renderHome(); window.scrollTo(0, 0); };
  window.dcOpen = function (g) { init(); curGame = g; renderPuzzle(); window.scrollTo(0, 0); };
  window.dcHideScreen = () => { const e = $('dailyScreen'); if (e) e.style.display = 'none'; clearInterval(timer); };
  function shareText() {
    const st = streak(), lines = S.games.map(g => `${GAMES[g].title}: ${(S.res[g] && S.res[g].score) || 0}/100`).join('\n');
    return `Daily Challenge · ${S.date}\n${lines}\nTotal ${totalScore()}/200${st.count ? ' · 🔥 ' + st.count : ''}\n${S.games.map(g => (S.res[g] && S.res[g].share) || '').filter(Boolean).join('\n')}\n${location.origin}${location.pathname}`;
  }
  function renderHome() {
    clearInterval(timer);
    const st = streak(), done = doneCount() === 2;
    const cards = S.games.map((g, i) => { const r = S.res[g] || {}, G = GAMES[g]; return `<div class="dc-card ${r.done ? 'done' : ''}"><div class="dc-card-n">${i + 1}</div><div class="dc-card-t"><b>${G.title}</b><small>${G.short}</small></div>${r.done ? `<div class="dc-score">${r.score || 0}<small>/100</small></div>` : `<button class="dc-btn" onclick="dcOpen('${g}')">${r.st ? 'Continue' : 'Play'} ›</button>`}</div>`; }).join('');
    $('dcBody').innerHTML = `<div class="dc-eyebrow">DAILY CHALLENGE</div><div class="dc-title">${prettyDate(S.date)}</div><div class="dc-sub">New puzzles every day · 2 puzzles · up to 200 points</div>
      <div class="dc-streak"><span class="dc-chip">🔥 Streak <b>${st.last === S.date || st.last === yesterday() ? st.count : 0}</b></span><span class="dc-chip">Best <b>${st.best || 0}</b></span></div>
      ${cards}
      ${done ? `<div class="dc-total"><div class="l">Today's score</div><div class="n">${totalScore()}<span style="font-size:1.2rem;color:#9bb5a6"> / 200</span></div></div>
        <div class="dc-actions"><button class="dc-btn" id="dcShare">📋 Copy result</button></div><div class="dc-msg" id="dcShareMsg"></div>
        <div class="dc-note">Done for today! Next challenge in <b id="dcTimer"></b>. Until then — the rest of the games are waiting.</div>`
        : `<div class="dc-note">Finish both puzzles to keep your streak. Every puzzle is worth up to 100 points.</div>`}
      <div class="dc-actions"><button class="dc-btn ${done ? 'big' : 'sec'}" onclick="showLanding()">Play the other games ›</button></div>`;
    const sh = $('dcShare'); if (sh) sh.onclick = () => { const t = shareText(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { $('dcShareMsg').textContent = 'Copied — paste it anywhere!'; }, () => { $('dcShareMsg').textContent = t; }); };
    if (done) { const tick = () => { const n = new Date(), next = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + 1), s = Math.max(0, Math.floor((next - n.getTime()) / 1000)); const el = $('dcTimer'); if (el) el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`; }; tick(); timer = setInterval(tick, 1000); }
  }
  function yesterday() { const d = new Date(dayNumber(S.date) * 86400000 - 86400000); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }
  function renderPuzzle() {
    const G = GAMES[curGame], r = (S.res[curGame] ||= {});
    $('dcBody').innerHTML = `<div class="dc-ph"><h2>${G.title}</h2><button class="dc-btn sec" onclick="dcBackHome()">‹ Today</button></div><div class="dc-how">${G.how}</div><div id="dcGame" style="width:100%"></div>`;
    try { RENDER[curGame]($('dcGame'), r); } catch (e) { $('dcGame').innerHTML = `<div class="dc-note">This puzzle could not be built (${esc(e.message)}). Try again tomorrow.</div>`; console.error(e); }
  }
  // the banner on the landing page
  window.dcUpdateHero = function () {
    const sub = $('dcHeroSub'), btn = $('dcHeroBtn'); if (!sub || !ready()) return;
    init(); const n = doneCount(), st = streak();
    sub.textContent = n === 2 ? `Done for today · ${totalScore()}/200 · 🔥 ${st.count} day streak` : n === 1 ? '1 of 2 puzzles done — finish today\'s challenge' : '2 new puzzles today · Footle · Season Line · Football Chain · and more' + (st.count ? ` · 🔥 ${st.count}` : '');
    btn.textContent = n === 2 ? 'See result ›' : n === 1 ? 'Continue ›' : 'Play today ›';
  };
  document.addEventListener('DOMContentLoaded', () => { try { window.dcUpdateHero(); } catch (e) { /* data not there */ } });
  window.dcUpdateHero && setTimeout(() => { try { window.dcUpdateHero(); } catch (e) { /* ignore */ } }, 0);
})();
