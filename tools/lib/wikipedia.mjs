// Reads the "Career statistics" tables of a player's English Wikipedia article: goals/appearances per club (all competitions) and the senior national-team total.
// Used as the independent second source for the Legends deck (tools/verify-legends.mjs). Wikipedia's club tables list competitive matches only;
// its national-team "Total" row is the senior team incl. friendlies — the same convention as Transfermarkt and as this game.

const UA = 'FootballRoyalQuiz/1.0 (personal quiz project; low-volume)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const strip = h => h.replace(/<sup[\s\S]*?<\/sup>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#91;|&#93;/g, '').replace(/\s+/g, ' ').trim();
const num = t => /^\d{1,3}(,\d{3})*$|^\d+$/.test(t) ? Number(t.replace(/,/g, '')) : null;
const SEASON = /^(\d{4}([–-]\d{2,4})?|\d{4}\/\d{2,4})$/;
const rowsOf = tableHtml => [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m => [...m[1].matchAll(/<(t[hd])([^>]*)>([\s\S]*?)<\/\1>/g)].map(c => ({ tag: c[1], attrs: c[2], text: strip(c[3]) })));

// Downloads the rendered article. Wikipedia throttles bursts ("You are making too many requests"), so: one page every few seconds, retry with back-off.
export async function fetchArticle(title) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const r = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&formatversion=2&redirects=1`, { headers: { 'User-Agent': UA } });
      const j = JSON.parse(await r.text());
      if (j.parse) return j.parse.text;
      if (j.error) throw Object.assign(new Error(j.error.info || 'no page'), { fatal: true });
    } catch (e) { if (e.fatal) throw e; }
    await sleep(8000 * (attempt + 1));
  }
  throw new Error('Wikipedia kept throttling');
}

export function parseArticle(html) {
  const tables = [...html.matchAll(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/g)].map(m => m[1]);
  const head = (t, n = 9000) => strip(t.slice(0, n));
  const clubT = tables.find(t => /Club/.test(head(t)) && /Season/.test(head(t)) && /Apps/.test(head(t)) && /Total/.test(head(t)));
  const natT = tables.find(t => /(National team|Team)/.test(head(t, 900)) && /Year/.test(head(t, 900)) && /Apps/.test(head(t, 3000)) && !/Season/.test(head(t, 900)));
  const res = { clubs: [], career: null, intl: null };
  if (clubT) {
    let cur = null, seasons = [];
    const flush = () => {
      if (cur && !cur.done && seasons.length) {
        if (seasons.length === 1) { cur.apps = seasons[0].apps; cur.goals = seasons[0].goals; }
        else { cur.apps = seasons.reduce((a, x) => a + x.apps, 0); cur.goals = seasons.reduce((a, x) => a + x.goals, 0); cur.derived = true; }
        cur.done = true;
      }
      if (cur) res.clubs.push(cur);
      cur = null; seasons = [];
    };
    for (const cells of rowsOf(clubT)) {
      if (!cells.length) continue;
      const all = cells.map(c => c.text).join(' ');
      const nums = cells.map(c => num(c.text)).filter(n => n !== null);
      if (/career total/i.test(all)) { flush(); res.career = { apps: nums.at(-2), goals: nums.at(-1) }; continue; }
      const first = cells[0];
      if (/^(Club|Season)$/i.test(first.text) || cells.every(c => c.tag === 'th' && !/Total/i.test(c.text))) continue;
      if (/^Total$/i.test(first.text)) {
        // some pages label the career total just "Total": a one-season last club has no total row of its own, so a Total that equals everything before + that season IS the career row
        if (cur && !cur.done && seasons.length === 1 && res.clubs.length >= 1 && nums.length >= 2) {
          const pa = res.clubs.reduce((a, c) => a + c.apps, 0), pg = res.clubs.reduce((a, c) => a + c.goals, 0);
          if (nums.at(-2) === pa + seasons[0].apps && nums.at(-1) === pg + seasons[0].goals) { flush(); res.career = { apps: nums.at(-2), goals: nums.at(-1) }; continue; }
        }
        if (cur && nums.length >= 2) {
          // A player who comes back to a club gets a "Total" row for the second block that already contains the first spell. When
          // (earlier block of the same club) + (this block's own seasons) equals that total, keep only this block's own seasons.
          const ownA = seasons.reduce((a, x) => a + x.apps, 0), ownG = seasons.reduce((a, x) => a + x.goals, 0);
          const key = c => c.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
          const prev = res.clubs.filter(c => key(c.club) === key(cur.club));
          // try every run of the most recent earlier blocks of this club (a loan spell may sit between two permanent ones)
          let combined = false;
          if (seasons.length) for (let k = 1; k <= prev.length && !combined; k++) {
            const tail = prev.slice(-k), pa = tail.reduce((a, c) => a + c.apps, 0), pg = tail.reduce((a, c) => a + c.goals, 0);
            if (pa + ownA === nums.at(-2) && pg + ownG === nums.at(-1)) combined = true;
          }
          if (combined) { cur.apps = ownA; cur.goals = ownG; cur.combinedTotal = true; }
          else { cur.apps = nums.at(-2); cur.goals = nums.at(-1); }
          cur.done = true;
        }
        continue;
      }
      if (SEASON.test(first.text)) { if (nums.length >= 2) seasons.push({ apps: nums.at(-2), goals: nums.at(-1) }); continue; }
      if (first.text) { flush(); cur = { club: first.text }; const sc = cells[1]; if (sc && SEASON.test(sc.text) && nums.length >= 2) seasons.push({ apps: nums.at(-2), goals: nums.at(-1) }); }
    }
    flush();
  }
  if (natT) {
    for (const cells of rowsOf(natT)) {                      // the senior "Total" row (the "Career total" row also counts youth teams — not used)
      if (cells.length && /^Total$/i.test(cells[0].text)) { const nums = cells.map(c => num(c.text)).filter(n => n !== null); if (nums.length >= 2) res.intl = { apps: nums.at(-2), goals: nums.at(-1) }; }
    }
  }
  return res;
}
