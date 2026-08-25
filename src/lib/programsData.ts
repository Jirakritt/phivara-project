import type { LocaleCode } from './i18n'
import { translator } from './i18n'
import type { SeoData } from './payload'

import { findLocalized, hasLocaleContent, mapSeo, mediaUrl } from './payload'

// Card-level fields shown on /program and reused as the base of the detail
// page. Note: program.html's own client-side JS stripped the 2-bullet
// ".card-list" highlights from every rendered card (see
// `document.querySelectorAll(".card-list").forEach(list=>list.remove())`
// in the original inline script) and replaced the card-foot's note text
// with the price — so `highlights`/`cardNote` are captured in the CMS but
// intentionally not rendered on the card here, to match what the original
// page actually displayed.
//
// Per-locale filtering (see src/lib/payload.ts's findLocalized/
// hasLocaleContent): every getX() below takes a `locale` and only returns
// programs that actually have a `title` filled in for that exact locale —
// a program translated into th+en only will simply not appear when
// browsing /ja, rather than silently showing English or Thai text. The
// `xxxTh`/`xxxEn` fields on the returned objects both hold the SAME
// already-resolved-for-`locale` value (not real th/en text once locale is
// neither th nor en) — this is deliberate so every existing page.tsx call
// site's `t(item.xxxTh, item.xxxEn)` (see src/lib/i18n.ts's pickText)
// keeps working unmodified for every locale: pickText returns th for
// locale==='th', en for locale==='en', and falls back to the en slot for
// every other locale when its UI_DICTIONARY lookup misses (which it always
// will here, since these are per-record CMS strings, not static UI copy) —
// and since both slots already hold the correct resolved text, that
// fallback lands on the right value anyway. Do not "fix" this into a real
// th/en pair — it would break every non-th/en locale silently.
export interface ProgramCard {
  slug: string
  code: string
  category: string
  titleTh: string
  titleEn: string
  shortDescriptionTh: string
  shortDescriptionEn: string
  image: string
  price: number
  branchSlug: string
  branchTh: string
  branchEn: string
  searchKeywords: string
}

export interface ProgramCheckupItem {
  group: 'all' | 'male' | 'female'
  nameTh: string
  nameEn: string
  descriptionTh?: string
  descriptionEn?: string
}

export interface ProgramTerm {
  titleTh?: string
  titleEn?: string
  descriptionTh: string
  descriptionEn: string
}

export interface ProgramDetail extends ProgramCard {
  heroImage: string
  aboutProgramTh: string
  aboutProgramEn: string
  purposeList: Array<{ th: string; en: string }>
  audienceList: Array<{ th: string; en: string }>
  checkupItems: ProgramCheckupItem[]
  termsOfService: ProgramTerm[]
  contactLocationTh?: string
  contactLocationEn?: string
  contactHoursTh?: string
  contactHoursEn?: string
  contactPhone?: string
  seo: SeoData
}

export interface ProgramHighlightCard extends ProgramCard {
  shortDescriptionTh: string
}

function mapProgramCard(doc: any, locale: LocaleCode): ProgramCard {
  const t = translator(locale)
  const branch = doc.branch && typeof doc.branch === 'object' ? doc.branch : null
  const title = doc.title || ''
  const shortDescription = doc.shortDescription || ''
  // branch.name is the new per-locale field (see cms/collections/Branches.ts)
  // — if the linked branch itself hasn't been translated into `locale` yet,
  // fall back to the "all locations" microcopy rather than hiding the whole
  // program over a missing branch name specifically.
  const branchName = branch?.name || t('ทุกสาขา', 'All locations')
  return {
    slug: doc.slug,
    code: doc.code || '',
    category: doc.category,
    titleTh: title,
    titleEn: title,
    shortDescriptionTh: shortDescription,
    shortDescriptionEn: shortDescription,
    image: mediaUrl(doc.heroImage) || '/assets/images/treatments/expertise-longevity.jpg',
    price: doc.price,
    branchSlug: branch?.slug || '',
    branchTh: branchName,
    branchEn: branchName,
    searchKeywords: doc.searchKeywords || '',
  }
}

// /program catalog grid — every published program with a title in `locale`.
export async function getProgramsListing(locale: LocaleCode): Promise<ProgramCard[]> {
  const docs = await findLocalized<any>('programs', locale, {
    limit: 200,
    depth: 1,
    sort: 'slug',
    where: { _status: { equals: 'published' } },
  })
  return docs.filter((d) => hasLocaleContent(d.title)).map((d) => mapProgramCard(d, locale))
}

