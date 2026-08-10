# Phase 8.25 — Typography options

Date: 10 August 2026

Production typography was not changed. Options B and C were loaded only in a temporary local comparison page using identical copy, photography, spacing, and viewport sizes. The six QA screenshots are stored in `/private/tmp`, outside committed production assets.

## Shared test surface

Each option was compared on the Home hero, Destinations, People, Black & White, body paragraph, caption/metadata, navigation, and mobile hero at 1440px and 390px. Measurements included line breaks, block heights, navigation width, overflow, tracking, leading, and visual weight.

## Option A — Current system

**Font pair**  
`Avenir Next Condensed` / `Helvetica Neue Condensed` / `Arial Narrow` for display; Baskerville / Iowan Old Style / Palatino / Georgia for editorial serif; Avenir Next / Helvetica Neue / Arial for interface text.

**License status**  
System-provided fonts only. No font files are distributed by ELSEWHERE. Exact availability varies by operating system.

**Baseline metrics**

- Home hero display: weight 400; `clamp(3.7rem, 6vw, 5.5rem)`; line-height `.9`; tracking `-.035em`.
- Hero serif: italic; `1.06em`; tracking `-.025em`.
- 1440px: hero block 161px; People heading 156px; navigation 67px.
- 390px: hero block 198px; People heading 181px; navigation 64px.

**Visual character**  
The intended reference: restrained condensed modernism paired with a soft, literary serif. It has the strongest continuity with the current identity on Apple platforms.

**Cross-platform reliability**  
Weak. Windows, Android, and Linux can fall through to Arial Narrow/Arial and Georgia, changing width, texture, and hierarchy.

**Performance**  
No webfont transfer.

**Layout effect**  
Reference wrapping and proportions. No overflow at either test viewport.

**Strengths**  
Best match to the established Apple rendering; zero font payload; preserves every current metric.

**Weaknesses**  
The intended pair is not portable and the final fallback is materially more generic.

**Recommendation**  
Keep as the production reference until the owner chooses a replacement. It does not solve cross-platform parity.

## Option B — Closest cross-platform alternative

**Font pair**  
Archivo Narrow Regular + Libre Baskerville Regular/Italic.

**License status**  
Both are released under the SIL Open Font License 1.1 and are suitable for self-hosting. Sources: [Archivo Narrow](https://github.com/Omnibus-Type/ArchivoNarrow) and [Libre Baskerville](https://github.com/impallari/libre-baskerville). Production adoption should pin reviewed files and retain license notices.

**Visual character**  
The closest conservative translation of the current relationship. Archivo Narrow retains the clean condensed structure; Libre Baskerville keeps a familiar editorial serif voice.

**Cross-platform reliability**  
High when self-hosted.

**Performance**  
The temporary unoptimized TTF set was approximately 269KB across three files. Production would require WOFF2 conversion/subsetting and only the used styles.

**Layout effect**

- 1440px: hero 160px, essentially matching A; People heading grows from 156px to 233px and changes from two lines to three.
- 390px: the current untuned metrics create a minimum-width/clipping failure around the Destinations sample and a four-line People heading.
- Navigation remains compact, but overall display weight is heavier than A.

**Strengths**  
Familiar, legible, legally clear, self-hostable, and very close to the current hero proportions.

**Weaknesses**  
It is not a drop-in replacement. Untuned display metrics damage People and small-screen layouts; the pair also feels slightly heavier and less distinctive.

**Recommendation**  
Do not adopt with the current production metrics. It remains a viable conservative direction only with a dedicated type-scale, tracking, and breakpoint pass.

## Option C — Character-forward alternative

**Font pair**  
Barlow Condensed Regular + Literata Regular/Italic.

**License status**  
Both are released under the SIL Open Font License 1.1 and are suitable for self-hosting. Sources: [Barlow](https://github.com/jpt/barlow) and [Literata](https://github.com/googlefonts/literata). Production adoption should pin reviewed files and retain license notices.

**Visual character**  
More authored than B without becoming fashionable or theatrical. Barlow Condensed strengthens the publication-like display tension; Literata brings a more contemporary literary texture while remaining composed.

**Cross-platform reliability**  
High when self-hosted.

**Performance**  
The temporary unoptimized TTF set was approximately 408KB across three files. Production use would require WOFF2 conversion/subsetting; this is the heaviest option before optimization.

**Layout effect**

- 1440px: hero 164px versus A's 161px; People remains two lines at 156px; navigation is 69px.
- 390px: People becomes a controlled two-line heading rather than A's three lines. The hero serif wraps more vertically, changing the composition while remaining coherent.
- No horizontal overflow or clipping occurred at either viewport.

**Strengths**  
The strongest portable brand character of the alternatives; stable desktop People metrics; efficient mobile display wrapping; clear editorial contrast.

**Weaknesses**  
Literata has a visibly different texture from Baskerville, and the narrower display plus more vertical mobile hero would require owner approval. Its unoptimized payload is highest.

**Recommendation**  
Best candidate if the owner wants a genuine typographic improvement, subject to a production proof with subset WOFF2 files, tuned mobile hero leading, and the full viewport matrix. It has not been selected or shipped.

## Comparison judgment

Option A remains the reference. Option B is closest in isolation but fails the untuned layout test. Option C is the strongest viable improvement and passed the comparison layouts, but changes the brand texture enough to require an explicit owner choice.

**Typography production change:** NOT YET — OWNER DECISION REQUIRED

