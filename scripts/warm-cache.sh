#!/usr/bin/env bash
# Pre-fills the ISR cache after a deploy so the first real visitor to each page
# does not wait for it to be rendered (on the 1-vCPU VPS a cold render takes
# 5-20s). Pages are requested ONE AT A TIME on purpose (a single core).
#
# In a terminal it shows ONE self-updating line: spinner (keeps spinning while a
# slow page renders), progress bar, done/total, percent, elapsed, ETA and the
# current URL. Failures are printed on their own line. When output is not a
# terminal (pipe / log file) it prints one plain line per URL instead.
#
# Usage:  bash scripts/warm-cache.sh [base-url]      default http://localhost:3000
set -u
BASE="${1:-http://localhost:3000}"
BASE="${BASE%/}"

LIST=$(curl -s -m 120 "$BASE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -E 's#</?loc>##g; s#^https?://[^/]+##; s#^[[:space:]]+##; s#[[:space:]]+$##; s# #%20#g')
if [ -z "$LIST" ]; then echo "warm-cache: could not read $BASE/sitemap.xml"; exit 1; fi
TOTAL=$(printf '%s\n' "$LIST" | grep -c .)

fmt() { printf '%dm%02ds' $(($1 / 60)) $(($1 % 60)); }

TTY=0; [ -t 1 ] && TTY=1
COLS=80; [ "$TTY" = 1 ] && COLS=$(tput cols 2>/dev/null || echo 80)
case "${LC_ALL:-${LC_CTYPE:-${LANG:-}}}" in
  *UTF-8*|*utf8*|*UTF8*) SPIN=(⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏); FULL='█'; EMPTY='░' ;;
  *)                      SPIN=('|' '/' '-' '\'); FULL='#'; EMPTY='-' ;;
esac
NSPIN=${#SPIN[@]}
TMP=$(mktemp "${TMPDIR:-/tmp}/warm-cache.XXXXXX")
cleanup() { [ "$TTY" = 1 ] && printf '\033[?25h'; rm -f "$TMP"; }
trap cleanup EXIT
trap 'echo; echo "warm-cache: interrupted"; exit 130' INT TERM

bar() { # $1 = percent -> 20-cell bar
  local w=20 f=$(($1 * 20 / 100)) i s=''
  for ((i = 0; i < w; i++)); do if [ "$i" -lt "$f" ]; then s="$s$FULL"; else s="$s$EMPTY"; fi; done
  printf '%s' "$s"
}

render() { # $1 spinner idx, $2 done, $3 elapsed, $4 eta, $5 current path
  local pct=$(($2 * 100 / TOTAL)) line
  line=$(printf '%s %s %3d/%d %3d%%  %s  ETA ~%s  %s' "${SPIN[$1]}" "$(bar "$pct")" "$2" "$TOTAL" "$pct" "$(fmt "$3")" "$(fmt "$4")" "$5")
  printf '\r\033[2K%s' "${line:0:$((COLS - 1))}"
}

echo "warm-cache: $TOTAL URLs from $BASE (one at a time, can take several minutes)"
[ "$TTY" = 1 ] && printf '\033[?25l'
START=$(date +%s); n=0; ok=0; bad=0; FAILS=""
while IFS= read -r p; do
  [ -z "$p" ] && continue
  curl -s -o /dev/null -m 180 -w '%{http_code} %{time_total}' "$BASE$p" > "$TMP" 2>/dev/null &
  pid=$!
  si=0
  while kill -0 "$pid" 2>/dev/null; do
    if [ "$TTY" = 1 ]; then
      el=$(($(date +%s) - START)); eta=0; [ "$n" -gt 0 ] && eta=$((el * (TOTAL - n) / n))
      render "$si" "$n" "$el" "$eta" "$p"
      si=$(((si + 1) % NSPIN))
    fi
    sleep 0.12
  done
  wait "$pid" 2>/dev/null
  res=$(cat "$TMP"); code=${res%% *}; t=${res#* }; [ -z "$code" ] && code=000
  n=$((n + 1))
  if [ "$code" = "200" ]; then ok=$((ok + 1)); else bad=$((bad + 1)); FAILS="$FAILS
  $p -> $code"; fi
  if [ "$TTY" = 1 ]; then
    [ "$code" != "200" ] && printf '\r\033[2K  ERR %s  %s\n' "$code" "$p"
  else
    el=$(($(date +%s) - START)); eta=$((el * (TOTAL - n) / n))
    printf '[%3d/%d] %3d%%  %s  %5.1fs  elapsed %s  ETA ~%s  %s\n' "$n" "$TOTAL" $((n * 100 / TOTAL)) "$code" "$t" "$(fmt "$el")" "$(fmt "$eta")" "$p"
  fi
done <<EOF
$LIST
EOF

el=$(($(date +%s) - START))
[ "$TTY" = 1 ] && printf '\r\033[2K'
[ -n "$FAILS" ] && echo "Not 200:$FAILS"
echo "warm-cache: $ok ok, $bad not 200 ($BASE) in $(fmt "$el")"
