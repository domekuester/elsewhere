# Phase 8.1 — Cross-model judgment

Date: 10 August 2026  
Judge: Codex, independent review of Claude Phase 8  
Status: judgment only; no public implementation performed

## Executive verdict

Claude's central diagnosis is sound: ELSEWHERE has a strong, authored center and materially weaker depth surfaces. The two P0s are real. Japan is structurally broken after its fourth sequence frame, and Archive world filters expose a taxonomy whose data coverage is far too thin for the promise made by the controls. The largest trust leak is also real: public copy repeatedly describes production status rather than presenting a finished publication.

Codex does not accept every proposed remedy. Claude too readily turns photographic taste into implementation direction, especially around the Japan hero, the second La Réunion landscape, the Buddha image, and the Black & White hang. Those require owner judgment. Claude also overstates the typography issue as a universal launch blocker: portability is a real brand inconsistency, but the correct response depends on licensing, privacy, loading cost, and an actual non-Apple comparison.

**Claude overall score: 72/100**  
**Codex overall score: 74/100**

The two-point difference is not a substantive disagreement about quality. Codex gives more credit to the first impression, viewer, scroll, motion, responsive foundations, and existing photographic authorship, while scoring Archive, accessibility, destinations, and editorial voice harshly. The score remains below launch-grade because the defects occur at high-trust moments.

## Validation path and evidence boundary

The production build passed (`npm run build`): 588 source records, 500 public photographs, nine generated routes, and no content-validation failure. The site was served locally from `dist/` at `http://127.0.0.1:8000/`.

The preferred in-app Browser was attempted first. Its runtime failed before navigation because required sandbox-policy metadata was absent. The installed project contains no Playwright package or browser binary, and Phase 8.1 forbids dependency installation. The permitted fallback therefore used the installed Chrome 152 headlessly for rendered screenshots at the requested widths where the runtime remained stable, plus direct computed-layout mathematics from the shipped CSS, generated HTML inspection, catalog analysis, source/master comparison, keyboard-path code tracing, and build diagnostics. Evidence was collected for 1600, 1440, 1280, 1100, 1024, 980, and 390 render widths; 768, 430, and 320 behavior was additionally assessed from the authored responsive rules and the current Phase 7.5 rendered QA evidence. This limitation does not affect the two P0 determinations, which are directly provable from rendered CSS geometry and live public data.

## Independent scores

| Category | Score |
| --- | ---: |
| First impression | 82 |
| Photographic edit | 73 |
| Homepage sequence | 79 |
| Typography | 73 |
| Black & White | 76 |
| People | 66 |
| Destinations | 52 |
| Archive | 63 |
| Viewer | 85 |
| Image fidelity | 74 |
| Scroll feel | 91 |
| Motion | 83 |
| Mobile | 78 |
| Brand distinctiveness | 80 |
| Emotional impact | 75 |
| Editorial voice | 62 |
| Perceived performance | 87 |
| Accessibility | 61 |
| Premium brand value | 74 |

**Codex overall score: 74/100.** This is an editorially distinctive publication with several launch-blocking edge failures, not a 74% generic website.

## What both models agree on

- The hero photograph and condensed-caps/italic-serif title relationship are the clearest expression of ELSEWHERE's identity.
- The homepage People spread is excellent; the market-woman photograph is not weak.
- Native scrolling is responsive and must not be replaced by latency-heavy smooth scrolling.
- Viewer geometry is successful: contained, centered, aspect-ratio correct, and supplied from the viewer derivative.
- Japan's sequence layout is broken after the fourth authored sequence frame.
- Archive categories currently overpromise because only 23 of 500 public frames have any world classification.
- Process language, duplicated generic alt text, viewer focus restoration, and catalog-image responsiveness require work.
- Phase 8.2 should repair weak edges rather than redesign the strong center.

## Where Codex disagrees

