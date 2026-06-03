"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";
import { supabase } from "../lib/supabase";
import { useApp } from "../contexts/AppContext";

// Indian public holidays 2026 (remaining)
const HOLIDAYS = [
  { date: "2026-06-07", name: "Eid al-Adha (Bakri Eid)" },
  { date: "2026-07-29", name: "Muharram" },
  { date: "2026-08-15", name: "Independence Day" },
  { date: "2026-09-07", name: "Janmashtami" },
  { date: "2026-10-02", name: "Gandhi Jayanti" },
  { date: "2026-10-21", name: "Dussehra" },
  { date: "2026-11-05", name: "Diwali" },
  { date: "2026-11-20", name: "Guru Nanak Jayanti" },
  { date: "2026-12-25", name: "Christmas" },
];

// Static announcements — wire to DB table in a future sprint
const ANNOUNCEMENTS = [
  { id: 1, title: "Q3 All-Hands Meeting",   body: "10 Jun · 3:00 PM IST · Google Meet",   tag: "Meeting", urgent: false },
  { id: 2, title: "WFH Policy Updated",     body: "Max 3 days/week — effective July 1",   tag: "Policy",  urgent: true  },
  { id: 3, title: "New Joiner — Kavya Patel", body: "Marketing · joining 9 June",         tag: "People",  urgent: false },
];

const fmtTime = (ts) => {
  if (!ts) return "—:—";
  const d = new Date(ts);
  return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
};

const pad = (n) => String(n).padStart(2, "0");

