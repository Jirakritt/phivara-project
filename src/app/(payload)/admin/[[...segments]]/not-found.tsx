import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// See page.tsx in this same folder for why the cast is needed — Payload's
// types don't allow `undefined` values in searchParams, Next.js 15's real
// PageProps type always does.
type PayloadSearchParams = Promise<{ [key: string]: string | string[] }>

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams: searchParams as PayloadSearchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams: searchParams as PayloadSearchParams })

export default NotFound
