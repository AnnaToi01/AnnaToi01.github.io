#!/usr/bin/env python3
"""
Turn a hand-composed SVG into the clickable bench scene on the Research page.

    python3 tools/build-bench.py [path/to/bench.svg]

Reads the SVG, wraps each named object group in an SVG <a> pointing at its
project panel, and injects the result into projects.html between the
BENCH:START / BENCH:END markers.

Design notes
  * Placement stays in the SVG. Nothing here computes or edits coordinates,
    so re-exporting from Inkscape/Illustrator/Figma and re-running is safe.
  * SVG <a> hit-tests the actual drawn shape, so objects are only clickable
    where they are visible - no oversized bounding boxes.
  * Nothing is written unless the SVG parses and the markers are found, so a
    broken export cannot leave projects.html half-edited.
"""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

SVG = 'http://www.w3.org/2000/svg'
XLINK = 'http://www.w3.org/1999/xlink'

# object id in the SVG -> (panel id in projects.html, accessible label)
OBJECTS = {
    'obj-computer':   ('p-computer',   'Co-evolution of MGEs and pangenome evolution of E. coli'),
    'obj-blackboard': ('p-blackboard', 'Mathematical modeling of plasmids'),
    'obj-pipettes':   ('p-pipettes',   'GFP fitness landscapes'),
    'obj-mice':       ('p-mice',       'Subretinal fibrosis'),
}
PHOTO_ID = 'bench-photo'
START, END = '<!-- BENCH:START (generated) -->', '<!-- BENCH:END -->'


def strip_editor_cruft(root):
    """Drop Inkscape/Sodipodi bookkeeping so the inlined markup stays readable."""
    junk_ns = ('sodipodi', 'inkscape')
    removed = 0
    for el in root.iter():
        for key in list(el.attrib):
            if any(f'{{http://{n}' in key or key.startswith(n + ':') for n in junk_ns) \
               or 'sodipodi' in key or 'inkscape' in key:
                del el.attrib[key]
                removed += 1
    for el in list(root):
        tag = el.tag if isinstance(el.tag, str) else ''
        if 'namedview' in tag or 'sodipodi' in tag:
            root.remove(el)
    return removed


def find_by_id(root, wanted):
    for el in root.iter():
        if el.get('id') == wanted:
            return el
    return None


def parent_map(root):
    return {c: p for p in root.iter() for c in p}


def main():
    svg_path = Path(sys.argv[1] if len(sys.argv) > 1 else 'assets/bench/bench.svg')
    page = Path('projects.html')

    if not svg_path.exists():
        sys.exit(f'! {svg_path} not found.\n  Compose the scene and save it there '
                 f'- see assets/bench/README.md')

    ET.register_namespace('', SVG)
    ET.register_namespace('xlink', XLINK)
    try:
        tree = ET.parse(svg_path)
    except ET.ParseError as e:
        sys.exit(f'! {svg_path} is not valid XML/SVG: {e}\n  Nothing was written.')
    root = tree.getroot()

    if not root.get('viewBox'):
        sys.exit('! the SVG has no viewBox, so it cannot scale.\n'
                 '  In Inkscape: File > Document Properties > set the page size, then Save As '
                 'Plain SVG.\n  Nothing was written.')

    # let CSS own the size
    for attr in ('width', 'height'):
        root.attrib.pop(attr, None)
    root.set('class', 'bench-svg')
    root.set('aria-label', 'My lab bench. Each object opens a project.')
    root.set('preserveAspectRatio', 'xMidYMid meet')

    n = strip_editor_cruft(root)
    parents = parent_map(root)

    # swap a placeholder rect for the real photo, if present
    photo = find_by_id(root, PHOTO_ID)
    if photo is not None:
        candidates = sorted(Path('assets/bench').glob('bench.*'))
        candidates = [c for c in candidates if c.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp')]
        if candidates:
            img = candidates[0]
            photo.tag = f'{{{SVG}}}image'
            photo.set('href', f'{img.as_posix()}')
            photo.set('preserveAspectRatio', 'xMidYMid slice')
            print(f'  photo    : {PHOTO_ID} -> <image href="{img.as_posix()}">')
        else:
            print(f'  photo    : found {PHOTO_ID} but no assets/bench/bench.{{jpg,png,webp}} '
                  f'- left as a plain shape')

    found, missing = [], []
    for obj_id, (panel, label) in OBJECTS.items():
        el = find_by_id(root, obj_id)
        if el is None:
            missing.append(obj_id)
            continue
        parent = parents.get(el, root)
        idx = list(parent).index(el)
        link = ET.Element(f'{{{SVG}}}a', {
            'href': f'#{panel}',
            'class': 'bench-hit',
            'aria-label': label,
        })
        parent.remove(el)
        link.append(el)
        parent.insert(idx, link)
        found.append(obj_id)

    body = ET.tostring(root, encoding='unicode')
    # ElementTree emits a default-ns declaration we want, but tidy the spacing
    body = re.sub(r'\s+\n', '\n', body).strip()

    text = page.read_text(encoding='utf-8')
    if START not in text or END not in text:
        sys.exit(f'! could not find the {START} / {END} markers in {page}.\n'
                 f'  Nothing was written.')
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    page.write_text(f'{head}{START}\n{body}\n            {END}{tail}', encoding='utf-8')

    print(f'  stripped : {n} editor attributes')
    print(f'  linked   : {", ".join(found) if found else "nothing"}')
    if missing:
        print(f'  MISSING  : {", ".join(missing)}')
        print('             (those objects will not be clickable - check the ids)')
    print(f'  wrote    : {page}')


if __name__ == '__main__':
    main()
