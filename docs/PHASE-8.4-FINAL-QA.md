# Phase 8.4 — Final QA

## Top edge

Home, Archive, Black & White Archive, People, Destinations, Japan, Black & White collection, and 404 were checked at 1600, 1440, 1280, 1100, 1024, 980, 768, 430, 390, and 320.

- Wordmark entirely inside web viewport: yes
- Wordmark fully clickable: yes
- Header top spacing: pass
- Browser-chrome collision: none observed
- Pointer blockers: 0
- Horizontal overflow: 0
- Font overflow: 0

## Interaction measurements

- ELSEWHERE desktop clickable bounds: approximately 144 × 44px
- ELSEWHERE mobile clickable bounds: approximately 144 × 44px
- Desktop navigation minimum practical target: 44px high
- Mobile menu trigger: approximately 72 × 44px
- Mobile navigation rows: at least 56px high

At 1440px the desktop wordmark begins 32px below the web viewport edge. At 390px and 320px it begins 16px below the web viewport edge before any device-provided safe-area inset.

## Keyboard and menu

- Tab / Shift+Tab: pass
- visible wordmark and navigation focus: pass
- Escape closes mobile menu: pass
- focus returns to menu trigger: pass
- mobile scroll lock: pass
- menu overlay top equals measured header bottom: pass

## Scroll and viewer

- Native/direct scroll preserved: yes
- Home wordmark return-to-top: immediate
- history entries added by return-to-top: 0
- delayed header state: none
- header above immersive viewer: no
- viewer interaction and focus regression suite: pass in Playwright

## Safari

Method: actual Safari application on macOS, local production preview, visible toolbar/favorites chrome, fresh top URLs, screenshots, and a physical UI click for the wordmark.

- Safari Home top: pass
- Safari wordmark click: pass
- Safari Archive: pass
- Safari B&W Archive: pass
- Safari destination (Japan): pass
- Safari viewer: core Safari rendering was not directly automated in this phase; viewer stacking and interaction passed Playwright, and viewer code/geometry were unchanged from the Safari-capable Phase 8.35 implementation. This is not represented as an independent Safari viewer interaction pass.

## Mobile

- 390: pass
- 320: pass
- safe-area architecture: pass
- logo touch target: pass
- menu: pass
- scroll: pass

## Regression protection

- Public photographs: 500
- Public B&W: 36
- Color leaks into B&W: 0
- B&W CTA misroutes: 0
- B&W viewer context: pass
- Owner-rejected image references: 0
- FAST & YUMMY SHAWARMA references: 0
- Barlow Condensed: active
- Literata: active
- SIL OFL licenses: unchanged and present

## Build and public boundary

- Build: pass
- Content validation: pass
- Launch/privacy validation: pass
- Broken public assets: 0
- Relevant console errors on valid routes: 0
- The expected HTTP 404 response on the 404 route was excluded from relevant console errors.
