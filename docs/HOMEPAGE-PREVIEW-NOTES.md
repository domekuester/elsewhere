# Homepage preview notes

## Selected photography

All visible photography comes from the ELSEWHERE master archive. The website uses capped, non-destructive working derivatives under `shaky-saturn/src/assets/photos/`; Astro generates responsive production variants from those derivatives.

- `island-of-clouds.jpg` — opening hero and France / La Réunion destination preview; master `P1300187.jpg` (`photo-0507`).
- `golden-portrait.jpg` — People chapter and category image; master `P1270057-2.jpg` (`photo-0432`).
- `lagoon-sunset.jpg` — Beaches category and featured journal story; master `P1310083.jpg` (`photo-0529`).
- `tokyo-street.jpg` — Urban category and Japan destination preview; master `P1230481.jpg` (`photo-0176`).
- `cirque-portrait.jpg` — Jungle category; master `P1270203.jpg` (`photo-0443`).
- `ocean-silhouettes.jpg` — Ocean category and full-width collection chapter; master `P1230676.jpg` (`photo-0183`).
- `boxing-guard.jpg` and `boxing-gloves.jpg` — encounter sequence and provisional Southeast Asia destination previews; masters `P1210857.jpg` and `P1210859.jpg` (`photo-0143`, `photo-0145`).
- `yellow-bird.jpg` — intimate supporting detail; master `P1280352.jpg` (`photo-0487`).

## Current browsing structure

The homepage has two complementary entry systems:

- Visual chapters: People, Beaches, Urban, Jungle, and Ocean.
- Provisional destinations: Japan, Malaysia, Thailand, and France / La Réunion.

The visual category links currently lead to relevant sections within the preview. The destination index is intentionally data-shaped and can later point to generated `/places/` or `/journeys/` routes without changing its component.

## Provisional content

Country assignments are editorial placeholders unless already supported by reviewed archive context. Malaysia and Thailand imagery must be verified before publication. No exact GPS coordinates are exposed. Story links and standalone category routes remain preview anchors until the corresponding Astro content collections are populated.

## Next iteration

1. Human-review a wider contact-sheet selection specifically for Beaches and Jungle.
2. Confirm destination assignments using Apple Photos metadata or manual travel records.
3. Add category and destination collection routes backed by Astro content schemas.
4. License and self-host the final display and interface typefaces after the working title is confirmed.
5. Author final captions, consent records for recognisable people, and social-sharing crops.
