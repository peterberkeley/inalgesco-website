#!/bin/bash
# Stamp a fresh version onto every asset link, so a returning browser never
# runs yesterday's CSS or JavaScript.
#
#   ./bump-assets.sh      then commit and push
#
# Why this rather than "turn caching off": GitHub Pages serves assets with
# Cache-Control max-age=600 and does not let us change that header, so a
# visitor who was here in the last ten minutes keeps the old file however
# many times they reload. Changing the URL is the only lever we have, and it
# is also the better one: files stay cacheable and fast between releases, and
# go stale the instant a release changes them.
set -eu
cd "$(dirname "$0")"
V=$(date +%Y%m%d%H%M)

for f in *.html; do
  # styles.css?v=... / calculator.js?v=... / nav.js?v=..., with or without a
  # version already present
  perl -pi -e "s{(href=\"styles\.css)(\?v=[0-9]+)?\"}{\$1?v=$V\"}g" "$f"
  perl -pi -e "s{(src=\"(?:calculator|nav)\.js)(\?v=[0-9]+)?\"}{\$1?v=$V\"}g" "$f"
done

echo "asset version -> $V"
grep -ho 'styles\.css?v=[0-9]*' index.html | head -1
