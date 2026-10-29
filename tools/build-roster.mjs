#!/usr/bin/env node
// Builds a candidate list of well-known footballers from Wikidata (free, no key, no API-Football requests).
// Fame = number of Wikipedia languages the player has an article in. Only players born in/after FROM have careers that overlap
// API-Football's player statistics (which start in 2010).
//
//   node tools/build-roster.mjs                     (born 1976–2008, fame ≥ 35 languages)
//   node tools/build-roster.mjs --from=1976 --to=2008 --min=35
//   node tools/build-roster.mjs --from=1990 --to=1990     (test one year)
//   node tools/build-roster.mjs --from=1964 --to=1975 --min=30 --out=tools/roster-older.json   (retired 2000s-era players for the era deck)
//
// Writes tools/roster-candidates.json — plain data, safe to commit.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const OUT = args.out ? String(args.out) : 'tools/roster-candidates.json';
const FROM = Number(args.from ?? 1976), TO = Number(args.to ?? 2008), MIN = Number(args.min ?? 35);
const UA = 'FootballRoyalDataFetch/1.0 (hobby quiz app; elvarkristinngapunay@gmail.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function sparql(query) {
  for (let t = 0; t < 4; t++) {
    try {
      const res = await fetch('https://query.wikidata.org/sparql', {
        method: 'POST', headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ query })
      });
      if (res.ok) return (await res.json()).results.bindings;
    } catch { /* retry */ }
    await sleep(5000 * (t + 1));
  }
  throw new Error('Wikidata did not answer');
}

const out = [];
for (let y = FROM; y <= TO; y++) {
  const rows = await sparql(`SELECT ?p ?pLabel ?dob ?sl WHERE {
    ?p wdt:P106 wd:Q937857 ; wdt:P21 wd:Q6581097 ; wdt:P569 ?dob ; wikibase:sitelinks ?sl .
    FILTER(?sl >= ${MIN} && ?dob >= "${y}-01-01T00:00:00Z"^^xsd:dateTime && ?dob < "${y + 1}-01-01T00:00:00Z"^^xsd:dateTime)
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
  }`);
  const seen = new Set();
  for (const b of rows) {
    const qid = b.p.value.split('/').pop();
    if (seen.has(qid)) continue; seen.add(qid);
    out.push({ qid, name: b.pLabel.value, born: b.dob.value.slice(0, 10), fame: Number(b.sl.value) });
  }
  console.log(`${y}: ${seen.size} players`);
  await sleep(800);
}
out.sort((a, b) => b.fame - a.fame);
fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify(out, null, 0));
console.log(`\n${out.length} candidates written to ${OUT}`);
for (const n of [100, 200, 300, 500, 800]) if (out.length >= n) console.log(`  top ${n}: needs ≥ ${out[n - 1].fame} Wikipedia languages (#${n} = ${out[n - 1].name}, b. ${out[n - 1].born.slice(0, 4)})`);
console.log('  top 25:', out.slice(0, 25).map(r => `${r.name} (${r.born.slice(0, 4)})`).join(', '));
