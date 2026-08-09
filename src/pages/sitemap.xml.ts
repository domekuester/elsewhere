import type { APIRoute } from 'astro';

const publicRoutes = [
  '/',
  '/archive/',
  '/people/',
  '/destinations/',
  '/destinations/japan/',
  '/collections/black-and-white/',
];

export const GET: APIRoute = ({ site }) => {
  const urls = publicRoutes.map((route) => `<url><loc>${new URL(route, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
