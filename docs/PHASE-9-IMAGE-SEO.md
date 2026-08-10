# Phase 9 — Image SEO and search opportunity

Photography discovery is the largest realistic organic channel here, and the one most sites get
wrong. This covers what was implemented and where the real opportunity sits.

---

## Why image search matters most

485 photographs, a handful of text pages. Text SEO competes against every travel publisher on earth.
Image search competes on whether the photograph is good, properly described, and technically
discoverable — a contest this archive can actually win.

## What was implemented

### Image sitemap — the main lever

`/sitemap-images.xml` declares **532 image entries** across three pages: every published photograph
against `/archive/`, the 36 monochrome frames against `/archive/black-and-white/`, and the Japan
sequence against its destination chapter.

This exists because **the archive loads incrementally through JavaScript.** A crawler that does not
execute it sees only the 24 server-rendered opening frames. Without the image sitemap, roughly 95%
of the archive would be effectively invisible to image search. This is the single highest-value SEO
change in Phase 9.

It is generated from the public catalog, so owner-rejected and private photographs are excluded by
construction — verified by `validate-launch.mjs`, which also confirms every declared asset exists.

### ImageObject structured data

Emitted for the server-rendered archive opening (24 frames), every photograph on a destination
chapter, and Field Note heroes.

Each carries only verifiable values:

| Field | Value |
| --- | --- |
| `contentUrl` | Real derivative URL |
| `width` / `height` | Real dimensions |
| `caption` | Reviewed alt text or owner caption |
| `contentLocation` | Only when the destination is confirmed |
| `creator` | `Person` when a creator name is set, else `Organization` |
| `creditText` | `<creator> / ELSEWHERE` |
| `copyrightNotice` | `© <creator>. All rights reserved.` |
| `copyrightYear` | Real capture year |
| `acquireLicensePage` | **Only** when the frame's rights state permits an enquiry |

**No `license` URL is published.** That field should point at concrete licence terms, and none exist
— every licence is negotiated per photograph and per use. Publishing a `license` URL that resolved
to a page with no terms would be a false signal to both Google and a potential licensee.

`acquireLicensePage` is different: it asserts only that there is a place to ask, which is true.
Frames marked `NOT_FOR_LICENSE` never receive it. This is what makes photographs eligible for
Google's licensable-image treatment without claiming clearance that has not been confirmed.

### Technical foundations

- All images live on crawlable public routes with real URLs
- Explicit `width`/`height` on every image — no layout shift, and crawlers get dimensions
- Responsive `srcset` at thumbnail / archive / viewer sizes
- Truthful alt text; frames without reviewed alt text carry an empty string rather than an invented
  description
- `max-image-preview:large` on every indexable page — required for large image previews
- Stable derivative filenames keyed to the permanent archive number
- Breadcrumb structured data on archive routes

### Privacy

No GPS, no coordinates, no owner notes, no master source paths, and no private rights fields reach
any public artefact. Enforced in `validate-content.mjs` and `validate-launch.mjs`; both fail the
build on violation.

---

## Search opportunity map

Mapping **existing** content to plausible intent. No keyword volumes are given: there is no data
here, and invented numbers would be worse than none.

| Existing content | Plausible intent | Strength |
| --- | --- | --- |
| Japan chapter (216 photographs, 11 sequenced) | Japan travel photography, Japan street photography | **Strongest** — most depth, only published chapter |
| Black & White archive (36 frames) | Black and white travel photography, monochrome street | **Strong** — a distinct, well-defined body of work |
| La Réunion (114 photographs) | La Réunion photography, Cirque landscapes | **High potential** — unpublished; the biggest single win available |
| Malaysia (88), Thailand (32), Phu Quoc (21) | Destination photography | Moderate — needs curation to threshold |
| People | Travel portrait, encounter photography | Moderate — small published set |
| Studio | Hospitality photographer, hotel photography *(place)* | **Commercially valuable** — low volume, high intent |
| Licensing | Travel photography licensing | Low volume, very high intent |

### Where to invest

1. **Publish La Réunion.** 114 photographs including the two strongest landscapes in the archive.
   Roughly doubles indexable editorial surface for a few hours of curation.
2. **Field Notes for specific places.** "A walk through X" beats "10 things to do in X" — because the
   photographs are real and the observations are first-hand.
3. **Reviewed alt text.** Most frames still carry generic or empty alt text. Real descriptions are
   the highest-leverage image-search improvement available, and each one is thirty seconds of work.
4. **Local commercial intent.** "Hotel photographer [city]" is low-volume, high-conversion, and the
   Studio page already exists to answer it.

### What was deliberately not done

**No page per photograph.** 485 thin pages built around a single image with no surrounding text is
programmatic SEO, and it would dilute the genuinely strong pages. Photographs are discovered through
the image sitemap and open in the viewer, which is the right experience and the right signal.

**No tag, date, or category-combination pages.** Same reasoning.

**No `license` URL** in structured data, as above.

**No sitemap for the `/collections/` index.** Thin page, `noindex` on the page itself rather than a
robots.txt block — so crawlers can actually read the directive.
