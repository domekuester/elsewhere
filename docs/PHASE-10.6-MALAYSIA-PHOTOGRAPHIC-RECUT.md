# Phase 10.6 — Malaysia photographic recut

The owner rejected two photographs in the published story as too processed, and supplied five he had
edited himself. This is the recut that followed.

The prose was not touched. Neither was the layout system, the header, the geography corrections or
the publication state.

## Removed

| Frame | Why |
| --- | --- |
| `photo-0057` `P1000568.jpg` | **Owner rejection.** The closer: a beach under heavy sunbeams with an HDR signature. The treatment was louder than the photograph. |
| `photo-0132` `P1210805.jpg` | **Owner rejection.** A hammock under palms — dark foreground, hard cyan water, strong orange/cyan separation. |
| `photo-0121` `P1210748.jpg` | Same session and same treatment as `photo-0132`: blown white sand with a magenta cast, a hard cyan sky, yellowed greens. The owner named two; this is a third on his own stated grounds. |
| `photo-0104` `P1210550.jpg` | The jetty pavilion — orange sky against cyan water, the same processed family. Its job, arriving by water, is now done by an owner-edited frame. |
| `photo-0083` `P1210248 Kopie.jpg` | A tower going up into cloud. `photo-0694` says the same thing better and is owner-confirmed. |
| `photo-0092` `P1210427.jpg` | Its pair partner. Two sky-against-concrete portraits were one idea twice. |
| `photo-0103` `P1210537.jpg` | A Phase 10.4 stand-in for the weather paragraph. `photo-0693` is the owner's own, and confirmed Kapas. |
| `photo-0163` `P1210959.jpg` | The third big sea-and-cloud frame in the closing five, and the most heavily teal of the survivors. |

**None was deleted, owner-rejected globally, or withheld.** All eight remain public archive
photographs with their source masters untouched. The correction is *out of this story*, nothing more.

## Added — five owner-edited files

Found at `assets-source/photos/Mobile Fotos Malaysia/`. All Panasonic DMC-FZ330, all sRGB, no GPS.

| File | ID | Dimensions | Captured | Role in the story |
| --- | --- | --- | --- | --- |
| `Kapas 01.JPG` | `photo-0690` | 4000 × 3000 | 22 Aug 2024 | **The camp.** Looking out from the shade of a shelter past hanging floats to the sea. Placed under *A day there goes roughly like this* — the only frame in the whole pool that shows the place you sit in rather than the view from it. |
| `Kapas 02.jpg` | `photo-0691` | 3942 × 2957 | 30 Aug 2024 | **Arrival.** A balustraded stair down to a bay with a moored boat. Replaces the jetty pavilion, full bleed, and carries the Kapas caption. |
| `Kapas 03.jpg` | `photo-0692` | 4000 × 3000 | 30 Aug 2024 | **The closer.** An empty curve of sand in flat light with steps rising into the trees at the far end. The way out is visible in the picture. |
| `Kapas 04.jpg` | `photo-0693` | 4000 × 3000 | 16 Sep 2024 | **Weather.** A cumulus bank catching the last light over dark water. Placed under *And it rains. Properly.* |
| `Kuala-lumpur 01.jpg` | `photo-0694` | 5208 × 7750 | 6 Sep 2024 | **Scale.** A tower spire at night from directly below, filling a tall frame against black. Placed under *Kuala Lumpur is loud. Huge, very urban, a lot of concrete.* Carries the Kuala Lumpur caption. |

All five are in the story. No technical blocker.

## Geography

Owner-confirmed, recorded as `OWNER_CONFIRMATION` / `OWNER_CONFIRMED`, which the classifier treats as
outranking the travel timeline and preserves through every regeneration.

    photo-0690..0693   country Malaysia · place Pulau Kapas
    photo-0694         country Malaysia · place Kuala Lumpur

