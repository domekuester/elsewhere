# Phase 9.25 — Düsseldorf ingestion

## Source folders found

A case-insensitive search of `assets-source/photos/` for every plausible spelling — `Düsseldorf`,
`Dusseldorf`, `Duesseldorf`, numbered variants, and `Germany` — returned exactly one match.

| Folder | Used |
| --- | --- |
| `assets-source/photos/Düsseldorf` | **yes** |
| `assets-source/photos/Foto Set 1.0` | no — the existing 588-record archive |
| `assets-source/photos/Marocco 2` | no — ingested in Phase 9.1 |

## Inventory

| | |
| --- | --- |
| Total entries (excluding dotfiles) | 22 |
| Image files | **22** |
| JPEG | 22 |
| RAW / PNG / other | 0 |
| Unreadable | 0 |
| Portrait / landscape | 19 / 3 |
| With EXIF capture date | 22 / 22 |
| **With GPS** | **0** |
| Cameras | Panasonic DMC-FZ330 (the same body as the rest of the archive) |
| Duplicate filenames within folder | 0 |
| Duplicate SHA-256 within folder | 0 |
| Largest source | 4000 px long edge |

Zero GPS means there was no private coordinate data to strip.

## Capture dates

22 September 2025 → 24 June 2026, on **ten separate days across nine months**.

This is the single most important fact the files themselves reveal, and it shaped the whole phase:
Düsseldorf is not a trip. It is a place returned to. No travel chronology was invented, the
destination carries **no `journeyId`**, and the chapter's provenance line says "Photographed across
9 months" rather than pretending to a continuous visit.

## Duplicate detection against the whole archive

Every one of the 636 existing masters was hashed and signature-compared against all 22 incoming
files.

| Check | Result |
| --- | --- |
| Filename collisions with existing records | **0** |
| Exact content duplicates (SHA-256, 636 masters) | **0** |
| Perceptual near-duplicates vs existing archive | **0** |
| Near-duplicate / burst groups within Düsseldorf | **0** |
| Matches against owner-rejected photographs (content, not filename) | **0** |

The perceptual check uses the same 16×16 greyscale signature the owner-exclusion verifier uses, so
a photograph already in the archive — or already rejected by the owner — could not have re-entered
under a different name. All 22 are genuinely new.

## Monochrome measurement

Per-pixel channel spread was measured on every frame. A true greyscale conversion reads 0 at the
99th percentile; these read **66–222**.

**Düsseldorf contributes zero photographs to Black & White.** That is the measured answer, not a
missed opportunity, and it matches the honest result Phase 9.1 reached for Essaouira.

## Records

Ingested through the existing `scripts/ingest-new-photo-records.mjs` — no Düsseldorf-specific
catalog was created.

- **photo-0637 … photo-0658**, appended without renumbering any of the 636 existing records.
- Every record carries explicit destination, country, publication state, rights state,
  classification state and public/private state. Nothing was left to default.
- The ingestion script records what a file *is* and never what a photograph *means*: editorial
  categories were left empty and assigned only after visual review.

## Master protection

All 22 masters were SHA-256 hashed before ingestion and re-verified afterwards: **22/22 byte
identical**. Nothing was renamed, moved, recompressed, rotated, colour-transformed or EXIF-edited.
Derivatives were produced only through `scripts/generate-archive-derivatives.mjs`.

## Defect found during ingestion

`scripts/generate-archive-derivatives.mjs` still used the pre-Phase-9.2 withheld list
(`private`, `do-not-publish`) and did not know about `editorial-hold`. Regenerating derivatives —
which this phase had to do — would have silently rebuilt public thumbnails, archive and viewer
images for **all 63 photographs Phase 9.2 withheld**.

It was caught before running, fixed to share the same withheld set as the catalog builder and the
content validator, and verified afterwards: **63 held frames, 0 resurrected derivatives.**

This was a latent Phase 9.2 defect that only a regeneration could expose, and Düsseldorf's arrival
is what exposed it.

## Location metadata

Owner-confirmed and used verbatim:

| Field | Value |
| --- | --- |
| `destinationId` | `dusseldorf` |
| `country` / `countryCode` | Germany / DE |
| `region` | Düsseldorf |
| `locationSource` | `OWNER_CONFIRMATION` |
| `locationConfidence` / `destinationConfidence` | `OWNER_CONFIRMED` |
| `journeyId` | `null` |

No district, street, neighbourhood or landmark name appears anywhere in the data or on the page.
The owner confirmed a city; a recognisable facade is not evidence of an address.

## Rights

Conservative, and entered into the existing rights architecture unchanged.

- All 22 `ENQUIRY_ONLY` — **zero** claim commercial clearance.
- `modelReleaseStatus: NOT_REQUIRED` — no identifiable person is the subject of any frame.
- `propertyReleaseStatus: UNKNOWN` — buildings, artwork and trademarks are unassessed.
- Internal rights notes stay in the private layer and appear in no public artefact.

The first attempt used `NOT_APPLICABLE`, which is not in the declared `ReleaseStatus` vocabulary.
The content validator rejected the build until it was corrected — working exactly as intended.
