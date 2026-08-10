import type { APIRoute } from 'astro';
import { disallowRoutes } from '../config/routes';

export const GET: APIRoute = ({ site }) => new Response([
  'User-agent: *',
  'Allow: /',
  ...disallowRoutes.map((route) => `Disallow: ${route}`),
  '',
  `Sitemap: ${new URL('sitemap.xml', site).href}`,
  `Sitemap: ${new URL('sitemap-images.xml', site).href}`,
  '',
].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
