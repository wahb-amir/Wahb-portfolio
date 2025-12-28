/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://wahb.space",
  generateRobotsTxt: true,
  exclude: ["*"],
  additionalPaths: async (config) => [
    // Homepage — max priority
    {
      loc: `${config.siteUrl}/`,
      priority: 1.0,
      changefreq: "daily",
      lastmod: new Date().toISOString(),
    },

    // Projects (fixed URLs)
    {
      loc: `https://dashboard.wahb.space`,
      priority: 0.9,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },
    {
      loc: `https://boltform.wahb.space`,
      priority: 0.9,
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    },

    // LLM / AI metadata
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
