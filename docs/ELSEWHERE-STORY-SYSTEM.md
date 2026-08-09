# ELSEWHERE Story system

Stories may be one image or many. Supported editorial types are visual essay, encounter, place note, memory, sequence, photo story and short story. The public model supports a hero, destination/journey/person/fragment relationships, body, owner notes, SEO fields, status and manual order.

Fragments are implemented as an empty-safe data source in `data/fragments.json` and a reusable `StoryFragment.astro` composition. It renders one approved photograph plus optional owner text and approved year/destination; no placeholder fragment is publicly fabricated.

Phase 5 creates **candidates**, not stories. A deterministic timestamp pass identifies same-day sequences with gaps no greater than 30 minutes and at least four frames. It does not infer a subject or event. Fourteen prioritized groups are in `data/story-candidates.json` and `docs/STORY-CANDIDATES.md`.

Strong first reviews are candidate 10 (Japan; ten frames including the selected horizon anchor), candidate 12 (Japan; nine frames ending in the selected hand-and-shell detail), and candidate 01 (La Réunion; a 37-frame two-minute burst that first needs near-duplicate reduction before narrative review).
