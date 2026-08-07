import type { CollectionBeforeValidateHook } from 'payload'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Auto-fills `slug` from `nameEn` (e.g. "Dr. Punnawit Sirimetha" ->
// "dr-punnawit-sirimetha") whenever the editor leaves the slug field blank,
// so editors no longer have to invent sequential ids like "dr30" by hand.
// Editors can still type their own slug — this only kicks in when the field
// is empty. If the generated slug collides with another doctor's, a numeric
// suffix (-2, -3, ...) is appended so the collection's unique constraint
// still holds.
export const autoSlugFromNameEn: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
  collection,
}) => {
  if (!data) return data
  const nameEn = (data.nameEn ?? originalDoc?.nameEn) as string | undefined
  const hasSlug = typeof data.slug === 'string' && data.slug.trim().length > 0
  if (hasSlug || !nameEn) return data

  const base = slugify(nameEn) || 'doctor'
  let candidate = base
  let suffix = 2

  // Guard against colliding with another doc's slug (unique field).
  // eslint-disable-next-line no-await-in-loop
  while (
    (
      await req.payload.find({
        collection: collection.slug as 'doctors',
        where: {
          slug: { equals: candidate },
          ...(originalDoc?.id ? { id: { not_equals: originalDoc.id } } : {}),
        },
        limit: 1,
        depth: 0,
      })
    ).totalDocs > 0
  ) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  data.slug = candidate
  return data
}
