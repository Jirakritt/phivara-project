import { getPayloadClient } from './payload'

// Builds the CSS for the site-wide grayscale mode (cms/globals/GrayscaleMode.ts),
// or '' when it's off / outside its schedule / anything goes wrong. Returned
// as a plain string so both root layouts ([locale]/layout.tsx and
// global-not-found.tsx) can inject it into a <style> tag in <head> — it's in
// the server-rendered HTML, so visitors never see a flash of colour first.
//
// `filter` on the root element (rather than <body>) keeps position:fixed
// children (header, popup, banners) anchored to the viewport and greys the
// whole canvas, backdrop included. Fails open (no filter) on any error so a
// broken settings document can never take the site down.
export async function getGrayscaleCss(): Promise<string> {
  try {
    const payload = await getPayloadClient()
    const s = (await payload.findGlobal({ slug: 'grayscale-mode' })) as unknown as {
      enabled?: boolean | null
      level?: string | null
      startAt?: string | null
      endAt?: string | null
    }
    if (!s?.enabled) return ''

    const now = Date.now()
    if (s.startAt && now < new Date(s.startAt).getTime()) return ''
    if (s.endAt && now > new Date(s.endAt).getTime()) return ''

    const level = Math.min(100, Math.max(0, Math.round(Number(s.level ?? 100) / 10) * 10))
    if (!Number.isFinite(level) || level <= 0) return ''
    return `html{-webkit-filter:grayscale(${level}%);filter:grayscale(${level}%)}`
  } catch {
    return ''
  }
}
