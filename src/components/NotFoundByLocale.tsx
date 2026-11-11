'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// Picks the 404 body for the visited locale from the URL, instead of the
// server reading an `x-phivara-locale` request header. Reading headers()
// anywhere in the [locale] segment (incl. not-found.tsx) makes every public
// page dynamic/no-store, which killed ISR and cost ~4s TTFB. The server
// renders one variant per content-ready locale (only when a 404 actually
// happens); this client component just shows the matching one.
export default function NotFoundByLocale({
  variants,
  fallback,
}: {
  variants: Record<string, ReactNode>
  fallback: string
}) {
  const seg = (usePathname() || '').split('/')[1] ?? ''
  return <>{variants[seg] ?? variants[fallback]}</>
}
