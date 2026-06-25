/**
 * CSTL Booking — Claude proxy (Cloudflare Worker)
 * --------------------------------------------------
 * The booking page calls THIS worker; the worker calls Anthropic with your
 * secret API key. The key never touches the browser.
 *
 * Two secrets/vars to set after deploy (see WORKER-SETUP.md):
 *   ANTHROPIC_API_KEY  (secret)  — your separate booking-only key
 *   ALLOWED_ORIGIN     (var)     — your page origin, e.g. https://phoenix238.github.io
 *                                  (host only, no path). Locks down who can call it.
 *
 * Request body (POST, JSON): { system, user, max_tokens?, model? }
 * Response (JSON): { text } or { error }
 */

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";  // cheap + fast; plenty for short replies
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || "*";
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") {
      return json({ error: "POST only" }, 405, cors);
    }
    // Optional origin lock: if ALLOWED_ORIGIN is set, reject other origins.
    if (allowed !== "*" && origin && origin !== allowed) {
      return json({ error: "origin not allowed" }, 403, cors);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: "ANTHROPIC_API_KEY not set on the worker" }, 500, cors);
    }

    let body;
    try { body = await request.json(); }
    catch (e) { return json({ error: "bad JSON" }, 400, cors); }

    const payload = {
      model: body.model || DEFAULT_MODEL,
      max_tokens: Math.min(body.max_tokens || 400, 1000),
      system: body.system || "",
      messages: [{ role: "user", content: String(body.user || "") }]
    };

    try {
      const r = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!r.ok) return json({ error: j.error || j }, r.status, cors);
      const text = (j.content || []).map(b => b.text || "").join("").trim();
      return json({ text }, 200, cors);
    } catch (e) {
      return json({ error: String(e) }, 502, cors);
    }
  }
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "content-type": "application/json" }
  });
}
