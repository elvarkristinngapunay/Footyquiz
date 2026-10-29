#!/usr/bin/env node
// Downloads the English Wikipedia articles of retired-player candidates for the "2000s era" deck into data/raw/wikipedia/era/<qid>.html (git-ignored).
//
//   node tools/fetch-era-pages.mjs --min=50        candidates with at least 50 Wikipedia languages (see tools/build-roster.mjs), one page every 2 s
//
// Candidates: tools/roster-older.json (born 1964–1975) + tools/roster-candidates.json (born up to 1990), minus everyone who is in the Current deck.
// Nothing is judged here — tools/build-era.mjs reads the pages and decides (retired? well known? do the tables add up? does FotMob agree?).

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { fetchArticle } from './lib/wikipedia.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const MIN = Number(args.min ?? 50), BORN_TO = String(args.bornTo ?? 1990);
const DIR = path.join(ROOT, 'data/raw/wikipedia/era'); fs.mkdirSync(DIR, { recursive: true });
const TITLES = path.join(ROOT, 'data/raw/wikipedia/era-titles.json');
const titles = fs.existsSync(TITLES) ? JSON.parse(fs.readFileSync(TITLES, 'utf8')) : {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'FootballRoyalQuiz/1.0 (personal quiz project; low-volume)';
const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/players-modern.js'), 'utf8') + ';this.M=PLAYERS_MODERN', ctx);
const current = new Set(ctx.M.map(p => fold(p.name)));
const read = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const seen = new Set();
const cands = [...read('tools/roster-older.json'), ...read('tools/roster-candidates.json').filter(r => r.born < BORN_TO + '-12-32')]
  .filter(r => r.fame >= MIN && /^Q\d+$/.test(r.qid) && !current.has(fold(r.name)) && !seen.has(r.qid) && seen.add(r.qid))
  .sort((a, b) => b.fame - a.fame);
console.log(cands.length, 'candidates');

// enwiki titles from Wikidata, 50 ids per request
const need = cands.filter(c => !titles[c.qid]);
for (let i = 0; i < need.length; i += 50) {
  const chunk = need.slice(i, i + 50);
  let j = null;
  for (let attempt = 0; attempt < 8 && !j; attempt++) {                  // Wikidata answers "too many requests" in plain text when it is busy → wait and ask again
    try {
      const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${chunk.map(x => x.qid).join('|')}&props=sitelinks&sitefilter=enwiki&format=json`, { headers: { 'User-Agent': UA } });
      j = JSON.parse(await r.text());
    } catch { j = null; await sleep(20000 * (attempt + 1)); }
  }
  if (!j) { console.log('Wikidata keeps refusing — stopping, run again later'); process.exit(1); }
  for (const c of chunk) titles[c.qid] = j.entities?.[c.qid]?.sitelinks?.enwiki?.title?.replace(/ /g, '_') || null;
  fs.writeFileSync(TITLES, JSON.stringify(titles, null, 1));
  await sleep(1500);
}

let n = 0, miss = 0;
for (const c of cands) {
  const t = titles[c.qid]; const f = path.join(DIR, c.qid + '.html');
  if (!t || (fs.existsSync(f) && fs.statSync(f).size > 20000)) continue;
  try { fs.writeFileSync(f, await fetchArticle(t)); n++; if (n % 20 === 0) console.log(n, 'pages …', c.name); }
  catch (e) { miss++; console.log('could not download', c.name, '—', e.message); }
  await sleep(2000);
}
console.log(`done: ${n} downloaded, ${miss} failed`);
