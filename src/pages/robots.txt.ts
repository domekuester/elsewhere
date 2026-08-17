import type { APIRoute } from 'astro';
import { disallowRoutes } from '../config/routes';
import { absoluteUrl, homePath, withBase } from '../config/paths';

/**
 * Note for the current GitHub Pages deployment: crawlers only ever read robots.txt from a
 * domain root, so while ELSEWHERE is served from a repository subpath this file is generated
 * correctly but is not the file crawlers consult. Indexing therefore rests on the per-page
 * `noindex` tags and on /curate/ being physically absent from the build, both of which hold
 * regardless. Moving to a custom domain makes this file authoritative without further change.
 */
export const GET: APIRoute = ({ site }) => new Response([
  'User-agent: *',
  // Scoped to the publication's own root rather than claiming the whole shared domain.
  `Allow: ${homePath}`,
  ...disallowRoutes.map((route) => `Disallow: ${withBase(route)}`),
  '',
  `Sitemap: ${absoluteUrl('/sitemap.xml', site)}`,
  `Sitemap: ${absoluteUrl('/sitemap-images.xml', site)}`,
  '',
].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
