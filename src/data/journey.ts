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
 *   timeline, which knows countries and not cities, so most Malaysia frames carry `place: null`.
 *   The narrative may name Kuala Lumpur, George Town and Pulau Kapas because the owner named them;
 *   a caption, an alt text or page metadata may not — unless the photograph's own record carries
 *   the place. Eight do: `photo-0687`–`0689` (George Town, Penang, Phase 10.1) and
 *   `photo-0690`–`0694` (Pulau Kapas and Kuala Lumpur, Phase 10.6). They are the only photographs
 *   on the site that may be captioned with a place, and the story captions exactly three of them —
 *   one per city, on the frame that establishes it.
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
      'The places named below are the photographer’s own account. Five of the photographs carry a confirmed place; the rest are confirmed to Malaysia and no further, and stay unassigned rather than guessed.',
    ],
    heroSurfaceKey: 'journey-malaysia',
    heroAlt:
      'A covered walkway runs between heavy square columns towards open sea, with a single distant figure at the far end.',
    status: 'PUBLISHED',
    publishedAt: '2026-08-11',
    seoTitle: 'Malaysia — The Journey — Elsewhere',
    // Written as a sentence from the story rather than as a list of search terms. It says what the
    // piece is about and stops; there is no itinerary, no superlative and no place name that the
    // story does not actually spend time in.
    seoDescription:
      'A fourth long journey that starts in the one country I already knew: Kuala Lumpur, George Town, and an island I found by accident in 2016 and keep going back to.',
    // A purpose-made 1200×630 card, the same treatment the published chapters get. Without it the
    // share preview falls back to a 4:3 hero derivative that platforms crop unpredictably.
    socialImage: '/social/journey-malaysia.jpg',
    previousSlug: null,
    nextSlug: null,
    blocks: [
      { kind: 'lede', text: 'Not the first time. That is more or less the point.' },
      {
        kind: 'text',
        paragraphs: [
          'Fourth long journey. At some point I stopped explaining it to myself. Life has too much to offer — that is probably the whole reason.',
          'One thing is different this time. I am carrying a real camera. Semi-professional, nothing spectacular, but a lot more than a phone.',
          'I am not travelling and taking pictures on the side any more. I stop where I used to keep walking. It changes the whole day.',
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
      // Phase 10.6 — the owner's own Kuala Lumpur frame, and the first photograph on the site whose
      // city he has confirmed. It replaces `photo-0083` and `photo-0092`, a pair of sky-against-
      // concrete portraits that both said *tower* less well than this one does, and it carries the
      // caption because it is the frame that proves the city.
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0694',
          role: 'place',
          caption: 'Kuala Lumpur · 2024',
          alt: 'The upper section and spire of a skyscraper at night, seen from directly below, its stepped tiers lit against a black sky.',
        },
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
          'Malaysia is more than those three. But those are the ones I see. And it all works side by side, which I have never quite got used to.',
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
      // Phase 10.6 — replaces `photo-0104`, the jetty pavilion, whose orange sky against cyan water
      // sits in the same processed family as the two frames the owner rejected. This is his own
      // edit of the same idea — arriving, by water, at a place with steps and a moored boat — and it
      // carries the caption because it is the frame that proves the island.
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0691',
          role: 'place',
          caption: 'Pulau Kapas · 2024',
          alt: 'A balustraded stone stair drops to rocks and a shallow bay, with a moored boat, a small beach and low islands beyond.',
        },
      },
      // Phase 10.3 — the owner supplied how 2016 actually happened and what a day there is. Both
      // were one line each before, and they were the two weakest points in the piece. Every detail
      // below is his: the Perhentian plan, the night in Terengganu, LongSha, the two weeks, the
      // coffee, Marang, the fire, the weekend visitors, the cleanups, the turtles, the trenches.
      {
        kind: 'text',
        paragraphs: [
          'Kapas was an accident.',
          'In 2016 I flew to Malaysia with a friend. The plan was fixed: two weeks on the Perhentians. Kuala Lumpur to Terengganu, and then we had to stay a night there.',
          'You can see Kapas from the coast. It just sits there. I suggested we go over and have a look at what it was.',
          'We went over, found LongSha Campsite, and stayed for the rest of the two weeks. We never made it to the Perhentians.',
          'Call it love at first sight.',
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
          'It has been my favourite island since. When I am in Malaysia I try to get back. This time that was most of my weeks in the country. Not a hard decision.',
          'What makes it is mostly what it doesn’t have. Almost no infrastructure. Nothing built that takes over. Beach, sea, vegetation, a few places to stay, people. Not much more.',
          'There are a few more buildings now than the first time. The feeling has stayed.',
        ],
      },
      { kind: 'lines', lines: ['Quiet.', 'Beautiful.', 'Clean.', 'Small.', 'Uncomplicated.'] },
      // The pair is gone with both its halves. `photo-0132` went on the owner's instruction, and
      // `photo-0121` — the volleyball net, same session, same treatment — went for the same reason
      // once the owner-edited frames arrived to compare it against: blown white sand with a magenta
      // cast, a hard cyan sky, yellowed greens. He named two; this is a third on his own grounds.
      // `photo-0110` keeps the quiet slot it always had.
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
          'A day there goes roughly like this.',
          'You wake up in the tent and hear the sea. Coffee. Swim. Hammock. Then you walk off and look at the island, and there are bays with nobody on them.',
          'For food you go across to Marang. Market, supermarket, cheap. Then you cook something simple.',
          'In the evening it is the fire, or the hammocks, or the kitchen area. At weekends people come over from Terengganu. They invite you to eat with them. Nobody asked them to.',
        ],
      },
      // The camp, from inside it, under the paragraph about an ordinary day. Nothing else in the
      // Malaysia pool shows the place you actually sit in rather than the view from it.
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0690',
          role: 'place',
          alt: 'Looking out from the shade of a shelter past hanging floats and palm fronds to bright sand, turquoise water and distant hills.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'There are beach cleanups. There is a turtle sanctuary. You help around the camp, because it needs doing and you are there anyway.',
          'And it rains. Properly. When a storm comes in, a relaxed group of campers turns very quickly into an efficient trench-digging operation, so the tents don’t flood.',
          'That is basically it. And that is exactly why I keep going back.',
        ],
      },
      // Phase 10.6 — the storm paragraph finally has the owner's own weather frame, and it is
      // confirmed Kapas. It replaces `photo-0103`, which was itself a Phase 10.4 stand-in for
      // `photo-0059`. Worth recording: 0059 was moved out for being dated 16 September 2024, on the
      // reasoning that it could not be the same place — and this frame, which the owner confirms is
      // Kapas, is dated 16 September 2024 too. That reasoning was wrong. 0059 stays out because
      // this is the better photograph, not because of where it was taken.
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0693',
          role: 'place',
          alt: 'A bank of cumulus catches the last light over a dark sea, with mountains low on the far shore under heavy cloud.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Kapas slows everything down. You arrive, and pretty soon you stop dividing the day up.',
          'The reef looked good. Intact. The sea and the reef are a large part of why this island counts for me and not some other one.',
          'And the people on Kapas are great. I don’t really need to say more than that.',
        ],
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
      // `photo-0163` stood here — a cloud bank over calm water. It was the third big sea-and-cloud
      // frame in the last five and the most heavily teal of the survivors, and `photo-0693` now
      // carries weather far better. Taking it out leaves the ending as three short paragraphs and
      // then one quiet photograph, which is the shape this ending always wanted.
      {
        kind: 'text',
        paragraphs: ['That is why the journey begins here. And why it carries on from here.'],
      },
      // Phase 10.6 — `photo-0057` closed the story until the owner rejected it as too processed:
      // heavy sunbeams, an HDR signature, the treatment louder than the photograph. This is his own
      // edit of the same beach in flat afternoon light, with a set of steps going up into the trees
      // at the far end. A quieter ending, and the way out is visible in it.
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0692',
          role: 'closer',
          alt: 'An empty curve of sand under soft cloud, with jungle and one leaning palm on the right and a flight of steps rising into the trees.',
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
