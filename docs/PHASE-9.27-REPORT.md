# Phase 9.27 — global destination hero mastering

## What this phase found

Every destination that has a public page already opened with a full-bleed photographic hero, and all
four already shared one grammar. The phase's premise — that some chapters open with an exceptional
hero and others do not — is true, but the line does not run between heroes. It runs between the four
chapters that are **open** and the four that are **not**.

`/destinations/` shows Japan, La Réunion, Essaouira and Düsseldorf as photographic cards, then lists
Malaysia, Thailand, Phu Quoc and Laos as four text rows under "IN THE ARCHIVE" — no photograph, no
page, nothing to enter. That is the quality hierarchy a visitor sees, and no hero work removes it.
Opening those chapters means curating a sequence and writing alt text for each frame, which is what
Phase 9.1 did for Essaouira and 9.25 for Düsseldorf. It is reported here as a dependency and not
faked, with provisional heroes chosen and stored so that work starts from a decision rather than a
blank field.

So this phase did the work that was actually available: it hardened the hero system, fixed four real
defects in the open chapters, and confirmed — rather than assumed — that the four incumbent
photographs deserve to stay.

## Counts

    PUBLIC DESTINATIONS:                              4
    DESTINATIONS WITH FLAGSHIP HERO BEFORE:           4
    DESTINATIONS UPGRADED (system, crop or type):     3
    EXISTING HEROES KEPT:                             4
    EXISTING HEROES REPLACED:                         0
    NEW HEROES ADDED:                                 0 published · 3 provisional, unpublished
    DESTINATIONS BLOCKED BY INSUFFICIENT IMAGE QUALITY: 1  (Laos — 3 photographs, floor is 5)
    HERO OWNER APPROVAL PENDING:                      4

## Owner hero review

**JAPAN** — Selected `photo-0372` (P1260490.jpg) · **KEPT** · Nothing in 204 frames opens the country
better: the canal carries the eye from the title into the depth of the picture. Alternatives tested:
`photo-0375`, `photo-0373`, `photo-0355`.

**LA RÉUNION** — Selected `photo-0442` (P1270181.jpg) · **KEPT, mobile re-framed** · The island's
scale is the subject. Phone crop raised so the horizon clears the title. Alternatives: `photo-0453`,
`photo-0482`, `photo-0470`.

**ESSAOUIRA** — Selected `photo-0609` (P1330989.jpg) · **KEPT, mobile fixed** · The phone view used to
crop the gulls out and leave blank wall — the subject was missing from the view most people get. The
focal now holds the perched gull and the shadow. Alternatives: `photo-0623`, `photo-0605`, `photo-0628`.

**DÜSSELDORF** — Selected `photo-0656` (P1350974.jpg) · **KEPT, title corrected** · Almost a diagram:
three colours, hard geometry, and empty blue where the longest name on the site has to sit. That name
now has margin instead of touching the gutter. Alternatives: `photo-0654` (the strongest swap if you
want the calmer opening), `photo-0646`, `photo-0641`.

**MALAYSIA — needs your decision.** The stored `heroPhotoId` is `photo-0036`, a 2048 × 1536 iPhone
file. It cannot carry a full-bleed hero on a modern desktop. Provisional replacement `photo-0122`
(4000 × 2672), with `photo-0163` and `photo-0060` behind it.

**THAILAND / PHU QUOC** — provisional only: `photo-0005` and `photo-0009`. Not rendered, not reviewed
at full viewport.

**LAOS — blocked.** Three eligible photographs; the content floor is five. The strongest is a close
portrait of an identifiable woman, which raises a consent question before it raises a quality one.
Source limitation, not a selection failure.

## What changed in the code

