# Phase 9 — Stock syndication strategy

Optional, deliberately unimplemented, and ranked last on brand fit in the revenue roadmap. Nothing
has been uploaded anywhere.

## The tension

Stock platforms offer reach and take almost everything in return: a large commission, control over
pricing, and the framing of your work as interchangeable inventory. A photograph earning €0.25 per
download on a microstock site is worth less than the same photograph never appearing there, because
its presence there sets its perceived price.

ELSEWHERE's licensing position is the opposite: few photographs, individually considered, priced per
use. These two positions do not coexist for the same images.

## If it is ever used

**Rule 1 — never the frames that carry the publication.**
The homepage hero, the destination chapter sequences, the Black & White collection, and the print
shortlist stay exclusive. These are the images that establish that the work is worth commissioning.

**Rule 2 — a deliberately separate selection.**
Syndicate the competent-but-not-defining frames: clean landscapes, textures, generic scenes without
recognisable people. Photographs that would otherwise sit in the archive unseen forever.

**Rule 3 — commercially clear only.**
Stock platforms sell commercial use by default. Only `COMMERCIAL_CLEARED` frames — releases actually
held — could ever go. At present that set is empty, so the question does not yet arise.

**Rule 4 — rights-managed over royalty-free.**
If a platform is used at all, prefer agencies that price per use and represent photographers rather
than microstock volume marketplaces.

**Rule 5 — ELSEWHERE stays the home.**
Any syndication carries credit back. The publication is the brand; a platform is a distribution
channel, never the address.

## Realistic assessment

For an archive of this size, microstock would produce a few euros a month while measurably weakening
the licensing position that could produce a few hundred from a single sale. A specialist travel or
editorial agency is a more plausible fit, but agencies want volume and consistency, and this archive
is built around selectivity.

**Recommendation: do not syndicate.** Revisit only if direct licensing enquiries prove there is
demand the direct channel cannot serve — which would be a good problem, and a different decision
made with real data.

## What exists in the code

Nothing platform-specific, deliberately. The rights model (`src/data/rights.ts`) is the only
prerequisite: it can already identify which frames would be eligible, and today that set is empty.
