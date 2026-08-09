# Phase 6 — Privacy-conscious analytics

## Implemented architecture

`src/scripts/analytics.ts` exposes `window.elsewhereTrack(name, context)` and dispatches an `elsewhere:analytics` CustomEvent containing only event name, page path, and a non-personal context label. It sends nothing to a third party, sets no cookies, fingerprints nobody, and does not access curation or private photo metadata.

Current hooks cover navigation, People entry, Archive entry/load-more, viewer open/previous/next/close, Black & White entry, and editorial continuation links. A future provider adapter can listen for `elsewhere:analytics` after the owner selects a privacy posture.

## Event vocabulary

- `navigation_open`
- `people_open`
- `archive_open`, `archive_more`
- `viewer_open`, `viewer_previous`, `viewer_next`, `viewer_close`
- `black_white_open`
- `related_content_click`
- later: `destination_open`, `story_open`, `collection_open`, `share_intent`, `newsletter_click`, `print_interest_click`

Do not attach filenames, exact location, person identity, owner notes, search text, or raw URLs containing sensitive query data. Prefer a cookieless, EU-friendly provider or first-party aggregate endpoint. Add consent UI only if the chosen provider/legal basis requires it; do not ship a decorative cookie banner with no tracker.
