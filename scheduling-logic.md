# Scheduling logic — how Claude offers and checks times

Rules Claude follows on every booking and every "when are you free?" request.
Pairs with booking-workflow.md (parse → check → create → draft → approve).

## The two sites

- **Waterloo** — five interchangeable rooms, each its **own calendar**: `WTR Room 1`–`WTR
  Room 5`. A slot is open if **at least one** of the five has no event over the full hour.
  Claude does not care which room. **`CLOSED` events are the venue's own opening hours** —
  treat them exactly like a booking: that room is unavailable for that block, even with no
  client in it. (Verified readable 2026-06-24.)
- **Bethnal Green** — appears as **Chalk Farm Studio** (calendar `chalkfarm215@gmail.com`),
  shared with eight other people. Titles are readable. Phoenix's own bookings read
  **Phoenix**; everyone else's carry their own name or label (e.g. `Luisa`, `Galit`,
  `Ray School`, `A – LSSI's…`). Rule: **any title that is not "Phoenix" = someone else.**
  (Verified readable 2026-06-24.)

## Working window

- **Days:** Monday, Wednesday, Thursday, Friday. (Flexible, but these are the offered days.)
- **Hours:** 11:00 – 20:30, Europe/London.
- **Sessions:** 60 minutes. So the **latest a session can start is 19:30**.
- No admin/notes buffer needed after a session.

## Gap rules (the core logic)

The gap Claude must leave depends on what sits either side of the proposed slot:

| Situation | Required gap |
|---|---|
| Waterloo session → another Waterloo session (Phoenix's) | Back-to-back OK (0 min) |
| Bethnal Green session → another Bethnal Green session (Phoenix's) | 15 min |
| Beside a Chalk Farm booking in a **different name** (e.g. Louisa) | 30 min from that booking |
| Beside a Chalk Farm booking named **Phoenix** | 15 min (treat as own) |
| Waterloo ↔ Bethnal Green (either direction, same day) | 2 hours |
| Any clinic session ↔ any other event (personal, evening, elsewhere) | 1 hour |

Notes:

- The **1-hour** rule is the default travel buffer to anything that isn't a same-clinic
  session — Claude assumes ~1 hour to cross London and does **not** try to read the other
  event's location. Phoenix guarantees the hour is enough.
- The **2-hour** rule overrides the 1-hour default whenever both clinics appear in one day.
- At Bethnal Green, if the adjacent Chalk Farm booking is **not** Phoenix, it's someone
  else using the space — Claude cannot book *into* it, and needs 30 min clear of it.

## Offering times

- When a client asks for availability, offer **about three options**.
  - If they're open on timing, **spread the three across the week** (different days).
  - If they've named one day, give **three options on/around that day**.
- Always close with: *"If none of those work, let me know and we'll find another time."*
- Only offer slots that pass every gap rule above and sit fully inside 11:00–20:30.

## Out of scope for now

- Recurring/standing clients — handle manually for the moment.
- Reading non-clinic event locations — deliberately ignored; the 1-hour buffer covers it.
