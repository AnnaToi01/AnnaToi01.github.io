# Design notes — small-web / handmade site research

Survey of ~46 sites from the "personal web" list on <https://ribo.zone/links>,
read by pulling their actual stylesheets rather than eyeballing them, plus
screenshots of the most relevant. Written up so we don't have to redo it.

## What these sites have in common

Frequency across 46 sites (from their real CSS):

| technique | hits | note |
|---|---|---|
| `@font-face` (self-hosted fonts) | 32 | **the single biggest differentiator** |
| CSS custom properties | 25 | palettes/fonts as variables |
| `filter:` | 23 | drop-shadow, invert, hue-rotate on line art |
| `@keyframes` animation | 22 | small idle loops, not scroll effects |
| `image-rendering: pixelated` | 19 | tiny art scaled up crisply |
| dotted / dashed borders | 18 | cheap "handmade" signal |
| `grid` | 18 | modern layout under a retro skin |
| `text-shadow` | 16 | 1px hard offset, not blur |
| `<iframe>` / frames | 15 | sidebars, guestbooks, webrings |
| styled scrollbars | 11 | |
| custom cursors | 10 | you already have these |
| hard `box-shadow` (0 blur) | 6 | the chunky offset-block look |
| `<marquee>` / `<blink>` | 9 | unironically |

**The lesson:** the "handmade" feeling comes almost entirely from *typography +
one or two textures*, not from layout complexity. Nearly all of them are a
plain single column or a sidebar; the personality is in the fonts, the borders,
and small looping animations.

## Sites worth stealing from, specifically

**pearlitegates.com** (formerly meowlecules — a metallurgist, so closest to your
situation: a scientist's personal site)
- Big **Instrument Serif** display headline over a clean sans body. That single
  serif/sans contrast does most of the work.
- Content sits on a card with a **scalloped/torn top edge** like a postage stamp.
- Ornamental **engraved line-art** decoration (a clock wreathed in flowers) —
  the etched-botanical-plate look. Your phage/E. coli drawings are already this.
- A solid rotated colour rectangle behind the character illustration, exactly
  like a sticker. You have this on the landing page already.
- Light/dark toggle via a lightbulb icon.
- Palette: `#f2f1ed` `#5f666d` `#b0c4de` `#ebe8df` on near-black.

**espy.world** — the structural idea I'd most like to try for you: a central
illustrated figure with **leader lines running out to labelled panels**. It is
literally an annotated diagram used as navigation. For a biologist that's an
open goal (label the parts of a cell / a phage / a bench).

**saturn.town** — restraint done well. Near-black `#0a0908`, one warm accent
`#f6bf55`, iA Duo/Quattro mono throughout, left sidebar nav, lowercase links,
uppercase letter-spaced section labels, and a multi-colour hairline rule as the
only ornament.

**maya.land** — `Sorts Mill Goudy` + pixel fonts, teal/ochre (`#008080`,
`#f0b05c`), tiled background, `border-image` frames.

**bacteria.icu** — three self-hosted fonts at once (retrocomp, lucky_typewriter,
zig) and it works because each has one job: chrome, body, accent.

**sixey.es** — a whole site on `courier new` alone. Proof you don't need a font
budget, just conviction.

## Fonts these sites actually use

Harvested from their `@font-face` and Google Fonts calls.

Pixel / terminal: `DepartureMono` · `Silkscreen` · `VT323` · `Pixelify Sans` ·
`PixelTimes16` · `5Years` · `Early Gameboy` · `bpdotssquare` · `U001` ·
`DOS` · `IBM` (VGA-style)

Mono (readable): `iA Duo` / `iA Quattro` · `IBM Plex Mono` · `Commit Mono` ·
`Cascadia Code` · `Victor Mono` · `CamingoCode` · `Anonymous Pro` ·
`Lucida Console` · plain `courier new`

Display / funky: `Unbounded` · `Orbitron` · `Cherry` · `Concert One` ·
`Madimi One` · `Company Contract` · `Soulful Serif` · `CirrusCumulus` ·
`DINdong` · `Avara` · `Bodoni Ornaments ITC` · `Luminari`

Handwritten: `Dadhand` · `Adorable Doll` · `Adabelle` · `Cake` · `Neucha` ·
`Indie Flower`

Body text that stays legible: `Atkinson Hyperlegible` (designed for low vision —
kalechips uses it) · `Instrument Sans` · `Apfel Grotezk` · `Degular` ·
`Neue Haas Grotesk` · `Nunito` · `Geometria`

## Ideas queued for this site

- **Annotated-diagram navigation** (espy.world): draw leader lines from parts of
  an organism to the project panels.
- **Scalloped / torn card edges** for the pop-up windows instead of straight ones.
- **Specimen-label styling**: catalogue number, small caps, hairline rules — fits
  a biologist better than XP chrome does.
- **A light/dark toggle** — very common on these sites, and the purple palette
  has both ends already.
- **An idle animation** on the bench: something bubbling, a blinking cursor.
- **88×31 buttons + a webring** — these sites link to each other constantly; it
  is how anyone finds them. Relevant to the findability problem.
- **`image-rendering: pixelated`** if any small art gets scaled up.

## See it live

`style-lab.html` in the project root renders five window treatments and several
font pairings side by side with real content, so choices can be made by looking
rather than by imagining. It is `noindex` and not linked from the site.
