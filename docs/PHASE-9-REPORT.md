# Phase 9 — Launch and revenue foundation

ELSEWHERE now has a commercial layer that is real, safe, and nearly invisible until someone needs it.
No photographic surface was redesigned, no credibility was fabricated, and no rights were invented.

## What was built

**Studio** (`/studio/`) — three offerings, one combined *Story & Site* commission, one restrained
call to action. No fabricated clients, testimonials, awards or prices. The site itself is presented
as the portfolio, which is both true and the strongest available argument.

**Licensing** (`/licensing/`) — an editorial rights desk. Explains that copyright stays with the
photographer, that third-party rights are assessed frame by frame, and that an honest no is a
possible answer. Not a checkout.

**About** (`/about/`) — why the archive exists, how it is edited, and the route into commissioned
work. Every number on it is read from the archive at build time.

**Contact** (`/contact/`) — one form, seven intents, no server endpoint. Composes a message to a
verified address, so there is nothing to attack and no data in transit.

**Rights model** — `rightsStatus`, `modelReleaseStatus`, `propertyReleaseStatus` and internal notes,
none of which ever reach a public artefact. The public catalog receives one derived field. Two
validators fail the build if that boundary is crossed.

**Field Notes** — full content model, article template, affiliate component and route architecture,
with an empty corpus. Drafts build nothing; the index does not exist until a note is published.

**Image SEO** — a 532-entry image sitemap, ImageObject structured data with truthful credit and
copyright, breadcrumbs, and a route-registry-driven page sitemap.

**Analytics** — a named event vocabulary on an internal bus with dormant Plausible and Umami
bridges. Nothing leaves the browser until the owner configures a provider.

## The decision that shaped the phase

Publication permission and licensing permission are separate, and uncertainty must never resolve into
a commercial claim.

All 485 published photographs are `ENQUIRY_ONLY` — copyright held, third-party rights not yet
assessed. **Zero are marked commercially cleared**, because no rights review has happened. Every
frame can be *asked about*; none is *offered*. An enquiry is a question, a licence is an offer, and
the site only makes the former. `COMMERCIAL_CLEARED` cannot even be set while a release status is
`UNKNOWN` — validation rejects it.

This is why there is no "Buy licence" button, no price, and no pre-cleared stock language anywhere.

## What was deliberately not built

**No prints page.** Publishing one without real paper, sizes, prices and fulfilment would be a
promise that cannot be kept. A shortlist of 12 candidates exists internally; print interest is
captured through the contact form.

**No "coming soon" anywhere.** Field Notes, prints and unpublished destinations are absent rather
than announced.

**No advertising.** It earns almost nothing at this scale and costs the reading experience.

**No commerce framework, CRM, popup, newsletter modal, or anti-download script.** Phase 9 added zero
dependencies.

**No page per photograph.** 485 thin pages would be programmatic SEO and would dilute the pages that
are genuinely strong.

## Issue found and fixed

Two owner-rejected photographs were still sitting in `src/assets/photos/` as **renamed** editorial
derivatives — the Phase 7 rejection as `water-portrait.jpg`, and a shawarma rejection as
`bw-stall.jpg`. Neither was referenced by any page, so public references were genuinely zero, but
both were one import away from returning.

The Phase 8.45 verifier could not have caught them: it did not scan `src/assets` and matched by
filename, which renaming defeats. Both files were deleted (masters preserved) and the verifier now
compares that directory against the rejected masters **by image content**, so a rejected frame
cannot hide under any filename. Proven by planting a renamed copy and confirming the failure.

## Status

| | |
| --- | --- |
| PUBLICATION | **READY** |
| STUDIO | **READY** |
| LICENSING | **READY** — enquiry architecture safe; 0 photographs claim clearance |
| PRINTS | **FOUNDATION ONLY** — shortlist internal, no public route |
| FIELD NOTES | **FOUNDATION ONLY** — architecture verified, corpus empty |
| AFFILIATE | **FOUNDATION READY / NOT ENABLED** |
| ANALYTICS | **OWNER CONFIG REQUIRED** — bridges implemented, dormant |
| SEARCH CONSOLE | **OWNER CONFIG REQUIRED** |
| DOMAIN | **OWNER DECISION REQUIRED** |
| LEGAL | **OWNER DATA REQUIRED** — Impressum and privacy policy blocking for a DE/EU launch |
| DEPLOYMENT | **READY** — pending domain, `SITE_URL`, `PUBLIC_CONTACT_EMAIL` |

## Money path

1. **Fastest to first revenue — Studio.** Independent of traffic. One hospitality commission exceeds
   a year of advertising at this scale. Bottleneck is outreach, not software.
2. **Lowest maintenance — Licensing.** The photographs already exist; a licence is an email and an
   invoice.
3. **Best long-term upside — Studio compounding into Editions.** Commissions generate referrals and
   new portfolio work; editions convert archive depth into a second income from work already made.
4. **Best brand fit — Licensing and Editions.** Both treat the photograph as the product, which is
   what a photographic publication should earn from.

No revenue forecasts are given: there is no traffic or conversion history to base one on.

## Owner blockers

Domain · public enquiry email · legal identity for the Impressum · privacy policy. Full list with
context in [PHASE-9-OWNER-ACTION-QUEUE.md](PHASE-9-OWNER-ACTION-QUEUE.md). None are software
failures — the site builds, validates and runs correctly without them, and simply hides the paths
that would otherwise make promises it cannot keep.

## Documentation

| Document | For |
| --- | --- |
| [How ELSEWHERE makes money](PHASE-9-HOW-ELSEWHERE-MAKES-MONEY.md) | **Read this first.** Plain language, no jargon |
| [Owner action queue](PHASE-9-OWNER-ACTION-QUEUE.md) | Everything waiting on you |
| [Domain owner guide](PHASE-9-DOMAIN-OWNER-GUIDE.md) | Getting live, step by step |
| [Search Console setup](PHASE-9-SEARCH-CONSOLE-SETUP.md) | Being found |
| [Legal launch checklist (DE/EU)](PHASE-9-LEGAL-LAUNCH-CHECKLIST-DE-EU.md) | What needs a professional |
| [90-day growth plan](PHASE-9-90-DAY-GROWTH-PLAN.md) | What to actually do, 3–5 h/week |
| [Studio outreach system](PHASE-9-STUDIO-OUTREACH-SYSTEM.md) | Finding the first client |
| [Revenue roadmap](PHASE-9-REVENUE-ROADMAP.md) | Channel ranking and sequence |
| [Print edition shortlist](PHASE-9-PRINT-EDITION-SHORTLIST.md) | 12 candidates for Edition 01 |
| [Business architecture](PHASE-9-BUSINESS-ARCHITECTURE.md) | How it is built (technical) |
| [Image SEO and search opportunity](PHASE-9-IMAGE-SEO.md) | Discovery strategy (technical) |
| [Stock syndication strategy](PHASE-9-STOCK-SYNDICATION-STRATEGY.md) | Why not to, and rules if ever |
| [Final QA](PHASE-9-FINAL-QA.md) | Everything that was verified |

## Principle

A visitor comes for the photographs. They discover a world. A professional recognises that whoever
made this can photograph, edit and build — and gets in touch. Someone else wants to use a
photograph, and licensing is clear and honest. The publication stays beautiful; the business grows
around it.

Nothing in this phase pressures anyone. That is the point.
