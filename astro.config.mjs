// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL is the publication's single public root, origin *and* path. GitHub Pages serves
// this project under a repository subpath, so the deployment root is
// https://domekuester.github.io/elsewhere/ rather than a bare origin. Splitting that one
// value into Astro's `site` and `base` keeps the deployment target described in exactly one
// place: locally SITE_URL is http://localhost:4321 and `base` resolves to '/', so nothing
// about `npm run dev` changes.
const publicRoot = new URL(process.env.SITE_URL || 'http://localhost:4321');

export default defineConfig({
  site: publicRoot.origin,
  base: publicRoot.pathname,
  compressHTML: true,
  image: {
    responsiveStyles: true,
  },
});
