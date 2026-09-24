#!/usr/bin/env bash
set -euo pipefail
OUT="docs/audit/evidence/P-01"
mkdir -p "$OUT"
HOSTS=("https://edmundokutuzov.art" "https://www.edmundokutuzov.art")
UAS=("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" "facebookexternalhit/1.1" "WhatsApp/2.23.20" "LinkedInBot/1.0" "Twitterbot/1.0" "curl/8.4.0")
PATHS=("/" "/portfolio" "/services" "/credentials" "/contact" "/studio" "/pt" "/pt/portfolio" "/robots.txt" "/sitemap.xml" "/portfolio/absa" "/nao-existe-audit-$(date +%s)")
printf 'host	path	ua	status	redirect	time_s	x_robots
' > "$OUT/matrix.tsv"
for h in "${HOSTS[@]}"; do for p in "${PATHS[@]}"; do for ua in "${UAS[@]}"; do
  r=$(curl -sS -o /dev/null -A "$ua" -w '%{http_code}	%{redirect_url}	%{time_total}' "$h$p")
  xr=$(curl -sSI -A "$ua" "$h$p" | tr -d '' | awk -F': ' 'tolower($1)=="x-robots-tag"{print $2}' | tail -1)
  printf '%s	%s	%s	%s
' "$h" "$p" "${ua:0:24}" "$r	${xr:--}" >> "$OUT/matrix.tsv"
done; done; done
sha256sum "$OUT/matrix.tsv" > "$OUT/matrix.tsv.sha256"
