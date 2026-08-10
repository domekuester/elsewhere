# Phase 8.1 — Finding matrix

Canonical count: Claude's 20-item weakness table. Smaller grouped defects are recorded under item 20 or in the master judgment.

| ID | Priority | Claude finding | Verdict | Evidence | Recommended Phase 8.2 action | Owner needed? |
| --- | --- | --- | --- | --- | --- | --- |
| C-01 | P0 | Japan frames 5–10 become postage stamps | ACCEPT | 11 images total; only sequence classes 1–4 have grid placement; remaining six auto-place into ~1/12-width tracks | Add variable-length layout contract; owner re-edit separately | No for layout; yes for edit |
| C-02 | P0 | Archive world filters expose empty taxonomy | ACCEPT | 500 total; 23 classified; People 2, Urban 1, Beaches 1, Jungle 5, Ocean 3, B&W 10 | Gate sparse controls; treat worlds as reviewed collections; curate before reinstating | No for gating; yes for curation |
| C-03 | P1 | Typography depends on Apple hardware | PARTIAL | Avenir Next Condensed/Baskerville lead stacks; fallbacks materially differ; no cross-platform render or license plan | Produce platform comparison; owner chooses self-hosted or art-directed fallbacks | Yes |
| C-04 | P1 | Process language leaks publicly | ACCEPT | Story placeholder, Working title, developing, confirmed/editorial review, existing selection, still being edited | Delete placeholders; translate necessary uncertainty into site voice | No |
| C-05 | P1 | Repetition makes 500 frames feel shallow | PARTIAL | Market woman ×3; Japan repeats four Home color frames and six B&W-room frames | Protect Home People spread; owner re-edit deep surfaces; allow purposeful Home→collection continuity | Yes |
| C-06 | P1 | 478/500 archive alts are identical | ACCEPT | Exactly 478 generic unclassified alts; only eight unique strings total | Human-review queue; correct known alts; factual temporary labels only; fix button names | Yes for authored descriptions |
| C-07 | P1 | Viewer focus restoration broken | ACCEPT | Unfocusable `.archive-image` span saved; close calls `.focus()` on it | Store initiating button separately from animation geometry | No |
| C-08 | P1 | Japan hero crop removes people/place signal | PARTIAL | Render is abstract water; source silhouettes are at extreme bottom and cover crop removes them | Owner chooses lower crop, non-cover composition, or new hero | Yes |
| C-09 | P1 | Catalog images lack responsive DPR sources | ACCEPT | Archive/destination `<img>` have one `src`; no `srcset`/`sizes`; 960px thumb is insufficient for several DPR2 slots | Emit responsive candidates from existing roles and explicit `sizes`; verify selection/network | No |
| C-10 | P1 | Hero scroll arrow points sideways | ACCEPT | Render shows left arrow; glyph inherits vertical writing mode | Isolate glyph from vertical writing mode | No |
| C-11 | P2 | People depth contradicts promise | PARTIAL | People has four images; one Home repeat; four can still be a deliberate first set | Soften promise now; curate additions only with consent and owner review | Yes for additions |
| C-12 | P2 | Second mountain/environment beat repeats hero | NEEDS_OWNER_DECISION | Same terrain/weather register; narrative return is also plausible | Compare keep/remove/replace sequences | Yes |
| C-13 | P2 | B&W room too sparse; two weak frames | NEEDS_OWNER_DECISION | Long spacing is measurable; emotional strength/density is taste | Owner reviews current, tightened, and expanded proofs | Yes |
| C-14 | P2 | Worlds collision near 1024 | ACCEPT | `world-4` keeps `margin-top:-2rem` until 900px; Claude's 1024 overlap is structurally plausible and recorded rendered evidence | Neutralize/re-slot offset at 980–1100; retest 980/1024/1100 | No |
| C-15 | P2 | Buddha frame is stock-replaceable | NEEDS_OWNER_DECISION | Familiar motif is not objective evidence of weak authorship | Provide 2–4 real archive alternatives; owner decides | Yes |
| C-16 | P2 | Lighthouse alt describes wrong subject | ACCEPT | Image visibly shows a breakwater lighthouse; source repeatedly says solitary figure | Correct factual alt across all surfaces | No |
| C-17 | P2 | Premise/count text floats on wide screens | PARTIAL | Wide gaps can dissociate text; prescribed relocation is not uniquely correct | Low-risk alignment/spacing study; preserve index concept | Possibly |
| C-18 | P2 | People H1 breaks into four-line rag | ACCEPT | Explicit two-line `<br>` conflicts with desktop `max-width:8ch` | Remove conflicting width cap; preserve authored break | No |
| C-19 | P3 | Public future-collections roadmap | ACCEPT | Four public items explicitly marked developing | Remove until a real collection exists | No |
| C-20 | P3 | Counter/case/touch ring/mobile header polish group | PARTIAL | Counter uses 2 digits vs 3; CSS capitalization can produce “Black And White”; mobile header is visibly 81px dark band; modality unverified | Fix safe label inconsistencies; separately prototype header and modality behavior | Yes for header taste |
| CODEX-NEW-01 | P1 | Archive button accessible name suppresses image description | ACCEPT | Explicit `aria-label="Open frame N"` overrides descendant image alt in control naming | Include concise visual description in button accessible name | No, except description authoring |
| CODEX-NEW-02 | P2 | Claude's People candidate count is stale | ACCEPT | Current build validates 15 People candidates, not eight | Scope curation against current queue | Yes |

## Protected-element matrix

| Element | Verdict |
| --- | --- |
| Current Home hero photograph | PROTECT |
| Hero condensed-caps + italic-serif relationship | PROTECT |
| Homepage market-woman People spread | PROTECT composition; reduce duplicates elsewhere only with approval |
| Viewer geometry | PROTECT; accessibility fixes only |
| Native scrolling | PROTECT; no heavy smooth scrolling |
| Japan hero | MODIFY or REPLACE only after OWNER decision |

## Agreement totals

ACCEPT 11 · PARTIAL 6 · REJECT 0 · NEEDS_OWNER_DECISION 3 · weighted agreement 70%.
