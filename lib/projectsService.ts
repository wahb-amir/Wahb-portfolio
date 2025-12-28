// projectsService.fallback.ts
// Adds a safe fallback to staticProjects when Redis/DB fail.

export const staticProjects = [
  {
    id: "client-dev-platform",
    title: "Client & Developer Collaboration Platform",
    role: "Full-Stack Engineer",
    images: [
      "/Project/Platform/Login.png",
      "/Project/Platform/Dashboard.png",
      "/Project/Platform/Quote.png",
    ],
    tech: [
      "Next.js",
      "React",
      "Node.js",
      "Tailwind",
      "MongoDB",
      "GitHub Automation",
    ],
    short:
      "A single workspace where clients can request project quotes, track progress, message developers, and see real-time updates — without chasing emails or spreadsheets.",
    liveLink: "https://dashboard.wahb.space",
    githubLink: [
      "https://github.com/wahb-amir/dev-dashboard",
      "https://github.com/wahb-amir/dashboard",
    ],

    problem:
      "Clients and developers were using emails, chats, and separate tools to manage projects, making communication confusing and progress hard to track.",
    process: [
      "Created a client dashboard where users can request quotes, view project timelines, and message their assigned developers",
      "Built a developer workspace to manage tasks, update progress, and respond to client requests",
      "Ensured each user sees only what’s relevant to them (clients, managers, developers)",
      "Automatically linked projects with GitHub so development activity updates project progress without manual reporting",
      "Added email and in-app notifications so everyone stays informed of changes and messages",
      "Launched the platform with secure login and automated deployment",
    ],
    outcome:
      "Clients gained transparency and confidence, while developers reduced manual updates. Communication improved, project visibility increased, and overall coordination became faster and clearer.",
    stats: {
      automation:
        "Project progress updates automatically from development activity",
      features:
        "Quote requests, live messaging, progress tracking, notifications, role-based access",
    },
    category: "Platform",
    launch: {
      date: "Monday 22,2025",
    },
    caseStudy: {
      tlDr: "Built a single-platform collaboration tool that replaced fragmented email/chat processes and automated progress reporting — improving transparency and reducing manual status updates for developers and clients.",
      problem:
        "Clients and developers relied on email, chat and spreadsheets to track work. This caused missed updates, unclear ownership, and frequent status-check requests.",
      constraints:
        "Tight timeline (MVP in 8 weeks), role-based access requirements, need for secure logins and enterprise-grade data isolation, and limited budget for external integrations.",
      myRole:
        "Full-Stack Engineer — owned end-to-end design and implementation of the client & developer workflows, GitHub integration, and CI/CD automation.",
      responsibilities: [
        "Designed UI/UX for client dashboard and developer workspace",
        "Implemented role-based access control and secure authentication",
        "Built GitHub -> platform automation to sync commits/PRs with project progress",
        "Implemented real-time notifications (in-app + email) and messaging",
        "Owned deployments and monitoring (automated builds and secure hosting)",
      ],
      approach: [
        "Took feedBack from 5 user (clients) to capture the main pain points",
        "Mapped out user journeys for three personas (client, manager, developer)",
        "Prioritized features into an MVP: quotes, messaging, progress tracking, GitHub sync",
        "Iterated rapidly with 1-week sprints and early feedback from two pilot clients",
      ],
      technicalSolution: [
        "Next.js + React for server-side rendered pages and fast UX",
        "Node.js API with role-based endpoints; MongoDB for flexible project data",
        "GitHub Actions + webhooks to automatically map commits/PRs to tasks and update progress",
        "Tailwind for consistent, responsive design and small CSS footprint",
        "Auth (JWT / secure cookies) and permission checks on every API call",
      ],
      architectureNotes:
        "Single Next.js app serving client & dev experiences with serverless API routes. GitHub webhooks push events to a queue; worker processes map events to project activities and update project state in MongoDB. This keeps user-facing APIs fast and offloads heavy processing to background workers.",
      outcomes: {
        qualitative:
          "Clients reported clearer visibility and fewer status-check meetings; developers stopped doing manual update emails. The platform created a single source of truth for all project activity.",
      },
      proofPoints: [
        "Automated GitHub-linked progress reduced manual reporting work (see GitHub links).",
        "Pilot clients moved from weekly status calls to in-app updates.",
      ],
      lessons: [
        "Start with one core workflow (quote → accepted → project) and automate the most painful manual step first.",
        "Push heavy integrations (webhook processing) to background workers to preserve UI responsiveness.",
        "Invest in clear distinctions between client-view and developer-view to reduce noise.",
      ],
      callToAction:
        "If you want to see the platform in action or discuss how I architect similar collaboration tools, check the live demo or message me.",
    },
  },

  {
    id: "ecom-1",
    title: "Modern Online Store",
    role: "Full-Stack Developer",
    images: [
      "/Project/Ecom/light-shop.png",
      "/Project/Ecom/light-men.png",
      "/Project/Ecom/light-women.png",
      "/Project/Ecom/light-product.png",
      "/Project/Ecom/stripe.png",
    ],
    tech: ["Next.js", "Stripe", "Secure Login", "Tailwind", "MongoDB"],
    short:
      "A clean, fast online store where users can browse products, add items to a cart, and check out — with a simple admin view for managing products safely.",
    liveLink: "https://boltform.wahb.space/",
    githubLink: "https://github.com/wahb-amir/Boltform",
    problem:
      "Small businesses need an easy-to-use online store with secure checkout and basic admin visibility, without exposing sensitive system access.",
    process: [
      "Designed a modern, mobile-friendly shopping experience",
      "Built secure login so users can sign in safely",
      "Integrated a test payment system to simulate real checkout flows",
      "Created a read-only admin dashboard so owners can view data without security risks",
      "Optimized performance so pages load fast on all devices",
    ],
    outcome:
      "Delivered a fast, responsive online store that demonstrates real-world e-commerce flows, secure payments, and admin visibility — suitable for small businesses or MVP launches.",
    stats: { pagespeed: "Improved site performance from slow to fast loading" },
    category: "Web",
    caseStudy: {
      tlDr: "Built a performant e-commerce demo that demonstrates secure checkout, mobile-first UX, and an admin view — ideal as an MVP for small businesses.",
      problem:
        "Small merchants needed a simple, secure storefront and basic admin reporting without a complex backend or exposing full admin privileges.",
      constraints:
        "Target mobile-first UX, PCI-safe checkout demo (Stripe test mode), and an admin view that is read-only to avoid accidental data changes.",
      myRole:
        "Full-Stack Developer — implemented product browsing, cart/checkout flow, secure auth, and the admin reporting view.",
      responsibilities: [
        "Designed and implemented responsive product listing and checkout flow",
        "Integrated Stripe (test mode) to demonstrate end-to-end payments",
        "Implemented secure authentication and read-only admin dashboard",
        "Performance-tuned pages for mobile-first speed",
      ],
      approach: [
        "Prioritized core funnel: browse → add to cart → checkout → order confirmation",
        "Kept admin features minimal (read-only) to avoid complexity for MVP",
        "Used lazy-loading images and SSR for initial page speed",
      ],
      technicalSolution: [
        "Next.js for SSR and fast static rendering of product pages",
        "Stripe for secure, PCI-compliant payment flows (test integration shown)",
        "MongoDB to store product and order data; secure API endpoints for checkout",
        "Tailwind for responsive, consistent UI",
      ],
      architectureNotes:
        "Hybrid approach: static rendering for catalog pages, server-side checkout endpoints to handle payments and order creation. Images served via optimized `<img>` with srcset and lazy loading to reduce LCP.",
      outcomes: {
        qualitative:
          "MVP-ready store demonstrating the core e-commerce funnel with strong mobile performance and secure payments.",
      },
      launch: {
        date: "Sat 20 ,2025",
      },
      proofPoints: [
        "Stripe integration for secure payment flows.",
        "Read-only admin reduces risk for non-technical store owners.",
      ],
      lessons: [
        "Optimize the critical funnel (catalog → checkout) first — everything else can be iterative.",
        "SSR + image optimization produce the best first-load experience for product pages.",
      ],
      callToAction:
        "Want an MVP storefront for your business? I can adapt this foundation to your product catalogue and payments.",
    },
  },
];

