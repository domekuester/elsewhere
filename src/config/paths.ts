/**
 * One place that knows where the publication is mounted.
 *
 * ELSEWHERE is served from a repository subpath on GitHub Pages
 * (https://domekuester.github.io/elsewhere/), so a bare `/journey/` written into an href or
 * an `img src` resolves to the wrong origin root once deployed. Astro rewrites the paths it
 * owns — bundled CSS and JS, `astro:assets` images, and `url()` references inside stylesheets
 * — but a hand-written string in markup is passed through untouched, and so is anything
 * carried in a JSON data file. Those are the two surfaces these helpers cover.
 *
 * `BASE_URL` is supplied by Astro from the `base` config value, which astro.config.mjs
 * derives from SITE_URL. Locally it is '/' and `withBase` is the identity function, so
 * `npm run dev` behaves exactly as before and no production URL is hardcoded in the UI.
 */

/** '' when mounted at the origin root, '/elsewhere' when mounted on a subpath. */
const prefix = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

/**
 * Prefixes a site-absolute path with the deployment base.
 *
 * Idempotent, so a value that has already been through it — a photograph URL corrected once
 * at the data boundary, then passed to `<BaseLayout image>` — is safe to pass again. Values
 * that are not site-absolute paths (fragments, query strings, `mailto:`, external and
 * protocol-relative URLs) are returned unchanged.
 */
export const withBase = (path: string): string => {
  if (!prefix || !path.startsWith('/') || path.startsWith('//')) return path;
  if (path === prefix || path.startsWith(`${prefix}/`)) return path;
  return `${prefix}${path}`;
};

/** The site-absolute path of the publication's home page: '/' or '/elsewhere/'. */
export const homePath = `${prefix}/`;

/**
 * The full public URL of an in-site path, for canonicals, Open Graph, schema.org and sitemaps.
 *
 * `site` is Astro's configured origin, so the base has to be applied to the path before the
 * two are joined — `new URL('/journey/', origin)` would silently drop the subpath.
 */
export const absoluteUrl = (path: string, site: URL | string | undefined): string =>
  new URL(withBase(path), site).href;