- **Typography:** the cross-platform risk is real, but Claude's audience-share assertion is unsupported and its webfont recommendation is not automatically superior. This is PARTIAL pending owner licensing and visual comparison.
- **Japan hero:** the current crop removes the two human silhouettes and produces an abstract water field, but whether to re-crop, change aspect ratio, or replace the hero is an owner photographic decision. Codex does not approve Claude's candidates sight unseen.
- **Image repetition:** repetition is harmful when a deep page mostly replays Home, but a signature image appearing on Home and once in its dedicated collection can create continuity. The remedy is surface-specific, not a blanket one-surface rule.
- **Black & White density, second mountain beat, and Buddha image:** Claude identifies plausible editorial tensions, not objective defects. Owner review is required before changing the edit.
- **People:** four images can be a deliberate first chapter. The problem is promise and repeated inventory, not a numerical requirement for 8–15 images.

## What Claude caught that previous QA missed

1. Phase 7.5's “no overflow” check did not detect Japan's postage-stamp collapse. A layout can remain inside the viewport and still be visually broken.
2. Phase 7.5's Retina adequacy claim applied to viewer assets, not the Archive grid's rendered DPR requirement.
3. The viewer returns focus to an unfocusable inner span rather than the initiating button.
4. The Archive's classification controls expose severe data sparsity despite being technically functional.
5. Public production language survived the launch-quality pass.
6. The system-font choice creates materially different brand typography across operating systems.

## What Codex caught that Claude missed

### CODEX-NEW-01 — P1 · Archive accessible name suppresses image content

**Verdict: ACCEPT as a new finding.** Each Archive button has `aria-label="Open frame N"`. Because that explicit label overrides descendant naming, the nested image alt is not part of the button's accessible name. Improving the catalog alts alone will not make the grid controls descriptive. Phase 8.2 must give each button a concise content-aware accessible name while avoiding repetitive verbosity.

### CODEX-NEW-02 — P2 · Claude's People candidate count is stale

**Verdict: planning correction.** The current build validates 15 People candidates, not the eight cited in Claude's proposed action. Phase 8.2 should review the current candidate queue rather than use the stale count. This is not a public defect, but it changes the scope estimate.

## Protected elements

| Element | Judgment | Reason |
| --- | --- | --- |
| Current Home hero photograph | **PROTECT** | Strong scale, weather, depth, and authorship at every inspected width. |
| Hero condensed-caps + italic-serif relationship | **PROTECT** | The clearest brand signature; no evidence supports changing it. |
| Homepage People spread | **PROTECT composition** | It is the emotional center. Reduce duplication elsewhere if approved; do not weaken this spread. |
| Viewer geometry | **PROTECT geometry** | Contain/center/aspect-ratio and viewer-derivative decisions are correct. Repair focus and responsive sources separately. |
| Native scrolling | **PROTECT — DO NOT REINTRODUCE HEAVY SMOOTH SCROLLING** | Phase 7 removed the 1.05s input lag; current code contains no Lenis initialization or scrubbed parallax. |
| Ultramarine memory-mark system | **PROTECT** | Distinctive because it remains scarce and functional. |
| Destination index typographic concept | **PROTECT; polish only** | The thumbnail-free index is confident and avoids tourism-site grammar. |

Owner-rejected `P1260248.jpg` and all seven FAST & YUMMY SHAWARMA frames have zero references in public source, public catalog, destination data, or built output. They remain excluded.

## Owner decisions required

1. **Japan hero art direction:** current `P1230676.jpg` is a portrait whose human silhouettes sit at the extreme bottom; the full-viewport landscape crop removes them. Decide between a lower focal crop, a non-cover/asymmetric opening, or a different hero. Candidate selection must come from a reviewed owner shortlist.
2. **Japan re-edit:** approve which unseen Japan frames replace Home repeats and whether the six appended B&W frames remain part of the place chapter.
3. **Typography portability:** approve licensed/self-hosted fonts versus a deliberately tested fallback system, including budget and licensing appetite.
4. **Homepage environment beat:** keep, remove, or replace the second La Réunion ridge-and-cloud image.
5. **Jungle/Buddha slot:** decide whether the current famous motif still feels personal enough for Home.
6. **Black & White edit:** decide whether to add, rescale, reorder, or retire frames; engineering evidence cannot determine emotional strength.
7. **People expansion:** confirm privacy/consent and select any additions from the current 15-candidate queue.

