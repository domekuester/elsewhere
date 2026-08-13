# Owner photo exclusions — canonical register

The owner is the final editor of ELSEWHERE. A photograph listed here is permanently withdrawn from
the public publication. Automated curation must never re-enable one; only an explicit owner reversal can.

This document is the human-readable register. It is **not** what the site enforces.

## Where the exclusion actually lives

| Layer | File | Role |
| --- | --- | --- |
| Canonical machine-readable register | `data/public-image-exclusions.json` → `ownerRejected[]` | The authoritative list, keyed by stable photo id |
| Per-photograph publication state | `data/photo-curation.json` → `assignments[id]` | `visibility: "do-not-publish"`, `publicationStatus: "PRIVATE"`, `ownerDecision: "OWNER_REJECTED"` |
| Public catalog generation | `scripts/build-photo-catalog.mjs` | Excludes rejected ids and deletes their thumbnail/archive/viewer derivatives |
| Regeneration guard | `scripts/classify-owner-timeline.mjs` | Re-applies the rejected state on every regeneration |
| Verification | `scripts/verify-owner-photo-exclusions.mjs` (`npm run validate:exclusions`) | Fails the build if any rejected photograph regains a public reference |

`public/data/photo-catalog.json` is generated. Every public surface — Home, Archive, Black & White,
People, Destinations, Collections, the immersive viewer, and viewer Next/Previous — reads from it, so
removal from the catalog removes the photograph from the entire public experience at once.

Master photography in `assets-source/photos/` is never touched. Exclusion removes publication
eligibility, not the photograph.

## Archive numbers

The three-digit archive number is the **stable photographic id** (`photo.index`), not a display
position. Surviving photographs are never renumbered when an exclusion is applied; the resulting gaps
in the public number sequence are expected and meaningful.

## Register

`Archive #` is the archive number at the time of rejection, which remains stable.

| Archive # | Stable id | Filename | Phase | Reason category | Destination truth | Public refs |
| --- | --- | --- | --- | --- | --- | --- |
| 024 | photo-0024 | 1210412-2.jpg | 7.5 | business-identifiable | Malaysia | 0 |
| 025 | photo-0025 | 1210412.jpg | 7.5 | business-identifiable | Malaysia | 0 |
| 026 | photo-0026 | 1210415-2.jpg | 7.5 | business-identifiable | Malaysia | 0 |
| 027 | photo-0027 | 1210415-3.jpg | 7.5 | business-identifiable | Malaysia | 0 |
| 028 | photo-0028 | 1210415-4.jpg | 7.5 | business-identifiable | Malaysia | 0 |
| 029 | photo-0029 | 1210415.jpg | 7.5 | business-identifiable | Malaysia | 0 |
| 030 | photo-0030 | 1210417.jpg | 7.5 | business-identifiable | Malaysia | 0 |
| 041 | photo-0041 | IMG_8166.jpg | 8.45 | architecture | **Thailand** (owner-confirmed) | 0 |
| 042 | photo-0042 | IMG_8172.jpg | 8.45 | architecture | **Thailand** (owner-confirmed) | 0 |
| 058 | photo-0058 | P1020289.jpg | 8.45 | architecture | Malaysia | 0 |
| 097 | photo-0097 | P1210519.jpg | 8.45 | personal-social | Malaysia | 0 |
| 098 | photo-0098 | P1210520.jpg | 8.45 | personal-social | Malaysia | 0 |
| 099 | photo-0099 | P1210521.jpg | 8.45 | personal-social | Malaysia | 0 |
| 101 | photo-0101 | P1210526.jpg | 8.45 | personal-social | Malaysia | 0 |
| 105 | photo-0105 | P1210572.jpg | 5.5 | subject-dignity | Malaysia | 0 |
| 107 | photo-0107 | P1210624.jpg | 8.45 | personal-social | Malaysia | 0 |
| 141 | photo-0141 | P1210854.jpg | 8.45 | personal-social | Malaysia | 0 |
| 142 | photo-0142 | P1210856.jpg | 8.45 | personal-social | Malaysia | 0 |
| 143 | photo-0143 | P1210857.jpg | 8.45 | personal-social | Malaysia | 0 |
| 144 | photo-0144 | P1210858.jpg | 8.45 | personal-social | Malaysia | 0 |
| 149 | photo-0149 | P1210881.jpg | 8.45 | personal-social | Malaysia | 0 |
| 152 | photo-0152 | P1210900.jpg | 8.45 | personal-social | Malaysia | 0 |
| 155 | photo-0155 | P1210909.jpg | 8.45 | personal-social | Malaysia | 0 |
| 351 | photo-0351 | P1260248.jpg | 7 | subject-dignity | Japan | 0 |

