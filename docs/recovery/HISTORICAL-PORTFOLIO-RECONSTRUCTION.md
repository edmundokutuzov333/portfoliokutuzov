# Historical Portfolio Reconstruction

Data recovered without changing production.

## Ground truth

- Current Supabase project: `hdmopgkbragcoirhabhi`
- Historical Supabase ref found in the old application: `uqcuzsuqkutxjqkopary`
- Current published project rows: 16
- Historical count of 106 projects: not verified as 106 actual project records
- Production writes during this reconstruction: none

## Preserved historical assets

The old GitHub repository contains six binary cover assets that were downloaded from the historical Supabase `site-assets/projects` path on 2026-09-01 and then committed to Git.

| Asset | Candidate work | Client | Evidence |
|---|---|---|---|
| p1.webp | GIZ | GIZ | Filename + visual inspection |
| p2.webp | Concrete Rhymes | PHANTOM StreetStyle Co. | Visual inspection, client context not DB verified |
| p3.webp | Frescolândia Vol. 01 | Not resolved | Visual inspection |
| p4.png | Pouko Pouko | Not resolved | Filename |
| p5.webp | Dia dos Namorados 2026 | WEBMASTERS | Filename + visual inspection |
| p6.png | Not resolved | Not resolved | Filename only |

## Recovery rule

These assets are evidence of historical portfolio content. They must not be written into `public.projects` until each asset has a verified project record, slug, client relation and publication metadata.

The machine-readable registry is stored beside this document.
