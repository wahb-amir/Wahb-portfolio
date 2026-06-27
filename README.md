# wahb.space — PortFolio

> **A personal portfolio website** built with **Next.js (App Router)** and a small serverless backend. Maintained by Wahb Amir — a 16-year-old full‑stack developer

---

## Table of Contents

- [Project overview](#project-overview)
- [Tech stack](#tech-stack)
- [Architecture & data flow](#architecture--data-flow)
- [API routes (summary & examples)](#api-routes-summary--examples)
- [Folder structure (app)](#folder-structure-app)
- [Getting started (local development)](#getting-started-local-development)
- [Environment variables](#environment-variables)
- [Deployment notes (Vercel)](#deployment-notes-vercel)
- [Testing & debugging tips](#testing--debugging-tips)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Project overview

This repository powers **wahb.space** — a modern portfolio built on Next.js. The site is optimized for speed and older device compatibility, utilizing static data generation and server-side rendering.

Key features:

- Server-rendered Next.js front-end (App Router)
- Statically generated project and about data for instant page loads
- `/api/contact` route to handle contact form submissions, featuring rate-limiting, MongoDB persistence, and automated HTML email notifications via Nodemailer.
- Optimized for older devices (iOS 14+ / Safari 14+) with automatic JavaScript transpilation and graceful CSS fallbacks.

---

## Tech stack

- Frontend: Next.js (App Router)
- Backend: Next.js API routes (serverless)
- Database: MongoDB (e.g. Atlas) for storing contact messages and legacy data
- Email: Nodemailer (SMTP integration for contact notifications)
- Optional: SMTP/service for contact notifications (if configured)

---

## Architecture & data flow

The portfolio uses a **static-first approach** for its core content (Projects, About, Skills) to guarantee instant load times and zero network round-trips on page load. Data is imported at build time and bundled directly into the server modules.

For interactive features like the Contact Form, the data flow is as follows:

```
Client (browser)
  └─ submits POST /api/contact
        ├─ Rate-limit check (in-memory)
        ├─ Data sanitization & validation
        ├─ Save message to MongoDB
        └─ Dispatch HTML email via Nodemailer → Admin Inbox
```

---

## API routes (summary & examples)

> These endpoints reflect the repository layout (`app/api/...`). Replace `ORIGIN` with your site origin (e.g. `https://wahb.space` or `http://localhost:3000`).

### Public routes

#### `POST /api/contact`

- Purpose: handle contact form submissions securely.
- Expected body: `{ name, email, reason, message }` (JSON)
- Flow:
  1. **CORS & Rate Limiting**: Validates the origin and checks the requester's IP against an in-memory rate limiter to prevent spam.
  2. **Sanitization & Validation**: Trims and sanitizes inputs, validating email formats and required fields.
  3. **Database Persistence**: Stores the validated message into MongoDB using the `Message` model.
  4. **Nodemailer Dispatch**: Generates a high-quality HTML email template containing the contact details and sends an email notification to the site owner via a configured Gmail account.
- Returns: `200 OK` on success or validation errors / rate-limit responses.

**Example**

```bash
curl -X POST "ORIGIN/api/contact" \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://wahb.space' \
  -d '{"name":"Wahb","email":"wahb@example.com","reason":"project_inquiry","message":"Hello!"}'
```

### Internal / Protected routes

Paths under `app/api/updates/internal/*` and `app/api/updates/git/*` are internal-only and expect a secret token or header (e.g. `x-internal-token: <SECRET_TOKEN>`).

#### `GET /api/updates/internal/projects` (server → DB)

- Purpose: read projects directly from MongoDB. Only the server/public route should call this when Redis misses.
- Returns: `{ version, data }` and will be used to populate Redis.

#### `POST /api/updates/git/web-hooks`

- Purpose: receive GitHub/GitLab webhooks **only to update the `lastPublished` / `lastUpdated` date of projects**.
- This route does **not** rebuild or fully refresh project data.
- Typical use-case: when a repository receives a push or release event, the webhook updates the corresponding project's `lastPublished` timestamp in MongoDB.
- After updating MongoDB, Redis cache for projects is invalidated or updated so clients can receive the new timestamp on the next request.
- Security:
  - Validate webhook signature (GitHub/GitLab secret).
  - Additionally protected by an internal token to prevent public abus

## Folder structure (important bits under `/app`)

```
├── app
│   ├── api
│   │   ├── contact
│   │   │   └── route.ts
│   │   ├── github-activity
│   │   │   └── route.ts
│   │   └── updates
│   │       ├── about
│   │       │   ├── internal
│   │       │   │   └── about
│   │       │   │       └── route.ts
│   │       │   └── route.ts
│   │       ├── git
│   │       │   └── web-hooks
│   │       │       └── route.ts
│   │       ├── internal
│   │       │   └── projects
│   │       │       └── route.ts
│   │       └── projects
│   │           └── route.ts
│   ├── Component
│   │   ├── about
│   │   │   ├── AboutServer.tsx
│   │   │   └── About.tsx
│   │   ├── avatar
│   │   │   └── Avatar.tsx
│   │   ├── case-study
│   │   │   └── CaseStudy.tsx
│   │   ├── contact
│   │   │   └── Contact.tsx
│   │   ├── contributions
│   │   │   ├── ContributionCard.tsx
│   │   │   └── Contribution.tsx
│   │   ├── effects
│   │   │   ├── BackgroundEffect.tsx
│   │   │   ├── CustomParticles.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── faq
│   │   │   └── FAQ.tsx
│   │   ├── footer
│   │   │   └── Footer.tsx
│   │   ├── github
│   │   │   ├── ActivityClient.tsx
│   │   │   ├── CalendarDesktop.tsx
│   │   │   ├── config.ts
│   │   │   ├── github-activity.css
│   │   │   ├── index.tsx
│   │   │   └── Skeletons.tsx
│   │   ├── hero
│   │   │   ├── HeroCTAs.tsx
│   │   │   ├── HeroProof.tsx
│   │   │   ├── HeroScrollHint.tsx
│   │   │   └── Hero.tsx
│   │   ├── navigation
│   │   │   ├── Arrow.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── NavbarShell.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── navConfig.ts
│   │   │   ├── NavLinks.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── projects
│   │   │   ├── ProjectCardSSR.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectServer.tsx
│   │   │   └── RepoSelectorModal.tsx
│   │   ├── skills
│   │   │   ├── SkillServer.tsx
│   │   │   └── Skills.tsx
│   │   ├── slider
│   │   │   └── ImageSlider.tsx
│   │   └── ui
│   │       └── Preloader.tsx
│   ├── data
│   │   ├── about.json
│   │   ├── projects.json
│   │   └── structured-data.ts
│   ├── globals.css
│   ├── hooks
│   │   └── useClientTheme.ts
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.module.css
│   ├── page.tsx
│   ├── projects
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── Seo.config.ts
│   └── tailwind-out.css
├── eslint.config.mjs
├── jsconfig.json
├── lib
│   ├── aboutService.ts
│   ├── a.js
│   ├── a.ts
│   ├── db.ts
│   ├── projectsService.ts
│   ├── rate-limit.ts
│   └── redis.ts
├── models
│   ├── AboutMe.ts
│   ├── Message.ts
│   └── ProjectVersion.ts
├── next.config.ts
├── next-env.d.ts
├── next-sitemap.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── public
│   ├── ai.json
│   ├── apple-touch-icon.png
│   ├── Avatar.png
│   ├── Avatar.svg
│   ├── favicon-96x96.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon.zip
│   ├── llms.txt
│   ├── logo.png
│   ├── og-image.png
│   ├── Project
│   │   ├── EcoLens
│   │   │   ├── achivements.png
│   │   │   ├── dashboard.png
│   │   │   └── leaderboard.jpg
│   │   ├── Ecom
│   │   │   ├── light-men.png
│   │   │   ├── light-product.png
│   │   │   ├── light-shop.png
│   │   │   ├── light-women.png
│   │   │   └── stripe.png
│   │   ├── EconoQuest
│   │   │   ├── hall-of-fame.jpg
│   │   │   ├── landing.png
│   │   │   ├── nation-selection.png
│   │   │   ├── playground.jpg
│   │   │   └── report.jpg
│   │   └── Platform
│   │       ├── Dashboard.png
│   │       ├── home.png
│   │       ├── projects.png
│   │       └── Quote.png
│   ├── robots.txt
│   ├── sitemap-0.xml
│   ├── sitemap.xml
│   ├── site.webmanifest
│   ├── Wahb_Amir_Resume.pdf
├── README.md
├── tailwind.config.js
└── tsconfig.json

```

(Adjust paths above if your actual filesystem differs.)

---

## Getting started (local development)

### Prerequisites

- Node.js (v18+ recommended)
- npm / pnpm / yarn
- A running Redis instance (local or cloud)
- A MongoDB instance (Atlas or local)

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
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
INTERNAL_API_SECRET=
META_PLATFORM_ORIGIN=option for meta platform internal route
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_PRODUCTION=0 for dev, 1 for prod
NEXT_PUBLIC_CONTACT_PLATFORM=Client-dev platform link
WEBHOOK_SECRET=
```

**Security note:** never commit `.env` to the repo. Use Vercel/Netlify environment variables in production.

---

## Deployment notes (Vercel)

- Use Vercel for zero-config deployment of Next.js App Router projects.
- Add the environment variables in the Vercel project settings (MONGODB_URI, REDIS_URL, INTERNAL_ROUTE_TOKEN, etc.).
- For Redis in serverless environments, Upstash is a simple, serverless Redis provider (works great with Vercel).
- For MongoDB, use MongoDB Atlas and set IP/networking as appropriate.
- Make sure the internal routes are protected by `INTERNAL_ROUTE_TOKEN` and never expose that token to the client.

---

## Testing & debugging tips

- Test the contact flow locally by:
  1. Start MongoDB (or point env to hosted services).
  2. Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` to your `.env.local`.
  3. Submit a contact form from the frontend and verify that the message is saved in the database and an email is delivered to your inbox.
- Check rate-limiting behavior by submitting multiple contact requests rapidly (the limit is 5 per hour per IP).

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

**Wahb Amir** — 16‑year‑old full‑stack dev. Portfolio: [https://wahb.space](https://wahb.space)

If you want changes to wording, add a quick API reference, or include curl/Postman collections or example seed scripts, tell me which parts to expand and I'll update the README.
