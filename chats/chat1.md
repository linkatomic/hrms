# Beautiful HRMS Dashboard

_Started 2026-05-26 10:30 UTC_

---

## User

I want to design HRMS like the best in the world but very good looking with limited functionalities like employee check in - check out which shows hours they have worked in a day

calendar which shows present absent

leave tracker and applying leave

 anniversary and birthday reminders


i want to use GSAP locomotive and lenis to build this beautifull HRMS

it should majorly focus on UI/UX and easy to navigate with sticky sidebar

## Assistant

_[tool: list_files]_

_[tool: questions_v2]_

## User

Questions answered:
- role: Both — toggle between them
- accent: 0
- screens: Dashboard / home, Check-in / Check-out with hours, Calendar (attendance grid), Leave tracker + apply leave, Birthdays & anniversaries, Team directory, Profile / settings, Notifications, payroll
- checkin_style: Decide for me
- calendar_style: Color-dot per day (subtle)
- motion_intensity: 8
- sidebar_style: Always-expanded with labels
- data_density: Decide for me
- company: AMRYTT MEDIA LLC
- tweaks: Light / dark mode
- aesthetic: Dark mode neo-brutalist

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: write_file]_

_[tool: write_file]_

Now the icons file:

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now the main HTML:

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: update_todos]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built the AMRYTT HRMS prototype — dark neo-brutalist, sticky sidebar, 9 screens.

**Highlights**
- **Dashboard** — big editorial hero, animated weekly-hours bar chart, today's schedule, leave/celebrations/team strips, scrolling marquee
- **Check-in** — live ticking timer, hold-to-clock-in interaction (0.8s), progress ring for the week, today's timeline log
- **Calendar** — color-dot attendance grid + selectable day detail + full-year heatmap
- **Leave** — 4 balance cards, my requests table, multi-step apply form with live impact preview, manager approval queue (toggle role)
- **Celebrations** — featured next event, upcoming cards, past-month wins
- **Directory · Notifications · Payroll · Profile** — all wired

**Motion** — GSAP entry animations on every route + Lenis smooth scroll.

**Tweaks** (top-right toolbar toggle): Light/Dark theme, Role (Employee↔Manager), quick nav. The sidebar also has a role-toggle pill, and the topbar has a sun/moon icon.

**Shortcuts** — Alt+1…9 jumps between screens.

Tell me what to push further: tighten a specific screen, add charts, swap palettes, or wire a real data flow.

