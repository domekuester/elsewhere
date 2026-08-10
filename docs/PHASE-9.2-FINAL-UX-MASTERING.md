# Phase 9.2 — Final UX mastering

## The header, on a pale photograph

The site header is `mix-blend-mode: difference` over near-white ink, so it inverts against whatever
the page puts behind it. That is elegant on ivory and on a dark hero. It fails on a hero that is
*pale* at the top.

Difference blending returns `|background − 242|`. A background at 205 returns 37; at 40 it returns
202; at **128 it returns 114** — the same luminance as its own ground. Home's hero and the new
La Réunion hero both put bright cloud behind the wordmark, and "ELSEWHERE" rendered as a dim
blue-grey smear, splitting into two colours where it crossed from cloud into sky. It read as damage.

Measured, then fixed: the hero and destination-hero surfaces now hold a constant darkness across
exactly the header's own band, fading out below it. Every hero, whatever its tonality, resolves the
inversion to light. The band ends well above the title; nothing in the composition below changes,
and photographically it reads as a graduated sky.

This was a pre-existing defect on Home, not a regression. Phase 8.4 could not have caught it — the
heroes it tested were dark at the top.

## Navigation and information architecture

Phase 8.4's header work was reconfirmed and is intact: top edge, safe-area inset, wordmark, desktop
nav, mobile menu, and behaviour over light and dark surfaces, verified in both Chromium and WebKit
including an iPhone profile.

Naming was reviewed and left almost entirely alone. `Explore · People · Destinations · About ·
Studio`, with `Archive`, `Collections`, `Licensing` and `Contact` beneath, is unambiguous, and
renaming established concepts without strong reason is a cost with no return.

Two pieces of copy did name things that do not exist and were corrected:

- The skip link said "Skip to the journal". ELSEWHERE has no journal. It now says "Skip to the
  photographs", which is both accurate and the reason someone would use it.
- 404 said "Return to the visual journal". It now offers two real destinations: the beginning, and
  the archive.

## Dead ends removed

The destinations index listed La Réunion (101 photographs), Malaysia (53), Thailand (32),
Phu Quoc (18) and Laos (3) as **unclickable text**. 207 photographs were named, counted, and
unreachable from the page naming them. Each row now opens the archive filtered to that place.

The same applied on Home, where the list also silently omitted Essaouira.

## Truthful counts

Three places displayed numbers that another page contradicted:

1. The destinations index showed stored per-destination counts while linking to an archive filter
   that returned a different number. Counts are now derived from the public catalog during the
   catalog build, and the build fails if a chapter sequences a photograph that is no longer public.
2. The archive masthead said "469 frames" while the progress row beneath said "/077" under an active
   filter. The masthead now follows the filter.
3. Home offered five visual worlds; the archive published two of them as filters. All five now exist,
   and Home fails to build if one of them stops clearing the threshold.

## Scale

Every destination chapter placed its portrait photographs at effectively one width. Five of the six
sequence roles resolved to the same five-column span for portraits, so a portrait-heavy chapter
rendered as nine consecutive frames at 38% of the viewport — a feed with margins.

The role spans for portraits now spread properly. Measured at 1440:

| Chapter | Before | After |
| --- | --- | --- |
| Japan | 38–54% | **30–70%** |
| La Réunion | 38–54% | **30–70%** |
| Essaouira | 38–54% | **38–62%** |

At 390 all three run 59–100%, with genuine full-bleed moments. Each chapter now ends on its largest
frame rather than tapering, and each has quiet 30% pauses between its anchors. This was a
system-level fix: all three chapters improved, and Essaouira's Phase 9.1 edit was not touched.

## Archive controls at laptop width

Adding three world filters pushed the controls row 4px past the gutter between 980 and 1140px,
consuming the entire right margin. The filter group now takes its own line from 1140px down, which
is the behaviour the narrow layout already used.

## Touch targets

Standalone links across the publication sat at 13–20px of hit area against WCAG 2.2's 24px minimum.
Fixed with the padding-plus-equal-negative-margin idiom the header links already used, so every
target reaches 24px and **not one visible measurement moved**: editorial links, footer navigation,
the footer wordmark, the hero scroll cue, archive world filters, the "another frame" control, and
the chapter continuation link.

One link is deliberately left at 16px: the mailto inside a sentence on the contact form. WCAG 2.2
SC 2.5.8 exempts targets inline in a block of text, and padding it would break the line rhythm.

## Business surfaces

Studio, Licensing and About were built entirely from Home's photographs. A professional who scrolled
the homepage and opened Studio met the same four pictures — the weakest possible argument from a
page whose claim is *this site is the portfolio*. All six now come from the archive and appear
nowhere else. The transition from publication to Studio still reads as the same publication:
same type, same restraint, no agency template, no fabricated clients, awards or prices.

## People

People held a main-navigation entry and three photographs. It now opens into six more from four
countries and a path to all 77 — frames where a person is the *subject*, not frames with a person
somewhere in them. Mobile lays them out at four different widths with one full-bleed moment.

## The viewer

Reviewed and unchanged, because it is excellent. A thumbnail preview holds the frame while the
3200px derivative decodes, then reveals — confirmed loading 2138×3200 on a portrait frame. Black
environment, correct geometry, keyboard next/previous, focus returned to the originating frame on
close, scroll position restored, body scroll lock released. The counter follows the filtered set.
Nothing was added to it.

## What was deliberately not changed

The hero and its title relationship. The People composition on Home. Barlow Condensed and Literata,
with no new family and no new weight. The ultramarine system — audited across 50 declarations and
found disciplined: signature mark, interactive affordance, and sequence numbering, with no
decorative use to remove. Native scroll. The Essaouira edit. The immersive viewer's geometry.
The archive's editorial interleave of selected and depth frames.
