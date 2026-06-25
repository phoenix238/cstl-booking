# Setup — let the page write replies with Claude

The page (`index.html`) never holds your Claude API key. It calls a tiny free
**Cloudflare Worker** (`worker.js`), and the Worker holds the key as a secret and
talks to Claude. This is the whole point: a key pasted into a web page is visible to
anyone who opens it and can be drained on your bill. The Worker prevents that.

You'll do three things, once: make a **separate** API key, deploy the Worker, then
paste the Worker's address into the page's Settings.

Total time: ~20 minutes.

---

## Step 1 — Make a separate Anthropic API key (with a spend cap)

Use a key that is *only* for this booking tool — not the one your other project uses.
That way a problem here can't touch your other project, and you can set a low spend
limit and revoke it on its own.

1. Go to https://console.anthropic.com and sign in.
2. Left sidebar → **Settings → Workspaces** → **Create Workspace** → name it
   `CST Booking`. (A workspace lets you cap spend separately. Optional but recommended.)
3. In that workspace, set a **monthly spend limit** — e.g. £5. Drafting short replies
   with Haiku costs a fraction of a penny each, so £5 is months of real use.
4. Go to **API keys → Create Key**, choose the `CST Booking` workspace, name it
   `cstl-worker`. **Copy the key now** (starts `sk-ant-…`) — you can't see it again.

Keep that key handy for Step 3. Don't paste it into any file.

---

## Step 2 — Deploy the Worker on Cloudflare (free)

You don't have a Cloudflare account yet, so start there. No card needed for the
free Workers tier.

### 2a. Create the account
1. Go to https://dash.cloudflare.com/sign-up and make a free account. Verify your email.

### 2b. Create the Worker (dashboard, no install needed)
1. In the dashboard, left sidebar → **Workers & Pages** → **Create application** →
   **Create Worker**.
2. Name it `cstl-booking-ai`. Click **Deploy** (it deploys a placeholder).
3. Click **Edit code**. Delete everything in the editor.
4. Open `worker.js` from this folder, copy all of it, paste it into the editor.
5. Top right → **Deploy**.
6. Your Worker now has an address like
   `https://cstl-booking-ai.YOURNAME.workers.dev` — **write this down as WORKER_URL.**

### 2c. Add the secret + origin lock
1. Leave the editor. On the Worker's page → **Settings → Variables and Secrets**.
2. Under **Secrets** → **Add** →
   - Name: `ANTHROPIC_API_KEY`
   - Value: paste the `sk-ant-…` key from Step 1 → **Save**.
3. Under **Variables** → **Add** →
   - Name: `ALLOWED_ORIGIN`
   - Value: your page's origin, host only, no path —
     e.g. `https://phoenix238.github.io` (this is where `index.html` is hosted) → **Save**.
   - This stops anyone else's site from using your Worker (and your key).
4. **Deploy** again so the secret + variable take effect.

> Note: `ALLOWED_ORIGIN` is the **host** of your booking page, not the Worker.
> If your page is at `https://phoenix238.github.io/cstl-booking/`, the origin is
> `https://phoenix238.github.io` — drop the `/cstl-booking/`.

---

## Step 3 — Point the page at the Worker

1. Open your live booking page → **Settings** tab.
2. **Worker URL** field → paste your **WORKER_URL** from Step 2b → **Save settings**.
3. The "Claude (reply drafting)" dot turns green. Done — no code edit, no re-deploy of
   the page needed. (The URL is saved in your browser.)

If you'd rather bake it into the file instead, set `WORKER_URL` in the `CONFIG` block at
the top of `index.html`'s script. The Settings value wins if both are set.

---

## Step 4 — Test

1. Booking tab → paste a client message → **Check availability & draft reply**.
2. The reply should read like you wrote it, and the note under the box says
   "Drafted by Claude". If it says "Template draft", the Worker URL isn't set; if it
   says "Claude unavailable (…)", the error message tells you what to fix (usually the
   secret or the origin).
3. Pick the time, then **Confirm, add form & open WhatsApp** — it re-drafts a
   confirmation (with the intake form link for new clients), creates the event, and opens
   the handoff.

---

## How the two buttons work

- **Check availability & draft reply** (Step 1): reads the message, checks your Google
  calendar for that day, and asks Claude for a first reply. If the requested time is free,
  it warmly offers it. If it clashes, Claude offers the free windows it found that day.
- **Confirm, add form & book** (Step 3): once the client picks a time, this re-drafts a
  confirmation, adds the intake form link for new clients, creates the calendar event, and
  opens WhatsApp/Gmail with the reply pre-typed.

---

## Cost & safety notes

- **Cost:** Haiku, ~400 tokens out per reply, is well under a penny per draft. The £5 cap
  is a hard ceiling regardless.
- **The key only lives in Cloudflare.** Not in `index.html`, not in your browser, not in
  GitHub. Revoke it any time at console.anthropic.com without touching your other project.
- **`ALLOWED_ORIGIN`** keeps the Worker usable only from your own page. Worth doing.
- **Model:** change `DEFAULT_MODEL` at the top of `worker.js` if you ever want a stronger
  model (e.g. a Sonnet build) for richer wording — redeploy the Worker after editing.
