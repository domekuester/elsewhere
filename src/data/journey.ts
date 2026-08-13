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
  | 'daily-life'
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
  /**
   * Crop focus for `display: 'full'` only — the one display mode that crops. `wide` and `inset`
   * are `object-fit: contain` and show the whole frame, so a focal there would do nothing.
   *
   * Phase 14.2: a full-bleed frame was cropping the cyclist out of photo-0178 entirely, which is
   * how a container ends up editing a photograph. Body frames had no crop control at all — only
   * the hero did — so this is the missing half of that system. `desktop` and `mobile` are
   * `object-position` values; unset means the previous behaviour, centred.
   */
  focal?: { desktop?: string; mobile?: string };
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
    nextSlug: 'thailand',
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
  {
    slug: 'thailand',
    number: 2,
    title: 'Thailand',
    standfirst:
      'I came back to Thailand not expecting much. I had been before and it had never really worked. Then Krabi happened, and a reception desk at Tonsai, and by the end that opinion was hard to defend.',
    destinationId: 'thailand',
    dateLabel: '2024 — 2025',
    provenance: [
      'Thailand, October 2024 to March 2025. The journey passes through the country twice in that stretch, with Laos in between. This is one story because it is one change of mind, and it says so rather than pretending the trip ran straight through.',
      'Five of the photographs carry a confirmed place, because the photographer named them. The rest are confirmed to Thailand and no further. The people in this story are named with his permission; none of them appears in a photograph.',
    ],
    heroSurfaceKey: 'journey-thailand',
    heroAlt:
      'A bank of cloud lit gold by low sun stands behind the tiered spire of a temple wrapped in bamboo scaffolding.',
    status: 'PUBLISHED',
    publishedAt: '2026-08-12',
    seoTitle: 'Thailand — The Journey — Elsewhere',
    seoDescription:
      'I had been to Thailand before and never much liked it. This is the journey that changed that: Krabi, a month working reception at Tonsai, an island near Ranong, and the people who did it.',
    socialImage: '/social/journey-thailand.jpg',
    previousSlug: 'malaysia',
    nextSlug: 'laos',
    blocks: [
      { kind: 'lede', text: 'Thailand and I had never really got on.' },
      {
        kind: 'text',
        paragraphs: [
          'I had been before, more than once, and it had never worked. Too crowded. Too much of everything for sale. In some places I had the feeling that before I was anything else, I was a wallet.',
          'There was a side of the tourism I saw on those trips that I did not like either. I will leave it at that.',
          'So I was not in a hurry to go back.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0063',
          role: 'opener',
          alt: 'A brightly lit shopfront at night advertising gelato beside a neon cannabis-leaf sign.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'What I did not think about at the time is that I had mostly been in the places where exactly that happens, and sometimes with the wrong people. It took me years to consider that the problem might not have been the country.',
          'I was still on Kapas when I started looking for what came next. I found a Workaway placement on Tonsai Beach, near Krabi, working reception. That was the reason to move on.',
          'From Penang it is a bus. Six hours or so. And then Thailand again, with the expectations set very low.',
        ],
      },

      { kind: 'chapter', label: 'Krabi' },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0697',
          role: 'place',
          caption: 'Krabi · 2024',
          alt: 'Four gilded seated Buddha figures in profile against a dark blue sky and a bank of cloud lit pink.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Krabi did not cooperate with the low expectations.',
          'The room was simple. There was not much to it. But it had a small balcony, and from the balcony I could see a couple of pagodas and a lot of sky. That matters to me more than the room does.',
          'Round the corner was Arty Momma Rasta Bar. Arty is one of those people who make you feel welcome without making anything of it, and I kept going back. At some point during my stay she started cooking again. The food was very good.',
          'There was a café nearby with proper coffee, a few places to eat, and, this being Thailand, a 7-Eleven roughly every ninety seconds.',
          'And it was calm. That was the part I had not expected at all. This was not the Thailand that had worn me out.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0062',
          role: 'place',
          alt: 'A full rainbow stands over flat water at dusk, with a low dark shoreline and one small boat.',
        },
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0046',
          role: 'detail',
          alt: 'A dense cluster of small pink flowers against dark leaves.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'I went up to the Tiger Cave Temple. More than 1,200 steps to the top. On paper that already sounds unnecessary. Halfway up it sounds considerably more unnecessary.',
          'It is worth it.',
        ],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0044',
          role: 'place',
          alt: 'Palms lean over a beach at low tide with a long boat drawn up on the sand under warm cloud.',
        },
      },

      { kind: 'chapter', label: 'Tonsai' },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0680',
          role: 'establishing',
          alt: 'Limestone cliffs stand over a calm bay under heavy cloud, with a pale beach in the foreground.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Then Ao Nang, then a boat, then Tonsai.',
          'I worked reception for about a month. Written down like that it sounds like a job. It was not really a job.',
          'Dori ran everything. A check-in that went wrong, a question, anything at all that needed solving. She was there, at almost any hour. I still do not know when she slept.',
          'Pinong was the boss, and we got on immediately, because you could say what you thought. No theatre, no hierarchy games. That suited me.',
        ],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0679',
            role: 'detail',
            alt: 'Two dusky langurs sit close together in a palm, one leaning against the other.',
          },
          {
            id: 'photo-0684',
            role: 'detail',
            alt: 'Backlit leaves in a dense tangle of jungle, most of the frame in shadow.',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'Max teaches climbing and runs the climbing business there. He kept offering to take me out and show me things. That was simply very generous of him.',
          'Jam works with Max, and I did a climbing course with him. He is a warm, grounded guy and very easy to talk to.',
          'A ran the bar and does tattoos. Sakai was simply one of the good ones.',
          'And Wilmer, from Colombia, worked reception with me. I had evenings with Wilmer where at some point I was no longer sure what we were still laughing about. It had been a long time since I laughed like that.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0678',
          role: 'detail',
          alt: 'A long-legged golden orb spider sits at the centre of its web, the light behind it breaking into colour.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'We covered for each other. If somebody was late back from a trip, somebody else took the desk. We put Halloween together. Things that went wrong got dealt with, without anybody making a drama of it.',
          'It was a family. A temporary one, but that is what it was.',
          'Four weeks went very fast.',
          'That is the difference, I think. On the earlier trips I had been a customer. This time I was just there.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0047',
          role: 'pause',
          alt: 'A low sun goes down behind a dark treeline, its light lying in a long band across still water.',
        },
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0051',
          role: 'pause',
          alt: 'A half moon, sharp against a black sky.',
        },
      },

      { kind: 'chapter', label: 'Koh Phayam' },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0698',
          role: 'turning-point',
          caption: 'Koh Phayam · 2025',
          alt: 'A large red sun stands low over the sea, with one small figure sitting on a board in the water beneath it.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'After Tonsai I met an old friend, and we went to Koh Phayam, up near Ranong.',
          'It reminded me a little of Kapas. Not because the islands are alike. Phayam has far more on it, more places to stay, more people, more of everything. But the days go the same way.',
          'It was off-season, so we found a bungalow on the beach for almost nothing.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0700',
          role: 'place',
          alt: 'The beach and sea seen through a narrow opening between the dark walls and roof of a simple bungalow on Koh Phayam.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'There was a place we kept going back to called Sweet Kitchen. Good food, and they kept giving us fruit for free. There was a dog who greeted us every time.',
          'The days were: swim, look around a bit, take photographs, get on the scooter, ride somewhere for the sunset, have a beer on the beach. Done.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0701',
          role: 'daily-life',
          alt: 'A person carries a pale blue surfboard across a beach on Koh Phayam while two people walk behind in the late light.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'You genuinely do not need more than that there.',
        ],
      },
      { kind: 'pause' },

      { kind: 'chapter', label: 'And the rest of it' },
      {
        kind: 'text',
        paragraphs: [
          'There was more after that.',
          'Bangkok, which is fast and loud and hard work, and worth it every time for the food alone.',
          'Koh Chang, more touristy than Phayam, but a good island to take a scooter around. Jungle, beaches, and roads that keep going up and down.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0007',
          role: 'place',
          alt: 'A dense skyline at dusk above a wide road full of traffic, one tall stepped tower standing over the rest.',
        },
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0695',
          role: 'transition',
          caption: 'Koh Chang · 2025',
          alt: 'A road rises and falls through jungle with two scooters riding away into the distance.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Ayutthaya and its temples, which I liked a lot. I also saw tourists riding elephants there. I photographed it, and then decided I did not want those pictures in this.',
          'Kanchanaburi, where I read a lot and learned a lot, and stood on the bridge over the River Khwae. And where there were also markets and food and a town you could slow down in. Both of those at once.',
          'And Khao Soi, which I had also underestimated.',
        ],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0002',
            role: 'place',
            alt: 'A weathered stone Buddha head held in the roots of a fig tree at ground level.',
          },
          {
            id: 'photo-0003',
            role: 'place',
            alt: 'A window in a ruined brick wall frames the spire of a distant temple.',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'I came to Thailand fairly sure I already knew what I thought about it.',
          'By the time I left, that was hard to defend. It was the first time I actually loved being there, which surprised me more than it probably should have.',
          'Apparently I just had to come back.',
        ],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0065',
          role: 'closer',
          alt: 'A single pink-lit cloud stands in a violet sky behind the dark silhouette of a palm frond.',
        },
      },
    ],
  },
  {
    slug: 'laos',
    number: 3,
    title: 'Laos',
    standfirst:
      'I came back to Luang Prabang after eleven years. This time I stayed long enough to have a job, a gym, a scooter to renew, and roads I no longer had to think about.',
    destinationId: 'laos',
    dateLabel: '2024 — 2025',
    provenance: [
      'Luang Prabang, approximately December 2024 to mid-January 2025. Exact arrival and departure days were not recorded, so the dates remain broad.',
      'The memories and named animals are the photographer’s own account. Public context for Laos Buffalo Dairy, Icon Klub, the railway and morning alms follows primary documentation; no unapproved private person is pictured.',
    ],
    heroSurfaceKey: 'journey-laos',
    heroAlt:
      'Two monks in orange robes walk along a Luang Prabang street past a black vintage Mercedes in low afternoon light.',
    status: 'PUBLISHED',
    publishedAt: '2026-08-12',
    seoTitle: 'Laos — The Journey — Elsewhere',
    seoDescription:
      'Five or six weeks in Luang Prabang: returning to Icon Klub, working at Laos Buffalo Dairy, and staying until travel became ordinary life.',
    socialImage: '/social/journey-laos.jpg',
    previousSlug: 'thailand',
    nextSlug: 'phu-quoc',
    blocks: [
      {
        kind: 'lede',
        text: 'Eleven years earlier, I had my first Bloody Mary at Icon Klub. So it was fairly obvious where I had to start this time.',
      },
      {
        kind: 'text',
        paragraphs: [
          'The bar was still there. So was the Bloody Mary. That was enough for the moment.',
          'I had arrived by bus from Thailand and stayed in Luang Prabang. The city felt fuller than I remembered it. More traffic, more movement, more people. Since my first visit, the railway from China had opened and made getting there much easier. I felt that difference in the streets. I did not conduct a complete traffic study over the Bloody Mary.',
          'This time, though, I was not only visiting. I had a job.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0703',
          role: 'detail',
          alt: 'A painted Icon Klub sign shows a centaur figure and the words Luang Prabang against a dark wall.',
        },
      },
      { kind: 'chapter', label: 'This time I had a job' },
      {
        kind: 'text',
        paragraphs: [
          'In Thailand, I had spent plenty of mornings over coffee learning what I would need for the work at Laos Buffalo Dairy. Buffaloes, milk, animal health, and the idea behind the place. I was still properly nervous before my first tours. Visitors can ask a remarkable number of questions, particularly when you are quietly hoping they will not ask any.',
          'Luckily, every tour got easier. I learnt how the Dairy works with families in nearby villages and leases their buffaloes for a period. The animals receive better feed, veterinary care, and vaccinations; the families keep ownership and receive extra income, while the Dairy can use the milk when the time is right. It becomes cheese, yoghurt, ice cream, and other products.',
          'It was a social enterprise, but the work never felt like a presentation about one. Most of the people working there day to day were Lao and came from Luang Prabang or nearby. There were also nutrition programmes for local children and free English lessons. I liked the model because several things worked at once: healthier animals, income for families, local jobs, and ice cream at the end of it. It is difficult to object too strongly to a model involving ice cream.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0702',
          role: 'daily-life',
          alt: 'The photographer sits on the ground among resting buffaloes, adjusting the rope halter of the animal beside him.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'My main job was giving tours. In between, I sold and scooped ice cream and helped with whatever ordinary work needed doing. Sometimes it got busy, but never dramatically so. Buffalo facts one minute, ice-cream scoops the next. It was manageable.',
          'By then I knew considerably more about buffaloes than I had ever intended. There were pigs as well, goats, and what felt like twenty cats. The instructions for the pigs were simpler: rub the belly, pig lies down.',
          'My favourite buffalo was called Lana.',
          'What I especially liked about the work was how people treated one another. No pointless supervision, no theatre. People spoke normally, and in the end we were simply treated like human beings. It does not sound spectacular. It was very good.',
        ],
      },
      { kind: 'chapter', label: 'Four on, three off' },
      {
        kind: 'text',
        paragraphs: [
          'The usual rhythm was four days working and three days off. On workdays we were picked up from the Community House in the morning and driven to the Dairy. We came back in the early evening. We often had dinner together at the house of the people running the project. Some days they simply gave us money and we found our own food. Everything was easy.',
          'I lived with the others in a small Community House, and for those weeks it was home. In the evenings there was Beerlao, a lot of music, a lot of stories — and occasionally some smoke that did not come from the kitchen.',
          'We talked about the day, the visitors, questions nobody had expected, and good feedback. With the Lao people I met there, it rarely took long before somebody started singing. Karaoke did not always need to be announced. It simply happened.',
          'A tiny kitten called Lao lived in the house too. My little one. She understood very quickly how to arrange the required amount of attention in a house full of people.',
          'Pauline became very dear to me during that time. The rest I will keep to myself.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0662',
          role: 'turning-point',
          alt: 'A buffalo looks through a wooden enclosure, its eye and muzzle catching the last warm light.',
        },
      },
      { kind: 'chapter', label: 'Normal life' },
      {
        kind: 'text',
        paragraphs: [
          'On my days off I did nothing that belongs in a guidebook. I went to the gym, usually twice a week and sometimes three times. I bought groceries, ate Lao food, occasionally had pizza, rode the scooter, took photographs, or sat by the river with a cold beer.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0659',
          role: 'transition',
          caption: 'Nong Khiaw, Laos · 2024',
          alt: 'The river curves around Nong Khiaw beneath steep, densely wooded mountains.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Beerlao is the best beer in Asia, as far as I am concerned. There is no need to discuss this unnecessarily.',
          'At some point I needed to extend the scooter rental again. The man at the rental place knew me by then, and we discovered that we liked similar music. Not a major story. But small things like that changed the stay. People recognised me. I recognised them. I knew which road to take and moved around Luang Prabang without thinking about it.',
          'At first, I was in Luang Prabang. Later, I needed to go to the gym, buy a few things, and extend the scooter rental.',
          'That was how it became normal life. Not at a temple and not during a special sunset. Although Laos did have a rather unfair advantage when it came to sunsets.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0661',
          role: 'pause',
          alt: 'A large orange sun drops behind a dark mountain ridge, thin bands of cloud crossing its face.',
        },
      },
      { kind: 'chapter', label: 'Around six' },
      {
        kind: 'text',
        paragraphs: [
          'The temples and Buddhism were part of the city’s ordinary rhythm anyway. Around six in the morning, monks and novices were already moving through town. During Sai Bat they walked through the streets and received people’s offerings. At first you notice it as something unusual. After living there for weeks, it becomes part of the morning. No less important. Just normal.',
          'After five or six weeks, I knew my routes. I had work, responsibility, days off, and people I returned to in the evening. Luang Prabang was no longer somewhere I was visiting. It was simply where I lived at the time.',
        ],
      },
      { kind: 'pause' },
      { kind: 'chapter', label: 'Leaving' },
      {
        kind: 'text',
        paragraphs: [
          'Then I had to move on.',
          'The goodbye really did come with one laughing eye and one crying eye. I wanted to keep travelling. That was the plan, after all. At the same time, I was very sad to give up this small life. Jobs like this also show you a few sides of yourself you did not necessarily know before. It does not need to mean more than that.',
          'Afterwards, I took the train back towards Bangkok.',
          'It was especially hard to leave Lana, my favourite buffalo, and Lao, my tiny cat.',
          'I hope they are both doing well.',
        ],
      },
    ],
  },
  {
    slug: 'phu-quoc',
    number: 4,
    title: 'Phu Quoc',
    standfirst:
      'Four weeks in an apartment, coffee first, the gym downstairs, and the same fireworks every evening. Phu Quoc was okay. The time there mattered for other reasons.',
    destinationId: 'phu-quoc',
    dateLabel: '2025',
    provenance: [
      'Phu Quoc, approximately mid-March to mid-April 2025. Exact arrival and departure days remain broad in line with the owner travel timeline.',
      'The observations describe the developed area where the photographer stayed, not the whole island. Pauline is named by first-name permission only; no private relationship detail or identifiable private-person photograph is published.',
    ],
    heroSurfaceKey: 'journey-phu-quoc',
    heroAlt:
      'A tall, symmetrical building facade rises out of deep shadow against a black night sky.',
    status: 'PUBLISHED',
    publishedAt: '2026-08-12',
    seoTitle: 'Phu Quoc — The Journey — Elsewhere',
    seoDescription:
      'Four weeks in an apartment on Phu Quoc: daily routines, staged surroundings, the same nightly fireworks, and a stay that mattered more than the place.',
    socialImage: '/social/journey-phu-quoc.jpg',
    previousSlug: 'laos',
    nextSlug: 'japan',
    blocks: [
      {
        kind: 'lede',
        text: 'Every morning I made coffee and went straight downstairs to the gym. That was more or less how my days on Phu Quoc began for four weeks.',
      },
      {
        kind: 'text',
        paragraphs: [
          'Pauline and I had an apartment there. Coffee first, gym downstairs, then outside without much of a plan. It was less a holiday routine than simply the routine we had for that month.',
          'Four weeks is long enough for that sequence to stop feeling like travel. You get up, make coffee, find your training clothes, and already know which button to press in the lift. Nothing remarkable about it. That was exactly why I liked it.',
          'Outside, things felt stranger. The part of the island where we stayed looked as if it had been designed all at once for far more people than were actually there. New-looking buildings, large public spaces, Mediterranean-looking streets, and shops arranged into a very polished little world. Some places were busy. Others felt oddly empty.',
          'I could not know why every quiet building was quiet. The disruption after Covid, the amount of new development, the season — there could have been several reasons. I only knew how it felt from the pavement: constructed rather than lived in.',
          'It was not unpleasant all the time. It was clean, modern, and in places quite impressive. I just rarely forgot that the surroundings had been designed to produce an effect. I missed things that did not look planned in advance.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0008',
          role: 'establishing',
          alt: 'A long, narrow pedestrian street runs between matching ochre facades and rows of black wall lamps.',
        },
      },
      { kind: 'chapter', label: 'Designed all at once' },
      {
        kind: 'text',
        paragraphs: [
          'Even ordinary things sometimes looked as if somebody had polished them for the set. The Bánh mì stand was almost too fancy. Not bad. Just very considered for something I had expected to buy without thinking about the surroundings.',
          'There was also a kebab stand. I never tried it. Not for cultural reasons; it simply did not look good. Some decisions are less complicated than the internet would like them to be.',
          'The whole area mixed Mediterranean architecture, Vietnamese food, Takoyaki, kebab, tropical heat, and carefully staged market spaces. Everything at once. Somehow very little of it felt rooted. That says something about the bubble I stayed in, not about the whole island, and certainly not about Vietnam as a whole.',
        ],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0013',
            role: 'architecture',
            alt: 'A brightly lit arched window and empty bench sit within a large grey facade at night.',
          },
          {
            id: 'photo-0015',
            role: 'detail',
            alt: 'A monumental black hand sculpture stands in front of an illuminated commercial building at night.',
          },
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0704',
          role: 'architecture-context',
          alt: 'Illuminated Mediterranean-style buildings and a clock tower surround a quiet courtyard beneath a dark evening sky.',
        },
      },
      { kind: 'chapter', label: 'Every evening at seven' },
      {
        kind: 'text',
        paragraphs: [
          'The sunsets came every day and were often very good. Then, at about seven, the fireworks started. The same fireworks. With the same song. Every evening.',
          'The first time, fine. The second time, also fine. After that it became less of an event and more of a very loud clock. You never had to wonder what time it was.',
        ],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0672',
          role: 'pause',
          alt: 'A red sun hangs over the sea while small figures and their reflections line the dark shore.',
        },
      },
      { kind: 'chapter', label: 'The things that worked' },
      {
        kind: 'text',
        paragraphs: [
          'The people I met were very friendly. That matters, because my problem was never with them. It was the environment around us that kept feeling slightly unreal.',
          'I walked through the market and food-stall area regularly. Most of the food was okay. The Takoyaki was better than okay. I went to the same stand almost every day and became something close to a regular. My eating sessions were tolerated with impressive patience.',
          'That quickly felt more familiar than the grand surroundings. I knew where I wanted to go, and the people there had a fair idea of what was coming. Mainly a lot of hunger.',
          'The beaches I visited were okay too. They did not blow me away, and in a few places there was unfortunately quite a lot of rubbish. Still, there was the sea, a cold drink, and a sunset waiting to be interrupted at seven sharp.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0070',
          role: 'place-reality',
          alt: 'Dozens of fishing boats gather across a sheltered bay beneath a muted evening sky.',
        },
      },
      { kind: 'pause' },
      {
        kind: 'text',
        paragraphs: [
          'Those four weeks probably told me more about us than about Phu Quoc. That is all that really needs to go on the internet.',
          'At the end I left a few days before Pauline. I had found a ridiculously cheap flight. And unfortunately I still have not worked out how to shit money.',
          'The logic lasted until I had actually left. Then I felt terrible. I regretted the decision completely.',
          'Pauline was only staying a few days longer. It was not a catastrophe or a grand drama. It was simply a decision that looked perfectly sensible on a booking screen and felt completely wrong afterwards.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0673',
          role: 'departure',
          alt: 'A clock tower glows orange against the dark night sky, seen at a steep angle from below.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'I do not particularly want to go back to Phu Quoc. It was okay. Really.',
          'I still would not give those four weeks back.',
        ],
      },
    ],
  },
  {
    slug: 'japan',
    number: 5,
    title: 'Japan',
    standfirst:
      'Japan had been a dream since childhood, and 2019 had already proved it was real. Five weeks on Sado, a round wooden boat and a temple bell in Aichi turned it into something else.',
    destinationId: 'japan',
    dateLabel: '2025',
    provenance: [
      'Japan, 12 May to 27 June 2025, following the trusted owner travel timeline. Tokyo, Niigata, Sado, Naoetsu in Jōetsu, Nagoya, Agui in Aichi and Osaka are owner-confirmed; individual viewpoints inside them are not named beyond what the owner confirmed.',
      'Kotaro, Sami, Hanako, Keiji-san, Renjun and Jonas appear by first name only, with owner permission. No identifiable private person is published: every Japan frame containing a recognisable face is held pending explicit image consent, which is why the boats and the work appear here without the people who did them.',
      'The Ogi–Naoetsu ferry route, the Shukunegi tarai-bune and hangiri terminology and the HANAYA guesthouse were checked against public sources. The temple in Agui is deliberately unnamed: neither its identity nor its age could be verified.',
    ],
    heroSurfaceKey: 'journey-japan',
    heroAlt:
      'Three round wooden boats lie moored along a stone quay beneath a low grey sky, with black rocks across the water behind them.',
    status: 'PUBLISHED',
    publishedAt: '2026-08-13',
    seoTitle: 'Japan — The Journey — Elsewhere',
    seoDescription:
      'Five weeks working on Sado Island: a guesthouse in a former ryokan, a traditional tarai-bune, a farewell played on flute and drums, and a temple bell in Agui rung at six.',
    socialImage: '/social/journey-japan.jpg',
    previousSlug: 'phu-quoc',
    nextSlug: null,
    blocks: [
      {
        kind: 'lede',
        text: 'Japan was a dream long before I was old enough to fly anywhere on my own.',
      },
      {
        kind: 'text',
        paragraphs: [
          'It did not come from travel writing. It came from manga, from Japanese action series, from films. Japan existed in my head before I knew what I actually wanted to see there.',
          'I went for the first time in 2019. Part of that trip I stayed in Nerima, near Tokyo, with a friend’s mother. After that, the classic route: Tokyo, Kyoto, Osaka. It was wonderful. But it was exactly what it was. I visited Japan.',
          'In 2025 I wanted something else. I wanted to get off the standard route. So I found work.',
          'When I land in Tokyo I always notice the same thing. A faint chlorine-like smell in the city. I still do not know where it comes from and I have stopped asking. For me that smell simply means I am back in Japan.',
          'Then the rest of it. FamilyMart, Lawson, 7-Eleven, on every second corner. It takes about twenty minutes to feel oriented again.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0707',
          role: 'opener',
          alt: 'A long flight of steps climbs between street lamps towards a glass tower under a hard blue sky.',
        },
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0166',
          role: 'establishing',
          alt: 'A weathered green timber shopfront with faded signboards is wedged between two much larger modern buildings.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'What I noticed this time, already while changing trains, is that tourism has changed. One group was drunk enough that nobody in it was embarrassed any more, which left the job to everybody else. Loud, careless, in the middle of a country where consideration matters quite a lot.',
          'That genuinely annoyed me. Not because of where anyone was from — that has nothing to do with it. But because I kept seeing the consequence afterwards in Tokyo: in some places the patience with visitors has visibly worn thin. I understand it.',
          'And yes. I am a gaijin with a camera. I am not standing outside any of this. I just try to behave.',
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'I stayed about a day. Asakusa, mainly to photograph. Not the temple — the streets in front of it, the people, whatever is left of another century between two office towers. Then I moved on.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0708',
          role: 'daily-life',
          alt: 'A busy shopping street under paper lanterns and hanging decorations, a young woman walking towards the camera through the crowd.',
        },
      },
      { kind: 'chapter', label: 'Six hours north' },
      {
        kind: 'text',
        paragraphs: [
          'Long-distance bus to Niigata, roughly six hours.',
          'I really like travelling by bus in Japan, and it is for a reason that sounds ridiculous: even the stops are good. The service areas often sit in the landscape, the food is decent, the toilets are clean, and the smoking areas are properly separated so nobody has to join in.',
          'Japan somehow turns a motorway break into a small event. I have no idea how. I just enjoyed it.',
        ],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0181',
            role: 'transition',
            alt: 'A weathered hand reaches out past a ship’s rail, holding something small above moving water.',
          },
          {
            id: 'photo-0709',
            role: 'transition',
            alt: 'A flag flies from the bow of a ferry over open grey water, a low headland on the horizon.',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'One night in Niigata. That was all it was, and all it needed to be.',
          'Then the ferry. Gulls over the stern, the water behind the ship a blue I had not seen before, and eventually an island considerably bigger than the one in my head.',
        ],
      },
      { kind: 'chapter', label: 'Where I lived' },
      {
        kind: 'text',
        paragraphs: [
          'I stayed about five weeks.',
          'I lived at HANAYA, a guesthouse in a former ryokan right by the harbour in Ogi. Tatami, a futon, a low table, the toilet out in the corridor. Nothing more. After three days it stopped being a room and became where I lived.',
          'The house is run by Kotaro and Sami. Their daughter Hanako belongs to it just as obviously. A wonderful family — and by that I do not mean friendly to guests. I mean that after five weeks I knew what their day looked like, and they knew what mine looked like.',
          'I did two jobs at once: reception and guests, and the tarai-bune.',
        ],
      },
      { kind: 'chapter', label: 'The boats' },
      {
        kind: 'text',
        paragraphs: [
          'Tarai-bune. On Sado people also call them hangiri, because they look like barrels cut in half. That is more or less what they are: round boats of cedar and bamboo, once used in the bays of the peninsula to fish for seaweed and shellfish. They are not cute. They are craft.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0716',
          role: 'daily-life',
          alt: 'A man stands sculling a round wooden tub boat across flat water with a single oar, a passenger in an orange life jacket sitting in front of him.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'They belong to Shukunegi, an old shipbuilding village at the southern tip of the island. Narrow lanes, dark timber, houses that look as though somebody wedged them between the rocks so the wind could not take them.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0223',
          role: 'place',
          alt: 'A purple cloth curtain printed with a sailing-ship emblem hangs across the entrance of a weathered timber building.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'My boss there was Keiji-san. The tarai-bune operation is his, and he is also one of the few people who still builds these boats by hand.',
          'The day went like this. Keiji-san picked me up in the morning. We drove down, set up the stand, got everything ready, brought the boats to the landing — and then we waited. When guests came, they got a life jacket, a short explanation, and out we went.',
          'That was the work. Not more, not less. I liked it enormously.',
          'Most of the day, incidentally, was waiting. Waiting for guests, waiting for better weather, waiting for the sun to sit where it was worth going out. You end up standing next to the same person for a very long time. It is a badly underrated way of getting to know someone.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0216',
          role: 'detail',
          alt: 'The timber prow of a wooden boat, roped and cleated, seen close and from below inside a shed.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'At the start I had to learn how to steer one of these things at all. That took a few days. After that they apparently trusted me enough to put tourists in the boat with me.',
          'There were three routes I could run, and a fourth, bigger one that was simply too much for me. On that I was honest with myself.',
          'My Japanese was limited. My standard tool for enthusiasm was sugoi. For everything else there was the translator app, and I see nothing wrong with that. It worked. You understand each other faster than you would think when you carry the same boats into the water every morning.',
          'That work went into the body after a while. Shoulders, back, hands. So after work I was at the onsen in Ogi very often. In, hot water, out again eventually. The end of a working day did not have to be more complicated than that.',
          'Usually the supermarket afterwards. And at some point I even enjoyed that, which probably says a fair amount about how ordinary the place had become to me.',
        ],
      },
      { kind: 'pause' },
      {
        kind: 'text',
        paragraphs: [
          'Keiji-san had a German Shepherd, Asti. The dog was attached to him the way dogs are when they genuinely belong to someone. Asti is no longer alive. I had already left the island by then, and it still bothers me that I could not be there.',
        ],
      },
      { kind: 'chapter', label: 'Some days the island is friendly' },
      {
        kind: 'text',
        paragraphs: [
          'The water around Sado is clear enough to count the stones on the bottom. I looked into it every day for weeks and it did not get boring.',
        ],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0224',
          role: 'turning-point',
          alt: 'Heavy dark cloud presses down over a flat sea and low rock outcrops.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'But the island has moods. On some days it is friendly. On other days it is not friendly at all. When the rain and the wind arrive, the same bay turns hard and exposed and unwelcoming. You understand very quickly that the people here have to negotiate with the sea rather than sit in front of it.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0203',
          role: 'turning-point',
          alt: 'In black and white, a stone lantern and two benches stand on a concrete platform at the water’s edge as waves break behind them.',
        },
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0202',
          role: 'pause',
          alt: 'In black and white, a straight seawall path runs to a single shuttered building beneath a heavy sky.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Kotaro gave me a racing bike, which was close to the best present of the whole trip. On days off I rode it across the island. To photograph, to eat, to get somewhere — and quite often simply because I felt like moving.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0200',
          role: 'daily-life',
          alt: 'A road bicycle leans against the railing of a coastal path below a steep wooded slope.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'I rode out to the lighthouse and around that part of the island more times than I can count. And the island itself kept doing things I had not expected: green capes running out into the sea, meadows full of orange lilies. I have more photographs from Sado than from most places in my life.',
        ],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0713',
          role: 'establishing',
          alt: 'A steep green headland rises straight out of the sea beside a pale shingle beach.',
          focal: { desktop: '50% 46%', mobile: '46% 50%' },
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'In between, villages where nothing happens after half past six in the evening.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0268',
          role: 'daily-life',
          alt: 'The tiled roofs of a small village stand stacked above a dark sea horizon.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Rows of small stone figures at the roadside that somebody clearly keeps supplying with fresh flowers. And on clear days, far out over the water, the snow on the mountains of the mainland. From this island you can see fairly precisely how far away you are.',
        ],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0312',
            role: 'detail',
            alt: 'Rows of small weathered stone figures stand crowded together in low light.',
          },
          {
            id: 'photo-0323',
            role: 'pause',
            alt: 'A teal sea runs out towards a distant range of snow-covered mountains.',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: ['Sometimes I rode alone. Sometimes we all went together.'],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0712',
          role: 'daily-life',
          alt: 'Three people stand on a green hillside above the sea with their arms raised, two of them in wide sun hats.',
        },
      },
      {
        kind: 'text',
        paragraphs: ['I also got to try taiko. Japanese drumming, in a class, my talent charitably overlooked.'],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0711',
            role: 'daily-life',
            alt: 'Three drummers in blue happi coats sit at barrel drums in a meadow of orange lilies, a large drum standing behind them.',
          },
          {
            id: 'photo-0710',
            role: 'detail',
            alt: 'A dancer in a wide straw hat and dark robe turns mid-step in a field of orange lilies.',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'And we went out singing karaoke twice with the hangiri team. It was exactly how you imagine Japanese karaoke. Exactly.',
          'People invited me to eat with them a few times, mostly when I arrived and again before I left. Those evenings mattered to me. It was not the meals that did it, though. It was the mornings, the boats, the waiting, the karaoke — at some point I stopped being the foreigner who works there.',
        ],
      },
      { kind: 'chapter', label: 'Leaving' },
      {
        kind: 'text',
        paragraphs: ['In the end I left by ferry, from Ogi.'],
      },
      {
        kind: 'lines',
        lines: ['Kotaro played the flute.', 'Sami waved flags.', 'Hanako drummed.'],
      },
      {
        kind: 'text',
        paragraphs: [
          'They played for me before I went aboard.',
          'I cried like a child.',
        ],
      },
      { kind: 'pause' },
      {
        kind: 'text',
        paragraphs: ['I do not remember the song any more. I remember exactly who played it.'],
      },
      { kind: 'pause' },
      {
        kind: 'text',
        paragraphs: [
          'The ferry did not go back to Niigata. It went to Naoetsu, in Jōetsu. The photographs with the red lighthouse are from there, from arriving.',
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'Then I had about six kilometres to walk to the bus stop. With luggage. Exhausting — and at the same time one of the most interesting stretches of the whole trip, because it was not a route at all. Just ordinary Japanese streets, suburbs, a small city at the end of the working day.',
        ],
      },
      {
        kind: 'photo',
        display: 'inset',
        photo: {
          id: 'photo-0334',
          role: 'transition',
          alt: 'A brick church with a tall spire stands against an orange evening sky.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Children came the other way, walking home from school on their own. One of them stopped and asked me roughly who I was and what I was doing here. No shyness, just curiosity. I got the translator out and we talked for a bit.',
          'I am not going to build a theory about Japan out of that. I will only say that compared with a lot of places I have travelled, that matter-of-factness stayed with me.',
          'After that, on to Nagoya. Big city, short stay. I was on my way to the next job.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0714',
          role: 'transition',
          alt: 'In black and white, the tiered roofs of a castle keep rise against heavy cloud.',
        },
      },
      { kind: 'chapter', label: 'Agui' },
      {
        kind: 'text',
        paragraphs: [
          'That was in Agui, in Aichi Prefecture, at a Buddhist temple.',
          'The work was maintaining the grounds. Mowing grass, among other things. In heat that felt close to forty degrees.',
          'I stopped earlier than planned. It was physically too much and not what I had imagined. There was no argument and no bad feeling. We parted on good terms, and that mattered to both sides.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0337',
          role: 'establishing',
          alt: 'A temple hall with a heavy tiled roof stands among trees under a blue sky.',
        },
      },
      {
        kind: 'text',
        paragraphs: [
          'Agui still became one of the most important places of the whole trip, for a completely different reason.',
        ],
      },
      {
        kind: 'photo',
        display: 'full',
        photo: {
          id: 'photo-0345',
          role: 'place',
          alt: 'A long tatami corridor runs between sliding doors towards daylight at the far end.',
        },
      },
      { kind: 'chapter', label: 'Renjun' },
      {
        kind: 'text',
        paragraphs: [
          'Renjun is the mother of Shinku, my host at the temple. She is a fashion designer.',
          'She cooked every day. Rice obviously, pickled vegetables, sometimes soba, sometimes sushi, once cabbage with minced meat, and a whole run of dishes whose names I still do not know.',
          'I cannot get her food into words. It was close to perfect every day, and every day I failed to get over it.',
          'We talked a lot, in English, which was easy enough. We went to an exercise class together, taught by a former Japanese baseball player. Baseball is enormous in Japan, and I was comfortably the least informed person in the room.',
        ],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0344',
            role: 'detail',
            alt: 'A small carved household shrine stands in a dim corner with fresh flowers set in front of it.',
          },
          {
            id: 'photo-0339',
            role: 'daily-life',
            alt: 'A long low table, worn sofas, a wall clock and a paper calendar in a plain tatami room with a bright window.',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'And every evening at six I had to strike the temple bell. With a hanging wooden beam that you pull back and let go. Six strikes, for six o’clock. The sound carried across the whole village.',
          'The first time I was nervous, because I assumed there was a way to get it wrong. After a few days it was simply the thing that happens at six. That is what staying somewhere does. Nothing stops mattering. It just stops being an event.',
          'It is still one of the things I hear immediately if somebody says Japan.',
        ],
      },
      {
        kind: 'photo',
        display: 'wide',
        photo: {
          id: 'photo-0341',
          role: 'pause',
          alt: 'A gilded altar stands at the end of a dim tatami hall, a mat and low stands laid out in front of it.',
        },
      },
      { kind: 'pause' },
      {
        kind: 'text',
        paragraphs: [
          'I have no proper photograph of Renjun. None of her, none of the two of us.',
          'I have fifty pictures of landscapes I saw once. And not one of the person I miss most from Agui. That bothers me more than I expected it to.',
        ],
      },
      { kind: 'pause' },
      {
        kind: 'text',
        paragraphs: [
          'Jonas, one of my oldest friends, came to visit me in Japan. He went on towards Osaka afterwards, and eventually I followed.',
          'We had a very good day and a very good evening there. It does not need to be more than that.',
        ],
      },
      {
        kind: 'pair',
        photos: [
          {
            id: 'photo-0363',
            role: 'closer',
            alt: 'A narrow city lane covered in spray paint, a bicycle parked against the wall in warm low light.',
          },
          {
            id: 'photo-0715',
            role: 'closer',
            alt: 'A dense evening crowd under a covered shopping street, one person holding a phone up above the heads.',
          },
        ],
      },
      {
        kind: 'text',
        paragraphs: [
          'After that I flew back to Thailand.',
          'Either way, I am nowhere near finished with Japan. Next time I want to go further south. Shikoku is fairly high on the list.',
        ],
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
