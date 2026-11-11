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

// Analytics (Google Tag Manager / GA4) is only ever loaded by
// public/js/consent-banner.js AFTER a visitor accepts the PDPA banner, and
// only when an id is set in .env (NEXT_PUBLIC_GTM_CONTAINER_ID or
// NEXT_PUBLIC_GA4_MEASUREMENT_ID) — but the browser still enforces this CSP
// on that late-injected <script> and on the hits it sends, so the Google
// hosts below must be allowed or tracking is silently blocked even with a
// correct id and consent. Kept to the minimum GTM + GA4 need. Not included
// (add only when actually used): Meta Pixel (connect.facebook.net in
// script-src, www.facebook.com in connect-src) and any extra hosts the
// marketing team's GTM tags pull in (Google Ads / remarketing:
// googleadservices.com, *.doubleclick.net, ...) — check the browser console
// for "Content Security Policy" errors after publishing a new GTM tag.
const googleTagManagerScript = 'https://www.googletagmanager.com'
const googleAnalyticsConnect = [
  'https://www.googletagmanager.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
].join(' ')

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${googleTagManagerScript}${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${googleAnalyticsConnect}`,
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
    // Optimized variants (see src/lib/imageOpt.ts) are served with this
    // lifetime. Safe to keep long: a CMS upload that replaces an image gets a
    // new filename, so the optimizer URL changes with it.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Three tiers (see src/lib/imageOpt.ts): 75 = hero backgrounds (soft, under
    // a scrim), 85 = brand photos (programs / articles / branches /
    // membership), 90 = detail-critical (doctor portraits, award certificates).
    // A `q` outside this list is rejected (400) by the optimizer.
    qualities: [75, 85, 90],
    remotePatterns: [
      // Add production media domains here once hosting is decided.
    ],
  },
  // `next build` prerenders th/en for every public page (ISR, see
  // docs/notes/ISR-และการ-cache.md). On the VPS those renders are slow (CPU/DB
  // bound, see docs/notes/page-performance-ค้างตรวจ.md) and often exceed Next's
  // default 60s per-page limit ("Failed to build /th ... took more than 60
  // seconds"), forcing retries or failing the deploy. Allow 180s per page.
  staticPageGenerationTimeout: 180,
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
      // Caching (PageSpeed "Use efficient cache lifetimes", ~16 MB flagged):
      // Payload serves /api/media/file/* with NO Cache-Control and the files
      // under public/ default to max-age=0, so every repeat visit re-downloaded
      // everything. CMS uploads: long cache — a replacement upload gets a new
      // filename. Repo assets (images/fonts/logos): a week. CSS/JS in public/
      // are NOT content-hashed, so keep them short (1h) so a deploy shows up
      // quickly. /_next/static is already immutable by Next.
      {
        source: '/api/media/file/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        source: '/logo/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        source: '/css/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' }],
      },
      {
        source: '/js/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' }],
      },
    ]
  },
}

export default withPayload(nextConfig, { configPath: 'cms/payload.config.ts' })
