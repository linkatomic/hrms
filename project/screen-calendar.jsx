// Calendar — attendance grid with color dots
const { useState: useState_cal, useEffect: useEffect_cal, useMemo: useMemo_cal } = React;

const Calendar = ({ data }) => {
  const [month, setMonth] = useState_cal(4); // May (0-indexed) → 4
  const year = 2026;

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Build cells: 42 (6 weeks)
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevMonthDays - firstDay + 1 + i, other: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const att = data.attendance[ds];
    cells.push({ day: d, ds, ...att });
  }
  while (cells.length < 42) cells.push({ day: cells.length - daysInMonth - firstDay + 1, other: true });

  const today = 26;
  const [sel, setSel] = useState_cal(today);

  useEffect_cal(() => {
    if (!window.gsap) return;
    gsap.from(".cal-cell", { y: 8, opacity: 0, duration: 0.35, stagger: 0.008, ease: "power2.out" });
  }, [month]);

  // selected day details
  const selDs = `${year}-${String(month+1).padStart(2,"0")}-${String(sel).padStart(2,"0")}`;
  const selData = data.attendance[selDs];

  // Stats
  const monthCells = cells.filter(c => !c.other);
  const presentCount = monthCells.filter(c => c.status === "present" || c.status === "wfh").length;
  const totalHours = monthCells.reduce((s,c) => s + (c.hrs || 0), 0);

  return (
    <div data-screen-label="03 Calendar">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <div className="t-eyebrow">ATTENDANCE CALENDAR · {year}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="brut-btn brut-btn--ghost" onClick={() => setMonth((m) => Math.max(0, m - 1))}><Icon name="arrow-l" size={12} /></button>
          <button className="brut-btn brut-btn--ghost" style={{ minWidth: 140, justifyContent: "center" }}>
            {monthNames[month]} {year}
          </button>
          <button className="brut-btn brut-btn--ghost" onClick={() => setMonth((m) => Math.min(11, m + 1))}><Icon name="arrow-r" size={12} /></button>
        </div>
      </div>
      <h1 className="t-display page-title">{monthNames[month]}.</h1>
      <div className="page-sub" style={{ marginBottom: 24, maxWidth: 580 }}>
        Subtle color dot per day shows your attendance state. Click any cell to inspect the entry, breaks and notes.
      </div>

      {/* Stat strip */}
      <div className="grid stat-grid" style={{ marginBottom: 22 }}>
        <div className="stat">
          <div className="t-eyebrow">Present + Remote</div>
          <div className="t-num num">{presentCount}<span style={{ fontSize: 18, color: "var(--text-mute)" }}>d</span></div>
        </div>
        <div className="stat">
          <div className="t-eyebrow">Total hours</div>
          <div className="t-num num">{totalHours.toFixed(1)}<span style={{ fontSize: 18, color: "var(--text-mute)" }}>h</span></div>
        </div>
        <div className="stat">
          <div className="t-eyebrow">On leave</div>
          <div className="t-num num">{monthCells.filter(c => c.status === "leave").length}<span style={{ fontSize: 18, color: "var(--text-mute)" }}>d</span></div>
        </div>
        <div className="stat">
          <div className="t-eyebrow">Absent</div>
          <div className="t-num num">{monthCells.filter(c => c.status === "absent").length}<span style={{ fontSize: 18, color: "var(--text-mute)" }}>d</span></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 22 }}>
        {/* Calendar */}
        <div className="brut-card brut-card--hard" style={{ padding: 18 }}>
          <div className="cal-grid">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} className="cal-head">{d}</div>
            ))}
          </div>
          <div className="cal-grid" style={{ marginTop: 4 }}>
            {cells.map((c, i) => {
              const isToday = !c.other && c.day === today && month === 4;
              const isSel = !c.other && c.day === sel;
              const dotClass = c.status === "present" ? "present" :
                              c.status === "wfh" ? "wfh" :
                              c.status === "leave" ? "leave" :
                              c.status === "absent" ? "absent" :
                              c.status === "weekend" ? "weekend" : null;
              return (
                <div
                  key={i}
                  className={"cal-cell " + (c.other ? "is-other " : "") + (isToday ? "is-today " : "")}
                  onClick={() => !c.other && setSel(c.day)}
                  style={isSel && !isToday ? { borderColor: "var(--text)", borderWidth: 2 } : {}}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="day-n">{c.day}</span>
                    {dotClass && <span className={"dot " + dotClass}></span>}
                  </div>
                  {c.hrs && <div className="hrs">{c.hrs.toFixed(1)}h</div>}
                  {!c.hrs && c.status === "leave" && <div className="hrs" style={{ color: "var(--warn)" }}>LEAVE</div>}
                  {!c.hrs && c.status === "absent" && <div className="hrs" style={{ color: "var(--bad)" }}>ABSENT</div>}
                  {isToday && <div className="hrs" style={{ color: "var(--accent)" }}>TODAY</div>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 14, marginTop: 18, paddingTop: 14, borderTop: "1.5px solid var(--border)", flexWrap: "wrap" }}>
            <span className="pill"><span className="dot" style={{ background: "var(--good)" }}></span>Present</span>
            <span className="pill"><span className="dot" style={{ background: "var(--info)" }}></span>Remote</span>
            <span className="pill"><span className="dot" style={{ background: "var(--warn)" }}></span>Leave</span>
            <span className="pill"><span className="dot" style={{ background: "var(--bad)" }}></span>Absent</span>
            <span className="pill"><span className="dot" style={{ background: "var(--text-mute)" }}></span>Weekend</span>
          </div>
        </div>

        {/* Day detail */}
        <div className="brut-card" style={{ padding: 22 }}>
          <div className="t-eyebrow">Selected · {monthNames[month]} {sel}</div>
          <div className="t-display" style={{ fontSize: 36, marginTop: 8, letterSpacing: "-0.02em" }}>
            {selData?.status === "present" && "Worked in office"}
            {selData?.status === "wfh" && "Worked remotely"}
            {selData?.status === "leave" && "On approved leave"}
            {selData?.status === "absent" && "Marked absent"}
            {selData?.status === "weekend" && "Weekend"}
            {!selData && "—"}
          </div>

          {selData && (selData.status === "present" || selData.status === "wfh") && (
            <>
              <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div className="t-eyebrow tiny">Hours</div>
                  <div className="t-num" style={{ fontSize: 28 }}>{(selData.hrs || 0).toFixed(2)}</div>
                </div>
                <div>
                  <div className="t-eyebrow tiny">Status</div>
                  <div style={{ marginTop: 4 }}><span className={"pill " + (selData.status === "wfh" ? "info" : "good")}><span className="dot"></span>{selData.status === "wfh" ? "Remote" : "Office"}</span></div>
                </div>
                <div>
                  <div className="t-eyebrow tiny">Clock in</div>
                  <div className="t-display" style={{ fontSize: 16, marginTop: 4 }}>09:0{sel % 9}</div>
                </div>
                <div>
                  <div className="t-eyebrow tiny">Clock out</div>
                  <div className="t-display" style={{ fontSize: 16, marginTop: 4 }}>{selData.hrs ? "18:1" + (sel%9) : "—"}</div>
                </div>
                <div>
                  <div className="t-eyebrow tiny">Breaks</div>
                  <div className="t-display" style={{ fontSize: 16, marginTop: 4 }}>48 min</div>
                </div>
                <div>
                  <div className="t-eyebrow tiny">Location</div>
                  <div className="t-display" style={{ fontSize: 16, marginTop: 4 }}>{selData.status === "wfh" ? "Brooklyn" : "Office · NYC"}</div>
                </div>
              </div>

              <div className="rule">notes</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {selData.status === "wfh"
                  ? "Worked remotely. Logged hours from home Wi-Fi (10.0.0.42). Two scheduled focus blocks."
                  : "Standard office day. Two scheduled focus blocks, one client crit."}
              </div>
            </>
          )}

          {selData?.status === "leave" && (
            <>
              <div style={{ marginTop: 18 }}>
                <span className="pill warn"><span className="dot"></span>APPROVED · PTO</span>
              </div>
              <div className="rule">request</div>
              <div className="muted" style={{ fontSize: 13 }}>LV-0116 · approved by Priya Iyer on May 03. Reason: Personal.</div>
            </>
          )}

          {selData?.status === "absent" && (
            <>
              <div style={{ marginTop: 18 }}>
                <span className="pill bad"><span className="dot"></span>UNRECONCILED</span>
              </div>
              <div className="rule">action</div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>No clock-in detected for this day. Request retroactive correction or convert to sick leave.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="brut-btn brut-btn--primary" style={{ flex: 1, justifyContent: "center" }}>Convert to sick leave</button>
                <button className="brut-btn brut-btn--ghost">Request correction</button>
              </div>
            </>
          )}

          {selData?.status === "weekend" && (
            <div className="muted" style={{ marginTop: 16, fontSize: 13 }}>
              Non-working day. You logged in for 0.4h on Slack between 19:00–19:30 — not counted toward hours.
            </div>
          )}
        </div>
      </div>

      {/* Year strip */}
      <div className="sec-head">
        <h2>Year overview</h2>
        <span className="meta">Each square is one day · hover for hours</span>
      </div>
      <YearHeatmap />
    </div>
  );
};

const YearHeatmap = () => {
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  // Generate semi-random year data
  const rng = (seed) => {
    let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280;
  };
  const r = rng(42);

  const today = new Date(2026, 4, 26);

  return (
    <div className="brut-card" style={{ padding: 22, overflow: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "auto repeat(53, 1fr)", gap: 3, minWidth: 880 }}>
        <div></div>
        {Array.from({ length: 53 }).map((_, w) => (
          <div key={w} className="t-mono" style={{ fontSize: 8.5, color: "var(--text-mute)", textAlign: "center", visibility: w % 4 === 0 ? "visible" : "hidden" }}>
            {months[Math.floor((w * 7) / 30.4) % 12]}
          </div>
        ))}

        {["M","W","F"].map((dayLabel, dIdx) => (
          <React.Fragment key={dIdx}>
            <div className="t-mono" style={{ fontSize: 9, color: "var(--text-mute)", textAlign: "right", paddingRight: 6, gridRow: dIdx + 2 }}>{dayLabel}</div>
            {Array.from({ length: 53 }).map((_, w) => {
              const x = r();
              const isFuture = w > 21;
              let bg = "var(--bg-elev-2)";
              if (!isFuture) {
                if (x < 0.04) bg = "var(--bad)";
                else if (x < 0.1) bg = "var(--warn)";
                else if (x < 0.25) bg = "var(--info)";
                else bg = "var(--good)";
              }
              return (
                <div key={w} title={`Week ${w+1}`} style={{
                  width: "100%", aspectRatio: "1/1",
                  background: bg, opacity: isFuture ? 0.18 : 0.85,
                  border: "1.5px solid var(--border)",
                  borderRadius: 2,
                }}></div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center" }}>
        <span className="t-mono tiny muted">Less</span>
        {["var(--bg-elev-2)","var(--info)","var(--good)","var(--warn)","var(--bad)"].map((c, i) => (
          <div key={i} style={{ width: 14, height: 14, background: c, border: "1.5px solid var(--border)" }}></div>
        ))}
        <span className="t-mono tiny muted">More activity</span>
        <span className="t-mono tiny muted" style={{ marginLeft: "auto" }}>2026 · 142 days logged</span>
      </div>
    </div>
  );
};

window.Calendar = Calendar;
