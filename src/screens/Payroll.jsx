"use client";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";
import { supabase } from "../lib/supabase";
import { useApp } from "../contexts/AppContext";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function buildPayroll(rows, currentYear) {
  if (!rows || rows.length === 0) return null;
  const sorted  = [...rows].sort((a, b) => b.year - a.year || b.month - a.month);
  const latest  = sorted[0];

  const breakdown = [
    { k: "Base Salary",         v: latest.base_salary         || 0, neg: false },
    { k: "HRA",                 v: latest.hra                 || 0, neg: false },
    { k: "Transport Allowance", v: latest.transport           || 0, neg: false },
    { k: "Performance Bonus",   v: latest.performance_bonus   || 0, neg: false },
    { k: "Tax Deduction",       v: -(latest.tax_deduction     || 0), neg: true  },
    { k: "PF Deduction",        v: -(latest.pf_deduction      || 0), neg: true  },
  ];

  const ytdRows  = rows.filter(r => r.year === currentYear);
  const ytd_gross = ytdRows.reduce((s, r) => s + (r.gross || 0), 0);
  const tax_ytd   = ytdRows.reduce((s, r) => s + (r.tax_deduction || 0), 0);
  const pf_ytd    = ytdRows.reduce((s, r) => s + (r.pf_deduction  || 0), 0);

  const now     = new Date();
  const nextPay = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of current month

  const last = sorted.slice(0, 4).map(r => ({
    period:     MONTHS[r.month - 1] + " " + r.year,
    gross:      r.gross       || 0,
    deductions: (r.tax_deduction || 0) + (r.pf_deduction || 0),
    net:        r.net_salary  || 0,
    status:     r.status      || "paid",
  }));

  return { next_pay: nextPay.toISOString(), ytd_gross, tax_ytd, pf_ytd, last, breakdown };
}

const Payroll = ({ data }) => {
  const { user }        = useApp();
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("payroll")
      .select("*")
      .eq("profile_id", user.id)
      .then(({ data: rows }) => {
        setPayroll(buildPayroll(rows, new Date().getFullYear()));
        setLoading(false);
      });
  }, [user?.id]);

  useEffect(() => {
    if (loading || !payroll) return;
    gsap.from(".pay-card", { y: 18, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
    const num = document.querySelector(".pay-big");
    if (num) {
      const tgt = parseFloat(num.dataset.val);
      const obj = { v: 0 };
      gsap.to(obj, { v: tgt, duration: 1.6, ease: "power2.out", onUpdate: () => {
        num.textContent = "$" + obj.v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }});
    }
  }, [loading]);

  const now = new Date();
  const currentPeriod = MONTHS[now.getMonth()] + " " + now.getFullYear();

  if (loading) {
    return (
      <div>
        <div className="t-eyebrow">PAYROLL</div>
        <h1 className="t-display page-title">Your pay, in plain sight.</h1>
        <div className="muted" style={{ marginTop: 32 }}>Loading payroll data…</div>
      </div>
    );
  }

  if (!payroll || payroll.last.length === 0) {
    return (
      <div>
        <div className="t-eyebrow">PAYROLL · {currentPeriod.toUpperCase()}</div>
        <h1 className="t-display page-title">Your pay, in plain sight.</h1>
        <div className="brut-card" style={{ padding: 32, marginTop: 24 }}>
          <div className="muted" style={{ textAlign: "center" }}>No payroll records found. Contact your HR manager.</div>
        </div>
      </div>
    );
  }

  const p     = payroll;
  const total = p.breakdown.reduce((s, b) => s + b.v, 0);

  return (
    <div>
      <div className="t-eyebrow">
        PAYROLL · {currentPeriod.toUpperCase()} · NEXT PAY {new Date(p.next_pay).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </div>
      <h1 className="t-display page-title">Your pay, in plain sight.</h1>
      <div className="page-sub" style={{ marginBottom: 24, maxWidth: 580 }}>
        Net of taxes, with every line itemized. Tap any row to drill into the calculation behind it.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22 }}>
        <div className="brut-card brut-card--hard pay-card" style={{ padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div className="t-eyebrow">Net · {p.last[0]?.period}</div>
              <div
                className="pay-big t-display"
                data-val={total.toFixed(2)}
                style={{ fontSize: 78, marginTop: 10, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--accent)" }}
              >
                $0.00
              </div>
              <div className="t-mono" style={{ fontSize: 11, marginTop: 8, color: "var(--text-dim)" }}>
                DEPOSITING {new Date(p.next_pay).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase()}
              </div>
            </div>
            <span className="pill"><span className="dot" style={{ background: "var(--accent)" }}></span>LATEST</span>
          </div>

          <div className="rule">breakdown</div>
          <table className="tbl" style={{ marginInline: -14 }}>
            <tbody>
              {p.breakdown.map((b, i) => (
                <tr key={i}>
                  <td style={{ width: "60%", color: b.neg ? "var(--text-dim)" : "var(--text)" }}>{b.k}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: b.neg ? "var(--bad)" : "var(--text)" }}>
                    {b.neg ? "−" : "+"}${Math.abs(b.v).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr style={{ background: "var(--bg-elev-2)" }}>
                <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: 12, letterSpacing: "0.04em" }}>Net deposit</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--accent)" }}>${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="brut-card pay-card" style={{ padding: 22 }}>
            <div className="t-eyebrow">YTD · {now.getFullYear()}</div>
            <div className="t-num" style={{ fontSize: 36, marginTop: 6 }}>
              ${p.ytd_gross.toLocaleString("en-US", { minimumFractionDigits: 0 })}
            </div>
            <div className="muted tiny">Gross earned through {MONTHS[now.getMonth()]} {now.getFullYear()}</div>
            <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
              <div>
                <div className="t-eyebrow tiny">Taxes paid</div>
                <div className="t-num" style={{ fontSize: 18 }}>${(p.tax_ytd || 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}</div>
              </div>
              <div>
                <div className="t-eyebrow tiny">PF contributed</div>
                <div className="t-num" style={{ fontSize: 18 }}>${(p.pf_ytd || 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}</div>
              </div>
            </div>
          </div>
          <div className="brut-card pay-card" style={{ padding: 22 }}>
            <div className="t-eyebrow">Bank on file</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
              <div style={{ width: 48, height: 32, background: "var(--text)", color: "var(--bg)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11 }}>BANK</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Direct deposit configured</div>
                <div className="t-mono tiny" style={{ color: "var(--text-mute)" }}>Contact HR to update details</div>
              </div>
            </div>
            <button className="brut-btn brut-btn--ghost" style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
              Change account <Icon name="arrow-r" size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="sec-head">
        <h2>Payslips</h2>
        <span className="meta">Last {p.last.length} months · PDF available</span>
      </div>
      <div className="brut-card pay-card" style={{ overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr><th>Period</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {p.last.map((row, i) => (
              <tr key={i}>
                <td style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{row.period}</td>
                <td className="t-mono">${row.gross.toFixed(2)}</td>
                <td className="t-mono" style={{ color: "var(--bad)" }}>−${row.deductions.toFixed(2)}</td>
                <td className="t-mono" style={{ color: "var(--accent)", fontWeight: 700 }}>${row.net.toFixed(2)}</td>
                <td><span className="pill good"><span className="dot"></span>{row.status}</span></td>
                <td><button className="brut-btn brut-btn--ghost" style={{ padding: "4px 10px" }}>PDF <Icon name="arrow-up-r" size={11} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;
