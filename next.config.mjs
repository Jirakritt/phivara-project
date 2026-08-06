import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add production media domains here once hosting is decided.
    ],
  },
}

export default withPayload(nextConfig, { configPath: 'cms/payload.config.ts' })
