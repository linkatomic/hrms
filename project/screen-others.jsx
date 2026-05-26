// Celebrations · Directory · Profile · Notifications · Payroll
const { useState: useState_s, useEffect: useEffect_s, useMemo: useMemo_s } = React;

// ========= CELEBRATIONS =========
const Celebrations = ({ data }) => {
  useEffect_s(() => {
    if (!window.gsap) return;
    gsap.from(".cel-card", { y: 18, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
  }, []);

  const today = new Date("2026-05-26");
  const upcoming = data.celebrations;
  const next = upcoming[0];

  return (
    <div data-screen-label="05 Celebrations">
      <div className="t-eyebrow">CELEBRATIONS · NEXT 30 DAYS</div>
      <h1 className="t-display page-title">Don't miss it.</h1>
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
            <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>{next.role} · Joined Brand & Creative</div>
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

// ========= DIRECTORY =========
const Directory = ({ data }) => {
  const [q, setQ] = useState_s("");
  const [dept, setDept] = useState_s("All");

  const depts = ["All", ...Array.from(new Set(data.team.map(t => t.dept)))];
  const filtered = data.team.filter(t =>
    (dept === "All" || t.dept === dept) &&
    (t.name.toLowerCase().includes(q.toLowerCase()) || t.role.toLowerCase().includes(q.toLowerCase()))
  );

  useEffect_s(() => {
    if (!window.gsap) return;
    gsap.from(".dir-card", { y: 12, opacity: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" });
  }, [dept, q]);

  return (
    <div data-screen-label="06 Directory">
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

// ========= NOTIFICATIONS =========
const Notifications = ({ data, setRoute }) => {
  const [filter, setFilter] = useState_s("All");
  const kinds = ["All", "Unread", "Leave", "Celeb", "Payroll", "Mention"];

  useEffect_s(() => {
    if (!window.gsap) return;
    gsap.from(".n-card", { x: -10, opacity: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" });
  }, [filter]);

  const list = data.notifications.filter(n =>
    filter === "All" ? true :
    filter === "Unread" ? n.unread :
    n.kind === filter.toLowerCase()
  );

  const iconForKind = { leave: "leaf", celeb: "cake", payroll: "money", mention: "user", policy: "check", checkin: "clock" };

  return (
    <div data-screen-label="08 Notifications">
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

// ========= PAYROLL =========
const Payroll = ({ data }) => {
  useEffect_s(() => {
    if (!window.gsap) return;
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
    <div data-screen-label="07 Payroll">
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

// ========= PROFILE =========
const Profile = ({ data, role }) => {
  useEffect_s(() => {
    if (!window.gsap) return;
    gsap.from(".pf-card", { y: 18, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
  }, []);
  const me = data.me;
  return (
    <div data-screen-label="09 Profile">
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
          { t: "Offer letter",       d: "Mar 2023 · 3 pp"  },
          { t: "Employment contract",d: "Mar 2023 · 11 pp" },
          { t: "NDA",                d: "Mar 2023 · 2 pp"  },
          { t: "2025 W-2",           d: "Jan 2026 · 1 pp"  },
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

Object.assign(window, { Celebrations, Directory, Notifications, Payroll, Profile });
