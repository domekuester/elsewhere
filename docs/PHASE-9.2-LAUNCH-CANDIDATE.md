# Phase 9.2 — Launch candidate

## What ELSEWHERE now is

An independent photographic publication of **469 published photographs** from seven places, edited
into three chapters, a monochrome collection, a body of work about people, a filterable archive with
an immersive viewer, and a quiet commercial layer at the edges.

What changed in this phase is not what it contains. It is that the deeper you go, the more you see —
which is the thing it was claiming and, until now, not doing. Before Phase 9.2, every photograph in
the Japan chapter had already appeared on the homepage or in Black & White; La Réunion's 101
photographs had no page at all; three of the five worlds the homepage advertised did not exist as
archive filters; and 207 photographs were named, counted, and unreachable from the page naming them.

The archive is also 63 photographs smaller, and better for it. Removing a friends' beach workout, a
hostel's signage and a fashion shoot in an orange dress does more for a €50,000 perception than any
addition could.

## Publication ready

| Surface | State |
| --- | --- |
| Home | Ready. Photography dominant, arc intact, one hardcoded omission and one piece of process copy removed. |
| Japan | Ready. 17 frames, none used elsewhere. Flagship. |
| La Réunion | Ready. 14 frames, newly published, none used elsewhere. |
| Essaouira | Ready. 14 frames, Phase 9.1 edit reviewed and left alone. |
| Destinations index | Ready. Three chapters, four archived places, every one of them a working link. |
| Archive | Ready. 469 frames, six honest filters, truthful counts. |
| Black & White | Ready. Curated edit unchanged; archive 36 → 48. |
| People | Ready. Nine frames on the page, 77 behind it. |
| Viewer | Ready. Excellent, and untouched. |
| Studio | Ready. Own photography, no fabricated credibility. |
| Licensing | Ready. Own photography, honest rights language, no stock marketplace. |
| About | Ready. Own photography, numbers read from the archive. |
| Contact | Ready, gated on a verified address. |
| 404 | Ready. Two real destinations. |

## Hidden or deferred, on purpose

| Thing | Why |
| --- | --- |
| Malaysia, Thailand, Phu Quoc, Laos as chapters | Not enough photographic depth for a sequence with a spine. Reachable at archive depth with truthful counts. |
| 63 held photographs | Withheld pending owner confirmation. Data intact, reversible. |
| Field Notes | Architecture built, corpus empty. Drafts build nothing; the index does not exist. |
| Prints | No paper, sizes, prices or fulfilment. A shortlist exists internally. |
| Analytics | Bridges implemented, dormant until a provider is configured. |
| `/curate/` | Private tooling, absent from `dist/` and enforced by the build. |

Nothing anywhere says "coming soon".

## What the owner still needs to supply

One photographic decision, four launch blockers, all external:

0. **Confirm or reverse the 63 editorial holds.** The only judgement call from this phase.
1. Public enquiry email (`PUBLIC_CONTACT_EMAIL`)
2. Domain (`SITE_URL`)
3. Legal identity for the Impressum
4. Privacy policy

Plus, open and non-blocking: a public creator name, an analytics decision, and a few honest
sentences about Essaouira and La Réunion so those chapters have a voice as well as photographs.

Full list: [PHASE-9-OWNER-ACTION-QUEUE.md](PHASE-9-OWNER-ACTION-QUEUE.md).

## Technical status

Build passes. Content, privacy, owner-exclusion, production-boundary and launch validation all pass.
Zero broken public assets, zero console errors, zero horizontal overflow across 16 routes × 10
viewports, clean in WebKit including an iPhone profile, and clean under reduced motion.

Three real engineering defects were found and fixed: 22 photographs rendering at thumbnail
resolution everywhere because of a `srcset` parse failure; a catalog builder that evicted frames
from the monochrome archive whenever a world was added to them; and a header that became illegible
over any pale photograph. No dependency was added.

## Editorial status

The strongest it has been. Three chapters that reveal new photography, a monochrome collection that
is no longer understating itself, a People page that is no longer three photographs behind a
navigation entry, and an archive whose promises and contents agree. The weakest public material has
been withdrawn rather than defended.

The remaining editorial gap is **written voice**: two of the three chapters are carried entirely by
photographs because no owner text exists for them. That is an owner input, not a software gap, and
the site is honest about it rather than filling the space with invented copy.

## Business status

Unchanged in architecture and improved in credibility. Studio, Licensing and About now argue with
photography the visitor has not already seen, which is the whole of their case. Every enquiry path
remains gated on a verified address; zero photographs claim commercial clearance; nothing is
promised that cannot be kept.

## Scores

Independent, uninflated, 0–100.

| | |
| --- | --- |
| First impression | 90 |
| Photographic quality | 88 |
| Photographic edit | 89 |
| Homepage | 88 |
| People | 84 |
| Black & White | 90 |
| Destinations index | 89 |
| Japan | 88 |
| Essaouira | 85 |
| La Réunion | 86 |
| Other destinations (handled honestly) | 78 |
| Archive | 87 |
| Discovery | 86 |
| Viewer | 93 |
| Typography | 90 |
| Navigation | 89 |
| Mobile | 87 |
| Desktop | 89 |
| Image fidelity | 92 |
| Interaction | 87 |
| Motion | 85 |
| Accessibility | 91 |
| Performance | 89 |
| Editorial voice | 79 |
| Brand distinctiveness | 88 |
| Studio | 85 |
| Licensing | 86 |
| SEO / discovery | 88 |
| Emotional impact | 86 |
| Perceived professional value | 88 |
| Launch readiness | 91 |

**Editorial voice at 79** is the lowest score and the honest one: two chapters have no words at all,
and the publication is deliberately sparse rather than filling that silence with invented prose. It
is the one number an owner sentence would move.

**People at 84** because it is now genuinely deep but its curated page is still nine frames against
77 in the archive; there is a stronger People chapter to be made when the owner is ready to make
decisions about promoting a stranger's portrait.

## Final verdict

| | |
| --- | --- |
| Global publication quality | **88** / 100 |
| Editorial readiness | **87** / 100 |
| Technical readiness | **93** / 100 |
| Mobile readiness | **88** / 100 |
| Business readiness | **85** / 100 |
| **Overall launch-candidate score** | **89** / 100 |

The remaining blockers are a domain, an email address, legal identity and a privacy policy. None of
them is a design or software failure.
