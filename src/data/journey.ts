import type { Nullable } from './archive';

/**
 * THE JOURNEY — the narrative layer.
 *
 * A destination chapter answers *what did he photograph there*. A Journey story answers
 * *why does this place matter*. They are different jobs and neither replaces the other, so a
 * story never lives inside a destination page and a destination page never grows an essay.
 *
 * Not to be confused with `data/journeys.json`, which is the register of travel *periods*
 * (dates, boundaries, which photograph belongs to which trip). That is chronology. This is
 * narrative, and one story may draw on several travel periods — Malaysia does.
 *
 * ## The rules this file exists to enforce
 *
 * - **Nothing here may be invented.** Every sentence is the owner's own account, edited. No
 *   dish, restaurant, friend, encounter, dialogue, route or weather event has been added. A
 *   passage that would need a fact the owner has not given is left short, or left out, and the
 *   question goes to `docs/PHASE-10-MALAYSIA-OWNER-QUESTIONS.md`.
 * - **Prose is data, not markup.** The owner can rewrite a paragraph, cut a joke, reorder the
 *   sequence or swap a photograph by editing this file. Nothing in the page component knows
 *   what the story says.
 * - **A photograph claims no geography it cannot prove.** Location comes from the owner's travel
 *   timeline, which knows countries and not cities: 56 of the 59 Malaysia frames carry `place:
 *   null`. The narrative may name Kuala Lumpur, George Town and Pulau Kapas because the owner
 *   named them; a caption, an alt text or page metadata may not — unless the photograph's own
 *   record carries the city. Three do, as of Phase 10.1: `photo-0687`, `photo-0688` and
 *   `photo-0689` are owner-confirmed to George Town, Penang, and are the only frames on the site
 *   that may be captioned with a city.
 * - **A person is not a prop.** Every Malaysia frame containing an identifiable person is
 *   `storyCandidate: false` / `NEEDS_OWNER_INPUT` in `data/people-review.json`. Public in an
 *   archive grid is not the same permission as featured in a story, so none of them are used
 *   here. The list is in the owner questions document, ready to drop in on a yes.
 */

export type JourneyStatus = 'DRAFT' | 'OWNER_REVIEW' | 'PUBLISHED';

/**
 * Internal editorial metadata. It shapes the sequence and is never rendered: a reader should
 * feel the rhythm, not read the labels off the page.
 */
export type PhotoRole =
  | 'opener'
  | 'establishing'
  | 'place'
  | 'detail'
  | 'transition'
  | 'pause'
  | 'turning-point'
  | 'closer';

export interface JourneyPhoto {
  /** Archive photo id. Must exist in the public catalog and be public. */
  id: string;
  /**
   * What is visible, for a reader who cannot see it. Never the story's prose, never a
   * city, never camera data.
   */
  alt: string;
  role: PhotoRole;
  /** Optional and rare. Only when it states something genuinely known. */
  caption?: string;
}

/**
 * The editorial grammar. Seven blocks, every one of them used by Malaysia — a story is
 * assembled from these, not poured into a template, so Thailand may be loud and urban and
 * Laos may be eight photographs and four paragraphs without either needing new code.
 */
export type JourneyBlock =
  /** The opening paragraph, set larger. One per story. */
  | { kind: 'lede'; text: string }
  | { kind: 'text'; paragraphs: string[] }
  /** A place or section marker in the display face. Narrative, not photo metadata. */
  | { kind: 'chapter'; label: string }
  /** A run of very short lines, set as a block. Used once, for the island. */
  | { kind: 'lines'; lines: string[] }
  /** `full` bleeds edge to edge, `wide` sits in the column of the sequence, `inset` is small. */
  | { kind: 'photo'; display: 'full' | 'wide' | 'inset'; photo: JourneyPhoto }
  | { kind: 'pair'; photos: [JourneyPhoto, JourneyPhoto] }
  /** Deliberate silence. Renders as space and nothing else. */
  | { kind: 'pause' };

export interface JourneyStory {
  slug: string;
  /** Position in the series. Displayed as the kicker, e.g. "The Journey — 01". */
  number: number;
  title: string;
  /** One short paragraph saying why the story exists. Not a summary of the country. */
  standfirst: string;
  /** Must match a destination id in data/destinations.json. */
  destinationId: Nullable<string>;
  /** Free-text date label for the hero. Never more precise than the timeline allows. */
  dateLabel: string;
  /** Two or three lines under the hero: what is confirmed, and what deliberately is not. */
  provenance: string[];
  /**
   * Key into `data/surface-heroes.json` and the hero derivative ladder, so the opening frame
   * gets the same treatment as a destination hero rather than the 3200px viewer file.
   */
  heroSurfaceKey: string;
  heroAlt: string;
  blocks: JourneyBlock[];
  status: JourneyStatus;
  publishedAt: Nullable<string>;
  seoTitle: Nullable<string>;
  seoDescription: Nullable<string>;
  socialImage: Nullable<string>;
  previousSlug: Nullable<string>;
  nextSlug: Nullable<string>;
}

