# Booking workflow — calendar + reply

How a client message becomes a calendar event and a reply draft. The engine is Claude
via the connected Google Calendar and Gmail tools — not the HTML page. The HTML page
stays a design reference; it cannot create real events on its own (no safe way to hold
Google credentials).

## Trigger

Forward or paste a client's message (WhatsApp text or Gmail) and say "book this."
Include the client's **email** if you have it — that's what lets them RSVP.

## What Claude does, every time

1. **Parse** name, location, date, time, duration, new vs returning. Anything uncertain
   gets flagged back to you before anything is created.
2. **Check the slot** against your calendars (primary + WTR Rooms + Chalk Farm Studio).
   If there's a clash, you hear about it instead of a double-booking.
3. **Create the event** on your **primary calendar** with the **client added as an
   attendee** (`attendeeEmails`). Google sends them an invite they can accept — that
   is their RSVP, and it saves to their own calendar. No raw link of yours is exposed.
4. **Draft the reply** (Gmail draft, or text to copy for WhatsApp) confirming the
   slot and telling them to tap Yes on the invite. New clients get the intake line.
5. **You approve.** Nothing sends automatically — you review the draft and hit send,
   and you can edit the event first.

## Event template

- Title: `CST Session — {name}{ (new client) }`
- When: parsed date/time, 60 min default (90 if asked), Europe/London
- Where: Waterloo — Breathe London Wellbeing, SE1  /  Bethnal Green — Community Clinic, E2
- Attendee: client email (gives them the RSVP invite)
- Colour: Sage

## Reply template

> Hi {name}, lovely to hear from you. {date} at {time} at {location} works nicely —
> I've pencilled you in. You'll get a calendar invite; just tap Yes to confirm.
> {new-client: As it's your first session, I'll send a short intake form to fill in
> beforehand.} Looking forward to it. Phoenix x

## The one thing to know about "the link"

The link Google returns when you create an event is **your** organiser/edit link — not
for clients. Clients get access by being an **attendee**: they receive their own invite
with Accept / Maybe / Decline. That's why step 3 adds their email rather than pasting a
link into the message.

## Not yet wired (needs the backend, separate decision)

- The HTML page itself creating events from your phone without Claude in the loop.
- Fully automatic sending (no approval step).
- Reading WhatsApp "Clients" labels — WhatsApp exposes no API for that; mark new vs
  returning yourself.
