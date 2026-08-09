# ELSEWHERE Curation Studio

The development-only working route `/curate/` provides a fast local review surface for all 530 frames. It is not linked publicly. Production emits only a no-index not-found shell at that path; the catalog, controls and client script are excluded.

## Implemented workflow

- 530 optimized thumbnails in a dense grid.
- Large selected-frame preview using the archive derivative.
- Filters for assignment status, world, and destination.
- Visual-world, destination, role, visibility, featured, story/people/print candidate assignments.
- Previous/next navigation and keyboard shortcuts: `1–6` worlds, `H` hero, `E` editorial, `A` archive, arrow navigation.
- Browser-local persistence followed by explicit `photo-curation.json` export.

There is deliberately no server write endpoint. The owner reviews the downloaded JSON before replacing `data/photo-curation.json`. Original photographs, filenames, EXIF and manifests cannot be changed by this interface.

Production safety is structural: the route branches on `import.meta.env.DEV`, injecting neither catalog, controls nor client script in production. The page always declares `noindex, nofollow, noarchive`. The local injected catalog is public-safe and contains no GPS/source paths.
