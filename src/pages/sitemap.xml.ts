import type { APIRoute } from 'astro';
import { indexableRoutes } from '../config/routes';

export const GET: APIRoute = ({ site }) => {
  const urls = indexableRoutes()
    .map(({ path, priority, changefreq }) =>
      `<url><loc>${new URL(path, site).href}</loc><changefreq>${changefreq}</changefreq><priority>${priority.toFixed(1)}</priority></url>`)
    .join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
