"use client";
import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

export const THEMES = [
  { key: "dark",     label: "Dark",     type: "dark",  bg: "#0A0A0A", accent: "#FF6B35" },
  { key: "midnight", label: "Midnight", type: "dark",  bg: "#0D1117", accent: "#60A5FA" },
  { key: "forest",   label: "Forest",   type: "dark",  bg: "#0A1108", accent: "#4ADE80" },
  { key: "aurora",   label: "Aurora",   type: "dark",  bg: "#0D0818", accent: "#A78BFA" },
  { key: "ember",    label: "Ember",    type: "dark",  bg: "#120A05", accent: "#FBBF24" },
  { key: "light",    label: "Cream",    type: "light", bg: "#F4F2EC", accent: "#FF6B35" },
  { key: "paper",    label: "Paper",    type: "light", bg: "#FFFFFF", accent: "#3B82F6" },
  { key: "sage",     label: "Sage",     type: "light", bg: "#EFF3EF", accent: "#16A34A" },
  { key: "rose",     label: "Rose",     type: "light", bg: "#FDF2F5", accent: "#E11D48" },
  { key: "sand",     label: "Sand",     type: "light", bg: "#F5F0E8", accent: "#D97706" },
];

const ThemePicker = ({ theme, setTheme }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const darkThemes  = THEMES.filter(t => t.type === "dark");
  const lightThemes = THEMES.filter(t => t.type === "light");
  const current     = THEMES.find(t => t.key === theme) ?? THEMES[0];

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={btnRef}
        className="brut-btn brut-btn--ghost"
        onClick={() => setOpen(v => !v)}
        style={{ padding: "10px 12px", gap: 7 }}
        title="Change theme"
      >
        <Icon name="palette" size={14} />
        <span
          style={{
            width: 10, height: 10, borderRadius: "50%",
            background: current.accent,
            border: "1.5px solid var(--border-strong)",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "var(--bg-elev)",
            border: "1.5px solid var(--border-strong)",
            borderRadius: "var(--r)",
            padding: "16px",
            width: 260,
            boxShadow: "var(--shadow-brut)",
            zIndex: 100,
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 12 }}>
            Theme
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 8 }}>
              Dark
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {darkThemes.map(t => (
                <ThemeSwatch key={t.key} t={t} active={theme === t.key} onSelect={() => { setTheme(t.key); setOpen(false); }} />
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 8 }}>
              Light
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {lightThemes.map(t => (
                <ThemeSwatch key={t.key} t={t} active={theme === t.key} onSelect={() => { setTheme(t.key); setOpen(false); }} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1.5px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-mute)" }}>
            Active: <span style={{ color: "var(--accent)", fontWeight: 700 }}>{current.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const ThemeSwatch = ({ t, active, onSelect }) => (
  <button
    onClick={onSelect}
    title={t.label}
    style={{
      width: 36, height: 36,
      borderRadius: "var(--r-sm)",
      background: t.bg,
      border: active ? `2px solid var(--accent)` : "1.5px solid var(--border-strong)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
      boxShadow: active ? "var(--shadow-brut-sm)" : "none",
      transition: "transform .1s, box-shadow .1s",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
  >
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: "40%",
      background: t.accent,
    }} />
    {active && (
      <div style={{
        position: "absolute", inset: 0,
        display: "grid", placeItems: "center",
        color: t.type === "dark" ? "#fff" : "#000",
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>
    )}
    <div style={{
      position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
      fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.06em", textTransform: "uppercase",
      color: "var(--text-mute)", whiteSpace: "nowrap",
    }}>
      {t.label}
    </div>
  </button>
);

export default ThemePicker;
