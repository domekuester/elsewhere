# Phase 8.3 — Typography finalization report

Date: 10 August 2026

## Approved production system

Option C is implemented in production.

- **Display / condensed sans:** Barlow Condensed Regular.
- **Editorial serif:** Literata Regular and Literata Italic.
- **Interface support:** native cross-platform UI stack: `-apple-system`, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif.

The interface stack remains deliberately neutral. Barlow Condensed carries architectural headings and Literata carries the identity-defining editorial moments.

## Font delivery

Three WOFF2 files are self-hosted under `public/fonts/`. There are no CDN, font-service, analytics, or third-party runtime requests.

| File | Role | Size |
| --- | --- | ---: |
| `barlow-condensed-regular.woff2` | Display, 400 normal | 31KB |
| `literata-regular.woff2` | Editorial, 400 normal | 55KB |
| `literata-italic.woff2` | Editorial, 400 italic | 57KB |

Total production font payload is approximately 143KB. Barlow Condensed Regular and Literata Italic are preloaded because both occur in the Home hero. Literata Regular loads when required. All faces use `font-display: swap`; `font-synthesis: none` prevents artificial bold or italic.

The WOFF2 files were produced from the owner-approved upstream font files without removing language coverage. Exact upstream SIL OFL 1.1 notices are included as `LICENSE-Barlow.txt` and `LICENSE-Literata.txt`. Embedded font metadata also points to the OFL.

## Fallback strategy

- Display: Barlow Condensed → Arial Narrow → Helvetica Neue Condensed → generic sans-serif.
- Editorial: Literata → Georgia → Times New Roman → generic serif.
- UI: platform-native sans stack.

The local production faces loaded successfully in every rendered case. The fallbacks are failure-path insurance rather than the cross-platform identity layer; self-hosting makes the approved faces consistent across macOS, iOS, Windows, Android, and Linux browsers that support WOFF2.

## Responsive tuning

The existing scale and protected hero relationship were retained. One targeted mobile correction changed the hero measure from 10ch to 14ch, keeping “remember it.” together at 430px, 390px, and 320px. The display remains quiet and bottom-weighted; no hero scale or photographic crop was redesigned.

Destination names now use Literata on both Home and the Destinations index, resolving a hierarchy mismatch. People remains two authored lines at desktop and mobile except for the necessary additional wrap at 320px. Archive, Japan, Black & White, 404, navigation, CTAs, and footer headings retain their established roles.

Rendered typography QA covered seven headline surfaces across ten viewports: 70 combinations at 1600, 1440, 1280, 1100, 1024, 980, 768, 430, 390, and 320. Results:

- Barlow Condensed loaded: 70/70.
- Horizontal overflow: 0/70.
- Home hero: one display line plus one editorial line on desktop; one display line plus two editorial lines on 430/390/320.
- Destinations heading: one line at every tested viewport.
- Japan title: one line at every tested viewport.
- People hierarchy: no clipping or overflow.

## Supporting refinements

- Removed forced capitalization that rendered “Black And White”; the authored “black and white” label is preserved.
- Removed viewer caption capitalization so authored casing survives.
- Added normal kerning globally and tabular numerals to Archive/viewer counters.
- Increased small photographic caption sizing and leading slightly.
- Added visible focus treatment for public selects.

## Limitations

Automated rendered QA used installed Chrome 152. Safari and Firefox were not separately automated in this environment. WOFF2 delivery, explicit font styles, standard CSS features, and native fallbacks keep implementation risk low, but final device sampling remains appropriate before a public launch.
