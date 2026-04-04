#!/bin/bash

# Google Doc Extractor (curl + python, no browser needed)
#
# Extracts text from a publicly viewable Google Doc using /mobilebasic.
# Works even when copy/download is disabled.
#
# Usage:
#   ./extract.sh <google-doc-url> [output.md]
#
# Examples:
#   ./extract.sh "https://docs.google.com/document/d/ABC123/edit"
#   ./extract.sh "https://docs.google.com/document/d/ABC123/edit" output.md

set -euo pipefail

URL="${1:-}"
OUTPUT="${2:-}"

if [ -z "$URL" ]; then
  echo "Usage: $0 <google-doc-url> [output.md]" >&2
  exit 1
fi

# Extract doc ID
DOC_ID=$(echo "$URL" | grep -oP '(?<=/document/d/)[a-zA-Z0-9_-]+' 2>/dev/null || \
         echo "$URL" | sed -n 's|.*/document/d/\([a-zA-Z0-9_-]*\).*|\1|p')

if [ -z "$DOC_ID" ]; then
  echo "Error: Could not extract document ID from URL" >&2
  exit 1
fi

MOBILE_URL="https://docs.google.com/document/d/${DOC_ID}/mobilebasic"
echo "Fetching: $MOBILE_URL" >&2

HTML=$(curl -sL "$MOBILE_URL")

MARKDOWN=$(echo "$HTML" | python3 -c "
import sys, re
from html.parser import HTMLParser

class DocExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.result = []
        self.current_text = []
        self.skip = False
        self.tag_stack = []

    def handle_starttag(self, tag, attrs):
        self.tag_stack.append(tag)
        if tag in ('script', 'style'):
            self.skip = True
        if tag == 'br':
            self.current_text.append('\n')

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = False
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()

        text = ''.join(self.current_text).strip()
        self.current_text = []

        if not text:
            return

        if tag == 'h1':
            self.result.append(f'# {text}\n')
        elif tag == 'h2':
            self.result.append(f'## {text}\n')
        elif tag == 'h3':
            self.result.append(f'### {text}\n')
        elif tag == 'h4':
            self.result.append(f'#### {text}\n')
        elif tag in ('p', 'div', 'li'):
            self.result.append(text)
            self.result.append('')

    def handle_data(self, data):
        if not self.skip:
            self.current_text.append(data)

parser = DocExtractor()
parser.feed(sys.stdin.read())
output = '\n'.join(parser.result)
# Clean up excessive blank lines
output = re.sub(r'\n{4,}', '\n\n\n', output)
# Replace non-breaking spaces
output = output.replace('\xa0', ' ')
print(output.strip())
")

if [ -n "$OUTPUT" ]; then
  echo "$MARKDOWN" > "$OUTPUT"
  echo "Saved to: $OUTPUT ($(echo "$MARKDOWN" | wc -c | tr -d ' ') chars)" >&2
else
  echo "$MARKDOWN"
fi
