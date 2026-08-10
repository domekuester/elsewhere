# Phase 8 — Independent Creative Director Audit (Claude)

Date: 10 August 2026
Method: full repository read (AGENTS, PRODUCT, Phase 5–7.5 documentation, source, catalog data) plus rendered browser audit of the running site at 1600, 1440-equivalent, 1024, 768, 390 and 320, including the immersive viewer, mobile navigation, keyboard interaction and the 404 page. Owner-rejected image exclusions were re-verified against the public catalog, derivatives and `dist/`.

---

## EXECUTIVE SUMMARY

ELSEWHERE is real. The site has an authored visual identity — the condensed-caps/italic-serif tension, the ultramarine memory-mark, the ivory/obsidian alternation, honest metadata as brand voice — and the strongest single decisions (the hero, the People spread, the native-scroll repair, the viewer geometry) are flagship-grade. The photography at the top of the edit is genuinely good and generally well served.

What stands between the current site and an exceptional one is not design taste. It is **follow-through at the edges**: a broken destination layout that Phase 7's B&W additions silently caused, an archive filter system that promises a taxonomy the data cannot deliver, internal process language leaking into public copy, heavy reuse of the same photographs across surfaces, and a typography system that quietly collapses on every non-Apple device. None of these are redesign problems. All of them are finishing problems.

**OVERALL SCORE: 72 / 100** — a strong publication one disciplined pass away from launch quality.

---

## CATEGORY SCORES

### A — FIRST IMPRESSION · 78/100

The first viewport works. The La Réunion cirque photograph is a legitimate hero: scale, weather, depth, no tourist landmark. "THE WORLD, / *as I remember it.*" — poised condensed caps against a lowercase italic serif — is the single most identity-defining typographic move on the site, and the enlarged italic *I* is a genuinely fine detail. Navigation is quiet and confident. The photograph is never fought.

What holds it back:
- The vertical "Scroll" cue is broken: the `↓` glyph inside `writing-mode: vertical-rl` rotates with the text and renders pointing **sideways (left)**. A first-viewport bug on every desktop visit.
- `Visual archive / 2024—ongoing` at 0.68rem bottom-right is close to invisible; either give it a purpose or let the corner be silent.
- The wordmark's `mix-blend-mode: difference` produces a half-legible "ELSEWHERE" over bright cloud on this particular hero — acceptable behavior, but it wobbles on exactly the frame most people see first.
- On mobile the fixed solid header bar amputates the hero's top edge; the image never owns the full screen.

Memorable tomorrow? The title treatment, yes. The composition, mostly.

### B — PHOTOGRAPHIC EDIT · 72/100

The 17-frame homepage edit is authored, not automated — the human/environment, large/intimate, color/monochrome rhythm is real, and the strongest frames (market woman, kitchen chefs, cirque hero, doorway man) hold the strongest positions.

Weaknesses a photo editor would flag:

1. **Same-visit repetition.** The market woman appears on Home, People (implied) and as the B&W collection opener. The kitchen-chefs frame appears on Home *and* the People page. Tokyo street, the ocean pair, and the shell all reappear in the Japan chapter. With a 500-frame public archive, a visitor who clicks two links sees the homepage again. Repetition is the single biggest tax on perceived archive depth.
2. **The Ayutthaya Buddha head** (Jungle world) is one of the most-photographed motifs in Southeast Asia. It is technically fine and emotionally generic — the only frame on the homepage a stock library could supply. The jungle world deserves a frame only this photographer has.
3. The homepage runs **two La Réunion ridge-and-cloud beats** (hero + "Some places resist categories") — the same emotional note struck twice on one page.
4. The lagoon-sunset story image is at the saturation ceiling; the silhouetted leaves and wading figure rescue it, but it sits one notch from postcard.
5. Portrait/landscape balance in the archive (383/115) is a fact of the shooting, not a flaw — but the edit surfaces could counterweight with more landscape anchors.

### C — HOMEPAGE SEQUENCE

