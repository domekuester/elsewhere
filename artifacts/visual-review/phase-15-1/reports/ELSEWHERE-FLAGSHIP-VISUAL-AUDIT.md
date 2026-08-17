# Phase 15.1 — ELSEWHERE flagship visual audit

Date: 17 August 2026  
Mode: read-only audit; no public design implementation  
Evidence: 23 full-page captures plus focused interaction captures at 1440, 1024, 768, 430, and 390px. Reduced-motion rendering was used for the full matrix; a no-preference pass verified native scrolling and complete visible defaults.

## 1. Executive verdict

ELSEWHERE is already substantially above the level of a polished portfolio. It has a real editorial identity, strong photographic taste, an unusually disciplined black/ivory system, quiet interface chrome, and several sequences that feel authored rather than assembled. Home's opening, B&W's cadence, Archive's desktop contact sheet, and the first half of People are credible flagship material now.

The site is not yet a complete world-class flagship because its strongest grammar has become too universal. Different editorial objects repeatedly open with a full-viewport photograph and lower-left condensed title, move through familiar black/ivory alternation, and end by pointing to Archive. Journey, Destination, People, and B&W therefore share a brand but sometimes lose their individual editorial job. The Japan Journey exposes the deepest gap: excellent material is held inside a narrow, dark, mostly single-column reading tunnel for roughly 35,900px on desktop and 27,500px on mobile. The content is authored; the macro-composition is still too uniform.

There are no P0 defects in the audited surfaces. The work is a focused art-direction and system-differentiation project, not a rescue or wholesale redesign.

### Surface scores

Scores are judgment bands supported by the observations below, not mathematical precision.

| Surface | Score | Verdict |
| --- | ---: | --- |
| Home | 86 | Strong, memorable entrance; slightly over-complete and motif-heavy |
| Journey | 76 | Exceptional source material and prose; insufficient macro-rhythm and mobile authorship |
| Destination | 79 | Strong photographic body; identity is too close to a silent gallery/Journey derivative |
| Archive | 84 | Distinctive desktop contact sheet and excellent viewer; mobile density and utility need refinement |
| People / B&W | 85 | B&W is near-flagship; People loses humanity when it becomes a regular grid |
| Mobile | 78 | Reliable and carefully cropped; long-form cadence and secondary touch targets are not yet premium |
| Overall brand distinctiveness | 83 | Recognizable voice, but several signature devices repeat until they become template grammar |
| Overall flagship readiness | 80 | Strong publication with a bounded set of high-impact editorial-system gaps |

### Evidence anchors

- [Home desktop](../before/home-1440x1000.png)
- [Home mobile](../before/home-390x844.png)
- [Journey index desktop](../before/journey-index-1440x1000.png)
- [Japan Journey desktop](../before/journey-japan-1440x1000.png)
- [Japan Journey mobile](../before/journey-japan-390x844.png)
- [Japan Destination desktop](../before/destination-japan-1440x1000.png)
- [Archive desktop](../before/archive-1440x1000.png)
- [People desktop](../before/people-1440x1000.png)
- [B&W desktop](../before/black-white-1440x1000.png)
- [Mobile navigation](../before/mobile-navigation-open-390x844.png)

## 2. What is already excellent

### The publication has a real voice

The condensed Barlow display face, Literata prose, black/ivory alternation, thin ultramarine marks, sparse captions, and minimal chrome create immediate recognition. The system avoids rounded cards, visual gimmicks, faux-film language, and travel-blog conventions. This restraint is earned by the photographs rather than used to simulate luxury.

Preserve:

- Barlow Condensed and Literata as the core relationship.
- Obsidian/ivory as the dominant editorial grounds.
- Ultramarine as a rare navigational/editorial signal.
- Native scrolling and the absence of scroll ownership.
- Full-image integrity for contained Journey frames.
- Honest metadata and refusal to invent place detail.
- The commercial layer's separation from photographic sequences.

### Home already behaves like an entrance

The first three movements are excellent: landscape hero, quiet ivory premise, then the black visual-world sequence. The change in temperature and scale establishes memory, geography, and archive without becoming explanatory. “People I met along the way,” the intimate shell pause, the environmental panorama, the B&W room, and the saturated last-light image create genuine editorial contrast.

The best Home quality is its ability to move from monumental to intimate. Future work should edit this rhythm, not replace it.

### B&W has its own cadence

