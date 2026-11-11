#!/usr/bin/env bash
# Pre-fills the ISR cache after a deploy so the first real visitor to each page
# does not wait for it to be rendered (on the 1-vCPU VPS a cold render takes
# 5-20s). Pages are requested ONE AT A TIME on purpose (a single core).
# Shows progress: [done/total] percent, status, time per page, elapsed, ETA.
# Usage:  bash scripts/warm-cache.sh [base-url]      default http://localhost:3000
set -u
BASE="${1:-http://localhost:3000}"
BASE="${BASE%/}"

# Every public URL (th + en, incl. doctor/program/article/branch slugs) is in the sitemap.
LIST=$(curl -s -m 120 "$BASE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -E 's#</?loc>##g; s#^https?://[^/]+##; s#^[[:space:]]+##; s#[[:space:]]+$##; s# #%20#g')
if [ -z "$LIST" ]; then echo "warm-cache: could not read $BASE/sitemap.xml"; exit 1; fi
TOTAL=$(printf '%s\n' "$LIST" | grep -c .)

fmt() { # seconds -> "Xm YYs"
  local s=$1; printf '%dm%02ds' $((s / 60)) $((s % 60))
}

echo "warm-cache: $TOTAL URLs from $BASE (one at a time, this can take several minutes)"
START=$(date +%s)
n=0; ok=0; bad=0; FAILS=""
while IFS= read -r p; do
  [ -z "$p" ] && continue
  n=$((n + 1))
  res=$(curl -s -o /dev/null -m 180 -w '%{http_code} %{time_total}' "$BASE$p")
  code=${res%% *}; t=${res#* }
  if [ "$code" = "200" ]; then ok=$((ok + 1)); mark="ok "; else bad=$((bad + 1)); mark="ERR"; FAILS="$FAILS
  $p -> $code"; fi
  now=$(date +%s); el=$((now - START))
  if [ "$n" -gt 0 ]; then eta=$(( el * (TOTAL - n) / n )); else eta=0; fi
  printf '[%3d/%d] %3d%%  %s %s  %5.1fs  elapsed %s  ETA ~%s  %s\n' \
    "$n" "$TOTAL" $((n * 100 / TOTAL)) "$mark" "$code" "$t" "$(fmt $el)" "$(fmt $eta)" "$p"
done <<EOF
$LIST
EOF

el=$(( $(date +%s) - START ))
[ -n "$FAILS" ] && { echo "Not 200:$FAILS"; }
echo "warm-cache: $ok ok, $bad not 200 ($BASE) in $(fmt $el)"
