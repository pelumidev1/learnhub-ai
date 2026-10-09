"""Voice a lesson's narration with Kokoro-82M, on this machine, for free.

  python -I scripts/narrate.py src/lessons/w1l1

Reads narration.json in that folder, writes one WAV per beat to
public/lessons/<name>/ and the measured length of each to timing.json beside
the narration, which the composition reads to time every scene. A beat whose
text has not changed since the last run is not re-voiced.

Needs a venv with kokoro-onnx and soundfile, and the model files that
`hyperframes tts` downloads to ~/.cache/hyperframes/tts.
"""

import hashlib
import json
import shutil
import sys
from pathlib import Path

import espeakng_loader
from kokoro_onnx import EspeakConfig, Kokoro
import soundfile as sf

CACHE = Path.home() / ".cache/hyperframes/tts"

folder = Path(sys.argv[1])
name = folder.name
spec = json.loads((folder / "narration.json").read_text())
out = Path("public/lessons") / name
out.mkdir(parents=True, exist_ok=True)

timing_path = folder / "timing.json"
old = json.loads(timing_path.read_text()) if timing_path.exists() else {}

# espeak-ng keeps its data path in a 160-byte buffer and silently truncates a
# longer one (a venv inside a deep folder is longer), so copy the data to a short path (a symlink gets resolved back to the long one).
data = CACHE / "espeak-ng-data"
if not data.exists():
    shutil.copytree(espeakng_loader.get_data_path(), data)
kokoro = Kokoro(
    str(CACHE / "models/kokoro-v1.0.onnx"),
    str(CACHE / "voices/voices-v1.0.bin"),
    espeak_config=EspeakConfig(lib_path=espeakng_loader.get_library_path(), data_path=str(data)),
)

timing = {}
for chapter in spec["chapters"]:
    for beat in chapter["beats"]:
        said = beat.get("say", beat["text"])
        key = hashlib.sha1(f'{spec["voice"]}|{spec["speed"]}|{said}'.encode()).hexdigest()[:12]
        wav = out / f'{beat["id"]}.wav'
        if old.get(beat["id"], {}).get("key") == key and wav.exists():
            timing[beat["id"]] = old[beat["id"]]
            continue
        samples, rate = kokoro.create(said, voice=spec["voice"], speed=spec["speed"], lang="en-us")
        sf.write(wav, samples, rate)
        timing[beat["id"]] = {"key": key, "seconds": round(len(samples) / rate, 3)}
        print(f'{beat["id"]}: {timing[beat["id"]]["seconds"]}s', flush=True)

timing_path.write_text(json.dumps(timing, indent=1) + "\n")
print(f"total {sum(t['seconds'] for t in timing.values()):.1f}s")
