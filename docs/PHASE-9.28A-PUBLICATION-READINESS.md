# Phase 9.28A — publication readiness

What the new folders changed for the four chapters that have no public page. Nothing here was published;
this is an assessment.

| Chapter | Public frames before | After | Content floor (5) | Hero quality | Sequence | Story / copy | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Laos** | 3 | **8** | **now met** | good, not yet chosen | none | none | **READY FOR NEXT PUBLICATION PHASE** |
| Thailand | 32 | **47** | met | strong pool | 1 frame | none | STILL IN EDIT |
| Malaysia | 53 | **57** | met | provisional set | 3 frames | **Story 01 written** | STILL IN EDIT |
| Phu Quoc | 18 | **20** | met | provisional set | 1 frame | none | STILL IN EDIT |

## Laos — the one that materially changed

Phase 9.27 reported Laos as blocked by source limitation: three publication-eligible photographs against
a five-frame floor in `validate-content.mjs`, which meant no hero choice could have opened it. The Laos
folder added five, all confirmed to the Laos window by capture date, and one of them
(`photo-0663`) resolved a transition-day boundary the timeline had left open.

Eight frames is enough to *permit* publication. It is not yet enough to *justify* it, and the gap is
editorial rather than technical:

- **No curated sequence.** `manualOrder` holds one frame. Japan runs 17, Essaouira 14, La Réunion 14,
  Düsseldorf 11. Eight frames could support a short chapter, but somebody has to choose the order.
- **No alt text.** Every published chapter's frames have hand-written alt in the `altByFilename` map in
  `src/pages/destinations/[slug].astro`. The Laos frames have none.
- **A consent question sits on the strongest older frame.** `photo-0537`, the current `heroPhotoId`, is a
  close portrait of an identifiable woman at a market. It was flagged in Phase 9.27 and is unresolved.
- **No owner narrative.** Malaysia has Story 01; Laos has nothing.

Publishing on eight frames with an unsequenced grid and generated alt text would produce exactly the
"thin chapter" that the destinations index currently avoids by keeping Laos in the archive list.

**Recommendation:** a small Laos curation phase — sequence, alt text, the `photo-0537` consent decision,
and a hero chosen with the sequence rather than before it. That is a contained piece of work now that the
photographs exist.

## Thailand — the largest gain, still the largest gap

47 public frames, and the new material is the strongest of the five folders. But `manualOrder` holds one
frame and there is no owner story. Thailand is the biggest unopened chapter on the site and deserves a
proper curation phase rather than a hero drop.

## Malaysia — closest to a story, furthest from a sequence

Four new frames, 57 public, and the only unopened chapter with a written owner narrative
(`docs/STORY-01-MALAYSIA-PACK.md`). It is still gated on the same two blocking questions from that pack:
which city the urban frames are, and which island frames are Pulau Kapas. Neither is answerable without
the owner, and captions cannot be written until they are.

The destination page also has no editorial text slot — it renders a hero, a provenance line and the
sequence, with no surface for the Story 01 publication text. That is a build item for whichever phase
opens Malaysia.

## Phu Quoc

Two new frames. No change in status.

## Nothing was auto-published

No `publicationStatus` was changed by this phase. A chapter opening is an editorial decision, and
`classify-owner-timeline.mjs` states the same rule in code: a destination never publishes itself by
crossing a photo count.
