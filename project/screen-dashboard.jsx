// Dashboard screen
const { useEffect: useEffect_dash, useRef: useRef_dash, useState: useState_dash } = React;

const Dashboard = ({ data, role, setRoute, clock }) => {
  const heroRef = useRef_dash(null);

  useEffect_dash(() => {
    if (!window.gsap) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".dash-hero .reveal", { y: 24, opacity: 0, duration: 0.6, stagger: 0.05 })
      .from(".dash-stats .stat", { y: 18, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.3")
      .from(".dash-row [data-rev]", { y: 18, opacity: 0, duration: 0.45, stagger: 0.06 }, "-=0.2");

    // Animate the big number counter
    const num = document.querySelector(".dash-hours-num");
    if (num) {
      const target = parseFloat(num.dataset.val);
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 1.4, ease: "power2.out", onUpdate: () => {
        num.textContent = obj.v.toFixed(2);
      }});
    }
  }, []);

  const now = new Date("2026-05-26T14:32:00");
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const hrsWorked = clock?.elapsed != null ? (clock.elapsed / 3600).toFixed(2) : "5.47";

  // attendance summary for May
  const a = data.attendance;
  const days = Object.values(a);
  const present = days.filter(d => d.status === "present" || d.status === "wfh").length;
  const absent = days.filter(d => d.status === "absent").length;
  const onleave = days.filter(d => d.status === "leave").length;

  return (
    <div data-screen-label="01 Dashboard">
      {/* HERO */}
      <div className="dash-hero brut-card brut-card--hard" style={{ padding: "32px 32px 28px", marginBottom: 22, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", right: -40, top: -60, fontFamily: "var(--font-display)", fontSize: 380, fontWeight: 700, color: "var(--bg-elev-2)", lineHeight: 0.8, letterSpacing: "-0.06em", pointerEvents: "none", userSelect: "none" }}>
          26
        </div>

        <div className="reveal t-eyebrow">{dateStr.toUpperCase()} · WEEK 22 · {data.company.tz.split("/")[1].replace("_"," ")}</div>
        <h1 className="reveal t-display page-title" style={{ marginTop: 14, maxWidth: 720 }}>
          Good afternoon,<br/>
          <span style={{ color: "var(--accent)" }}>{data.me.name.split(" ")[0]}.</span>
        </h1>
        <div className="reveal page-sub" style={{ maxWidth: 540 }}>
          You're <b style={{ color: "var(--text)" }}>{role === "manager" ? "managing" : "on"}</b> the Brand & Creative team today.
          Office hours close in <b style={{ color: "var(--text)" }}>3h 28m</b>. Three teammates are clocked-in remotely.
        </div>

        <div className="reveal" style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <button className="brut-btn brut-btn--primary" onClick={() => setRoute("checkin")}>
            <Icon name="clock" size={14} />
            View clock · <span className="t-mono" style={{ opacity: 0.85 }}>5h 28m</span>
          </button>
          <button className="brut-btn" onClick={() => setRoute("leave")}>
            <Icon name="leaf" size={14} />
            Apply leave
          </button>
          <button className="brut-btn brut-btn--ghost" onClick={() => setRoute("calendar")}>
            <Icon name="calendar" size={14} />
            See calendar
          </button>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span className="pill good"><span className="dot"></span>Clocked in 09:04</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid stat-grid dash-stats" style={{ marginBottom: 22 }}>
        <div className="stat">
          <div className="t-eyebrow">Today · Hours</div>
          <div className="t-num num dash-hours-num" data-val={hrsWorked}>0.00</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <span className="delta">+0.4 vs avg</span>
            <div className="bar" style={{ width: 70 }}><i style={{ width: "61%" }}></i></div>
          </div>
        </div>
        <div className="stat">
          <div className="t-eyebrow">This Month · Present</div>
          <div className="t-num num">{present}<span style={{ fontSize: 18, color: "var(--text-mute)" }}>/18</span></div>
          <div style={{ marginTop: 6 }}>
            <span className="delta">98% attendance</span>
          </div>
        </div>
        <div className="stat">
          <div className="t-eyebrow">PTO Balance</div>
          <div className="t-num num">13<span style={{ fontSize: 18, color: "var(--text-mute)" }}>d</span></div>
          <div style={{ marginTop: 6 }}>
            <span className="delta bad">−9 used</span>
          </div>
        </div>
        <div className="stat">
          <div className="t-eyebrow">Next Paycheck</div>
          <div className="t-num num" style={{ fontSize: 32 }}>$5,229</div>
          <div style={{ marginTop: 6 }}>
            <span className="delta">May 31 · 5d</span>
          </div>
        </div>
      </div>

      {/* MAIN ROW */}
      <div className="col-2 dash-row" style={{ marginBottom: 22 }}>
        {/* Hours bar chart */}
        <div className="brut-card" style={{ padding: 22 }} data-rev>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <div>
              <div className="t-eyebrow">Weekly hours</div>
              <div className="t-display" style={{ fontSize: 24, marginTop: 4 }}>43h 12m</div>
            </div>
            <div className="t-mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>
              MAY 18 — MAY 24
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, alignItems: "end", height: 180 }}>
            {[
              { d: "M", h: 8.7, label: "May 18" },
              { d: "T", h: 9.1, label: "May 19" },
              { d: "W", h: 8.3, label: "May 20" },
              { d: "T", h: 7.5, label: "May 21", wfh: true },
              { d: "F", h: 8.8, label: "May 22" },
              { d: "S", h: 0,   label: "May 23", off: true },
              { d: "S", h: 0,   label: "May 24", off: true },
            ].map((b, i) => {
              const h = Math.max(8, (b.h / 10) * 160);
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: b.off ? "var(--text-mute)" : "var(--text-dim)" }}>
                    {b.h ? b.h.toFixed(1) : "—"}
                  </div>
                  <div style={{
                    width: "100%", height: b.off ? 8 : h,
                    background: b.off ? "var(--bg-elev-2)" : (b.wfh ? "var(--info)" : "var(--accent)"),
                    border: "1.5px solid var(--border-strong)",
                    transition: "height .6s cubic-bezier(.2,.7,.2,1)",
                  }} className="bar-col" />
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600, color: "var(--text-dim)" }}>{b.d}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 14, paddingTop: 12, borderTop: "1.5px solid var(--border)" }}>
            <span className="pill"><span className="dot" style={{ background: "var(--accent)" }}></span>Office</span>
            <span className="pill"><span className="dot" style={{ background: "var(--info)" }}></span>Remote</span>
            <span className="pill"><span className="dot" style={{ background: "var(--text-mute)" }}></span>Off</span>
            <button className="brut-btn brut-btn--ghost" style={{ marginLeft: "auto", padding: "4px 10px", fontSize: 10.5 }}>
              Export CSV <Icon name="arrow-up-r" size={11} />
            </button>
          </div>
        </div>

        {/* Today schedule */}
        <div className="brut-card" style={{ padding: 22 }} data-rev>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <div>
              <div className="t-eyebrow">Today · Schedule</div>
              <div className="t-display" style={{ fontSize: 24, marginTop: 4 }}>4 events</div>
            </div>
            <span className="pill live">NOW 14:32</span>
          </div>

          {[
            { t: "09:00 — 09:30", title: "Morning standup",            tag: "Brand & Creative",   live: false, past: true },
            { t: "10:30 — 11:30", title: "Q3 campaign — kickoff",      tag: "with Priya, Diego",  past: true },
            { t: "14:00 — 15:00", title: "Design crit · Nimbus rebrand", tag: "Conference 2 · NYC", live: true },
            { t: "16:30 — 17:00", title: "1:1 · Priya Iyer",           tag: "Recurring · weekly", past: false },
          ].map((ev, i) => (
            <div key={i} style={{
              display: "flex", gap: 14, padding: "12px 0",
              borderBottom: i < 3 ? "1.5px solid var(--border)" : "none",
              opacity: ev.past ? 0.5 : 1,
            }}>
              <div style={{ width: 6, background: ev.live ? "var(--accent)" : "var(--border-strong)" }}></div>
              <div style={{ flex: 1 }}>
                <div className="t-mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>{ev.t}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, marginTop: 3 }}>
                  {ev.title}
                  {ev.live && <span className="pill live" style={{ marginLeft: 8, padding: "1px 7px", fontSize: 9.5 }}>LIVE</span>}
                </div>
                <div className="muted tiny" style={{ marginTop: 2 }}>{ev.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECONDARY ROW */}
      <div className="col-3 dash-row">
        {/* Up next */}
        <div className="brut-card" style={{ padding: 20 }} data-rev>
          <div className="t-eyebrow" style={{ marginBottom: 14 }}>Up next · Celebrations</div>
          {data.celebrations.slice(0, 3).map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i ? "1.5px solid var(--border)" : "none" }}>
              <div className="av" style={{ width: 36, height: 36, fontSize: 12, background: c.kind === "birthday" ? "var(--accent)" : "var(--info)", color: c.kind === "birthday" ? "var(--accent-ink)" : "#fff", border: "1.5px solid var(--border-strong)" }}>
                {c.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5 }}>
                  {c.who} {c.kind === "anniversary" && <span className="t-mono" style={{ color: "var(--text-mute)", fontSize: 10.5, marginLeft: 4 }}>{c.years}Y</span>}
                </div>
                <div className="muted tiny">{c.kind === "birthday" ? "Birthday" : "Work anniversary"} · {new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
              </div>
              <div className="t-mono" style={{ fontSize: 10.5, color: "var(--accent)", alignSelf: "center" }}>
                {c.in_days === 0 ? "TODAY" : `+${c.in_days}D`}
              </div>
            </div>
          ))}
          <button className="brut-btn brut-btn--ghost" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={() => setRoute("celebrations")}>
            All celebrations <Icon name="arrow-r" size={12} />
          </button>
        </div>

        {/* Leave snapshot */}
        <div className="brut-card" style={{ padding: 20 }} data-rev>
          <div className="t-eyebrow" style={{ marginBottom: 14 }}>Leave balance</div>
          {data.leaves.balances.slice(0, 3).map((b, i) => {
            const pct = (b.used / b.total) * 100;
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, fontFamily: "var(--font-display)", fontWeight: 500 }}>{b.kind}</span>
                  <span className="t-mono" style={{ fontSize: 11 }}>
                    <b style={{ color: "var(--text)" }}>{b.total - b.used}</b><span style={{ color: "var(--text-mute)" }}>/{b.total}</span>
                  </span>
                </div>
                <div className="bar"><i style={{ width: pct + "%", background: b.color }}></i></div>
              </div>
            );
          })}
          <button className="brut-btn brut-btn--primary" style={{ width: "100%", justifyContent: "center", marginTop: 6 }} onClick={() => setRoute("leave")}>
            <Icon name="plus" size={12} />
            Apply for leave
          </button>
        </div>

        {/* Team status */}
        <div className="brut-card" style={{ padding: 20 }} data-rev>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <span className="t-eyebrow">Team · Right now</span>
            <span className="t-mono tiny" style={{ color: "var(--text-mute)" }}>8 ONLINE</span>
          </div>
          {data.team.slice(0, 5).map((t, i) => {
            const dot = t.status === "in" ? "var(--good)" : t.status === "wfh" ? "var(--info)" : t.status === "leave" ? "var(--warn)" : "var(--text-mute)";
            const label = t.status === "in" ? "Office" : t.status === "wfh" ? "Remote · " + t.loc : t.status === "leave" ? "On leave" : "Off";
            return (
              <div key={t.id} style={{ display: "flex", gap: 12, padding: "8px 0", alignItems: "center", borderTop: i ? "1.5px solid var(--border)" : "none" }}>
                <div className="av" style={{ width: 30, height: 30, fontSize: 11 }}>{t.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontFamily: "var(--font-display)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                  <div className="muted tiny">{t.role}</div>
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot }}></span>
                  {label}
                </span>
              </div>
            );
          })}
          <button className="brut-btn brut-btn--ghost" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={() => setRoute("directory")}>
            Open directory <Icon name="arrow-r" size={12} />
          </button>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="marquee" style={{ marginTop: 22, marginInline: -36 }}>
        <div className="marquee-track" style={{ display: "flex", gap: 32, animation: "marqueeScroll 30s linear infinite" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              <span className="item"><span className="sq"></span>AMRYTT · ALL HANDS · FRI 4PM</span>
              <span className="item"><span className="sq"></span>SUMMER REVIEW WEEK · JUN 16</span>
              <span className="item"><span className="sq"></span>NEW HIRE — IBRAHIM HASSAN — ART DIR</span>
              <span className="item"><span className="sq"></span>OFFICE CLOSED · MEMORIAL DAY · MAY 25</span>
              <span className="item"><span className="sq"></span>Q3 KICKOFF MIXER · JUN 04</span>
              <span className="item"><span className="sq"></span>SHIPPED · NIMBUS REBRAND v2</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
