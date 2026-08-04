# Fonts

| File | Family | Source | Licence |
|---|---|---|---|
| `Switzer-Variable.woff2` | Switzer (display) | [fontshare.com/fonts/switzer](https://www.fontshare.com/fonts/switzer) | ITF Free Font Licence — free for personal **and** commercial use |
| `GeneralSans-Variable.woff2` | General Sans (text) | [fontshare.com/fonts/general-sans](https://www.fontshare.com/fonts/general-sans) | ITF Free Font Licence — free for personal **and** commercial use |

Both are variable: one file each covers every weight we use.

## Why these two

shopaza.africa is the typographic reference. It sets display in **ES Rebond
Grotesque** (Extraset, CHF 70 per style) and text in **Roobert** (Displaay, free
for personal use only, commercial use is a paid licence). We hold neither, and
lifting the files off their site is not an option, so these are the closest
faces that are genuinely free to ship: Switzer for the tight modern grotesque
headline, General Sans for the clean geometric text.

If the real pair is ever licensed, drop the woff2 files in here and repoint
`app/fonts.ts`. Nothing else in the codebase names a font — everything goes
through `font-display` / `font-sans` in `tailwind.config.ts`.
