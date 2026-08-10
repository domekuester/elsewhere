# Phase 9 — Google Search Console setup

Free Google tool that shows what people searched before they found you. Roughly twenty minutes once,
then five minutes a month. Do this after the domain is connected.

---

## 1. Verify the domain

1. Go to **search.google.com/search-console** and sign in.
2. Choose **Domain** (left box), not URL prefix. Domain covers www, non-www, http and https at once.
3. Type your domain without `https://` — just `your-domain.com`.
4. Google gives you a **TXT record**. Copy it.
5. In your registrar's DNS settings, add a TXT record for the root (`@`) with that value.
6. Back in Search Console, click **Verify**. If it fails, wait an hour and try again — DNS is slow.

---

## 2. Submit both sitemaps

Left menu → **Sitemaps**. Add each of these and press Submit:

```
sitemap.xml
sitemap-images.xml
```

The first lists your pages. The second lists **532 photographs** attached to the pages they appear
on — this is the one that matters for a photography site, because the archive loads through
JavaScript and a crawler that does not run it would otherwise only see the opening frames.

Status will say "Couldn't fetch" for a while. That is normal. It resolves within a day or two.

---

## 3. Ask Google to look at your key pages

Paste each URL into the search box at the top, then click **Request indexing**:

1. `https://your-domain.com/` — homepage
2. `https://your-domain.com/destinations/japan/` — your strongest destination chapter
3. `https://your-domain.com/archive/` — the archive
4. `https://your-domain.com/collections/black-and-white/` — Black & White
5. `https://your-domain.com/studio/` — Studio
6. `https://your-domain.com/licensing/` — Licensing
7. `https://your-domain.com/people/` — People
8. `https://your-domain.com/about/` — About

Do a few a day rather than all at once. There is a daily limit.

---

## 4. What to look at, and when

**Do not check daily.** Nothing will happen for several weeks. New sites take time.

**After 2–4 weeks** — Performance report. Two numbers matter:
- **Impressions** — how often you appeared in results. This moves first.
- **Clicks** — how often someone came. This follows later.

**After 4–8 weeks** — In the Performance report, switch the **Search type** tab from *Web* to
**Image**. For a photography site this is often where most traffic comes from. Also check *Queries*
to see what people actually searched — frequently not what you expected, and a good guide to what to
write about.

**Monthly** — the **Pages** report (formerly Coverage). It tells you what is indexed and what is
not. Some pages being excluded is normal; `/collections/` is deliberately excluded, and `/curate/` is
private and blocked.

**After publishing anything new** — request indexing for that one URL.

---

## 5. What "good" looks like early

Realistic first three months for a brand-new site with no backlinks:

- Weeks 1–3: almost nothing. Correct.
- Weeks 4–8: impressions begin, mostly from image search and your own name.
- Weeks 8–12: first clicks. Numbers will be small — single or double digits. Also correct.

Search rewards patience and specificity. A single honest Field Note about a real place will
eventually beat any amount of generic optimisation.

---

## 6. Things that would be wrong

- **Zero impressions after 6 weeks** — check the domain is verified and the sitemap was accepted.
- **Sitemap shows 0 discovered URLs** — `SITE_URL` is probably still pointing at localhost. Fix it
  and redeploy.
- **Pages you expected are "Excluded by noindex"** — check whether that was deliberate.
  `/collections/` and `/curate/` are meant to be excluded. Nothing else should be.
