# Archive Curation Strategy

## Six image roles

- **HERO:** exceptional, immersive, instantly memorable.
- **ANCHOR:** defines a chapter or visual world.
- **EDITORIAL:** carries narrative or browsing depth.
- **SUPPORT:** connects stronger frames and sustains continuity.
- **DETAIL:** intimate object, gesture, texture, or atmospheric pause.
- **ARCHIVE:** valuable deeper material not required in the current edit.

## Working fields

`src/data/archive.ts` now includes editorial role, emotional intensity, visual-rhythm use, monochrome state, and people presence in addition to dimensions, capture metadata, categories, relationships, scores, and separate private/public location. `src/data/editorial-selection.ts` records the first authored cross-page selection with all destinations set to `null`.

## Workflow

1. Preserve master file and stable identity.
2. Review on contact sheets; shortlist by visible strength rather than filename order.
3. Inspect shortlisted master at useful scale.
4. Assign provisional visual world and editorial role.
5. Record monochrome and people presence from visible evidence.
6. Keep geography null until independently verified.
7. Build a page sequence with expansion, intimacy, transition, pause, or continuity roles.
8. Generate non-destructive working derivatives; Astro creates responsive production variants.
9. Review desktop and mobile crops in-browser.
10. Promote, demote, or retire frames as the edit evolves.

## Scale strategy

The homepage remains a selective front cover. Category, People, collection, story, and later destination pages provide depth. Archive growth should add relationships and authored edits—not an infinite unfiltered wall.

## Image pipeline

Masters remain under `assets-source/photos/`. Working derivatives live under `src/assets/photos/` and retain original content. Astro currently generates intrinsic-size WebP source sets. Production should add AVIF after representative quality review, immutable CDN caching, derivative checksums, and role-based presets for hero, anchor, editorial, preview, and thumbnail widths.
