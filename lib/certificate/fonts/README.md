# Certificate fonts

The certificate image and PDF are drawn on the server with `next/og`
(Satori), which reads TTF and OTF but not the WOFF2 files the site itself
uses in `app/fonts/`. So the same faces live here a second time, in formats
Satori can read. Same families, same licences:

| File | Family | Source | Licence |
|---|---|---|---|
| `InstrumentSerif-Regular.ttf`, `-Italic.ttf` | Instrument Serif | google/fonts | SIL OFL 1.1 |
| `GeneralSans-Regular.otf`, `-Medium.otf`, `-Semibold.otf` | General Sans | fontshare.com | ITF Free Font Licence (commercial use allowed) |
| `GeistMono-Regular.ttf` | Geist Mono | the `geist` npm package | SIL OFL 1.1 |
