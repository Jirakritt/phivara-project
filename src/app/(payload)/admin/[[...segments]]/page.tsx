import type { Metadata } from 'next'

import config from '@payload-config'
import '@payloadcms/next/css'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Payload's `generatePageMetadata`/`RootPage` types expect
// `searchParams: Promise<{ [key: string]: string | string[] }>` (no
// `undefined`), while Next.js 15's real PageProps type always allows
// `undefined` for a missing query param. Narrowing cast at the call
// boundary — Payload only reads specific known keys internally, so the
// wider real-world type is safe to pass through.
type PayloadSearchParams = Promise<{ [key: string]: string | string[] }>

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams: searchParams as PayloadSearchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams: searchParams as PayloadSearchParams })

export default Page
