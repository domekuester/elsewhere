# Phase 6 — Social sharing

Every public page now emits absolute Open Graph and Twitter large-image metadata with image alternative text. Five regenerable, photograph-only **1200×630** crops live in `public/social/`:

- Home — La Réunion mountain/cloud opening
- Archive — turbulent cobalt water
- People — food vendor at work
- Black & White — solitary harbour structure and horizon
- Japan/Destinations — gull approaching outstretched hands

The crops use approved real project photography with no synthetic overlays or invented location copy. `npm run social:images` regenerates them from public-safe derivatives or the curated web asset; masters are untouched.

Final platform testing requires a public HTTPS deployment. After the domain is live, inspect Home, Japan, People, and Black & White in the major sharing debuggers and clear cached previews after any image change.