B&W is not Archive with grayscale applied. It has a strong monochrome hero, extensive black negative space, asymmetrical image placement, a large literary interruption, and deliberately unequal frame scales. Desktop and mobile retain the sequence's atmosphere. This is the clearest proof that shared brand language can support a distinct surface.

### Archive desktop is specific and useful

The contact-sheet field is not generic masonry. It preserves ratios, uses selective scale, carries restrained frame numbers, and presents filters as quiet utilities. Focused viewport checks confirmed real images throughout the field; the apparent blank region in full-page captures is a headless `content-visibility` capture artifact, not a live layout defect. The viewer opened with focus contained, loaded a contained image, closed with Escape, and returned focus to the originating frame.

### People begins with humanity

The split hero creates proximity rather than taxonomy. “Encounters, not profiles” is a strong editorial rule, and the first three-image sequence varies distance, gaze, color, and scale. It feels observed rather than collected.

### Mobile foundations are technically strong

Across audited widths there was no horizontal overflow, no visible missing image, no console warning, and no network error. The full-screen mobile index is calm and legible; it moves focus into the menu, traps the keyboard loop, closes on Escape, and returns focus. Reduced motion presents complete pages with no reveal-dependent content. Hero and destination focal treatments preserved key subjects in the audited captures.

## 3. Major flagship gaps

### P1 — Journey's macro-rhythm does not match its editorial depth

Japan contains 29 photographs, seven named sections, and deeply personal writing, but most of the body is governed by one centered 36rem measure on one uninterrupted dark ground. Wide and portrait frames often resolve to similar perceived widths; text blocks recur at the same measure; pairs become independent stacked frames on mobile. The result is a long, elegant tunnel rather than a cinematic chapter.

Why it matters: the visitor reads the system before they finish the story. When scale and ground stop changing, emotional turning points lose force, even if individual photographs are excellent.

Evidence: 35,864px desktop and 27,510px mobile page height; [Japan desktop](../before/journey-japan-1440x1000.png), [mobile middle act](../before/journey-japan-scroll-11000-390x844.png).

### P1 — Surface identity is coherent but over-homogenized

Journey, Destination, Archive, and B&W all use a large photographic opening with title overlaid near the lower-left region. Condensed uppercase headings, the short blue line, dark/light alternation, and oversized archive continuation recur across nearly every surface. These are good devices; their universal use makes pages feel like variants of one template.

Why it matters: flagship coherence comes from shared principles, not identical openings and endings. Destination should feel like a body of work, Journey like memory in sequence, Archive like depth, People like encounter, and B&W like a separate room.

### P1 — The Journey index is a repeated chapter-card sequence

Every chapter uses the same wide 16:7 image, number/date, large title, standfirst, and “Read the story” affordance. The repetition is clean but predictable. Portrait source frames for Laos and Phu Quoc are forced into the same panorama and showed lower-than-display intrinsic widths in the rendered evidence, making the most standardized surface also the least photographically honest.

Why it matters: five personal chapters should read like a contents sequence with distinct emotional entrances, not five instances of one component.

### P1 — People becomes the treatment it explicitly rejects

After the excellent opening sequence, “Further encounters” becomes a regular three-column portrait grid on desktop and a staggered two-width feed on mobile. Captions are small and the subjects become equal records. This reads closer to a face database than the first half's embodied encounters.

Why it matters: the grid changes the ethical and emotional relationship. People become inventory exactly where the page says they are not profiles.

### P1 — Core publication navigation and exits flatten the architecture

The primary navigation exposes Explore/Archive, People, Destinations, About, and Studio, but not The Journey or B&W. Journey is one of the publication's central authored forms yet depends on in-page discovery. At the other end, consecutive “Archive” and “Enter the Archive” calls appear on Destination and B&W; most surfaces terminate in the same large Archive continuation.

Why it matters: the visitor cannot read the publication's true hierarchy from its main navigation, while repeated Archive exits make distinct stories conclude with the same cadence.

### P1 — Several large photographic slots request or receive undersized derivatives

At 1440px, rendered evidence found meaningful display-to-intrinsic width mismatches, including Home's Ocean frame (889px displayed / 648px intrinsic), the shell detail (432 / 316), Journey-index portrait heroes (1348 / 993 and 1348 / 883), and a Destination wide frame (1004 / 835). Some are caused by `sizes` values that describe the common grid case but not exceptional wider roles; others use long-edge derivatives unsuitable for a panoramic crop of a portrait source.

