#!/usr/bin/env bash
# Compile the design system's stylesheet for design-sync (cfg.cssEntry).
#
# app/globals.css is Tailwind SOURCE (@tailwind directives), not a stylesheet —
# the converter needs real CSS. This concatenates it with the landing-only
# rules (the lh-* animation/effect classes several components depend on) and
# runs Tailwind over the pair using tailwind.sync.ts.
#
# Output is gitignored and regenerated: re-run this BEFORE package-build.mjs
# on every sync, and again after authoring previews (their utility classes are
# scanned too).
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p .design-sync/.cache
# tokens.css leads: it defines --font-geist-sans/-mono, which tailwind.config.ts
# resolves fontFamily.display/.sans/.mono against. next/font sets those in the
# app; nothing does outside it, so if they go missing every font-* class falls
# through to a serif default with no error. Compiling them into cssEntry keeps
# them inside the one file the converter is guaranteed to ship.
cat .design-sync/tokens.css app/globals.css "app/(marketing)/landing.css" \
  > .design-sync/.cache/styles.src.css

npx tailwindcss \
  -c .design-sync/tailwind.sync.ts \
  -i .design-sync/.cache/styles.src.css \
  -o .design-sync/.cache/tailwind.css \
  --minify=false

echo "wrote .design-sync/.cache/tailwind.css ($(wc -c < .design-sync/.cache/tailwind.css) bytes)"
