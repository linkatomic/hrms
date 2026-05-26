import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";

import DATA from "./data";
import Sidebar from "./components/Sidebar";
import Icon from "./components/Icon";
import Dashboard from "./screens/Dashboard";
import Checkin from "./screens/Checkin";
import Calendar from "./screens/Calendar";
import Leave from "./screens/Leave";
import Celebrations from "./screens/Celebrations";
import Directory from "./screens/Directory";
import Payroll from "./screens/Payroll";
import Notifications from "./screens/Notifications";
import Profile from "./screens/Profile";

const ROUTE_TITLES = {
  dashboard: "Dashboard", checkin: "Check-in", calendar: "Calendar", leave: "Leave",
  celebrations: "Celebrations", directory: "Directory", payroll: "Payroll",
  notifications: "Notifications", profile: "Profile",
};

const App = () => {
  const [route, setRoute] = useState("dashboard");
  const [role, setRole] = useState("employee");
  const [theme, setTheme] = useState("dark");
  const [clock, setClock] = useState({
    in: Date.now() - 5.47 * 3600 * 1000,
    out: null,
    elapsed: 5.47 * 3600,
    breakTotal: 0,
    onBreak: false,
    breakStart: null,
    breaks: [],
  });

  const lenisRef = useRef(null);
  const mainRef = useRef(null);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Theme sync
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Route transition animation
  useEffect(() => {
    if (!mainRef.current) return;
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    const pane = mainRef.current.querySelector(".route-pane");
    if (pane) gsap.fromTo(pane, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, [route, role]);

  // Keyboard shortcuts: Alt+1…9
  useEffect(() => {
    const map = { "1": "dashboard", "2": "checkin", "3": "calendar", "4": "leave", "5": "celebrations", "6": "directory", "7": "payroll", "8": "notifications", "9": "profile" };
    const handler = (e) => {
      if (e.altKey && map[e.key]) setRoute(map[e.key]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const Topbar = () => (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="t-mono tiny" style={{ color: "var(--text-mute)" }}>HRMS</span>
        <span style={{ color: "var(--text-mute)" }}>/</span>
        <span className="t-mono tiny" style={{ color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{ROUTE_TITLES[route]}</span>
        <span className="pill" style={{ marginLeft: 10 }}><span className="dot" style={{ background: "var(--accent)" }}></span>{role.toUpperCase()} VIEW</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="search">
          <Icon name="search" size={13} />
          <input placeholder="Jump to anything…" />
          <span className="kbd">⌘K</span>
        </div>
        <button className="brut-btn brut-btn--ghost" onClick={() => setRoute("notifications")} style={{ position: "relative", padding: "10px 12px" }}>
          <Icon name="bell" size={14} />
          <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: "var(--accent)", borderRadius: "50%" }}></span>
        </button>
        <button
          className="brut-btn brut-btn--ghost"
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          style={{ padding: "10px 12px" }}
          title="Toggle theme"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} me={DATA.me} role={role} setRole={setRole} />
      <main className="main" ref={mainRef}>
        <Topbar />
        <div className="route-pane" key={route + role}>
          {route === "dashboard"     && <Dashboard     data={DATA} role={role} setRoute={setRoute} clock={clock} />}
          {route === "checkin"       && <Checkin        data={DATA} clock={clock} setClock={setClock} />}
          {route === "calendar"      && <Calendar       data={DATA} />}
          {route === "leave"         && <Leave          data={DATA} role={role} />}
          {route === "celebrations"  && <Celebrations   data={DATA} />}
          {route === "directory"     && <Directory      data={DATA} />}
          {route === "payroll"       && <Payroll        data={DATA} />}
          {route === "notifications" && <Notifications  data={DATA} setRoute={setRoute} />}
          {route === "profile"       && <Profile        data={DATA} role={role} />}
        </div>
      </main>
    </div>
  );
};

export default App;
