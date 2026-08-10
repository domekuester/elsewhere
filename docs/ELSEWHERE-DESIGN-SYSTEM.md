# ELSEWHERE Design System

## Principle

The photograph wins. Interface is used to create sequence, orientation, and invitation—not decoration. The system borrows the discipline of a gallery catalogue and the pacing of a photographic book without imitating paper, film, or luxury-brand mannerisms.

## Foundation

- Obsidian `#0B0C0D`: primary dark field.
- Gallery Ivory `#F2F0EA`: primary reading field.
- Electric Ultramarine `#263DFF`: signature memory mark, link state, index number, and directional cue.
- Burnt Copper `#B9673C`: reserved; not used in the current homepage UI because the photography already supplies warmth.
- Deep Mineral `#173A3D`: reserved for place or ocean environments where it supports the image.

Colors are not distributed evenly. Dark and light chapters control pacing; photography supplies most chromatic variation.

## Typography

The production system uses self-hosted Barlow Condensed Regular and Literata Regular/Italic under the SIL Open Font License 1.1:

- Display: Barlow Condensed for architectural chapter language.
- Editorial: Literata for memory, story, wordmarks, and destination names.
- UI: a cross-platform native sans stack for navigation, metadata, captions, and explanatory copy.

Display type is uppercase with tight leading and careful line breaks. Literata carries warmth without becoming decorative. Only the used 400 weight and true italic are shipped; the display face and hero italic are preloaded, while regular Literata loads when needed.

## Spacing and composition

The fluid gutter ranges from 20px to 64px. Section spacing changes by narrative role rather than repeating a universal block. Image systems include full-viewport, asymmetric paired worlds, 50/50 human encounter, intimate inset detail, full-bleed environment, editorial story split, and loose archive sequence.

## Signature elements

1. **Memory mark:** a short ultramarine rule. It introduces a remembered fragment, chapter, or next path. It is never ornamental wallpaper.
2. **Visual-world index:** categories are sequenced at different sizes, ratios, and offsets. The system is recognizable without becoming a grid template.

## Interaction and states

Links use ultramarine direction or an animated underline. Keyboard focus uses a two-pixel ultramarine outline with generous offset. Mobile navigation becomes a full editorial index, locks page scrolling while open, closes on selection or Escape, and returns focus to its trigger.

## Responsive rules

At 900px the desktop navigation becomes the mobile index and multi-column compositions become vertical editorial sequences. At 560px crops, heading scales, destination rows, footer structure, and photographic heights are tuned specifically for narrow phones. The system remains valid down to a 320px viewport without horizontal overflow.
