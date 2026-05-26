import { useEffect } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";

const Celebrations = ({ data }) => {
  useEffect(() => {
    gsap.from(".cel-card", { y: 18, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
  }, []);

  const upcoming = data.celebrations;
  const next = upcoming[0];

  return (
    <div>
      <div className="t-eyebrow">CELEBRATIONS · NEXT 30 DAYS</div>
      <h1 className="t-display page-title">Don&apos;t miss it.</h1>
      <div className="page-sub" style={{ marginBottom: 24, maxWidth: 580 }}>
        Birthdays, work anniversaries and big personal moments — surfaced two weeks ahead so the team can rally.
      </div>

      {/* Featured next */}
      <div className="brut-card brut-card--hard cel-card" style={{ padding: 36, marginBottom: 22, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -40, fontFamily: "var(--font-display)", fontSize: 240, fontWeight: 700, color: "var(--accent)", lineHeight: 0.8, letterSpacing: "-0.06em", pointerEvents: "none", opacity: 0.14 }}>
          {next.in_days}D
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center", position: "relative" }}>
          <div className="av" style={{ width: 110, height: 110, fontSize: 36, background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--accent-ink)" }}>
            {next.avatar}
          </div>
          <div>
            <span className="pill"><span className="dot"></span>{next.kind === "birthday" ? "BIRTHDAY" : "WORK ANNIVERSARY"}</span>
            <h2 className="t-display" style={{ fontSize: 42, marginTop: 14, letterSpacing: "-0.02em" }}>{next.who}</h2>
            <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>{next.role} · Joined Brand &amp; Creative</div>
            <div className="t-mono" style={{ marginTop: 14, fontSize: 11, color: "var(--text-dim)" }}>
              {new Date(next.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
              {next.years && ` · ${next.years} YEARS`}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="brut-btn brut-btn--primary"><Icon name="cake" size={14} /> Sign card</button>
            <button className="brut-btn brut-btn--ghost"><Icon name="users" size={14} /> Group gift</button>
            <button className="brut-btn brut-btn--ghost"><Icon name="bell" size={14} /> Remind me</button>
          </div>
        </div>
      </div>

      {/* Upcoming list */}
      <div className="sec-head">
        <h2>Upcoming</h2>
        <span className="meta">{upcoming.length} events · next 30 days</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {upcoming.slice(1).map((c, i) => (
          <div key={i} className="brut-card cel-card" style={{ padding: 20, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center" }}>
            <div className="av" style={{ width: 52, height: 52, fontSize: 16, background: c.kind === "birthday" ? "var(--accent)" : "var(--info)", color: c.kind === "birthday" ? "var(--accent-ink)" : "#fff", border: "1.5px solid var(--border-strong)" }}>
              {c.avatar}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16 }}>{c.who}</div>
              <div className="muted tiny">{c.role}</div>
              <div className="t-mono tiny" style={{ color: c.kind === "birthday" ? "var(--accent)" : "var(--info)", marginTop: 4 }}>
                {c.kind === "birthday" ? "BIRTHDAY" : `${c.years}Y ANNIVERSARY`} · {new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="t-num" style={{ fontSize: 28, color: "var(--accent)" }}>+{c.in_days}<span style={{ fontSize: 12, color: "var(--text-mute)" }}>d</span></div>
              <button className="brut-btn brut-btn--ghost" style={{ marginTop: 6, fontSize: 10 }}><Icon name="bell" size={10} /> Remind</button>
            </div>
          </div>
        ))}
      </div>

      {/* Past month wins */}
      <div className="sec-head">
        <h2>Past celebrations</h2>
        <span className="meta">May 2026</span>
      </div>
      <div className="brut-card" style={{ padding: 22 }}>
        {[
          { who: "Amelia Foster",  k: "5Y anniversary", date: "May 19", note: "Big team lunch · 14 RSVPs" },
          { who: "Lukas Berg",     k: "Birthday",       date: "May 14", note: "Surprise cake from Yara" },
          { who: "Rahul Kapoor",   k: "Founder's Day",  date: "May 09", note: "Townhall + drinks" },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", alignItems: "center", borderTop: i ? "1.5px solid var(--border)" : "none" }}>
            <Icon name="check" size={16} />
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13.5 }}>{p.who}</span>
              <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>· {p.k}</span>
            </div>
            <span className="muted tiny">{p.note}</span>
            <span className="t-mono tiny" style={{ color: "var(--text-mute)" }}>{p.date.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Celebrations;
