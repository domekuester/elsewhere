# ELSEWHERE — Flagship design audit

## Executive judgment

The first homepage is visually competent and already avoids the worst travel-site conventions. Its strongest decisions are the full-bleed volcanic opening, the disciplined Obsidian/Ivory foundation, real photography throughout, semantic Astro structure, and reduced-motion baseline. It is a credible internal concept, not yet a memorable publication.

The main weakness is not taste; it is editorial specificity. After the hero, the page behaves too consistently like a designed portfolio: large heading, paragraph, photograph, repeat. Five visual categories share one horizontal component, destination names borrow photographs whose geography is not confirmed, and the warm portrait is treated as a generic luxury anchor rather than evidence of an encounter. The page needs more silence, smaller observations, sharper scale changes, and clearer separation between visual classification and place.

## Ruthless findings

### First viewport

- The photograph has genuine force and should remain.
- The headline is personal and memorable, but its desktop line break is awkward and its mobile wrapping becomes too fragmented.
- Navigation is legible but one item too dense. “Journal” is a vague destination at this stage.
- The intro paragraph and “Open the index” compete with the statement. Scrolling is already the invitation.
- The hero uses a broad lower gradient. It is functional, but should be reduced to a local edge treatment rather than tinting a large photographic area.

### Photography and sequence

- The same nine images do too much work. Repetition reads as limited curation, even though the archive contains 530 frames.
- Several stronger images were absent: the candid laughing portrait `P1210572.jpg`, storm beach `IMG_6647.jpg`, tree-root figure `1170554.jpg`, hand-held shell `P1230972.jpg`, and washing portrait `P1260248.jpg`.
- The existing People photograph is polished and beautiful, but it reads as a portrait session. A candid human encounter better expresses the publication’s central premise.
- The category rail presents every world with nearly identical ratios and metadata. Categories feel like filters, not visual worlds.
- The ocean image is strong enough to remain a full chapter anchor.
- Destination preview imagery makes unsupported geographic implications. This must be removed.

### Typography

- The system has useful sans/serif tension but relies entirely on generic system stacks.
- Display typography is often large without changing its spatial role; it needs stronger measure and baseline relationships.
- Captions at 0.68rem are too small for a flagship accessible experience.
- Repeated uppercase labels risk becoming interface scaffolding rather than editorial voice.

### Composition and rhythm

- Strong asymmetry exists, but the overall cadence is still section-after-section rather than short-film progression.
- There is insufficient quiet after the hero.
- There is no truly small image moment; every photograph asks for similar attention.
- Destination browsing is visually rich but conceptually dishonest because imagery implies location.
- The final photography sequence is attractive but resembles portfolio masonry and does not provide a strong next path.

### Interaction and motion

- Lenis and GSAP are used with restraint, but every `EditorialFigure` receives essentially the same reveal.
- The mobile menu is functional but visually utilitarian.
- Anchor navigation with smooth-scroll tooling needs careful testing; essential navigation must remain native under reduced motion.
- Hover previews should enhance destination discovery only after verified destination imagery exists.

### Mobile

- The opening image crop works, but the headline breaks into too many lines.
- The category rail turns into a uniform vertical stack, losing each world’s distinct character.
- Fixed translucent navigation is conventional and unnecessarily app-like for a publication.
- Portrait photography is correctly prioritized, but mobile needs more authored shifts in width, inset, and full bleed.

### Performance and architecture

- Astro image optimization, dimensions, lazy loading, and a priority hero are sound.
- Overlapping width requests generate 55 derivatives for nine source images, including several near-500 KB outputs.
- The same source is requested through different components with inconsistent width sets.
- GSAP, ScrollTrigger, and Lenis are acceptable for this page, but must remain the only client payload of consequence.
- The site architecture is currently homepage-only. Required content routes need explicit, typed models before pages multiply.

### SEO, accessibility, and finishing

- Metadata, canonical support, WebSite JSON-LD, semantic headings, and robots are present.
- Canonical URLs remain inactive until a production origin is configured, correctly avoiding invention.
- No 404 page exists.
- Focus states rely too heavily on browser defaults; they need a publication-specific treatment.
- Captions and muted copy require larger sizes and stronger contrast.
- Destination links currently point to homepage anchors rather than durable future routes.

## What survives

- Astro and handcrafted CSS architecture.
- `BaseLayout`, `EditorialFigure`, `SiteHeader`, and `SiteFooter` foundations.
- The volcanic hero, ocean anchor, Tokyo street image, Obsidian/Ivory palette, and ultramarine accent.
- Progressive enhancement: static HTML first, motion second.
- The principle that the working title is centralized.

## Creative direction

The revised page follows: **Open → Silence → Worlds → Intimacy → Detail → Scale → Index → Reflection → Continue**.

Two signatures define ELSEWHERE:

1. **The memory mark** — a short electric-ultramarine rule used only at editorial transitions, active navigation, and continuation links.
2. **The visual-world index** — five categories share one taxonomy but not one composition; their scale and crop express their emotional character.
