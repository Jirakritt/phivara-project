import { readFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

// Serves the static CMS user-manual pages (cms-manual/*.html at the project
// root, written for the admin team) straight from disk at /cms-manual/... —
// so the admin panel (cms/admin/components/ManualView.tsx, embedded via an
// iframe) can render them without duplicating the files into `public/` or
// rebuilding them as React admin views. The manual's own files were
// authored to be opened directly off disk too (img
// src="../public/assets/..."), so that one relative path gets rewritten to
// the real site-served "/assets/..." URL below; everything else (the
// internal index.html / doctors.html-style nav links) already resolves
// correctly as browser-relative URLs.
//
// Gated behind a real Payload session (same cookie the /admin panel uses) —
// the iframe is same-origin, so the browser sends that cookie automatically
// and this check sees the logged-in user with no extra wiring. Anyone
// hitting this URL directly without a session gets redirected to the admin
// login screen instead of the raw HTML.
const MANUAL_DIR = path.join(process.cwd(), 'cms-manual')

export async function GET(req: NextRequest, context: { params: Promise<{ slug?: string[] }> }) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('redirect', '/admin/manual')
    return NextResponse.redirect(loginUrl)
  }

  const { slug } = await context.params
  const requested = slug && slug.length > 0 ? slug.join('/') : 'index.html'

  const filePath = path.join(MANUAL_DIR, requested)
  // Block path traversal — resolved path must stay inside MANUAL_DIR.
  if (filePath !== MANUAL_DIR && !filePath.startsWith(MANUAL_DIR + path.sep)) {
    return new NextResponse('Not found', { status: 404 })
  }
  if (!filePath.endsWith('.html')) {
    return new NextResponse('Not found', { status: 404 })
  }

  try {
    const html = await readFile(filePath, 'utf-8')
    const rewritten = html.replaceAll('../public/assets/', '/assets/')
    return new NextResponse(rewritten, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
