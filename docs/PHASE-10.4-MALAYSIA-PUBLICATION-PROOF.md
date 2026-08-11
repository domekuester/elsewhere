# Malaysia Journey — publication proof

What changes when `status` goes from `OWNER_REVIEW` to `PUBLISHED` in `src/data/journey.ts`.

Not a prediction. The site was built in both states and the output compared.

## The diff

| | `OWNER_REVIEW` (now) | `PUBLISHED` |
| --- | --- | --- |
| Pages built | 22 | 23 |
| `/journey/malaysia/` | builds | builds |
| `/journey/` (series index) | **does not exist** | builds |
| Story `robots` | `noindex, nofollow` | `index, follow, max-image-preview:large` |
| Index `robots` | — | `index, follow, max-image-preview:large` |
| Sitemap entries | 0 | `/journey/` and `/journey/malaysia/` |
| Home link | absent | *Read the Malaysia story →* in the existing story-feature block |
| `/archive/place/malaysia/` link | absent | *Read the story →* under the opening |
| Story → index link | absent | *The Journey →* in the closing aside |
| Public HTML files | 21 | 23 |

Everything in the right-hand column is gated on `publishedJourneyStories()`. Nothing can point at an
unpublished story, and the index cannot exist without one — it is a catch-all route whose only path
is conditional, the same construction Field Notes uses.

## What does not change

| | |
| --- | --- |
| Canonical | `/journey/malaysia/` in both states — no redirect, no URL change |
| Open Graph | title, description and image identical; the image is the hero derivative at 2560px |
| Schema | `Article` + `BreadcrumbList` + 21 `ImageObject` entries, identical |
| Story → destination link | `/archive/place/malaysia/` in both states, because Malaysia's chapter is still `in-edit`. If the chapter is ever published the link retargets itself to `/destinations/malaysia/` |
| Image sitemap | already contains every story frame in both states — it indexes the archive, not the story |
| `robots.txt` | never mentioned `/journey/`; nothing to change |
| Global navigation | unchanged. One story is not a navigation category |
| Previous / next story | both `null`. The series has one entry; the fields exist for Story 02 |

## Discovery, and the recommendation

Three entry points exist and all three activate together. That is the right number, and the
recommendation is to leave all three on:

1. **`/archive/place/malaysia/`** — the layered route the story was designed for. Photographs first,
   then the option of going deeper. This is the important one.
2. **The Journey index** — where the series lives so a second story costs nothing to add.
3. **Home** — a single `editorial-link` inside the story-feature block that already exists. No new
   section, no layout change, no photograph added to Home's sequence.

**Not recommended:** adding *Journey* to the top navigation. Revisit at three or four stories.

## Before publishing, one thing to know

`publishedAt` is `null`. It drives `datePublished` in the `Article` schema, which is currently
omitted rather than invented. Set it to the real date on the day you publish, or leave it null and
the schema simply stays quiet — both are honest, and neither blocks anything.

## To publish

One field, in `src/data/journey.ts`:

```
status: 'OWNER_REVIEW',   →   status: 'PUBLISHED',
```

Then `npm run build`. Expect 23 pages and 23 public HTML files.

## Verification record

Built in both states on 11 August 2026. `npm run build` green in both: content validation passed
(689 photos, 12 destinations), owner exclusion verification PASS (24 rejected, 0 public references),
launch validation passed (unique canonicals, complete social metadata, sitemap and image sitemap
consistent). The story was left in `OWNER_REVIEW`.
