# Personal Website

Hey, I'm Anna and I've finally made a website!

Live at **https://annatoi01.github.io/** — a static site, no build step. Open
`index.html` directly, or serve the folder locally:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Structure

```
personal-website/
├── README.md                    # Project documentation
├── .gitignore                   # Git ignore rules
├── robots.txt                   # Crawler directives + sitemap pointer
├── sitemap.xml                  # Page list for search engines
├── index.html                   # Landing page with interactive elements
├── about.html                   # Personal story and background
├── experience.html              # Education, research experience, teaching + CV
├── projects.html                # Research projects and teaching
├── contact.html                 # Contact information
├── education.html               # Redirect stub -> experience.html (noindex)
├── 404.html                     # GitHub Pages not-found page
├── assets/
│   ├── css/
│   │   └── styles.css          # Main stylesheet (single source of truth for fonts)
│   ├── js/
│   │   ├── script.js           # Sticker hover, mobile nav, scroll effects
│   │   ├── beer-position.js    # Beer cup positioning & jiggle animation
│   │   └── bubble-spawn.js     # Sequential bubble spawning
│   ├── images/
│   │   ├── anna.png            # Profile image
│   │   ├── background.jpeg     # Landing page background
│   │   └── cv.svg              # (currently unused)
│   ├── icons/
│   │   ├── beer_cup.svg        # Beer cup icon
│   │   ├── contact.svg         # Contact icon
│   │   ├── education.svg       # Experience sticker
│   │   ├── projects.svg        # Projects sticker
│   │   └── [additional SVGs]   # Various other icons
│   └── bubbles/
│       └── bubble1-18.svg      # Animated bubble graphics
└── docs/
    └── CV_Anna_Toidze.pdf      # CV document
```

## Notes for future edits

- **Fonts** live only in `assets/css/styles.css` (Quicksand). Don't add per-page
  `<style>` overrides — that's what caused the earlier font inconsistency.
- **`index.html` bubbles**: `bubble-spawn.js` hides every *odd-indexed*
  `.bubble-container` by DOM position, so keep all 20 elements in order if you
  edit them.
- **The beer cup** is positioned by `beer-position.js`, which recomputes
  `object-fit: cover` geometry against `background.jpeg`. The percentages near
  the top of `updatePosition()` are tuned to that specific image — swapping the
  background means retuning them. The CSS values on `.beer-cup-container` are a
  matching pre-JS approximation to avoid a flash on load.
- **The contact link inside the cup** is now hardcoded in `index.html` so
  crawlers and keyboard users can reach it; `beer-position.js` reuses it if
  present and only creates one as a fallback.
- **SEO**: each page needs a `<title>`, `<meta name="description">` and a
  `<link rel="canonical">`. New pages should be added to `sitemap.xml`.
