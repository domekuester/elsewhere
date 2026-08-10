# Phase 8.35 — Black & White Archive

## Inventory reconciliation

- Phase 7 visually reviewed monochrome additions: 58
- Existing curatorially assigned monochrome records: 3
- Unique confirmed genuine monochrome records: 61
- Structurally excluded from public output: 25
- Explicit `private` / `do-not-publish` monochrome records: 0
- Public-eligible monochrome records: 36
- Public Black & White archive records: 36
- General publication metadata still marked `UNREVIEWED`: 61

The last value is not a monochrome-confidence value. Phase 7 visual review or an explicit curation assignment confirms monochrome eligibility; `publicationStatus` remains the broader staged editorial status.

## Canonical experience

The canonical route is `/archive/black-and-white/`. It is server-rendered with a monochrome-only opening set, survives refresh and direct entry, and is listed in the sitemap. The general Archive links to this route rather than creating a competing transient filter URL.

All Archive, Explore, and continuation links inside the Black & White collection use the canonical route. The collection remains the nine-image curated edit; the archive exposes the deeper 36-image body of work.

Viewer next/previous uses the active monochrome result set. The tested final frame wraps to the first monochrome frame without entering the color archive.

## Eligibility rule

A public record is included only when monochrome authenticity is supported by existing review data or a curation assignment, the public catalog permits display, and the record is absent from owner-rejected and duplicate-family exclusions. No pixel-only guess promoted a photograph.