// -------------------------
// Original service code below (modified to return staticProjects on failure)
// -------------------------

import redis from "@/lib/redis"; // server-only ioredis client
import { connectToDB } from "@/lib/db";
import ProjectVersion from "@/models/ProjectVersion";

export type ProjectsPayload = {
  version: number | null;
  data: any[] | null;
};

// Return shape: { payload, fromCache }
// If clientVersion passed and equals cache version, payload.data === null (client is up-to-date)
export async function getLatestProjectsPayload(options?: {
  clientVersion?: number | null;
  redisKey?: string;
}): Promise<{ payload: ProjectsPayload; fromCache: boolean }> {
  const { clientVersion = null, redisKey = "projects:payload" } = options ?? {};

  // 1) Try Redis (best-effort)
  try {
    const raw = await redis.get(redisKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ProjectsPayload;
        // If client has same version, return data: null (cheaper to transmit)
        if (clientVersion != null && parsed.version === clientVersion) {
          return {
            payload: { version: parsed.version ?? null, data: null },
            fromCache: true,
          };
        }
        return {
          payload: { version: parsed.version ?? null, data: parsed.data ?? [] },
          fromCache: true,
        };
      } catch (parseErr) {
        // Failed to parse cached payload, log and continue to DB
        console.warn("projectsService: failed to parse redis payload:", parseErr);
      }
    }
  } catch (err) {
    // Non-fatal: log and continue to DB read
    console.warn("projectsService: redis get failed:", (err as any)?.message ?? err);
  }

  // 2) Try DB
  try {
    await connectToDB();
    const latest = await ProjectVersion.findOne().sort({ version: -1 }).lean();
    const payload: ProjectsPayload = {
      version: latest?.version ?? null,
      data: latest?.projects ?? [],
    };

    // Write to Redis for next time (best-effort)
    try {
      await redis.set(redisKey, JSON.stringify(payload));
    } catch (err) {
      console.warn("projectsService: redis set failed:", (err as any)?.message ?? err);
    }

    // If client version matches now, return data:null
    if (clientVersion != null && payload.version === clientVersion) {
      return {
        payload: { version: payload.version, data: null },
        fromCache: false,
      };
    }

    return { payload, fromCache: false };
  } catch (err) {
    console.error("projectsService: DB read failed:", err);

    
    const fallbackPayload: ProjectsPayload = {
      version: null,
      data: staticProjects,
    };

    return { payload: fallbackPayload, fromCache: false };
  }
}
