"""Gera legendas .srt a partir dos tempos por palavra (src/words.json)."""
import json
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
words = json.loads((root / "src" / "words.json").read_text(encoding="utf-8"))


def ts(sec):
    ms = round(sec * 1000)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


lines, cur = [], []
for w in words:
    cur.append(w)
    if len(cur) >= 7 or w["text"][-1] in ".!?":
        lines.append(cur)
        cur = []
if cur:
    lines.append(cur)

out = []
for i, ln in enumerate(lines, 1):
    end = ln[-1]["end"] + 0.2
    if i < len(lines):
        end = min(end, lines[i][0]["start"])
    out.append(f"{i}\n{ts(ln[0]['start'])} --> {ts(end)}\n{' '.join(w['text'] for w in ln)}\n")
(root / "entrega").mkdir(exist_ok=True)
(root / "entrega" / "dia-de-tartaruga.srt").write_text("\n".join(out), encoding="utf-8")
print(f"{len(lines)} legendas")
