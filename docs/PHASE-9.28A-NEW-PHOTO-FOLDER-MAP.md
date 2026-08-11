# Phase 9.28A — new photo folder map

## What was found

`assets-source/photos/` held eight top-level folders. Three were already ingested (`Foto Set 1.0` 588,
`Marocco 2` 48, `Düsseldorf` 22). Five were new:

| Folder | Owner-intended target | Files | New records | Public | Withheld |
| --- | --- | --- | --- | --- | --- |
| `Mobile Fotos Malaysia` | Malaysia | 5 | 5 | 4 | 1 |
| `Mobile Fotos Thailand` | Thailand | 13 | 13 | 13 | 0 |
| `Mobile Fotos Laos` | Laos | 5 | 5 | 5 | 0 |
| `Mobile Fotos Phu Quoc` | Phu Quoc / Vietnam | 2 | 2 | 2 | 0 |
| `Mobile Fotos People` | People pool | 3 | 3 | 2 | 1 |
| **Total** | | **28** | **28** | **26** | **2** |

Records are `photo-0659` … `photo-0686`, appended by the existing `scripts/ingest-new-photo-records.mjs`
without renumbering anything. Source masters were read only.

## The folder names were independently corroborated

"Mobile Fotos" turns out to be a misnomer: 25 of 28 carry `Model: DMC-FZ330`, the same Lumix as the rest
of the archive, at 10.7–12 MP. Only three are below 8 MP. None is a phone file.

More usefully, **every folder's EXIF capture dates fall inside that country's window in
`docs/OWNER-TRAVEL-TIMELINE.md`** — Laos 5–13 Dec/Jan, Malaysia 22 Aug–5 Sep 2024, Phu Quoc 4–6 Apr 2025,
Thailand across both Thailand periods. The owner's folder naming and the owner's travel record agree
without exception, so 27 of 28 classified automatically at `CONFIRMED_OWNER_RANGE`.

The 28th is the interesting one. `photo-0663` (2024-12-05) falls in the Thailand → Laos transition
window the timeline deliberately leaves open, so the classifier refused to place it. The owner had put
it in a folder named Laos. AGENTS.md is explicit that owner confirmation of a location outranks timeline
inference, so it is recorded as `locationSource: OWNER_CONFIRMATION` — which also makes it survive
future re-classification. **A folder name resolved a boundary photograph that no amount of inference
could.**

The two `People` frames that were shot in Thailand (`photo-0669`, `photo-0670`) are assigned to Thailand
with `peopleCandidate: true`. "People" is a category, not a geography; the timeline supplies the place.

## Duplicates

Compared against all 658 existing masters by SHA-256 and by 256-bit perceptual hash.

- **Exact duplicates: 0.** **Already imported: 0.**
- **Three filename-stem collisions**, all resolved by looking at the pixels:
  - `IMG_9319.jpg` vs `photo-0050` — perceptual distance 49. Different photographs, same in-camera
    counter. Not a duplicate.
  - `P1160394 Kopie.jpg` vs `photo-0064` — distance 69. Different photographs. Not a duplicate.
  - `P1210843.jpg` vs `photo-0139` — **distance 16, identical dimensions, identical capture instant.**
    Same photograph, re-graded. See below.

## The two withheld frames

**`photo-0671` (People/P1210843.jpg) — `private-social` hold.** This is a warmer re-grade of
`photo-0139`, which Phase 9.2 already withheld as "a posed or social photograph of a travelling
companion… recognisable private individual, no model release". Side-by-side comparison confirms the same
frame. The owner placed this copy in a folder named People, which records intent — but AGENTS.md requires
an *explicit owner reversal* to re-enable a withheld photograph, and a file landing in a folder is not
that. It is ingested, held, and registered in `editorialHold` with a pointer to `photo-0139`.
**One word from the owner releases it.**

**`photo-0668` (Malaysia/IMG_7191.JPG) — `identifiable-individual` hold.** A close street photograph
where a recognisable person is the dominant subject at short range and appears to look toward the
camera. Documentary in character, and the archive already publishes comparable frames, but it costs
nothing to wait and everything to be wrong. Held for owner review.

## Publication states applied

New records default to **public** in `scripts/build-photo-catalog.mjs` — an absent `visibility` resolves
to `hold`, and `hold` is not in the deny-list. Ingesting 28 unreviewed photographs and rebuilding would
therefore have published all of them, including both frames above. Every new record was given an
explicit `visibility` **before** any catalog was built.

Rights are conservative and separate from publication: eight frames containing a recognisable person are
`RELEASE_REQUIRED`, the other twenty `ENQUIRY_ONLY`. Both surface publicly as "enquiry"; neither promises
anything. No release, clearance or commercial availability was invented. No GPS is present on any of the
28 files.

`visualWorlds` were assigned curatorially for 24 of 26 public frames after looking at each image; the two
where the subject was not unambiguous were left empty rather than guessed.

## Not used

Nothing was discarded. The two withheld frames are ingested and reversible. No folder was skipped, and
no file in the five folders was unreadable.
