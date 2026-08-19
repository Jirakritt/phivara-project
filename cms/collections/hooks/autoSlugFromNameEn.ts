import type { CollectionBeforeValidateHook } from 'payload'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Auto-fills `slug` from `name` (e.g. "Dr. Punnawit Sirimetha" ->
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
  const hasSlug = typeof data.slug === 'string' && data.slug.trim().length > 0
  if (hasSlug) return data

  // `name` is localized, so unlike the old flat `nameEn` it isn't
  // guaranteed to hold Latin text — only usable if the locale currently
  // being saved happens to slugify to something non-empty (i.e. it's the
  // en tab, or any locale typed in Latin characters).
  const currentName = typeof data.name === 'string' ? data.name : undefined
  let source = currentName && slugify(currentName) ? currentName : undefined

  // Otherwise (e.g. an editor is filling in the th tab first on a brand-new
  // doctor, or switching locales on an existing one), explicitly fetch the
  // doc's own en-locale name — the one locale guaranteed to produce a
  // usable Latin slug once it's been saved at all.
  if (!source && originalDoc?.id) {
    const enDoc = await req.payload.findByID({
      collection: collection.slug as 'doctors',
      id: originalDoc.id,
      locale: 'en',
      depth: 0,
    })
    const enName = typeof (enDoc as unknown as Record<string, unknown>)?.name === 'string'
      ? ((enDoc as unknown as Record<string, unknown>).name as string)
      : undefined
    source = enName && slugify(enName) ? enName : undefined
  }

  // Nothing sensible to slugify from yet (brand-new doc, non-Latin locale
  // being filled in first) — leave blank for the editor to fill in manually
  // once they switch to a Latin-text locale.
  if (!source) return data

  const base = slugify(source) || 'doctor'
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
