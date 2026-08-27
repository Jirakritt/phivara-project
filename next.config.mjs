import { withPayload } from '@payloadcms/next/withPayload'

// Baseline security headers — see the site's security review notes. This
// is a starter/reasonably-permissive CSP (script-src/style-src allow
// 'unsafe-inline' because the site injects several inline <script> blocks
// per page via dangerouslySetInnerHTML — see every (public)/**/page.tsx's
// `dataScript`/`analyticsScript`, and Payload's own admin UI likewise
// relies on inline styles). A stricter nonce-based CSP that drops
// 'unsafe-inline' is real follow-up work, not something to retrofit here
// without testing every page and the admin panel against it first.
// Confirmed with the team that the site is served over HTTPS everywhere in
// production, so Strict-Transport-Security is safe to set unconditionally.
//
// `unsafe-eval` is added to script-src ONLY in development — Next.js dev
// mode's Fast Refresh/HMR runtime (main-app.js) uses eval() internally, and
// without this the entire dev bundle fails to load (blank page, "Uncaught
// EvalError" in console). Production's build output doesn't need it, so
// prod keeps the tighter policy.
const isDev = process.env.NODE_ENV === 'development'
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add production media domains here once hosting is decided.
    ],
  },
  experimental: {
    // Needed so src/app/global-not-found.tsx can catch URLs that don't
    // match any route at all — this app has two root layouts ((frontend)
    // and (payload) for the Payload admin panel), so there's no single
    // layout tree a normal root not-found.tsx could compose a 404 from.
    // See global-not-found.tsx's top comment for the full explanation.
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withPayload(nextConfig, { configPath: 'cms/payload.config.ts' })
