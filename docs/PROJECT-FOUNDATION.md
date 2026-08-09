# ELSEWHERE — Project Foundation

## Editorial premise

ELSEWHERE is an independent visual travel publication built around relationships between places, people, moments, and the photographs that connect them. It is not organized as a chronological blog. The experience should feel closer to entering a sequenced exhibition or opening a photography book than browsing an archive grid.

The working title is isolated in `src/config/site.ts`. Naming, metadata, navigation, and wordmarks should consume that configuration so a later rename is a controlled change rather than a repository-wide rewrite.

## Photography inventory summary

The initial library contains 530 photographs totalling 4.60 GB. There are 408 portrait, 120 landscape, and 2 near-square images. Every file has a capture date; none has embedded GPS. The dominant camera is a Panasonic DMC-FZ330. Objective metadata and interpretive editorial fields are deliberately separated in `docs/photo-inventory.json`.

The archive’s strongest differentiator is not only scenery. It is the repeated movement between scale and intimacy: volcanic cirques followed by faces, turbulent ocean followed by a single gesture, dense streets followed by architectural stillness. This becomes the publication’s compositional grammar.

## Content architecture

### Journeys

Complete travel narratives. A Journey is the broadest editorial container and can relate to many places, people, stories, photographs, collections, and field notes.

### Places

Geographic entities from country to neighbourhood, beach, mountain, market, or building. Places support hierarchical parents and coordinates without requiring a map to be visible.

### Stories

Authored observations with a strong narrative premise. Stories may belong to a Journey but should also stand alone through search and internal linking.

### People

Encounter-led profiles and portrait sequences. Consent status, naming preference, relationship to place, and public/private metadata must be modelled explicitly.

### Collections

Curated visual themes such as Faces, Ocean, Streets, Mountains, Night, Architecture, Food, Details, and Movement. Collections are editorial sequences, not automatic tag pages.

### Field Notes

Useful, search-oriented travel knowledge written in the same voice as the publication. Field Notes do the organic-discovery work of a blog without adopting blog chronology or presentation.

### Photography

Photographs are first-class content entities. A photograph can participate in several relationships while preserving one canonical asset record, one rights record, and multiple contextual captions or crops.

## Proposed site architecture

```text
/
/explore/
/journeys/[journey]/
/places/[country-or-region]/[place]/
/stories/[story]/
/people/[person-or-encounter]/
/collections/[collection]/
/field-notes/[note]/
/about/
```

Astro content collections should be defined for each primary content type with Zod schemas. Relationship fields use stable IDs rather than filesystem paths. Slugs remain human-readable and canonical URLs remain independent of content storage.

## Design system

### Physical scene

A reader opens the publication on a phone while travelling, then returns on a large screen in a quiet room to see the photographs at scale. The interface should survive bright daylight, dim rooms, slow connections, and reduced-motion preferences without losing its atmosphere.

### Visual principle

Photography sets the colour temperature and density. UI colour provides orientation, never decoration. Layout changes cadence from chapter to chapter while stable gutters, typography, captions, and link behaviour maintain identity.

### Typography direction

Brand voice: **elemental, attentive, intimate**.

The initial implementation uses a restrained neo-grotesk stack for large declarative typography and interface text, with a classical editorial serif stack used selectively for reflective headings and quotations. This avoids the saturated “luxury travel serif everywhere” formula. Production should license and self-host two purposeful families after brand naming is final; the target qualities are a confident, compact grotesk and an editorial face with strong roman forms rather than decorative italics.

Display type remains at or below 96 px, no tighter than `-0.04em`, and body copy stays between 45 and 72 characters per line.

### Colour system

- Obsidian `#0B0C0D`: primary dark field and gallery surround.
- Gallery Ivory `#F2F0EA`: light chapter field; used in large, deliberate intervals.
- Electric Ultramarine `#263DFF`: primary accent for active links, map points, and rare orientation cues.
- Burnt Copper `#B9673C`: restrained editorial warmth for specific story metadata.
- Deep Mineral `#173A3D`: available for destination chapter environments, not globally distributed.

Obsidian and Gallery Ivory do most of the work. Accent coverage should normally remain below 5% of a viewport.

## Component inventory

- `BaseLayout`: metadata, canonical URL, OpenGraph foundation, structured website data, skip link.
- `SiteHeader`: understated navigation and accessible mobile index.
- `EditorialFigure`: optimized Astro image, stable aspect ratio, crop control, and optional caption.
- `SiteFooter`: publication statement and secondary navigation.
- Hero chapter: one prioritized image, one statement, minimal entry cue.
- Journey chapter: sticky narrative text with a vertical photographic release.
- Place sequence: asymmetric frames rather than cards.
- People chapter: portrait-led split composition.
- Encounter diptych: a repeatable two-image narrative relationship.
- Collection chapter: full-viewport image field with minimal annotation.
- Story feature: image/text editorial spread.
- Editorial map teaser: code-native abstract geography; no third-party map payload.
- Field Notes index: typographic list optimized for scanning and internal linking.

