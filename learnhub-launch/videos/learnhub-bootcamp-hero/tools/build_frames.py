#!/usr/bin/env python3
"""Generate the LearnHub hero frames that share the week structure.

Every week frame is three shots, measured from the reference (reference/REFERENCE.md §9):
  A  divider   0.0-0.8s  hard cut in, number rolls one step in 0.2s, hold
  B  title     0.8-1.8s  paper ground, words blur sharp in ~5 frames, 3% push
  C  demo      1.8-5.0s  cut in already moving, header builds in place in a glass pill
Frame 04 (the AI brain) is hand-built and not generated here.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "compositions" / "frames"

MARK = ('<svg viewBox="0 0 420 420" class="{cls}" fill="currentColor"><path fill-rule="evenodd" '
        'd="M233.52 333.58A145 145 0 1 1 332.63 267.87A67.3 67.3 0 0 0 233.52 333.58ZM133 190.5a77 77 0 1 0 154 0a77 77 0 1 0 -154 0Z"/>'
        '<path d="M253 327a47.5 47.5 0 1 0 95 0a47.5 47.5 0 1 0 -95 0Z"/></svg>')
TICK = '<svg viewBox="0 0 24 24" class="{cls}"><path d="m5 12 5 5L20 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CURSOR = ('<svg viewBox="0 0 24 24" id="{p}-cur" class="cur"><path d="M5 3l14 8-6.2 1.6L10 19z" fill="#0B0F1A" '
          'stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg><div id="{p}-ring" class="ring"></div>')

FONTS = """
    @font-face { font-family: "Instrument Serif"; src: url("assets/fonts/InstrumentSerif-Regular.woff2") format("woff2"); }
    @font-face { font-family: "Instrument Serif"; font-style: italic; src: url("assets/fonts/InstrumentSerif-Italic.woff2") format("woff2"); }
    @font-face { font-family: "General Sans"; src: url("assets/fonts/GeneralSans-Variable.woff2") format("woff2"); font-weight: 200 700; }
    @font-face { font-family: "Switzer"; src: url("assets/fonts/Switzer-Variable.woff2") format("woff2"); font-weight: 100 900; }
    @font-face { font-family: "Geist Mono"; src: url("assets/fonts/GeistMono-Regular.ttf") format("truetype"); }