## P0 findings

### P0-01 — Japan variable-length destination layout — ACCEPT

- **Rendered evidence:** at desktop widths the first four sequence figures occupy multi-column editorial positions; later figures collapse to approximately one of 12 grid tracks. At 1600px, the usable track is roughly 100px before gaps, matching Claude's postage-stamp observation. The layout rhythm terminates after frame four.
- **Code evidence:** Japan has 11 chapter images: one hero plus ten sequence frames. `global.css` defines only `.destination-frame-1` through `.destination-frame-4`; frames 5–10 receive no grid column. Mobile switches the sequence to flex and therefore avoids the same postage-stamp failure.
- **Why:** this visibly breaks the only published destination chapter and makes the deepest click look unmaintained.
- **Phase 8.2 action:** implement a variable-length editorial layout contract: a repeating authored placement cycle or explicit layout-role metadata with a resilient fallback. Do not merely add selectors 5–10. Re-edit the sequence only after owner approval.
- **Risk:** medium if data order changes; low for a purely resilient fallback.
- **Expected benefit:** restores the flagship chapter and permanently removes the hard-coded-count failure class.
- **Implement in Phase 8.2? YES.**

### P0-02 — Archive filter promise versus reality — ACCEPT

- **Current data:** 500 public photographs; 23 have any `visualWorlds`; 477 are unclassified. People 2, Urban 1, Beaches 1, Jungle 5, Ocean 3, Black & White 10. Destination assignments: Thailand 32, Phu Quoc 21, Malaysia 103, Laos 3, Japan 216, La Réunion 114.
- **Rendered/user evidence:** all six world names are presented as equal primary filters. Results of one or two frames read as broken taxonomy, not editorial restraint.
- **Code evidence:** visibility is based only on whether a category has at least one result, so underpopulated controls ship.
- **Phase 8.2 action:** combine **B + D + A**: hide/gate underpopulated filters now; define worlds as reviewed editorial collections rather than exhaustive machine tags; curate more photographs manually before reinstatement. Do not bulk-classify by automation.
- **Risk:** low for gating; high editorial cost for genuine classification.
- **Expected benefit:** every visible discovery control delivers credible depth.
- **Implement in Phase 8.2? YES.**

## P1 findings

### P1-01 — Public process language — ACCEPT

Public source confirms: “Story context is still being written… future journal format,” footer “Working title,” four “developing” roadmap entries, “confirmed frames · editorial review,” “opening chapter shows only the existing editorial selection,” “remaining frames are still being edited,” and Archive database-language about incomplete classification. The factual honesty is valuable; the production register is not. Phase 8.2 should delete placeholders and translate necessary uncertainty into ELSEWHERE's concise editorial voice without inventing facts. **Implement: YES. Risk: low.**

### P1-02 — Repetition masquerading as depth — PARTIAL

The market woman is used on Home, as the People hero, and in Black & White. Japan's early color sequence repeats Home's Tokyo street, ocean current, shell, and hero/Ocean frame; its six later frames also duplicate the B&W room. This substantially weakens the reward of deeper navigation. However, Home-to-collection reuse is sometimes intentional continuity, and Archive occurrences are expected. Protect the homepage People spread; owner-review duplicates on People, Japan, and the B&W opener. **Implement: OWNER. Risk: medium.**

### P1-03 — Japan hero crop — PARTIAL

The rendered 1600px opening is entirely turbulent blue water; the source's two silhouetted people are at the bottom edge and are removed by cover cropping. Claude correctly identifies lost subject and weak place signal. The water abstraction is not technically broken, but it is a poor flagship destination threshold and duplicates Home. The exact remedy is photographic art direction. **Implement: OWNER. Risk: high.**

