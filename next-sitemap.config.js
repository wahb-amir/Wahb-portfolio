/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://wahb.space",
  generateRobotsTxt: true,

  robotsTxtOptions: {
    additionalSitemaps: [
      "https://clearpath.wahb.space/sitemap.xml",
      "https://eco.wahb.space/sitemap.xml",
      "https://econoquest.wahb.space/sitemap.xml",
      "https://boltform.wahb.space/sitemap.xml",
    ],
  },

  additionalPaths: async (config) => [
    {
      loc: `${config.siteUrl}/llms.txt`,
      priority: 0.7,
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${config.siteUrl}/ai.json`,
      priority: 0.7,
      changefreq: "monthly",
      lastmod: new Date().toISOString(),
    },
  ],
};
