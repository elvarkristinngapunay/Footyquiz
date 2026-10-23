#!/usr/bin/env node
// Weekly safety gate: compares the freshly built deck with the one that is live (git HEAD) and refuses to continue when something looks wrong.
//   node tools/sanity.mjs            exit 0 = fine, exit 1 = stop and look
// A player's career totals can only grow from one week to the next; a drop means the API sent less than before (a hole), not that goals were un-scored.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = src => { const ctx = {}; vm.createContext(ctx); vm.runInContext(src + ';this.P=PLAYERS_MODERN', ctx); return ctx.P; };
let before;
try { before = load(execSync('git show HEAD:data/players-modern.js', { cwd: ROOT, encoding: 'utf8', maxBuffer: 50e6 })); } catch { console.log('no previous deck in git — nothing to compare'); process.exit(0); }
const after = load(fs.readFileSync(path.join(ROOT, 'data/players-modern.js'), 'utf8'));

const byName = new Map(after.map(p => [p.name, p]));
const problems = [];
if (after.length < before.length - 3) problems.push(`deck shrank from ${before.length} to ${after.length} players`);
let grew = 0;
for (const b of before) {
  const a = byName.get(b.name);
  if (!a) { problems.push(`${b.name} left the deck`); continue; }
  for (const k of ['career_goals', 'career_appearances', 'intl_caps', 'intl_goals', 'trophies']) {
    if (a[k] < b[k]) problems.push(`${b.name}: ${k} fell from ${b[k]} to ${a[k]}`);
    if (a[k] - b[k] > (k === 'career_appearances' ? 30 : 15)) problems.push(`${b.name}: ${k} jumped from ${b[k]} to ${a[k]} in one run`);
    if (a[k] > b[k]) grew++;
  }
}
console.log(`deck ${before.length} → ${after.length} players · ${grew} numbers went up`);
if (problems.length) { console.log('STOP — ' + problems.length + ' problem(s):\n  ' + problems.slice(0, 25).join('\n  ')); process.exit(1); }
console.log('sanity check passed');
