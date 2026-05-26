import { useState, useEffect } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";

const Directory = ({ data }) => {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");

  const depts = ["All", ...Array.from(new Set(data.team.map(t => t.dept)))];
  const filtered = data.team.filter(t =>
    (dept === "All" || t.dept === dept) &&
    (t.name.toLowerCase().includes(q.toLowerCase()) || t.role.toLowerCase().includes(q.toLowerCase()))
  );

  useEffect(() => {
    gsap.from(".dir-card", { y: 12, opacity: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" });
  }, [dept, q]);

  return (
    <div>
      <div className="t-eyebrow">TEAM DIRECTORY · 47 PEOPLE · 6 OFFICES</div>
      <h1 className="t-display page-title">Everyone, sorted.</h1>
      <div className="page-sub" style={{ marginBottom: 24, maxWidth: 580 }}>
        Search teammates, check their status, find DMs and time zones at a glance.
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 22, alignItems: "center", flexWrap: "wrap" }}>
        <div className="search" style={{ flex: 1, minWidth: 280 }}>
          <Icon name="search" size={14} />
          <input placeholder="Search people, roles, locations…" value={q} onChange={(e) => setQ(e.target.value)} />
          <span className="kbd">⌘K</span>
        </div>
        <div style={{ display: "flex", gap: 6, padding: 4, border: "1.5px solid var(--border-strong)", borderRadius: 999 }}>
          {depts.map(d => (
            <button key={d} onClick={() => setDept(d)} className="brut-btn"
              style={{
                padding: "6px 12px", fontSize: 10.5, borderRadius: 999,
                border: 0,
                background: dept === d ? "var(--accent)" : "transparent",
                color: dept === d ? "var(--accent-ink)" : "var(--text-dim)",
                boxShadow: "none",
              }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {filtered.map(t => {
          const dot = t.status === "in" ? "var(--good)" : t.status === "wfh" ? "var(--info)" : t.status === "leave" ? "var(--warn)" : "var(--text-mute)";
          const label = t.status === "in" ? "In office" : t.status === "wfh" ? "Remote" : t.status === "leave" ? "On leave" : "Off";
          return (
            <div key={t.id} className="brut-card dir-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div className="av" style={{ width: 48, height: 48, fontSize: 14 }}>{t.avatar}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14.5 }}>{t.name}</div>
                  <div className="muted tiny">{t.role}</div>
                </div>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flex: "0 0 8px" }}></span>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 14, paddingTop: 12, borderTop: "1.5px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-mute)" }}>
                <span><Icon name="globe" size={10} /> {t.loc}</span>
                <span>·</span>
                <span>{t.dept.split(" ")[0].toUpperCase()}</span>
                <span style={{ marginLeft: "auto", color: dot, fontWeight: 600 }}>{label.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Directory;
