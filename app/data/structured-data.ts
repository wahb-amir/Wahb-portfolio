// ─── FAQ entries (keep in sync with FAQ.tsx faqList) ────────────────────────
const faqEntries = [
  {
    q: "How do I get started working with you?",
    a: "Simple — fill out the contact form on this page or email me directly at wahbamir2010@gmail.com. I'll reply within 24 hours to schedule a short discovery call (or async if you prefer). We'll align on scope, budget, and timeline before any commitment is made.",
  },
  {
    q: "How do I track the progress of my project in real-time?",
    a: "Every client gets access to my custom-built Client Portal (dashboard.wahb.space). You can track development sprints, view task status, sync GitHub progress, and send feedback — all from one place, no chasing emails.",
  },
  {
    q: "How do we communicate and collaborate during a project?",
    a: "I keep things lean: async updates via the Client Portal for day-to-day progress, and scheduled check-ins (video or voice call) at key milestones — typically kick-off, mid-sprint reviews, and pre-launch. You'll never be left guessing where things stand.",
  },
  {
    q: "What is the typical timeline for an MVP (Minimum Viable Product)?",
    a: "While timelines vary by complexity, a well-scoped MVP is usually ready in 8–12 weeks. That includes core features, a secure database, CI/CD pipeline, and a polished UI ready for real users.",
  },
  {
    q: "What happens if something breaks after the project is finished?",
    a: "I provide a standard 30-day bug-fix guarantee post-launch, no questions asked. For longer peace of mind, monthly maintenance retainers cover security patches, dependency updates, and server monitoring.",
  },
  {
    q: "Can you integrate AI or Computer Vision into my existing web app?",
    a: "Yes. I specialise in pairing modern Next.js/React frontends with practical AI — particularly lightweight computer vision models for object recognition and image processing that run efficiently on standard hardware, no expensive cloud GPU required.",
  },
  {
    q: "Do you handle hosting and server management for me?",
    a: "Absolutely. I offer a 'hands-off' DevOps experience. Whether it's a Linux VPS (Nginx + Docker) or serverless deployment on Vercel/AWS, I handle provisioning, CI/CD, and monitoring so you stay focused on your business.",
  },
  {
    q: "Will I be able to update my own website content without coding?",
    a: "Yes. I can build a custom Admin Dashboard tailored to your workflow, or integrate a Headless CMS like Sanity or Strapi. Either way, you'll have full control over content — blogs, products, media — without touching any code.",
  },
  {
    q: "How do you ensure the security of e-commerce and payment systems?",
    a: "Security is non-negotiable. I use Stripe for PCI-compliant payments and JWT with secure HTTP-only cookies for authentication. Sensitive data never touches your server directly, and every API endpoint is protected with role-based access control.",
  },
  {
    q: "What are your rates and how is pricing structured?",
    a: "I work on a project-based (fixed-scope) or retainer model — hourly billing is available for smaller tasks. Rates depend on project complexity and timeline. The best way to get a number is to fill in the 'Request a quote' form on the Client Portal; I'll respond with a detailed breakdown within 24 hours.",
  },
  {
    q: "Who owns the source code and intellectual property after delivery?",
    a: "You do — full stop. Once the final payment is made, all source code, assets, and IP transfer to you completely. I retain no rights or back-doors. You can take the repo to any developer in the future without restrictions.",
  },
  {
    q: "Where are you based, and do you work with clients internationally?",
    a: "I'm based in Pakistan (UTC +5). I work fully remote and collaborate with clients across Europe, the US, and the Middle East without issue. Async-first communication means timezone gaps rarely slow things down.",
  },
  {
    q: "Are you open to full-time, part-time, or contract positions?",
    a: "Yes — recruiters are welcome. I'm open to full-time remote roles, contract engagements, and part-time collaborations, provided the work is in my stack (Next.js, Node.js, TypeScript, AI/ML adjacent). The best starting point is my GitHub (github.com/wahb-amir) and the projects here on this portfolio.",
  },
];

