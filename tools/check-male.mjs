#!/usr/bin/env node
// The game's decks are men's football. tools/roster-candidates.json was built before the roster query filtered on gender, so women are in it too.
// This asks Wikidata (property P21 "sex or gender") for every candidate whose Wikipedia page is cached in data/raw/wikipedia/era and stores { qid: true|false }
// in data/raw/wikipedia/era-male.json. tools/build-era.mjs only takes players Wikidata says are male.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'data/raw/wikipedia/era'), OUT = path.join(ROOT, 'data/raw/wikipedia/era-male.json');
const known = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const need = fs.readdirSync(DIR).map(f => f.replace('.html', '')).filter(q => /^Q\d+$/.test(q) && !(q in known));
for (let i = 0; i < need.length; i += 50) {
  const chunk = need.slice(i, i + 50);
  let j = null;
  for (let a = 0; a < 8 && !j; a++) {
    try { const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${chunk.join('|')}&props=claims&format=json`, { headers: { 'User-Agent': 'FootballRoyalQuiz/1.0 (personal quiz project; low-volume)' } }); j = JSON.parse(await r.text()); }
    catch { j = null; await sleep(20000 * (a + 1)); }
  }
  if (!j) { console.log('Wikidata keeps refusing — run again later'); break; }
  for (const q of chunk) { const g = j.entities?.[q]?.claims?.P21?.[0]?.mainsnak?.datavalue?.value?.id; if (g) known[q] = g === 'Q6581097'; }
  fs.writeFileSync(OUT, JSON.stringify(known));
  await sleep(2000);
}
console.log(Object.keys(known).length, 'checked ·', Object.values(known).filter(v => !v).length, 'not male');
