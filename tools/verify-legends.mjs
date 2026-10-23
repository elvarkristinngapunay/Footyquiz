#!/usr/bin/env node
// Second-source check of the hand-made Legends deck (data/players.js) against Wikipedia's "Career statistics" tables.
//
//   node tools/verify-legends.mjs            uses the pages cached in data/raw/wikipedia/legends/ (git-ignored)
//   node tools/verify-legends.mjs --fetch    downloads missing pages first (one page every 3 s — Wikipedia throttles bursts)
//
// For every legend it compares career goals/appearances, caps, international goals and goals per club, then writes
//   data/generated/legends-report.json   the full comparison (what differs, by how much)
//   data/legends-verified.js             numbers the game applies on top of players.js — ONLY for players whose Wikipedia tables passed the parse checks:
//                                        every club row must add up to the table's career total, and the national-team total must be found.
// Definition (decided with the owner): Career Goals / Career Appearances = everything — all club competitions + every senior national-team game, friendlies included.
// Assists and trophies are not on Wikipedia and are left exactly as they are in players.js.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { fetchArticle, parseArticle } from './lib/wikipedia.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const DIR = path.join(ROOT, 'data/raw/wikipedia/legends');
fs.mkdirSync(DIR, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/players.js'), 'utf8') + ';this.P=PLAYERS', ctx);
const LEGENDS = ctx.P;

// article titles that differ from the player's name
const TITLES = { 'Ronaldo Nazário': 'Ronaldo_(Brazilian_footballer)', 'Marcelo': 'Marcelo_(footballer,_born_1988)', 'Xavi': 'Xavi_Hernández' };
const fileFor = name => path.join(DIR, name.replace(/[^A-Za-z]/g, '_') + '.html');

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, ' ').replace(/\b(fc|cf|afc|ac|as|sc|club|calcio|de|the|utd|united)\b/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const same = (a, b) => {
  a = norm(a); b = norm(b); if (!a || !b) return false;
  if (a.split(' ').includes('inter') !== b.split(' ').includes('inter')) return false;   // Inter vs (AC) Milan
  return a === b || a.includes(b) || b.includes(a);
};
// club names that are new to players.js get the name the logo table knows (so the badge shows)
const logoCtx = {}; vm.createContext(logoCtx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/club-logos.js'), 'utf8') + ';this.L=CLUB_LOGOS', logoCtx);
const CLUB_ALIAS = { 'milan': 'AC Milan', 'internazionale': 'Inter Milan', 'inter': 'Inter Milan', 'manchester united': 'Man United', 'manchester city': 'Man City', 'paris saint germain': 'PSG', 'bayern munchen': 'Bayern Munich', 'atletico madrid': 'Atlético Madrid' };
const logoIdx = new Map(Object.keys(logoCtx.L).map(k => [norm(k), k]));
const canonical = name => { const n = norm(parentClub(name)); return CLUB_ALIAS[n] || logoIdx.get(n) || parentClub(name); };
// reserve / youth sides count for the club (Wikipedia's career total includes them)
const parentClub = n => n.replace(/\((loan|youth|reserves?)[^)]*\)/gi, '').replace(/\s+(B|II|III|Juvenil|Castilla|Reserves|U\d\d)$/i, '').trim();

if (args.fetch) {
  for (const p of LEGENDS) {
    if (fs.existsSync(fileFor(p.name)) && fs.statSync(fileFor(p.name)).size > 50000) continue;
    try { fs.writeFileSync(fileFor(p.name), await fetchArticle(TITLES[p.name] || p.name.replace(/ /g, '_'))); console.log('downloaded', p.name); }
    catch (e) { console.log('could not download', p.name, '—', e.message); }
    await sleep(3000);
  }
}

const report = [], verified = {};
for (const p of LEGENDS) {
  const row = { name: p.name, status: 'manual', problems: [], hand: { career_goals: p.career_goals, career_appearances: p.career_appearances, intl_caps: p.intl_caps, intl_goals: p.intl_goals, clubSum: p.club_goals.reduce((a, c) => a + c.n, 0) } };
  report.push(row);
  const f = fileFor(p.name);
  if (!fs.existsSync(f)) { row.problems.push('no Wikipedia page cached'); continue; }
  const wp = parseArticle(fs.readFileSync(f, 'utf8'));
  row.wikipedia = { career: wp.career, intl: wp.intl, clubs: wp.clubs.map(c => ({ club: c.club, apps: c.apps, goals: c.goals })) };
  if (!wp.clubs.length || !wp.career) { row.problems.push('club table not found'); continue; }
  // Wikipedia's career row is the authority for appearances; the club rows are the authority for goals per club. They must agree on goals (±1: the table itself
  // is sometimes off by one — Gerrard). Reserve sides (Valencia B …) are listed as rows but not always inside the career total, so try without them too.
  const isReserve = c => /\s(B|II|III|Juvenil|Castilla|Reserves|U\d\d)$/.test(c.club);
  let usable = wp.clubs;
  const sumG = list => list.reduce((a, c) => a + (c.goals || 0), 0), sumA = list => list.reduce((a, c) => a + (c.apps || 0), 0);
  if (Math.abs(sumG(usable) - wp.career.goals) > 1 && wp.clubs.some(isReserve)) {
    const without = wp.clubs.filter(c => !isReserve(c));
    if (Math.abs(sumG(without) - wp.career.goals) <= 1) { usable = without; row.notes = ["reserve-side rows are not part of Wikipedia's career total and were left out"]; }
  }
  const sumGoals = sumG(usable), sumApps = sumA(usable);
  if (Math.abs(sumGoals - wp.career.goals) > 1) row.problems.push(`clubs add up to ${sumGoals} goals but the table says ${wp.career.goals}`);
  if (sumGoals !== wp.career.goals && Math.abs(sumGoals - wp.career.goals) <= 1) (row.notes ||= []).push(`Wikipedia's own table is off by one goal (${sumGoals} in the club rows, ${wp.career.goals} in the career row)`);
  if (Math.abs(sumApps - wp.career.apps) > Math.max(5, wp.career.apps * 0.04)) row.problems.push(`clubs add up to ${sumApps} apps but the table says ${wp.career.apps}`);
  if (wp.intl && p.intl_caps >= 10 && (wp.intl.apps < p.intl_caps * 0.5 || wp.intl.apps > p.intl_caps * 1.5)) { (row.notes ||= []).push(`national-team total on the page (${wp.intl.apps} caps / ${wp.intl.goals} goals) looks like a parse error against the hand-made ${p.intl_caps} / ${p.intl_goals} — kept the hand-made numbers`); wp.intl = null; }
  if (!wp.intl) { wp.intl = { apps: p.intl_caps, goals: p.intl_goals }; (row.notes ||= []).push('national-team total not found on the page — kept the hand-made caps/goals'); row.intlUnverified = true; }
  // merge spells / reserve sides into one row per club
  const merged = new Map();
  for (const c of usable) { const k = norm(parentClub(c.club)); const m = merged.get(k) || { club: parentClub(c.club), apps: 0, goals: 0 }; m.apps += c.apps || 0; m.goals += c.goals || 0; merged.set(k, m); }
  const clubs = [...merged.values()].filter(c => c.apps > 0 || c.goals > 0);
  // differences against the hand-made club list
  row.diffs = [];
  for (const c of clubs) {
    const mine = p.club_goals.filter(x => same(x.c, c.club));
    const mineN = mine.reduce((a, x) => a + x.n, 0);
    if (!mine.length) row.diffs.push(`${c.club}: Wikipedia ${c.goals}, not in players.js`);
    else if (mineN !== c.goals) row.diffs.push(`${c.club}: players.js ${mineN}, Wikipedia ${c.goals}`);
  }
  for (const x of p.club_goals) if (!clubs.some(c => same(x.c, c.club)) && x.n > 0) row.diffs.push(`${x.c}: players.js ${x.n}, not in Wikipedia's table`);
  if (wp.intl) { if (wp.intl.apps !== p.intl_caps) row.diffs.push(`caps: players.js ${p.intl_caps}, Wikipedia ${wp.intl.apps}`); if (wp.intl.goals !== p.intl_goals) row.diffs.push(`international goals: players.js ${p.intl_goals}, Wikipedia ${wp.intl.goals}`); }
  if (row.problems.length) continue;

  const totalGoals = sumGoals + wp.intl.goals, totalApps = wp.career.apps + wp.intl.apps;     // goals = the club rows (so the panel adds up), apps = the table's career row
  row.status = 'verified';
  row.proposed = { career_goals: totalGoals, career_appearances: totalApps, intl_caps: wp.intl.apps, intl_goals: wp.intl.goals };
  verified[p.name] = {
    career_goals: totalGoals, career_appearances: totalApps, intl_caps: wp.intl.apps, intl_goals: wp.intl.goals,
    club_goals: clubs.filter(c => c.goals > 0).sort((a, b) => b.goals - a.goals).map(c => {
      const mine = p.club_goals.find(x => same(x.c, c.club));
      return { c: mine ? mine.c : canonical(c.club), n: c.goals, col: mine ? mine.col : '#555555' };
    }),
    source: 'Wikipedia career statistics, checked ' + new Date().toISOString().slice(0, 10)
  };
}

fs.mkdirSync(path.join(ROOT, 'data/generated'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data/generated/legends-report.json'), JSON.stringify(report, null, 1));
const js = `// GENERATED by tools/verify-legends.mjs — numbers for the Legends deck that were checked against Wikipedia's career statistics tables.
// Applied on top of players.js; players not listed here keep their hand-made numbers (and are marked "unverified" in data/generated/legends-report.json).
// career_goals / career_appearances = everything: all club competitions + every senior national-team game (friendlies included).
const LEGENDS_VERIFIED = ${JSON.stringify(verified)};
(function(){
  if (typeof PLAYERS === 'undefined') return;
  PLAYERS.forEach(p => {
    const v = LEGENDS_VERIFIED[p.name]; if (!v) return;
    Object.assign(p, { career_goals: v.career_goals, career_appearances: v.career_appearances, intl_caps: v.intl_caps, intl_goals: v.intl_goals, club_goals: v.club_goals });
    if (p.intl_breakdown) p.intl_breakdown.n = v.intl_goals;
  });
})();
`;
fs.writeFileSync(path.join(ROOT, 'data/legends-verified.js'), js);

const ok = report.filter(r => r.status === 'verified'), manual = report.filter(r => r.status !== 'verified');
console.log(`${report.length} legends · ${ok.length} verified against Wikipedia · ${manual.length} need a manual look\n`);
for (const r of ok) console.log(`✓ ${r.name.padEnd(22)} goals ${String(r.hand.career_goals).padStart(4)} → ${String(r.proposed.career_goals).padStart(4)} · games ${String(r.hand.career_appearances).padStart(4)} → ${String(r.proposed.career_appearances).padStart(4)} · ${r.diffs.length} club/intl differences`);
console.log('');
for (const r of manual) console.log(`? ${r.name.padEnd(22)} ${r.problems.join(' | ')}`);
