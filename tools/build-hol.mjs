#!/usr/bin/env node
// Builds data/players-modern.js — the "Modern Stars" deck for Higher or Lower — from the cached API answers. Makes no API requests.
//
//   node tools/build-hol.mjs
//
// What the numbers mean (the game labels them the same way):
//   goals / appearances             the whole career from the first season the API has lines for (2002/03 at the earliest): club competitions (league, cups, Europe, club world cups) + every senior national-team game, friendlies included (that is how caps/goals are quoted)
//                                   club friendlies and pre-season tournaments are left out (Transfermarkt's club tables leave them out too)
//   intl caps / intl goals          national-team games over the same seasons (no youth teams)
//   trophies                        the player's whole career: league titles, domestic cups, super cups, Europe, club world cups, national-team tournaments
// Only players whose lines passed the quality checks (or were repaired, see tools/lib/aggregate.mjs) AND the league-line cross-check (tools/crosscheck.mjs — run it first) are included.
// A player is in the deck only when every season from his 16th birthday (or 2002) was requested, so "career" is not a half-pulled career.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { isMajorTrophy, trophyLabel, hasWomensTrophy } from './lib/trophies.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const stats = readJson(path.join(ROOT, 'data/generated/player-stats.json'), null);
if (!stats) { console.error('data/generated/player-stats.json is missing'); process.exit(1); }
// players pulled back to 2002 (tools/fetch-players.mjs --seasons=2002-2026 --out=data/generated/career-pilot.json) replace their since-2010 records
Object.assign(stats.players, readJson(path.join(ROOT, 'data/generated/career-pilot.json'), { players: {} }).players);
// tools/crosscheck.mjs marks players whose seasons have a missing league line (the API has holes) — they stay out until looked at
const crosscheck = readJson(path.join(ROOT, 'data/generated/crosscheck.json'), {});
const RAW = path.join(ROOT, 'data/raw/players'), LISTS = path.join(ROOT, 'data/raw/lists');

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/club-logos.js'), 'utf8') + ';this.L=CLUB_LOGOS', ctx);
const LOGOS = ctx.L;
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\b(fc|cf|afc|sc|ac|as|ss|ssc|rc|rcd|ud|sv|vfl|vfb|fsv|tsg|1)\b/g, ' ').replace(/\s+/g, ' ').trim();
const ALIAS = { 'manchester city': 'Man City', 'manchester united': 'Man United', 'paris saint germain': 'PSG', 'bayern munchen': 'Bayern Munich', 'bayern munich': 'Bayern Munich', 'atletico madrid': 'Atlético Madrid', 'inter': 'Inter Milan', 'milan': 'AC Milan', 'wolves': 'Wolverhampton', 'olympique lyonnais': 'Lyon', 'olympique de marseille': 'Marseille', 'as monaco': 'Monaco' };
const idx = new Map(Object.keys(LOGOS).map(k => [norm(k), k]));
const logoKey = t => { const n = norm(t); return ALIAS[n] || idx.get(n) || [...idx].find(([k]) => k.length > 3 && (n.includes(k) || k.includes(n)))?.[1]; };

