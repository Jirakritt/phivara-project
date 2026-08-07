import type { MetadataRoute } from 'next'

// NEXT_PUBLIC_SERVER_URL already exists for admin links/emails/CORS (see
// .env.example) — reused here as the canonical site URL. Whoever deploys to
// production must set this to the real domain, or robots.txt/sitemap.xml
// will keep pointing at localhost.
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Generates /robots.txt. /admin is the Payload staff panel (cms/payload.config.ts's
// admin.user) and /api is Payload's REST/GraphQL surface plus our own
// /api/leads route — neither should be indexed or crawled.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
