# Phase 8.4 — Navigation Master Pass

## Desktop

- wordmark and every primary navigation item now provide a 44px-high practical target
- underline timing was shortened to 350ms using the established easing
- `aria-current="page"` receives the same quiet line treatment as hover/focus
- left and right positioning remains aligned to the shared responsive gutter
- typography remains Literata for the wordmark and the existing quiet UI treatment for navigation

## Mobile

- logo and menu trigger are both 44px high
- overlay top and height derive from the real safe-area-aware header height
- bottom padding includes `safe-area-inset-bottom`
- opening is slightly faster while retaining the established opacity/vertical movement
- the current page is communicated with restrained contrast and arrow position rather than a loud tab
- Escape closes the menu and restores focus; Tab/Shift+Tab remain trapped within the open menu

## Terminology

No public nouns or URLs changed. `Explore` remains the navigation verb leading to the page titled `Archive`; `Enter the Archive` remains a continuation CTA. The two words therefore have distinct grammatical roles rather than competing destinations. Black & White context continues to route to `/archive/black-and-white/`.

## Motion and performance

No library, observer, continuous scroll listener, sticky animation, or header auto-hide was introduced. Navigation remains stable during scroll and direct/native scrolling is unchanged.
