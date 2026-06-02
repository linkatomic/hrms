"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import BASE_DATA from "@/src/data";
import { THEMES } from "@/src/components/ThemePicker";

function profileToMe(profile, email) {
  if (!profile) return BASE_DATA.me;
  return {
    name:       profile.name,
    role:       profile.title   || "",
    team:       profile.team    || "",
    avatar:     profile.avatar  || profile.name.slice(0, 2).toUpperCase(),
    employeeId: profile.employee_id,
    joined:     profile.joined_date
      ? new Date(profile.joined_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "",
    manager:    profile.manager_name || "",
    email:      email || "",
    phone:      profile.phone    || "",
    location:   profile.location || "",
    pronouns:   profile.pronouns || "",
  };
}

function profilesToTeam(profiles) {
  return profiles.map(p => ({
    id:         p.id,
    name:       p.name,
    role:       p.title || "",
    avatar:     p.avatar || p.name.slice(0, 2).toUpperCase(),
    status:     "in",
    loc:        (p.location || "Remote").split(",")[0].trim(),
    dept:       p.team || "General",
    employeeId: p.employee_id,
  }));
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [role, setRole]       = useState("employee");
  const [theme, setTheme]     = useState("dark");
  const [ready, setReady]     = useState(false);
  const [clock, setClock]     = useState({
    in: null, out: null, elapsed: 0,
    breakTotal: 0, onBreak: false, breakStart: null, breaks: [],
  });

  const loadProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    return data;
  };

  const loadAllProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*").order("name");
    return data || [];
  };

  useEffect(() => {
    // Load saved theme
    try {
      const saved = localStorage.getItem("amrytt_hrms_theme");
      if (saved) setTheme(saved);
    } catch {}

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const [p, allP] = await Promise.all([loadProfile(session.user.id), loadAllProfiles()]);
        setProfile(p);
        setAllProfiles(allP);
        setUser(session.user);
        setRole(p?.role ?? "employee");

        // Load today's attendance for the clock state
        const today = new Date().toISOString().slice(0, 10);
        const { data: att } = await supabase
          .from("attendance").select("*")
          .eq("profile_id", session.user.id).eq("date", today).single();
        if (att?.clock_in) {
          const inMs = new Date(att.clock_in).getTime();
          const outMs = att.clock_out ? new Date(att.clock_out).getTime() : null;
          setClock({
            in:         inMs,
            out:        outMs,
            elapsed:    outMs ? att.total_hours * 3600 : (Date.now() - inMs) / 1000 - (att.break_minutes * 60),
            breakTotal: att.break_minutes * 60,
            onBreak: false, breakStart: null, breaks: [],
          });
        }
      }
      setReady(true);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null); setProfile(null); setAllProfiles([]); setRole("employee");
      } else if (session) {
        const [p, allP] = await Promise.all([loadProfile(session.user.id), loadAllProfiles()]);
        setProfile(p);
        setAllProfiles(allP);
        setUser(session.user);
        setRole(p?.role ?? "employee");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync theme to <html>
  useEffect(() => {
    const themeObj = THEMES.find(t => t.key === theme) ?? THEMES[0];
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-type", themeObj.type);
    try { localStorage.setItem("amrytt_hrms_theme", theme); } catch {}
  }, [theme]);

  const data = {
    ...BASE_DATA,
    me:   profileToMe(profile, user?.email),
    team: allProfiles.length > 0 ? profilesToTeam(allProfiles) : BASE_DATA.team,
  };

  return (
    <AppContext.Provider value={{ user, setUser, profile, role, setRole, data, theme, setTheme, clock, setClock, ready }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
