// Main app — orchestration, lenis smooth scroll, route transitions
const { useState: useState_app, useEffect: useEffect_app, useRef: useRef_app } = React;

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "motionIntensity": 8
}/*EDITMODE-END*/;

const App = () => {
  const [route, setRoute] = useState_app("dashboard");
  const [role, setRole] = useState_app("employee"); // employee | manager
  const [clock, setClock] = useState_app({
    in: Date.now() - 5.47 * 3600 * 1000,
    out: null,
    elapsed: 5.47 * 3600,
    breakTotal: 0,
    onBreak: false,
    breakStart: null,
    breaks: [],
  });

  // Lenis smooth scroll
  const lenisRef = useRef_app(null);
  useEffect_app(() => {
    if (!window.Lenis) return;
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

  // tweaks
  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);

  useEffect_app(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
  }, [tweaks.theme]);

  // Route transition
  const mainRef = useRef_app(null);
  useEffect_app(() => {
    if (!window.gsap || !mainRef.current) return;
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    gsap.fromTo(mainRef.current.querySelector(".route-pane"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, [route, role]);

  // Keyboard shortcuts
  useEffect_app(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); /* open search */ }
      const map = { "1": "dashboard", "2": "checkin", "3": "calendar", "4": "leave", "5": "celebrations", "6": "directory", "7": "payroll", "8": "notifications", "9": "profile" };
      if (e.altKey && map[e.key]) setRoute(map[e.key]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const data = window.DATA;

  // Topbar
  const Topbar = () => {
    const titles = {
      dashboard: "Dashboard", checkin: "Check-in", calendar: "Calendar", leave: "Leave",
      celebrations: "Celebrations", directory: "Directory", payroll: "Payroll",
      notifications: "Notifications", profile: "Profile",
    };
    return (
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="t-mono tiny" style={{ color: "var(--text-mute)" }}>HRMS</span>
          <span style={{ color: "var(--text-mute)" }}>/</span>
          <span className="t-mono tiny" style={{ color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{titles[route]}</span>
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
            onClick={() => setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")}
            style={{ padding: "10px 12px" }}
            title="Toggle theme"
          >
            <Icon name={tweaks.theme === "dark" ? "sun" : "moon"} size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} me={data.me} role={role} setRole={setRole} />
      <main className="main" ref={mainRef} data-screen-label={route}>
        <Topbar />
        <div className="route-pane" key={route + role}>
          {route === "dashboard" && <Dashboard data={data} role={role} setRoute={setRoute} clock={clock} />}
          {route === "checkin" && <Checkin data={data} clock={clock} setClock={setClock} />}
          {route === "calendar" && <Calendar data={data} />}
          {route === "leave" && <Leave data={data} role={role} />}
          {route === "celebrations" && <Celebrations data={data} />}
          {route === "directory" && <Directory data={data} />}
          {route === "payroll" && <Payroll data={data} />}
          {route === "notifications" && <Notifications data={data} setRoute={setRoute} />}
          {route === "profile" && <Profile data={data} role={role} />}
        </div>
      </main>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Appearance" />
        <TweakRadio
          label="Theme"
          value={tweaks.theme}
          onChange={(v) => setTweak("theme", v)}
          options={["dark", "light"]}
        />
        <TweakSection label="View" />
        <TweakRadio
          label="Role"
          value={role}
          onChange={(v) => setRole(v)}
          options={["employee", "manager"]}
        />
        <TweakSection label="Quick nav" />
        <TweakSelect
          label="Go to"
          value={route}
          onChange={(v) => setRoute(v)}
          options={["dashboard","checkin","calendar","leave","celebrations","directory","payroll","notifications","profile"]}
        />
      </TweaksPanel>
    </div>
  );
};

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
