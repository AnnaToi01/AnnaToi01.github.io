#!/usr/bin/env python3
"""
Local preview server that never caches.

    python3 tools/serve.py [port]        # default 8765

python -m http.server sends Last-Modified but no Cache-Control, so browsers
happily keep serving an old styles.css or script.js after you edit it - which
looks exactly like "my change did nothing". This sends no-store on everything,
so a plain reload always gets the current file.
"""
import functools
import http.server
import socketserver
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # quiet


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', port), NoCacheHandler) as httpd:
        print(f'serving {sys.argv[0].rsplit("/",2)[0] or "."} at http://localhost:{port}/  (no-cache)')
        httpd.serve_forever()
