# Phase 9 — Domain and launch, explained simply

Plain-language guide. Every technical word is explained the first time it appears.

---

## The words

**Domain** — the address people type. `elsewhere-something.com`. You rent it yearly.

**Registrar** — the shop you rent it from. Namecheap, Porkbun, INWX, Cloudflare are all fine.

**DNS** — the phone book of the internet. It tells browsers which computer your domain points at.
You edit it at the registrar.

**Vercel** — where the site is hosted. It already builds the site from your code.

**SSL / HTTPS** — the padlock. Encrypts the connection. Vercel sets this up automatically and free.

**Canonical URL** — the one official address for a page. If a page is reachable at several addresses,
Google needs to know which one counts, or the versions compete with each other.

**www vs non-www** — `www.elsewhere.com` and `elsewhere.com` are technically different addresses.
Pick one, redirect the other to it. Which you pick does not matter; picking one does.

**Search Console** — a free Google tool showing what people searched to find you.

---

## Choosing a domain

No domain has been researched, suggested or registered for you — that is your decision and your
money.

What to look for:

- `.com` if you can get it. Otherwise `.photo`, `.studio`, `.co` are all respectable.
- Short enough to say out loud without spelling it.
- No hyphens or numbers if avoidable.
- Check the name is not already a business in photography or travel.

Since the publication is called ELSEWHERE, something containing "elsewhere" keeps everything
consistent. Bare `elsewhere.com` will be long gone and expensive; a two-word combination is normal
and fine.

**Check availability at the registrar itself.** Availability changes constantly and anything written
here would be out of date immediately.

---

## Connecting it — the whole process

**1. Buy the domain.** At any registrar. Roughly €10–15 a year for `.com`. Turn on WHOIS privacy if
offered — usually free, and it keeps your home address out of a public database.

**2. Add it to Vercel.** Project → Settings → Domains → type your domain → Add.

**3. Point DNS at Vercel.** Vercel shows you exactly which records to create. Copy them into your
registrar's DNS settings. Usually:
- an `A` record for the bare domain
- a `CNAME` record for `www`

Vercel gives you the exact values. Do not guess them.

**4. Wait.** Ten minutes to a few hours. Sometimes up to a day. Vercel shows a green tick when ready.

**5. Choose your main address.** In Vercel, set one as primary and the other to redirect. Either way
round is fine.

**6. SSL.** Automatic. Confirm the padlock appears.

**7. Tell the site its own address.** In Vercel → Settings → Environment Variables, add:

```
SITE_URL = https://your-domain.com
```

No trailing slash. **This matters more than it looks.** It generates every canonical URL, every
social preview link, and both sitemaps. Get it wrong and Google indexes the wrong addresses.

**8. Set the enquiry address at the same time.**

```
PUBLIC_CONTACT_EMAIL = your@address.com
PUBLIC_CREATOR_NAME  = Your Name
```

Without the email, every enquiry path on the site stays hidden.

**9. Redeploy.** Environment variables only take effect on a new build. Vercel → Deployments →
Redeploy.

---

## Checking it worked

Visit these and confirm each looks right:

- `https://your-domain.com` — padlock, site loads
- `https://your-domain.com/sitemap.xml` — lists your real domain, not `localhost`
- `https://your-domain.com/robots.txt` — mentions both sitemaps
- `https://your-domain.com/studio/` — the *Discuss a project* link is visible
- `https://your-domain.com/contact/` — the form appears

If sitemap.xml still says `localhost`, `SITE_URL` did not take. Check for a typo and redeploy.

---

## Social previews

Paste your homepage URL into a Slack, WhatsApp or LinkedIn message and see if the photograph appears.
If it does, previews work everywhere.

Facebook and LinkedIn cache aggressively. If you change something and the old preview persists, use
their debugger tools to refresh it.

---

## Then

Search Console: [PHASE-9-SEARCH-CONSOLE-SETUP.md](PHASE-9-SEARCH-CONSOLE-SETUP.md).

Legal pages **before** promoting the site to a German audience:
[PHASE-9-LEGAL-LAUNCH-CHECKLIST-DE-EU.md](PHASE-9-LEGAL-LAUNCH-CHECKLIST-DE-EU.md).
