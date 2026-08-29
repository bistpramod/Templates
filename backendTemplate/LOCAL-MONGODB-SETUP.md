# Local MongoDB + Compass Setup

This is the "what to actually do" guide — from nothing installed, to a
database your backend can connect to, to seeing your data in Compass.
Written for Arch/EndeavourOS, with a Docker option that works the same way
on any OS if you'd rather not touch pacman/AUR at all.

You do **not** need MongoDB Atlas or any cloud account for any of this —
everything below runs entirely on your machine.

---

## Step 1 — Install the MongoDB server (`mongod`)

MongoDB isn't in the official Arch repos (licensing reasons), so you have
two options. Pick one.

### Option A — AUR (native install, what most Arch users do)
```bash
yay -S mongodb-bin mongodb-tools-bin
```
`mongodb-bin` is the actual database server (the `mongod` binary).
`mongodb-tools-bin` gives you `mongodump`/`mongorestore`/etc. — not
required, but handy later.

### Option B — Docker (skip AUR entirely, easiest to reset/uninstall)
```bash
docker run -d --name local-mongo -p 27017:27017 -v mongo-data:/data/db mongo:7
```
This pulls MongoDB 7, runs it in the background, persists data in a Docker
volume named `mongo-data`, and exposes it on the standard port 27017 —
identical to a native install as far as your app and Compass are concerned.
To stop/start it later: `docker stop local-mongo` / `docker start local-mongo`.

**Pick Option A if** you want MongoDB to just always be running like any
other system service. **Pick Option B if** you'd rather keep your system
clean or might switch machines often.

---

## Step 2 — Start the database

**If you installed via AUR (Option A):**
```bash
sudo systemctl enable --now mongodb
```
`enable` makes it start automatically on boot; `--now` also starts it
immediately. Check it's actually running:
```bash
systemctl status mongodb
```
You want to see `active (running)` in green. If the service is named
`mongod` instead of `mongodb` on your install, use that name instead —
`systemctl list-units | grep -i mongo` will tell you which one exists.

**If you used Docker (Option B):** it's already running from the `docker
run` command above. Confirm with:
```bash
docker ps
```
You should see `local-mongo` in the list.

---

## Step 3 — Install MongoDB Compass

You said you're already using Compass, so likely done — but for
completeness:
```bash
yay -S mongodb-compass
```
or download the `.deb`/AppImage manually from mongodb.com/products/compass
if you'd rather not use the AUR for the GUI app.

---

## Step 4 — Connect Compass to your local database

1. Open Compass.
2. In the connection field, use:
   ```
   mongodb://localhost:27017
   ```
   This is the default — no username/password needed for a local dev
   instance (MongoDB has no auth enabled out of the box).
3. Click **Connect**.
4. You'll see a list of databases (probably just `admin`, `config`,
   `local` — MongoDB's internal ones). **Your project's database won't
   exist yet, and that's expected** — see the note below.

---

## Step 5 — Point your backend at the same instance

In your project's `.env`:
```
# JS/ESM boilerplate uses MONGO_URI, TS boilerplate uses DB_URI — check
# which one your copy expects.
MONGO_URI=mongodb://127.0.0.1:27017/mern_starter
DB_URI=mongodb://127.0.0.1:27017/mern_starter
```
Replace `mern_starter` with whatever you want to call this project's
database — e.g. `mens_outfit_fancy`. `127.0.0.1` and `localhost` both work;
`127.0.0.1` avoids occasional DNS-resolution quirks, so it's the safer
default.

**You do not need to manually create this database or its collections.**
MongoDB creates a database the moment something is actually written to it
— which for you will be the first time you run the admin seed script
(`npm run seed:admin`) or create your first product through the API. This
trips people up coming from SQL, where you `CREATE DATABASE` explicitly
first — Mongo just doesn't require that step.

If you want to see it appear for yourself:
1. Run `npm run seed:admin` (or `npm run dev` and hit an endpoint that
   writes data).
2. In Compass, click the refresh icon near the database list, or
   disconnect/reconnect.
3. Your database (e.g. `mern_starter`) now appears, with a `users`
   collection inside it containing your seeded admin.

(If you ever *do* want to create an empty database up front just to look
at it, Compass has a **"Create Database"** button on that screen — it asks
for a database name and an initial collection name, since Mongo won't
create a database with zero collections in it. But for this workflow, just
let the app create it on first write — one less manual step to remember.)

---

## Step 6 — Verify end-to-end

1. `npm run dev` in your backend folder.
2. Visit `http://localhost:5000/api/health` (or whatever `PORT` you set) —
   you should get `{ "status": "ok" }`.
3. In the terminal running the server, you should see a "MongoDB
   connected" log line. If instead you see a connection error, it's almost
   always one of: `mongod`/Docker isn't actually running (recheck Step 2),
   or the port/URI in `.env` doesn't match.
4. In Compass, refresh — your database and its first collection(s) should
   be visible.

---

## Common issues

| Symptom | Likely cause |
|---|---|
| `ECONNREFUSED 127.0.0.1:27017` | `mongod`/Docker container isn't running — redo Step 2 |
| Compass connects fine, but the app can't | `.env` has a typo, or the app is reading `MONGO_URI` when your copy expects `DB_URI` (or vice versa) |
| Database never appears in Compass | Nothing has actually written to it yet — run the seed script, then refresh Compass |
| `systemctl status mongodb` says "not found" | Your AUR package registered the service under a different name — try `mongod` instead of `mongodb` |
