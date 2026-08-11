# Malaysia — what only you can answer

*Updated after Phase 10.1.*

The story is finished and it works as it stands. Nothing below was invented in the meantime, and
nothing below is needed to publish. Each item either unlocks something the page currently cannot do,
or would make the next draft better.

Four questions and one decision. That is the whole list.

## Answered by you already

**The dramatic cloud-and-market frame is Thailand.** Removed from the Malaysia story, corrected in
the data, kept as Thailand photography. It is not rejected and not deleted — it is now one of
Thailand's 48 frames, ready for a Thailand story.

**Your three George Town photographs.** Found, ingested as `photo-0687`, `photo-0688` and
`photo-0689`, and recorded as *George Town, Penang, Malaysia* on your word. They are the only
photographs on the site with a confirmed city. Two of them are now in the story and the George Town
section is no longer text only. Which two, and why, is in
[`PHASE-10-MALAYSIA-PHOTO-EDIT.md`](PHASE-10-MALAYSIA-PHOTO-EDIT.md).

---

## The decision — nine photographs, yes or no

**This is the only item that changes what is on the page.**

Nine Malaysia frames contain identifiable people. All nine are public in the archive today. None of
them is in the story, because `data/people-review.json` marks every one `storyCandidate: false` and
`NEEDS_OWNER_INPUT`, and appearing in a grid of 57 frames is a weaker use of somebody's face than
being one of twenty photographs in a piece of writing about a country.

| Photograph | What it is | If yes, where it would go |
| --- | --- | --- |
| `photo-0039` | A man working a drinks stall, bottles racked behind him | The best human frame in the city block. It would go after *I find that impressive. Not pretty. Impressive.* |
| `photo-0078` | A street-food stall, Chinese signage, someone cooking | The natural frame for the food paragraph, which currently has a shop and no cook |
| `photo-0145` | A young person in red boxing gloves, looking straight at the camera | Would go under *the people on Kapas are great*, which is currently the one sentence in the story with nothing beside it |
| `photo-0547` | A woman standing by a fire at night, monochrome | Alternative to the above, quieter |
| `photo-0665` | A man beside a boat, looking at the camera | Not needed for the story; asking anyway because it is new |
| `photo-0076`, `photo-0080`, `photo-0085`, `photo-0086` | Street frames: people walking away, a night fruit stall, a wet street kitchen | Nobody is the subject in these. A blanket yes on street frames would be a reasonable single answer |

A yes on any of them is one field in `data/people-review.json`. Nothing else has to change.

---

## 1. The April 2025 city block — which city? *(unlocks captions)*

**Partly answered by your three new photographs.** They are dated 4 October 2024, which sits in the
same block as the Kuala Lumpur skyline (29 September) — so the 29 Sep – 8 Oct 2024 block contains at
least two cities and cannot be captioned wholesale as either. Good to know, and it makes the caution
on the rest of them correct rather than fussy.

What is still open is the **17–21 April 2025** block. Three of those frames look like a different,
lower, older city to me — the painted child at a window (17 Apr), the clock tower (21 Apr) and the
flower shop (18 Apr). Kuala Lumpur, George Town, or both?

Answering it would let those frames be captioned. Nothing depends on it: George Town now has two
confirmed photographs of its own in the story.

## 2. Which of the island photographs are Kapas? *(unlocks captions)*

Two island blocks: 20–30 Aug 2024, and 23 Apr – 2 May 2025. Both, one, or neither? The story says
Pulau Kapas because you said it, and no photograph claims it.

## 3. How did you actually end up on Kapas in 2016?

You said by accident. That word is carrying the emotional centre of the whole chapter on its own,
and right now it gets one sentence. Two or three sentences about how it actually happened would
almost certainly become the best passage in the piece.

## 4. What does an ordinary day there look like?

Not the highlights. When you wake up, what you do with the day, when the light changes, how loud it
is or isn't. The photographs already show hammocks, an empty volleyball net, a cloud at four times
of day. They are missing the day they belong to. This is the other 200 words the story doesn't have.

---

## Two smaller things you could just tell me

**Your friends.** The story says only that you have met friends here since 2014 and that you stop
arriving as a stranger. No names are needed, ever. But if there is a habit — the same place, the
same first evening, the same thing you always do first — that would carry *return* better than any
sentence about returning.

**Three sentences that are mine, not yours.** They add no fact; they say something you already said,
in your register. They are listed in
[`PHASE-10-MALAYSIA-DE-FINAL.md`](PHASE-10-MALAYSIA-DE-FINAL.md). If any of them is too much, say
which and it goes.

---

## Where the answers go

German master → English publication text → `src/data/journey.ts` → the page. Captions and
per-photograph geography only become possible after 1 and 2.

## Still open, unchanged from before

The July 2025 Malaysia window (approx. 13–15 Jul) holds zero photographs. Correct, or a gap in
ingestion? Nothing in the story depends on it — the text says the country appears three times and
that two of those visits carry photographs, which is true either way.
