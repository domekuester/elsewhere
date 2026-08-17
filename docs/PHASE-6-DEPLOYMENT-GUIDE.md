# Phase 6 — Deployment guide

## Local verification

```bash
npm install
npm run social:images
npm run build
npm run validate:launch
npm run preview
```

## `SITE_URL` is the whole public root

`SITE_URL` carries the origin **and** the path the publication is served from.
`astro.config.mjs` splits it into Astro's `site` and `base`, and `src/config/paths.ts`
(`withBase`, `homePath`, `absoluteUrl`) is the only thing that turns an in-repo path into a
public one. That keeps the deployment target in a single value and means no production URL is
hardcoded in a component.

| Deployment | `SITE_URL` | resulting `base` |
| --- | --- | --- |
| Own domain at the root | `https://example.com` | `/` |
| GitHub Pages project page | `https://domekuester.github.io/elsewhere` | `/elsewhere/` |
| Local development | `http://localhost:4321` | `/` |

`npm run build` fails if any link, asset, or absolute URL in the built HTML escapes that base,
so a forgotten prefix cannot reach a deployment: see the base-path section of
`scripts/validate-launch.mjs`.

## GitHub Pages (current production)

Live at `https://domekuester.github.io/elsewhere/`, published by
`.github/workflows/deploy.yml` on every push to `main` and on manual dispatch. Pages must be
set to **Settings → Pages → Source: GitHub Actions**. The workflow pins `SITE_URL` itself; the
owner-supplied values are read from repository variables (`PUBLIC_CONTACT_EMAIL`,
`PUBLIC_CREATOR_NAME`, `PUBLIC_ANALYTICS_PROVIDER`, `PUBLIC_ANALYTICS_DOMAIN`) and the site
degrades honestly when they are absent.

Two constraints belong to this host specifically:

- **Published sites may be no larger than 1 GB.** `dist/` is 916.9 MiB, reached by moving the
  viewer tier to quality 86 while keeping its 3200px long edge and 4:4:4 chroma. Regenerating
  derivatives at a higher quality will breach the limit; see
  `docs/PHASE-10.2-GITHUB-PAGES-DEPLOYMENT.md` for the measurements behind that setting.
- **`robots.txt` is only read from a domain root**, so at `/elsewhere/robots.txt` it is
  generated correctly but is not the file crawlers consult. Indexing control therefore rests on
  the per-page `noindex` tags and on `/curate/` being absent from the build, both of which hold
  regardless of host. A custom domain makes `robots.txt` authoritative with no code change.

No `.nojekyll` file is needed: `actions/deploy-pages` serves the uploaded artifact directly and
never runs Jekyll, so the `_astro/` directory is preserved.

## Vercel

1. Push the project to a private or public GitHub repository. Master photographs in `assets-source/photos/` should not be uploaded unless the owner explicitly accepts that storage model.
2. Import the repository into Vercel as an Astro project.
3. Set `SITE_URL` to the final HTTPS origin. Served at a domain root that is just the origin—for example `https://example.com`—which resolves `base` to `/` and leaves `vercel.json`'s path rules correct as written.
4. Use `npm run build`; output directory is `dist`.
5. Confirm `/robots.txt`, `/sitemap.xml`, canonical URLs, and social images on the deployment URL before attaching the final domain.
6. After domain DNS resolves, update `SITE_URL`, redeploy, then submit the sitemap through Google Search Console and Bing Webmaster Tools.

`vercel.json` supplies immutable asset caching, security headers, and a defensive noindex/no-store rule for `/curate/`. The build finalizer removes `/curate/` and its route bundle from `dist`, so production contains no curation interface or private curation payload.

## Updating content safely

Use `/curate/` only through `npm run dev`, export assignments, review changes, regenerate required derived/catalog data, then run both validators. Never edit or deploy master JPEG metadata. Regenerate social images with `npm run social:images` after changing selected share photographs.

## Domain-dependent tasks

The final domain, Search Console ownership, analytics provider, legal/privacy copy, and professional inquiry address require owner decisions and are intentionally not fabricated.