`region` stays null on all five. The owner said *Pulau Kapas, Malaysia* and *Kuala Lumpur, Malaysia*;
George Town carries `Penang` only because he said *George Town, Penang*. No coordinates, beach names
or camp positions were invented.

**Eight photographs on the site now carry a confirmed place**, up from three. The story captions
exactly three of them — one per city, on the frame that establishes it:

    Kuala Lumpur · 2024          photo-0694
    George Town, Penang · 2024   photo-0689
    Pulau Kapas · 2024           photo-0691

## A correction to Phase 10.4

`photo-0059` was moved out of the story in 10.4 on the reasoning that its date — 16 September 2024 —
put it outside the island block, so it could not be the same place. `Kapas 04`, which the owner
confirms **is** Pulau Kapas, is dated 16 September 2024. That reasoning was wrong. 0059 stays out
because `photo-0693` is the better photograph, not because of where it was taken.

## Owner-edited colour

No creative grade was applied to any of the five. The pipeline did resize, ICC retention and JPEG
encoding only — the same treatment every other archive frame gets. All five are sRGB (four carry an
sRGB ICC profile, one carries none), so there is no P3-to-sRGB conversion anywhere and no colour
shift. The owner made the aesthetic decision; the pipeline did the arithmetic.

## Final sequence — 19 photographs

    HERO   0056   a covered walkway between columns, sea at the far end

    KUALA LUMPUR
    01     0060   the skyline over the tree canopy
    02     0694 ● the spire at night                      ← new
    03     0091   a street of shophouses and traffic
    04     0079   a Hindu temple tower lit at night
    05     0540   a standing deity, monochrome
    06     0084   a shop under red lanterns               (inset)
    07     0023   a communications tower at dusk

    GEORGE TOWN
    08     0688 ● the mural and the multilingual signs
    09     0689 ● the Chinese temple roof

    PULAU KAPAS
    10     0094   dark foliage opening onto sand
    11     0691 ● the stair down to the bay               ← new
    12     0122   the cove
    13     0110   up through leaves at a gold cloud       (inset)
    14     0690 ● the camp, from inside it                ← new
    15     0693 ● the storm                               ← new
    16     0113   palms and lamps after sunset

    17     0090   chrysanthemums, close                   (inset)
    18     0692 ● the empty beach with the steps          ← new, closer

    ● = owner-confirmed place

Was 22, now 19. Eight out, five in. The `pair` block is no longer used by this story — it remains in
the grammar for a story that needs it.

## Pipeline fix

`scripts/generate-archive-derivatives.mjs` threw and halted the entire pipeline because one public
photograph's source master had vanished from the folder: **`photo-0664` / `IMG_6706.JPG`**. Masters
live outside git and are read-only to this project, so one disappearing between runs is a thing that
happens. The script now skips a missing master, leaves its existing derivatives untouched, and names
it loudly at the end instead of crashing. `photo-0664` is the only affected record; its derivatives
still exist, so nothing on the site is broken — but it can no longer be regenerated. Worth knowing.

## QA

    BUILD:                 PASS   23 pages, 22 public HTML files
    CONTENT:               PASS   694 photos
    PRIVACY:               PASS
    OWNER EXCLUSIONS:      PASS   24 rejected, 0 public references
    LAUNCH / SEO:          PASS
    BROKEN ASSETS:         0
    CONSOLE / NETWORK:     clean
    HORIZONTAL OVERFLOW:   0 at 1600, 1440, 1280, 1024, 768, 430, 390, 320
    MISSING ALT:           0 of 19
    IDENTIFIABLE PEOPLE:   0, still refused at build time
    SOURCE MASTERS TOUCHED: 0
    STATUS:                PUBLISHED — unchanged

Production performance, measured against the built output: 9 requests, 1120 KB at 1440 (LCP 272 ms,
CLS 0) and 1223 KB at 390/DPR 3 (LCP 88 ms, CLS 0). The single largest object is still `photo-0060`
at 552 KB, the full-bleed frame below the hero, unchanged from Phase 10.5.
