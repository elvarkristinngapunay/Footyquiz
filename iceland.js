// Íslenska hornið — Higher or Lower with players from Besta deildin (the Icelandic top flight), counted from 1992 on.
// Numbers come from KSÍ (data/iceland.js, built by tools/build-iceland.mjs). Three decks × three categories, all in Icelandic.
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ls = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private window */ } }
  };
  const CATS = { m: { name: 'Mörk', word: 'mörk', min: 20 }, g: { name: 'Leikir', word: 'leiki', min: 100 }, c: { name: 'Spjöld', word: 'spjöld', min: 15 } };
  const DECKS = {
    legends: { name: 'Goðsagnir', sub: 'Þeir 30 efstu í hverjum flokki frá 1992' },
    era: { name: '20. öldin', sub: 'Byrjuðu í efstu deild 1992–1999' },
    modern: { name: 'Modern', sub: 'Byrjuðu í efstu deild 2000–2008' }
  };
  const bestKey = (d, c) => `ice_best_${d}_${c}`;
  const best = (d, c) => +ls.get(bestKey(d, c)) || 0;
  let S = null;                                                             // the running game

  function pool(deck, cat) {
    const P = ICE_DATA.players, min = CATS[cat].min;
    if (deck === 'legends') return P.slice().sort((a, b) => b[cat] - a[cat]).slice(0, 30);
    const lo = deck === 'era' ? 1992 : 2000, hi = deck === 'era' ? 1999 : 2008;
    return P.filter(p => p.f >= lo && p.f <= hi && p[cat] >= min);
  }
  // the next player: a different number, not asked lately, and within three times the current one — so the pair is never an easy guess
  function pickNext(cur) {
    const v = cur[S.cat], fresh = S.pool.filter(p => p !== cur && p[S.cat] !== v && !S.used.has(p.n));
    const close = fresh.filter(p => Math.max(p[S.cat], v) / Math.max(1, Math.min(p[S.cat], v)) <= 3);
    const from = close.length ? close : fresh.length ? fresh : S.pool.filter(p => p !== cur && p[S.cat] !== v);
    const p = from[Math.floor(Math.random() * from.length)];
    S.used.add(p.n); if (S.used.size >= S.pool.length - 1) S.used = new Set([cur.n, p.n]);
    return p;
  }
  function startGame(deck, cat) {
    clearTimeout(S && S.timer);
    const pl = pool(deck, cat);
    S = { deck, cat, pool: pl, used: new Set(), streak: 0, state: 'ask', timer: null };
    S.left = pl[Math.floor(Math.random() * pl.length)]; S.used.add(S.left.n);
    S.right = pickNext(S.left);
    renderGame();
  }
  function ensureScreen() {
    if ($('iceScreen')) return;
    const d = document.createElement('div'); d.id = 'iceScreen';
    d.innerHTML = '<div id="iceBody" style="width:100%;display:flex;flex-direction:column;align-items:center;"></div>';
    const anchor = $('dailyScreen'); anchor.parentNode.insertBefore(d, anchor.nextSibling);
  }

  function renderMenu() {
    clearTimeout(S && S.timer); S = null;
    $('iceBody').innerHTML = `<div class="dc-eyebrow">BESTA DEILDIN FRÁ ${ICE_DATA.from}</div><div class="dc-title">Íslenska hornið</div>
      <div class="dc-sub">Hærra eða lægra með íslenskum fótboltamönnum</div>
      ${Object.entries(DECKS).map(([k, d]) => `<div class="dc-card ice-deck"><div class="dc-card-t"><b>${d.name}</b><small>${d.sub}</small></div>
        <div class="ice-cats">${Object.entries(CATS).map(([c, v]) => `<button class="dc-btn" data-d="${k}" data-c="${c}">${v.name}${best(k, c) ? ` · ${best(k, c)}` : ''}</button>`).join('')}</div></div>`).join('')}
      <div class="dc-note">Tölurnar eru frá KSÍ: leikir, mörk og spjöld (gul og rauð saman) í efstu deild karla frá og með ${ICE_DATA.from} til ${ICE_DATA.season}. Talan á hnappnum er besta röðin þín.</div>`;
    $('iceBody').querySelectorAll('.ice-cats .dc-btn').forEach(b => { b.onclick = () => startGame(b.dataset.d, b.dataset.c); });
  }

  const card = (p, show, cls) => {
    const cat = S.cat, clubs = (p.k || []).join(' · ');
    return `<div class="dc-pc ${cls || ''}"><div class="nm">${esc(p.n)}</div>
      <div class="sb">${p.b ? 'f. ' + p.b + '<br>' : ''}${esc(clubs)}${p.l >= ICE_DATA.season ? '<br>spilar enn' : ''}</div>
      <div class="val ${show ? '' : 'hid'}">${show ? p[cat] : '?'}</div><div class="sb">${CATS[cat].word}</div></div>`;
  };
  function renderGame() {
    const { deck, cat, left, right, state } = S, ask = state === 'ask', ok = state === 'right', b = best(deck, cat);
    $('iceBody').innerHTML = `<div class="dc-ph"><h2>${DECKS[deck].name} · ${CATS[cat].name}</h2><button class="dc-btn sec" id="iceBack">‹ Valmynd</button></div>
      <div class="dc-streak"><span class="dc-chip">Röð <b>${S.streak}</b></span><span class="dc-chip">Best <b>${b}</b></span></div>
      <div class="dc-q">Hefur hægri leikmaðurinn <b>fleiri</b> eða <b>færri</b> ${CATS[cat].word} í efstu deild frá 1992?</div>
      ${ask ? '' : `<div class="dc-verdict ${ok ? 'ok' : 'no'}">${ok ? '✓ RÉTT' : '✗ RANGT'}</div>`}
      <div class="dc-vs">${card(left, true, '')}${card(right, !ask, ask ? '' : ok ? 'right' : 'wrong')}</div>
      ${ask ? `<div class="dc-hl"><button class="up" id="iceUp">▲ Fleiri</button><button class="down" id="iceDown">▼ Færri</button></div>`
        : ok ? `<div class="dc-q">${esc(right.n)}: ${right[cat]} ${CATS[cat].word} · ${esc(left.n)}: ${left[cat]}</div>`
          : `<div class="dc-q">${esc(right.n)}: ${right[cat]} ${CATS[cat].word} · ${esc(left.n)}: ${left[cat]}</div>
             <div class="dc-result"><div class="rt">Röðin þín: ${S.streak}</div><div class="sm">Besta röðin: ${b}</div>
             <div class="dc-actions" style="margin-top:10px"><button class="dc-btn big" id="iceAgain">Reyna aftur ›</button><button class="dc-btn sec" id="iceMenu">Valmynd</button></div></div>`}`;
    $('iceBack').onclick = renderMenu;
    if (ask) { $('iceUp').onclick = () => guess(true); $('iceDown').onclick = () => guess(false); }
    else if (!ok) { $('iceAgain').onclick = () => startGame(deck, cat); $('iceMenu').onclick = renderMenu; }
  }
  function guess(up) {
    if (!S || S.state !== 'ask') return;
    const higher = S.right[S.cat] > S.left[S.cat];
    if (up === higher) {
      S.state = 'right'; S.streak++;
      if (S.streak > best(S.deck, S.cat)) ls.set(bestKey(S.deck, S.cat), String(S.streak));
      renderGame();
      const me = S; S.timer = setTimeout(() => { if (S !== me) return; S.left = S.right; S.right = pickNext(S.left); S.state = 'ask'; renderGame(); }, 1400);
    } else { S.state = 'wrong'; renderGame(); }
  }

  window.showIceland = function () {
    if (typeof ICE_DATA === 'undefined') { alert('Gögnin hlóðust ekki.'); return; }
    setBg(false); if (typeof closeAllOverlays === 'function') closeAllOverlays();
    ['landingScreen', 'higherOrLowerSection', 'elGrandeMenu', 'elGrandeGame', 'gameScreen', 'sxiScreen', 'mbScreen', 'top10Screen', 'careerScreen', 'closestWinsScreen', 'auctionScreen', 'dailyScreen', 'catScreen']
      .forEach(id => { const e = $(id); if (e) e.style.display = 'none'; });
    ensureScreen(); $('iceScreen').style.display = 'flex';
    setBackBtn('← Til baka', window.showLanding);
    renderMenu(); window.scrollTo(0, 0);
  };
  window.iceHideScreen = function () { const e = $('iceScreen'); if (e) e.style.display = 'none'; if (S) clearTimeout(S.timer); };
})();
