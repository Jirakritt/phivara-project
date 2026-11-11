#!/usr/bin/env bash
# Pre-fills the ISR cache after a deploy so the first real visitor to each page
# does not wait for it to be rendered (on the 1-vCPU VPS a cold render takes
# 5-20s). Pages are requested ONE AT A TIME on purpose (a single core).
# Usage:  bash scripts/warm-cache.sh [base-url]      default http://localhost:3000
set -u
BASE="${1:-http://localhost:3000}"
BASE="${BASE%/}"
# Every public URL (th + en, incl. doctor/program/article/branch slugs) is in the sitemap.
URLS=$(curl -s -m 120 "$BASE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -E 's#</?loc>##g; s#^https?://[^/]+##')
if [ -z "$URLS" ]; then echo "warm-cache: could not read $BASE/sitemap.xml"; exit 1; fi
ok=0; bad=0
for p in $URLS; do
  code=$(curl -s -o /dev/null -m 180 -w '%{http_code} %{time_total}s' "$BASE$p")
  case "$code" in 200*) ok=$((ok+1));; *) bad=$((bad+1)); echo "  $p -> $code";; esac
done
echo "warm-cache: $ok ok, $bad not 200 ($BASE)"
