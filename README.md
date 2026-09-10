# Inalgesco website

Static replacement for the Wix site at inalgesco.com. Plain HTML and CSS — no
build step, no framework, no dependencies. Open any `.html` file in a browser
and it works.

## Files

```
index.html                  Home
who-we-are.html             Peter and Derek
innovations.html            The two systems, overview
how-it-works.html           The air path, install, temperature records
dispatch-chiller-rail.html  Product page + advantages
vehicle-chiller-rail.html   Product page + advantages
contact.html                Enquiry form
privacy.html                Privacy notice (rewritten — see note below)
styles.css                  All styling, tokens at the top
images/                     Put downloaded Wix images here (create this folder)
```

## Editing

**Text** — open the `.html` file and edit between the tags. Nothing is
generated, so what you see is what ships.

**Colours, type, spacing** — all controlled by variables at the top of
`styles.css` under `:root`. Change `--brand` and every accent updates.

**Navigation** — the menu is repeated in each page's `<header>`. If you add a
page, add the `<li>` to all of them. (This is the one downside of no build
step; with 8 pages it is manageable.)

## Two things still to do

### 1. The contact form needs a backend

Static hosting cannot send email. `contact.html` currently points at a
Formspree placeholder. Pick one:

- **Formspree** — free tier, sign up at formspree.io, then replace
  `YOUR_FORM_ID` in `contact.html` with the ID they give you.
- **Netlify Forms** — if you host on Netlify, change the `<form>` tag to
  `<form class="form" name="enquiry" method="POST" data-netlify="true">`
  and it works with no third party.

The `mailto:` link to contact@inalgesco.com works regardless — **confirm that
address actually delivers to a mailbox you read.**

### 2. Images

The photographs on the Wix site are hosted on Wix's CDN and are not included
here. Download them from the Wix media manager (Site → Media), drop them in
`images/`, and add them where you want, e.g.

```html
<img src="images/chillrail-installed.jpg"
     alt="Chiller Rail ducting installed along a high loader interior">
```

Always write real `alt` text — it matters for both accessibility and search.

## What changed from the Wix site

Fixes applied while rebuilding:

| Issue on Wix site | Status |
|---|---|
| Social icon linked to `linkedin.com/company/wix-com` | Removed — add your own LinkedIn when ready |
| Copyright read ©2021 | Now 2026 |
| Privacy notice dated Feb 2021, referenced a Facebook app and an "App" that don't exist | Rewritten in plain English, scoped to what the site actually does |
| Contact page lost the navigation menu | Navigation now present on every page |
| "Dispatch cooler Rail" vs "Dispatch Chiller Rail" | Named consistently throughout |
| "does not significantly effect the payload" / "making it effect the cooler" | Corrected to *affect*; the second sentence reworded |
| No skip link, no visible focus states | Both added |

Still worth adding when you have it: customer names, a case study, test data,
and photographs of installed systems. The cost claims are strong but currently
unsupported, and an airline procurement team will ask for evidence.

## Deploying

Any static host. All free for a site this size:

- **GitHub Pages** — push this repo, then Settings → Pages → deploy from
  `main` branch, root folder.
- **Netlify** or **Cloudflare Pages** — connect the repo, no build command
  needed, publish directory is the repo root.

Then point `inalgesco.com` at it by updating the DNS records at 123-Reg. Keep
the Wix site live until the new one is up and you are happy with it.
