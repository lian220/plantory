"""Refresh the editable fragment while retaining the standalone icon bundle."""
from pathlib import Path
import html
import re

root = Path(__file__).resolve().parents[1]
source = (root / "assets/concept.fragment.html").read_text()
target = root / "concept.html"
shell = target.read_text()
match = re.search(r'srcdoc="(.*?)"></iframe>', shell, re.S)
if not match:
    raise SystemExit("Standalone frame not found")
frame = html.unescape(match.group(1))
start = "<!-- PLANTORY_FRAGMENT_START -->"
end = "<!-- PLANTORY_FRAGMENT_END -->"
if frame.count(start) != 1 or frame.count(end) != 1:
    raise SystemExit("Expected exactly one source boundary")
before, remainder = frame.split(start)
_, after = remainder.split(end)
frame = before + start + "\n" + source + end + after
target.write_text(shell[:match.start(1)] + html.escape(frame) + shell[match.end(1):])
print("Updated concept.html")
