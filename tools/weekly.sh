#!/usr/bin/env bash
# Weekly refresh of everything that changes while a season is running:
#   current-season totals of every tracked player (goals, games, caps …) → "Modern Stars" in Higher or Lower
#   league top-scorer / assist / card lists                               → Top 10 "This Season" and "Last 3 Seasons"
#
#   bash tools/weekly.sh            fetch (about 450 requests), rebuild, sanity-check, back up, commit + push
#   bash tools/weekly.sh --offline  the same without any API call and without git (a dry run on the cached data)
#   bash tools/weekly.sh --no-push  fetch + rebuild + check + back up, but leave the commit to you
#
# Only the running season is re-requested; older seasons stay in the local cache (data/raw/). Nothing is published when the sanity check fails.
set -euo pipefail
cd "$(dirname "$0")/.."
MODE="${1:-}"
ENVRUN="node --env-file=.env"
FETCH_ARGS="--refresh-current --reserve=600"
[ "$MODE" = "--offline" ] && { ENVRUN="node"; FETCH_ARGS="--offline"; }

echo "== 1/6 players (running season only) =="
# the same selections that built the deck; extend these lines when more players are added (Legends are not touched here — they are static, see tools/verify-legends.mjs)
$ENVRUN tools/fetch-players.mjs --roster --minborn=1985 --top=180 --seasons=2002-2026 --out=data/generated/career-pilot.json $FETCH_ARGS | grep -E "^(plan|ids|fetched|wrote)" || true
$ENVRUN tools/fetch-players.mjs --roster --minborn=1985 --top=250 $FETCH_ARGS | grep -E "^(plan|ids|fetched|wrote)" || true
$ENVRUN tools/fetch-players.mjs --roster --minborn=1990 --top=450 --seasons=2002-2026 --out=data/generated/career-pilot.json $FETCH_ARGS | grep -E "^(plan|ids|fetched|wrote)" || true
# the second batch of current players (fame 50–58 in tools/roster-candidates.json, made 2026-10-28) — the list lives in data/generated/ (not committed); skipped when it is not there
[ -f data/generated/current-more.json ] && { $ENVRUN tools/fetch-players.mjs --players=data/generated/current-more.json --seasons=2002-2026 --out=data/generated/career-pilot.json $FETCH_ARGS | grep -E "^(plan|ids|fetched|wrote)" || true; }

echo "== 1b/6 FotMob (the second source for assists) =="
if [ "$MODE" != "--offline" ]; then node tools/fetch-fotmob.mjs --current --refresh | tail -1; else echo "(skipped offline)"; fi

echo "== 2/6 league lists =="
if [ "$MODE" != "--offline" ]; then $ENVRUN tools/fetch-lists.mjs --refresh-current --no-trophies --reserve=600 | tail -3; else echo "(skipped offline)"; fi

echo "== 3/6 cross-check + build =="
node tools/crosscheck.mjs --json=data/generated/crosscheck.json | head -2
node tools/build-hol.mjs | grep -E "^wrote"
node tools/build-top10.mjs | grep -E "^wrote"
# league goals for the Auction / Closest Wins categories: finished seasons from the cached Wikipedia pages (new players get their page), the running season from the fresh API data
if [ "$MODE" = "--offline" ]; then node tools/build-competitions.mjs | head -1; else node tools/build-competitions.mjs --fetch | tail -2; fi

echo "== 4/6 sanity check =="
node tools/sanity.mjs || { echo "Sanity check failed — the new files are written but NOT committed. Restore with: git checkout data/players-modern.js data/top10-api.js"; exit 1; }

echo "== 5/6 backup =="
bash tools/backup.sh | head -1

echo "== 6/6 publish =="
if [ "$MODE" = "--offline" ] || [ "$MODE" = "--no-push" ]; then echo "(not publishing: $MODE)"; exit 0; fi
if git diff --quiet -- data/players-modern.js data/top10-api.js data/competitions.js; then echo "nothing changed this week"; exit 0; fi
git add data/players-modern.js data/top10-api.js data/competitions.js
git commit -q -m "Weekly stats refresh $(date +%Y-%m-%d)"
export PATH="$HOME/.local/bin:$PATH"
TOK=$(gh auth token --user elvarkristinngapunay)
git -c "http.https://github.com/.extraheader=AUTHORIZATION: basic $(printf 'x-access-token:%s' "$TOK" | base64)" push origin main
echo "pushed"
