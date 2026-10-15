# The bench scene SVG

Compose the whole Research-page scene here as **one SVG**, then run:

```bash
python3 tools/build-bench.py
```

That reads `assets/bench/bench.svg`, wraps the objects you named in links, and
writes the result into `projects.html` between the `BENCH:START` / `BENCH:END`
markers. Nothing in the CSS or HTML needs touching by hand — placement lives
entirely in the SVG.

## What the file needs

1. A `viewBox` (any size; the scene scales to fit the page).
2. One **group per clickable object**, each with one of these exact IDs:

   | ID               | opens                                    |
   |------------------|------------------------------------------|
   | `obj-computer`   | Co-evolution of MGEs + pangenome of E. coli |
   | `obj-blackboard` | Mathematical modeling of plasmids         |
   | `obj-pipettes`   | GFP fitness landscapes                    |
   | `obj-mice`       | Subretinal fibrosis                       |

   Everything else in the file (the bench, background, props, shadows) is left
   alone and stays non-clickable.

3. Each object must be a **single group**, not loose paths. Select the parts →
   group them → set the ID on the group.

## Setting the ID in each tool

- **Inkscape** — select the group, `Object ▸ Object Properties` (Ctrl+Shift+O),
  type the ID in the **ID** field and press Enter. The *Label* field is not the
  same thing; the script reads `id`. Save as *Plain SVG* or *Optimised SVG*.
- **Illustrator** — name the group in the Layers panel, then on export tick
  `SVG Options ▸ Object IDs ▸ Layer Names`.
- **Figma** — name the group exactly as above and export the frame as SVG.
  Figma sometimes rewrites ids; the script will tell you which ones it could
  not find, so just re-check the names and re-run.

## If the bench is a photograph

Don't embed a big photo inside the SVG — that is what made `cv.svg` 16 MB.
Two options:

- **Preferred:** save the photo separately (e.g. `assets/bench/bench.jpg`,
  resized to ~2000px wide) and put a placeholder rectangle with
  `id="bench-photo"` in the SVG where it belongs. The script swaps that
  rectangle for an `<image>` pointing at the photo.
- Or just trace/draw the bench and keep the whole thing vector.

## Checking it worked

The script prints every ID it found, every one it expected but did not find,
and refuses to write anything if the SVG will not parse — so a bad export can
never leave `projects.html` broken.