Why it matters: subtle softness is the opposite of photographic authority. The image pipeline is disciplined, but layout-role contracts and responsive selection are not fully aligned.

## 4. Surface-by-surface review

### A. Home

What works:

- Immediate photographic authority and a memorable first three movements.
- Strong scale modulation: monumental landscape, portrait encounter, small shell, environmental panorama.
- Confident alternation between dark and ivory.
- B&W preview and saturated last-light chapter create real tonal contrast.
- Mobile preserves the authored alternation instead of collapsing into a card grid.

What feels average or repetitive:

- At 16,240px desktop and 14,929px mobile, Home is close to an anthology of every surface.
- Condensed two-line headings plus blue mark recur so often that individual moments lose uniqueness.
- Destinations, story feature, Ocean, archive premise, and closing photos all compete to be the last major movement.
- Multiple links from the story feature split its purpose between Archive and Journey.

Strongest upgrade potential:

- Edit Home into fewer, clearer movements while keeping its current imagery and best pauses.
- Let one middle or closing photograph own a complete silent viewport.
- Make The Journey's entrance unmistakable without turning Home into a navigation checklist.

Severity: P2 overall; no wholesale Home redesign should begin before Journey is resolved.

### B. Journey index

What works:

- Strong editorial premise and excellent introductory typography.
- Chronology is legible without turning into a timeline widget.
- Images are large enough to announce each chapter.
- Mobile reading order is clear.

What weakens it:

- Five identical chapter patterns create a portfolio-project list.
- Uniform panoramic crops flatten source orientation and chapter mood.
- Numbers, date, title, summary, and repeated link form a predictable template loop.
- Phu Quoc's portrait hero is particularly ill-suited to the universal panorama.

Upgrade potential: very high. This is a bounded template with large impact across all published chapters.

### C. Japan Journey

What works:

- The opening boat image, personal standfirst, and dark reading ground establish atmosphere immediately.
- Prose measure, Literata line-height, and softened text color are carefully judged.
- Contained photographs preserve full compositions.
- Full-bleed storm/island passages, monochrome shifts, and warm nocturnal close provide real material for a cinematic score.
- Captions remain restrained and facts stay honest.

What weakens it:

- The narrow central body gives image, prose, chapter marker, and pair too similar a center of gravity.
- Chapter labels are functionally clear but visually minor relative to emotional turns.
- Long passages lack changes of ground, lateral position, and text/image relation.
- Mobile pairs lose their paired meaning and become two ordinary consecutive images.
- The fixed mobile header is functionally sound, but its opaque 76px band slightly reduces the already narrow reading viewport during long-form scrolling.
- The final warm architectural sequence is beautiful but repeats contained portrait/pair grammar for too long before closure.

Upgrade potential: highest in the publication.

### D. Japan Destination

What works:

- Strong urban hero and a compelling edit from density to light, corridor, shrine, bamboo, water, people, lighthouse, shore, and monochrome close.
- Desktop asymmetry and mobile width variation preserve a body-of-work feeling.
- The sequence carries little interface noise.

What weakens it:

- After the hero, a large ivory interval contains almost no editorial identity beyond “Read the story.”
- Once the dark sequence begins, the recurring role cycle—pair, offset, pair, anchor—becomes visible.
- It does not yet articulate why this is a Destination rather than a shorter, textless Journey.
- “Continue in the Archive” followed soon by the global “Enter the Archive” duplicates the exit.

Upgrade potential: high, but it should follow Journey so the distinction is designed deliberately.

### E. Archive

What works:

- Strong hero-to-index transition.
- Desktop contact sheet feels editorial, not Pinterest-like.
- Honest aspect ratios and selective scale let curated frames lead without hiding depth.
- Viewer interaction and accessibility behavior are excellent.
- Initial 24-frame rendering protects performance and DOM size.

What weakens it:

- Filter typography and frame metadata are extremely small relative to the photographic scale.
- Mobile's single-column 24-frame sequence becomes 13,000–14,500px long; it is more spacious feed than dense archive.
- Secondary mobile filters disappear, improving calm but reducing discovery depth.
- “Another frame” is visually quiet enough to be missed despite being a distinctive archive behavior.

Upgrade potential: medium. Desktop architecture should be preserved; focus on mobile density and utility hierarchy.

### F. People

What works:

