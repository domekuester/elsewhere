# Phase 9.1 — Morocco ingestion

Technical record of how the recovered Essaouira archive entered ELSEWHERE.

## Folder discovery

`assets-source/photos/` contains exactly two directories:

| Directory | Status |
| --- | --- |
| `Foto Set 1.0` | The existing archive, 588 records, already ingested |
| `Marocco 2` | **New.** 48 JPEGs, ingested in this phase |

No `Morocco`, `Marocco`, `Marocco 1`, `Morocco 1` or `Morocco 2` directory exists. One folder was newly
introduced and one folder was ingested; `Foto Set 1.0` was not touched.

## Source inventory

| | |
| --- | --- |
| Files in folder | 48 JPEG (plus `.DS_Store`) |
| RAW / PNG / other formats | 0 |
| Corrupt or unreadable | 0 |
| Camera | Panasonic DMC-FZ330 — the same camera as the rest of the archive |
| Capture range | 2026-01-08 to 2026-01-14 (all 48 dated, from EXIF) |
| Orientation | 29 portrait, 19 landscape |
| Dimensions | 2249×3373 to 4000×3000; 20 distinct sizes, indicating individually cropped selects |
| File size | 3.8 MB to 12.6 MB |
| **GPS present** | **0** — nothing to strip, no private coordinates anywhere in the set |

## Duplicate checks

Every new file was compared against all 588 existing records.

| Check | Method | Result |
| --- | --- | --- |
| Exact duplicates of existing masters | SHA-256 over full file bytes | **0** |
| Already imported | Filename match against inventory | **0** |
| Internal exact duplicates | SHA-256 within the new set | **0** |
| Near duplicates / bursts | 16×16 normalised luminance signature, Euclidean distance | **1 pair** |

The one genuine near-duplicate is `P1330794.jpg` / `P1330795.jpg` — the same rider seconds apart.
`P1330795.jpg` (photo-0603) is kept because the horse is mid-stride and throwing dust;
`P1330794.jpg` (photo-0602) is excluded through the existing `duplicateFamilies` mechanism, so it
stays in the private archive and produces no public derivative.

The filename series (P1330174–P1350669) continues past the previous archive maximum (P1310083),
which is consistent with a later, separate trip and with the absence of any duplicate.

## Stable records

48 records appended as **photo-0589 … photo-0636**. Existing records were not renumbered. Archive
indices 589–636 follow the same stable-id model established in Phase 8.35: the number is the record's
permanent position, not a display slot.

## Source safety

Masters were read only. No file in `assets-source/` was moved, renamed, rewritten, recompressed, or
had metadata written. Derivatives are generated into `public/assets-derived/` by the existing
pipeline. `git status` reports no change under `assets-source/`.

## Ingestion script correction

`scripts/ingest-new-photo-records.mjs` hardcoded a Phase 7 assumption on every newly ingested record:

```js
categories: ['black-and-white-candidate'],
dominantColors: ['black', 'white', 'grey'],
notes: 'New monochrome archive addition; visually reviewed in Phase 7.',
```

`build-photo-catalog.mjs` treats exactly that category plus that note as a confirmed monochrome
review, so running ingestion unchanged would have pushed **all 48 colour photographs into the Black &
White archive** and reported 84 monochrome frames instead of 36.

The script now records only what the file is — dimensions, capture data, format — and leaves
editorial state empty until a human assigns it. Ingestion should never claim what a photograph means.

## Geography

The owner confirms Essaouira, Morocco. Every record carries:

```
destinationId: 'essaouira'   country: 'Morocco'   countryCode: 'MA'   region: 'Essaouira'
locationSource: 'OWNER_CONFIRMATION'
locationConfidence: 'OWNER_CONFIRMED'
destinationConfidence: 'OWNER_CONFIRMED'
journeyId: null
```

These dates fall outside the owner travel timeline, which ends 2025-08-31. The classifier marks such
photographs `outside` and leaves their geography alone, and `OWNER_CONFIRMATION` is in the
stronger-location set added in Phase 8.45, so regeneration cannot overwrite the owner's confirmation
with an inference. `journeyId` stays null because no journey has been defined for this trip — an
absence, not a guess.

## Destination architecture

Essaouira is a city under a country, following the existing Phu Quoc / Vietnam pattern:

```
morocco    (parent, 0 photographs, planned)
└─ essaouira   slug 'essaouira', displayName 'Essaouira\nMorocco', region 'Essaouira'
```

Canonical route `/destinations/essaouira/`. No competing route exists, so no redirect is needed.

Three generator changes were required, all of which generalise hardcoded behaviour rather than
special-casing Morocco:

1. **Trusted geography** — the destination photo filter accepted only `CONFIRMED_OWNER_RANGE`, which
   would have silently dropped every owner-confirmed photograph. It now accepts a
   `trustedGeography` set of `CONFIRMED_OWNER_RANGE` and `OWNER_CONFIRMED`.
2. **Publication** — the rule read `destination.id === 'japan' && featured.length >= 5`. It now reads
   from an explicit `publishedDestinations` set. Publishing a chapter stays a human editorial
   decision; a destination must never publish itself by crossing a photo count.
3. **Dates** — the destination page hardcoded Japan's journey dates and note. Destinations now carry
   a `dateRange` with a `source` of either `OWNER_TRAVEL_TIMELINE` or `CAPTURE_METADATA`, and the page
   renders whichever applies, labelling its provenance honestly.

## Rights

Conservative by default, per the Phase 9 model. Publication permission is not licensing permission.

| State | Count | Meaning |
| --- | --- | --- |
| `ENQUIRY_ONLY` | 34 | Copyright held, third-party rights not assessed |
| `RELEASE_REQUIRED` | 14 | Human presence in frame, no release held |
| `COMMERCIAL_CLEARED` | **0** | Nothing is cleared; nothing claims to be |

Every frame with any human presence — including distant and silhouetted figures — was marked
`RELEASE_REQUIRED` and `modelReleaseStatus: REQUIRED`. Restricting is always safe; claiming is not.
All 47 published frames read `licensing: enquiry` publicly, which offers a conversation and promises
nothing.

## Counts

| | Before | After |
| --- | --- | --- |
| Inventory records | 588 | **636** |
| Public photographs | 485 | **532** |
| Essaouira public | — | **47** |
| Black & white public | 36 | **36** |
| Japan public | 216 | **216** |
| Owner-rejected public references | 0 | **0** |
