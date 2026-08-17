import heroPipelineData from '../../public/assets-derived/hero/HERO-PIPELINE.json';
import { withBase } from '../config/paths';

/**
 * The art-directed hero derivatives, with their source URLs corrected for the deployment base.
 *
 * Same reasoning as the photo catalog: the generator writes site-absolute paths, and the hero
 * is the one image that renders straight into the first viewport, so it is the last one that
 * should be left to a per-page fix. Correcting `sources[].url` here covers the hero `src`, its
 * full `srcset`, and the Open Graph card that several pages derive from the widest source.
 */
const heroPipeline = {
  ...heroPipelineData,
  heroes: Object.fromEntries(
    Object.entries(heroPipelineData.heroes).map(([key, hero]) => [
      key,
      { ...hero, sources: hero.sources.map((source) => ({ ...source, url: withBase(source.url) })) },
    ]),
  ) as typeof heroPipelineData.heroes,
};

export default heroPipeline;
