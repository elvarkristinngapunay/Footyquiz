#!/usr/bin/env node
// Pulls FotMob's season-by-season career for a list of players and caches it in data/raw/fotmob/<fotmobId>.json (git-ignored).
//
//   node tools/fetch-fotmob.mjs --current            every player in data/players-modern.js (born date from the API cache is the identity check)
//   node tools/fetch-fotmob.mjs --file=names.json     [{ name, born: 'YYYY-MM-DD' | 'YYYY', key }] → ids in data/raw/fotmob/index.json
//   node tools/fetch-fotmob.mjs --refresh             re-download pages that are already cached (the weekly run)
//
// A search hit only counts when FotMob's birth date equals the one we hold (exact date when we have it, otherwise the year). No match → no FotMob data → nothing is released from FotMob.
// One request per 1.2 s. The index maps our key (name) → { id, name, born } or { id: null, why }.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { fotmobSearch, fotmobPlayer, pause } from './lib/fotmob.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const DIR = path.join(ROOT, 'data/raw/fotmob'); fs.mkdirSync(DIR, { recursive: true });
const INDEX = path.join(DIR, 'index.json');
const index = fs.existsSync(INDEX) ? JSON.parse(fs.readFileSync(INDEX, 'utf8')) : {};
const save = () => fs.writeFileSync(INDEX, JSON.stringify(index, null, 1));
const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

let wanted = [];
if (args.current) {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/players-modern.js'), 'utf8') + ';this.M=PLAYERS_MODERN', ctx);
  const stats = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/generated/player-stats.json'), 'utf8')).players;
  const pilot = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/generated/career-pilot.json'), 'utf8')).players || {};
  wanted = ctx.M.map(p => ({ key: p.name, name: p.name, born: (pilot[p.apiId] || stats[p.apiId])?.born }));
} else if (args.file) wanted = JSON.parse(fs.readFileSync(path.resolve(args.file), 'utf8'));
else { console.error('use --current or --file=<json>'); process.exit(1); }

let done = 0, bad = 0;
for (const w of wanted) {
  const have = index[w.key];
  const cached = have?.id && fs.existsSync(path.join(DIR, have.id + '.json'));
  if (have && (have.id === null ? !args.retry : cached && !args.refresh)) continue;
  try {
    let hit = null;
    if (args.refresh && have?.id) {                       // the weekly run: the id is known, so no search — just the page again
      const data = await fotmobPlayer(have.id); await pause(1200);
      if (data.born && have.born && Math.abs(Date.parse(data.born) - Date.parse(have.born)) <= 86400000) { fs.writeFileSync(path.join(DIR, data.id + '.json'), JSON.stringify(data)); done++; }
      else { bad++; console.log('! birth date changed for', w.key, '— left as it was'); }
      continue;
    }
    const terms = [w.name, ...(w.alt || [])];
    for (const term of terms) {
      const found = (await fotmobSearch(term)).filter(f => fold(f.name) === fold(term) || fold(f.name).split(' ').slice(-1)[0] === fold(term).split(' ').slice(-1)[0]);
      await pause(1200);
      for (const f of found.slice(0, 4)) {
        const data = have?.id === f.id && cached ? JSON.parse(fs.readFileSync(path.join(DIR, f.id + '.json'), 'utf8')) : await fotmobPlayer(f.id);
        await pause(1200);
        // FotMob stores the birth moment in UTC, so a player born in the evening/night local time can be a day off
        const dayDiff = (a, b) => Math.abs(Date.parse(a) - Date.parse(b)) / 86400000;
        const okBorn = !w.born ? false : String(w.born).length >= 10 ? dayDiff(data.born, String(w.born).slice(0, 10)) <= 1 : String(data.born).startsWith(String(w.born));
        if (okBorn) { hit = data; break; }
      }
      if (hit) break;
    }
    if (hit) { fs.writeFileSync(path.join(DIR, hit.id + '.json'), JSON.stringify(hit)); index[w.key] = { id: hit.id, name: hit.name, born: hit.born }; done++; console.log('✓', w.key, '→', hit.id, hit.born, hit.seasons.length + ' seasons'); }
    else { index[w.key] = { id: null, why: 'no FotMob player with this name and birth date' }; bad++; console.log('✗', w.key, w.born); }
  } catch (e) { console.log('! ', w.key, e.message); bad++; }
  if ((done + bad) % 10 === 0) save();
}
save();
console.log(`\n${done} fetched · ${bad} not matched · ${Object.values(index).filter(x => x.id).length} players cached in total`);
