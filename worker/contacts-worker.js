// ============================================================
// whats-in-my-bag contacts ✦
// the "do you wanna connect with me?" form on my phone posts here.
// each person is saved to a D1 database, then my phone gets a push (ntfy).
//
// bindings (Worker → Settings → Bindings / Variables):
//   DB          D1 database (run schema.sql in its console once)
//   NTFY_TOPIC  secret: the ntfy topic my phone is subscribed to
//   ADMIN_KEY   secret: lets me read the list at /contacts?key=...
// ============================================================

const ALLOWED = [/^https:\/\/suhanitiwari\.com$/, /^https:\/\/(www\.)?suhanitiwari\.com$/, /^https:\/\/[a-z0-9-]+\.onrender\.com$/, /^http:\/\/localhost(:\d+)?$/];

const cors = origin => ({
  "Access-Control-Allow-Origin": ALLOWED.some(r => r.test(origin || "")) ? origin : "https://suhanitiwari.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin"
});

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });

const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);

export default {
  async fetch(request, env) {
    const url = new URL(request.url), origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") return new Response(null, { headers: cors(origin) });

    // my list, newest first: /contacts?key=ADMIN_KEY
    if (request.method === "GET" && url.pathname === "/contacts") {
      if (!env.ADMIN_KEY || url.searchParams.get("key") !== env.ADMIN_KEY) return json({ error: "nope" }, 401, origin);
      const { results } = await env.DB.prepare("SELECT name, phone, met, created_at FROM contacts ORDER BY id DESC LIMIT 500").all();
      return json(results, 200, origin);
    }

    if (request.method !== "POST" || url.pathname !== "/contact") return json({ error: "not found" }, 404, origin);
    if (!ALLOWED.some(r => r.test(origin || ""))) return json({ error: "wrong site" }, 403, origin);

    let body;
    try { body = await request.json(); } catch { return json({ error: "bad request" }, 400, origin); }

    // bots fill the hidden field. pretend it worked
    if (body.website) return json({ ok: true }, 200, origin);

    const name = clean(body.name, 80), phone = clean(body.phone, 30), met = clean(body.met, 200);
    if (!name || phone.replace(/\D/g, "").length < 7) return json({ error: "name and phone, please" }, 400, origin);

    // one person can't flood me: same phone within a day is ignored
    const dupe = await env.DB.prepare("SELECT 1 FROM contacts WHERE phone = ? AND created_at > datetime('now', '-1 day')").bind(phone).first();
    if (!dupe) {
      await env.DB.prepare("INSERT INTO contacts (name, phone, met) VALUES (?, ?, ?)").bind(name, phone, met).run();
      if (env.NTFY_TOPIC) {
        await fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
          method: "POST",
          headers: { "Title": `new connection: ${name}`.replace(/[^\x20-\x7e]/g, ""), "Tags": "sparkling_heart" },
          body: `${name} · ${phone}${met ? `\nhow we met: ${met}` : ""}`
        }).catch(() => {});
      }
    }
    return json({ ok: true }, 200, origin);
  }
};
