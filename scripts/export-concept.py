"""Bundle editable prototype modules into a portable HTML, keeping its icons."""
from pathlib import Path
import html
import re

INCLUDE = re.compile(r"<!-- include:([A-Za-z0-9_./-]+) -->")


def expand_includes(source, assets, stack=()):
    assets = assets.resolve()

    def replace(match):
        path = (assets / match.group(1)).resolve()
        if assets not in path.parents:
            raise ValueError("Prototype include must stay inside assets")
        if path in stack:
            raise ValueError("Circular prototype include: " + path.name)
        return expand_includes(path.read_text(), assets, (*stack, path))

    result = INCLUDE.sub(replace, source)
    if "<!-- include:" in result:
        raise ValueError("Malformed prototype include")
    return result


def render_document(source, shell, assets):
    match = re.search(r'srcdoc="(.*?)"></iframe>', shell, re.S)
    if not match:
        raise ValueError("Standalone frame not found")
    frame = html.unescape(match.group(1))
    start = "<!-- PLANTORY_FRAGMENT_START -->"
    end = "<!-- PLANTORY_FRAGMENT_END -->"
    if frame.count(start) != 1 or frame.count(end) != 1:
        raise ValueError("Expected exactly one source boundary")
    before, remainder = frame.split(start)
    _, after = remainder.split(end)
    frame = before + start + "\n" + expand_includes(source, assets) + end + after
    return shell[:match.start(1)] + html.escape(frame) + shell[match.end(1):]


def main():
    root = Path(__file__).resolve().parents[1]
    target = root / "concept.html"
    result = render_document((root / "assets/concept.fragment.html").read_text(), target.read_text(), root / "assets")
    target.write_text(result)
    print("Updated concept.html (all prototype modules embedded)")


if __name__ == "__main__":
    main()
