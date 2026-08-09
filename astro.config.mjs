// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  compressHTML: true,
  image: {
    responsiveStyles: true,
  },
});
