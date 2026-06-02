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
  const [user, setUser]   = useState(() => getSession());
  const [role, setRole]   = useState(() => getSession()?.role ?? "employee");
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("amrytt_hrms_theme") ?? "dark"; } catch { return "dark"; }
  });
  const [clock, setClock] = useState({
    in:         Date.now() - 5.47 * 3600 * 1000,
    out:        null,
    elapsed:    5.47 * 3600,
    breakTotal: 0,
    onBreak:    false,
    breakStart: null,
    breaks:     [],
  });

  // Sync theme to document
  useEffect(() => {
    const themeObj = THEMES.find(t => t.key === theme) ?? THEMES[0];
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-type", themeObj.type);
    try { localStorage.setItem("amrytt_hrms_theme", theme); } catch {}
  }, [theme]);

  const data = buildData(user);

  return (
    <AppContext.Provider value={{ user, setUser, role, setRole, data, theme, setTheme, clock, setClock }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
