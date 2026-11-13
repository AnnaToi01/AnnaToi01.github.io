// Fills the Research page's pop-up windows from content/research.txt, so the
// text can be edited without touching HTML. The format is explained at the top
// of that file. Each window in projects.html says which section it shows with
// data-text="phd" etc.; the frame, colours and links stay in the HTML.

(function () {
    const windows = document.querySelectorAll('.win[data-text]');
    if (!windows.length) return;

    const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // *italic*, **bold**, [text](https://link)
    function inline(text) {
        return escapeHtml(text)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)/g,
                     '<a href="$2" target="_blank" rel="noopener">$1</a>');
    }

    // "Title [now]" -> title html + the small coloured tag
    function heading(text) {
        const m = text.match(/^(.*?)\s*\[(.+?)\]\s*$/);
        if (!m) return inline(text);
        return inline(m[1]) + ' <span class="win__status">' + escapeHtml(m[2]) + '</span>';
    }

    function parse(source) {
        const sections = {};
        let current = null;
        for (const line of source.split(/\r?\n/)) {
            const start = line.match(/^===\s*(.+?)\s*===\s*$/);
            if (start) {
                current = sections[start[1].toLowerCase()] = { file: '', lines: [] };
            } else if (current) {
                const file = line.match(/^file:\s*(.+?)\s*$/);
                if (file && !current.file) current.file = file[1];
                else current.lines.push(line);
            }
        }
        return sections;
    }

    function render(lines, headingId) {
        const html = [];
        let para = [];
        let titled = false;
        const flush = () => {
            if (para.length) html.push('<p>' + inline(para.join(' ')) + '</p>');
            para = [];
        };
        for (const raw of lines) {
            const line = raw.trim();
            if (!line) { flush(); continue; }
            let m;
            if ((m = line.match(/^##\s+(.*)$/))) {
                flush(); html.push('<h3>' + heading(m[1]) + '</h3>');
            } else if ((m = line.match(/^#\s+(.*)$/))) {
                flush();
                html.push('<h2' + (titled ? '' : ' id="' + headingId + '"') + '>' + heading(m[1]) + '</h2>');
                titled = true;
            } else if (/^-{3,}$/.test(line)) {
                flush(); html.push('<hr class="win__rule">');
            } else if ((m = line.match(/^>\s?(.*)$/))) {
                flush(); html.push('<p class="win__note">' + inline(m[1]) + '</p>');
            } else {
                para.push(line);
            }
        }
        flush();
        return html.join('\n');
    }

    function fill(sections) {
        windows.forEach(win => {
            const name = win.dataset.text;
            const section = sections[name];
            const body = win.querySelector('.win__content');
            if (!section) {
                body.innerHTML = '<p class="win__note">No "=== ' + escapeHtml(name) +
                                 ' ===" section in content/research.txt.</p>';
                return;
            }
            const file = section.file || name + '.txt';
            win.querySelector('.win__title').textContent = file;
            win.querySelector('.win__prompt').textContent = 'C:\\> type ' + file;
            body.innerHTML = render(section.lines, win.getAttribute('aria-labelledby'));
        });
    }

    // no-cache: always ask the server whether the file changed, so an edit
    // shows up on the next reload instead of after the browser cache expires
    fetch('content/research.txt', { cache: 'no-cache' })
        .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(text => fill(parse(text)))
        .catch(() => windows.forEach(win => {
            win.querySelector('.win__content').innerHTML =
                '<p class="win__note">Could not load content/research.txt. ' +
                'Open the page through a web server (python3 tools/serve.py), not by double-clicking the file.</p>';
        }));
})();
