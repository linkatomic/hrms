"use client";
import { useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { supabase } from "../lib/supabase";
import Icon from "../components/Icon";

const TYPE_LABEL  = { annual: "Annual Leave", sick: "Sick Leave", wfh: "WFH", comp_off: "Comp Off" };
const LABEL_TYPE  = { "Annual Leave": "annual", "Sick Leave": "sick", "WFH": "wfh", "Comp Off": "comp_off" };
const TYPE_COLOR  = { annual: "var(--accent)", sick: "var(--good)", wfh: "var(--info)", comp_off: "var(--warn)" };
const STATUS_CAP  = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const DEFAULT_BALANCES = [
  { kind: "Annual Leave", used: 0, total: 18, color: "var(--accent)" },
  { kind: "Sick Leave",   used: 0, total: 10, color: "var(--good)" },
  { kind: "WFH",          used: 0, total: 24, color: "var(--info)" },
  { kind: "Comp Off",     used: 0, total: 0,  color: "var(--warn)" },
];

const Leave = ({ data, role }) => {
  const [tab, setTab] = useState("my");
  const [draft, setDraft] = useState({ kind: "Annual Leave", from: "", to: "", reason: "" });
  const [requests, setRequests]   = useState([]);
  const [balances, setBalances]   = useState(DEFAULT_BALANCES);
  const [pending, setPending]     = useState([]);
  const [saving, setSaving]       = useState(false);
  const [userId, setUserId]       = useState(null);

  // Set default dates to next week
  useEffect(() => {
    const next = new Date(); next.setDate(next.getDate() + 7);
    const end  = new Date(); end.setDate(end.getDate() + 8);
    const fmt  = d => d.toISOString().slice(0, 10);
    setDraft(d => ({ ...d, from: fmt(next), to: fmt(end) }));
  }, []);

  const fetchAll = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    const year = new Date().getFullYear();

    const [reqRes, balRes, pendRes] = await Promise.all([
      supabase.from("leave_requests").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }),
      supabase.from("leave_balances").select("*").eq("profile_id", user.id).eq("year", year).single(),
      role === "manager"
        ? supabase.from("leave_requests").select("*, profiles(name, avatar)").eq("status", "pending").neq("profile_id", user.id).order("created_at", { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);

    if (reqRes.data) setRequests(reqRes.data);
    if (balRes.data) {
      const b = balRes.data;
      setBalances([
        { kind: "Annual Leave", used: b.annual_used,   total: b.annual_total,   color: "var(--accent)" },
        { kind: "Sick Leave",   used: b.sick_used,     total: b.sick_total,     color: "var(--good)" },
        { kind: "WFH",          used: b.wfh_used,      total: b.wfh_total,      color: "var(--info)" },
        { kind: "Comp Off",     used: b.comp_off_used, total: b.comp_off_total, color: "var(--warn)" },
      ]);
    }
    if (pendRes.data) setPending(pendRes.data);
  }, [role]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    gsap.from(".lv-card", { y: 16, opacity: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" });
  }, [tab]);

  const days = (() => {
    if (!draft.from || !draft.to) return 1;
    const a = new Date(draft.from), b = new Date(draft.to);
    return Math.max(1, Math.round((b - a) / 86400000) + 1);
  })();

  const selectedBalance = balances.find(b => b.kind === draft.kind) || balances[0];

  const handleSubmit = async () => {
    if (!userId || !draft.from || !draft.to) return;
    setSaving(true);
    const { error } = await supabase.from("leave_requests").insert({
      profile_id: userId,
      type:       LABEL_TYPE[draft.kind] || "annual",
      start_date: draft.from,
      end_date:   draft.to,
      days,
      reason:     draft.reason,
      status:     "pending",
    });
    setSaving(false);
    if (!error) { await fetchAll(); setTab("my"); }
  };

  const handleApprove = async (id, action) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("leave_requests").update({
      status:      action,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    }).eq("id", id);
    await fetchAll();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
        <div className="t-eyebrow">TIME OFF · {new Date().getFullYear()} · BALANCE {balances.reduce((s,b) => s + b.total - b.used, 0)} / {balances.reduce((s,b) => s + b.total, 0)} DAYS</div>
        <button className="brut-btn brut-btn--primary" onClick={() => setTab("apply")}>
          <Icon name="plus" size={12} /> Apply for leave
        </button>
      </div>
      <h1 className="t-display page-title">Take the time.</h1>
      <div className="page-sub" style={{ marginBottom: 24, maxWidth: 580 }}>
        We track four leave types. Auto-approval kicks in for sick days ≤ 2 and any leave requested 14+ days out.
      </div>

      {/* Balance cards */}
      <div className="grid stat-grid" style={{ marginBottom: 22 }}>
        {balances.map((b, i) => {
          const left = b.total - b.used;
          const pct  = b.total > 0 ? (b.used / b.total) * 100 : 0;
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
          { k: "my",    l: "My requests",     n: requests.length },
          { k: "apply", l: "Apply for leave", n: null },
          ...(role === "manager" ? [{ k: "team", l: "Pending approvals", n: pending.length }] : []),
        ].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{
            padding: "12px 18px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13,
            textTransform: "uppercase", letterSpacing: "0.04em",
            color: tab === t.k ? "var(--text)" : "var(--text-dim)",
            borderBottom: tab === t.k ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -1.5, display: "flex", alignItems: "center", gap: 8,
          }}>
            {t.l}
            {t.n != null && <span className="t-mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>{t.n}</span>}
          </button>
        ))}
      </div>

      {tab === "my" && (
        <div className="brut-card lv-card" style={{ overflow: "hidden" }}>
          {requests.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-mute)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              No leave requests yet.
            </div>
          ) : (
            <table className="tbl">
              <thead>
                <tr><th>ID</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th></tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className="t-mono" style={{ color: "var(--text-mute)", fontSize: 11 }}>{r.id.slice(0, 8).toUpperCase()}</td>
                    <td style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{TYPE_LABEL[r.type]}</td>
                    <td className="t-mono" style={{ fontSize: 12 }}>
                      {new Date(r.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {r.start_date !== r.end_date && " — " + new Date(r.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="t-mono">{r.days}d</td>
                    <td className="muted" style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason}</td>
                    <td>
                      {r.status === "approved" && <span className="pill good"><span className="dot"></span>Approved</span>}
                      {r.status === "pending"  && <span className="pill warn"><span className="dot"></span>Pending</span>}
                      {r.status === "rejected" && <span className="pill bad"><span className="dot"></span>Rejected</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
                {balances.map((b) => (
                  <button key={b.kind} onClick={() => setDraft({ ...draft, kind: b.kind })} className="brut-btn"
                    style={{
                      flexDirection: "column", alignItems: "flex-start", padding: 12, gap: 4,
                      borderColor: draft.kind === b.kind ? "var(--accent)" : "var(--border)",
                      boxShadow: draft.kind === b.kind ? "var(--shadow-brut-sm)" : "none",
                      transform: draft.kind === b.kind ? "translate(-2px,-2px)" : "none",
                    }}>
                    <span style={{ fontSize: 10.5 }}>{b.kind}</span>
                    <span className="t-mono" style={{ fontSize: 10, color: "var(--text-mute)" }}>{b.total - b.used} LEFT</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div className="field">
                <label>From</label>
                <input type="date" className="input" value={draft.from} onChange={e => setDraft({ ...draft, from: e.target.value })} />
              </div>
              <div className="field">
                <label>To</label>
                <input type="date" className="input" value={draft.to} onChange={e => setDraft({ ...draft, to: e.target.value })} />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 16 }}>
              <label>Reason (optional)</label>
              <textarea className="textarea" value={draft.reason} onChange={e => setDraft({ ...draft, reason: e.target.value })} />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="brut-btn brut-btn--primary" onClick={handleSubmit} disabled={saving}>
                {saving ? "Submitting…" : <><Icon name="arrow-r" size={12} /> Submit request</>}
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
              {draft.from && (
                <div className="t-mono" style={{ fontSize: 12, marginTop: 4, color: "var(--text-dim)" }}>
                  {new Date(draft.from).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
                  {draft.from !== draft.to && " → " + new Date(draft.to).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
                </div>
              )}
              <div className="rule">balance impact</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div className="t-eyebrow tiny">Before</div><div className="t-num" style={{ fontSize: 22 }}>{selectedBalance.total - selectedBalance.used}d</div></div>
                <div style={{ alignSelf: "center", color: "var(--text-mute)" }}><Icon name="arrow-r" size={16} /></div>
                <div><div className="t-eyebrow tiny">After</div><div className="t-num" style={{ fontSize: 22, color: "var(--accent)" }}>{Math.max(0, selectedBalance.total - selectedBalance.used - days)}d</div></div>
              </div>
            </div>

            <div className="brut-card lv-card" style={{ padding: 22 }}>
              <div className="t-eyebrow">Approver</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
                <div className="av" style={{ width: 44, height: 44, fontSize: 14 }}>{data.me.manager?.slice(0, 2).toUpperCase() || "TL"}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>{data.me.manager || "Team Lead"}</div>
                  <div className="muted tiny">Typically replies within 24h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "team" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {pending.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-mute)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              No pending approvals.
            </div>
          )}
          {pending.map((r) => (
            <div key={r.id} className="brut-card lv-card" style={{ padding: 20, display: "grid", gridTemplateColumns: "auto 1.2fr 1fr auto", gap: 20, alignItems: "center" }}>
              <div className="av" style={{ width: 44, height: 44, fontSize: 14 }}>{r.profiles?.avatar || "??"}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{r.profiles?.name || "Employee"}</div>
                <div className="muted tiny">{r.id.slice(0, 8).toUpperCase()} · filed {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                {r.reason && <div className="muted" style={{ marginTop: 6, fontSize: 12.5 }}>&quot;{r.reason}&quot;</div>}
              </div>
              <div>
                <div className="t-eyebrow tiny">{TYPE_LABEL[r.type]} · {r.days}d</div>
                <div className="t-display" style={{ fontSize: 15, marginTop: 4 }}>
                  {new Date(r.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  {r.start_date !== r.end_date && " — " + new Date(r.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="brut-btn brut-btn--ghost" title="Reject" onClick={() => handleApprove(r.id, "rejected")}><Icon name="x" size={14} /></button>
                <button className="brut-btn brut-btn--primary" onClick={() => handleApprove(r.id, "approved")}><Icon name="check" size={14} /> Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leave;
