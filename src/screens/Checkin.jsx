"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";

const Checkin = ({ data, clock, setClock }) => {
  const holdRef = useRef(null);
  const rafRef = useRef(null);

  // Live ticking timer
  useEffect(() => {
    if (!clock.in || clock.out) return;
    const interval = setInterval(() => {
      setClock((c) => ({ ...c, elapsed: (Date.now() - c.in) / 1000 - c.breakTotal }));
    }, 1000);
    return () => clearInterval(interval);
  }, [clock.in, clock.out, clock.onBreak]);

  // Hold animation
  useEffect(() => {
    const el = holdRef.current;
    if (!el) return;

    const HOLD_MS = 800;
    let holding = false;
    let startTime = 0;

    const tick = () => {
      const dt = Date.now() - startTime;
      const p = Math.min(1, dt / HOLD_MS);
      el.style.setProperty("--p", p);
      if (p >= 1) { finish(); return; }
      rafRef.current = requestAnimationFrame(tick);
    };

    const finish = () => {
      holding = false;
      cancelAnimationFrame(rafRef.current);
      el.style.setProperty("--p", 0);
      if (!clock.in) {
        setClock({ in: Date.now() - 5.47 * 3600 * 1000, out: null, elapsed: 5.47 * 3600, breakTotal: 0, onBreak: false, breakStart: null, breaks: [] });
      } else if (!clock.out) {
        setClock((c) => ({ ...c, out: Date.now() }));
      } else {
        setClock({ in: Date.now(), out: null, elapsed: 0, breakTotal: 0, onBreak: false, breakStart: null, breaks: [] });
      }
    };

    const start = (e) => {
      e.preventDefault();
      if (holding) return;
      holding = true;
      startTime = Date.now();
      tick();
    };
    const cancel = () => {
      if (!holding) return;
      holding = false;
      cancelAnimationFrame(rafRef.current);
      const cur = parseFloat(el.style.getPropertyValue("--p") || 0);
      gsap.to(el, { duration: 0.3, ease: "power2.out", onUpdate: function() {
        el.style.setProperty("--p", cur * (1 - this.progress()));
      }});
    };

    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start, { passive: false });
    window.addEventListener("mouseup", cancel);
    window.addEventListener("touchend", cancel);
    el.addEventListener("mouseleave", cancel);

    return () => {
      el.removeEventListener("mousedown", start);
      el.removeEventListener("touchstart", start);
      window.removeEventListener("mouseup", cancel);
      window.removeEventListener("touchend", cancel);
      el.removeEventListener("mouseleave", cancel);
      cancelAnimationFrame(rafRef.current);
    };
  }, [clock.in, clock.out]);

  const total = clock.elapsed || 0;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const pad = (n) => String(n).padStart(2, "0");

  const TARGET = 9;
  const pctOfDay = Math.min(100, (total / 3600 / TARGET) * 100);

  const log = [
    { t: "09:04", e: "Clocked in",    place: "Office · NYC",     kind: "in" },
    { t: "11:42", e: "Break started", place: "Coffee · 12 min",  kind: "break" },
    { t: "11:54", e: "Resumed",       place: "—",                kind: "in" },
    { t: "13:15", e: "Lunch",         place: "Lunch · 38 min",   kind: "break" },
    { t: "13:53", e: "Resumed",       place: "—",                kind: "in" },
  ];

  const status = !clock.in ? "out" : clock.out ? "done" : clock.onBreak ? "break" : "in";
  const statusLabel = { out: "Tap to start", in: "Clocked in", break: "On break", done: "Day complete" }[status];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <div className="t-eyebrow">CHECK-IN / OUT · TUE MAY 26</div>
        <span className={"pill " + (status === "in" ? "good" : status === "break" ? "warn" : status === "done" ? "info" : "")}>
          <span className="dot"></span>{statusLabel.toUpperCase()}
        </span>
      </div>
      <h1 className="t-display page-title">Your day, by the second.</h1>
      <div className="page-sub" style={{ maxWidth: 580, marginBottom: 28 }}>
        Hold the bar below to clock in or out. Breaks pause the timer automatically. Everything is logged with your device, IP and approximate location.
      </div>

      <div className="clock-hero" style={{ marginBottom: 28 }}>
        {/* LEFT: big timer */}
        <div className="brut-card brut-card--hard" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="t-eyebrow">Worked today</div>
              <div className="clock-num" style={{ marginTop: 10 }}>
                {pad(h)}:{pad(m)}<span className="ms">:{pad(s)}</span>
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap" }}>
                <div>
                  <div className="t-eyebrow tiny">Clocked in</div>
                  <div className="t-display" style={{ fontSize: 18, marginTop: 2 }}>09:04</div>
                </div>
                <div>
                  <div className="t-eyebrow tiny">Est. clock-out</div>
                  <div className="t-display" style={{ fontSize: 18, marginTop: 2, color: "var(--accent)" }}>18:34</div>
                </div>
                <div>
                  <div className="t-eyebrow tiny">Breaks</div>
                  <div className="t-display" style={{ fontSize: 18, marginTop: 2 }}>50m</div>
                </div>
              </div>
            </div>
            <span className="pill live">LIVE</span>
          </div>

          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span className="t-mono tiny" style={{ color: "var(--text-dim)" }}>0h</span>
              <span className="t-mono tiny" style={{ color: "var(--text-dim)" }}>
                <b style={{ color: "var(--accent)" }}>{pctOfDay.toFixed(0)}%</b> · target 9h
              </span>
              <span className="t-mono tiny" style={{ color: "var(--text-dim)" }}>9h</span>
            </div>
            <div className="bar" style={{ height: 14 }}>
              <i style={{ width: pctOfDay + "%" }} />
            </div>
            <div className="t-mono tiny" style={{ marginTop: 8, color: "var(--text-mute)" }}>
              ON TRACK · {Math.max(0, TARGET - total / 3600).toFixed(2)}H REMAINING
            </div>
          </div>

          {/* HOLD button */}
          <div ref={holdRef} className="hold-btn" style={{ marginTop: 24 }} title="Hold to confirm">
            <div className="fill"></div>
            <div className="label">
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon name={status === "out" ? "play" : "stop"} size={20} />
                {status === "out" && "Hold to clock in"}
                {status === "in" && "Hold to clock out"}
                {status === "break" && "Hold to resume"}
                {status === "done" && "Hold to start new day"}
              </span>
              <span className="t-mono" style={{ fontSize: 11, opacity: 0.7 }}>HOLD 0.8s</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="brut-btn brut-btn--ghost" style={{ flex: 1, justifyContent: "center" }}
              onClick={() => setClock((c) => ({ ...c, onBreak: !c.onBreak }))}>
              <Icon name="coffee" size={13} />
              {clock.onBreak ? "End break" : "Start break"}
            </button>
            <button className="brut-btn brut-btn--ghost" style={{ flex: 1, justifyContent: "center" }}>
              <Icon name="globe" size={13} />
              Switch to remote
            </button>
          </div>
        </div>

        {/* RIGHT: progress ring + day log */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="brut-card" style={{ padding: 26, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="t-eyebrow" style={{ alignSelf: "flex-start", marginBottom: 12 }}>This week · 38h 14m / 45h</div>
            <div className="ring" style={{ "--p": 85, "--size": "180px" }}>
              <div>
                <div className="t-num" style={{ fontSize: 38 }}>85<span style={{ fontSize: 16, color: "var(--text-mute)" }}>%</span></div>
                <div className="t-mono tiny" style={{ color: "var(--text-dim)" }}>WEEK 22</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 18, alignSelf: "stretch", justifyContent: "space-around" }}>
              <div style={{ textAlign: "center" }}>
                <div className="t-num" style={{ fontSize: 18 }}>4</div>
                <div className="t-mono tiny muted">DAYS</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="t-num" style={{ fontSize: 18 }}>+1.4h</div>
                <div className="t-mono tiny muted">OVERTIME</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="t-num" style={{ fontSize: 18 }}>00:42</div>
                <div className="t-mono tiny muted">AVG BREAK</div>
              </div>
            </div>
          </div>

          <div className="brut-card" style={{ padding: 20, flex: 1 }}>
            <div className="t-eyebrow" style={{ marginBottom: 12 }}>Today&apos;s log</div>
            <div style={{ position: "relative", paddingLeft: 18 }}>
              <div style={{ position: "absolute", left: 4, top: 4, bottom: 4, width: 2, background: "var(--border)" }}></div>
              {log.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "6px 0", position: "relative" }}>
                  <div style={{
                    position: "absolute", left: -18, top: 10, width: 10, height: 10,
                    background: l.kind === "in" ? "var(--accent)" : "var(--warn)",
                    border: "2px solid var(--bg)",
                    borderRadius: 2,
                  }}></div>
                  <div className="t-mono" style={{ fontSize: 11, color: "var(--text-mute)", width: 44 }}>{l.t}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 500 }}>{l.e}</div>
                    <div className="muted tiny">{l.place}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, padding: "6px 0", position: "relative", opacity: 0.5 }}>
                <div style={{ position: "absolute", left: -18, top: 10, width: 10, height: 10, background: "var(--text-mute)", border: "2px solid var(--bg)", borderRadius: 2 }}></div>
                <div className="t-mono" style={{ fontSize: 11, color: "var(--text-mute)", width: 44 }}>—:—</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 500 }}>Clock-out pending</div>
                  <div className="muted tiny">Est. 18:34</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Week recap */}
      <div className="brut-card" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <div>
            <div className="t-eyebrow">Past 14 days</div>
            <div className="t-display" style={{ fontSize: 22, marginTop: 4 }}>Hours per workday</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span className="pill"><span className="dot" style={{ background: "var(--accent)" }}></span>Office</span>
            <span className="pill"><span className="dot" style={{ background: "var(--info)" }}></span>Remote</span>
            <span className="pill"><span className="dot" style={{ background: "var(--warn)" }}></span>Leave</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 5, alignItems: "end", height: 140 }}>
          {[
            { d: "12", h: 9.4, k: "in" }, { d: "13", h: 8.0, k: "wfh" }, { d: "14", h: 0, k: "absent" }, { d: "15", h: 7.9, k: "in" },
            { d: "16", h: 0, k: "off" }, { d: "17", h: 0, k: "off" }, { d: "18", h: 8.7, k: "in" }, { d: "19", h: 9.1, k: "in" },
            { d: "20", h: 8.3, k: "in" }, { d: "21", h: 7.5, k: "wfh" }, { d: "22", h: 8.8, k: "in" }, { d: "23", h: 0, k: "off" },
            { d: "24", h: 0, k: "off" }, { d: "25", h: 9.0, k: "in" },
          ].map((b, i) => {
            const maxH = (b.h / 10) * 140;
            const color = b.k === "in" ? "var(--accent)" : b.k === "wfh" ? "var(--info)" : b.k === "absent" ? "var(--bad)" : "var(--bg-elev-2)";
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                  <div style={{ width: "100%", height: Math.max(b.h ? 10 : 4, maxH), background: color, border: "1.5px solid var(--border-strong)" }}></div>
                </div>
                <div className="t-mono" style={{ fontSize: 9.5, color: "var(--text-mute)" }}>{b.d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Checkin;