const Dashboard = ({ data, setRoute }) => {
  const { user, role, clock, setClock } = useApp();

  const holdRef = useRef(null);
  const rafRef  = useRef(null);

  // Live IST clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Remote data
  const [attendanceId,  setAttendanceId]  = useState(null);
  const [monthPresent,  setMonthPresent]  = useState(null);
  const [leaveBalance,  setLeaveBalance]  = useState(null);
  const [teamToday,     setTeamToday]     = useState([]);

  const todayStr = new Date().toISOString().split("T")[0];

  // Ref keeps latest values accessible from the async hold-button callback
  const dataRef = useRef({});
  dataRef.current = { clock, user, attendanceId, todayStr };

  useEffect(() => {
    if (!user?.id) return;

    // Today's attendance id (needed for clock-out update)
    supabase.from("attendance").select("id")
      .eq("profile_id", user.id).eq("date", todayStr).maybeSingle()
      .then(({ data: row }) => { if (row) setAttendanceId(row.id); });

    // This month present days
    const monthStart = todayStr.slice(0, 7) + "-01";
    supabase.from("attendance").select("date")
      .eq("profile_id", user.id)
      .gte("date", monthStart).lte("date", todayStr)
      .in("status", ["present", "wfh"])
      .then(({ data: rows }) => setMonthPresent(rows?.length ?? 0));

    // Leave balance
    supabase.from("leave_balances").select("*")
      .eq("profile_id", user.id).eq("year", new Date().getFullYear()).maybeSingle()
      .then(({ data: lb }) => {
        if (lb) {
          const paid = (lb.annual_total || 0) - (lb.annual_used || 0)
                     + (lb.sick_total   || 0) - (lb.sick_used   || 0);
          setLeaveBalance({ paid, unpaid: "On request" });
        }
      });

    // Team attendance today
    supabase.from("attendance").select("profile_id, status").eq("date", todayStr)
      .then(({ data: rows }) => {
        const map = Object.fromEntries((rows || []).map(r => [r.profile_id, r.status]));
        setTeamToday(data.team.map(t => ({ ...t, todayStatus: map[t.id] || "out" })));
      });
  }, [user?.id]);

  // Hold-to-clock-in/out logic (mirrors Checkin.jsx)
  useEffect(() => {
    const el = holdRef.current;
    if (!el) return;
    const HOLD_MS = 800;
    let holding = false, startTime = 0;

    const tick = () => {
      const p = Math.min(1, (Date.now() - startTime) / HOLD_MS);
      el.style.setProperty("--p", p);
      if (p >= 1) { finish(); return; }
      rafRef.current = requestAnimationFrame(tick);
    };

    const finish = async () => {
      holding = false;
      cancelAnimationFrame(rafRef.current);
      el.style.setProperty("--p", 0);
      const { clock: c, user: u, attendanceId: aid, todayStr: ds } = dataRef.current;

      if (!c.in) {
        const ts = Date.now();
        setClock({ in: ts, out: null, elapsed: 0, breakTotal: 0, onBreak: false, breakStart: null, breaks: [] });
        if (u?.id) {
          const { data: row } = await supabase.from("attendance")
            .upsert({ profile_id: u.id, date: ds, clock_in: new Date(ts).toISOString(), status: "present" }, { onConflict: "profile_id,date" })
            .select("id").single();
          if (row) setAttendanceId(row.id);
        }
      } else if (!c.out) {
        const ts      = Date.now();
        const elapsed = (ts - c.in) / 1000 - (c.breakTotal || 0);
        setClock(prev => ({ ...prev, out: ts }));
        if (u?.id) {
          const payload = {
            clock_out:     new Date(ts).toISOString(),
            total_hours:   parseFloat((elapsed / 3600).toFixed(2)),
            break_minutes: Math.round((c.breakTotal || 0) / 60),
          };
          if (aid) {
            await supabase.from("attendance").update(payload).eq("id", aid);
          } else {
            await supabase.from("attendance").upsert(
              { profile_id: u.id, date: ds, clock_in: new Date(c.in).toISOString(), status: "present", ...payload },
              { onConflict: "profile_id,date" }
            );
          }
        }
      } else {
        setClock({ in: null, out: null, elapsed: 0, breakTotal: 0, onBreak: false, breakStart: null, breaks: [] });
      }
    };

    const start = e => { e.preventDefault(); if (holding) return; holding = true; startTime = Date.now(); tick(); };
    const cancel = () => {
      if (!holding) return;
      holding = false;
      cancelAnimationFrame(rafRef.current);
      const cur = parseFloat(el.style.getPropertyValue("--p") || 0);
      gsap.to(el, { duration: 0.3, ease: "power2.out", onUpdate: function () {
        el.style.setProperty("--p", cur * (1 - this.progress()));
      }});
    };

    el.addEventListener("mousedown",  start);
    el.addEventListener("touchstart", start, { passive: false });
    window.addEventListener("mouseup",  cancel);
    window.addEventListener("touchend", cancel);
    el.addEventListener("mouseleave", cancel);
    return () => {
      el.removeEventListener("mousedown",  start);
      el.removeEventListener("touchstart", start);
      window.removeEventListener("mouseup",  cancel);
      window.removeEventListener("touchend", cancel);
      el.removeEventListener("mouseleave", cancel);
      cancelAnimationFrame(rafRef.current);
    };
  }, [clock.in, clock.out]);

  // Entry animations
  useEffect(() => {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".d-hero .reveal",  { y: 24, opacity: 0, duration: 0.6, stagger: 0.05 })
      .from(".d-stat",          { y: 18, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.3")
      .from("[data-rev]",       { y: 18, opacity: 0, duration: 0.45, stagger: 0.06 }, "-=0.2");
  }, []);

  // Derived clock values
  const total    = clock.elapsed || 0;
  const hrsH     = Math.floor(total / 3600);
  const hrsM     = Math.floor((total % 3600) / 60);
  const hrsS     = Math.floor(total % 60);
  const TARGET   = 9;
  const pct      = Math.min(100, (total / 3600 / TARGET) * 100);
  const remaining = Math.max(0, TARGET - total / 3600);
  const status   = !clock.in ? "out" : clock.out ? "done" : clock.onBreak ? "break" : "in";
  const statusLabel = { out: "Not clocked in", in: "Clocked in", break: "On break", done: "Day complete" }[status];

  // IST time + date
  const istFmt  = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
  const istTime = now.toLocaleTimeString("en-US", istFmt);
  const dayDate = now.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata", weekday: "long", month: "long", day: "numeric" }).toUpperCase();
  const dayNum  = now.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata", day: "numeric" });
  const hourIST = parseInt(now.toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }));
  const greeting = hourIST < 12 ? "Good morning" : hourIST < 17 ? "Good afternoon" : "Good evening";

  // Upcoming holidays (from today forward)
  const todayMs = new Date(todayStr).getTime();
  const upcoming = HOLIDAYS.filter(h => new Date(h.date).getTime() >= todayMs).slice(0, 5);

  // Celebrations (from mock data until we have a celebrations table)
  const celebrations = (data.celebrations || []).slice(0, 4);

  // Team to display (real or fallback)
  const displayTeam = teamToday.length > 0 ? teamToday : data.team;

  // Working days in current month (for percentage)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  return (
    <div>
      {/* ── HERO: greeting + check-in/out ── */}
      <div className="d-hero brut-card brut-card--hard" style={{ padding: "32px 36px 28px", marginBottom: 22, overflow: "hidden", position: "relative" }}>
        {/* Decorative day number */}
        <div style={{
          position: "absolute", right: -20, top: -50,
          fontFamily: "var(--font-display)", fontSize: 320, fontWeight: 700,
          color: "var(--bg-elev-2)", lineHeight: 0.8, letterSpacing: "-0.06em",
          pointerEvents: "none", userSelect: "none",
        }}>{dayNum}</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start", position: "relative" }}>
          {/* Left — greeting */}
          <div>
            <div className="reveal t-eyebrow">{dayDate} · AHMEDABAD, IN</div>
            <h1 className="reveal t-display page-title" style={{ marginTop: 12, marginBottom: 0, maxWidth: 580 }}>
              {greeting},<br/>
              <span style={{ color: "var(--accent)" }}>{data.me?.name?.split(" ")[0] ?? "there"}.</span>
            </h1>
            <div className="reveal" style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap", alignItems: "center" }}>
              <span className={"pill " + (status === "in" ? "good" : status === "break" ? "warn" : status === "done" ? "info" : "")}>
                <span className="dot"></span>{statusLabel.toUpperCase()}
              </span>
              {clock.in && (
                <span className="t-mono" style={{ fontSize: 11, color: "var(--text-mute)" }}>
                  since {fmtTime(clock.in)}
                </span>
              )}
              <button className="brut-btn brut-btn--ghost" style={{ marginLeft: "auto", padding: "5px 12px", fontSize: 11 }}
                onClick={() => setRoute("checkin")}>
                Full clock screen <Icon name="arrow-r" size={11} />
              </button>
            </div>
          </div>

          {/* Right — live IST + hold button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, minWidth: 300 }}>
            <div style={{ textAlign: "right" }}>
              <div className="t-mono reveal" style={{ fontSize: 9.5, color: "var(--text-mute)", letterSpacing: "0.08em" }}>AHMEDABAD · IST</div>
              <div className="t-display reveal" style={{ fontSize: 48, lineHeight: 1, letterSpacing: "-0.03em", marginTop: 2 }}>
                {istTime}
              </div>
            </div>

            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span className="t-mono" style={{ fontSize: 10, color: "var(--text-mute)" }}>Today worked</span>
                <span className="t-mono" style={{ fontSize: 10, color: "var(--text-dim)" }}>
                  <b style={{ color: "var(--accent)" }}>{pad(hrsH)}h {pad(hrsM)}m</b> / 9h
                </span>
              </div>
              <div className="bar" style={{ height: 8 }}><i style={{ width: pct + "%" }} /></div>
            </div>

            <div ref={holdRef} className="hold-btn reveal" style={{ width: "100%" }} title="Hold 0.8s to confirm">
              <div className="fill"></div>
              <div className="label">
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name={status === "out" ? "play" : "stop"} size={16} />
                  {status === "out"   && "Hold to clock in"}
                  {status === "in"    && "Hold to clock out"}
                  {status === "break" && "Hold to resume"}
                  {status === "done"  && "New day"}
                </span>
                <span className="t-mono" style={{ fontSize: 10, opacity: 0.55 }}>HOLD 0.8s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT STRIP (3 cards) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 22 }}>
        {/* Today hours */}
        <div className="brut-card d-stat" style={{ padding: 22 }}>
          <div className="t-eyebrow">Today · Hours</div>
          <div className="t-display" style={{ fontSize: 52, marginTop: 6, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {pad(hrsH)}<span style={{ fontSize: 28 }}>:{pad(hrsM)}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="bar" style={{ height: 6 }}><i style={{ width: pct + "%" }} /></div>
            <div className="t-mono tiny muted" style={{ marginTop: 6 }}>
              {remaining > 0 ? `${remaining.toFixed(1)}h to target` : "Target reached"}
            </div>
          </div>
        </div>

        {/* This month present */}
        <div className="brut-card d-stat" style={{ padding: 22 }}>
          <div className="t-eyebrow">This Month · Present</div>
          <div className="t-display" style={{ fontSize: 52, marginTop: 6, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {monthPresent ?? "—"}
            <span style={{ fontSize: 22, color: "var(--text-mute)", fontWeight: 400 }}> days</span>
          </div>
          <div className="t-mono tiny muted" style={{ marginTop: 14 }}>
            {monthPresent != null
              ? `${Math.round((monthPresent / daysInMonth) * 100)}% of month logged`
              : "Loading…"}
          </div>
        </div>

        {/* Leave balance */}
        <div className="brut-card d-stat" style={{ padding: 22 }}>
          <div className="t-eyebrow">Leave Balance</div>
          <div style={{ display: "flex", gap: 22, marginTop: 10, alignItems: "flex-end" }}>
            <div>
              <div className="t-mono" style={{ fontSize: 10, color: "var(--text-mute)", marginBottom: 4 }}>PAID</div>
              <div className="t-display" style={{ fontSize: 44, lineHeight: 1, color: "var(--good)" }}>
                {leaveBalance != null ? leaveBalance.paid : "—"}
                <span style={{ fontSize: 18, color: "var(--text-mute)" }}>d</span>
              </div>
            </div>
            <div style={{ width: 1.5, height: 44, background: "var(--border)", marginBottom: 2 }}></div>
            <div>
              <div className="t-mono" style={{ fontSize: 10, color: "var(--text-mute)", marginBottom: 4 }}>UNPAID</div>
              <div className="t-display" style={{ fontSize: 24, lineHeight: 1, color: "var(--text-dim)" }}>
                {leaveBalance?.unpaid ?? "—"}
              </div>
            </div>
          </div>
          <button className="brut-btn brut-btn--ghost" style={{ marginTop: 10, padding: "4px 10px", fontSize: 11 }}
            onClick={() => setRoute("leave")}>
            Apply leave <Icon name="arrow-r" size={11} />
          </button>
        </div>
      </div>

      {/* ── ROW 2: Birthdays + Announcements ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Birthdays & Anniversaries */}
        <div className="brut-card" style={{ padding: 22 }} data-rev>
          <div className="t-eyebrow" style={{ marginBottom: 16 }}>Birthdays &amp; Anniversaries</div>
          {celebrations.length === 0 ? (
            <div className="muted tiny">No upcoming celebrations.</div>
          ) : celebrations.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: i ? "1.5px solid var(--border)" : "none", alignItems: "center" }}>
              <div className="av" style={{
                width: 40, height: 40, fontSize: 13, flexShrink: 0,
                background: c.kind === "birthday" ? "var(--accent)" : "var(--info)",
                color: c.kind === "birthday" ? "var(--accent-ink)" : "#fff",
                border: "1.5px solid var(--border-strong)",
              }}>{c.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5 }}>
                  {c.who}
                  {c.kind === "anniversary" && (
                    <span className="pill" style={{ marginLeft: 8, fontSize: 9.5 }}>{c.years}Y</span>
                  )}
                </div>
                <div className="muted tiny">
                  {c.kind === "birthday" ? "Birthday" : "Work anniversary"} · {new Date(c.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </div>
              </div>
              <span className="t-mono" style={{ fontSize: 11, color: c.in_days === 0 ? "var(--accent)" : "var(--text-mute)", fontWeight: c.in_days === 0 ? 700 : 400 }}>
                {c.in_days === 0 ? "TODAY" : `+${c.in_days}d`}
              </span>
            </div>
          ))}
          <button className="brut-btn brut-btn--ghost" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
            onClick={() => setRoute("celebrations")}>
            All celebrations <Icon name="arrow-r" size={12} />
          </button>
        </div>

        {/* Announcements */}
        <div className="brut-card" style={{ padding: 22 }} data-rev>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <div className="t-eyebrow">Company Announcements</div>
            <span className="t-mono tiny muted">{ANNOUNCEMENTS.length} ITEMS</span>
          </div>
          {ANNOUNCEMENTS.map((a, i) => (
            <div key={a.id} style={{ padding: "12px 0", borderTop: i ? "1.5px solid var(--border)" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                    {a.urgent && <span className="pill bad" style={{ fontSize: 9, padding: "1px 6px" }}>ACTION</span>}
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5 }}>{a.title}</span>
                  </div>
                  <div className="muted tiny">{a.body}</div>
                </div>
                <span className="pill" style={{ fontSize: 9.5, flexShrink: 0 }}>{a.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 3: Team Today + Holiday List ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Team status today */}
        <div className="brut-card" style={{ padding: 22 }} data-rev>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div className="t-eyebrow">Team · Today</div>
            <span className="t-mono tiny muted">
              {displayTeam.filter(t => (t.todayStatus || t.status) === "present" || (t.todayStatus || t.status) === "in").length} IN OFFICE
            </span>
          </div>
          {displayTeam.slice(0, 6).map((t, i) => {
            const s   = t.todayStatus || t.status;
            const dot = s === "present" || s === "in" ? "var(--good)"
                      : s === "wfh"    ? "var(--info)"
                      : s === "leave"  ? "var(--warn)"
                      : "var(--text-mute)";
            const lbl = s === "present" || s === "in" ? "Office"
                      : s === "wfh"   ? "Remote"
                      : s === "leave" ? "On leave"
                      : "Out";
            return (
              <div key={t.id} style={{ display: "flex", gap: 12, padding: "8px 0", alignItems: "center", borderTop: i ? "1.5px solid var(--border)" : "none" }}>
                <div className="av" style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>{t.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                  <div className="muted tiny">{t.role}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)", flexShrink: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot }}></span>
                  {lbl}
                </div>
              </div>
            );
          })}
          <button className="brut-btn brut-btn--ghost" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
            onClick={() => setRoute("directory")}>
            Full directory <Icon name="arrow-r" size={12} />
          </button>
        </div>

        {/* Upcoming holidays */}
        <div className="brut-card" style={{ padding: 22 }} data-rev>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <div className="t-eyebrow">Upcoming Holidays</div>
            <span className="t-mono tiny muted">INDIA · 2026</span>
          </div>
          {upcoming.length === 0 ? (
            <div className="muted tiny">No upcoming holidays.</div>
          ) : upcoming.map((h, i) => {
            const d        = new Date(h.date);
            const daysAway = Math.ceil((d.getTime() - todayMs) / 86400000);
            const badge    = daysAway === 0 ? "TODAY"
                           : daysAway === 1 ? "TOMORROW"
                           : `${daysAway}d`;
            return (
              <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: i ? "1.5px solid var(--border)" : "none", alignItems: "center" }}>
                <div style={{ width: 44, textAlign: "center", flexShrink: 0 }}>
                  <div className="t-display" style={{ fontSize: 24, lineHeight: 1 }}>{d.getDate()}</div>
                  <div className="t-mono" style={{ fontSize: 9, color: "var(--text-mute)" }}>
                    {d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5 }}>{h.name}</div>
                  <div className="muted tiny">{d.toLocaleDateString("en-US", { weekday: "long" })}</div>
                </div>
                <span className="t-mono" style={{ fontSize: 10, color: daysAway <= 7 ? "var(--accent)" : "var(--text-mute)" }}>
                  {badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM: Quick Actions ── */}
      <div className="brut-card" style={{ padding: 22 }} data-rev>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {[
            { icon: "leaf",     label: "Apply Leave",    route: "leave"         },
            { icon: "calendar", label: "Attendance",     route: "calendar"      },
            { icon: "users",    label: "Directory",      route: "directory"     },
            { icon: "clock",    label: "Clock Screen",   route: "checkin"       },
            { icon: "bell",     label: "Notifications",  route: "notifications" },
          ].map((a, i) => (
            <button key={i} className="brut-btn"
              style={{ flexDirection: "column", gap: 10, padding: "22px 12px", justifyContent: "center", alignItems: "center" }}
              onClick={() => setRoute(a.route)}>
              <Icon name={a.icon} size={20} />
              <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="marquee" style={{ marginTop: 22, marginInline: -36 }}>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} style={{ display: "contents" }}>
              <span className="item"><span className="sq"></span>AMRYTT · ALL HANDS · JUN 10</span>
              <span className="item"><span className="sq"></span>EID AL-ADHA · JUN 7 · OFFICE CLOSED</span>
              <span className="item"><span className="sq"></span>WFH POLICY UPDATE · EFFECTIVE JULY 1</span>
              <span className="item"><span className="sq"></span>INDEPENDENCE DAY · AUG 15 · HOLIDAY</span>
              <span className="item"><span className="sq"></span>DIWALI · NOV 5 · HOLIDAY</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