// ─── Full @graph ─────────────────────────────────────────────────────────────
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    // ── Person ───────────────────────────────────────────────────────────────
    {
      "@type": "Person",
      "@id": "https://wahb.space/#person",
      name: "Wahb Amir",
      alternateName: "Wahb",
      url: "https://wahb.space",
      image: "https://wahb.space/og-image.png",
      email: "mailto:wahbamir2010@gmail.com",
      jobTitle: "Full-Stack Engineer & AI Developer",
      description:
        "Full-stack engineer building high-performance web applications, applied AI tools and production-ready systems from idea to deployment.",
      sameAs: ["https://github.com/wahb-amir"],
      worksFor: { "@id": "https://buttnetworks.com/#org" },
      knowsAbout: [
        "Full-stack web development",
        "React.js",
        "Next.js",
        "Node.js",
        "MongoDB",
        "API development",
        "AI integration",
        "Machine learning",
        "Performance optimization",
        "DevOps basics",
        "SEO",
      ],
    },

    // ── Organisation ─────────────────────────────────────────────────────────
    {
      "@type": "Organization",
      "@id": "https://buttnetworks.com/#org",
      name: "Butt Networks",
      url: "https://buttnetworks.com",
    },

    // ── WebSite ──────────────────────────────────────────────────────────────
    {
      "@type": "WebSite",
      "@id": "https://wahb.space/#website",
      url: "https://wahb.space",
      name: "Wahb Amir Portfolio",
      publisher: { "@id": "https://wahb.space/#person" },
      inLanguage: "en",
    },

    // ── ProfilePage (homepage) ───────────────────────────────────────────────
    {
      "@type": "ProfilePage",
      "@id": "https://wahb.space/#home",
      url: "https://wahb.space",
      name: "Wahb Amir — Portfolio",
      description:
        "Portfolio homepage of Wahb Amir — full-stack engineer and AI developer showcasing projects, skills, timeline and contact options.",
      mainEntity: { "@id": "https://wahb.space/#person" },
      about: [
        "Full-stack development",
        "Artificial Intelligence",
        "Web applications",
        "Backend systems",
        "Machine learning",
      ],
      inLanguage: "en",
    },

    // ── ContactPage ──────────────────────────────────────────────────────────
    {
      "@type": "ContactPage",
      "@id": "https://wahb.space/#contact",
      url: "https://wahb.space/#contact",
      name: "Contact Wahb",
      description:
        "Contact page for inquiries, client portal access, or project quotes. Email and client portal available.",
      mainEntity: { "@id": "https://wahb.space/#person" },
      contactOption: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "mailto:wahbamir2010@gmail.com",
          availableLanguage: ["English"],
        },
      ],
      potentialAction: [
        {
          "@type": "CommunicateAction",
          name: "Send message",
          target: "https://wahb.space/#contact",
        },
        {
          "@type": "CommunicateAction",
          name: "Request a quote",
          target: "https://dashboard.wahb.space/#request-quote",
        },
      ],
    },

    // ── FAQPage ──────────────────────────────────────────────────────────────
    // Google surfaces up to ~10 FAQ rich results per page.
    // Order is preserved from faqList in FAQ.tsx (keep the two in sync).
    {
      "@type": "FAQPage",
      "@id": "https://wahb.space/#faq",
      url: "https://wahb.space/#faq",
      name: "FAQ — Wahb Amir",
      mainEntity: faqEntries.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: {
          "@type": "Answer",
          text: a,
        },
      })),
    },

    // ── Projects list ────────────────────────────────────────────────────────
    {
      "@type": "ItemList",
      "@id": "https://wahb.space/#projects",
      name: "Projects — Wahb Amir",
      url: "https://wahb.space/#projects",
      numberOfItems: 2,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: { "@id": "https://wahb.space/#project-dev-dashboard" },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: { "@id": "https://wahb.space/#project-ecom" },
        },
      ],
    },

    // ── Project: Client & Developer Collaboration Platform ───────────────────
    // FIX: URL corrected from projects.buttnetworks.com → dashboard.wahb.space
    {
      "@type": "SoftwareApplication",
      "@id": "https://wahb.space/#project-dev-dashboard",
      name: "Client & Developer Collaboration Platform",
      url: "https://dashboard.wahb.space",
      description:
        "A unified workspace where clients request quotes, track progress, message developers, and see real-time updates with GitHub automation.",
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      programmingLanguage: ["JavaScript", "TypeScript", "Node.js"],
      softwareRequirements: [
        "Next.js",
        "React",
        "Node.js",
        "MongoDB",
        "Tailwind CSS",
        "GitHub API",
      ],
      author: { "@id": "https://wahb.space/#person" },
      sameAs: [
        "https://github.com/wahb-amir/dev-dashboard",
        "https://github.com/wahb-amir/dashboard",
      ],
      datePublished: "2025-10-01",
    },

    {
      "@type": "SoftwareApplication",
      "@id": "https://wahb.space/#project-ecom",
      name: "Modern Online Store",
      url: "https://boltform.wahb.space",
      description:
        "Demo e-commerce store with secure checkout, admin view and performance optimizations — demonstrates full checkout funnel and Stripe integration.",
      applicationCategory: "ECommercePlatform",
      operatingSystem: "Web",
      programmingLanguage: ["JavaScript", "Node.js"],
      softwareRequirements: ["Next.js", "Stripe", "Tailwind CSS", "MongoDB"],
      author: { "@id": "https://wahb.space/#person" },
      sameAs: ["https://github.com/wahb-amir/Boltform"],
      datePublished: "2025-12-10",
    },

    // ── Source code ──────────────────────────────────────────────────────────
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://wahb.space/#code",
      name: "Selected source code — Wahb Amir",
      codeRepository: [
        "https://github.com/wahb-amir/dashboard",
        "https://github.com/wahb-amir/Boltform",
        "https://github.com/wahb-amir/Wahb-portfolio",
      ],
      creator: { "@id": "https://wahb.space/#person" },
    },

    // ── Services ─────────────────────────────────────────────────────────────
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-fullstack",
      name: "Full Stack Web Development",
      serviceType: "Full Stack Development",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "Building fast, secure, and scalable web applications using modern technologies (React, Next.js, Node.js, MongoDB).",
      keywords: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind"],
    },
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-frontend",
      name: "Frontend Development & UI/UX",
      serviceType: "Frontend Development",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "Pixel-perfect responsive frontends, component-driven UI, animations and accessibility with React, Next.js and Tailwind CSS.",
      keywords: [
        "React",
        "Next.js",
        "Tailwind",
        "Framer Motion",
        "Accessibility",
      ],
    },
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-backend",
      name: "Backend & API Development",
      serviceType: "Backend Development",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "Designing and implementing scalable REST/GraphQL APIs, authentication, database schema and business logic using Node.js and MongoDB.",
      keywords: ["Node.js", "Express", "MongoDB", "REST", "GraphQL"],
    },
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-api",
      name: "API Design & Integrations",
      serviceType: "API Development",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "API design, third-party integrations (Stripe, GitHub, OAuth), webhooks and realtime features using WebSockets or serverless functions.",
      keywords: ["Stripe", "GitHub API", "OAuth", "WebSocket"],
    },
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-seo",
      name: "Technical SEO & Performance",
      serviceType: "SEO",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "Technical SEO, structured data (JSON-LD), site performance optimization, CLS/LCP improvements and search engine indexability auditing.",
      keywords: [
        "SEO",
        "structured data",
        "performance",
        "Lighthouse",
        "indexability",
      ],
    },
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-ecom",
      name: "E-commerce Development",
      serviceType: "E-commerce Development",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "E-commerce storefronts, secure checkout, payments (Stripe), admin dashboards and order management systems.",
      keywords: ["Stripe", "Checkout", "E-commerce", "Admin Dashboard"],
    },
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-devops",
      name: "DevOps & Deployment",
      serviceType: "DevOps",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "VPS + NGINX deployments, CI/CD pipelines, container basics, PM2 process management and SSL automation (Let's Encrypt).",
      keywords: ["NGINX", "PM2", "CI/CD", "Let's Encrypt", "VPS"],
    },
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-mobile",
      name: "Mobile & Progressive Web Apps",
      serviceType: "PWA / Mobile",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "Progressive Web Apps and responsive mobile experiences with offline support, installability and performance-first design.",
      keywords: ["PWA", "Responsive", "Offline", "Mobile Performance"],
    },
    {
      "@type": "Service",
      "@id": "https://wahb.space/#service-ai",
      name: "AI Integration for Web Applications",
      serviceType: "AI Integration",
      provider: { "@id": "https://wahb.space/#person" },
      areaServed: "Worldwide",
      description:
        "Integrating applied AI tools and models into production web systems for enhanced user experience and automation.",
      keywords: ["AI", "Machine Learning", "Embedding", "NLP"],
    },
  ],
};
