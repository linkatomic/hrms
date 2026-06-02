"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";

const Profile = ({ data, role }) => {
  useEffect(() => {
    gsap.from(".pf-card", { y: 18, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
  }, []);

  const me = data.me;

  return (
    <div>
      <div className="t-eyebrow">PROFILE · {me.employeeId}</div>
      <h1 className="t-display page-title">{me.name}.</h1>
      <div className="page-sub" style={{ marginBottom: 24 }}>{me.role} · {me.team} · Joined {me.joined}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 22 }}>
        <div className="brut-card brut-card--hard pf-card" style={{ padding: 26, textAlign: "center" }}>
          <div className="av" style={{ width: 120, height: 120, fontSize: 38, margin: "0 auto", border: "2px solid var(--accent-ink)" }}>{me.avatar}</div>
          <h2 className="t-display" style={{ fontSize: 24, marginTop: 18, marginBottom: 4 }}>{me.name}</h2>
          <div className="muted tiny">{me.pronouns}</div>
          <div className="rule">manager</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <div className="av" style={{ width: 28, height: 28, fontSize: 11 }}>PI</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>{me.manager}</div>
              <div className="muted tiny">Creative Director</div>
            </div>
          </div>
          <button className="brut-btn brut-btn--primary" style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
            Edit profile
          </button>
        </div>

        <div className="brut-card pf-card" style={{ padding: 26 }}>
          <div className="t-eyebrow" style={{ marginBottom: 14 }}>Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, columnGap: 28 }}>
            {[
              ["Employee ID", me.employeeId],
              ["Email", me.email],
              ["Phone", me.phone],
              ["Location", me.location],
              ["Team", me.team],
              ["Manager", me.manager],
              ["Joined", me.joined],
              ["Pronouns", me.pronouns],
              ["Level", "L3 · Senior"],
              ["Title band", "Designer III"],
              ["Office", "Brooklyn HQ · 5th fl"],
              ["Time zone", "America/New_York"],
            ].map(([k, v], i) => (
              <div key={i}>
                <div className="t-eyebrow tiny">{k}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 500, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sec-head"><h2>Documents</h2><span className="meta">4 files</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { t: "Offer letter",        d: "Mar 2023 · 3 pp"  },
          { t: "Employment contract", d: "Mar 2023 · 11 pp" },
          { t: "NDA",                 d: "Mar 2023 · 2 pp"  },
          { t: "2025 W-2",            d: "Jan 2026 · 1 pp"  },
        ].map((doc, i) => (
          <div key={i} className="brut-card pf-card" style={{ padding: 18 }}>
            <div style={{ width: 32, height: 40, background: "var(--bg-elev-2)", border: "1.5px solid var(--border-strong)" }}></div>
            <div style={{ marginTop: 14, fontFamily: "var(--font-display)", fontWeight: 600 }}>{doc.t}</div>
            <div className="muted tiny" style={{ marginTop: 4 }}>{doc.d}</div>
            <button className="brut-btn brut-btn--ghost" style={{ width: "100%", justifyContent: "center", marginTop: 14, fontSize: 10.5 }}>
              View PDF <Icon name="arrow-up-r" size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
