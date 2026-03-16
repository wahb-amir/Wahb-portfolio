/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://wahb.space",
  generateRobotsTxt: true,
  exclude: ["*"],
  additionalPaths: async (config) => [
    // ── Portfolio pages ───────────────────────────────────────────────────────

    // Homepage — max priority
    {
      loc: `${config.siteUrl}/`,
      priority: 1.0,
      changefreq: "daily",
      lastmod: new Date().toISOString(),
    },

    // All projects page
    {
      loc: `${config.siteUrl}/projects`,
      priority: 0.9,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },

    // ── Individual project pages ──────────────────────────────────────────────

    {
      loc: `${config.siteUrl}/projects/ecolens`,
      priority: 1.0,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${config.siteUrl}/projects/client-dev-platform`,
      priority: 0.9,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${config.siteUrl}/projects/ecom-1`,
      priority: 0.9,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },

    // ── Live projects ─────────────────────────────────────────────────────────

    // EcoLens — 3rd Place Hack for Humanity 2026
    {
      loc: `https://eco.wahb.space`,
      priority: 1.0,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },

    // Client & Developer Collaboration Platform
    {
      loc: `https://dashboard.wahb.space`,
      priority: 0.9,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },

    // Modern Online Store
    {
      loc: `https://boltform.wahb.space`,
      priority: 0.9,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },

    // ── Developer profiles ────────────────────────────────────────────────────

    {
      loc: `https://github.com/wahb-amir`,
      priority: 0.8,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },

    // ── LLM / AI metadata ─────────────────────────────────────────────────────

    {
      loc: `${config.siteUrl}/llms.txt`,
      priority: 0.5,
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${config.siteUrl}/ai.json`,
      priority: 0.5,
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
    },
  ],
};