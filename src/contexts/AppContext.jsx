"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "@/src/auth";
import BASE_DATA from "@/src/data";
import { THEMES } from "@/src/components/ThemePicker";

function buildData(user) {
  if (!user) return BASE_DATA;
  return {
    ...BASE_DATA,
    me: {
      name:       user.name,
      role:       user.title,
      team:       user.team,
      avatar:     user.avatar,
      employeeId: user.employeeId,
      joined:     user.joined,
      manager:    user.manager,
      email:      user.email,
      phone:      user.phone,
      location:   user.location,
      pronouns:   user.pronouns,
    },
  };
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // All initial values are static (no localStorage) so server + client match
  const [user, setUser]   = useState(null);
  const [role, setRole]   = useState("employee");
  const [theme, setTheme] = useState("dark");
  const [ready, setReady] = useState(false);
  const [clock, setClock] = useState({
    in:         Date.now() - 5.47 * 3600 * 1000,
    out:        null,
    elapsed:    5.47 * 3600,
    breakTotal: 0,
    onBreak:    false,
    breakStart: null,
    breaks:     [],
  });

  // Read localStorage only on client after mount
  useEffect(() => {
    const session = getSession();
    setUser(session);
    setRole(session?.role ?? "employee");
    try {
      const saved = localStorage.getItem("amrytt_hrms_theme");
      if (saved) setTheme(saved);
    } catch {}
    setReady(true);
  }, []);

  // Sync theme to document
  useEffect(() => {
    const themeObj = THEMES.find(t => t.key === theme) ?? THEMES[0];
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-type", themeObj.type);
    try { localStorage.setItem("amrytt_hrms_theme", theme); } catch {}
  }, [theme]);

  const data = buildData(user);

  return (
    <AppContext.Provider value={{ user, setUser, role, setRole, data, theme, setTheme, clock, setClock, ready }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
