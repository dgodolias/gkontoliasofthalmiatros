# ofthalmiatros-chania.gr

Static website of ophthalmologist Στέργιος Γκοντόλιας (Chania, Crete). Plain HTML/CSS/JS, no build step, no backend, no forms.

## Hosting and deploy

- **Netlify**, auto-deploys from GitHub `main` (dgodolias/gkontoliasofthalmiatros). A push to `main` is live within a minute, so review locally first: `python -m http.server 8765` from the repo root and open http://127.0.0.1:8765/.
- `_headers` (caching, security, `X-Robots-Tag` for leftovers) and `_redirects` are Netlify config files. The `CNAME` commits in history are leftovers from an earlier GitHub Pages attempt; GitHub Pages is not used.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Home (one-page sections: about, services, equipment, FAQ, contact) |
| `iatros/`, `ofthalmologikos-elegxos/`, `kataraktis/`, `glafkoma/`, `pathiseis-vythou/`, `paidoofthalmologia/`, `diplomata-odigisis/`, `epikoinonia/` | Greek sub-pages, one `index.html` each (Netlify serves `/kataraktis/`) |
| `en/` | English page for visitors (hreflang pair with `/`) |
| `css/modern-style.css` | The only stylesheet; self-hosted `@font-face` rules at the top |
| `js/main.js` | Shared: mobile menu, scroll reveal, hover effects, scroll-spy, click-to-load map |
| `js/intro-canvas.js`, `js/carousel.js` | Animated background and hero crossfade (no jQuery) |
| `fonts/webfonts/` | Inter + Noto Serif Display, Greek and Latin subsets (SIL OFL) |
| `img/icons.svg` | SVG sprite (Font Awesome Free 6.4 icons, CC BY 4.0). Use: `<svg class="icon"><use href="/img/icons.svg#eye"></use></svg>` |
| `robots.txt`, `sitemap.xml` | Keep `sitemap.xml` in sync when adding a page |
| other files under `css/`, `js/`, `fonts/`, `img/` | Mostly unused leftovers of the old Bootstrap template (removed step by step; check with grep before relying on one) |

Pages share the nav, footer and JSON-LD by copy, so a change to the nav, footer, phone numbers or hours must be made in all ten HTML files (search-and-replace). The footer line "Τελευταία ενημέρωση" and the `dateModified` values in the JSON-LD should be bumped on every content change.

## Rules for content (Greek medical-advertising law, Ν. 3418/2005)

- No superlatives or comparisons ("ο καλύτερος", "κορυφαίος") — άρθρο 18§4.
- No testimonials, star ratings, `aggregateRating` or `review` markup — άρθρο 17§6 and Google's self-serving-review policy. Real reviews live only on the Google Business Profile.
- The site must show its last-update date — άρθρο 18§2 (footer).
- Medical text is informational, in neutral tone, no promises of outcomes. The doctor is listed as `reviewedBy`/`author` in the JSON-LD and should read any new medical text before it goes live.
- Numbers of operations etc. only as factual CV information, matching `files/pdf/CV_GKONTOLIAS_NoCopy.pdf`.

## SEO/GEO conventions

- One `<h1>` per page, title ≤ 70 chars, meta description ≤ ~165 chars, canonical with trailing slash.
- JSON-LD graph on every page: `PhysiciansOffice`/`Physician` (`#iatreio`), `Person` (`#iatros`), `WebSite`, page node, breadcrumbs. Keep NAP identical everywhere: Κωνσταντίνου Μητσοτάκη 38, 73132 Χανιά · +30 28210 50396 · +30 697 470 1928 · geo 35.51089, 24.02959 · Google place_id `ChIJC_F4WxR9nBQRL9lfmye8AYE`.
- Opening hours are deliberately absent from the JSON-LD until the owner confirms them (directories disagree).
- No FAQPage schema (Google dropped FAQ rich results in 2026); visible `<details>` FAQs are fine.
- Lighthouse 13.5 baseline (2026-10-24, local): mobile 91/100/96/100, sub-pages 97/96/100/100.