"""

BASE_CSS = """
    #root { position: absolute; inset: 0; overflow: hidden; font-family: "General Sans", sans-serif; color: #0B0F1A; }
    .paper { position: absolute; inset: 0; background: #F6F7FB; }
    .glow { position: absolute; left: 160px; right: 160px; top: 520px; height: 760px; border-radius: 50%;
      background: radial-gradient(closest-side, rgba(76,147,240,.24), rgba(76,147,240,0)); }
    .serif { font-family: "Instrument Serif", serif; font-weight: 400; }
    .mono { font-family: "Geist Mono", monospace; }
    .acc { color: #1F33CC; font-style: italic; }
    .win { position: absolute; background: #fff; border: 1.5px solid #E7EAF1; border-radius: 26px; overflow: hidden;
      box-shadow: 0 2px 4px rgba(11,15,26,.06), 0 40px 90px -40px rgba(11,15,26,.32); }
    .bar { height: 56px; background: #F6F7FB; border-bottom: 1.5px solid #E7EAF1; display: flex; align-items: center; gap: 11px; padding: 0 22px; }
    .bar i { width: 14px; height: 14px; border-radius: 50%; background: #D8DEEA; display: block; }
    .url { margin: 0 auto; font-family: "Geist Mono", monospace; font-size: 18px; color: #8A93A6; background: #fff; border: 1.5px solid #E7EAF1; border-radius: 999px; padding: 5px 28px; }
    .tick { width: 34px; height: 34px; border-radius: 50%; background: #1F33CC; color: #fff; display: grid; place-items: center; flex: none; }
    .tick svg { width: 19px; height: 19px; }
    .btn { background: linear-gradient(180deg,#2A46F0,#1F33CC 55%,#182AB0); color: #fff; border-radius: 999px; font-weight: 600;
      box-shadow: inset 0 1.5px 0 rgba(255,255,255,.32), 0 20px 40px -20px rgba(31,51,204,.6); display: inline-flex; align-items: center; justify-content: center; }
    .glass { background: rgba(255,255,255,.58); border: 1.5px solid rgba(255,255,255,.85); backdrop-filter: blur(22px) saturate(1.6);
      box-shadow: inset 0 1.5px 0 rgba(255,255,255,.95), 0 30px 70px -30px rgba(11,15,26,.38); }
    .gpill { display: inline-flex; align-items: center; gap: 10px; border-radius: 999px; padding: 10px 22px; font-size: 22px; font-weight: 600; color: #1F33CC; }
    .wklabel { position: absolute; left: 64px; top: 72px; font-family: "Geist Mono", monospace; font-size: 22px; letter-spacing: .16em; color: #1F33CC; }
    .cur { position: absolute; left: 0; top: 0; width: 52px; height: 52px; filter: drop-shadow(0 4px 8px rgba(11,15,26,.35)); }
    .ring { position: absolute; left: 0; top: 0; width: 70px; height: 70px; margin: -35px 0 0 -35px; border-radius: 50%; border: 3px solid #1F33CC; opacity: 0; }
    /* divider */
    .div { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, #121828 0%, #0B0F1A 70%); }
    .div .row { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 46px; }
    .div .wk { font-size: 118px; font-weight: 600; color: #4C93F0; letter-spacing: -0.02em; }
    .div .wn { position: relative; width: 100px; height: 600px; overflow: hidden;
      -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%); mask-image: linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%); }
    .div .reel { position: absolute; left: 0; top: 0; width: 100%; }
    .div .reel span { display: block; height: 150px; line-height: 150px; font-size: 118px; font-weight: 600; color: rgba(255,255,255,.22); }
    /* title card */
    .tc { position: absolute; inset: 0; background: #F6F7FB; }
    .tc .in { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 30px; }
    .tc .w { font-family: "Instrument Serif", serif; font-size: 150px; line-height: 1; display: inline-block; }
    /* header pill */
    .head { position: absolute; left: 0; right: 0; top: 52px; display: flex; justify-content: center; }
    .head .pill { display: flex; align-items: center; gap: 13px; height: 86px; padding: 0 38px; border-radius: 999px; }
    .head .w { font-family: "Instrument Serif", serif; font-size: 50px; line-height: 1; display: inline-block; }
"""


def words_html(p, kind, words):
    out = []
    for i, (w, acc) in enumerate(words):
        out.append(f'<span class="w{" acc" if acc else ""}" id="{p}-{kind}{i}">{w}</span>')
    return "".join(out)


def week_frame(fid, p, week, words, demo_html, demo_css, demo_js, glass_header=True):
    """Assemble one week frame: divider + title card + demo with header."""
    n = len(words)
    reel = "".join(f'<span id="{p}-n{k}">{k}</span>' if k == week else f"<span>{k}</span>" for k in range(0, 8))
    js_words_tc = "\n".join(
        f'      tl.fromTo("#{p}-t{i}", {{ opacity: 0, filter: "blur(16px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.16, ease: "power2.out" }}, {0.84 + i * 0.09:.2f});'
        for i in range(n))
    js_words_h = []
    for i in range(n):
        raised = i == n - 1
        frm = '{ opacity: 0, filter: "blur(10px)"' + (", y: -14" if raised else "") + " }"
        to = '{ opacity: 1, filter: "blur(0px)"' + (", y: 0" if raised else "") + ', duration: 0.18, ease: "power3.out" }'
        js_words_h.append(f'      tl.fromTo("#{p}-h{i}", {frm}, {to}, {1.86 + i * 0.09:.2f});')
    js_words_h = "\n".join(js_words_h)
    y0 = 300 - 150 * (week - 1) - 75
    y1 = 300 - 150 * week - 75
    return f"""<template>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>{FONTS}{BASE_CSS}{demo_css}
  </style>

  <div id="root" data-composition-id="{fid}" data-width="1920" data-height="1080">
    <div id="{p}-demo" class="clip" data-start="1.8" data-duration="3.2" data-track-index="0">
{demo_html}
      <div class="wklabel">WEEK {week}</div>
      <div class="head"><div class="pill{' glass' if glass_header else ''}" id="{p}-pill">{words_html(p, "h", words)}</div></div>
    </div>

    <div class="tc clip" id="{p}-tc" data-start="0.8" data-duration="1.0" data-track-index="1">
      <div class="in" id="{p}-tcin">{words_html(p, "t", words)}</div>
    </div>

    <div class="div clip" id="{p}-div" data-start="0" data-duration="0.8" data-track-index="2">
      <div class="row" id="{p}-divrow"><div class="wk">Week</div><div class="wn"><div class="reel" id="{p}-reel">{reel}</div></div></div>
    </div>
  </div>

  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
      // A. divider: roll one step in 0.2s, then hold
      tl.fromTo("#{p}-reel", {{ y: {y0} }}, {{ y: {y1}, duration: 0.2, ease: "power4.out" }}, 0.02);
      tl.fromTo("#{p}-n{week}", {{ color: "rgba(255,255,255,0.22)" }}, {{ color: "rgba(255,255,255,1)", duration: 0.14, ease: "power2.out" }}, 0.08);
      tl.fromTo("#{p}-divrow", {{ scale: 1 }}, {{ scale: 1.015, duration: 0.8, ease: "none" }}, 0);
      // B. title card: words blur sharp, slow push
{js_words_tc}
      tl.fromTo("#{p}-tcin", {{ scale: 1 }}, {{ scale: 1.03, duration: 1.0, ease: "none" }}, 0.8);
      // C. demo header builds in place
      tl.fromTo("#{p}-pill", {{ opacity: 0, scale: 0.94 }}, {{ opacity: 1, scale: 1, duration: 0.18, ease: "power2.out" }}, 1.82);
{js_words_h}
{demo_js}
      window.__timelines["{fid}"] = tl;
    }})();
  </script>
</template>
"""


def cursor_js(p, path, click_at):
    """Cursor glides along eased legs; press + ring at click_at. path = [(t, x, y), ...]."""
    js = [f'      tl.fromTo("#{p}-cur", {{ x: {path[0][1]}, y: {path[0][2]}, opacity: 0 }}, {{ opacity: 1, duration: 0.15 }}, {path[0][0]});']
    for (t0, x0, y0), (t1, x1, y1) in zip(path, path[1:]):
        js.append(f'      tl.fromTo("#{p}-cur", {{ x: {x0}, y: {y0} }}, {{ x: {x1}, y: {y1}, duration: {t1 - t0:.2f}, ease: "power2.inOut", immediateRender: false }}, {t0});')
    lx, ly = path[-1][1], path[-1][2]
    js.append(f'      tl.fromTo("#{p}-cur", {{ scale: 1 }}, {{ scale: 0.82, duration: 0.07, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }}, {click_at});')
    js.append(f'      tl.fromTo("#{p}-ring", {{ x: {lx + 11}, y: {ly + 6}, scale: 0.3, opacity: 0.8 }}, {{ scale: 1.6, opacity: 0, duration: 0.4, ease: "power2.out" }}, {click_at});')
    return "\n".join(js)


# ----------------------------------------------------------------- Week 1
def week1():
    p = "w1"
    rows = ["AI assistant", "Coding agent", "Project folder", "Database", "Hosting"]
    rows_html = "".join(
        f'<div class="w1-row" id="w1-r{i}"><span>{r}</span><span class="w1-dot" id="w1-d{i}"></span><span class="tick" id="w1-k{i}">{TICK.format(cls="")}</span></div>'
        for i, r in enumerate(rows))
    html = f"""      <div class="paper"></div><div class="glow"></div>
      <div class="win" id="w1-card">
        <div class="w1-top"><span class="w1-badge">{MARK.format(cls="w1-mk")}</span><div><div class="w1-t">Your AI setup</div><div class="mono w1-s">Week 1</div></div><span class="w1-count mono" id="w1-count">0 of 5 ready</span></div>
        <div class="w1-rows">{rows_html}</div>
      </div>
      <div class="win w1-chip" id="w1-chip"><div class="mono w1-chipk">my-first-skill</div><div class="w1-chipv">Your first skill, saved</div></div>"""
    css = """
    #w1-card { left: 560px; top: 210px; width: 800px; padding: 36px 40px; }
    .w1-top { display: flex; align-items: center; gap: 18px; padding-bottom: 26px; border-bottom: 1.5px solid #E7EAF1; }
    .w1-badge { width: 60px; height: 60px; border-radius: 50%; background: #1F33CC; color: #fff; display: grid; place-items: center; }
    .w1-mk { width: 32px; height: 32px; }
    .w1-t { font-size: 32px; font-weight: 600; } .w1-s { font-size: 18px; color: #8A93A6; margin-top: 2px; }
    .w1-count { margin-left: auto; font-size: 19px; color: #1F33CC; background: #EFF2F8; border-radius: 999px; padding: 8px 18px; }
    .w1-rows { display: grid; gap: 14px; margin-top: 26px; }
    .w1-row { display: flex; align-items: center; gap: 16px; background: #F6F7FB; border-radius: 18px; padding: 18px 24px; font-size: 28px; font-weight: 500; }
    .w1-row span:first-child { flex: 1; }
    .w1-dot { width: 34px; height: 34px; border-radius: 50%; border: 2.5px solid #D8DEEA; }
    .w1-row .tick { position: absolute; right: 24px; }
    .w1-row { position: relative; }
    .w1-chip { left: 1290px; top: 800px; padding: 22px 30px; border-radius: 22px; }
    .w1-chipk { font-size: 24px; color: #1F33CC; } .w1-chipv { font-size: 20px; color: #5B6472; margin-top: 4px; }
    """
    js = [
        '      tl.fromTo("#w1-card", { y: 40, opacity: 0.0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 1.8);',
    ]
    for i in range(5):
        t = 2.25 + i * 0.27
        js.append(f'      tl.fromTo("#w1-k{i}", {{ scale: 0, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.22, ease: "back.out(2.4)" }}, {t:.2f});')
        js.append(f'      tl.fromTo("#w1-r{i}", {{ backgroundColor: "#F6F7FB" }}, {{ backgroundColor: "#EFF2F8", duration: 0.2 }}, {t:.2f});')
    js.append('      const cnt = document.getElementById("w1-count"), c = { n: 0 };')
    js.append('      tl.fromTo(c, { n: 0 }, { n: 5, duration: 1.35, ease: "none", immediateRender: false, onUpdate: () => { cnt.textContent = Math.round(c.n) + " of 5 ready"; } }, 2.25);')
    js.append('      tl.fromTo("#w1-chip", { x: 60, opacity: 0, filter: "blur(8px)" }, { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power3.out" }, 3.85);')
    js.append('      tl.fromTo("#w1-card", { scale: 1 }, { scale: 1.025, duration: 3.2, ease: "none", immediateRender: false }, 1.8);')
    return week_frame("03-week1-ready", p, 1, [("Your", False), ("AI,", False), ("ready", True)], html, css, "\n".join(js))


# ----------------------------------------------------------------- Week 3
def week3():
    p = "w3"
    html = f"""      <div class="paper"></div><div class="glow"></div>
      <div class="win" id="w3-br">
        <div class="bar"><i></i><i></i><i></i><span class="url">localhost · preview</span></div>
        <div class="w3-page">
          <div class="w3-blk" id="w3-b0" style="height:66px;width:62%;background:#0B0F1A;opacity:.9;border-radius:999px"></div>
          <div class="w3-blk" id="w3-b1" style="height:22px;width:82%;background:#E7EAF1;margin-top:28px;border-radius:999px"></div>
          <div class="w3-blk" id="w3-b2" style="height:22px;width:66%;background:#E7EAF1;margin-top:14px;border-radius:999px"></div>
          <div class="w3-blk btn" id="w3-go" style="width:230px;height:70px;font-size:26px;margin-top:36px">Go live</div>
          <div class="w3-cards"><div class="w3-blk w3-ph" id="w3-c0"></div><div class="w3-blk w3-ph" id="w3-c1"></div><div class="w3-blk w3-ph" id="w3-c2"></div></div>
        </div>
      </div>
      <div id="w3-reveal">
        <div class="win" id="w3-live">
          <div class="bar"><i></i><i></i><i></i><span class="url" style="color:#0B0F1A">yourproject.com</span></div>
          <div class="w3-site">
            <div class="mono" style="font-size:20px;color:#1F33CC;letter-spacing:.14em">AMAKA'S BAKES</div>
            <div class="serif" style="font-size:96px;line-height:1.02;margin-top:14px">Cakes that arrive <span class="acc">on time</span></div>
            <div style="font-size:28px;color:#5B6472;margin-top:20px">Order before 2pm. At your door by evening.</div>
            <div class="btn" style="width:250px;height:72px;font-size:26px;margin-top:34px">Order a cake</div>
          </div>
        </div>
        <div class="glass gpill" id="w3-toast" style="position:absolute;right:250px;top:820px;font-size:28px;padding:16px 30px"><span class="tick">{TICK.format(cls="")}</span>Live</div>
      </div>
      {CURSOR.format(p=p)}"""
    css = """
    #w3-br { left: 300px; right: 300px; top: 190px; bottom: -40px; }
    .w3-page { padding: 64px 80px; }
    .w3-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 48px; }
    .w3-ph { height: 220px; border-radius: 20px; background: repeating-linear-gradient(135deg,#F6F7FB 0 22px,#fff 22px 44px); border: 2px dashed #D8DEEA; }
    #w3-reveal { position: absolute; inset: 0; background: radial-gradient(circle at 30% 20%, #4C93F0 0%, #2A46F0 35%, #1F33CC 65%, #182AB0 100%); clip-path: circle(0px at 495px 533px); }
    #w3-live { left: 300px; right: 300px; top: 190px; bottom: -40px; }
    .w3-site { padding: 90px 90px; }
    """
    js = ['      tl.fromTo("#w3-br", { y: 40 }, { y: 0, duration: 0.45, ease: "power3.out" }, 1.8);']
    for i, b in enumerate(["#w3-b0", "#w3-b1", "#w3-b2", "#w3-go", "#w3-c0", "#w3-c1", "#w3-c2"]):
        js.append(f'      tl.fromTo("{b}", {{ opacity: 0, y: 18 }}, {{ opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }}, {2.0 + i * 0.12:.2f});')
    js.append(cursor_js(p, [(2.6, 1500, 900), (3.25, 484, 527)], 3.32))
    js.append('      tl.fromTo("#w3-go", { scale: 1 }, { scale: 0.94, duration: 0.07, yoyo: true, repeat: 1, immediateRender: false }, 3.32);')
    # circle reveal: appears within 2 frames, covers the frame in ~11 frames
    js.append('      tl.fromTo("#w3-reveal", { clipPath: "circle(0px at 495px 533px)" }, { clipPath: "circle(2300px at 495px 533px)", duration: 0.37, ease: "power2.inOut" }, 3.45);')
    js.append('      tl.fromTo("#w3-live", { y: 30, scale: 0.97 }, { y: 0, scale: 1, duration: 0.6, ease: "power3.out" }, 3.6);')
    js.append('      tl.fromTo("#w3-toast", { opacity: 0, y: 24, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.8)" }, 4.15);')
    js.append('      tl.fromTo("#w3-cur", { opacity: 1 }, { opacity: 0, duration: 0.1, immediateRender: false }, 3.5);')
    return week_frame("05-week3-live", p, 3, [("Your", False), ("website,", False), ("live", True)], html, css, "\n".join(js))


# ----------------------------------------------------------------- Week 4
def week4():
    p = "w4"
    scenes = [("#2A46F0", "#0B0F1A", "Forgot the cake?"), ("#1F33CC", "#182AB0", "Order in two taps"),
              ("#3B6FF0", "#1F33CC", "Baked this morning"), ("#4C93F0", "#1F33CC", "Order before 2pm")]
    prev = "".join(
        f'<div class="w4-scene" id="w4-s{i}" style="background:linear-gradient(160deg,{a},{b})"><div class="serif w4-cap">{t}</div></div>'
        for i, (a, b, t) in enumerate(scenes))
    clips = "".join(f'<div class="w4-clip" id="w4-k{i}" style="background:{c}"></div>' for i, c in enumerate(["#1F33CC", "#3B6FF0", "#2A46F0", "#4C93F0"]))
    bars = "".join(f'<i style="height:{12 + (k * 37) % 40}px"></i>' for k in range(70))
    html = f"""      <div class="paper"></div><div class="glow"></div>
      <div class="win" id="w4-ed">
        <div class="bar"><i></i><i></i><i></i><span class="url">launch-video</span></div>
        <div class="w4-prev">{prev}</div>
        <div class="w4-tl">
          <div class="w4-track">{clips}</div>
          <div class="w4-wave" id="w4-wave">{bars}</div>
          <div class="w4-head" id="w4-ph"></div>
        </div>
      </div>
      <div class="glass gpill" id="w4-stat" style="position:absolute;right:290px;top:150px"><span id="w4-st">Rendering 0%</span></div>"""
    css = """
    #w4-ed { left: 330px; right: 330px; top: 180px; bottom: 100px; }
    .w4-prev { position: relative; margin: 28px auto 0; width: 900px; height: 420px; border-radius: 18px; overflow: hidden; background: #0B0F1A; }
    .w4-scene { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; }
    .w4-cap { color: #fff; font-size: 64px; }
    .w4-tl { position: relative; margin: 30px 46px 0; height: 150px; }
    .w4-track { display: flex; gap: 8px; height: 66px; }
    .w4-clip { flex: 1; border-radius: 12px; }
    .w4-wave { display: flex; align-items: flex-end; gap: 6px; height: 56px; margin-top: 14px; overflow: hidden; }
    .w4-wave i { flex: 1; background: #A9C4F7; border-radius: 3px; display: block; }
    .w4-head { position: absolute; left: 0; top: -12px; width: 4px; height: 162px; background: #0B0F1A; border-radius: 9px; }
    """
    js = ['      tl.fromTo("#w4-ed", { y: 40 }, { y: 0, duration: 0.45, ease: "power3.out" }, 1.8);']
    for i in range(4):
        js.append(f'      tl.fromTo("#w4-k{i}", {{ y: -90, opacity: 0 }}, {{ y: 0, opacity: 1, duration: 0.24, ease: "back.out(1.6)" }}, {2.0 + i * 0.16:.2f});')
    js.append('      tl.fromTo("#w4-wave", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "power2.out" }, 2.6);')
    js.append('      tl.fromTo("#w4-ph", { x: 0 }, { x: 1180, duration: 1.75, ease: "none" }, 2.85);')
    for i in range(4):
        js.append(f'      tl.fromTo("#w4-s{i}", {{ opacity: 0, scale: 1.06 }}, {{ opacity: 1, scale: 1, duration: 0.12 }}, {2.85 + i * 0.44:.2f});')
    js.append('      const st = document.getElementById("w4-st"), r = { n: 0 };')
    js.append('      tl.fromTo(r, { n: 0 }, { n: 100, duration: 1.6, ease: "power1.inOut", immediateRender: false, onUpdate: () => { st.textContent = r.n >= 99.5 ? "Ready" : "Rendering " + Math.round(r.n) + "%"; } }, 2.95);')
    js.append('      tl.fromTo("#w4-stat", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }, 2.9);')
    return week_frame("06-week4-videos", p, 4, [("Pro", False), ("AI", True), ("videos", True)], html, css, "\n".join(js))


# ----------------------------------------------------------------- Week 5
def week5():
    p = "w5"

    def flow(sfx, a, b, c, title):
        return f"""<div class="w5-flow" id="w5-{sfx}">
          <div class="w5-hd"><span class="w5-ti">{title}</span></div>
          <div class="w5-row">
            <div class="w5-node" id="w5-{sfx}0"><div class="mono w5-k">WHEN</div><div class="w5-v">{a}</div></div>
            <div class="w5-wire"><i id="w5-{sfx}p0"></i></div>
            <div class="w5-node w5-ai" id="w5-{sfx}1">{MARK.format(cls="w5-mk")}<div class="w5-v">{b}</div><div class="w5-sub">AI step</div></div>
            <div class="w5-wire"><i id="w5-{sfx}p1"></i></div>
            <div class="w5-node" id="w5-{sfx}2"><div class="mono w5-k">THEN</div><div class="w5-v">{c}</div><span class="tick w5-ok" id="w5-{sfx}ok">{TICK.format(cls="")}</span></div>
          </div>
        </div>"""
    html = f"""      <div class="paper"></div><div class="glow"></div>
      <div class="win" id="w5-card">
        <span class="glass gpill" id="w5-act" style="position:absolute;right:36px;top:30px;font-size:20px">● Active</span>
        {flow("a", "New enquiry", "Reply drafted", "Email sent", "Reply to enquiries")}
        {flow("b", "New order", "Thank-you written", "Added to sheet", "Thank every customer")}
      </div>"""
    css = """
    #w5-card { left: 290px; right: 290px; top: 300px; height: 430px; }
    #w5-b { opacity: 0; }
    .w5-flow { position: absolute; inset: 0; padding: 40px 50px; }
    .w5-ti { font-size: 32px; font-weight: 600; }
    .w5-row { display: flex; align-items: center; gap: 0; margin-top: 70px; }
    .w5-node { position: relative; flex: 1; border: 1.5px solid #E7EAF1; background: #fff; border-radius: 22px; padding: 30px 30px; min-height: 190px;
      box-shadow: 0 1px 2px rgba(11,15,26,.05), 0 20px 40px -24px rgba(11,15,26,.25); }
    .w5-ai { background: #1F33CC; color: #fff; border-color: #1F33CC; }
    .w5-mk { width: 40px; height: 40px; color: #fff; }
    .w5-k { font-size: 18px; color: #8A93A6; letter-spacing: .12em; }
    .w5-v { font-size: 32px; font-weight: 600; margin-top: 8px; }
    .w5-sub { font-size: 20px; opacity: .8; margin-top: 2px; }
    .w5-wire { position: relative; width: 70px; height: 3px; background: #D8DEEA; }
    .w5-wire i { position: absolute; left: 0; top: -6px; width: 15px; height: 15px; border-radius: 50%; background: #1F33CC; opacity: 0; }
    .w5-ok { position: absolute; right: 22px; top: 22px; }
    """
    js = ['      tl.fromTo("#w5-card", { y: 40 }, { y: 0, duration: 0.45, ease: "power3.out" }, 1.8);',
]

    def run(sfx, t):
        j = []
        j.append(f'      tl.fromTo("#w5-{sfx}0", {{ borderColor: "#E7EAF1" }}, {{ borderColor: "#1F33CC", duration: 0.15, immediateRender: false }}, {t:.2f});')
        j.append(f'      tl.fromTo("#w5-{sfx}p0", {{ x: 0, opacity: 1 }}, {{ x: 55, opacity: 1, duration: 0.3, ease: "power1.inOut", immediateRender: false }}, {t + 0.12:.2f});')
        j.append(f'      tl.fromTo("#w5-{sfx}1", {{ scale: 1 }}, {{ scale: 1.05, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }}, {t + 0.42:.2f});')
        j.append(f'      tl.fromTo("#w5-{sfx}p1", {{ x: 0, opacity: 1 }}, {{ x: 55, opacity: 1, duration: 0.3, ease: "power1.inOut", immediateRender: false }}, {t + 0.62:.2f});')
        j.append(f'      tl.fromTo("#w5-{sfx}ok", {{ scale: 0, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.22, ease: "back.out(2.4)" }}, {t + 0.92:.2f});')
        return j
    js += run("a", 2.25)
    # cards swap in place (reference automations beat)
    js.append('      tl.fromTo("#w5-a", { opacity: 1, filter: "blur(0px)" }, { opacity: 0, filter: "blur(10px)", duration: 0.22, immediateRender: false }, 3.55);')
    js.append('      tl.fromTo("#w5-b", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.25, immediateRender: false }, 3.62);')
    js += run("b", 3.85)
    js.append('      tl.fromTo("#w5-act", { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, 3.2);')
    return week_frame("07-week5-autopilot", p, 5, [("Work", False), ("on", False), ("autopilot", True)], html, css, "\n".join(js))


# ----------------------------------------------------------------- Week 6
def week6():
    p = "w6"
    html = f"""      <div class="paper"></div>
      <div class="w6-blob" style="left:40px;top:180px;background:radial-gradient(closest-side,rgba(42,70,240,.42),rgba(42,70,240,0))"></div>
      <div class="w6-blob" style="left:1240px;top:140px;background:radial-gradient(closest-side,rgba(76,147,240,.45),rgba(76,147,240,0))"></div>
      <div class="glass w6-card" id="w6-l"><div class="mono w6-k">CAREER</div><div class="w6-t">You're hired</div><div class="w6-s">"We'd love you to start on Monday."</div><span class="gpill w6-p" id="w6-lp" style="background:#1F33CC;color:#fff">{TICK.format(cls="w6-tk")}Offer received</span></div>
      <div class="glass w6-card" id="w6-r"><div class="mono w6-k">BUSINESS</div><div class="w6-t">First client</div><div class="w6-s">Website build, paid in full</div><span class="gpill w6-p" id="w6-rp" style="background:#1F33CC;color:#fff">{TICK.format(cls="w6-tk")}Payment in</span></div>
      <div class="win" id="w6-cert">
        <div class="w6-brand">{MARK.format(cls="w6-mk")}LearnHub</div>
        <div class="w6-coc">CERTIFICATE OF COMPLETION</div>
        <div class="serif w6-name">Your name</div>
        <div class="w6-for">has completed all of the work for</div>
        <div class="serif w6-prog">AI Bootcamp</div>
        <div class="w6-foot"><span class="serif w6-sig">Signature</span><span class="w6-seal">{MARK.format(cls="w6-smk")}</span><span class="w6-qr"></span></div>
      </div>
      <span class="glass gpill" id="w6-c0" style="position:absolute;left:640px;top:880px">{TICK.format(cls="w6-tk")}Approved</span>
      <span class="glass gpill" id="w6-c1" style="position:absolute;left:870px;top:892px">Demo day</span>
      <span class="glass gpill" id="w6-c2" style="position:absolute;left:1080px;top:880px">{TICK.format(cls="w6-tk")}Verified</span>"""
    css = """
    .w6-blob { position: absolute; width: 640px; height: 640px; border-radius: 50%; }
    .w6-card { position: absolute; top: 290px; width: 470px; padding: 34px 36px; border-radius: 30px; }
    #w6-l { left: 120px; } #w6-r { right: 120px; }
    .w6-k { font-size: 19px; color: #1F33CC; letter-spacing: .14em; } .w6-t { font-size: 40px; font-weight: 600; margin-top: 8px; }
    .w6-s { font-size: 24px; color: #5B6472; margin-top: 10px; line-height: 1.45; } .w6-p { margin-top: 22px; }
    .w6-tk { width: 22px; height: 22px; }
    #w6-cert { left: 640px; top: 330px; width: 640px; height: 452px; padding: 34px 40px; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .w6-brand { display: flex; align-items: center; gap: 10px; font-family: "Switzer", sans-serif; font-weight: 600; font-size: 26px; }
    .w6-mk { width: 30px; height: 30px; color: #1F33CC; }
    .w6-coc { border: 1.5px solid #0B0F1A; border-radius: 999px; padding: 5px 18px; font-size: 13px; letter-spacing: .2em; margin-top: 16px; }
    .w6-name { font-size: 64px; line-height: 1; margin-top: 22px; } .w6-for { font-size: 18px; color: #5B6472; margin-top: 14px; }
    .w6-prog { font-size: 44px; color: #1F33CC; }
    .w6-foot { margin-top: auto; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; }
    .w6-sig { font-style: italic; font-size: 24px; border-bottom: 1.5px solid #0B0F1A; padding: 0 10px; }
    .w6-seal { width: 66px; height: 66px; border-radius: 50%; background: radial-gradient(circle at 30% 25%,#4C93F0,#1F33CC 55%,#182AB0); display: grid; place-items: center; }
    .w6-smk { width: 32px; height: 32px; color: #fff; }
    .w6-qr { width: 66px; height: 66px; background: repeating-conic-gradient(#0B0F1A 0 25%,#fff 0 50%) 0 0/16px 16px; }
    """
    js = ['      tl.fromTo("#w6-l", { x: -60, opacity: 0, rotation: 0 }, { x: 0, opacity: 1, rotation: -3, duration: 0.45, ease: "power3.out" }, 1.85);',
          '      tl.fromTo("#w6-r", { x: 60, opacity: 0, rotation: 0 }, { x: 0, opacity: 1, rotation: 3, duration: 0.45, ease: "power3.out" }, 2.1);',
          '      tl.fromTo("#w6-lp", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" }, 2.5);',
          '      tl.fromTo("#w6-rp", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" }, 2.75);',
          '      tl.fromTo("#w6-cert", { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 3.0);']
    for i in range(3):
        js.append(f'      tl.fromTo("#w6-c{i}", {{ y: 20, opacity: 0, scale: 0.9 }}, {{ y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.8)" }}, {3.75 + i * 0.16:.2f});')
    return week_frame("08-week6-career", p, 6, [("Build", False), ("a", False), ("career", True), ("or", False), ("a", False), ("business", True)], html, css, "\n".join(js))


if __name__ == "__main__":
    for fn in (week1, week3, week4, week5, week6):
        html = fn()
        fid = html.split('data-composition-id="')[1].split('"')[0]
        (OUT / f"{fid}.html").write_text(html)
        print("wrote", fid)
