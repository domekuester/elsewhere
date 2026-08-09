# ELSEWHERE platform architecture

## Implemented separation

ELSEWHERE now separates three concerns:

1. **Photographs** — stable image objects in `docs/photo-inventory.json`, public-safe catalog data in `public/data/photo-catalog.json`, and editorial assignments in `data/photo-curation.json`.
2. **Editorial content** — story, fragment, destination and manual ordering contracts in `src/data/content-models.ts`; authored homepage selections remain in `src/data/editorial-selection.ts`.
3. **Discovery metadata** — visual worlds, year, orientation, destination approval and relationship IDs. Incomplete data remains unassigned.

The public platform is static Astro. JavaScript enhances the archive incrementally and powers the viewer; core pages, navigation and the opening archive edit remain readable without it.

## Public surfaces

- `/` — curated cinematic edit.
- `/archive/` — deep progressive photographic index.
- `/people/` — human encounter direction.
- `/collections/black-and-white/` — the quiet room.
- `/destinations/` — destination architecture without unverified image claims.
- `/collections/` — collection entry architecture.

`/curate/` is a development-only working surface. In production it contains no catalog or controls and returns only a no-index not-found state.

## Scale path

The current catalog indexes 530 photographs. The archive renders 24 at first and appends 24 on request, so catalog growth does not increase initial image requests or initial DOM size. At thousands of records, replace the single public JSON with generated pages/chunks while retaining the same photo schema and client interface.

Destination membership is manual/approved; destination templates may group approved photographs automatically but accept an explicit `editorialPhotoOrder` override. Editorial order always wins.

## SEO and privacy

Archive utility states are not separate indexable pages. Curation is excluded from production and marked `noindex` in development. Only meaningful collections, stories, people and destinations should receive canonical public routes. Public catalog generation excludes source paths, coordinates and private notes.
