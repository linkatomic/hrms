"use client";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import Lenis from "lenis";
import { AppProvider, useApp } from "@/src/contexts/AppContext";
import Sidebar from "@/src/components/Sidebar";
import Icon from "@/src/components/Icon";
import ThemePicker from "@/src/components/ThemePicker";
import { supabase } from "@/src/lib/supabase";

const ROUTE_TITLES = {
  dashboard: "Dashboard", checkin: "Check-in", calendar: "Calendar", leave: "Leave",
  celebrations: "Celebrations", directory: "Directory", payroll: "Payroll",
  notifications: "Notifications", profile: "Profile",
};

function AppShell({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, setUser, role, setRole, theme, setTheme, data, ready } = useApp();
  const lenisRef = useRef(null);
  const mainRef  = useRef(null);

  // Hide boot splash as soon as React has mounted — no auth dependency
  useEffect(() => {
    const boot = document.getElementById("boot");
    if (boot) {
      boot.style.transition = "opacity 0.4s ease";
      boot.style.opacity = "0";
      boot.style.pointerEvents = "none";
      setTimeout(() => { if (boot) boot.style.display = "none"; }, 400);
    }
  }, []);

  // Auth guard — runs once ready is resolved
  useEffect(() => {
    if (!ready || user) return;
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!session) router.replace("/login");
      })
      .catch(() => router.replace("/login"));
  }, [ready, user]);

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

  // Route transition animation
  useEffect(() => {
    if (!mainRef.current) return;
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    const pane = mainRef.current.querySelector(".route-pane");
    if (pane) gsap.fromTo(pane, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
  }, [pathname]);

  // Keyboard shortcuts: Alt+1…9
  useEffect(() => {
    const routes = ["dashboard", "checkin", "calendar", "leave", "celebrations", "directory", "payroll", "notifications", "profile"];
    const handler = (e) => {
      if (e.altKey && e.key >= "1" && e.key <= "9") {
        const r = routes[parseInt(e.key) - 1];
        if (r) router.push("/" + r);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  // Don't render the shell until auth state is resolved
  if (!ready || !user) return null;

  const routeKey = pathname.replace(/^\//, "") || "dashboard";
  const me = { ...data.me, role: user.role };

  return (
    <div className="app">
      <Sidebar
        route={routeKey}
        setRoute={(r) => router.push("/" + r)}
        me={me}
        role={role}
        setRole={user.role === "manager" ? setRole : undefined}
        onLogout={handleLogout}
      />
      <main className="main" ref={mainRef}>
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="t-mono tiny" style={{ color: "var(--text-mute)" }}>HRMS</span>
            <span style={{ color: "var(--text-mute)" }}>/</span>
            <span className="t-mono tiny" style={{ color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {ROUTE_TITLES[routeKey] ?? routeKey}
            </span>
            <span className="pill" style={{ marginLeft: 10 }}>
              <span className="dot" style={{ background: "var(--accent)" }}></span>
              {role.toUpperCase()} VIEW
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="search">
              <Icon name="search" size={13} />
              <input placeholder="Jump to anything…" />
              <span className="kbd">⌘K</span>
            </div>
            <button
              className="brut-btn brut-btn--ghost"
              onClick={() => router.push("/notifications")}
              style={{ position: "relative", padding: "10px 12px" }}
            >
              <Icon name="bell" size={14} />
              <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: "var(--accent)", borderRadius: "50%" }}></span>
            </button>
            <ThemePicker theme={theme} setTheme={setTheme} />
          </div>
        </div>

        <div className="route-pane" key={pathname + role}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AppLayout({ children }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