**Total: 24 owner-rejected photographs.**

Reason categories are deliberately coarse. This register records editorial decisions, not descriptions
of the people in the photographs.

## Destination truth for excluded photographs

`data/destinations.json` is a generated index of *publishable* photography, so excluded photographs do
not appear in it. Their factual destination is held in `data/photo-curation.json`, which is the
canonical per-photograph record. Frames 041 and 042 are stored there as Thailand while remaining
unpublished — correct geography does not grant publication.

## Adding an exclusion

1. Add an entry to `ownerRejected[]` in `data/public-image-exclusions.json` (stable id, archive index, filename, reason category, phase).
2. Run `npm run content:classify` — this applies the publication state, regenerates the public catalog, and deletes the public derivatives.
3. Run `npm run validate:exclusions` and `npm run build`.
4. Add the row to the register above.

Never implement an exclusion with CSS, `display: none`, or by removing a single component reference.

## Phase 14.1A — global owner rejection of eleven edited exports

Eleven photographs were rejected by the owner during the Japan Story 05 photo re-cut. They were
first recorded as a Story-only editorial exclusion; the owner then corrected the scope: they are
**global public rejections**. They are now in `ownerRejected[]`, taking the register from 24 to 35.

| Archive # | Photo id | Export filename | Capture |
| --- | --- | --- | --- |
| 195 | photo-0195 | P1230834.jpg | 16 May 2025 |
| 212 | photo-0212 | P1240278.jpg | 22 May 2025 |
| 229 | photo-0229 | P1240454.jpg | 23 May 2025 |
| 230 | photo-0230 | P1240460-Enhanced-NR.jpg | 23 May 2025 |
| 231 | photo-0231 | P1240551.jpg | 23 May 2025 |
| 232 | photo-0232 | P1240557.jpg | 23 May 2025 |
| 233 | photo-0233 | P1240560.jpg | 23 May 2025 |
| 260 | photo-0260 | P1240900.jpg | 29 May 2025 |
| 264 | photo-0264 | P1240944-Enhanced-NR.jpg | 29 May 2025 |
| 277 | photo-0277 | P1250207.jpg | 7 Jun 2025 |
| 289 | photo-0289 | P1250536.jpg | 8 Jun 2025 |

### The rejection is version-scoped, not capture-scoped

This is the first rejection set the owner intends to **re-edit later**. The register therefore
records *which version* was rejected: each entry carries `scope: "EXPORT_VERSION"` and a
`rejectedExport` block with the sha256, byte size, dimensions and source path of the exact file.
The private original is preserved untouched — nothing was deleted, moved, renamed, re-encoded, or
had metadata rewritten.

| Layer | Effect |
| --- | --- |
| private original capture | preserved, unmodified, never publicly served |
| the rejected edited export | globally blocked on every public surface |
| derivatives of that export | deleted and blocked from regeneration |
| a renamed copy of that export | blocked — exact filename, stable id and the perceptual sweep over `src/assets/photos/` all still apply |
| an alternate export of the same rejected edit | blocked — `photo-0211` (`P1240278-2.jpg`) stays in its duplicate family so it cannot become a substitute |
| a future owner re-edit | **allowed** — a new file, new id, new sha256; it enters the inventory and OWNER_REVIEW and is judged on its own |

### Verifier change that made the last row true

`scripts/verify-owner-photo-exclusions.mjs` matched rejected photographs by bare filename stem.
Rejecting `P1240278.jpg` therefore also matched `P1240278-2.jpg`, and would have matched a future
`P1240278-4.jpg` — so the owner's re-edit would have failed the build the moment it appeared. Two
narrow rules replaced that:

1. **Derivatives are matched by index prefix**, not substring: a file belongs to a photograph only
   when its four-digit prefix is that photograph's own inventory index. `0212-P1240278.jpg` is
   caught; `0999-P1240278-4.jpg` is not.
2. **The stem safety net masks known sibling exports** before matching, so a reference to a
   genuinely different registered version is invisible while an unregistered or hand-written
   reference is still caught.

A third rule was added: if the file under a rejected filename stops matching its recorded sha256,
the export was replaced in place. Blocking stays on — publishing an unreviewed file is the worse
failure — and the mismatch is printed as a notice so the owner can register the new version
deliberately instead of inheriting a decision made about a different one.

The perceptual-signature sweep over `src/assets/photos/` remains capture-level by design. That
folder holds hand-renamed derivatives for Home, People and Black & White; a near-identical re-edit
appearing there without review is exactly what it should catch. It does not gate the OWNER_REVIEW
path.
