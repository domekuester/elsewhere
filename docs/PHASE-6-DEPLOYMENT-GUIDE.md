# Phase 6 — Deployment guide

## Local verification

```bash
npm install
npm run social:images
npm run build
npm run validate:launch
npm run preview
```

## Vercel

1. Push the project to a private or public GitHub repository. Master photographs in `assets-source/photos/` should not be uploaded unless the owner explicitly accepts that storage model.
2. Import the repository into Vercel as an Astro project.
3. Set `SITE_URL` to the final HTTPS origin, without a trailing path—for example `https://example.com`.
4. Use `npm run build`; output directory is `dist`.
5. Confirm `/robots.txt`, `/sitemap.xml`, canonical URLs, and social images on the deployment URL before attaching the final domain.
6. After domain DNS resolves, update `SITE_URL`, redeploy, then submit the sitemap through Google Search Console and Bing Webmaster Tools.

`vercel.json` supplies immutable asset caching, security headers, and a defensive noindex/no-store rule for `/curate/`. The build finalizer removes `/curate/` and its route bundle from `dist`, so production contains no curation interface or private curation payload.

## Updating content safely

Use `/curate/` only through `npm run dev`, export assignments, review changes, regenerate required derived/catalog data, then run both validators. Never edit or deploy master JPEG metadata. Regenerate social images with `npm run social:images` after changing selected share photographs.

## Domain-dependent tasks

The final domain, Search Console ownership, analytics provider, legal/privacy copy, and professional inquiry address require owner decisions and are intentionally not fabricated.