- Excellent split hero with meaningful human proximity.
- The opening three encounters vary gesture, color, distance, and scale.
- “Names and places will appear only when known and appropriate” is ethically precise.

What weakens it:

- The deeper grid equalizes people into records.
- Repeated portrait aspect ratios and tiny captions reduce gesture and context.
- Mobile retains variation in width but still reads as a vertical list of portraits.

Upgrade potential: high within a small surface. Preserve the first half; redesign only the deeper encounters grammar.

### G. Black & White

What works:

- Best-in-class surface differentiation inside the current system.
- Large black fields, unequal scales, literary interruption, and quiet captions create a genuine room.
- Mobile remains composed rather than merely stacked.
- No fake grayscale treatment or visual cliché.

What could improve:

- Caption and continuation copy contrast/size are close to the lower comfortable bound.
- The two consecutive Archive exits weaken the otherwise excellent close.

Upgrade potential: low. Protect this surface and use it as the model for differentiated cadence, not as a layout to copy.

### H. Mobile navigation and browsing

What works:

- Full-height index has confident scale and very clear touch rows.
- Focus moves correctly, Escape closes, and focus returns.
- Native scrolling remains intact; no forced smoothing.
- Main photographic crops inspected at 390–430px preserve major subjects.

What weakens it:

- The Journey and B&W are absent from primary navigation despite being core publication forms.
- Footer and secondary editorial links often measure 24–30px high; visually elegant but below a generous premium touch target.
- Long-form mobile uses too many 350px-wide contained frames in succession.
- The opaque fixed header is reliable but visually identical across every non-opening surface.

Upgrade potential: high inside Journey; medium globally.

### I. Transitions

Section-level transitions are mostly visual ground changes rather than motion, which is correct. The problem is semantic repetition: many pages leave through the same oversized Archive door. Destination → Archive → Enter Archive and B&W → Archive → Enter Archive are redundant. Journey's destination/previous-next architecture is more meaningful and should inform other contextual endings.

### J. Overall coherence

ELSEWHERE clearly belongs to one publication. The next step is anti-homogenization: retain the fonts, palette, spacing logic, navigation quietness, and photographic respect, while giving each content type its own opening, tempo, and exit. B&W already demonstrates this principle.

## 5. Prioritized opportunity register

| ID | Severity | Issue | Impact | Confidence | Scope |
| --- | --- | --- | --- | --- | --- |
| F01 | P1 | Japan/long-form Journey lacks macro-rhythm and scale contrast | Very high | High | L |
| F02 | P1 | Mobile Journey collapses pairs and sustained scale variation into a long single-column stream | Very high | High | M–L |
| F03 | P1 | Journey index repeats one panoramic chapter pattern and compromises portrait heroes | High | High | M |
| F04 | P1 | Destination, Journey, Archive, and B&W openings use overly similar hero grammar | High | High | M–L |
| F05 | P1 | People deeper grid changes encounters into inventory | High | High | M |
| F06 | P1 | Journey/B&W are hidden from primary navigation; repeated Archive exits flatten onward flow | High | High | S–M |
| F07 | P1 | Responsive `sizes`/derivative role mismatches upscale important frames | High | High | S–M |
| F08 | P2 | Home contains too many major movements and repeated heading/mark grammar | Medium-high | Medium-high | M |
| F09 | P2 | Archive mobile is too vertically expansive for a depth surface | Medium-high | High | M |
| F10 | P2 | Filter, metadata, captions, and secondary links are often too small/low-emphasis | Medium | High | S–M |
| F11 | P2 | Destination lacks a distinct body-of-work introduction between hero and sequence | Medium-high | High | M |
| F12 | P2 | Repeated dark/light/condensed-heading motifs reduce surprise across surfaces | Medium | High | M |
| F13 | P3 | Minor optical inconsistencies in small labels and footer spacing | Low | Medium | S |

No P0 issues were observed.

## 6. Treatment directions

### Major issue 1 — Long-form Journey composition

Direction A — **Chapter movements** (recommended)

Keep the existing block model and authoritative order, but let each named chapter select a movement grammar: quiet reading column, image-led expansion, paired encounter, or full-width environmental turn. Introduce only two or three major expansions per story. The page remains one dark publication object, but emotional turns become spatial turns.

Direction B — **Monograph spreads**

