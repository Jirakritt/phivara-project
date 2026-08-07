import { withPayload } from '@payloadcms/next/withPayload'

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
}

export default withPayload(nextConfig, { configPath: 'cms/payload.config.ts' })
