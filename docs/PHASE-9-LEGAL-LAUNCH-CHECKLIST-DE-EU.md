# Phase 9 — Legal launch checklist (Germany / EU)

**This is not legal advice.** It is a checklist of what needs deciding and who can decide it. No
legal text has been written or generated, because legal text containing invented details is worse
than no legal text.

**Production launch to a German or EU audience is BLOCKED until items 1–3 are supplied.**

---

## 1. Impressum — BLOCKING

German law (§5 DDG, formerly §5 TMG) requires a readily available imprint on business or
business-like websites. A photography site offering commissions, licensing and prints is firmly in
scope.

**Needs from you — cannot be invented:**

- Full legal name
- Physical address (a postal box is not sufficient; if you do not want your home address public,
  look into a *ladungsfähige Anschrift* service)
- Email address
- Telephone, or another means of "prompt electronic contact"
- VAT ID (USt-IdNr.) if you have one
- Trade register details if you register a business

**Practical note:** freelance photographers in Germany are often *Freiberufler*, which affects VAT and
registration. Whether commissioned photography plus web development counts as freelance or as a
trade (*Gewerbe*) is exactly the kind of question a *Steuerberater* answers in one conversation.

**Status:** no route exists. It will be created once you supply the details.

---

## 2. Privacy policy (Datenschutzerklärung, GDPR Art. 13) — BLOCKING

Must describe what is processed, why, on what legal basis, and by whom.

**What the site currently does — verified, not assumed:**

| | Status |
| --- | --- |
| Cookies | **None set by the site.** |
| Analytics | **None active.** No provider is configured; nothing leaves the browser. |
| Contact form | **No server endpoint.** Opens your own mail client. No data is transmitted to or stored by the site. |
| Fonts | **Self-hosted** in `/fonts/`. No Google Fonts request, so no US transfer from font loading. |
| External embeds | **None.** No YouTube, maps, or social widgets. |
| Server logs | Vercel, as hosting provider, logs requests including IP addresses. |

This is an unusually clean starting position. The two things that still need covering:

- **Vercel as processor.** You need a Data Processing Agreement (AVV) with Vercel and must name them
  as a processor. Vercel provides a standard DPA.
- **Email contact.** When someone writes to you, you process their data. Needs a paragraph.

**If you enable analytics (owner action 6),** the policy must name the provider, describe what is
collected, and state the legal basis. Choosing a cookieless, IP-anonymising provider such as
Plausible or Umami is what allows this to rest on legitimate interest rather than a consent banner —
but confirm the specific configuration with your advisor.

---

## 3. Cookie consent — currently NOT required

No cookies are set and no tracking is active, so no consent banner is needed today. **This changes
the moment you enable analytics, embeds, or a hosted form provider.** Do not add a banner
pre-emptively; it would be a dark pattern with nothing to consent to.

---

## 4. Copyright notice — DONE

The footer carries `© ELSEWHERE. All rights reserved. Original photography throughout.` Setting
`PUBLIC_CREATOR_NAME` replaces "ELSEWHERE" with your name, which is stronger for both copyright
assertion and image search. Every photograph also carries `creditText` and `copyrightNotice` in its
structured data.

---

## 5. Rights of people in photographs — REVIEW REQUIRED

Germany's *Recht am eigenen Bild* (KunstUrhG §22) is stricter than many jurisdictions. Publishing a
recognisable person generally requires consent, with exceptions for persons of contemporary history,
incidental presence in a scene, and public gatherings.

**What the site does:** 15 published photographs are flagged `RELEASE_REQUIRED`, and **no photograph
is offered as commercially cleared**. The publication treats itself as authored editorial work; the
licensing layer refuses to make commercial claims without confirmed releases.

**What needs your judgement:** whether any individual published portrait should be withdrawn. You
have already exercised this repeatedly — the owner exclusion register holds 24 photographs. The
mechanism works and is enforced at build time.

**Where the risk concentrates:** selling prints of recognisable individuals, and commercial
licensing. Both are gated. Neither is live.

---

## 6. Commissioned work — contracts

Studio commissions need written agreements covering usage rights granted, exclusivity, delivery,
payment terms, and cancellation. A photographer's professional body or a lawyer can supply a
template. Do not download a random one and hope.

---

## 7. If prints become purchasable — NOT YET APPLICABLE

Selling to EU consumers triggers: withdrawal right (14 days, with a specific exemption question for
made-to-order prints), *Widerrufsbelehrung*, T&Cs, delivery and payment terms, VAT handling and
possibly OSS registration. All of it needs advice. None of it applies while nothing is for sale —
which is one reason prints were deliberately not launched in Phase 9.

---

## 8. Affiliate disclosure — NOT YET APPLICABLE

German law requires clear labelling of paid links (*Werbung* / *Anzeige*). The component already
marks commission links and renders a disclosure block, but **the disclosure wording should be
reviewed before the first affiliate link goes live.** Nothing is live.

---

## Summary

| Item | Status |
| --- | --- |
| Impressum | **BLOCKING** — needs your legal identity |
| Privacy policy | **BLOCKING** — needs hosting/analytics decisions |
| Cookie consent | Not required today; revisit if analytics enabled |
| Copyright notice | Done |
| People's image rights | Mechanism in place; ongoing owner judgement |
| Commission contracts | Needed before first Studio project |
| Consumer/print law | Not applicable — prints not launched |
| Affiliate disclosure | Component ready; wording needs review before use |

**Recommendation:** one hour with a *Steuerberater* and one with a lawyer familiar with
*Fotorecht* will resolve items 1, 2 and 6 together and is worth doing before the first paid project,
not after.
