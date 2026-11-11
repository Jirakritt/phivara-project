import type { FieldHook } from 'payload'

// Field-level `beforeValidate` for every public `slug` field (Doctors, Articles,
// Branches, Programs). Editors can type a custom slug, and a stray leading/
// trailing space (or a space inside) was saved as-is: e.g. 'dr-pailin-puangpet-pt2 '
// made that doctor's page 404 in both locales and put a broken URL in sitemap.xml.
// Trims the value and turns inner whitespace into '-'. Case is left alone so
// existing slugs keep working.
export const normalizeSlugValue = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, '-') : value

export const trimSlug: FieldHook = ({ value }) => normalizeSlugValue(value)
