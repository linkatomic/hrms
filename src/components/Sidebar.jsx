import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Icon from "./Icon";
import { logout } from "../auth";

const NAV = [
  { group: "Workspace", items: [
    { key: "dashboard",    label: "Dashboard",    icon: "home" },
    { key: "checkin",      label: "Check-in",     icon: "clock",  liveBadge: true },
    { key: "calendar",     label: "Calendar",     icon: "calendar" },
  ]},
  { group: "Time", items: [
    { key: "leave",        label: "Leave",        icon: "leaf",   badge: "2" },
    { key: "celebrations", label: "Celebrations", icon: "cake",   badge: "3" },
  ]},
  { group: "People", items: [
    { key: "directory",    label: "Directory",    icon: "users" },
    { key: "payroll",      label: "Payroll",      icon: "money" },
  ]},
  { group: "You", items: [
    { key: "notifications",label: "Notifications",icon: "bell",   badge: "3" },
    { key: "profile",      label: "Profile",      icon: "user" },
  ]},
];

const Sidebar = ({ route, setRoute, me, role, setRole, onLogout }) => {
  const navRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;
    const items = navRef.current.querySelectorAll(".side-item");
    gsap.from(items, {
      x: -16, opacity: 0, duration: 0.45, stagger: 0.025, ease: "power3.out",
    });
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <aside className="sidebar">
      <div className="side-brand">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="mark">A</div>
          <div style={{ minWidth: 0 }}>
            <div className="t-display" style={{ fontSize: 15, letterSpacing: "-0.01em" }}>AMRYTT</div>
            <div className="t-eyebrow" style={{ fontSize: 9.5, marginTop: 2 }}>Media LLC · HRMS</div>
          </div>
        </div>

        {/* Role pill — manager only can toggle; employees see read-only */}
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {me.role === "manager" ? (
            <button
              className="brut-btn"
              onClick={() => setRole(role === "employee" ? "manager" : "employee")}
              style={{
                flex: 1, padding: "6px 10px", fontSize: 10.5,
                background: "var(--bg-elev)",
                borderColor: role === "manager" ? "var(--accent)" : "var(--border)",
              }}
              title="Toggle view"
            >
              <span className="t-mono" style={{ color: "var(--text-mute)", marginRight: 6 }}>VIEW</span>
              <span>{role === "manager" ? "MANAGER" : "EMPLOYEE"}</span>
              <Icon name="arrow-r" size={11} />
            </button>
          ) : (
            <div style={{
              flex: 1, padding: "6px 10px", fontSize: 10.5,
              background: "var(--bg-elev)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--r-sm)",
              fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.02em",
              color: "var(--text-dim)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span className="t-mono" style={{ color: "var(--text-mute)" }}>VIEW</span>
              <span>EMPLOYEE</span>
            </div>
          )}
        </div>
      </div>

      <div className="side-nav" ref={navRef}>
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="side-nav-group">{g.group}</div>
            {g.items.map((it) => (
              <div
                key={it.key}
                className={"side-item " + (route === it.key ? "is-active" : "")}
                onClick={() => setRoute(it.key)}
              >
                <Icon name={it.icon} size={16} />
                <span>{it.label}</span>
                {it.liveBadge && (
                  <span className="pill live" style={{ marginLeft: "auto", padding: "1px 7px", fontSize: 9.5 }}>
                    LIVE
                  </span>
                )}
                {it.badge && <span className="badge">{it.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="side-foot">
        <div className="side-user">
          <div className="avatar">{me.avatar}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {me.name}
            </div>
            <div className="t-mono" style={{ fontSize: 10, color: "var(--text-mute)" }}>
              {me.employeeId} · {me.role === "manager" ? "Team Lead" : "Member"}
            </div>
          </div>
          <button
            title="Sign out"
            onClick={handleLogout}
            style={{ color: "var(--text-dim)", padding: 4 }}
          >
            <Icon name="logout" size={14} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-mute)" }}>
          <span>v1.4.2</span>
          <span style={{ marginLeft: "auto" }}>IN · {me.role === "manager" ? "L4" : "L3"}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