### P1-04 — Cross-platform typography — PARTIAL

CSS uses Avenir Next Condensed/HelveticaNeue-Condensed/Arial Narrow/Arial for display, Baskerville/Iowan/Palatino/Georgia for editorial, and Avenir Next/Helvetica Neue/Arial for UI. macOS gets the intended pairing; Windows/Android may not. Metrics and character materially change, but no Windows/Android render was available and no licensing strategy exists. Phase 8.2 should first make comparative screenshots, then implement an owner-approved self-hosted or art-directed fallback solution with `size-adjust`, privacy, preload, and layout QA. **Implement: OWNER. Risk: medium.**

### P1-05 — Viewer focus restoration — ACCEPT

`archive.ts` passes `.archive-image`, an unfocusable span, into `showViewer`; close calls `.focus()` on that span. The initiating `.archive-frame` button is not restored. Clicking and keyboard activation share the same faulty path. Pass the button as focus origin and keep a separate geometry origin. Protect all viewer geometry. **Implement: YES. Risk: negligible.**

### P1-06 — Scroll cue orientation — ACCEPT

Rendered desktop evidence shows the blue arrow pointing left while “Scroll” is vertical. Both sit inside `writing-mode: vertical-rl`; the glyph inherits the vertical transformation. The label can remain vertical, but the directional glyph must be isolated and point down. **Implement: YES. Risk: negligible.**

### P1-07 — Catalog-image DPR fidelity — ACCEPT with bounded scope

Archive thumbnails and destination images have a single `src` and no `srcset`/`sizes`. A 960px portrait thumbnail rendered around 358 CSS px supplies only 1.34 device pixels per CSS pixel at DPR2; a 960px landscape rendered around 611px is below DPR2 by a larger margin. Destination hero uses the 3200px source even on mobile, while sequences use one 1800px source. Use existing roles to emit responsive candidates and explicit sizes; do not generate new derivatives until measured need is proven. **Implement: YES. Risk: low–medium.**

### P1-08 — Archive alt architecture — ACCEPT

There are eight unique alt strings across 500 records; 478 are exactly “An unclassified photograph from the Elsewhere archive.” None are empty. Nine more use one generic B&W sentence. The lighthouse is a breakwater lighthouse under cloud, not a solitary figure. Do not manufacture scene descriptions. Phase 8.2 should correct known authored alts, expose an explicit human-review queue, allow decorative/duplicate-context empties where appropriate, and use factual metadata only as a temporary accessible label—not as fake descriptive alt. The Archive button's own accessible name must also include the useful description. **Implement: YES, staged. Risk: medium editorial workload.**

## P2 findings

- **People depth and promise — PARTIAL.** Four images can be an intentional first set, but Home/People repetition and expansive link language overpromise. Adjust promise immediately; expand only through owner-reviewed, consent-conscious curation.
- **Homepage environment repeat — NEEDS_OWNER_DECISION.** The second ridge/cloud beat repeats the hero's register, but it can also function as a return. Compare keep/remove/replace as a sequence, not in isolation.
- **Black & White density/weak frames — NEEDS_OWNER_DECISION.** Spacing is unusually long, but “under-hung” versus “quiet room” is taste. Owner should compare the current nine-frame hang with one tightened and one expanded proof before selection changes.
- **Worlds collision near 1024 — ACCEPT.** `.world-4 { margin-top:-2rem }` remains active until the 900px mobile breakpoint. Remove/re-slot the negative offset in the 980–1100 range after exact rendered overlap QA.
- **Buddha/jungle image — NEEDS_OWNER_DECISION.** Familiar subject matter is not proof of weak authorship. Provide 2–4 archive alternatives; owner decides.
- **Loose wide-screen anchoring — PARTIAL.** The premise secondary column and destination counts can dissociate at 1600px, but Claude's prescribed baseline/count relocation is only one solution. Make a low-risk spacing/type alignment pass without changing page grammar.
- **People H1 rag — ACCEPT.** The authored `<br>` intends two lines, while the desktop `max-width:8ch` can force additional wraps. Remove the conflicting width constraint while preserving the explicit break.
- **Lighthouse alt mismatch — ACCEPT.** Correct the visible subject factually across Home, B&W, collections metadata, destination fallback, and social alt.

