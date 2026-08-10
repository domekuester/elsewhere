# Phase 9 — Owner action queue

Everything waiting on you. None of these are software defects — they are decisions and facts only
you can supply.

---

## New in Phase 9.2 — one photographic decision

### 0. Confirm or reverse 63 editorial holds
**Blocks:** nothing technical. It is the only judgement call in this phase that is genuinely yours.

A frame-by-frame review of the whole public archive withheld 63 photographs. They are **not
deleted**: masters are untouched and every hold is one deleted line away from being restored.

| Reason | Count | What they are |
| --- | --- | --- |
| Posed or social photographs of companions | 43 | Recognisable private people, no releases, holiday photographs rather than observed encounters |
| One hostel, documented | 16 | Dorm signage, lounge, grounds — a record of a stay |
| Near-duplicates | 4 | A stronger version of each is still public |

The register, with a reason on every frame, is `editorialHold[]` in
[data/public-image-exclusions.json](../data/public-image-exclusions.json).

**To restore any of them:** delete its entry from `editorialHold[]`, set that photo's `visibility`
back to `public` in `data/photo-curation.json`, run `npm run images:derive`, then `npm run build`.

If you disagree with any of these, say so and they come straight back. If you agree, nothing needs
doing — this is already how the site builds.

---

## Required before public launch

### 1. Public enquiry email address
**Blocks:** every enquiry path on the site.

Set `PUBLIC_CONTACT_EMAIL` in the Vercel environment. Until it is set, the Studio, Licensing and
About calls to action are not rendered, the viewer's licensing link is absent, and `/contact/` is
noindexed and unlinked.

Use an address you are happy to publish permanently and that can survive spam. A dedicated address
on your own domain is better than a personal one. **Do not** reuse a private address you would not
want scraped.

### 2. Domain
**Blocks:** canonical URLs, Open Graph previews, both sitemaps, Search Console.

Choose and register it yourself, then set `SITE_URL` to the full `https://` address with no trailing
slash. See [PHASE-9-DOMAIN-OWNER-GUIDE.md](PHASE-9-DOMAIN-OWNER-GUIDE.md). No domain has been
researched, suggested, or registered on your behalf.

### 3. Legal identity for the Impressum
**Blocks:** legal compliance in Germany/EU, not the build.

German law requires an Impressum with a real name, a physical address, and a contact method. This
cannot be invented or approximated. See
[PHASE-9-LEGAL-LAUNCH-CHECKLIST-DE-EU.md](PHASE-9-LEGAL-LAUNCH-CHECKLIST-DE-EU.md) — read it before
launching to a German audience.

### 4. Privacy policy
**Blocks:** legal compliance.

Depends on which analytics provider you choose (action 6) and where the site is hosted. Cannot be
written until those are decided.

---

### 4b. Five questions about Essaouira — still open from Phase 9.1
The Essaouira chapter is carried entirely by photographs because no owner text exists for it.
A few honest sentences would give it a voice. See
[PHASE-9.1-ESSAOUIRA-OWNER-STORY-QUESTIONS.md](PHASE-9.1-ESSAOUIRA-OWNER-STORY-QUESTIONS.md).
The same is now true of La Réunion, which became a chapter in Phase 9.2 with no written voice.

---

## Recommended before launch

### 5. Public creator name
Set `PUBLIC_CREATOR_NAME`. Without it, credit and copyright fall back to "ELSEWHERE" — which is
truthful but weaker for image search, where a named creator carries more weight. It also decides
whether structured data describes a `Person` or an `Organization`.

### 6. Analytics provider
Choose a privacy-conscious, cookieless provider — Plausible and Umami bridges are already
implemented and dormant. Set `PUBLIC_ANALYTICS_PROVIDER` and `PUBLIC_ANALYTICS_DOMAIN`. Leaving them
unset ships no tracking at all, which is a legitimate launch position.

---

## Required before licensing revenue

### 7. Rights review of frames people ask about
All 469 published photographs are currently `ENQUIRY_ONLY` — copyright yours, third-party rights not
yet assessed. Nothing claims commercial clearance, which is correct.

You do not need to review 469 photographs. Review the ones people actually enquire about, and set:
- `EDITORIAL_AVAILABLE` — fine for magazines, books, journalism
- `COMMERCIAL_CLEARED` — only when you hold the releases; validation rejects this while a release
  status is still `UNKNOWN`
- `RELEASE_REQUIRED` — recognisable person, private property, artwork or logo present
- `NOT_FOR_LICENSE` — never offer this frame

Edit `data/photo-curation.json`, then run `npm run build`.

### 8. Licensing fee position
Decide roughly what editorial and commercial use are worth to you before the first enquiry arrives,
so you are not inventing a number under pressure. Nothing is published on the site.

---

## Required before print sales

### 9. Approve the print shortlist
Review [PHASE-9-PRINT-EDITION-SHORTLIST.md](PHASE-9-PRINT-EDITION-SHORTLIST.md) and pick the frames
for Edition 01. Your call entirely; the shortlist is a starting point.

### 10. Print supplier, sizes, paper, prices
Order test prints before committing. A photograph that sings on screen can fall apart on paper.

### 11. Consumer-law obligations
Selling to EU consumers brings withdrawal rights, delivery terms, and VAT handling. Needs proper
advice — see the legal checklist.

---

## Optional, later

### 12. Field Notes
The architecture is built and empty. One genuinely good note is worth more than ten thin ones.

### 13. Affiliate accounts
Only after Field Notes exist and bring traffic. Never recommend anything you did not use.

### 14. Newsletter provider
No provider is integrated and no popup exists. A quiet footer subscription can be added when there is
something to send.

---

## Not blocking

Missing domain, missing legal details, missing print supplier and missing affiliate accounts are
**owner decisions**, not software failures. The site builds, validates and runs correctly without
them; it simply hides the paths that would otherwise make a promise it cannot keep.
