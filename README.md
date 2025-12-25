# wahb.space — PortFolio

> **A personal portfolio website** built with **Next.js (App Router)** and a small serverless backend. Maintained by Wahb Amir — a 15-year-old full‑stack developer 

---

## Table of Contents

* [Project overview](#project-overview)
* [Tech stack](#tech-stack)
* [Architecture & data flow](#architecture--data-flow)
* [API routes (summary & examples)](#api-routes-summary--examples)
* [Folder structure (app)](#folder-structure-app)
* [Getting started (local development)](#getting-started-local-development)
* [Environment variables](#environment-variables)
* [Deployment notes (Vercel)](#deployment-notes-vercel)
* [Testing & debugging tips](#testing--debugging-tips)
* [Contributing](#contributing)
* [License](#license)
* [Author](#author)

---

## Project overview

This repository powers **wahb.space** — a modern portfolio built on Next.js with serverless API routes and a small backend stack (Redis + MongoDB). The site is not just static: it uses caching, versioned updates, and internal routes to provide fast, consistent content to the client while allowing updates from a central database.

Key features:

* Server-rendered Next.js front-end (App Router)
* Serverless API routes used as the backend layer
* Redis caching layer for fast public reads
* MongoDB as the source of truth for content
* Versioned responses + client-side IndexedDB caching to avoid unnecessary data transfer
* `/api/contact` route to handle contact form submissions

---

## Tech stack

* Frontend: Next.js (App Router)
* Backend: Next.js API routes (serverless)
* Database: MongoDB (e.g. Atlas)
* Cache: Redis (e.g. Upstash, Redis Cloud)
* Client offline caching: IndexedDB (frontend)
* Optional: SMTP/service for contact notifications (if configured)

---

## Architecture & data flow

Below is a concise description of the update-check flow for `about` and `projects` content.

```
Client (browser)
  └─ requests GET /api/updates/projects?version=<clientVersion>
        ├─ Redis cache (public)
        │    ├─ cache HIT → return { version, data } (200)
        │    └─ cache MISS → call internal route (with secret) → fetch from MongoDB → populate Redis → return { version, data }
        └─ If clientVersion === serverVersion → return 204 No Content (no body)

Client stores received data in IndexedDB and updates its local version.
```

Notes:

* The frontend should pass `?version=<localVersion>` when it has cached data. If version matches, the server returns no content (204) to save bandwidth.
* Public routes read from Redis. If Redis doesn't have the key, the public route calls the internal route that has access to MongoDB (the internal route requires a secret token).
* Internal routes are used for platform/meta support and for secure reads/writes that should not be public.

---

## API routes (summary & examples)

> These endpoints reflect the repository layout (`app/api/...`). Replace `ORIGIN` with your site origin (e.g. `https://wahb.space` or `http://localhost:3000`).

### Public routes

#### `GET /api/updates/projects[?version=xyz]`

* Purpose: return project list and a `version` string (semver, timestamp, or hash).
* Behavior (recommended / implemented flow):

  * If the client sends `?version` and it **matches** the server version → `204 No Content` (no JSON body).
  * If versions **differ** or `?version` is omitted → `200 OK` with JSON `{ version: "...", data: {...} }`.
  * If Redis has cached data → return from Redis.
  * If Redis misses → fetch from internal route (with secret token), write to Redis, return result.

**Example (client asks for updates)**

```bash
curl "ORIGIN/api/updates/projects?version=1"
# -> 204 No Content (if up to date) or
# -> 200 { "version": "2025-12-20T09:00:00Z", "data": [ ...projects... ] }
```

#### `GET /api/updates/about?version=xyz`

* Same behavior as `/projects` but returns the "about" content.

#### `POST /api/contact`

* Purpose: handle contact form submissions.
* Expected body: `{ name, email, message, [other fields] }` (JSON)
* Action: validate payload, optionally persist to DB or push to an email/notification service, return `200`/`201` or validation errors.

**Example**

```bash
curl -X POST "ORIGIN/api/contact" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Wahb","email":"wahb@example.com","message":"Hi!"}'
```

### Internal / Protected routes

Paths under `app/api/updates/internal/*` and `app/api/updates/git/*` are internal-only and expect a secret token or header (e.g. `x-internal-token: <SECRET_TOKEN>`).

#### `GET /api/updates/internal/projects` (server → DB)

* Purpose: read projects directly from MongoDB. Only the server/public route should call this when Redis misses.
* Returns: `{ version, data }` and will be used to populate Redis.

#### `POST /api/updates/git/web-hooks`

* Purpose: receive GitHub/GitLab webhooks **only to update the `lastPublished` / `lastUpdated` date of projects**.
* This route does **not** rebuild or fully refresh project data.
* Typical use-case: when a repository receives a push or release event, the webhook updates the corresponding project's `lastPublished` timestamp in MongoDB.
* After updating MongoDB, Redis cache for projects is invalidated or updated so clients can receive the new timestamp on the next request.
* Security:

  * Validate webhook signature (GitHub/GitLab secret).
  * Additionally protected by an internal token to prevent public abus

## Folder structure (important bits under `/app`)

```
app/
├─ api/
│  ├─ contact/                 # contact form API
│  ├─ updates/
│  │  ├─ about/                # public about route
│  │  ├─ projects/             # public projects route
│  │  ├─ internal/             # internal routes (fetch from MongoDB)
│  │  │  ├─ about/internal
│  │  │  └─ projects
│  │  └─ git/
│  │     └─ web-hooks          # git webhook receiver
│  
├─ Component/                  # React components
└─ ...
```

(Adjust paths above if your actual filesystem differs.)

---

## Getting started (local development)

### Prerequisites

* Node.js (v18+ recommended)
* npm / pnpm / yarn
* A running Redis instance (local or cloud)
* A MongoDB instance (Atlas or local)

### Install

```bash
# from repo root
npm install
# or
yarn install
# or
pnpm install
```

### Environment

Set up a `.env.local` file with the required variables listed below.

### Run locally

```bash
# dev
pnpm run dev
# build
pnpm run build
# preview production locally
pnpm run start
```

---

## Environment variables

Below are the commonly required variables. Adapt names to what your code expects.

```
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=redis://:<password>@<host>:<port>
INTERNAL_API_SECRET=
META_PLATFORM_ORIGIN=option for meta platform internal route
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_PROJECTS_API=localhost:3000/api/updates/projects
NEXT_PUBLIC_ORIGIN=http://localhost:3000
NEXT_PUBLIC_ABOUT_API=localhost:3000/api/updates/about
NEXT_PUBLIC_PRODUCTION=0 for dev,1 for prod
NEXT_PUBLIC_CONTACT_PLATFORM=Client-dev platform link
WEBHOOK_SECRET=
```

**Security note:** never commit `.env` to the repo. Use Vercel/Netlify environment variables in production.

---

## Deployment notes (Vercel)

* Use Vercel for zero-config deployment of Next.js App Router projects.
* Add the environment variables in the Vercel project settings (MONGODB_URI, REDIS_URL, INTERNAL_ROUTE_TOKEN, etc.).
* For Redis in serverless environments, Upstash is a simple, serverless Redis provider (works great with Vercel).
* For MongoDB, use MongoDB Atlas and set IP/networking as appropriate.
* Make sure the internal routes are protected by `INTERNAL_ROUTE_TOKEN` and never expose that token to the client.

---

## Testing & debugging tips

* Test the update flow locally by:

  1. Start MongoDB and Redis (or point env to hosted services).
  2. Seed MongoDB with `about` and `projects` documents that include a `version` field.
  3. Call the public `GET /api/updates/projects` endpoint. Confirm Redis is populated.
  4. Call with `?version=<same-version>` and confirm `204`.
* Inspect Redis keys via `redis-cli` to verify TTLs and stored payloads.
* Use logs in the serverless function to show when internal route is called (cache miss), and when Redis is hit.

---

## Contributing

Pull requests are welcome. A good flow for contributions:

1. Fork the repo
2. Create a branch `feature/your-thing` or `fix/issue-number`
3. Open a PR with a clear description and a demo or screenshots if UI changes

---

## License

This project is available under the **MIT License**. See `LICENSE` for details.

---

## Author

**Wahb Amir** — 15‑year‑old full‑stack dev. Portfolio: [https://wahb.space](https://wahb.space)

If you want changes to wording, add a quick API reference, or include curl/Postman collections or example seed scripts, tell me which parts to expand and I'll update the README.
