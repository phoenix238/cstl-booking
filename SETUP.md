# Setup — make the page create real calendar events

The page (`index.html`) is fully built. It can't go live until two one-time jobs are done,
because Google won't let a web page act as you until you've (a) hosted it at a real address
and (b) registered that address with Google. Order matters: **host first, then register**,
because the Google credential has to name the exact address.

Total time: ~30–45 minutes, once.

---

## Step 1 — Host the page (gets you an HTTPS address)

Both options below are **free** and use no Google tokens. Pick one.

### Option A — GitHub Pages

1. Sign in at https://github.com (make a free account if needed).
2. Top-right **+** → **New repository**. Name it `cst-booking`, set it **Public**,
   Create repository.
3. On the repo page → **Add file → Upload files** → drag in `index.html` (and any other
   page files) → **Commit changes**.
4. **Settings → Pages.** Under "Build and deployment", Source = **Deploy from a branch**,
   Branch = **main** / **/(root)** → **Save**.
5. Wait ~1 minute, refresh. Your page address is
   `https://YOURNAME.github.io/cst-booking/` — that's **YOUR_URL**.

> ⚠️ For Google in Step 4, the **Authorized JavaScript origin** is the host only —
> `https://YOURNAME.github.io` (no `/cst-booking/` on the end).

### Option B — Netlify (drag-and-drop)

1. Go to https://app.netlify.com/drop and drag the project folder onto the page.
2. You get `https://random-name-123.netlify.app`; optionally rename it in
   Site settings → Change site name.
3. That full address is both **YOUR_URL** and the origin you give Google in Step 4.

Write your final address down as **YOUR_URL**.

---

## Step 2 — Create a Google Cloud project + enable the Calendar API

1. Go to https://console.cloud.google.com/ and sign in with the Google account that holds
   your calendars (phoenix@tanner.me).
2. Top bar → project dropdown → **New Project** → name it `CST Booking` → Create.
3. With that project selected, go to **APIs & Services → Library**.
4. Search **Google Calendar API** → open it → **Enable**.

---

## Step 3 — OAuth consent screen (so sign-in is allowed)

1. **APIs & Services → OAuth consent screen.**
2. User type: **External** → Create.
3. Fill the minimum: App name `CST Booking`, your email for support + developer contact.
   Save and continue.
4. **Scopes:** skip (Add later) — Save and continue.
5. **Test users:** Add `phoenix@tanner.me`. Save.
   - This keeps the app in "testing" mode, which is all you need for personal use.
     You'll see an "unverified app" notice at sign-in — that's expected; tap Continue.

---

## Step 4 — Create the OAuth Client ID

1. **APIs & Services → Credentials → Create credentials → OAuth client ID.**
2. Application type: **Web application.** Name: `CST Booking page`.
3. Under **Authorized JavaScript origins → Add URI**, paste **YOUR_URL** from Step 1
   (no trailing slash, e.g. `https://phoenix-booking.netlify.app`).
4. Leave "Authorized redirect URIs" empty (not needed for this flow).
5. Create. Copy the **Client ID** (looks like `1234567890-abc.apps.googleusercontent.com`).

---

## Step 5 — Paste the Client ID into the page

1. Open `index.html`, find the `CONFIG` block near the top of the `<script>`.
2. Put your Client ID between the quotes:
   ```js
   GOOGLE_CLIENT_ID: "1234567890-abc.apps.googleusercontent.com",
   ```
3. Save. Re-drag the folder to Netlify (or push) to publish the change.

---

## Step 6 — Test it live

1. Open **YOUR_URL** on your phone or laptop.
2. Settings tab → **Connect Google Calendar** → sign in → Continue past the unverified notice.
3. Back on Booking: paste a client message → Read it & draft → check the slot
   (now a real free/busy check) → add the client's email → **Create event & open Gmail**.
4. Check your Google Calendar: the event is there. If you added an email, the client got
   an invite they can accept.

---

## Good to know

- **Sign-in lasts ~1 hour.** After that, tap Connect again. (Removing that re-tap entirely
  is the "small backend" option — separate decision.)
- **WhatsApp clients with no email** can't receive a Google invite; the event is still
  created on your calendar, the reply just confirms in words.
- **Security:** the page only ever acts with the Google account *you* sign in with on *your*
  device. The Client ID is not a secret — it's fine to have it in the page.
- **Add to home screen** on your phone for an app-like icon (Safari/Chrome share menu →
  Add to Home Screen).
