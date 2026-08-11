# Phase 9.25 — QA

Every result was produced by running the check. Nothing here is inferred from source.

## Build and validation

```
npm run build
```

| Gate | Result |
| --- | --- |
| Content validation | **PASS** — 658 photos, 12 destinations, 10 journeys |
| Owner exclusion validation (source) | **PASS** — 24 rejected, 0 public references across 32 source surfaces |
| Astro build | **PASS** — 17 pages (was 16) |
| Production boundary | **PASS** — `/curate/` absent from `dist/` |
| Owner exclusion validation (built) | **PASS** — 0 public references across 26 built files and 3 derivative directories |
| Launch validation | **PASS** — 16 public HTML files, unique canonicals, complete social metadata, sitemaps consistent |
| Broken public assets | **0** |
| Relevant console errors | **0** |

Two owner-configuration items remain (`PUBLIC_CREATOR_NAME`, `SITE_URL`) — unchanged from Phase 9.2
and not software failures.

### Validators that caught this phase's own mistakes

- `modelReleaseStatus: NOT_APPLICABLE` — not in the declared `ReleaseStatus` vocabulary. Build
  refused until corrected to `NOT_REQUIRED`.
- `Destination germany has zero photos but is in-edit` — the new parent country did not follow the
  `planned` / `NEEDS_INFO` convention that Morocco, France and Vietnam already use.

## Rendered QA

18 routes × 10 viewports (1600, 1440, 1280, 1100, 1024, 980, 768, 430, 390, 320) at DPR 2, each
page fully scrolled to trigger every lazy image and reveal.

**Zero overflow · zero broken images · zero missing alt · zero failed requests · zero console
errors.**

Pages inspected: Home, Destinations, Düsseldorf, Japan, La Réunion, Essaouira, Archive,
`?world=people`, `?destination=dusseldorf`, `?destination=malaysia`, Black & White collection,
Black & White archive, About, Studio, Licensing, Contact, 404.

## Safari / WebKit

13 routes × 2 profiles (desktop 1440 at DPR 2, iPhone 14 device profile). **Clean across 28 page
loads**: no overflow, header and wordmark intact everywhere, no console errors.

## Accessibility

14 routes × 2 modes. One `h1` per page, no heading jumps, landmarks present, no missing alt, nothing
left hidden under reduced motion, no target under 24×24 except the documented inline-text mailto
exception on the contact form.

## Viewer, opened from Düsseldorf

| Check | Result |
| --- | --- |
| Archive filtered to Düsseldorf | 22, masthead and progress row agree |
| Viewer counter | `022` — correctly scoped |
| 24 forward steps | traversed exactly 22 unique frames and wrapped |
| Escaped into another destination | **never** |
| Destination link | "Open Düsseldorf ↗" → `/destinations/dusseldorf/` |
| Licensing enquiry | carries the correct archive reference |
| Full-resolution derivative | loaded and revealed; thumbnail used only as decode-time preview |
| Keyboard, focus return, scroll restoration | pass |

## Image fidelity

66 Düsseldorf derivatives verified (22 × thumbnail / archive / viewer): **0 undersized, 0 upscaled,
0 missing.** Pipeline unchanged — 960 / 1800 / 3200 px, q84 / q86 / q90, ICC retained, no
enlargement. Sources up to 4000 px, so every viewer derivative is a real 3200 px file.

## Mobile art direction

Düsseldorf at 390 px: frame widths 59–100% across six distinct values, alternating alignment, one
deliberate full-bleed moment, and a full-bleed close. It reads as an authored sequence, not a feed —
the same behaviour as Japan, La Réunion and Essaouira, which were measured alongside it at 430, 390
and 320.

## SEO and discovery

| Check | Result |
| --- | --- |
| Page sitemap | 14 URLs (was 13), includes `/destinations/dusseldorf/`, excludes `/curate/` |
| Image sitemap | 595 entries across 6 pages |
| Canonical | unique, one route only — `/destinations/dusseldorf/` |
| Title | "Düsseldorf photographs — Elsewhere" — not "travel photography", which would be untrue |
| Open Graph | purpose-made 1200×630 card at `/social/dusseldorf.jpg` |
| Structured data | CollectionPage, BreadcrumbList, 12 ImageObject entries with truthful credit and copyright |
| Landmark or district names | **none anywhere** |
| Thin pages, tag pages, generated articles | **none** |

## Privacy

| Check | Result |
| --- | --- |
| GPS in source files | **0 of 22 had any** |
| GPS, latitude, longitude in public catalog | absent |
| `rightsNotesInternal`, `modelReleaseStatus`, `propertyReleaseStatus` in `dist/` | absent |
| `internalNotes`, `sourcePath`, `assets-source`, source folder names in `dist/` | absent |
| `ownerRejected` / `editorialHold` registers in `dist/` | absent |

## Masters

SHA-256 verified before and after the entire phase: **22/22 byte identical.**
