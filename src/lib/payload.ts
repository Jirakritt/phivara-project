import { cache } from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

// Payload runs embedded inside this Next.js app (not a separate service),
// so Server Components can talk to it directly via the Local API — no HTTP
// round-trip needed. `cache()` de-dupes repeated calls within one request.
export const getPayloadClient = cache(async () => {
  return getPayload({ config })
})

/**
 * Fetch a collection in both site locales and zip the two result sets
 * together by id, so mapper functions can read `th.field` / `en.field`
 * side by side.
 *
 * We deliberately run two `locale`-scoped queries instead of a single
 * `locale: 'all'` query: Postgres stores each locale's array-field rows as
 * a fully separate set (see cms/seed/seed.ts for the same gotcha during
 * seeding), so pairing two clean single-locale result sets is more
 * predictable than reasoning about how `locale: 'all'` merges array rows.
 */
export async function findBothLocales<T extends { id: string | number }>(
  collection: string,
  options: Record<string, unknown> = {},
): Promise<Array<{ th: T; en: T | undefined }>> {
  const payload = await getPayloadClient()

  const [thResult, enResult] = await Promise.all([
    payload.find({ collection: collection as any, locale: 'th', ...options }) as Promise<{
      docs: T[]
    }>,
    payload.find({ collection: collection as any, locale: 'en', ...options }) as Promise<{
      docs: T[]
    }>,
  ])

  const enById = new Map(enResult.docs.map((doc) => [doc.id, doc]))

  return thResult.docs.map((doc) => ({ th: doc, en: enById.get(doc.id) }))
}

/**
 * Fetches a collection at exactly one locale, with Payload's automatic
 * locale fallback (`fallback: true` in payload.config.ts's `localization`
 * block) explicitly turned OFF for this call via `fallbackLocale: false`.
 * Without this, an empty field in `locale` would silently come back filled
 * with the defaultLocale's (th) value, making it impossible to tell
 * "translated into this locale" from "not translated yet" — exactly the
 * distinction hasLocaleContent() below exists to make. See i18n.ts's
 * pickText() comment for how this differs from the old th/en-only model:
 * that fell back en->th text within one field; this instead hides whole
 * records that have no content in the requested locale at all.
 */
export async function findLocalized<T extends { id: string | number }>(
  collection: string,
  locale: string,
  options: Record<string, unknown> = {},
): Promise<T[]> {
  const payload = await getPayloadClient()
  const result = (await payload.find({
    collection: collection as any,
    locale: locale as any,
    fallbackLocale: false,
    ...options,
  })) as { docs: T[] }
  return result.docs
}

/**
 * A record counts as "available" in a locale when its primary display
 * field (title/name/etc, whichever a given *Data.ts fetcher designates)
 * is a non-empty string for that locale. Centralized here so every
 * collection applies the same "empty/undefined/null = not translated yet"
 * rule consistently.
 */
export function hasLocaleContent(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/** Pull a usable URL out of an upload relationship field, whatever depth returned. */
export function mediaUrl(field: unknown): string | undefined {
  if (field && typeof field === 'object' && 'url' in field) {
    const url = (field as { url?: string | null }).url
    return url ?? undefined
  }
  return undefined
}

/**
 * Pull the `og` image size (1200x630, see Media.ts) out of an upload
 * relationship field for use as an Open Graph share image — falls back to
 * the original file if the `og` size isn't available (e.g. a non-image
 * upload, or a file uploaded before the `og` size existed).
 */
export function mediaOgUrl(field: unknown): string | undefined {
  if (field && typeof field === 'object') {
    const sizes = (field as { sizes?: { og?: { url?: string | null } } }).sizes
    if (sizes?.og?.url) return sizes.og.url
  }
  return mediaUrl(field)
}

/**
 * Shape of the `seo` group shared across Articles/Programs/Doctors (see
 * cms/fields/seo.ts). All fields optional — callers should fall back to the
 * page's own title/summary/cover image when these are blank.
 */
export interface SeoData {
  title?: string
  description?: string
  ogImage?: string
  noIndex: boolean
}

/** Maps a raw `seo` group value (as returned by the Local API) to SeoData. */
export function mapSeo(seo: unknown): SeoData {
  const s = (seo || {}) as { title?: string; description?: string; ogImage?: unknown; noIndex?: boolean }
  return {
    title: s.title || undefined,
    description: s.description || undefined,
    ogImage: mediaOgUrl(s.ogImage),
    noIndex: Boolean(s.noIndex),
  }
}
