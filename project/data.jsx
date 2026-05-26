// AMRYTT MEDIA LLC — mock data
const DATA = {
  company: { name: "AMRYTT MEDIA LLC", short: "AM", tz: "America/New_York" },
  me: {
    name: "Aarav Sharma",
    role: "Senior Brand Designer",
    team: "Brand & Creative",
    avatar: "AS",
    employeeId: "AM-2041",
    joined: "Mar 12, 2023",
    manager: "Priya Iyer",
    email: "aarav.sharma@amryttmedia.com",
    phone: "+1 (646) 555-0142",
    location: "Brooklyn, NY",
    pronouns: "he/him",
  },
  manager: {
    name: "Priya Iyer",
    role: "Creative Director",
    avatar: "PI",
    team: "Brand & Creative",
  },

  // Today: Tuesday May 26, 2026
  today: "2026-05-26",
  // attendance map for May 2026 (YYYY-MM-DD -> status / hours)
  attendance: (() => {
    const map = {};
    // generate May 1 - May 26
    const may = (d, status, hrs) => { map[`2026-05-${String(d).padStart(2,"0")}`] = { status, hrs }; };
    const set = (d, status, hrs) => may(d, status, hrs);
    // weekdays = present (varied hours), some WFH, one sick day, one leave
    set(1, "present", 8.4);
    set(2, "weekend"); set(3, "weekend");
    set(4, "present", 8.9);
    set(5, "wfh", 7.7);
    set(6, "present", 9.2);
    set(7, "present", 8.1);
    set(8, "leave", 0); // applied leave
    set(9, "weekend"); set(10, "weekend");
    set(11, "present", 8.6);
    set(12, "present", 9.4);
    set(13, "wfh", 8.0);
    set(14, "absent", 0);
    set(15, "present", 7.9);
    set(16, "weekend"); set(17, "weekend");
    set(18, "present", 8.7);
    set(19, "present", 9.1);
    set(20, "present", 8.3);
    set(21, "wfh", 7.5);
    set(22, "present", 8.8);
    set(23, "weekend"); set(24, "weekend");
    set(25, "present", 9.0);
    set(26, "present", null); // today, partial
    return map;
  })(),

  team: [
    { id: 1, name: "Priya Iyer",      role: "Creative Director",        avatar: "PI", status: "in",   loc: "NYC",     dept: "Brand & Creative" },
    { id: 2, name: "Aarav Sharma",    role: "Senior Brand Designer",    avatar: "AS", status: "in",   loc: "Brooklyn", dept: "Brand & Creative" },
    { id: 3, name: "Mei Tanaka",      role: "Motion Designer",          avatar: "MT", status: "wfh",  loc: "Toronto",  dept: "Brand & Creative" },
    { id: 4, name: "Diego Alvarez",   role: "Copywriter",               avatar: "DA", status: "in",   loc: "Mexico City", dept: "Brand & Creative" },
    { id: 5, name: "Noor El-Sayed",   role: "Art Director",             avatar: "NE", status: "leave", loc: "NYC",     dept: "Brand & Creative" },
    { id: 6, name: "Jordan Patel",    role: "VP, Growth",               avatar: "JP", status: "in",   loc: "NYC",      dept: "Growth" },
    { id: 7, name: "Sofia Reyes",     role: "Performance Marketing",    avatar: "SR", status: "in",   loc: "Madrid",   dept: "Growth" },
    { id: 8, name: "Kenji Watanabe",  role: "Data Analyst",             avatar: "KW", status: "wfh",  loc: "Tokyo",    dept: "Growth" },
    { id: 9, name: "Amelia Foster",   role: "Head of People",           avatar: "AF", status: "in",   loc: "NYC",      dept: "People" },
    { id:10, name: "Rahul Kapoor",    role: "Founder & CEO",            avatar: "RK", status: "in",   loc: "NYC",      dept: "Leadership" },
    { id:11, name: "Yara Hassan",     role: "Account Director",         avatar: "YH", status: "in",   loc: "Dubai",    dept: "Client Services" },
    { id:12, name: "Lukas Berg",      role: "Account Manager",          avatar: "LB", status: "off",  loc: "Berlin",   dept: "Client Services" },
  ],

  leaves: {
    balances: [
      { kind: "Paid Time Off",   used: 9,  total: 22, color: "var(--accent)" },
      { kind: "Sick Leave",      used: 2,  total: 10, color: "var(--good)" },
      { kind: "Personal",        used: 1,  total: 5,  color: "var(--info)" },
      { kind: "Comp Off",        used: 0,  total: 3,  color: "var(--warn)" },
    ],
    requests: [
      { id: "LV-0118", kind: "Paid Time Off", from: "2026-06-08", to: "2026-06-12", days: 5, status: "Pending", reason: "Family trip — Lisbon", approver: "Priya Iyer", filed: "2026-05-21" },
      { id: "LV-0117", kind: "Sick Leave",    from: "2026-05-14", to: "2026-05-14", days: 1, status: "Approved", reason: "Flu",            approver: "Priya Iyer", filed: "2026-05-13" },
      { id: "LV-0116", kind: "Paid Time Off", from: "2026-05-08", to: "2026-05-08", days: 1, status: "Approved", reason: "Personal",        approver: "Priya Iyer", filed: "2026-05-02" },
      { id: "LV-0115", kind: "Personal",      from: "2026-04-17", to: "2026-04-17", days: 1, status: "Approved", reason: "Apt. paperwork",  approver: "Priya Iyer", filed: "2026-04-10" },
      { id: "LV-0114", kind: "Paid Time Off", from: "2026-03-30", to: "2026-04-03", days: 5, status: "Rejected", reason: "Spring break",    approver: "Priya Iyer", filed: "2026-03-15" },
    ],
    pending_for_manager: [
      { id: "LV-0121", who: "Mei Tanaka",   avatar: "MT", kind: "PTO",  from: "2026-06-15", to: "2026-06-19", days: 5, reason: "Wedding" },
      { id: "LV-0120", who: "Diego Alvarez",avatar: "DA", kind: "Sick", from: "2026-05-27", to: "2026-05-27", days: 1, reason: "Migraine" },
      { id: "LV-0119", who: "Sofia Reyes",  avatar: "SR", kind: "PTO",  from: "2026-07-06", to: "2026-07-17", days: 10, reason: "Summer holiday" },
    ],
  },

  celebrations: [
    { kind: "birthday",    who: "Mei Tanaka",    avatar: "MT", role: "Motion Designer",       date: "2026-05-28", in_days: 2 },
    { kind: "anniversary", who: "Diego Alvarez", avatar: "DA", role: "Copywriter",            date: "2026-06-01", years: 3, in_days: 6 },
    { kind: "birthday",    who: "Yara Hassan",   avatar: "YH", role: "Account Director",      date: "2026-06-04", in_days: 9 },
    { kind: "anniversary", who: "Aarav Sharma",  avatar: "AS", role: "Senior Brand Designer", date: "2026-06-12", years: 3, in_days: 17 },
    { kind: "birthday",    who: "Kenji Watanabe",avatar: "KW", role: "Data Analyst",          date: "2026-06-19", in_days: 24 },
    { kind: "anniversary", who: "Jordan Patel",  avatar: "JP", role: "VP, Growth",            date: "2026-06-23", years: 5, in_days: 28 },
  ],

  notifications: [
    { id: 1, kind: "leave",   t: "10m",  title: "Leave approved",         body: "Priya Iyer approved your PTO for May 8.", unread: true },
    { id: 2, kind: "celeb",   t: "1h",   title: "Birthday tomorrow",      body: "Wish Mei Tanaka — Motion Designer.",      unread: true },
    { id: 3, kind: "payroll", t: "3h",   title: "May payslip available",  body: "$4,820.40 net deposited to BoA •••2841.", unread: true },
    { id: 4, kind: "mention", t: "y'day",title: "@aarav on a leave request", body: "Diego tagged you in LV-0120.",         unread: false },
    { id: 5, kind: "policy",  t: "2d",   title: "Updated remote policy",  body: "Hybrid days now flexible per team.",      unread: false },
    { id: 6, kind: "checkin", t: "3d",   title: "Late check-in",          body: "You clocked in at 10:14 on May 22.",      unread: false },
  ],

  payroll: {
    next_pay: "2026-05-31",
    ytd_gross: 48200.00,
    last: [
      { period: "Apr 2026", gross: 6850.00, deductions: 1620.50, net: 5229.50, status: "Paid" },
      { period: "Mar 2026", gross: 6850.00, deductions: 1620.50, net: 5229.50, status: "Paid" },
      { period: "Feb 2026", gross: 6850.00, deductions: 1620.50, net: 5229.50, status: "Paid" },
      { period: "Jan 2026", gross: 6850.00, deductions: 1620.50, net: 5229.50, status: "Paid" },
    ],
    breakdown: [
      { k: "Base salary",       v: 6500.00 },
      { k: "Design stipend",    v: 250.00 },
      { k: "Hybrid allowance",  v: 100.00 },
      { k: "Federal tax",       v: -980.20, neg: true },
      { k: "State (NY)",        v: -382.10, neg: true },
      { k: "Health insurance",  v: -148.00, neg: true },
      { k: "401(k) 6%",         v: -410.00, neg: true },
    ],
  },
};

window.DATA = DATA;
