#!/bin/bash
# Saves your API-Football key into .env (which git ignores). The key is typed/pasted hidden and is never printed.
#   bash tools/set-key.sh
cd "$(dirname "$0")/.." || exit 1

printf "Paste your API-Football key and press Enter (nothing shows while you paste): "
read -rs KEY
echo
KEY=$(printf '%s' "$KEY" | tr -d '[:space:]"'"'")

# Real keys are plain letters and digits. This also refuses a pasted shell command or sentence by mistake.
if ! [[ "$KEY" =~ ^[A-Za-z0-9]{20,64}$ ]]; then
  echo "That doesn't look like an API key (it should be letters and digits only, no spaces). .env was NOT changed."
  echo "Tip: copy the key from the dashboard right before you paste it here."
  exit 1
fi

printf 'APISPORTS_KEY=%s\n' "$KEY" > .env
echo "Saved: ${#KEY} characters written to .env"