## P3 findings

- **Public future-collections roadmap — ACCEPT** as part of the process-copy cleanup; it is noindex but still public and reads as backlog.
- **Viewer counter/capitalization/touch ring/mobile header group — PARTIAL.** Three-digit counter consistency and authored “Black and white” casing are safe. Touch focus styling requires modality testing. The 78px solid mobile header visibly separates the hero from the top edge, but contrast-safe transparent behavior must be proven per hero; treat it as optional, not a launch blocker.
- **Viewer exit motion — REJECT for Phase 8.2 scope.** The current immediate close is clear and fast. An exit animation adds risk to scroll/focus restoration without solving a meaningful defect.
- **Wordmark blend insurance — REJECT absent a demonstrated unreadable state.** The current hero render remains legible; a permanent scrim risks weakening the photograph.
- **Monochrome exit spacing / 320px image-width floor — OPTIONAL.** Verify with owner-facing comparisons before changing authored silence or mobile rhythm.

## Cross-model agreement rate

Using the 20 canonical weaknesses in Claude's audit:

- **Claude findings accepted: 11**
- **Partially accepted: 6**
- **Rejected: 0**
- **Needs owner: 3**
- **Cross-model agreement rate: 70%**, calculated as `(ACCEPT + 0.5 × PARTIAL) / 20`. Excluding the three taste-only owner decisions, resolvable agreement is 82%.

## Phase 8.2 change budget

### Must change

- Variable-length Japan sequence layout.
- Gate/hide sparse Archive world filters.
- Remove/translate public process language.
- Restore viewer focus to the initiating button.
- Correct scroll cue orientation.
- Correct lighthouse alt and begin the alt/accessibility-name architecture.

### Should change

- Add responsive candidates/sizes to catalog-driven images.
- Repair 980–1100 worlds collision and People H1 rag.
- Reduce harmful deep-page repetition after owner selection.
- Establish a deliberate cross-platform typography solution after owner decision.

### Optional

- Wide-screen text anchoring, mobile header behavior, B&W density, small viewer-label consistency, 320px frame floor.

### Do not touch

- Home hero photograph or hero type relationship.
- Homepage People composition.
- Native scroll behavior; do not reintroduce Lenis smoothing.
- Viewer contain/center/aspect-ratio geometry.
- Ultramarine accent density or broad visual-language redesign.
- Owner-rejected photography.

## Phase 8.2 recommended scope

Proceed with structural and trust repairs first. Split photographic/taste changes into owner-approved curation work. Typography begins with comparison and licensing choice, not a font import. Accessibility work must fix both catalog descriptions and control naming. Every public change then receives the full viewport, keyboard, reduced-motion, console, crop, missing-asset, DPR, and layout-shift gate.

## Final go / no-go

**Should Phase 8.2 implementation proceed? YES.**

**Approved P0 items:** variable-length Japan layout; Archive sparse-filter gating and editorial taxonomy plan.

**Approved P1 items:** process-copy cleanup; viewer focus restoration; scroll-cue repair; staged alt/accessibility-name repair; responsive catalog image sources. Typography implementation is conditional on owner direction.

**Owner decisions required before implementation:** Japan hero and sequence photographs; duplicate removals; typography licensing/strategy; second environment beat; Buddha slot; Black & White hang; People additions.

**Protected elements:** Home hero and title relationship; homepage People spread; viewer geometry; native scrolling; ultramarine memory marks; owner-rejected exclusions.

STOP. Await owner review before Phase 8.2 implementation.
