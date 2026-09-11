# Inalgesco website

Static site for inalgesco.com. Plain HTML and CSS, no build step, no framework,
no dependencies. Open any `.html` file in a browser and it works.

Replaced the previous Wix site. Live on GitHub Pages.

## Files

```
index.html                  Home
the-problem.html            Why cart cooling fails on the ramp
how-it-works.html           The air path, install, temperature records
vehicle-chillrail.html      Vehicle ChillRail: high loader retrofit
dispatch-chillrail.html     Dispatch ChillRail: the overhead oven box
dispatch-chiller-rail.html  Dispatch Chiller Rail: the warehouse system
evidence.html               Field data and inspection findings
contact.html                Enquiry form
privacy.html                Privacy notice
styles.css                  All styling, tokens at the top
*.jpg / *.png               Images, stored flat at the repo root
```

### The three product names are deliberately similar

`vehicle-chillrail`, `dispatch-chillrail` and `dispatch-chiller-rail` are three
different products. The last two differ only by a space and two letters. This is
intentional and has been confirmed. Do not "tidy" them into one name.

## Editing

**Text**: open the `.html` file and edit between the tags. Nothing is generated,
so what you see is what ships.

**Colours, type, spacing**: variables at the top of `styles.css` under `:root`.
Change `--brand` and every accent updates.

**Navigation**: the menu is repeated in each page's `<header>`. There is no
template at runtime. If you add or reorder a page you must edit all nine files.

**Images**: stored flat at the repo root, not in a subfolder. Reference them as
`<img src="high-loader-installed.jpg" alt="...">`. Always write real alt text.

## Editorial rules

These are not style preferences. They exist for commercial and legal reasons.

- **Never name an equipment manufacturer in a failure claim.** Naming a maker in
  a failure context invites complaint and adds nothing to the argument.
- **Never publish the Qatar Aviation Catering analysis**, the client name, their
  fleet size, the total contract value, or the EXW unit price. Per-truck figures
  are fine. The rest is commercially sensitive.
- The patent is **US Application 17/893,958, Notice of Allowance August 2024**.
  It is not "patent pending", which undersells it.

## Contact form

Formspree, endpoint `https://formspree.io/f/maeyvewz`, delivering to
peter.berkeley@inalgesco.com. Tested and working. Free tier caps at 50
submissions per month, so watch the volume if a campaign drives traffic.

The page also offers a `mailto:` link to contact@inalgesco.com. Confirm that
address actually delivers to a mailbox someone reads, or remove it.

## Deploying

GitHub Pages, `main` branch, root folder. Pushing to `main` publishes. The
`CNAME` file pins the custom domain to the apex, `inalgesco.com`, and GitHub
issues a Let's Encrypt certificate covering both the apex and `www`.

### DNS: read this before touching anything

**DNS is hosted at Wix, not at 123-Reg.** The nameservers are `ns10.wixdns.net`
and `ns11.wixdns.net`. All DNS edits happen inside `manage.wix.com`.

**Do not click 123-Reg's "switch to our nameservers" button.** It will wipe the
MX records and kill both company mailboxes. Mail is on Microsoft 365 and depends
entirely on the MX record currently published in the Wix zone.

Wix cannot be cancelled until the zone is migrated properly: recreate every
record at the new host first, verify, then switch nameservers.

## Working on this repo

Use the GitHub CLI (`gh`) and a local clone. Do not edit through the browser and
do not upload files from the Downloads folder. Stale copies from Downloads have
twice reverted completed work, including reinstating a manufacturer name that had
been deliberately removed. GitHub only commits files whose content differs, so it
accepts a stale copy silently.

After any push, verify against the GitHub API rather than the raw CDN. The CDN
caches and will serve old content or 404s for several minutes.
