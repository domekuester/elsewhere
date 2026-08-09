# ELSEWHERE content model

## Separation

Photographs, editorial objects and discovery metadata remain independent. A photo is referenced by stable ID from destinations, journeys, stories, fragments, people and collections; it is never duplicated to create a relationship.

## Confidence and source

Factual fields carry source/confidence where relevant. Implemented values include `OWNER_TRAVEL_TIMELINE`, `CURATION_STUDIO`, `CONFIRMED_OWNER_RANGE`, `TRANSITION_DAY_REVIEW`, `CURATORIAL_ASSIGNMENT`, `NEEDS_OWNER_INPUT` and `UNKNOWN`. Geographic precedence remains GPS/Apple Photos, owner timeline, manual curation, then editorial visual interpretation—which is never geographic proof.

## Publication states

Internal states are `UNREVIEWED`, `CURATED`, `NEEDS_INFO`, `READY`, `PUBLISHED`, `HOLD`, and `PRIVATE`. Visibility is separately `public`, `hold`, or `private`; People privacy adds `PUBLIC`, `REVIEW`, `PRIVATE`, `DO_NOT_PUBLISH`, and `UNKNOWN`.

The existing 530-frame Archive is public visibility because Phase 4 already exposed it; editorial publication state remains `UNREVIEWED`. These are deliberately different concepts. New imports may default to hold. Private/do-not-publish records are removed from the generated public catalog.

## Data files

- `docs/photo-inventory.json`: technical source inventory.
- `data/photo-curation.json`: owner/editorial decisions; never JPEG metadata.
- `data/destinations.json`: geographic/editorial destination objects.
- `data/journeys.json`: time-bounded trips; one country can have many journeys.
- `data/story-candidates.json`: review proposals, not published stories.
- `data/people-review.json`: identity/privacy review entries.
- `data/owner-questions.json`: prioritized missing knowledge.
- `public/data/photo-catalog.json`: deliberately reduced public-safe payload.
