# Phase 10.2 — GitHub Pages deployment

Target: `https://domekuester.github.io/elsewhere/` — a GitHub **project** page, so the
publication is served from a repository subpath rather than a domain root.
Pages source: **GitHub Actions**. Deployment branch: `main`.

Deployment configuration only. No photography, Story copy, photo sequencing, or visual design
was changed in this phase.

## What the subpath actually breaks

Astro rewrites the paths it owns — bundled CSS and JS, `astro:assets` output, and `url()`
references inside stylesheets. It does **not** rewrite a hand-written path in markup, or a path
carried in a JSON data file. Those two surfaces were the entire failure set, and they fail
quietly: the HTML stays valid and the page simply loads without its photographs.

The fix is one helper and two data boundaries rather than a per-page edit:

| Concern | Where it is solved |
| --- | --- |
| `SITE_URL` → `site` + `base` | `astro.config.mjs` |
| `withBase`, `homePath`, `absoluteUrl` | `src/config/paths.ts` |
| Every photograph's three derivative URLs | `src/data/photo-catalog.ts` |
| Art-directed hero sources | `src/data/hero-pipeline.ts` |
| Canonical, Open Graph, favicon, font preloads, home detection | `src/layouts/BaseLayout.astro` |
| Primary and footer navigation | `SiteHeader.astro`, `SiteFooter.astro` |
| Sitemaps, image sitemap, `robots.txt`, schema.org URLs | `src/pages/*.xml.ts`, `robots.txt.ts`, `src/data/image-schema.ts` |
| Client-side archive: catalog fetch, viewer links | `src/scripts/archive.ts` (base inlined via `import.meta.env.BASE_URL`) |

Because the catalog and hero accessors correct the paths once, every `img src`, every `srcset`,
the `ImageObject` `contentUrl`, the Open Graph card, and the image sitemap inherit the base
without any call site repeating it. `withBase` is idempotent, so a value corrected at the data
boundary is safe to pass through `BaseLayout`'s share-image handling again.

Local development is unaffected: `SITE_URL=http://localhost:4321` resolves `base` to `/`, and
`withBase` becomes the identity function.

## Enforcement

`scripts/validate-launch.mjs` now fails the build when the built HTML contains a site-absolute
link, `src`, or `srcset` entry that either omits the deployment base or does not resolve to a
file in `dist/`, and when any absolute URL on the configured origin points outside the base.
Both checks were confirmed to fire against deliberately corrupted output, not merely to pass.

Measured on the production build (`SITE_URL=https://domekuester.github.io/elsewhere`):
26 public HTML files, 777 distinct site-absolute references, 0 broken internal links,
0 broken public assets, 0 localhost references, 0 owner-rejected photograph references.

## Published site size — resolved

**GitHub Pages published sites may be no larger than 1 GB**, and the first production build came
in at 1,086.1 MiB. The viewer tier carried 72% of that, so it is the only thing that was changed.

Redundancy was ruled out first: only 2 of 535 photographs had a viewer derivative no larger than
their archive derivative (1.0 MiB in total), so no tier was duplicating another's delivery role,
and nothing in `dist/` was unreferenced. mozjpeg was already enabled, so the free encoder win had
already been taken. That left the encoder's quality setting.

The viewer tier moved from quality 90 to 86. **The 3200px long edge is retained** — a viewer on a
1440px display at 2× still receives more pixels than it can show — and **4:4:4 chroma is
retained**, which is what protects saturated colour edges. Nothing else about the pipeline moved.

| Tier | Files | Before | After |
| --- | --- | --- | --- |
| `assets-derived/viewer` (3200px, **q90 → q86**, 4:4:4) | 535 | 786.5 MiB | **617.2 MiB** |
| `assets-derived/archive` (1800px, q86, 4:4:4) | 535 | 209.3 MiB | 209.3 MiB (unchanged) |
| `assets-derived/thumbnails` (960px, q84, 4:2:0) | 535 | 43.4 MiB | 43.4 MiB (unchanged) |
| `assets-derived/hero` | 69 | 25.1 MiB | 25.1 MiB (unchanged) |
| Everything else (HTML, CSS, JS, fonts, social cards) | 167 | 21.9 MiB | 21.9 MiB |
| **Total `dist/`** | **1,842** | **1,086.1 MiB** | **916.9 MiB** |