Create a small set of spread primitives: text beside contained frame, tall portrait with marginal prose, wide landscape in silence, and true diptych. Assign existing blocks to those primitives without changing content order. This provides high authorship but risks feeling over-designed if every block becomes a spread.

Direction C — **Act-level ground changes**

Retain the central reading measure but divide the story into three or four acts using subtle ground temperature, rule, or breathing changes. Use sparingly; strong because it is small, but less transformative than A.

### Major issue 2 — Mobile Journey authorship

Direction A — **Mobile-specific pair preservation** (recommended)

Keep related frames perceptibly paired through controlled side-by-side, overlapping vertical offset without overlap, or a tight sequence group with one shared breathing interval. Choose per pair based on subject legibility; never force small faces into unusable columns.

Direction B — **Scale score**

Define mobile roles such as intimate (72–78vw), standard (90vw), full bleed, and silent landscape. Sequence them intentionally so five consecutive frames cannot resolve to the same perceived width.

Direction C — **Text-image hinges**

At selected turning points, let the final line of a prose block sit closer to the following photograph or let a chapter marker share its opening viewport. Do not overlay prose on photography; preserve reading clarity.

### Major issue 3 — Journey index

Direction A — **Authored folios** (recommended)

Give each chapter one of a few editorial folio arrangements chosen by source orientation and mood: panoramic cover, portrait beside title, or contained plate with large silence. Preserve chronological order and identical information, but vary composition intentionally.

Direction B — **Contents spread**

Use a strong typographic contents sequence with photographs appearing as unequal plates rather than one full-width image per entry. More monograph-like, but must avoid turning Journey into a compact list.

Direction C — **Alternating chapter thresholds**

Keep current image-title blocks but alternate image width/alignment and allow portrait heroes to remain portrait. Smallest intervention; less distinctive than A.

### Major issue 4 — Surface-specific openings

Direction A — **One hero, four threshold types** (recommended)

Keep full photographic hero for Journey. Let Destination open as a visual index/plate, Archive as depth/contact sheet, People as encounter split, and B&W as the immersive dark room it already is. Shared header, type, and color preserve coherence.

Direction B — **Hero variations inside one frame system**

Retain full-screen imagery but vary title position, containment, image behavior, and metadata hierarchy by surface. Lower implementation scope, but risks leaving the template feeling intact.

Direction C — **Introductory editorial plates**

Begin Destination and Archive with contained, high-authority frames surrounded by intentional ground rather than full bleed. Powerful differentiation, but every proposed hero crop/containment must receive owner review.

### Major issue 5 — People deeper encounters

Direction A — **Encounter suites** (recommended)

Group approved existing frames into small visual suites based on gesture, proximity, or gaze. Change only layout initially; any reordering remains an explicit owner decision.

Direction B — **Variable portrait hierarchy**

Keep order but make selected portraits large anchors, let contextual images widen, and use smaller frames as pauses. Removes the database effect without introducing editorial categories.

Direction C — **One encounter per beat on mobile**

Use more deliberate full-width/contained alternation with materially different spacing, avoiding a regular two-width feed.

### Major issue 6 — Publication navigation and exits

Direction A — **Expose publication forms** (recommended)

Rename “Explore” to “Archive” and add “Journey” to primary navigation; expose B&W contextually under Archive/Collections rather than crowding the header. Keep Studio at the edge.

Direction B — **Two-tier index**

Use the existing full-screen mobile index to separate Publication (Journey, Destinations, People, B&W, Archive) from About/Studio. Desktop can remain visually light through a compact secondary line.

Direction C — **Contextual endings only**

Keep the current header but remove duplicate global continuation CTAs where a more specific next path already exists. Destination should lead to its Journey or place Archive; B&W should lead once to monochrome Archive; Journey should lead to next/previous or Destination.

### Major issue 7 — Photographic delivery fidelity

Direction A — **Role-accurate `sizes` audit** (recommended)

Map every exceptional layout role to its actual maximum CSS width, especially Home world-5, detail images, Journey index, People offsets, and Destination wide roles. Preserve current derivatives and request the correct candidate.

Direction B — **Index-specific derivatives**

Generate a wide-role derivative only where the existing archive role cannot provide enough horizontal pixels from a portrait source. Do not upscale and do not crop masters destructively.

Direction C — **Composition-aware containment**

For portrait Journey-index heroes, stop forcing panoramic crops. Use a portrait plate or paired text layout, simultaneously solving fidelity and editorial sameness.