Read as a book: opening (hero) → premise text spread → five-world portfolio → human anchor → small pause (shell) → expansion (cirque #2) → monochrome room → place index → story marker → ocean → closing trio → footer invitation.

The arc is right. The problems are local:

| Frame / beat | Verdict | Note |
| --- | --- | --- |
| Hero | **KEEP** | Protected. |
| Premise spread | **KEEP** | Best copy on the site. Right column needs anchoring, not rewriting. |
| Worlds 01–05 | KEEP / **REPLACE one** | Replace the Buddha head (Jungle). Fix the 1024 label collision. |
| People spread | **KEEP** | Protected. |
| Shell pause | **KEEP** | The quietest and most personal beat on the page. |
| Environment ("resist categories") | **MOVE / REPLACE** | Duplicates the hero's motif. Either a different environment type (jungle interior, weather, urban scale) or cut — the page is stronger by one beat. |
| Monochrome room | **KEEP** | Trim the trailing dead space before Destinations. |
| Destination index | **KEEP** | |
| Story feature | **REPLACE COPY** | The photograph can stay; the visible "story context is still being written… marker for the future journal format" copy must go. It breaks the spell more than any visual flaw on the site. |
| Ocean chapter | **KEEP** | |
| Closing trio | **KEEP** | Boxing-gloves crop (4:5 of a tight frame) is the weakest of the three; acceptable. |

Could 20% be removed and the page get stronger? Yes — the environment section and the story-feature paragraph are that 20%.

### D — TYPOGRAPHY · 74/100

On macOS/iOS this is an 85: Avenir Next Condensed vs. Baskerville italic is a distinctive, expensive-feeling pairing that avoids every 2026 webfont cliché, tracking is disciplined (correctly capped at −0.04em), the italic *Archive* title is seductive, and the destination serif index is the best single type moment after the hero.

The structural problem: **the entire identity is built on fonts that only ship on Apple platforms.** On Windows and Android the display stack falls to Arial Narrow/Arial and the editorial stack to Georgia. The brand's most recognizable asset — the hero pairing — silently degrades for roughly half of real-world visitors, and nobody QA'd that rendering. A publication with print ambitions cannot have its typography be an accident of the reader's operating system. Either license/subset a webfont pair that matches the intent (a condensed grotesque + a Baskerville-class serif, ~60–90KB woff2 total) or art-direct and screenshot-test the Windows fallback stack deliberately.

Minor: the People page h1's `max-width: 8ch` forces "PEOPLE I / MET / ALONG THE / WAY." — a ragged, unbalanced four-line stack at desktop widths (the homepage's two-line break of the same phrase is correct). Viewer metadata `text-transform: capitalize` produces "Black And White".

### E — SPATIAL COMPOSITION · 70/100

The ivory/obsidian alternation and the staggered 12-column image placements create genuine editorial rhythm. Silence mostly reads as intent.

Where it reads as unfinished instead:
- **Premise right column**: two short lines float in a half-viewport of ivory with no baseline relationship to the serif block. Anchor them (baseline-align to the last serif line, or move to bottom-right of the section) and the spread closes.
- **Monochrome room exit**: several hundred pixels of pure black between the wide horizon frame and the Destinations index — dead, not quiet.
- **B&W collection**: staggered top-margins of 14–22rem at 1600px leave whole viewports that are 80% empty with one small frame; the room feels under-hung rather than spacious (see F).
- Destination index rows: name left, count far right across ~700px of nothing — the pair dissociates at 1600.

### F — BLACK & WHITE · 74/100

The re-edit is a real improvement and a real room: lighthouse threshold → presence → distance → threshold → release → city → light → attention → stillness is an intelligible emotional sequence with genuine tonal range. The lighthouse hero with the giant BLACK & WHITE is the strongest page opening after Home. Single-word captions (Presence, Distance, Stillness) are exactly right.

