import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/_next/', '/api/', '/drafts/', '/private/'],
    },
    sitemap: [
      'https://wahb.space/sitemap.xml',
      'https://clearpath.wahb.space/sitemap.xml',
      'https://eco.wahb.space/sitemap.xml',
      'https://econoquest.wahb.space/sitemap.xml',
      'https://boltform.wahb.space/sitemap.xml'
    ]
  }
}
