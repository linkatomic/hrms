"use client";
import { useState, useEffect } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";

const Leave = ({ data, role }) => {
  const [tab, setTab] = useState("my");
  const [draft, setDraft] = useState({
    kind: "Paid Time Off",
    from: "2026-06-08",
    to: "2026-06-12",
    reason: "Family trip — Lisbon. Will be reachable for true emergencies via WhatsApp.",
  });

  useEffect(() => {
    gsap.from(".lv-card", { y: 16, opacity: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" });
  }, [tab]);

  const days = (() => {
    const a = new Date(draft.from), b = new Date(draft.to);
    return Math.max(1, Math.round((b - a) / 86400000) + 1);
  })();

  const myReq = data.leaves.requests;
  const teamReq = data.leaves.pending_for_manager;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <div className="t-eyebrow">TIME OFF · 2026 · BALANCE 27 / 40 DAYS</div>
        <button className="brut-btn brut-btn--primary" onClick={() => setTab("apply")}>
          <Icon name="plus" size={12} /> Apply for leave
        </button>
      </div>
      <h1 className="t-display page-title">Take the time.</h1>
      <div className="page-sub" style={{ marginBottom: 24, maxWidth: 580 }}>
        We track four leave types. Auto-approval kicks in for sick days ≤ 2 and any PTO requested 14+ days out.
      </div>

      {/* Balance cards */}
      <div className="grid stat-grid" style={{ marginBottom: 22 }}>
        {data.leaves.balances.map((b, i) => {
          const left = b.total - b.used;
          const pct = (b.used / b.total) * 100;
          return (
            <div key={i} className="stat lv-card">
              <div className="t-eyebrow">{b.kind}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
                <div className="t-num num">{left}</div>
                <div className="t-mono" style={{ color: "var(--text-mute)" }}>/ {b.total}d left</div>
              </div>
              <div className="bar" style={{ marginTop: 14 }}>
                <i style={{ width: pct + "%", background: b.color }}></i>
              </div>
              <div className="t-mono tiny" style={{ marginTop: 8, color: "var(--text-dim)" }}>
                {b.used} used · resets Jan 1
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1.5px solid var(--border)", marginBottom: 22 }}>
        {[
          { k: "my",    l: "My requests",     n: myReq.length },
          { k: "apply", l: "Apply for leave", n: null },
          ...(role === "manager" ? [{ k: "team", l: "Pending approvals", n: teamReq.length }] : []),
        ].map((t) => (
          <button key={t.k}
            onClick={() => setTab(t.k)}
            style={{
              padding: "12px 18px",
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
              textTransform: "uppercase", letterSpacing: "0.04em",
              color: tab === t.k ? "var(--text)" : "var(--text-dim)",
              borderBottom: tab === t.k ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1.5,
              display: "flex", alignItems: "center", gap: 8,
            }}>
            {t.l}
            {t.n != null && <span className="t-mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>{t.n}</span>}
          </button>
        ))}
      </div>

      {tab === "my" && (
        <div className="brut-card lv-card" style={{ overflow: "hidden" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>ID</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Approver</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {myReq.map((r) => (
                <tr key={r.id}>
                  <td className="t-mono" style={{ color: "var(--text-mute)" }}>{r.id}</td>
                  <td style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{r.kind}</td>
                  <td className="t-mono" style={{ fontSize: 12 }}>
                    {new Date(r.from).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {r.from !== r.to && " — " + new Date(r.to).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="t-mono">{r.days}d</td>
                  <td className="muted" style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason}</td>
                  <td>{r.approver}</td>
                  <td>
                    {r.status === "Approved" && <span className="pill good"><span className="dot"></span>Approved</span>}
                    {r.status === "Pending" && <span className="pill warn"><span className="dot"></span>Pending</span>}
                    {r.status === "Rejected" && <span className="pill bad"><span className="dot"></span>Rejected</span>}
                  </td>
                  <td><button className="brut-btn brut-btn--ghost" style={{ padding: "4px 8px" }}><Icon name="more" size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "apply" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 22 }}>
          <div className="brut-card lv-card" style={{ padding: 26 }}>
            <div className="t-eyebrow">Step 1 of 1 · Apply for leave</div>
            <h2 className="t-display" style={{ fontSize: 28, marginTop: 8, marginBottom: 18 }}>Tell us when.</h2>

            <div className="field" style={{ marginBottom: 16 }}>
              <label>Type</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {data.leaves.balances.map((b) => (
                  <button key={b.kind}
                    onClick={() => setDraft({ ...draft, kind: b.kind })}
                    className="brut-btn"
                    style={{
                      flexDirection: "column", alignItems: "flex-start", padding: 12, gap: 4,
                      borderColor: draft.kind === b.kind ? "var(--accent)" : "var(--border)",
                      boxShadow: draft.kind === b.kind ? "var(--shadow-brut-sm)" : "none",
                      transform: draft.kind === b.kind ? "translate(-2px,-2px)" : "none",
                    }}>
                    <span style={{ fontSize: 10.5 }}>{b.kind}</span>
                    <span className="t-mono" style={{ fontSize: 10, color: "var(--text-mute)" }}>
                      {b.total - b.used} LEFT
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div className="field">
                <label>From</label>
                <input type="date" className="input" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} />
              </div>
              <div className="field">
                <label>To</label>
                <input type="date" className="input" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 16 }}>
              <label>Reason (optional)</label>
              <textarea className="textarea" value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="brut-btn brut-btn--primary">
                Submit request <Icon name="arrow-r" size={12} />
              </button>
              <button className="brut-btn brut-btn--ghost" onClick={() => setTab("my")}>Cancel</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="brut-card brut-card--hard lv-card" style={{ padding: 22 }}>
              <div className="t-eyebrow">Preview</div>
              <div className="t-display" style={{ fontSize: 18, marginTop: 8 }}>
                {draft.kind} · <span style={{ color: "var(--accent)" }}>{days} day{days > 1 ? "s" : ""}</span>
              </div>
              <div className="t-mono" style={{ fontSize: 12, marginTop: 4, color: "var(--text-dim)" }}>
                {new Date(draft.from).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
                {draft.from !== draft.to && " → " + new Date(draft.to).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
              </div>
              <div className="rule">balance impact</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div className="t-eyebrow tiny">Before</div>
                  <div className="t-num" style={{ fontSize: 22 }}>13d</div>
                </div>
                <div style={{ alignSelf: "center", color: "var(--text-mute)" }}><Icon name="arrow-r" size={16} /></div>
                <div>
                  <div className="t-eyebrow tiny">After</div>
                  <div className="t-num" style={{ fontSize: 22, color: "var(--accent)" }}>{13 - days}d</div>
                </div>
              </div>
            </div>

            <div className="brut-card lv-card" style={{ padding: 22 }}>
              <div className="t-eyebrow">Approver</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
                <div className="av" style={{ width: 44, height: 44, fontSize: 14 }}>PI</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>Priya Iyer</div>
                  <div className="muted tiny">Creative Director · Typically replies in 4h</div>
                </div>
              </div>
              <div className="rule">conflicts</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="pill warn"><span className="dot"></span>Q3 KICKOFF</span>
                  <span className="muted tiny">Jun 10 overlaps with this request</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="pill"><span className="dot" style={{ background: "var(--good)" }}></span>SAFE</span>
                  <span className="muted tiny">No teammate is on leave during this window</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "team" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {teamReq.map((r) => (
            <div key={r.id} className="brut-card lv-card" style={{ padding: 20, display: "grid", gridTemplateColumns: "auto 1.2fr 1fr auto", gap: 20, alignItems: "center" }}>
              <div className="av" style={{ width: 44, height: 44, fontSize: 14 }}>{r.avatar}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{r.who}</div>
                <div className="muted tiny">{r.id} · filed via web</div>
                <div className="muted" style={{ marginTop: 6, fontSize: 12.5 }}>&quot;{r.reason}&quot;</div>
              </div>
              <div>
                <div className="t-eyebrow tiny">{r.kind} · {r.days}d</div>
                <div className="t-display" style={{ fontSize: 15, marginTop: 4 }}>
                  {new Date(r.from).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {r.from !== r.to && " — " + new Date(r.to).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="brut-btn brut-btn--ghost" title="Reject"><Icon name="x" size={14} /></button>
                <button className="brut-btn brut-btn--primary"><Icon name="check" size={14} /> Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leave;
