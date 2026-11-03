# Le bord du lac · hosted guest tour

Publication requested by the owner on 3 November 2026 at https://elsewherephotos.com/le-bord-du-lac/.

## Deployment

Cloudflare Pages project `elsewhere` serves `elsewherephotos.com` and is connected to `domekuester/elsewhere`, production branch `main`. Build command: `npm run build`; output: `dist`; production `SITE_URL=https://elsewherephotos.com`. The GitHub Pages workflow is a separate deployment and does not own this domain.

The tour is a self-contained static directory at `public/le-bord-du-lac/`, copied by Astro. There is no change to ELSEWHERE navigation, photographic sequences, catalogs, or rights records. Assets use relative paths so the tour also works under repository-based preview paths. Canonical and share metadata identify its production URL. It remains `noindex,nofollow` and is not included in the publication sitemap.

## Maintenance

Canonical authoring project: `/Users/dominikkuster/Desktop/Projekte/le-bord-du-lac`. Edit and test there (`npm run check`, `npm test`); then synchronize **only that project's `public/` contents** to `public/le-bord-du-lac/` in this repository. Keep model, fonts, vendor modules, photos, and licenses together. Do not publish Blender source, research, private notes, or working files.

Run the normal ELSEWHERE production build and verify the tour landing page, gallery, language switch, on-demand 3D loading, room selection, and return to the page before publishing. The model is approximately 17.3 MB and loads on request. The reconstruction disclosure must remain; dimensions and unseen details are estimates, and the bathroom is not reconstructed. Room selection reaches the loft; stairs are not simulated as walkable.

For rollback, revert the isolated tour publication commit and let the existing Cloudflare Git deployment run, or select the previous successful deployment in Cloudflare Pages. Previous production deployment before this addition: `ecfa2db3-30b7-4c74-808b-2136b3d1904e`, commit `5f7f12b9a4a01fdd12dfe08ecf9c81bed11e9ffe`.
