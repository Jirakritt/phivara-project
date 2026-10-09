import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { DEFAULT_LOCALE, isLocaleCode, translator } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'

// Serves the homepage "special day" popup (cms/collections/Popups.ts) to
// src/components/HomePopup.tsx. Deliberately a runtime route instead of
// data baked into the homepage: the homepage is ISR (revalidate = 60 — see
// (public)/page.tsx), so a popup's start/end time evaluated at render time
// could be stale by up to a minute and, worse, frozen into the cached HTML
// across the schedule boundary. Evaluating `now` here on every request keeps
// start/stop times and the admin's on/off switch exact.
//
// Returns only what the browser needs (never the schedule or title), and
// at most ONE popup: the active one that started most recently.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const rawLocale = request.nextUrl.searchParams.get('locale') || ''
  const locale = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const noStore = { 'Cache-Control': 'no-store' }

  try {
    const payload = await getPayloadClient()
    const nowIso = new Date().toISOString()
    const { docs } = await payload.find({
      collection: 'popups',
      where: {
        and: [
          { enabled: { equals: true } },
          { startAt: { less_than_equal: nowIso } },
          { endAt: { greater_than_equal: nowIso } },
        ],
      },
      sort: '-startAt',
      limit: 1,
      depth: 1,
      locale,
      fallbackLocale: DEFAULT_LOCALE,
    })

    const doc = docs[0]
    const image = doc && typeof doc.image === 'object' && doc.image ? doc.image : null
    if (!doc || !image?.url) return NextResponse.json({ popup: null }, { headers: noStore })

    // Fullscreen splash needs its mobile image too; without it (shouldn't
    // happen — the CMS requires it) fall back to the box popup rather than
    // showing a badly cropped desktop image on phones.
    const mobile = doc.imageMobile && typeof doc.imageMobile === 'object' ? doc.imageMobile : null
    const isFullscreen = doc.displayMode === 'fullscreen' && Boolean(mobile?.url)
    const t = translator(locale)

    return NextResponse.json(
      {
        popup: {
          // Campaign identity for the browser-side cooldown: a new popup or a
          // replaced image is a new round (shows immediately); editing only
          // the schedule/interval keeps the same key. `updatedAt` of the
          // media doc is part of it so re-uploading over the same media
          // record also counts as a new image.
          key: `${doc.id}:${isFullscreen ? 'fs' : 'md'}:${image.id}:${image.updatedAt || ''}${
            isFullscreen ? `:${mobile!.id}:${mobile!.updatedAt || ''}` : ''
          }`,
          mode: isFullscreen ? 'fullscreen' : 'modal',
          imageUrl: image.url,
          mobileImageUrl: isFullscreen ? mobile!.url : null,
          buttonLabel: doc.buttonLabel || t('เข้าสู่เว็บไซต์', 'Enter Website'),
          width: image.width || null,
          height: image.height || null,
          alt: doc.alt || doc.title,
          linkUrl: doc.linkUrl || null,
          reshowIntervalMinutes: doc.reshowIntervalMinutes > 0 ? doc.reshowIntervalMinutes : 15,
        },
      },
      { headers: noStore },
    )
  } catch (err) {
    // A failure here must never break the homepage — the popup just doesn't show.
    console.error('[popup/active] failed:', err)
    return NextResponse.json({ popup: null }, { status: 200, headers: noStore })
  }
}
