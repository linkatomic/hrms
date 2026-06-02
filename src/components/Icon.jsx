"use client";
const Icon = ({ name, size = 16, className = "" }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: 1.8,
    strokeLinecap: "round", strokeLinejoin: "round",
    className: "ico " + className,
  };
  switch (name) {
    case "home":
      return <svg {...props}><path d="M3 11l9-8 9 8" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>;
    case "leaf":
      return <svg {...props}><path d="M4 20c0-9 6-15 16-15-1 10-7 16-16 15z" /><path d="M4 20l9-9" /></svg>;
    case "cake":
      return <svg {...props}><path d="M4 21h16M5 21v-7h14v7M6 14v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M12 9V5M10 4l2-2 2 2" /></svg>;
    case "users":
      return <svg {...props}><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M15 20c0-2.8 1.7-5 4-5" /></svg>;
    case "user":
      return <svg {...props}><circle cx="12" cy="8" r="3.5" /><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" /></svg>;
    case "bell":
      return <svg {...props}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>;
    case "money":
      return <svg {...props}><rect x="2.5" y="6" width="19" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v6M18 9v6" /></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4" /></svg>;
    case "sun":
      return <svg {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></svg>;
    case "moon":
      return <svg {...props}><path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z" /></svg>;
    case "play":
      return <svg {...props}><path d="M8 5l11 7-11 7V5z" fill="currentColor" /></svg>;
    case "pause":
      return <svg {...props}><rect x="7" y="5" width="3.5" height="14" fill="currentColor" /><rect x="13.5" y="5" width="3.5" height="14" fill="currentColor" /></svg>;
    case "stop":
      return <svg {...props}><rect x="6" y="6" width="12" height="12" fill="currentColor" /></svg>;
    case "arrow-r":
      return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7" /></svg>;
    case "arrow-l":
      return <svg {...props}><path d="M19 12H5M11 5l-7 7 7 7" /></svg>;
    case "arrow-up-r":
      return <svg {...props}><path d="M7 17L17 7M9 7h8v8" /></svg>;
    case "plus":
      return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
    case "check":
      return <svg {...props}><path d="M5 12l5 5L20 7" /></svg>;
    case "x":
      return <svg {...props}><path d="M6 6l12 12M18 6L6 18" /></svg>;
    case "filter":
      return <svg {...props}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" /></svg>;
    case "more":
      return <svg {...props}><circle cx="5" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="19" cy="12" r="1.4" fill="currentColor" /></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "logout":
      return <svg {...props}><path d="M9 21H4V3h5M16 17l5-5-5-5M21 12H9" /></svg>;
    case "palette":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><circle cx="9" cy="9.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="15" cy="9.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="9" cy="14.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="15" cy="14.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" /></svg>;
    case "trend":
      return <svg {...props}><path d="M3 17l6-6 4 4 8-8M14 7h7v7" /></svg>;
    case "coffee":
      return <svg {...props}><path d="M4 8h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" /><path d="M17 9h2a2 2 0 0 1 0 4h-2M6 3v2M10 3v2M14 3v2" /></svg>;
    case "globe":
      return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></svg>;
    case "mic":
      return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="3" /></svg>;
  }
};

export default Icon;
