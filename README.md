# Mega Bytes Restaurant

A full-stack restaurant site (React + Vite frontend, Express API backend,
admin CMS) for Mega Bytes Restaurant in Kitale, Kenya.

## What was fixed here

This project was originally built in Google AI Studio for deployment on
Google Cloud Run: a single Express server (`server.ts`) served both the React
frontend and a JSON REST API, storing all site content in a local file
(`src/db.json`) and uploaded images on local disk (`public/uploads`).

**That doesn't work on Vercel.** Vercel deployments are serverless — there's
no long-running server, and the filesystem is read-only (except a temporary
`/tmp` that's wiped between requests). Deployed as-is, Vercel would just
serve the static frontend and silently 404 every `/api/*` call, so the Hero
and About sections rendered with no content at all — a near-black page with
almost nothing on it, since the Hero section's background color is a very
dark brown/black and every text field was empty.

### What changed

- All Express routes were extracted into `api/_lib/app.ts` as a shared
  `createApp()` function, used by **both**:
  - `api/index.ts` — the Vercel serverless function (handles all `/api/*`
    requests in production)
  - `server.ts` — the local dev server (`npm run dev`), unchanged in
    behavior
- **Site content storage** (`api/_lib/store.ts`): on Vercel, content is
  stored in **Upstash Redis** (via Vercel's Marketplace integration) instead
  of a local JSON file. Locally, it still just uses `src/db.json` — no setup
  required for local dev.
- **Uploaded media storage** (`api/_lib/media.ts`): on Vercel, uploaded
  images go to **Vercel Blob** storage instead of local disk. Locally, they
  still save to `public/uploads` as before.
- Added `vercel.json` so `/api/*` requests are routed to the serverless
  function, and all other paths fall back to `index.html` (required because
  this app uses `history.pushState`-based client-side routing for
  `/menu`, `/about`, `/contact`, `/admin`).

Nothing about the actual site content, menu items, admin panel, or UI was
changed — this was purely a hosting/infrastructure fix.

---

## Deploying to Vercel

### 1. Push this project to a Git repo and import it into Vercel

In the Vercel dashboard: **Add New → Project**, then import your repo. Leave
the framework preset as detected (it'll pick up `vercel.json` automatically)
— no need to change build/output settings.

### 2. Add an Upstash Redis store (for site content)

This replaces the old `db.json` file so your Hero, About, Menu, Contact,
admin users, etc. actually persist.

1. In your Vercel project, go to the **Storage** tab
2. Click **Create Database → Marketplace Database Providers → Upstash → Redis**
   (or search "Upstash Redis" under Integrations if you're on an older
   dashboard layout)
3. Create the store and **connect it to this project**
4. Vercel will automatically add `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` to your project's environment variables — you
   don't need to copy these manually

### 3. Add a Vercel Blob store (for uploaded images)

This replaces local-disk uploads for the Admin → Media Library panel.

1. Same **Storage** tab → **Create Database → Blob**
2. Create it and connect it to this project
3. Vercel will automatically add `BLOB_READ_WRITE_TOKEN` for you

### 4. Set a real JWT secret

In **Project Settings → Environment Variables**, add:

```
JWT_SECRET = <any long random string>
```

(The app has a fallback dev value, but you should not use it in production —
it's the same value in this public repo, so anyone could forge admin
tokens.)

### 5. Deploy

Trigger a deploy (push to your connected branch, or click **Redeploy** in
Vercel). On first request, the app automatically seeds Redis with the
default Mega Bytes content — no manual seeding step needed.

### First-time admin login

```
Email:    admin@megabytes.com
Password: admin123
```

**Change this password (or delete/replace this user) immediately after your
first deploy** — it's a known default credential from the original seed
data.

---

## Local development

No external services required:

```bash
npm install
npm run dev
```

This starts the app at `http://localhost:3000`, storing content in
`src/db.json` (auto-created on first run, gitignored) and uploads in
`public/uploads`.

## Other deployment options

Because this app was built around a persistent Node/Express server, it will
also run unmodified (no Redis/Blob needed) on any platform that runs a
long-lived Node process — e.g. **Google Cloud Run** (what it was originally
built for in AI Studio), **Render**, **Railway**, or **Fly.io**:

```bash
npm run build   # vite build + bundles server.ts → dist/server.cjs
npm start       # node dist/server.cjs
```

On those platforms, content still persists to `src/db.json` on the
container's disk, same as local dev — just be aware that on most of these
platforms the disk resets on redeploy unless you attach a persistent volume.

## Known limitations

- **Media uploads before Blob is connected**: if you deploy to Vercel
  without setting up the Blob store, the `/api/media/upload` endpoint will
  throw at runtime (no `BLOB_READ_WRITE_TOKEN`). Everything else works fine
  without it — this only affects the Admin → Media Library upload feature.
- **Concurrent writes**: the content store is a single JSON blob per key
  (matching the original `db.json` design), not a relational database. This
  is fine for a single-admin CMS but isn't built for high-concurrency
  simultaneous edits.
- A full Prisma/PostgreSQL schema already exists in `prisma/schema.prisma`
  from the original project scaffold. It's not wired up (this fix uses
  Redis to keep the change minimal and match the original JSON-blob data
  shape), but it's there if you'd rather migrate to a proper relational
  database later.
