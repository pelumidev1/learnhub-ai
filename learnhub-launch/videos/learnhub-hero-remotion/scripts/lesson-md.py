"""Write a lesson film's chapter times and transcript into its lesson file.

  python3 scripts/lesson-md.py src/lessons/w1l2 ../../../content/bootcamp/week-1/02-claude-chatgpt-and-gemini.md

Mirrors src/lessons/LessonFilm.tsx and timeline.ts: the logo and title, then
per chapter an optional card and the scene, joined by transitions that overlap
their neighbours. A chapter's time is when its card (or scene) starts.
"""

import json
import math
import re
import sys
from pathlib import Path

FPS, TITLE, CARD, GAP, TAIL, INTO_SCENE, INTO_CARD = 30, 180, 60, 12, 24, 12, 18

folder, md = Path(sys.argv[1]), Path(sys.argv[2])
n = json.loads((folder / "narration.json").read_text())
t = json.loads((folder / "timing.json").read_text())

start, prev_len, chapters = 0, TITLE, []
for c in n["chapters"]:
    scene = sum(math.ceil(t[b["id"]]["seconds"] * FPS) + GAP for b in c["beats"]) + TAIL
    if c["label"]:
        start += prev_len - INTO_CARD
        chapters.append({"label": c["label"], "at": round(start / FPS)})
        prev_len = CARD
    start += prev_len - INTO_SCENE
    prev_len = scene

s = md.read_text()
s = re.sub(r"^chapters: .*$", "chapters: " + json.dumps(chapters, ensure_ascii=False, separators=(",", ":")), s, count=1, flags=re.M)
parts = []
for c in n["chapters"]:
    if c["label"]:
        parts.append(f"### {c['label']}")
    parts.append(" ".join(b["text"] for b in c["beats"]))
s = s[: s.index("## Transcript")] + "## Transcript\n\n" + "\n\n".join(parts) + "\n"
md.write_text(s)
print(md.name, [(c["label"], c["at"]) for c in chapters], f"length {(start + prev_len) / FPS:.1f}s")
