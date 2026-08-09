# Phase 6 — Performance report

## Implemented

- GSAP, ScrollTrigger, and Lenis moved out of the critical shared bundle. The initial shared JavaScript is now approximately **1.5 KB**, while the **133 KB** motion bundle loads after the first rendering opportunity.
- Motion remains absent from Archive and Curation pages, and reduced-motion composition remains complete without JavaScript reveals.
- Astro images retain explicit dimensions, responsive WebP source sets, display-aware `sizes`, eager/high-priority loading only for genuine heroes, and lazy loading below the fold.
- Archive renders 24 lightweight thumbnails initially, loads additional frames in increments, uses `content-visibility`, and fetches display imagery only when the viewer opens.
- Vercel caching is immutable for fingerprinted Astro assets and regenerable photo derivatives.
- HTML compression is enabled.

## Measured production output

- Shared critical JavaScript: **1,474 bytes**
- Deferred motion JavaScript: **132,887 bytes**
- Global CSS: **44,482 bytes**
- Home HTML: **22,410 bytes**
- Archive browser catalog: **583,921 bytes** for 472 public-safe records
- Archive thumbnails: **25 MB total**, approximately **54 KB average**; only the opening increment is requested initially
- Archive display derivatives: **171 MB total**, approximately **372 KB average**; requested on demand
- Responsive home hero variants: **128–448 KB** for declared widths, with a 512 KB source fallback

## Remaining measurement

Real Core Web Vitals require the final CDN, domain, geographic traffic, and production caching. After deployment, run mobile Lighthouse/WebPageTest and collect privacy-respecting field LCP, CLS, and INP. The likely remaining performance opportunity is reducing the public archive catalog payload into a browser-specific projection if metadata growth materially increases it.
