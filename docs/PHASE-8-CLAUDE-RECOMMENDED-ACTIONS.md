# Phase 8 — Recommended Actions (Claude) · prioritized, not yet implemented

Companion to `PHASE-8-CLAUDE-CREATIVE-DIRECTOR-AUDIT.md`. Nothing below has been implemented. Every item lists problem, why it matters, location, proposed change, expected effect, risk, and effort.

---

## P0 — MUST FIX (launch blockers)

### P0-1 · Japan chapter frame overflow
- **PROBLEM**: `destination-sequence` CSS styles only `.destination-frame-1…4`; Japan's `manualOrder` now yields 10 sequence frames, so frames 5–10 (the Phase-7 B&W additions P1240171, P1240815, P1250928, P1260197, P1260426, P1260472-2) render as ~95px auto-placed grid cells with wrapped captions.
- **WHY IT MATTERS**: The flagship deep page — the site's proof of archive depth — looks broken to every visitor who scrolls it. Single most damaging defect on the site.
- **WHERE**: `src/styles/global.css` (`.destination-frame-*`), `data/destinations.json` (japan.manualOrder), rendered at `/destinations/japan/` from ~561px width upward.
- **PROPOSED CHANGE**: Editorial fix first: remove the six B&W frames from Japan's manual order (they already live in the B&W room) and keep a 4–6 frame color-led sequence; simultaneously make the layout resilient — a repeating 4-position pattern (`nth-child(4n+1)…`) so any future order length lays out intentionally.
- **EXPECTED EFFECT**: Japan reads as an authored chapter at every count; the bug class (order grows, CSS doesn't) is permanently closed.
- **RISK**: Low. Purely additive CSS pattern + data ordering; verify no other destination publishes >4 frames.
- **EFFORT**: LOW.

### P0-2 · Archive world filters promise an empty taxonomy
- **PROBLEM**: Only 23/500 catalog photos have any `visualWorlds` value. Filters return: People 2, Urban 1, Beaches 1, Ocean 3, Jungle 5, B&W 10.
- **WHY IT MATTERS**: A visitor clicking "People" in a 500-frame archive and receiving two photographs concludes the site is broken or empty. It converts the archive's depth into apparent poverty.
- **WHERE**: `src/pages/archive/index.astro` (filter row), `src/scripts/archive.ts`, data in `public/data/photo-catalog.json`.
- **PROPOSED CHANGE**: Short term (Phase 8): remove the world filter buttons, keep Year / Frame / Place + "Another frame", all of which work against real data. Long term: reinstate worlds only when coverage reaches a threshold (e.g. ≥40 frames per world), which is a curation task in the studio, not a code task.
- **EXPECTED EFFECT**: Every visible control delivers a rich result; archive reads as deep instead of mislabeled.
- **RISK**: Low. Removing UI; B&W remains reachable via its collection page and Place/Year still segment the archive.
- **EFFORT**: LOW.

---

## P1 — HIGH IMPACT

### P1-1 · Japan hero art direction + de-duplication
- **PROBLEM**: The Japan hero crops P1230676 so its subject (silhouetted passengers over churning water) is gone, leaving noisy abstract water and zero place signal; the same photo is the homepage Ocean chapter. Four of Japan's first five frames repeat the homepage.
- **WHY IT MATTERS**: The chapter with 216 confirmed frames demonstrates recycling instead of depth; the "soft image" impression returns via a noise-amplifying crop.
- **WHERE**: `/destinations/japan/` hero (`destination-hero`), `data/destinations.json` heroPhotoId + manualOrder.
- **PROPOSED CHANGE**: Owner selects a Japan hero from the 216 (urban dusk canal P1260492 and the gull/hands P1230620 are already in the manual order and both carry place and story); rebuild the 4–6 frame sequence from frames not used on Home. Requires owner eye; Claude can shortlist 12 candidates from the catalog for approval.
- **EXPECTED EFFECT**: Clicking Japan finally rewards the visitor with unseen work; chapter regains color identity.
- **RISK**: Medium — photographic selection is owner-taste territory; mitigate via shortlist + approval.
- **EFFORT**: MEDIUM.

### P1-2 · Public copy purge (process register → site voice)
- **PROBLEM**: Published copy includes "Story context is still being written… marker for the future journal format", footer "Working title.", Collections "developing" roadmap ×4, "This opening chapter shows only the existing editorial selection", "confirmed frames · editorial review".
- **WHY IT MATTERS**: Each instance converts the world back into a website under construction; it is the single largest trust leak for editors/partners.
- **WHERE**: `src/pages/index.astro` (story-feature), `src/components/SiteFooter.astro`, `src/pages/collections/index.astro`, `src/pages/destinations/[slug].astro`, `DestinationBrowser.astro`, destinations index.
- **PROPOSED CHANGE**: Delete the story paragraph (keep photo + one-line caption or hold the section); delete "Working title."; delete the future-collections list; rewrite provenance lines in the site's laconic voice ("216 photographs · open" / "in edit"; "The country is certain. The cities are not." style). No new claims, no invented facts.
- **EXPECTED EFFECT**: The honest-metadata brand stays; the CMS documentation register disappears.
- **RISK**: Low. Copy only; keep factual truthfulness constraints.
- **EFFORT**: LOW.

### P1-3 · Cross-platform typography security
- **PROBLEM**: Display/editorial identity depends on Avenir Next Condensed and Baskerville — Apple-only. Windows/Android render Arial Narrow/Arial + Georgia; the brand's core asset degrades silently for non-Apple visitors.
- **WHY IT MATTERS**: A publication's typography cannot be an accident of the reader's OS; partners and most of the world see a different, cheaper site.
- **WHERE**: `src/styles/global.css` `:root` font stacks; every display surface.
- **PROPOSED CHANGE**: Owner decision between (a) self-hosted webfont pair matching the intent (condensed grotesque + Baskerville-class serif, subset woff2, preloaded, `size-adjust`ed fallbacks — ~60–90KB) or (b) deliberately art-directed non-Apple stacks QA'd via screenshots (cheaper, weaker). Recommend (a).
- **EXPECTED EFFECT**: One brand on every device; removes the largest invisible inconsistency.
- **RISK**: Medium — introduces font loading (mitigated by preload + fallback metrics); licensing cost.
- **EFFORT**: MEDIUM.

### P1-4 · Viewer focus restoration
- **PROBLEM**: `archive.ts` passes `frame.querySelector('.archive-image')` (a non-focusable span) as the viewer origin; on close, focus lands on `<body>`.
- **WHY IT MATTERS**: Keyboard users lose their position in a 500-item grid; contradicts the site's otherwise strong a11y story and Phase 6's claim.
- **WHERE**: `src/scripts/archive.ts` field click handler + close handler.
- **PROPOSED CHANGE**: Pass the `<button.archive-frame>` itself as origin; keep the span only as the animation rect source.
- **EXPECTED EFFECT**: Close returns focus to the exact frame; zero visual change.
- **RISK**: None meaningful.
- **EFFORT**: LOW.

### P1-5 · Archive alt-text depth
- **PROBLEM**: 478/500 frames share one generic alt sentence; homepage lighthouse alt describes the wrong subject.
- **WHY IT MATTERS**: For a photography publication, alt text is the non-visual product and the image-SEO surface; 95% duplication is a hole in both.
- **WHERE**: `public/data/photo-catalog.json` altText generation in `scripts/build-photo-catalog.mjs`; `src/pages/index.astro` lighthouse alt.
- **PROPOSED CHANGE**: Tier the generation: use year/destination/orientation/world facts already in the catalog ("Portrait frame, Japan, 2025 — from the Elsewhere archive") so every alt is at least factually specific; correct the lighthouse alt ("A breakwater lighthouse under heavy evening cloud"). Full descriptive alts remain a curation-studio task; never invent scene content.
- **EXPECTED EFFECT**: Every frame announced distinctly; no fabricated descriptions.
- **RISK**: Low — mechanical, truth-preserving.
- **EFFORT**: LOW–MEDIUM.

### P1-6 · `srcset` for catalog-driven images
- **PROBLEM**: Archive grid, destination sequences and destination heroes ship single fixed derivatives; Retina grids under-resolve (641px into 358px cells needs 716; 960 into 611 needs 1222) and mobile downloads oversized files.
- **WHY IT MATTERS**: Sharpness is the product; the Phase-7.5 fidelity promise currently holds only in the viewer.
- **WHERE**: `src/pages/archive/index.astro`, `src/scripts/archive.ts` frameMarkup, `src/pages/destinations/[slug].astro`; derivative generation in `scripts/generate-archive-derivatives.mjs`.
- **PROPOSED CHANGE**: Emit `srcset="thumbnail 960w, archive 1800w"` (+viewer 3200w where warranted) with role-appropriate `sizes`; no new derivative sizes required — the three existing roles already cover the range.
- **EXPECTED EFFECT**: Retina-sharp grid, smaller mobile payloads, honest DPR adequacy everywhere.
- **RISK**: Low; verify no double-download regressions.
- **EFFORT**: MEDIUM.

### P1-7 · Scroll cue glyph
- **PROBLEM**: `↓` inside `writing-mode: vertical-rl` rotates and points left.
- **WHY IT MATTERS**: First-viewport defect on every desktop visit; reads as carelessness in the most-seen pixel region.
- **WHERE**: `.hero-scroll` in `global.css` / `index.astro`.
- **PROPOSED CHANGE**: Take the glyph out of the vertical writing mode (separate non-vertical `<i>`) or use a CSS-drawn 1px line + rotate-safe arrow.
- **EXPECTED EFFECT**: Cue points down.
- **RISK**: None.
- **EFFORT**: LOW.

---

## P2 — REFINEMENT

### P2-1 · Homepage environment beat
- **PROBLEM**: Second La Réunion ridge-and-cloud full-bleed repeats the hero's emotional note.
- **WHY**: One page, one mountain epiphany; the repeat devalues both.
- **WHERE**: `index.astro` environment section.
- **CHANGE**: Replace with a different environment register (jungle interior, weather, urban scale) from unused archive frames — owner shortlist — or remove the section.
- **EFFECT**: Tighter book; hero stays singular. · **RISK**: Medium (selection taste). · **EFFORT**: LOW–MEDIUM.

### P2-2 · B&W room density and weak frames
- **PROBLEM**: 9 frames across ~5.5 near-black viewports; *Toward light* illegible at 24vw; *Upward* below the room's standard; market woman is a third appearance.
- **WHERE**: `/collections/black-and-white/`, `global.css` `.bw-frame-*` margins.
- **CHANGE**: Re-review the ~50 unpromoted Phase-7 monochrome candidates for 3–5 additions (owner eye); give *Toward light* large scale or retire it; reduce staggered top-margins ~30%; consider opening the room with the doorway man instead of the market woman.
- **EFFECT**: A hung exhibition instead of a sparse corridor. · **RISK**: Medium (curation). · **EFFORT**: MEDIUM.

### P2-3 · People depth and promise
- **PROBLEM**: 4 photographs (one homepage repeat) behind "Enter the people archive"; archive People filter = 2.
- **WHERE**: `/people/`, People candidate queue in the curation studio.
- **CHANGE**: Review the 8 existing People candidates + archive for 8–15 consent-conscious additions sequenced like B&W; until then, soften the link copy ("A first set of encounters").
- **EFFECT**: The intended emotional signature gets a real room. · **RISK**: Medium — consent/privacy review is owner work. · **EFFORT**: MEDIUM–HIGH (mostly curation).

### P2-4 · Worlds label collision at ~1024
- **PROBLEM**: `.world-4 { margin-top: -2rem }` overlaps the Beaches caption near 1024px.
- **WHERE**: `global.css` worlds sequence.
- **CHANGE**: Drop the negative margin below ~1100px (or re-slot world-4's grid row).
- **EFFECT**: No mid-viewport text clipping. · **RISK**: None. · **EFFORT**: LOW.

### P2-5 · Buddha-head replacement
- **PROBLEM**: The one stock-replaceable motif on the homepage occupies a signature world slot.
- **CHANGE**: Owner selects a personal jungle frame (the 1170554 roots figure minus the famous head, or another interior) — shortlist from archive.
- **EFFECT**: Five worlds, five frames only this archive owns. · **RISK**: Medium (taste). · **EFFORT**: LOW.

### P2-6 · Anchoring loose text
- **PROBLEM**: Premise right column floats in half a viewport; destination-index counts sit ~700px from their names.
- **CHANGE**: Baseline-align the premise column to the serif block's last line (or bottom-align in-section); move destination counts under the names as a second line at ≥1280, keeping the right column for the open/in-edit state only.
- **EFFECT**: Spreads close; silence reads as intent. · **RISK**: Low. · **EFFORT**: LOW.

### P2-7 · People h1 rag
- **PROBLEM**: `max-width: 8ch` forces "PEOPLE I / MET / ALONG THE / WAY." on desktop.
- **CHANGE**: Author the break (`PEOPLE I MET<br>ALONG THE WAY.`) as on Home; drop the ch clamp.
- **EFFECT**: Two balanced lines everywhere. · **RISK**: None. · **EFFORT**: LOW.

### P2-8 · Mobile header vs. hero
- **PROBLEM**: Solid fixed bar owns the top 78px of every mobile page; heroes never reach the top edge.
- **CHANGE**: Transparent header over heroes, gaining the solid background after ~40px scroll (keep mix-blend off mobile).
- **EFFECT**: Full-bleed mobile openings; art direction wins the first screen. · **RISK**: Low–medium (contrast QA over bright images). · **EFFORT**: MEDIUM.

---

## P3 — OPTIONAL POLISH

1. **Viewer exit motion**: 200ms reverse clip toward the origin frame on close — completes the signature entry. (LOW)
2. **Counter consistency**: three-digit viewer counter to match grid indices. (LOW)
3. **Capitalize artifact**: replace `text-transform: capitalize` on viewer meta/captions with pre-formatted labels ("Black and white"). (LOW)
4. **Touch focus-ring**: move menu-open focus ring behind `:focus-visible`-only styling so touch opens don't flash the outline. (LOW)
5. **320px floor**: raise minimum staggered frame width to ~78% below 360px so detail frames keep content legibility. (LOW)
6. **Wordmark blend insurance**: subtle text-shadow or scrim behind the wordmark over bright hero regions. (LOW)
7. **Monochrome room exit spacing**: trim trailing black before Destinations. (LOW)

---

## Sequencing note

P0-1, P0-2, P1-2, P1-4, P1-7 are one working session and carry no design risk; they should land before anything else. P1-1, P2-1, P2-2, P2-3, P2-5 require owner photographic approval and should be batched into a single curation review. P1-3 needs an owner licensing decision before any implementation. Every change re-verified in the rendered browser at 1600/1280/1024/768/390/320 per AGENTS.md before commit.
