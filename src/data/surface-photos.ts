/**
 * The catalog photographs that authored surfaces render directly, named in one place.
 *
 * People and Licensing each render a small, hand-chosen set of archive derivatives inside pages
 * that are otherwise written by hand. Those frames used to be listed only inside the page that
 * showed them, which made them invisible to /sitemap-images.xml: the photographs were on a public,
 * indexable page and absent from the file that tells Google where the site's images are. Declaring
 * them here means the page and the image sitemap read the same list, and a change to the editorial
 * selection reaches discovery automatically rather than being remembered.
 *
 * Only catalog-backed frames belong here. The `astro:assets` photographs on Home, the Black & White
 * collection and the People hero are separate build-hashed crops of their own; their canonical
 * public representation is the archive derivative of the same frame, which the archive already
 * declares. Listing both would publish two canonical URLs for one photograph.
 */

/** People — the six frames a full visual review marked as being *about* a person. */
export const peopleEncounters = [
  { id: 'photo-0279', alt: 'A dancer in a straw hat turns mid-step in front of orange flowers.', note: 'Movement', role: 'gesture' },
  { id: 'photo-0380', alt: 'Two women in white headscarves work over pans at a food counter.', note: 'Work', role: 'proximity' },
  { id: 'photo-0566', alt: 'A man in a cap holds a cigarette at the edge of a doorway.', note: 'Waiting', role: 'threshold' },
  { id: 'photo-0592', alt: 'A woman sits at a small table outside a shop hung with a red rug.', note: 'Afternoon', role: 'environment' },
  { id: 'photo-0350', alt: 'A man bends to drink, water falling from his mouth in low sun.', note: 'Thirst', role: 'intimate' },
  { id: 'photo-0557', alt: 'A woman in a cap stands against dark volcanic rock.', note: 'Attention', role: 'closing' },
] as const;

/** People — the one archive frame in the upper encounter sequence. */
export const peopleEncounterFrame = { id: 'photo-0045', alt: 'A seated craftsperson works beside a window.' } as const;

/** Licensing — the rights desk illustrates itself with a frame that appears nowhere else. */
export const licensingFrame = { id: 'photo-0333', alt: 'A red lighthouse stands at the end of a breakwater under a pale sky.' } as const;

/** Every catalog id an authored surface renders, per page. Read by /sitemap-images.xml. */
export const surfacePhotoIds: Record<string, readonly string[]> = {
  '/people/': [peopleEncounterFrame.id, ...peopleEncounters.map((entry) => entry.id)],
  '/licensing/': [licensingFrame.id],
};
