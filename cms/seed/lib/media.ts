import path from 'node:path'

import type { Payload } from 'payload'

// The static site reuses the same placeholder images across many doctors
// and programs (e.g. assets/images/doctors/dr02.png appears on ~6 profiles).
// This cache makes sure we upload each source file to Payload's Media
// collection once, then reuse that Media doc's id everywhere it's referenced.
//
// IMPORTANT: keep doc.id in its native type. The Postgres adapter uses
// numeric (serial) IDs — stringifying them (e.g. `String(doc.id)`) makes
// every upload/relationship field referencing it fail validation, since
// Payload checks the ID type against the related collection's real ID type.
const cache = new Map<string, Promise<string | number>>()

const ASSETS_ROOT = path.join(process.cwd(), 'phivara-design-html')

export function getOrCreateMedia(
  payload: Payload,
  relativePath: string,
  alt: { th: string; en: string },
): Promise<string | number> {
  if (!cache.has(relativePath)) {
    const promise = (async () => {
      const filePath = path.join(ASSETS_ROOT, relativePath)
      const doc = await payload.create({
        collection: 'media',
        data: { alt: alt.th },
        filePath,
        locale: 'th',
      })
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: { alt: alt.en },
        locale: 'en',
      })
      return doc.id
    })()
    cache.set(relativePath, promise)
  }
  return cache.get(relativePath) as Promise<string | number>
}
