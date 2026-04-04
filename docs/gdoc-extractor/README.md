# Google Doc Extractor

Extract text from Google Docs — even when the owner has disabled copy, download, and print.

## How it works

Google Docs has a **mobile basic view** at:

```
https://docs.google.com/document/d/{DOC_ID}/mobilebasic
```

This URL renders the document as plain HTML instead of the canvas-based editor used in the normal view. The copy/download restrictions only apply to the editor UI — the mobile basic view serves the full content as standard HTML elements that can be read from the DOM.

### Why other approaches fail

| Approach | Result |
|---|---|
| `/export?format=txt` | 401 — blocked for anonymous/non-owner |
| `/pub` | 401 — doc not published |
| Normal editor DOM (`kix-page`, `kix-lineview`) | Empty — Google Docs uses canvas rendering |
| `Cmd+A` → `Cmd+C` (clipboard) | Empty — copy is disabled by doc settings |
| File > Download menu | All items disabled |
| Screen reader mode (`Cmd+Option+Z`) | Enables ARIA but text still in canvas, not DOM |
| `DOCS_modelChunk` JS variable | Declared but undefined (loaded async, not accessible) |

### What works

Navigate to `/mobilebasic` → read `document.body.innerText` → done.

## Usage

### With Playwright (automated)

```bash
node docs/gdoc-extractor/extract.mjs "https://docs.google.com/document/d/YOUR_DOC_ID/edit"
```

### With any browser (manual)

1. Change the URL from `/edit` to `/mobilebasic`
2. Open DevTools (F12) → Console
3. Run: `document.body.innerText`
4. Copy the output

### With curl (if doc is publicly viewable)

```bash
DOC_ID="your-doc-id-here"
curl -sL "https://docs.google.com/document/d/${DOC_ID}/mobilebasic" \
  | python3 -c "
import sys
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.skip = False
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip = True
    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = False
        if tag in ('p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'br', 'li'):
            self.text.append('\n')
    def handle_data(self, data):
        if not self.skip:
            self.text.append(data)

parser = TextExtractor()
parser.feed(sys.stdin.read())
print(''.join(parser.text).strip())
"
```

## Limitations

- The doc must be viewable (shared via link or public). This does not bypass access controls — only UI copy restrictions.
- Images and drawings are not extracted (text only).
- Table formatting may be lost in plain text extraction.
