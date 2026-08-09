# Phase 6 — SEO strategy

## Implemented foundation

- `SITE_URL` is the single production-origin setting used by canonical URLs, Open Graph URLs, JSON-LD, `robots.txt`, and `sitemap.xml`.
- Every public HTML route has a unique title, description, canonical, `max-image-preview:large`, Open Graph metadata, Twitter large-image metadata, and a descriptive share-image alternative.
- Home emits `WebSite` plus `WebPage` JSON-LD. Public pages emit `WebPage`; the published Japan chapter emits a truthful `CollectionPage` and `BreadcrumbList` graph.
- The hand-authored sitemap contains only six meaningful launch surfaces: Home, Archive, People, Destinations, Japan, and Black & White.
- `/curate/` is disallowed, `noindex`, and physically removed from production output. The provisional Collections index is `noindex, follow`; 404 is `noindex, nofollow`.
- No photo-detail pages, draft stories, unfinished destinations, or thin Field Notes are generated.

## Indexation policy

Index only a surface with a real editorial purpose, stable title, approved public imagery, and a natural continuation path. Publishing status in the content model controls destination route generation. Future Stories, People entries, Journeys, and Field Notes should use the same threshold rather than route volume.

Archive remains indexable as the canonical deep photographic index. Filter query strings do not create separate static pages or canonicals. Selected photographs may appear in more than one editorial context; canonical ownership stays with the meaningful collection/destination surface, not a generated photo page.

## Field Notes growth layer

Field Notes should be added only after owner knowledge and factual research exist. The first viable topics should connect confirmed Japan or La Réunion material to a real question, then link into the destination chapter, visual collection, or Archive. No keyword-volume claims or advice have been invented.

## Production requirement

Set `SITE_URL` to the final HTTPS origin before the public deployment. A local build intentionally uses `http://localhost:4321` so false domain ownership is never implied.
