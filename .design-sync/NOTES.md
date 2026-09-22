# design-sync notes — LearnHub

Repo-specific gotchas for the next sync. Read this before running anything.

## Running a re-sync

- **`--entry` is mandatory here** and is now pinned as `cfg.entry`
  (`.design-sync/entry.tsx`). LearnHub is a Next.js app, not a published
  package, so `node_modules/learnhub-ai` does not exist; without an entry the
  converter resolves `PKG_DIR` to that missing directory and dies in
  `lib/dts.mjs` with `ENOENT .../node_modules/learnhub-ai/package.json`. The
  hand-written barrel also keeps Supabase/`server-only`/`next/navigation`
  importers out of a browser bundle — see the comment at the top of `entry.tsx`.
- **Run `./.design-sync/build-css.sh` before every build.** `cfg.cssEntry` points
  at `.design-sync/.cache/tailwind.css`, which is gitignored and regenerated.
  Skip it and the build ships whatever stale CSS is lying around.
- **Adding a component = three edits**, all of which the converter reads
  independently: `entry.tsx`, `componentSrcMap` in `config.json`, and (for a
  real card) `.design-sync/previews/<Name>.tsx`.
- `--node-modules ./node_modules` (repo root). No monorepo.

## Headless chromium

There is no `~/Library/Caches/ms-playwright` on this machine and no repo
`playwright` dependency — `playwright` lives only in the gitignored
`.ds-sync/node_modules`. Rather than downloading a ~200MB browser, drive the
installed Chrome:

```sh
export DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

Both `package-validate.mjs` and `package-capture.mjs` honour it. Without it
validate fails `[RENDER_SKIPPED]`.

## Known render warns (triaged — not new)

- `[TOKENS_MISSING] --tw-shadow-color, --i, --n, --r, --j`. `--tw-shadow-color`
  is Tailwind's own runtime variable; `--i`, `--n`, `--r`, `--j` are index
  variables the landing components set inline in JSX for staggered reveals.
  All four are set at runtime, so they are correctly absent from the shipped
  stylesheet. Previews render fine.
- `[DOCS_UNMAPPED] Faq, HeroCard, Kicker, StepsTabs`. `cfg.docsDir`
  (`.design-sync/docs`) only carries the six primitives. The four landing
  components get a `.prompt.md` synthesized from their `.d.ts` + JSDoc, which
  is adequate — their source comments are unusually thorough. Write real docs
  if a design ever misuses one.

## History

- **2026-09-22** — `OrbitSection` dropped from the design system. It was
  deleted from the codebase in `86bbbc9` (replaced by the interactive career
  map) and the build failed `Could not resolve .../landing/orbit` until it came
  out of `entry.tsx`, `componentSrcMap`, `overrides`, and `previews/`. Its four
  remote files plus `_preview/OrbitSection.js` were deleted from the project in
  the same sync. 11 components → 10.
- **2026-09-22** — typography fixed. `tokens.css` and `fonts.css` still declared
  `--font-geist-sans` after the faces changed to Switzer + General Sans on
  2026-08-04, so every card in the uploaded project had been rendering in
  system-ui. The three names in `tokens.css` must match `tailwind.config.ts`
  exactly: `--font-display`, `--font-sans`, `--font-geist-mono`. Nothing errors
  when they drift — the previews just quietly go generic.
- **2026-09-22** — `conventions.md` corrected: it named `--lh-gray-50/200/500`,
  which this design system has never defined (the real tokens are
  `paper`/`silver`/`muted`), and described a photo fallback on `OrbitSection`.

## Re-sync risks — what can silently go stale

- **The font variable names, again.** `tokens.css` is a hand-maintained copy of
  what `next/font` sets in the app. Any change to `app/fonts.ts` or
  `tailwind.config.ts`'s `fontFamily` must be mirrored there by hand, and the
  failure mode is silent. Diff the two before trusting a clean build.
- **`entry.tsx` vs the landing page.** The marketing components are redesigned
  often; a deleted or renamed file breaks the build (loudly — that part is
  fine), but a component that *changes shape* while keeping its filename will
  re-upload with an authored preview that no longer reflects how it is used.
  Skim `components/marketing/landing/` against `entry.tsx` on every sync.
- **Landing components not in the design system.** `CareerMap`, `DecisionCard`,
  `LifeAfterMatch`, `StatementMedia` and the rest of
  `components/marketing/landing/` are deliberately *out* of scope — several are
  `"use client"` with `next/image`, `next/link` and scroll handlers that would
  need provider or loader work to bundle. Adding one is a scope decision, not a
  maintenance chore.
- **No `_ds_sync.json` anchor existed before this sync** (the project had one
  uploaded from the July run but it was not present on the server), so this run
  re-verified all 10 components from scratch and hand-derived its delete list
  from `list_files`. If the anchor is missing again next time, do the same:
  review the remote listing for files this build does not produce.
- **`.design-sync/docs/` covers primitives only** — see the `[DOCS_UNMAPPED]`
  warn above. It is not a bug, but a fifth landing component would widen it.
