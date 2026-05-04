import http.server, os, sys

os.chdir('/Users/ekg/Desktop/Footyquiz')

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory='/Users/ekg/Desktop/Footyquiz', **kw)
    def log_message(self, *a):
        pass

http.server.HTTPServer(('', 3000), Handler).serve_forever()
