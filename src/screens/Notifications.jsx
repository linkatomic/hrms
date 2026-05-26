import { useState, useEffect } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";

const Notifications = ({ data, setRoute }) => {
  const [filter, setFilter] = useState("All");
  const kinds = ["All", "Unread", "Leave", "Celeb", "Payroll", "Mention"];

  useEffect(() => {
    gsap.from(".n-card", { x: -10, opacity: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" });
  }, [filter]);

  const list = data.notifications.filter(n =>
    filter === "All" ? true :
    filter === "Unread" ? n.unread :
    n.kind === filter.toLowerCase()
  );

  const iconForKind = { leave: "leaf", celeb: "cake", payroll: "money", mention: "user", policy: "check", checkin: "clock" };

  return (
    <div>
      <div className="t-eyebrow">NOTIFICATIONS · {data.notifications.filter(n => n.unread).length} UNREAD</div>
      <h1 className="t-display page-title">Caught up.</h1>
      <div className="page-sub" style={{ marginBottom: 22, maxWidth: 580 }}>
        Only the signal — leave updates, payroll, celebrations, mentions. Everything else stays out of your way.
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, padding: 4, border: "1.5px solid var(--border-strong)", borderRadius: 999 }}>
          {kinds.map(k => (
            <button key={k} onClick={() => setFilter(k)}
              style={{
                padding: "6px 14px", fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", borderRadius: 999,
                background: filter === k ? "var(--accent)" : "transparent",
                color: filter === k ? "var(--accent-ink)" : "var(--text-dim)",
              }}>
              {k}
            </button>
          ))}
        </div>
        <button className="brut-btn brut-btn--ghost" style={{ marginLeft: "auto" }}>
          <Icon name="check" size={12} /> Mark all read
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map(n => (
          <div key={n.id} className="brut-card n-card" style={{ padding: 18, display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 16, alignItems: "center", position: "relative" }}>
            {n.unread && <div style={{ position: "absolute", left: -1.5, top: 12, bottom: 12, width: 4, background: "var(--accent)" }}></div>}
            <div style={{
              width: 38, height: 38,
              background: "var(--bg-elev-2)", border: "1.5px solid var(--border-strong)",
              display: "grid", placeItems: "center", color: n.unread ? "var(--accent)" : "var(--text-dim)",
            }}>
              <Icon name={iconForKind[n.kind] || "bell"} size={16} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: n.unread ? "var(--text)" : "var(--text-dim)" }}>
                {n.title}
              </div>
              <div className="muted tiny" style={{ marginTop: 2 }}>{n.body}</div>
            </div>
            <span className="t-mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>{n.t}</span>
            <button className="brut-btn brut-btn--ghost" style={{ padding: "4px 10px" }}>
              View <Icon name="arrow-r" size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