Future components include panorama, triptych, contact sheet, annotated map, audio caption, print offer, partnership disclosure, and quiet sponsorship unit. Monetization components must live in named editorial slots and remain absent when no partnership exists.

## Motion system

Motion has three roles only: establish the opening, reveal a photographic chapter, and maintain spatial continuity.

- Hero: slow image settle and two-line title choreography.
- Photography: clip reveal plus restrained scale settle.
- Scroll continuity: very light hero parallax.
- Navigation: direct and fast; no theatrical delay.
- Easing: exponential/quartic ease-out, never elastic or bouncy.
- Reduced motion: Lenis and GSAP sequences are not initialized; native scrolling and fully visible content remain the baseline.

Animations enhance visible content rather than gating it. No essential information depends on motion.

## Image optimization strategy

1. `assets-source/photos/` remains the immutable master archive and is never served.
2. A curation step chooses only required images for a given release.
3. Curated working derivatives are capped before entering the site repository; originals remain untouched.
4. Astro generates responsive widths and hashed production assets. Browser negotiation should prefer AVIF/WebP with a fallback format where appropriate.
5. The true opening hero is eager, high priority, and width-aware. Everything below the opening viewport is lazy-loaded.
6. Width and height are always known before render. Aspect ratios and crop intent are component properties, preventing layout shift.
7. The future pipeline should generate 480, 768, 1200, 1600, 2200, and 2800 px variants selectively, not universally.
8. The manifest will eventually store focal point, crop-safe zones, rights, consent, alt text, and derivative checksums.
9. At library scale, build output should process only referenced images; a separate offline derivative service or object-storage pipeline becomes appropriate beyond roughly 1,000 active photographs.

## SEO architecture

Every primary entity receives a canonical URL, authored title and description, social image, indexability control, and relationship links. Journeys use `Article` or `BlogPosting` only when they contain a true authored narrative; Places use `Place` with contained geographic data; People use `Person` only when identification and consent make that appropriate; image-led pages include `ImageObject` data.

Technical foundations:

- one descriptive `h1` per page and semantic section headings;
- canonical URLs from a confirmed production origin;
- OpenGraph and social metadata;
- XML sitemap split by content type when the corpus grows;
- robots policy that never blocks required image assets;
- authored alt text based on purpose and context, not keyword stuffing;
- breadcrumbs on deep entity pages, not on the cinematic homepage;
- contextual internal links among journeys, places, stories, people, collections, and notes;
- static HTML for all essential content; interactive islands only where the experience requires them;
- no map library or client-side search payload on initial routes.

The production domain and author identity are intentionally not invented. Sitemap and publisher schema should be activated only once those are confirmed.

## Accessibility

The target is WCAG 2.2 AA. The first phase includes semantic landmarks, a skip link, keyboard-operable mobile navigation, visible focus behaviour, adequate type size, contrast-conscious text, descriptive image alternatives, and a first-class reduced-motion path. Captions should not be the sole carrier of essential context. Future map exploration requires a fully equivalent list-based view.

## Implementation phases

### Phase 1 — foundation and homepage

Inventory the archive; establish the manifest, content and URL models, brand tokens, core image component, SEO base, reduced-motion behaviour, and a complete responsive homepage using real photography. Validate desktop and mobile in-browser.

### Phase 2 — core editorial templates

Build Journey, Place, Story, Person/Encounter, Collection, and Field Note templates. Add content collection schemas, breadcrumbs, related-content logic, and photography sequences.

### Phase 3 — exploration

Build the editorial map with an accessible list equivalent, destination filters, and connected entity previews. Introduce a small interactive island only for map state.

### Phase 4 — discovery and scale

Add search, automated social-image generation, image rights/consent tooling, derivative checksums, broken-link validation, and scalable sitemap partitions.

### Phase 5 — quiet monetization

Introduce named, optional modules for prints, affiliates, partnerships, and sponsor disclosures. Measure commercial success without allowing these modules to determine the visual hierarchy.

## Phase 1 visual direction

The opening uses a wide volcanic cirque as an elemental, non-touristic entry. The page then changes scale: a monumental vertical landscape, a staggered place sequence, one direct portrait, an encounter diptych, a cobalt ocean field, a sunset story, a sparse geographic teaser, and a typographic Field Notes list.

The reference concept is stored at `docs/design-reference/homepage-direction-v1.png`. It establishes cadence, not a template to reproduce mechanically. The production implementation intentionally removes repeated labels and increases asymmetry so the result remains closer to a photographic sequence than a magazine landing-page formula.
