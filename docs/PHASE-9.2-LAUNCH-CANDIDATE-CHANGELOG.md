# Phase 9.2 — Launch candidate changelog

Meaningful changes only. Ordered by how much they change what a visitor experiences.

## Editorial

- **Japan's chapter re-cut, 11 → 17 frames.** All eleven previous frames already appeared on Home or
  Black & White; the deepest archive on the site revealed nothing new. Zero overlap now.
- **La Réunion published as a chapter, 14 frames.** 101 public photographs and four of Home's most
  prominent images — including the site hero — came from a place with no page.
- **63 photographs withdrawn to editorial hold**, awaiting owner confirmation: 43 posed or social
  photographs of companions, 16 records of one hostel, 4 near-duplicates.
- **Black & White grew 36 → 48 frames** from measurement, not opinion: twelve genuinely greyscale
  photographs had never been added.
- **People gained a second act** — six new frames from four countries and a path to all 77.
- **Studio, Licensing and About re-shot from the archive** — six frames that appear nowhere else,
  replacing four of Home's photographs used two and three times over.
- Essaouira's Phase 9.1 edit reviewed and **left alone**.

## Discovery

- Home's five visual worlds now open the archive filtered to that world. They previously scrolled to
  other parts of Home, twice to a section about something else.
- All five worlds now exist as archive filters. Three of them (People, Beaches, Jungle) held 3, 7
  and 5 frames and were below the publication threshold; the review brought them to 77, 32 and 27.
- Every place named on the destinations index and on Home is now a link. 207 photographs were named,
  counted and unreachable.
- Essaouira restored to Home's destination list, from which a hardcoded array had omitted it.
- `?world=` deep links work and activate the matching control.

## Craft

- **Header legibility on pale heroes.** Difference blending resolved to a mid-tone smear over bright
  cloud; the header's own band now holds a constant darkness so the inversion always reads light.
- **Chapter scale rhythm.** Portraits resolved to one width in five of six sequence roles. Now 30–70%
  at desktop and 59–100% at mobile, with quiet pauses, real anchors, and a large closing frame.
- **Archive controls** no longer overrun the gutter by 4px between 980 and 1140px.
- **Touch targets** raised to the WCAG 2.2 24px minimum across the publication with no visible
  measurement changed.
- 404 offers two real destinations instead of naming a journal that does not exist.

## Truthfulness

- Destination counts derived from the public catalog at build time; the build fails if a chapter
  sequences a photograph that is no longer public.
- The archive masthead count follows the active filter instead of contradicting the progress row.
- Process language removed from Home ("Assignments come from the owner's travel timeline; transition
  days remain outside the destination edit until reviewed").
- "Visual journal" and "Skip to the journal" removed — ELSEWHERE has no journal.
- A region-level chapter no longer claims its region is unassigned.

## Engineering

- **`srcset` broken for 22 photographs.** Master filenames containing a space produced raw spaces in
  srcset candidates; the browser dropped every high-resolution candidate and rendered those frames at
  thumbnail size everywhere. Catalog URLs are now percent-encoded.
- **Visual worlds merged rather than substituted** in the catalog builder. Adding any world to a
  Phase 7 monochrome frame silently evicted it from the monochrome archive — caught when the
  Black & White archive dropped from 36 to 22 mid-phase.
- **`editorial-hold`** added as a first-class visibility state, deliberately separate from the
  owner's `do-not-publish` so reversing one never touches the other.
- Content validator extended: hold register and curation must agree both ways, a hold may not
  duplicate an owner rejection, held frames must retain no public derivative, and catalog URLs are
  decoded before filesystem checks.
- Home fails to build if it advertises a world the archive cannot honour.
- Studio, Licensing, About and People fail to build if they reference a non-public photograph.

## Not done, deliberately

No redesign. No new font, colour, design system, dependency, or JavaScript framework. No 3D, WebGL,
grain, parallax, cursor effects, loading screens or glassmorphism. No page per photograph, no tag
pages, no generated articles. No fabricated clients, testimonials, prices or travel copy. No
photograph deleted — everything withheld is reversible from the data layer. No production
deployment.