const FLAGS = { Argentina: '🇦🇷', Brazil: '🇧🇷', France: '🇫🇷', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Spain: '🇪🇸', Germany: '🇩🇪', Italy: '🇮🇹', Portugal: '🇵🇹', Netherlands: '🇳🇱', Belgium: '🇧🇪', Croatia: '🇭🇷', Uruguay: '🇺🇾', Colombia: '🇨🇴', Mexico: '🇲🇽', USA: '🇺🇸', 'United States': '🇺🇸', Japan: '🇯🇵', Senegal: '🇸🇳', Nigeria: '🇳🇬', Ghana: '🇬🇭', 'Ivory Coast': '🇨🇮', "Cote d'Ivoire": '🇨🇮', Egypt: '🇪🇬', Morocco: '🇲🇦', Cameroon: '🇨🇲', Sweden: '🇸🇪', Denmark: '🇩🇰', Poland: '🇵🇱', Norway: '🇳🇴', Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', Ireland: '🇮🇪', Serbia: '🇷🇸', Chile: '🇨🇱', Switzerland: '🇨🇭', 'Czech Republic': '🇨🇿', Ukraine: '🇺🇦', Turkey: '🇹🇷', 'South Korea': '🇰🇷', 'Korea Republic': '🇰🇷', Algeria: '🇩🇿', Austria: '🇦🇹', Greece: '🇬🇷', Paraguay: '🇵🇾', Ecuador: '🇪🇨', Iceland: '🇮🇸', Russia: '🇷🇺', Australia: '🇦🇺', Hungary: '🇭🇺', Romania: '🇷🇴', Gabon: '🇬🇦', Guinea: '🇬🇳', Mali: '🇲🇱', 'DR Congo': '🇨🇩', Slovakia: '🇸🇰', Slovenia: '🇸🇮', Finland: '🇫🇮', Venezuela: '🇻🇪', Peru: '🇵🇪', 'Costa Rica': '🇨🇷', Tunisia: '🇹🇳', Bosnia: '🇧🇦', 'Bosnia and Herzegovina': '🇧🇦', Armenia: '🇦🇲', Georgia: '🇬🇪', Kosovo: '🇽🇰', Albania: '🇦🇱', 'North Macedonia': '🇲🇰', Montenegro: '🇲🇪', 'Cape Verde Islands': '🇨🇻', 'Burkina Faso': '🇧🇫', Togo: '🇹🇬', Canada: '🇨🇦', Israel: '🇮🇱', Iran: '🇮🇷', 'Saudi Arabia': '🇸🇦' };
const POS = { Attacker: 'Forward', Midfielder: 'Midfielder', Defender: 'Defender', Goalkeeper: 'Goalkeeper' };
const PALETTE = [['#1a3a6b', '#5a8fd4'], ['#6b1a1a', '#e07070'], ['#1a5a3a', '#6fd49a'], ['#5a4a1a', '#e0c25a'], ['#3a1a6b', '#a07ae0'], ['#1a5a5a', '#5ad4d4'], ['#5a1a4a', '#e07ac0'], ['#3a3a3a', '#bdbdbd']];
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const FIRST_SEASON = 2002;   // the earliest season the API has player lines for (Cristiano Ronaldo, Sporting 2002/03); nobody born from 1985 on started earlier
const out = []; const skipped = [];
for (const p of Object.values(stats.players)) {
  // "career" is only honest if we asked for every season the player could have played: from 2002 (the API has nothing earlier), or from his 16th birthday year
  const startedBy = Math.max(FIRST_SEASON, Number(String(p.born).slice(0, 4)) + 16);
  const askedForAll = p.fetchFrom !== undefined && p.fetchFrom <= startedBy;
  if (!['ok', 'repaired'].includes(p.quality) || !p.since || !askedForAll) { skipped.push(`${p.name} (${p.quality}${askedForAll ? '' : `, seasons before ${p.fetchFrom} were not pulled`})`); continue; }
  if (crosscheck[p.id]?.status === 'incomplete') { skipped.push(`${p.name} (a season has no league line: ${crosscheck[p.id].problems[0].slice(0, 70)})`); continue; }
  const club = p.since.club, intl = p.since.intl;
  const apps = club.apps + intl.apps; if (apps < 150) { skipped.push(`${p.name} (only ${apps} games)`); continue; }
  const trophyBody = readJson(path.join(LISTS, `trophies-${p.id}.json`), null);
  if (!trophyBody) { skipped.push(`${p.name} (no trophies fetched yet)`); continue; }
  if (hasWomensTrophy(trophyBody.response)) { skipped.push(`${p.name} (women's football — not part of this deck)`); continue; }
  const tally = new Map();
  for (const t of trophyBody.response || []) {
    if (!isMajorTrophy(t)) continue;
    const name = trophyLabel(t);
    tally.set(name, (tally.get(name) || 0) + 1);
  }
  const trophies_list = [...tally].sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ×${c}`);
  if (!trophies_list.length) { skipped.push(`${p.name} (no trophies)`); continue; }
  // position = the one he is listed in most often
  const posCount = {};
  for (const y of Object.keys(p.seasons)) { const b = readJson(path.join(RAW, `${p.id}-${y}.json`), null); for (const s of b?.response?.[0]?.statistics || []) if (s.games?.position) posCount[s.games.position] = (posCount[s.games.position] || 0) + (s.games.appearences || 0); }
  const pos = POS[Object.entries(posCount).sort((a, b) => b[1] - a[1])[0]?.[0]] || 'Forward';
  const [color, tc] = PALETTE[hash(p.name) % PALETTE.length];
  out.push({
    name: p.name, pos, nat: p.nationality || '',
    career_goals: club.goals + intl.goals, career_appearances: apps, assists: club.assists + intl.assists,
    intl_caps: intl.apps, intl_goals: intl.goals, trophies: trophies_list.reduce((s, t) => s + Number(t.match(/×(\d+)/)[1]), 0),
    color, tc, initials: p.name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase(),
    club_goals: (p.clubGoals || []).slice(0, 8).map(c => ({ c: logoKey(c.team) || c.team, n: c.goals, col: '#444' })),
    intl_breakdown: { flag: FLAGS[p.nationality] || '🌍', country: p.nationality || '', n: intl.goals },
    trophies_list, apiId: p.id, quality: p.quality
  });
}
out.sort((a, b) => b.career_goals - a.career_goals);
const js = `// GENERATED by tools/build-hol.mjs on ${new Date().toISOString().slice(0, 10)} from API-Football — do not edit by hand.\n// Goals, assists, appearances, caps: whole career from the first season the API has lines for (2002/03 at the earliest), official matches only (no friendlies). Trophies: whole career.\nconst PLAYERS_MODERN = ${JSON.stringify(out)};\nconst PLAYERS_MODERN_INFO = ${JSON.stringify({ generatedAt: new Date().toISOString(), since: FIRST_SEASON, currentSeason: stats.currentSeason, count: out.length })};\n`;
fs.writeFileSync(path.join(ROOT, 'data/players-modern.js'), js);
console.log(`wrote data/players-modern.js — ${out.length} players (${(js.length / 1024).toFixed(0)} KB). skipped ${skipped.length}:`);
console.log('  ' + skipped.slice(0, 40).join('\n  ') + (skipped.length > 40 ? `\n  … and ${skipped.length - 40} more` : ''));
console.log('\ntop 12 by career goals:\n  ' + out.slice(0, 12).map(p => `${p.name} ${p.career_goals}g ${p.assists}a ${p.career_appearances} games, ${p.trophies} trophies [${p.quality}]`).join('\n  '));
