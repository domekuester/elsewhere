# Phase 9.25 — Regression audit against the Phase 9.2 baseline

The Phase 9.2 state was snapshotted before any Düsseldorf work began — `photo-catalog.json`,
`destinations.json`, `photo-curation.json`, `photo-inventory.json`, `public-image-exclusions.json`
and the whole of `src/` — and every comparison below is measured against that snapshot.

## The strongest single result

**Zero pre-existing photographs were altered. Zero were removed.**

Every one of the 469 photographs Phase 9.2 published is byte-for-byte identical in the catalog,
field for field. Düsseldorf is purely additive at the data layer.

## Protected baseline

| Protected system | Required | Result |
| --- | --- | --- |
| Home hero | UNCHANGED | **UNCHANGED** — same photograph, same title, same crop |
| Home section order | UNCHANGED | **UNCHANGED** — 11 sections, same order |
| Home People composition | PRESERVED | **PRESERVED** |
| Home world cards | UNCHANGED | **UNCHANGED** — same five, same archive links |
| Native / direct scroll | PRESERVED | **PRESERVED** — no scroll library, no hijack, nothing added |
| Typography | PRESERVED | **PRESERVED** — Barlow Condensed + Literata, no new family, no new weight |
| Ultramarine | PRESERVED | **PRESERVED** — no new declaration anywhere |
| B&W curated edit | PRESERVED unless improved | **PRESERVED** — untouched; Düsseldorf offers no monochrome |
| B&W archive | no regression | **48 → 48** |
| People | no regression | **77 → 77**, page untouched |
| Japan | no regression | **no regression** — see below |
| Essaouira | no regression | **no regression** — see below |
| La Réunion | no regression | **no regression** — see below |
| Viewer | no regression | **no regression** — geometry, keyboard, focus, scroll restoration, counter all verified |
| Studio | no regression | **UNTOUCHED** |
| Licensing | no regression | **UNTOUCHED** |
| Owner exclusions | 0 public references | **0** |

## Chapter measurements, before and after

Frame width as a percentage of viewport, measured at 1440 with every image loaded.

| Chapter | Phase 9.2 | Phase 9.25 | Verdict |
| --- | --- | --- | --- |
| Japan | 30–70%, 5 widths, 16 frames | 30–70%, 5 widths, 16 frames | identical |
| La Réunion | 30–70%, 5 widths, 13 frames | 30–70%, 5 widths, 13 frames | identical |
| Essaouira | 38–62%, 4 widths, 13 frames | 38–62%, 4 widths, 13 frames | identical |
| Düsseldorf | — | 30–70%, 5 widths, 10 frames | matches the strongest |

Measured again at 1600, 1280, 1100, 1024, 980, 768, 430, 390 and 320: all four chapters identical
to each other in behaviour, zero overflow, zero frames left hidden after a full scroll.

## Rendered sweep

18 routes × 10 viewports (1600 → 320) at DPR 2, every page fully scrolled.

| Check | Phase 9.2 | Phase 9.25 |
| --- | --- | --- |
| Horizontal overflow | 0 | **0** |
| Broken images | 0 | **0** |
| Images without alt | 0 | **0** |
| Failed network requests | 0 | **0** |
| Console errors (excl. the 404 document status) | 0 | **0** |

The one known benign edge case is unchanged: the `black and white` filter extends past the viewport
inside `.archive-filter-group`, which is a horizontal scroller. It now also appears on the new
`?destination=dusseldorf` route because it is the same component.

## WebKit / Safari

| | Phase 9.2 | Phase 9.25 |
| --- | --- | --- |
| Page loads | 26 | **28** |
| Overflow / header defects / console errors | 0 | **0** |

## Accessibility

14 routes × 2 modes (default and reduced motion).

| Check | Phase 9.2 | Phase 9.25 |
| --- | --- | --- |
| Exactly one `h1` | pass | **pass** |
| Heading level jumps | 0 | **0** |
| Missing alt | 0 | **0** |
| Content still hidden after full scroll under reduced motion | 0 | **0** |
| Targets below 24×24 | 1 documented inline-text exception | **1, the same one** |

Düsseldorf introduced no accessibility issue of any kind.

## Performance

| Measure | Phase 9.2 | Phase 9.25 |
| --- | --- | --- |
| Public catalog payload | 668,650 B | 701,248 B (+4.9% for +4.7% photographs) |
| Home HTML | — | 24,216 B |
| Archive HTML | — | 39,948 B (server-renders a fixed 24-frame opening regardless of catalog size) |
| Dependencies added | — | **none** |
| Client JavaScript changed | — | **none** |

Home does not fetch the catalog at runtime; it reads it at build time only. Adding 22 photographs
changed no unrelated page's initial payload.

## Image fidelity

All 66 Düsseldorf derivatives (22 × thumbnail/archive/viewer) verified against the pipeline
contract: **0 undersized, 0 upscaled, 0 missing.** Sources up to 4000 px long edge, so the viewer
derivative is a genuine 3200 px file rather than an enlargement.

## Changes made to Phase 9.2 surfaces, and why

Three, each caused by Düsseldorf's arrival and each an improvement rather than a regression.

**1. Destinations index moved from auto-fit to two columns.**
A fourth chapter turned the auto-fit grid into three cards and an orphan. Two columns fills every
row, roughly doubles each photograph, and makes the markup's own `sizes="(min-width: 901px) 48vw"`
true — it had always described a two-column layout the CSS was not building. A lone odd chapter now
spans the full width instead of sitting beside empty space.

**2. Chapter provenance line can now express a long span.**
It read "Photographed over N days in {month}", which for Düsseldorf would have produced
"276 days in September" — absurd, and a claim of continuous presence. Spans over 60 days are now
expressed in months. Japan, La Réunion and Essaouira are unaffected: their lines are unchanged.

**3. Chapter title is truthful about what a chapter is.**
"Düsseldorf travel photography" was false — these photographs belong to no trip. Chapters whose
photographs span more than 60 days and belong to no journey now use their own `seoTitle`. Japan,
La Réunion and Essaouira keep the exact titles Phase 9.2 shipped; only Düsseldorf differs.

A first attempt at this keyed off the journey register alone and silently changed Essaouira's title,
because Essaouira is a genuine seven-day trip that predates that register. Caught by comparing
rendered titles against the baseline, and corrected.

## Two latent Phase 9.2 defects fixed

**The derivative generator did not know about `editorial-hold`.** It still used the pre-9.2 withheld
list. Regenerating derivatives — which this phase had to do — would have rebuilt public images for
all 63 photographs Phase 9.2 withheld. Fixed before running, and verified after: 63 held frames,
**0 resurrected derivatives**.

**La Réunion had no social card.** Phase 9.2 published the chapter but its Open Graph image fell
back to an uncropped 1800 px derivative. It now has a purpose-made 1200×630 card, as Düsseldorf
does.

## Verdict

**PHASE 9.2 BASELINE: PRESERVED.**

No protected system regressed. Two latent defects in the baseline were found and repaired, and one
Phase 9.2 gap (La Réunion's social card) was closed.
