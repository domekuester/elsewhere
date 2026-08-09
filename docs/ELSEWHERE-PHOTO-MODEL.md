# ELSEWHERE photo model

The canonical technical inventory remains `docs/photo-inventory.json`. The public archive consumes the derived, privacy-safe `public/data/photo-catalog.json`. Editorial decisions are separate in `data/photo-curation.json`.

## Public photo object

Implemented fields include `id`, index, filename, thumbnail, archive image, width, height, aspect ratio, orientation, capture date, year, camera, lens, color mode, dominant color, visual worlds, people presence, destination/region/place, role, featured, public, alt text, caption, and approval status.

Unknown values are `null`, empty arrays, or `unassigned`. The generator never infers a geographic assignment. Public objects contain no exact location, source master path, or private note.

## Editorial assignment

`data/photo-curation.json` stores destination, visual worlds, role, visibility, featured and candidate flags separately from the source inventory. It also carries `focalX`, `focalY`, `mobileFocalX`, and `mobileFocalY` defaults so future art direction can protect subjects without modifying a JPEG.

Roles are `hero`, `anchor`, `editorial`, `support`, `detail`, and `archive`. A role is editorial, not a technical image property.

## Editorial objects

`src/data/content-models.ts` defines stories, smaller story fragments, and destinations with photo references and manual ordering arrays. These objects reference photo IDs; they do not duplicate or absorb the photo record.