916.9 MiB is 0.961 GB; the uploaded artifact tars to 918.3 MiB and gzips to 908.3 MiB. Only the
524 viewer files with an available master changed on disk — archive, thumbnails and hero came out
byte-identical, which confirms the change was confined to the one tier.

### Why quality, and why not further

Measured on a 14-frame sample chosen from the pixels rather than from tags — the two largest
files, the two darkest frames, the two highest-detail frames, portraits, monochrome, jungle
foliage, urban architecture and smooth sky:

| Setting | Sample size | vs q90 | Luma SSIM avg | SSIM worst | PSNR | Chroma ΔE avg / max |
| --- | --- | --- | --- | --- | --- | --- |
| q90 4:4:4 (before) | 39.91 MiB | — | 1.00000 | 1.00000 | ∞ | 0.00 / 0.0 |
| q88 4:4:4 | 35.44 MiB | −11.2% | 0.98056 | 0.96079 | 41.2 dB | 0.95 / 16.8 |
| **q86 4:4:4 (chosen)** | **32.20 MiB** | **−19.3%** | **0.96957** | **0.93679** | **39.4 dB** | **1.17 / 19.4** |
| q84 4:4:4 | 29.22 MiB | −26.8% | 0.96099 | 0.91501 | 38.4 dB | 1.29 / 20.3 |
| q90 4:2:0 | 26.42 MiB | −33.8% | 0.99236 | 0.96042 | ∞ | 1.88 / **39.0** |
| q90 4:4:4 at 2800px | 29.91 MiB | −25.1% | dimensions changed | | | |

q88 was tried first and rejected on arithmetic, not taste: −11.2% lands the site at roughly
998 MiB, under the hard limit but above the 950 MiB target and with no useful margin. q86 is the
smallest step that clears the target.

4:2:0 is the tempting option — it leaves luma mathematically untouched — but it tripled chroma
error and pushed the maximum ΔE to 39. On this archive's saturated frames that is a visible cost,
so it was rejected in favour of keeping 4:4:4 and moving quality instead.

Visual confirmation, not just metrics: side-by-side 1:1 crops of the busiest region of each
sample frame, plus whole frames at 1440px, showed no visible artefacts, no banding in smooth
sky, no loss of shadow detail in a night frame with stars and grain, and no colour bleeding on
heavily saturated flowers. The full-screen viewer was also inspected in the browser at 1440.

11 photographs have no source master in `assets-source/photos/` and were skipped by the
generator, so their viewer derivatives remain at q90. They are named in the generator's warning
output. This is the correct behaviour — derivatives are never regenerated from a file that is not
there — and it costs nothing, since those frames simply stay at higher quality.

Two softer limits are worth recording: source repositories have a recommended limit of 1 GB
(this one's history is larger, because the derivatives are committed), and Pages applies a soft
bandwidth limit of 100 GB per month.

## Owner-supplied values

The deploy workflow reads `PUBLIC_CONTACT_EMAIL`, `PUBLIC_CREATOR_NAME`,
`PUBLIC_ANALYTICS_PROVIDER`, and `PUBLIC_ANALYTICS_DOMAIN` from repository variables. A build
with all of them unset was verified to pass: enquiry actions are not rendered, `/contact/` is
noindexed, and credit falls back to "ELSEWHERE" rather than inventing a name.

One local-only check weakens in CI and should be understood rather than fixed: the
content-signature sweep in `scripts/verify-owner-photo-exclusions.mjs` compares editorial
derivatives against master photographs in `assets-source/photos/`, which is correctly
git-ignored and therefore absent from a CI checkout. The sweep skips silently there. Every
other exclusion check — stable id, filename, index-prefixed derivative, and the audit of the
built output — runs in full and passed with 35 rejected photographs and 0 public references.
