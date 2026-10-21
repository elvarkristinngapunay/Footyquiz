#!/usr/bin/env bash
# Backs up everything that cost API requests and is NOT in git: the raw answers (data/raw/), the aggregated files (data/generated/)
# and the player-id cache. The key (.env) is left out on purpose.
#
#   bash tools/backup.sh            → ~/Desktop/Footyquiz-backups/footyquiz-api-data-YYYYMMDD-HHMM.tar.gz
#   bash tools/backup.sh /some/dir  → same, in another folder (e.g. a synced one)
#
# Run it after every big pull. Restoring: extract the archive inside the Footyquiz folder (tar -xzf <file>), nothing else is needed.

set -euo pipefail
cd "$(dirname "$0")/.."
DEST="${1:-$HOME/Desktop/Footyquiz-backups}"
mkdir -p "$DEST"
FILE="$DEST/footyquiz-api-data-$(date +%Y%m%d-%H%M).tar.gz"
tar -czf "$FILE" data/raw data/generated tools/player-ids.json tools/extra-players.json
# verify: the archive must be readable and hold as many files as the folders
IN_ARCHIVE=$(tar -tzf "$FILE" | grep -vc '/$' || true)
ON_DISK=$(find data/raw data/generated -type f | wc -l | tr -d ' ')
echo "backup: $FILE ($(du -h "$FILE" | cut -f1)) · $IN_ARCHIVE files in archive (raw+generated on disk: $ON_DISK, plus 2 tool files)"
shasum -a 256 "$FILE" | cut -d' ' -f1 > "$FILE.sha256"
echo "sha256 saved next to it"
# keep the five newest, delete older ones
ls -1t "$DEST"/footyquiz-api-data-*.tar.gz | tail -n +6 | while read -r old; do rm -f "$old" "$old.sha256"; echo "removed old backup $(basename "$old")"; done