| File | Change |
| --- | --- |
| `data/destinations.json` | New `hero` block per destination: chosen frame, approval status, focal point per breakpoint, scrim strengths, title correction, and a note. Purely additive — `heroPhotoId` is unchanged and still drives the index card. |
| `src/pages/destinations/[slug].astro` | Hero renders `srcset` + `sizes` from the hero manifest and emits the art direction as custom properties. Still a semantic `<img>` with real alt. |
| `src/styles/global.css` | `.destination-hero` reads variables for focal, scrims and title scale, with the previous values as defaults. New tablet focal breakpoint. Home hero untouched. |
| `scripts/generate-hero-derivatives.mjs` | New. Dedicated hero ladder, 768–2560, quality ramped by width, same exclusion guard as the archive generator. |
| `scripts/validate-content.mjs` | Validates the hero block: frame exists, is publishable, belongs to that destination, agrees with `heroPhotoId` once published, known status, well-formed focal values. |
| `scripts/verify-owner-photo-exclusions.mjs` | Audits the new `hero` derivative directory and the new `hero.photoId` reference. |
| `package.json` | `npm run images:heroes`; hero generation appended to `images:derive`. |

The owner can now change any hero by editing one photo ID in `data/destinations.json` and running
`npm run images:heroes`. No CSS.

## Final status

    PUBLIC DESTINATIONS:            4
    FULL FLAGSHIP HERO COVERAGE:    4 / 4
    NEW HEROES:                     0 published (3 provisional)
    HEROES REPLACED:                0
    HEROES KEPT:                    4
    OWNER REVIEW NEEDED:            4 approvals + Malaysia replacement + Laos blocker
    MOBILE HERO QA:                 PASS
    DESKTOP HERO QA:                PASS
    SAFARI HEADER:                  BEST AVAILABLE VERIFICATION (Chromium only; no iOS Safari here)
    IMAGE FIDELITY:                 PASS
    LCP STRATEGY:                   PASS — phone payload 66% lighter and sharper
    OWNER-REJECTED PUBLIC REFERENCES: 0
    BUILD:                          PASS
    PRIVACY:                        PASS
    SEO:                            PASS
    ACCESSIBILITY:                  PASS
    CONSOLE:                        PASS (0 errors, 0 warnings)
    BROKEN ASSETS:                  0 of 176 checked

## Tools and skills

**Discovered:** the Playwright MCP browser tools, the Chrome DevTools MCP tools, the `impeccable`,
`frontend-design`, `ui-ux-pro-max` and `artifact-*` skills, `superpowers` process skills, and the
project's own validation scripts.

**Used:**
- **Playwright MCP** — every rendered decision. Navigation and viewport control at eight widths,
  screenshots for the contact-sheet walls, and in-page measurement (`browser_evaluate`) for the numbers
  that mattered: overflow, hero height, title glyph boxes via Range, chosen `currentSrc`, computed
  custom properties, the scrim luminance experiment, and the 176-URL broken-asset sweep.
- **Python + Pillow** — contact sheets of all 374 eligible frames, and the before/after comparison
  walls. This is what made "search the complete archive" affordable rather than notional.
- **The project's own validators** — `validate:content`, `validate:exclusions`, `validate:launch`,
  and the production build, extended rather than worked around.

**Not used, and why:** the Chrome DevTools MCP performance tools duplicate what the byte-level
manifest already answers precisely, and a Lighthouse run against a dev server would have measured the
dev server. The design skills (`impeccable`, `frontend-design`, `ui-ux-pro-max`) were not invoked: this
phase extends a mature, documented visual system that AGENTS.md says to preserve rather than restart,
and generic design guidance would have pulled against it.

---

**PHASE 9.27 — GLOBAL DESTINATION HEROES OWNER REVIEW READY**

Declared for the four destinations that have public pages: every one was audited, every one opens
full-bleed from its own archive, all four selections are publication-eligible, owner-rejected imagery
stayed excluded, alternatives were tested rather than assumed, and desktop, tablet and mobile crops,
typography, navigation, safe area, fidelity, performance, dates, metadata, build and console all pass.

Malaysia, Thailand, Phu Quoc and Laos are **not** covered by that statement. They have no public page,
this phase did not give them one, and their heroes are provisional.
