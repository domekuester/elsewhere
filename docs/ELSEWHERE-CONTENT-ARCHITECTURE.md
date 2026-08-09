# ELSEWHERE Content Architecture

## Two independent ways through the archive

**Visual worlds** organize photographs by what they contain or evoke: People, Beaches, Urban, Jungle, and Ocean. **Geography** organizes only reliably verified public place information. A visual category never implies a country, and a destination is never assigned from appearance.

## Primary publication entities

- Journeys: complete authored travel narratives.
- Destinations: countries or geographically meaningful regions.
- Places: cities, islands, neighbourhoods, landscapes, and public locations.
- People: consent-aware encounters and their related photographs or stories.
- Collections: visual themes and photographic edits.
- Stories: observations and narrative features.
- Field Notes: useful search-oriented publishing without a chronological blog presentation.

Planned canonical routes are `/journeys/[slug]/`, `/destinations/[slug]/`, `/places/[slug]/`, `/people/[slug]/`, `/collections/[slug]/`, `/stories/[slug]/`, and `/field-notes/[slug]/`.

## Photograph object

`src/data/archive.ts` defines the first typed archive contract. It includes identity, dimensions, capture metadata, visual classification, relationships, editorial scores, publication state, accessible text, and separate private and public location objects. Unknown fields are nullable; the system must never replace absence with invention.

Exact coordinates remain private. Public pages consume only approved country, region, and place fields.

## Discovery model

Explore can grow into modes by world, place, story, and time. Each entity should expose a small number of authored next paths: related person, visual world, place, journey, or story. Relationships use stable IDs rather than file paths so asset processing and brand renaming remain independent of URLs.

## Current preview state

The homepage provides real visual-world entry points and a text-only provisional destination index. `/destinations/` explains the verification state without geographically assigning any photograph. Fake destination or story pages have deliberately not been generated.

## SEO and publishing foundations

Every published entity will require an authored title, description, canonical URL, social image, indexing state, alt text, and appropriate relationships. Structured data should match actual content: `Article` for true narratives, `Place` for approved location data, `Person` only when identification and consent permit it, and `ImageObject` for image-led detail pages. Sitemap generation should begin once the production domain and content collection schemas are confirmed.
