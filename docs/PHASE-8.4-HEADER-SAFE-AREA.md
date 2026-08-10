# Phase 8.4 — Header Safe Area

## Root cause

The shared header was positioned at `top: 0` with one fixed visual padding value. It did not opt into viewport safe-area handling, and the wordmark anchor's interactive rectangle was effectively the glyph box. Mobile compounded this with a fixed `4.9rem` menu offset that assumed a single header height.

The defect was therefore a combination of absolute/fixed top anchoring, absent safe-area input, undersized link geometry, and a separately maintained menu offset. No transform, scroll-reveal state, negative top margin, or pointer-event overlay caused it.

## New architecture

One shared system now defines:

- `--header-safe-top`: a deliberate minimum top inset plus `env(safe-area-inset-top)`
- `--header-row`: the 44px interaction row
- `--header-bottom`: restrained lower breathing room

The header, mobile overlay start, and mobile overlay height all consume those variables. The viewport metadata now uses `viewport-fit=cover`, allowing WebKit to provide safe-area inset values where applicable without changing ordinary desktop rendering.

Desktop uses a 32px minimum top inset. Mobile uses a 16px minimum plus device safe area. The visual wordmark remains unchanged, while its anchor becomes approximately 144 × 44px. Its focus outline remains wholly inside the viewport.

## Stacking and pointer strategy

The existing deliberate layers remain: page content below `--z-header: 30`, viewer at 100. No new z-index values or pointer-event workarounds were added. Five-point hit testing across every required page/viewport found zero blockers over the wordmark.

## Home behavior

Outside Home, the wordmark navigates to `/`. On Home, it immediately returns to `scrollY = 0`, removes an existing hash with `history.replaceState`, and does not add history or introduce smooth-scroll delay.

## Safari verification

Actual macOS Safari was opened against the local production preview with normal toolbar and favorites chrome visible. The fresh Home top state showed clear separation between browser chrome and the wordmark. A real on-screen wordmark click from Archive navigated to Home. Actual Safari screenshots also confirmed the B&W Archive and Japan header environments.