### Secondary issue — Home edit

Direction A — **Three-act entrance** (recommended after Journey)

Opening identity → human/place world → one decisive continuation. Preserve the strongest current sections and reduce competing endings.

Direction B — **Keep all material, compress utility**

Retain every section but combine Destinations and Journey pathways into one editorial hinge and simplify the closing archive premise.

Direction C — **One silent final frame**

Keep the current sequence and replace multiple late climaxes with one photograph allowed to stand alone before the footer.

### Secondary issue — Archive mobile density

Direction A — **Editorial doublets** (recommended)

Allow selected portrait/landscape combinations to share a row when subjects remain legible, punctuated by full-width anchors.

Direction B — **Contact-sheet clusters**

Use small three- or four-frame clusters followed by one large frame. More archival, but requires careful touch-target and viewer testing.

Direction C — **Tighter current sequence**

Keep one frame per beat but reduce the 4.5rem gap and make the continuation control visible earlier. Lowest risk, smallest gain.

## 7. Phase 15.2 implementation roadmap

### Stage 1 — Correct fidelity and navigation contracts

1. Audit responsive `sizes` and derivative roles on the seven audited surfaces.
2. Correct large-slot undersizing without changing photographs or source masters.
3. Resolve the Journey's primary-navigation status and remove duplicate Archive exits.
4. Capture matched before/after evidence at 1440, 768, 430, and 390.

Why first: these are bounded, objectively verifiable improvements that strengthen photography and architecture without forcing a new visual direction.

### Stage 2 — Build the Journey flagship grammar using Japan

1. Use Japan as the reference chapter because it is the longest and most varied stress test.
2. Define no more than four shared editorial primitives: reading block, image-led expansion, authored pair, and chapter threshold.
3. Create a mobile scale score and preserve the meaning of pairs.
4. Do not reorder photographs or rewrite prose.
5. Validate the new grammar against Malaysia and the shortest chapter before declaring it shared.

This stage should create the largest visible leap.

### Stage 3 — Redesign the Journey index as an authored contents sequence

Use orientation-aware folios so each chapter has a distinct entrance without becoming five unrelated designs. Fix panoramic portrait crops as part of the same work.

### Stage 4 — Clarify Destination as a body of work

Differentiate its opening and add a visual-body introduction using only confirmed existing metadata. Do not add narrative prose. Reuse the shared primitives only where they serve a different Destination job.

### Stage 5 — Humanize People depth

Retain the hero and first sequence. Replace only the “Further encounters” grid with variable hierarchy or owner-approved suites.

### Stage 6 — Refine Archive mobile and global micro-typography

Increase mobile density, clarify “Another frame,” and review captions/filter/touch-target sizing. Preserve desktop Archive and viewer behavior.

### Stage 7 — Edit Home last

Once Journey, Destination, and People have distinct identities, reduce Home's competing movements and give it the clearest entrances into those systems. Do not redesign Home first: doing so now would encode unresolved downstream patterns into the publication's most visible surface.

### Keep untouched until later

- B&W's sequence and opening.
- Archive desktop field and viewer mechanics.
- Core font families and palette.
- Motion system beyond validation of new components.
- Approved Journey copy and photo order.
- Source photographs, color treatment, and owner focal decisions.
- Studio/Licensing surfaces unless a later audit gives them explicit scope.

## 8. Final owner recommendation

Proceed into implementation, but only with a tightly bounded Phase 15.2A rather than a site-wide redesign.

Recommended exact scope:

1. Fix responsive image-selection fidelity on audited flagship surfaces.
2. Clarify primary navigation and remove duplicate continuation paths.
3. Design and implement the new long-form Journey grammar on Japan only.
4. Author the 390–430px Journey sequence independently, including pair preservation and scale variation.
5. Validate Japan at 1440, 1280, 1024, 768, 430, and 390 with matched before/after captures, keyboard, reduced motion, console, crop integrity, and performance checks.
6. Stop for owner review before applying the grammar to Malaysia, Thailand, Laos, or Phu Quoc.

Do not begin with Home, B&W, Archive desktop, new motion, new typography, or photo recuration. Japan is the correct first implementation surface because it contains the hardest editorial and responsive problems; if the system works there without overpowering the story, it can become the publication's flagship grammar.

PHASE 15.1 — ELSEWHERE FLAGSHIP VISUAL AUDIT — OWNER REVIEW READY
