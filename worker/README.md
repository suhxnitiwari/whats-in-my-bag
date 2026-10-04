# contacts worker

The "do you wanna connect with me?" form on the phone posts here. Each person is saved to a D1 database, and my phone gets a push notification through ntfy.

## setup (once, in the Cloudflare dashboard)

1. **Database:** Storage & Databases → D1 → Create → name it `bag-contacts`. Open its Console, paste `schema.sql`, run it.
2. **Worker:** Workers & Pages → Create → Hello World → name it `bag-contacts` → Deploy → Edit code → replace everything with `contacts-worker.js` → Deploy.
3. **Bindings:** the worker → Settings → Bindings → add a D1 database binding, variable name `DB`, database `bag-contacts`.
4. **Secrets:** Settings → Variables and Secrets → add two secrets:
   - `NTFY_TOPIC`: a long random name nobody would guess (anyone who knows it can read the notifications)
   - `ADMIN_KEY`: another long random string, for reading the list
5. **Phone:** install the ntfy app → subscribe to the same topic name.
6. **Site:** copy the worker's URL (`https://bag-contacts.<you>.workers.dev`) into `CONTACT_API` near the top of `app.js`, then push.

## reading the list

Open `https://bag-contacts.<you>.workers.dev/contacts?key=<ADMIN_KEY>` for everyone, newest first.

## what it does

- Only accepts posts from suhanitiwari.com, suhxnitiwari.github.io (where the bag lives), onrender.com and localhost.
- A hidden field catches bots.
- The same phone number within a day is saved once.
- If the worker is ever down, the form falls back to opening email.
