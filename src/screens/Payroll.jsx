import { useEffect } from "react";
import { gsap } from "gsap";
import Icon from "../components/Icon";

const Payroll = ({ data }) => {
  useEffect(() => {
    gsap.from(".pay-card", { y: 18, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
    const num = document.querySelector(".pay-big");
    if (num) {
      const tgt = parseFloat(num.dataset.val);
      const obj = { v: 0 };
      gsap.to(obj, { v: tgt, duration: 1.6, ease: "power2.out", onUpdate: () => {
        num.textContent = "$" + obj.v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }});
    }
  }, []);

  const p = data.payroll;
  const total = p.breakdown.reduce((s, b) => s + b.v, 0);

  return (
    <div>
      <div className="t-eyebrow">PAYROLL · MAY 2026 · NEXT PAY {new Date(p.next_pay).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
      <h1 className="t-display page-title">Your pay, in plain sight.</h1>
      <div className="page-sub" style={{ marginBottom: 24, maxWidth: 580 }}>
        Net of taxes, with every line itemized. Tap any row to drill into the calculation behind it.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22 }}>
        <div className="brut-card brut-card--hard pay-card" style={{ padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div className="t-eyebrow">Estimated net · May 2026</div>
              <div className="pay-big t-display" data-val={total.toFixed(2)} style={{ fontSize: 78, marginTop: 10, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--accent)" }}>
                $0.00
              </div>
              <div className="t-mono" style={{ fontSize: 11, marginTop: 8, color: "var(--text-dim)" }}>
                DEPOSITING SUN MAY 31 · BoA •••2841
              </div>
            </div>
            <span className="pill"><span className="dot" style={{ background: "var(--accent)" }}></span>FORECAST</span>
          </div>

          <div className="rule">breakdown</div>
          <table className="tbl" style={{ marginInline: -14 }}>
            <tbody>
              {p.breakdown.map((b, i) => (
                <tr key={i}>
                  <td style={{ width: "60%", color: b.neg ? "var(--text-dim)" : "var(--text)" }}>
                    {b.k}
                  </td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: b.neg ? "var(--bad)" : "var(--text)" }}>
                    {b.neg ? "" : "+"}${Math.abs(b.v).toFixed(2)}
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
            <div className="t-eyebrow">YTD · 2026</div>
            <div className="t-num" style={{ fontSize: 36, marginTop: 6 }}>${p.ytd_gross.toLocaleString("en-US", { minimumFractionDigits: 0 })}</div>
            <div className="muted tiny">Gross earned through May 2026</div>
            <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
              <div>
                <div className="t-eyebrow tiny">Taxes paid</div>
                <div className="t-num" style={{ fontSize: 18 }}>$6,810</div>
              </div>
              <div>
                <div className="t-eyebrow tiny">401(k)</div>
                <div className="t-num" style={{ fontSize: 18 }}>$2,050</div>
              </div>
            </div>
          </div>
          <div className="brut-card pay-card" style={{ padding: 22 }}>
            <div className="t-eyebrow">Bank on file</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
              <div style={{ width: 48, height: 32, background: "var(--text)", color: "var(--bg)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11 }}>BoA</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>Bank of America · Checking</div>
                <div className="t-mono tiny" style={{ color: "var(--text-mute)" }}>•••• •••• •••• 2841</div>
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
        <span className="meta">Last 4 months · PDF available</span>
      </div>
      <div className="brut-card pay-card" style={{ overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>Period</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Status</th><th></th></tr></thead>
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