// "Signature Programs" on a doctor's detail page. The original
// doctor_detail.html hand-curated 4 programs for its one example doctor
// (Dr. Kobkulya) — there was no such curation for any of the other ~30
// real doctors. Rather than leave the section out or add a manual
// per-doctor picker field, this auto-matches by specialty: a longevity
// doctor sees longevity programs, a dermatology doctor sees dermatology
// programs, etc. — same category-first approach as getOtherArticles()'s
// "CONTINUE READING" matching on the article detail page.
export async function getDoctorSignaturePrograms(specialty: string, locale: LocaleCode, limit = 4): Promise<ProgramCard[]> {
  if (!specialty) return []
  const docs = await findLocalized<any>('programs', locale, {
    limit,
    depth: 1,
    sort: 'slug',
    where: { _status: { equals: 'published' }, category: { equals: specialty } },
  })
  return docs.filter((d) => hasLocaleContent(d.title)).map((d) => mapProgramCard(d, locale))
}

// Highlight carousel at the top of /program — program.html hardcoded
// exactly pv01/pv02/pv03/pv06 here; that's now the `featured` checkbox.
export async function getFeaturedPrograms(locale: LocaleCode): Promise<ProgramHighlightCard[]> {
  const docs = await findLocalized<any>('programs', locale, {
    limit: 10,
    depth: 1,
    sort: 'slug',
    where: { _status: { equals: 'published' }, featured: { equals: true } },
  })
  return docs.filter((d) => hasLocaleContent(d.title)).map((d) => mapProgramCard(d, locale))
}

// Rough Lexical richText -> plain paragraph text (same approach as
// doctorsData.ts's lexicalToPlainText — aboutProgram is always seeded as a
// single paragraph, see cms/seed/lib/lexical.ts).
function lexicalToPlainText(doc: any): string {
  if (!doc?.root?.children) return ''
  const lines: string[] = []
  const walk = (node: any) => {
    if (node.type === 'text') lines.push(node.text)
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  doc.root.children.forEach((node: any) => {
    walk(node)
    lines.push('\n')
  })
  return lines.join('').trim()
}

export async function getProgramDetail(slug: string, locale: LocaleCode): Promise<ProgramDetail | null> {
  const docs = await findLocalized<any>('programs', locale, {
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  const doc = docs[0]
  // No title in this locale = treated as "doesn't exist here" — same 404
  // the page already shows for a genuinely missing slug (see
  // src/app/[locale]/(public)/program/[slug]/page.tsx's `if (!program)
  // notFound()`), no extra code needed there.
  if (!doc || !hasLocaleContent(doc.title)) return null
  const card = mapProgramCard(doc, locale)
  const aboutProgram = lexicalToPlainText(doc.aboutProgram)

  return {
    ...card,
    heroImage: mediaUrl(doc.heroImage) || card.image,
    aboutProgramTh: aboutProgram,
    aboutProgramEn: aboutProgram,
    purposeList: (doc.purposeList || []).map((item: any) => ({ th: item.text || '', en: item.text || '' })),
    audienceList: (doc.audienceList || []).map((item: any) => ({ th: item.text || '', en: item.text || '' })),
    checkupItems: (doc.checkupItems || []).map((item: any) => ({
      group: item.group || 'all',
      nameTh: item.name || '',
      nameEn: item.name || '',
      descriptionTh: item.description || undefined,
      descriptionEn: item.description || undefined,
    })),
    termsOfService: (doc.termsOfService || []).map((term: any) => ({
      titleTh: term.title || undefined,
      titleEn: term.title || undefined,
      descriptionTh: term.description || '',
      descriptionEn: term.description || '',
    })),
    contactLocationTh: doc.contactOverride?.location,
    contactLocationEn: doc.contactOverride?.location,
    contactHoursTh: doc.contactOverride?.hours,
    contactHoursEn: doc.contactOverride?.hours,
    contactPhone: doc.contactOverride?.phone,
    seo: mapSeo(doc.seo),
  }
}

// The category dropdown's options used to live here as a static list
// (PROGRAM_CATEGORY_OPTIONS) that could never be edited from the CMS and
// had drifted out of sync with the homepage's own copy of the same 4
// labels. Both now come from a single source — see homeData.ts's
// getExpertiseCategoryOptions (reads cms/globals/HomeHero.ts's
// "หมวดความเชี่ยวชาญ" group, same fields the homepage tabs use).

// Branch filter options used to live here as a static list (PROGRAM_BRANCH_OPTIONS)
// that could go stale against the CMS. The Programs page now sources branches
// directly from homeData.branches (same CMS-backed list SiteFooter uses) instead.
