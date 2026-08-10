# ELSEWHERE — creative and engineering constitution

ELSEWHERE is an independent, photography-first visual publication: a visual archive of the world as experienced by one person. It is not a travel blog, portfolio template, tourism portal, image dump, or SaaS product.

## Non-negotiable rules

- Preserve the established visual language and extend it; never restart or replace strong existing work without an explicit request.
- The photograph wins. Use real archive photographs unless the owner explicitly requests another source. Curate; do not dump the archive.
- Never fabricate a destination, identity, encounter, personal memory, quotation, or capture fact. Unknown values remain `null` or unassigned.
- Owner photo exclusions are authoritative and permanent. The canonical register is `ownerRejected[]` in [data/public-image-exclusions.json](data/public-image-exclusions.json), documented in [docs/OWNER-PHOTO-EXCLUSIONS.md](docs/OWNER-PHOTO-EXCLUSIONS.md). Automated curation, editorial selection, and regeneration must never re-enable a rejected photograph, and never re-derive its public assets; only an explicit owner reversal can. Exclusions live in the data layer, never in CSS or a single component reference. Explicit owner confirmation of a location outranks timeline, visual, filename, and prior automatic inference — but correcting geography never grants publication. Verify with `npm run validate:exclusions`.
- Treat [docs/OWNER-TRAVEL-TIMELINE.md](docs/OWNER-TRAVEL-TIMELINE.md) as trusted owner-provided project context. Do not contradict or narrow it without explicit new owner information. Preserve its transition windows; calendar-boundary photographs remain reviewable rather than guessed.
- Treat `assets-source/photos/` as read-only masters. Never rename, rewrite metadata, recompress, move, or delete them. Regenerable output belongs under `public/assets-derived/` or Astro's generated assets.
- Keep private location/GPS and private notes out of public catalogs, templates, client bundles, and page metadata.
- Home is the curated edit; Archive is depth. Do not grow Home merely because the archive grows.
- Astro is the platform. Prefer semantic Astro/HTML/CSS and small vanilla TypeScript enhancements. Add React only for a concrete island-level requirement and apply React performance guidance when doing so.
- Motion must support hierarchy. Every animation is essential, supportive, or decorative; decorative motion is rare. Reduced motion must expose complete, composed pages with no hidden content.
- Mobile is an authored editorial surface, not a scaled desktop. Protect faces, hands, eyes, horizons, and focal subjects with per-image focal metadata where needed.
- All public changes require rendered browser QA at desktop, laptop, tablet, 390px mobile, and small mobile. Check keyboard, focus, reduced motion, console, missing assets, crops, and layout shift.
- Maintain performance discipline: stable dimensions, responsive derivatives, genuine hero priority only, lazy loading below fold, incremental archive rendering, and minimal JavaScript.
- Accessibility is part of premium quality: semantic landmarks and headings, keyboard navigation, visible focus, readable captions, sufficient contrast, touch targets, and useful alt architecture.

## System boundaries

Photographs, editorial content, and discovery metadata are separate objects. Manual editorial ordering outranks automatic ordering on curated surfaces. Machine-derived monochrome/color or subject guesses are candidates only until reviewed.

The local curation studio is private tooling. It must not enter public navigation, sitemap, indexed production content, or expose write endpoints/private metadata. Its safe workflow is browser-local editing plus explicit JSON export.

## Start here

Read [docs/README.md](docs/README.md), then the platform, photo-model, archive, image-pipeline, motion, and current flagship report documents it links. Inspect the current rendered site before changing visual work. Preserve unrelated user changes.
