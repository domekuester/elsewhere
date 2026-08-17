import catalogData from '../../public/data/photo-catalog.json';
import { withBase } from '../config/paths';

/**
 * The public photo catalog, with its derivative URLs corrected for the deployment base.
 *
 * The catalog on disk stores site-absolute paths (`/assets-derived/archive/0001-…jpg`) because
 * it is also served verbatim as a static file to the archive's client-side loader. Correcting
 * the three derivative URLs once here means every surface that renders a photograph — `img
 * src`, every `srcset`, the ImageObject `contentUrl`, the Open Graph card, the image sitemap —
 * inherits the base without a single call site having to remember it. `withBase` is the
 * identity function when the site is mounted at the origin root.
 *
 * Every page reads the catalog through this module rather than importing the JSON directly, so
 * a new surface cannot pick up uncorrected paths by following the older import.
 */
const photoCatalog = {
  ...catalogData,
  photos: catalogData.photos.map((photo) => ({
    ...photo,
    thumbnail: withBase(photo.thumbnail),
    archiveImage: withBase(photo.archiveImage),
    viewerImage: withBase(photo.viewerImage),
  })),
};

export default photoCatalog;