export const journeyStories: JourneyStory[] = [
  {
    slug: 'malaysia',
    number: 1,
    title: 'Malaysia',
    standfirst:
      'Most journeys start somewhere you don’t know. This one starts in the country I keep coming back to, with a camera I had never travelled with before.',
    destinationId: 'malaysia',
    dateLabel: '2024 — 2025',
    provenance: [
      'Malaysia, August 2024 to May 2025. The country appears three times in that stretch of travel; two of the three visits carry photographs.',
      'The places named below are the photographer’s own account. Two of the photographs carry a confirmed city; the rest are confirmed to Malaysia and no further, and stay unassigned rather than guessed.',
    ],
    heroSurfaceKey: 'journey-malaysia',
    heroAlt:
      'A covered walkway runs between heavy square columns towards open sea, with a single distant figure at the far end.',
    status: 'OWNER_REVIEW',
    publishedAt: null,
    seoTitle: 'Malaysia — The Journey — Elsewhere',
    seoDescription:
      'A photographic story about returning: Kuala Lumpur as a hub, George Town for the food, and the island the photographer has gone back to since 2016.',
    socialImage: null,
    previousSlug: null,
    nextSlug: null,
    blocks: [
      { kind: 'lede', text: 'Not the first time. That is more or less the point.' },
      {
        kind: 'text',
        paragraphs: [
          'Fourth long journey. At some point I stopped explaining it to myself. Life has too much to offer — that is probably the whole reason.',
          'One thing is different this time. I am carrying a real camera. Semi-professional, nothing spectacular, but a lot more than a phone.',
          'I am not travelling and taking pictures on the side any more. I stop where I used to keep walking. That sounds like a small thing. It changes the whole day.',
          'It starts in Malaysia. It usually does.',
        ],
      },

      { kind: 'chapter', label: 'Kuala Lumpur' },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0060',
          role: 'establishing',
          alt: 'A dense cluster of high-rise towers stands beyond a wide canopy of palms and jungle under broken cloud.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'I fly into Kuala Lumpur. From there I move on, then come back, then leave again. Three times on this trip. On a map it is a hub. Over the years it has become something else as well — a place I know my way around.',
          'That goes back to 2014. I have met friends here every time since. A few of those have held across years and across separate journeys. You stop arriving as a complete stranger, and you know some of it will still be there when you come back.',
        ],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0083',
            role: 'place',
            alt: 'A tapered skyscraper rises into a bank of cloud lit orange by low sun.',
          },
          {
            id: 'photo-0092',
            role: 'place',
            alt: 'A single cumulus cloud stands between two concrete apartment blocks in flat evening light.',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'Kuala Lumpur is loud. Huge, very urban, a lot of concrete. Sometimes dusty, sometimes completely wet. And the city smells. Food, rain on hot asphalt, exhaust. Usually all of it at once.',
          'It is dense. Something is always happening somewhere.',
          'I find that impressive. Not pretty. Impressive.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0091',
          role: 'place',
          alt: 'A busy street of shophouses and signage, traffic below and office towers standing behind.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'What gets me every time is how visible the different communities are. Malay, Chinese and Indian influences are the ones I notice most, and not as a statistic: in the food, in the streets, in the neighbourhoods, in people. A mosque, a Chinese temple, a Hindu temple, a church, none of it far apart.',
          'Malaysia is more than those three. But those are the ones I see. It still impresses me that it all works side by side.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0079',
          role: 'place',
          alt: 'The carved tower of a Hindu temple, crowded with painted figures, lit against a black sky.',
        },
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0540',
          role: 'pause',
          alt: 'A tall statue of a standing deity holding a spear, in black and white, above a flight of steps.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'The food comes out of that. The mixture produces a range I don’t know from anywhere else. For me the cooking is one of the real strengths of this country.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0084',
          role: 'detail',
          alt: 'A narrow shop stacked to the ceiling with goods, seen from the street under a row of red paper lanterns.',
        },
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0023',
          role: 'transition',
          alt: 'A communications tower with a round observation deck stands against an orange dusk sky, crossed by overhead cables.',
        },
      },
      {
        kind: 'text',
        paragraphs: ['And then Kuala Lumpur is mostly movement. Airport. City. Friends. Food. Heat. Concrete. Rain. On.'],
      },

      // Phase 10.1 — George Town arrives before it is named. The reader is somewhere else for a
      // frame before the marker tells them where, which is how leaving a city actually feels and
      // is only possible now that a photograph can prove the city.
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0688',
          role: 'place',
          alt: 'A painted girl holding a sunflower covers the gable end of a shophouse, beside a tall optician’s sign in Chinese and English and a Malaysian flag.',
        },
      },
      { kind: 'chapter', label: 'George Town' },
      {
        kind: 'text',
        paragraphs: [
          'George Town on Penang belongs to this. If somebody asks me where the best food in Malaysia is, I say George Town. Without thinking about it.',
          'Eating there isn’t something you tick off. It is how you understand the city. The cultures sit close together and you can taste it.',
          'Sounds simple. It is simple.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0689',
          role: 'place',
          // The only caption in the story. It is the first photograph on the site whose city is
          // confirmed rather than inferred, and saying so is the point.
          caption: 'George Town, Penang · 2024',
          alt: 'The roof of a Chinese temple seen from below, crowded with painted dragons, above a carved stone pillar and a red lantern.',
        },
      },
      { kind: 'pause' },

      { kind: 'chapter', label: 'Pulau Kapas' },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0094',
          role: 'transition',
          alt: 'Dark leaves and palm fronds frame a narrow view of pale sand and blue sea.',
        },
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0104',
          role: 'place',
          alt: 'A wooden jetty pavilion stands over flat turquoise water with a long boat moored beside it.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'I found Pulau Kapas by accident in 2016. Not because it was on anybody’s list. I just ended up there and fell in love with it.',
          'It has been my favourite island since. When I am in Malaysia I try to get back. This time that was most of my weeks in the country. Not a hard decision.',
        ],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0122',
          role: 'turning-point',
          alt: 'A curved sandy bay runs out to a forested headland under a line of small cumulus.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'What makes it is mostly what it doesn’t have. Almost no infrastructure. Nothing built that takes over. Beach, sea, vegetation, a few places to stay, people. Not much more.',
          'There are a few more buildings now than the first time. The feeling has stayed.',
        ],
      },
      { kind: 'lines', lines: ['Quiet.', 'Beautiful.', 'Clean.', 'Small.', 'Uncomplicated.'] },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0121',
            role: 'pause',
            alt: 'A volleyball net stands on empty white sand in front of dense palms.',
          },
          {
            id: 'photo-0132',
            role: 'pause',
            alt: 'A white hammock hangs between palm trunks over shaded sand, with turquoise water behind.',
          },
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0110',
          role: 'pause',
          alt: 'Looking up through dark leaves at a cloud lit gold by low sun.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'The reef looked good. Intact. The sea and the reef are a large part of why this island counts for me and not some other one.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0108',
          role: 'place',
          alt: 'A tall cloud bank stands over the sea with the sun setting beneath it, seen from an empty beach.',
        },
      },
      {
        kind: 'text',
        paragraphs: ['And the people on Kapas are great. I don’t really need to say more than that.'],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0113',
          role: 'pause',
          alt: 'Palm fronds and two hanging lamps against a deep blue sky after sunset, with lights along a distant shore.',
        },
      },

      {
        kind: 'text',
        paragraphs: [
          'I have known this country since 2014, but with the camera I see things I have walked past a hundred times.',
          'In the city it is concrete, density, people, weather. On Kapas it is the opposite. Space, water, light, a slower pace.',
          'No plan, no concept. Just looking more carefully. That is the whole change.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0090',
          role: 'detail',
          alt: 'Purple and pale pink chrysanthemums packed tightly together, seen close.',
        },
      },

      {
        kind: 'text',
        paragraphs: [
          'Malaysia isn’t a country I visited once. It is a starting point.',
          'Islands, cities, highlands with tea, jungle, different religions, different communities — and from here the rest of Southeast Asia is right there.',
        ],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0163',
          role: 'place',
          alt: 'A large cloud bank stands over calm water beside a dark headland and a low jetty.',
        },
      },
      {
        kind: 'text',
        paragraphs: ['That is why the journey begins here. And why it carries on from here.'],
      },
      // Phase 10.1 — replaces photo-0040, which the owner confirmed is Thailand. The old frame was
      // chosen for being the last Malaysia photograph before the journey moved on; that reasoning
      // died with the correction, so this one is chosen for what it shows: a boat on the sand, a
      // jetty running out, and the light going. It is from 22 August 2024, the day after the
      // opener, which makes the story close a few hundred metres from where it began.
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0057',
          role: 'closer',
          alt: 'Sun breaks through heavy cloud over a bay, with a long boat pulled up on the sand and a jetty running out into the water.',
        },
      },
    ],
  },
];

/** Stories the public site links to and search engines are invited to index. */
export const publishedJourneyStories = (): JourneyStory[] =>
  journeyStories.filter((story) => story.status === 'PUBLISHED').sort((a, b) => a.number - b.number);

/**
 * Stories that build a page. A story awaiting the owner's read has a real URL so it can be
 * read at full size in a browser, but it is `noindex`, absent from the sitemap and linked
 * from nowhere. Drafts build nothing at all.
 */
export const routableJourneyStories = (): JourneyStory[] =>
  journeyStories.filter((story) => story.status !== 'DRAFT').sort((a, b) => a.number - b.number);

export const journeyStoryForDestination = (destinationId: string): JourneyStory | undefined =>
  publishedJourneyStories().find((story) => story.destinationId === destinationId);

/** Every photograph a story renders, hero excluded, in sequence. */
export const storyPhotos = (story: JourneyStory): JourneyPhoto[] =>
  story.blocks.flatMap((block) =>
    block.kind === 'photo' ? [block.photo] : block.kind === 'pair' ? block.photos : [],
  );
