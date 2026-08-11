# THE JOURNEY — the storytelling system

Built in Phase 10 with Malaysia as the first story. It is designed to carry Thailand, Laos, Phu Quoc,
Japan and La Réunion without any of them being forced into Malaysia's shape.

## What it is for

| Surface | Question it answers |
| --- | --- |
| Destination chapter (`/destinations/<slug>/`) | What did he photograph there? |
| Archive by place (`/archive/place/<slug>/`) | Everything, in the order it was taken |
| **Journey story (`/journey/<slug>/`)** | **Why does this place matter?** |

These are different jobs. A story never lives inside a destination page, and a destination page never
grows an essay. Malaysia has no chapter yet, so its story currently sits next to
`/archive/place/malaysia/` rather than under a chapter — which the architecture handles: the story's
closing link points at whichever of the two exists.

## Where things live

| | |
| --- | --- |
| Content model + every story | `src/data/journey.ts` |
| Story page | `src/pages/journey/[slug].astro` |
| Series index | `src/pages/journey/[...page].astro` |
| Opening photograph | `data/surface-heroes.json` → key `journey-<slug>` |
| Hero derivatives | `npm run images:heroes` (the script already reads surface heroes) |
| Styles | `src/styles/global.css`, the Phase 10 block |
| Sitemap | `src/config/routes.ts` |

Prose is **data, not markup**. Nothing in the page component knows what a story says. The owner can
rewrite a paragraph, cut a sentence, reorder the sequence or swap a photograph by editing one array,
and the page rebuilds around it.

## The block grammar

Seven blocks. Malaysia used all seven until the Phase 10.6 recut removed its last `pair`; it now
uses six, and `pair` stays in the grammar for a story that wants it.

| Block | Renders as |
| --- | --- |
| `lede` | The opening paragraph, set large. One per story. |
| `text` | A run of body paragraphs in Literata, in the reading column. |
| `chapter` | A place or section marker in Barlow Condensed, with a rule above it. |
| `lines` | A run of very short lines set as a block. Malaysia uses it once. |
| `photo` | One frame at `full` (edge to edge), `wide` (the sequence column) or `inset` (small). |
| `pair` | Two frames side by side, the second dropped, so it reads as an edit rather than a grid. |
| `pause` | Space and nothing else. |

Portrait and landscape are sized differently at the same `display` value, because a 3:4 frame at the
landscape column width runs past two screens. `full` is for landscape frames; a portrait one is
capped and cover-cropped rather than allowed to become a wall.

Adding an eighth block is allowed when a story genuinely needs it. Adding one because it might be
useful is how a component zoo starts.

## Publication states

| Status | Route | Indexed | In the sitemap | Linked from |
| --- | --- | --- | --- | --- |
| `DRAFT` | none | — | — | — |
| `OWNER_REVIEW` | builds | `noindex, nofollow` | no | nowhere |
| `PUBLISHED` | builds | yes | yes | Home, the place's archive page, the series index |

A story awaiting review has a real URL so it can be read at full size in a browser, and is reachable
by nothing else. Flipping one field to `PUBLISHED` turns on the sitemap entry, the Home link, the
archive link and the index — all of which are gated on `publishedJourneyStories()`, so none of them
can point at something unpublished.

The series index does not exist until a story is published. One story is not a category, and an index
of nothing is a placeholder. It is not in the global navigation, and it should not be added there
until there are enough stories that a reader would look for it.

## What the build refuses to render

These are checks in `src/pages/journey/[slug].astro`, not conventions:

- a photograph that is not in the public catalog;
- a photograph that is not `public`;
- a photograph in `ownerRejected`, `editorialHold` or a duplicate family's `excludeIds`;
- a photograph that is not `storyCandidate: true` in `data/people-review.json`.

The last one is the important one. It is why the Malaysia story contains no identifiable person: a
face that is public in an archive grid has not thereby consented to being one of twenty photographs
in a piece of writing. Every such frame fails the build until the owner clears it, one field at a
time.

## Rules the system exists to hold

**Nothing may be invented.** No dish, restaurant, friend, encounter, dialogue, route or weather
event that the owner did not describe. A passage that would need a missing fact is left short, or
left out, and the question goes to the story's owner-questions document.

**A photograph claims no geography it cannot prove.** The narrative may name a city the owner named.
A caption, an alt text or page metadata may not, unless the photograph's own record carries it. When
Malaysia was first written not one of its frames did, so George Town was a text-only section rather
than three plausible-looking pictures under a heading. Eight frames now carry an owner-confirmed
place, and the story captions three of them — one per city, on the frame that establishes it. The
rest still say nothing.

**The photograph outranks the layout.** Text does not sit beside every frame, captions are optional
and rare, and some frames are followed by nothing at all.

## Deliberate omissions

**No viewer.** Story photographs do not open the immersive viewer. The sequence is the point; a
full-screen overlay in the middle of it destroys the reading. The archive is where frames are opened.
The global viewer was not touched.

**No new motion.** The story reuses `data-photo-reveal`, the existing restrained clip-path reveal,
and adds nothing. Native scroll is untouched — no smooth-scroll, no scroll-jacking, no pinning.

**No practical content.** No where to stay, what to eat, how to get there. That is a Field Note, and
the Field Notes layer already exists for it.

## Adding the next story

1. Choose the opening photograph and add `journey-<slug>` to `data/surface-heroes.json`.
2. `npm run images:heroes`.
3. Add the story object to `journeyStories` in `src/data/journey.ts` with `status: 'DRAFT'`.
4. Write it. Set `status: 'OWNER_REVIEW'` when it is ready to be read.
5. The owner reads it at `/journey/<slug>/` and sets `PUBLISHED`.

A story with eight photographs and four paragraphs is a valid story. Laos will be one.