Ruthless notes:
- **Strongest**: lighthouse (P1260122), market woman (IMG_0442), doorway man (P1240815), taxis (P1260426).
- **Weakest as rendered**: *Toward light* (P1250928) — a mostly-black frame displayed at ~24vw reads as an empty rectangle; it needs either large scale or removal. *Upward* (P1260472-2) is the most ordinary frame in the set (person raising a phone in a crowd — closer to reportage filler than to the room's standard).
- The 9-frame hang across ~5.5 viewports of near-black is thin. Either tighten spacing by roughly a third, or (better) extend the edit — Phase 7 reviewed 58 candidates and selected 8; the unpromoted candidates should be re-reviewed for 3–5 additions before the spacing is tightened.
- The market woman opening the collection is her third appearance on the site; the room's first human note is a rerun.
- Homepage alt text for the lighthouse ("A solitary figure at the edge of a grey sea") describes a different reading than the image (breakwater + lighthouse); the alt is wrong, or at minimum wishful.

A special room within ELSEWHERE? Yes — the only category page that already feels like an exhibition. It needs more pictures on the wall, not more design.

### G — PEOPLE · 62/100

The *idea* — encounters not profiles, no invented biography — is the most ownable editorial position ELSEWHERE has. The homepage People spread is the best composed section on the site. The vendor hero on the People page is strong.

But the page cannot cash the check the site writes. "Enter the people archive" leads to **four photographs**, one of which (kitchen chefs) the visitor just saw on the homepage. The archive's People filter yields **two frames out of 500**. People is currently a beautiful door into a nearly empty room. It doesn't need redesign — it needs 8–15 more reviewed, consent-conscious frames sequenced with the same care as B&W, and until that edit exists, the language should promise less ("A first set of encounters") so the thinness reads as deliberate seriality rather than shortfall.

### H — DESTINATIONS · 55/100

The index itself is excellent — serif place names at scale, ultramarine numbering, honest counts, no thumbnails. It reads as editorial discovery, not a travel site. Treating unpublished destinations as unlinked entries is honest and correct.

The Japan chapter — the only open chapter, the flagship — fails on four counts as rendered:

1. **Broken layout (P0)**: the CSS defines `destination-frame-1…4` only; Japan's manual order now contains 10 sequence frames, so frames 5–10 (the Phase-7 B&W additions) render as **95px postage stamps** with wrapped captions in auto-placed grid cells. This is the single most damaging visible defect on the site, on its most important deep page.
2. **The hero crop kills the photograph**: P1230676's meaning is the silhouetted passengers looking down at the churning water; at 100svh with `object-position 50% 43%`, the people are cropped away, leaving noisy abstract water — and no Japan signal whatsoever for a chapter opener.
3. **Reused inventory**: of the first five frames, four (Tokyo street, ocean current, shell, plus the hero itself) already appeared on the homepage. 216 confirmed Japan frames exist; the chapter that should prove archive depth instead proves recycling.
4. **Chapter identity drift**: with six B&W frames appended, the "Japan" chapter is now majority-monochrome — it reads as a B&W annex, not a place.

Does each destination reward clicking? Japan currently punishes it. That inversion — strongest archive, weakest deep page — is the core destination problem.

### I — ARCHIVE · 68/100

Right instincts throughout: the italic *Archive* title, the "500 frames" counter, curated/depth interleaving so the opening 24 are strong, contact-sheet numbering with ultramarine indices, incremental loading, "Another frame" as a delight affordance, `content-visibility` for depth. It feels like ELSEWHERE, not a dump.

Failures:
- **The filter row is a broken promise.** People → 2 results. Urban → 1. Beaches → 1. Ocean → 3. A first-time visitor reads this as a bug or an empty site, not as "classification incomplete by design." Until classification coverage is real (even 150–200 frames), the world filters must not ship in this form.
- **478 of 500 alt texts are the identical generic sentence** — an accessibility and SEO hole the size of the archive itself.
- Thumbnails ship as single-resolution `<img src>` (no `srcset`): 641px portrait derivatives into 358px cells and 960px landscape derivatives into 611px cells are **under-resolved on every Retina display** (needs ~716px and ~1222px respectively). The Phase 7.5 "2×-DPR adequacy" claim holds for the viewer, not for the grid.
- Orientation filter and year filter work; destination pre-filter via `?destination=` works.

### J — IMAGE VIEWER · 82/100

The best-engineered surface on the site. Verified as rendered: full image always visible, original aspect ratio preserved, centered on both axes, viewer-role 3200px derivative selected, body scroll locked, scroll position restored on close, Escape/arrows/swipe all work, count and metadata are quiet and correct, mobile controls sit in the thumb zone without overlapping the caption. The blurred-thumbnail-to-decoded-full transition is the right idea and unobtrusive.

Gaps:
- **Focus restoration is broken**: the click handler passes the inner `<span class="archive-image">` — an unfocusable element — as the origin, so after Close the keyboard user is dumped at `<body>`. (Code: `archive.ts` line ~139.)
- The entry animation clips from the clicked frame — good — but closing has no exit relationship; it simply vanishes. A 200ms reverse would complete the "I entered the photograph" feeling.
- At 500 items the count reads "01 / 500" with two digits vs three ("008 / 500" in labels) — trivial inconsistency between grid labels (3-digit) and viewer counter (2-digit minimum).

"Did clicking increase the photograph's value?" Yes. This is a room, not a modal.

### K — IMAGE FIDELITY · 72/100

The Phase 7.5 pipeline repair is real where it was aimed: viewer and hero surfaces use 3200px q90 4:4:4 derivatives, ICC intact, no upscaling, and spot checks at 2× show genuinely sharp results. Homepage Astro-processed images ship proper `srcset`.

Remaining fidelity debt:
- Catalog-driven `<img>` elements (archive grid, destination sequences, destination heroes) have **no `srcset`/`sizes`** — one fixed derivative per role regardless of viewport or DPR. Retina under-resolution in the grid (above) and oversized transfer on small screens both follow from this.
- The Japan hero pushes a noisy high-ISO frame to 100svh where the noise becomes texture-mush; that is an editorial-crop problem more than a pipeline problem, but it reads as "soft image" to a visitor.
- No visible compression banding, color shifts, or stretched thumbnails anywhere I opened. The core owner complaint from earlier phases is fixed.

### L — SCROLL FEEL · 88/100

Removing Lenis was the single best quality decision of Phase 7. The page is attached to the finger and the wheel; direction changes are instant; reveals trigger at 94% and finish in under a second; nothing is pinned, nothing scrubs. It feels like a fast publication, not a demo reel. Native scrolling should be considered protected and non-negotiable.

Docked points: the once-only clip reveals occasionally fire late when scrolling very fast upward-then-down (minor), and anchor jumps (`#premise`) are instant rather than eased — fine, arguably correct.

### M — MOTION · 80/100

Discipline is the signature: short one-time reveals, a 420ms viewer entry, hover scale at 1.018–1.025, underline transforms, and nothing else. Reduced-motion delivers complete composed pages. Nothing needs deleting; motion is already edited.

What's missing is one **owned** motion idea — every current move is tasteful-generic. The clip-from-frame viewer entry is the closest thing to a signature; completing its exit (J) and letting the memory-mark's scaleX draw be the *only* scroll-triggered non-image motion would give the system a recognizable grammar. Do not add more motion; sharpen what exists.

### N — MOBILE · 76/100

Mobile is genuinely authored: per-section width/order overrides, alternating alignment in the archive's single column, authored B&W order with 68–92% widths, focal-point object-positions, thumb-zone viewer controls, a correct full-screen menu with focus containment. No horizontal overflow at 390 or 320. This is far above template mobile.

Costs:
- The fixed solid header bar (rgba .94) sits on top of every page; the hero and B&W hero never own the top 78px. A transparent-to-solid-on-scroll header would return the full first screen to the photograph.
- Menu-open steals focus to the first link, painting a full-width focus ring on touch — correct for keyboard, noisy for touch; scope the visible ring to keyboard modality.
- At 320 some staggered frames drop to ~68% width (≈218px) — the pause-rhythm survives, but detail frames at that size lose their content; consider a 78% floor at ≤360.
- The dark header + ivory archive page combination is the one place mobile chrome fights the art direction.

### O — BRAND DISTINCTIVENESS · 75/100

Cover the wordmark and ELSEWHERE is still recognizable — that is passing the hardest test. Three most distinctive elements:
1. The condensed-caps + italic-Baskerville tension (hero, People, Archive titles).
2. The ultramarine system: memory-mark dashes, indices, selection color, the single accent used as punctuation, never decoration.
3. The honest-metadata voice ("Place unconfirmed", counts, "chapter open / in edit") — no other travel-photography site talks like this.

Three most generic elements:
1. Giant uppercase condensed section headings on every section — scale as a default rather than an event.
2. The dark-photo-site family resemblance (obsidian + full-bleed + thin nav) shared with every premium portfolio.
3. The editorial-link ("Label →") pattern repeated identically everywhere.

The identity is real but rented from system fonts (see D) — securing the typography is securing the brand.

### P — EMOTIONAL IMPACT · 72/100

What stayed with me: the market woman's guarded face; the doorway man; the kitchen chefs' split-second glance; the shell pause ("A small thing. It stayed." is the best sentence on the site). The premise spread creates genuine expectation, and B&W changes the temperature as intended.

What breaks the spell: reaching the story feature and reading production notes about a "future journal format"; opening Japan and seeing the homepage again plus broken thumbnails; filtering to People and finding two frames. Every one of these moments converts a *world* back into a *website*. The emotional ceiling of ELSEWHERE is high; the floor is where the process shows.

### Q — EDITORIAL VOICE · 64/100

Beautiful lines: "Not a guide. Not a list. Just places that stayed." / "A small thing. It stayed." / "Colour leaves. Attention remains." / "Encounters, not profiles." / the 404's "This path went somewhere else."

Marked for revision (process register leaking into public voice — the site's biggest copy problem):
- "Story context is still being written. The photograph remains here as a marker for the future journal format." (Home)
- "This opening chapter shows only the existing editorial selection." / "Country confirmed by the owner's travel timeline. Cities and regions remain intentionally unassigned." (Japan — the *fact* is good brand, the *phrasing* is CMS documentation)
- "Working title." (footer, every page)
- "Editorial edit · developing" ×4 (Collections index roadmap list)
- "Classification remains incomplete by design; only confirmed editorial assignments are shown." (Archive — right idea, database phrasing)
- "confirmed frames · editorial review" (Destinations index — "confirmed" is internal QA vocabulary)

None of this needs *more* words; it needs the internal register translated into the site's own laconic voice.

### R — PERCEIVED PERFORMANCE · 85/100

Hero arrives immediately (eager + fetchpriority + proper srcset); everything below folds in lazily; JS is minimal and deferred; no font-swap flash is possible (system fonts — the one upside of D); no layout shift observed (dimensions everywhere); archive renders 24 and grows on demand; the viewer's preview-then-decode masks large-file latency. No jank found while scrolling any audited page. Console is clean.

### S — ACCESSIBILITY

Integrated foundations are genuinely good: skip link, semantic landmarks and heading order, native `<dialog>`, focus containment in the mobile menu with inert handling, Escape paths, visible ultramarine focus rings, reduced-motion completeness, correct `aria-pressed`/`aria-expanded`/`aria-live` usage.

Material problems:
1. **478 identical generic alt texts** in the archive (and every unclassified frame everywhere) — for a photography site, alt text *is* the non-visual product.
2. **Viewer close returns focus to `<body>`** (unfocusable span passed as origin) — keyboard users lose their place in a 500-item grid.
3. Archive frames are `<button aria-label="Open frame N">` — the number is announced but the photograph's content is not (inherits problem 1).
4. Menu-open focus ring on touch (modality noise, minor).
5. Viewer next/prev at 0.68rem/3rem targets pass size, but the mobile caption truncates long destination text with no wrap allowance (cosmetic).

### T — PREMIUM BRAND VALUE · 70/100

The design increases perceived value: it reads as an independent publication with print sensibility, and Japan/La Réunion material could carry editorial collaborations, prints and a book. SEO plumbing (canonicals, schema, sitemap, share images) is already professional.

What currently reduces trust for a partner or editor arriving cold: the broken Japan layout (looks unmaintained), near-empty filters (looks abandoned), "Working title" / "developing" copy (looks unfinished), and typography that collapses on their Windows laptop (looks cheap through no fault of the design). Every one of these is fixable without adding a single feature. Do not add monetization surfaces before these are gone.

---

## ABSOLUTE DESIGN TEST — deliberateness ledger

- Scroll cue arrow points left (writing-mode rotation) — hero, all desktop widths.
- `world-4` negative margin collides with the Beaches caption around 1024px.
- Japan frames 5–10 at 95px (unstyled grid overflow).
- People page h1 four-line rag from `max-width: 8ch`.
- Viewer counter zero-padding (2-digit) disagrees with grid indices (3-digit).
- `text-transform: capitalize` produces "Black And White" in viewer meta and destination captions.
- Homepage lighthouse alt text describes the wrong subject.
- Focus ring painted on touch menu open.
- Monochrome-room trailing dead space before Destinations.
- Footer "Working title." on every page.
- Mix-blend wordmark half-legible over bright hero cloud.
- Premise right column vertically unanchored.

## THE 20-WEAKNESS TEST

| # | Priority | Weakness |
| --- | --- | --- |
| 1 | **P0** | Japan destination sequence frames 5–10 render as 95px postage stamps (CSS supports only 4 frames; Phase-7 B&W additions overflow). |
| 2 | **P0** | Archive world filters expose an empty taxonomy: People=2, Urban=1, Beaches=1, Ocean=3 of 500 — reads as a broken site. |
| 3 | **P1** | Brand typography exists only on Apple platforms; Windows/Android fall to Arial/Georgia with no art-directed fallback or webfont. |
| 4 | **P1** | Internal process language published as site copy (story marker, "Working title", "developing", "confirmed frames", "opening chapter shows only the existing editorial selection"). |
| 5 | **P1** | Cross-surface image reuse (market woman ×3; chefs, Tokyo street, ocean pair, shell each ×2 including Japan) makes a 500-frame archive feel like 20 photographs. |
| 6 | **P1** | 478/500 archive photographs share one generic alt text. |
| 7 | **P1** | Viewer close does not restore focus (unfocusable span passed as origin). |
| 8 | **P1** | Japan hero crop removes the photograph's human subject and any place signal; noisy abstract water at 100svh; duplicates homepage Ocean image. |
| 9 | **P1** | Catalog-driven images ship without `srcset`: Retina under-resolution in the archive grid, oversized transfers on mobile. |
| 10 | **P1** | Hero scroll cue arrow renders sideways in vertical writing mode. |
| 11 | **P2** | People page depth (4 images, one homepage repeat) contradicts "Enter the people archive". |
| 12 | **P2** | Homepage environment section repeats the hero's ridge-and-cloud beat. |
| 13 | **P2** | B&W room hangs 9 frames across ~5.5 near-empty viewports; *Toward light* illegible at 24vw; *Upward* below the room's standard. |
| 14 | **P2** | Worlds label collision at ~1024 (`world-4` −2rem margin over Beaches caption). |
| 15 | **P2** | Buddha-head frame is the one stock-replaceable photograph on the homepage. |
| 16 | **P2** | Homepage lighthouse alt text mismatched to image content. |
| 17 | **P2** | Premise right column and destination-index counts float unanchored across wide gaps. |
| 18 | **P2** | People h1 `8ch` cap produces a broken four-line rag on desktop. |
| 19 | **P3** | Collections "future collections · developing" roadmap list on a public page. |
| 20 | **P3** | Viewer counter padding inconsistency; "Black And White" capitalize artifact; touch focus-ring flash on menu open; mobile header bar covering hero top. |

## THE 10-STRENGTH TEST — PROTECTED

1. **Hero photograph + title pairing** — the identity in one screen; do not touch the type treatment.
2. **Homepage People spread** (market woman + "People I met along the way.") — the site's emotional center of gravity.
3. **Viewer geometry and state engineering** — contain, center, 3200px role, scroll lock/restore, keyboard/swipe. Fix focus only.
4. **Native scrolling** — the Phase 7 repair is the foundation of the premium feel. Never reintroduce smoothing.
5. **Destination index typography** — serif place names + ultramarine numerals + honest counts.
6. **Archive intro & interleaved opening edit** — italic *Archive*, 500-frame counter, curated-first ordering.
7. **B&W lighthouse hero page opening** — the strongest category threshold on the site.
8. **The premise spread copy** — "Not a guide. Not a list. Just places that stayed."
9. **The ultramarine memory-mark system** — one accent, used as punctuation; keep it scarce.
10. **Motion restraint + reduced-motion completeness** — the discipline itself is the signature.

## DELETE / SIMPLIFY LIST

- Delete the story-feature paragraph ("still being written… future journal format"); keep the photograph with a one-line caption, or hold the section until a story exists.
- Delete "Working title." from the footer.
- Delete the future-collections roadmap list (Ocean/Night/Movement/Details "developing") from `/collections/`.
- Remove (not fix) the near-empty world filter buttons until classification coverage exists; keep Year / Frame / Place, which work.
- Delete or replace the environment section's duplicate mountain beat.
- Delete the six overflow B&W frames from Japan's manual order (they belong to the B&W room) rather than styling ten frames.
- Simplify "confirmed frames · editorial review" to the site's own voice ("216 photographs · open" / "in edit").

## PHASE 8 RECOMMENDED CHANGES

See `docs/PHASE-8-CLAUDE-RECOMMENDED-ACTIONS.md` for the full prioritized plan with effort and risk. Headline order: repair Japan (layout + hero + reuse), retire the empty filters, purge process copy, restore viewer focus, secure typography across platforms, add `srcset` to catalog images, then the P2 sequence-and-spacing refinements.

---

## FINAL PHASE 8 VERDICT

**ELSEWHERE CURRENT LEVEL:**
A genuinely authored premium publication at roughly 72/100 — flagship-grade at its center (hero, People, viewer, scroll feel), undermined at its edges by one broken flagship page, empty-promise filters, leaked process language, and platform-fragile typography.

**STRONGEST QUALITY:**
Editorial identity under restraint — the condensed/italic type tension, the ultramarine punctuation system, and a viewer + native-scroll foundation that treats photographs as the product.

**BIGGEST WEAKNESS:**
Depth surfaces don't reward the click: Japan is visually broken and recycled, People is four images, and the archive's filters advertise a taxonomy that doesn't exist yet.

**HIGHEST-IMPACT CHANGE:**
Rebuild the Japan chapter as rendered — fix the 95px frame overflow, choose a hero crop that keeps the photograph's subject (or a different hero), and replace homepage repeats with unseen frames from the 216 available. One page, and the site's deepest journey stops contradicting its promise.

**MOST IMPORTANT THING NOT TO TOUCH:**
Native scrolling and the immersive viewer's geometry — and the hero's typographic treatment.

**IS THE SITE READY TO LAUNCH VISUALLY?**
**ALMOST.** The P0s (Japan layout, empty filters) and the copy purge are launch blockers; everything else is refinement.

**IS A CLAUDE IMPLEMENTATION PASS RECOMMENDED?**
**YES.** Scope for the pass, in order:
- P0-1: Japan sequence layout repair + hero art direction + de-duplication against Home.
- P0-2: Retire/gate the empty world filters in the Archive.
- P1-4: Public copy purge (story marker, "Working title", "developing", data-speak phrasing).
- P1-7: Viewer focus restoration (pass the button, not the span).
- P1-10: Scroll-cue glyph fix.
- P1-3: Typography fallback decision (webfont pair or art-directed non-Apple stack) — decision needed from owner on licensing appetite before implementation.
- P1-6 / P1-9 (batched, mechanical): alt-text generation strategy for the archive + `srcset` on catalog-driven images.
- P2 items only after the above are verified in the rendered browser at all audited viewports.
