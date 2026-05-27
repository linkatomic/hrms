// Hardcoded user registry — only the team lead can add accounts (backend task).
// Passwords are stored here for the prototype; in production use hashed secrets.

export const USERS = {
  "dev.p@amrytt.com": {
    password:   "Dev@2001",
    name:       "Dev P",
    firstName:  "Dev",
    role:       "manager",          // manager = team-lead view
    title:      "Team Lead",
    team:       "Brand & Creative",
    avatar:     "DP",
    employeeId: "AM-1001",
    joined:     "Jan 03, 2022",
    manager:    "Rahul Kapoor",
    phone:      "+91 98000 00001",
    location:   "Ahmedabad, IN",
    pronouns:   "he/him",
  },
  "neha.m@amrytt.com": {
    password:   "Neha@123",
    name:       "Neha M",
    firstName:  "Neha",
    role:       "employee",
    title:      "Brand Designer",
    team:       "Brand & Creative",
    avatar:     "NM",
    employeeId: "AM-2042",
    joined:     "Jun 15, 2023",
    manager:    "Dev P",
    phone:      "+91 98000 00002",
    location:   "Mumbai, IN",
    pronouns:   "she/her",
  },
  "preeti.s@amrytt.com": {
    password:   "Preeti@123",
    name:       "Preeti S",
    firstName:  "Preeti",
    role:       "employee",
    title:      "Motion Designer",
    team:       "Brand & Creative",
    avatar:     "PS",
    employeeId: "AM-2043",
    joined:     "Sep 01, 2023",
    manager:    "Dev P",
    phone:      "+91 98000 00003",
    location:   "Pune, IN",
    pronouns:   "she/her",
  },
  "keyur.d@amrytt.com": {
    password:   "Keyur@123",
    name:       "Keyur D",
    firstName:  "Keyur",
    role:       "employee",
    title:      "Art Director",
    team:       "Brand & Creative",
    avatar:     "KD",
    employeeId: "AM-2044",
    joined:     "Nov 10, 2023",
    manager:    "Dev P",
    phone:      "+91 98000 00004",
    location:   "Surat, IN",
    pronouns:   "he/him",
  },
  "arjun.m@amrytt.com": {
    password:   "Arjun@123",
    name:       "Arjun M",
    firstName:  "Arjun",
    role:       "employee",
    title:      "Copywriter",
    team:       "Brand & Creative",
    avatar:     "AM",
    employeeId: "AM-2045",
    joined:     "Feb 20, 2024",
    manager:    "Dev P",
    phone:      "+91 98000 00005",
    location:   "Delhi, IN",
    pronouns:   "he/him",
  },
  "neel.p@amrytt.com": {
    password:   "Neel@123",
    name:       "Neel P",
    firstName:  "Neel",
    role:       "employee",
    title:      "Performance Marketing",
    team:       "Growth",
    avatar:     "NP",
    employeeId: "AM-2046",
    joined:     "Apr 05, 2024",
    manager:    "Dev P",
    phone:      "+91 98000 00006",
    location:   "Vadodara, IN",
    pronouns:   "he/him",
  },
};

const SESSION_KEY = "amrytt_hrms_session";

/** Attempt login. Returns user object on success, null on failure. */
export function login(email, password) {
  const user = USERS[email.toLowerCase().trim()];
  if (!user || user.password !== password) return null;
  const session = { email: email.toLowerCase().trim(), loggedInAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return user;
}

/** Clear session. */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/** Return the current user object from session, or null if not logged in. */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { email } = JSON.parse(raw);
    return USERS[email] ? { ...USERS[email], email } : null;
  } catch {
    return null;
  }
}
