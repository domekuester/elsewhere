---
name: visual-qa
description: Use when visually auditing or validating rendered ELSEWHERE pages, comparing before and after screenshots, checking viewports, or deciding whether a public-facing visual change is ready.
---

# ELSEWHERE Visual QA

No source-code-only PASS verdicts.

1. Read `.codex/FLAGSHIP-DESIGN-STUDIO.md` and use its route matrix and severity model.
2. Capture BEFORE before implementation and AFTER from the same route, viewport, content state, reduced-motion setting, and scroll position.
3. For major templates cover 1440, 1280, 1024, 768, 430, and 390; scope narrower changes proportionately.
4. Inspect alignment, spacing, scale, crop, typography, overflow, header, rhythm, navigation, footer, focus, keyboard, reduced motion, console, broken assets, and layout shift.
5. Record P0–P3 findings with route, viewport, evidence, consequence, and recommended next action.
6. Store review output only under `artifacts/visual-review/`; never in public assets.

Use the browser, not screenshots alone, for keyboard and interaction checks. A score never substitutes for observations.
