import type { LocaleCode } from './i18n'
import type { SeoData } from './payload'

import { findLocalized, hasLocaleContent, mapSeo, mediaUrl } from './payload'

// Per-locale filtering (see src/lib/payload.ts's findLocalized/
// hasLocaleContent, and programsData.ts's file comment for the full
// rationale). A doctor now counts as "available" in a locale when the new
// localized `name` field (cms/collections/Doctors.ts — added alongside the
// old flat nameTh/nameEn, see that field's comment and
// cms/scripts/backfillLocalizedNames.ts) has content for that locale, not
// the old nameTh/nameEn pair. `xxxTh`/`xxxEn` on the returned objects both
// hold the SAME already-resolved value — see programsData.ts's comment for
// why.
export interface DoctorCard {
  id: string | number
  slug: string
  image: string
  branchSlug: string
  branchTh: string
  branchEn: string
  specialty: string
  nameTh: string
  nameEn: string
  noteTh: string
  noteEn: string
  subTh: string
  subEn: string
}

// Full profile — only populated for doctors that have the "rich" fields
// filled in (bio/credentialGroups/schedule). Most doctors only have the
// card-level fields above; getDoctorDetail() returns `rich: null` for those
// and the page renders a simpler fallback layout instead of guessing.
export interface DoctorRichProfile {
  hospitalTitleTh: string
  hospitalTitleEn: string
  boardCertificationTh: string
  boardCertificationEn: string
  tags: Array<{ th: string; en: string }>
  bioTh: string
  bioEn: string
  credentialGroups: Array<{
    headingTh: string
    headingEn: string
    items: Array<{ th: string; en: string }>
  }>
  schedule: Array<{ day: string; hours: string; locationNameTh: string; locationNameEn: string }>
  contactIntroTh: string
  contactIntroEn: string
  contactFactTh: string
  contactFactEn: string
}

export interface DoctorDetail extends DoctorCard {
  portraitImage: string
  rich: DoctorRichProfile | null
  seo: SeoData
}

export interface DoctorJournalCard {
  slug: string
  image: string
  categoryTh: string
  categoryEn: string
  titleTh: string
  titleEn: string
  summaryTh: string
  summaryEn: string
  dateTh: string
  dateEn: string
  readTimeTh: string
  readTimeEn: string
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
function formatThaiDate(dateString: string): string {
  const d = new Date(dateString)
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`
}
function formatEnDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function mapDoctorCard(doc: any): DoctorCard {
  const branch = doc.branch && typeof doc.branch === 'object' ? doc.branch : null
  const name = doc.name
  const note = doc.specialtyLabel || ''
  const sub = doc.subNote || ''
  return {
    id: doc.id,
    slug: doc.slug,
    image: mediaUrl(doc.cardPhoto) || mediaUrl(doc.portrait) || '/assets/images/doctors/dr01.png',
    branchSlug: branch?.slug || '',
    branchTh: branch?.name || '',
    branchEn: branch?.name || '',
    specialty: doc.specialty || '',
    nameTh: name,
    nameEn: name,
    noteTh: note,
    noteEn: note,
    subTh: sub,
    subEn: sub,
  }
}

// Doctor listing (/doctor) — every published doctor with a `name` in `locale`.
export async function getDoctorsListing(locale: LocaleCode): Promise<DoctorCard[]> {
  const docs = await findLocalized<any>('doctors', locale, {
    limit: 200,
    depth: 1,
    sort: 'slug',
    where: { _status: { equals: 'published' } },
  })
  return docs.filter((d) => hasLocaleContent(d.name)).map(mapDoctorCard)
}

// Very rough Lexical richText -> plain paragraphs extractor. The seed script
// only ever wrote single-paragraph richText for doctor bios (see
// cms/seed/lib/lexical.ts), so this doesn't need to handle every possible
// Lexical node type — just enough to pull the text back out.
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

export async function getDoctorDetail(slug: string, locale: LocaleCode): Promise<DoctorDetail | null> {
  const docs = await findLocalized<any>('doctors', locale, {
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  const doc = docs[0]
  if (!doc || !hasLocaleContent(doc.name)) return null
  const card = mapDoctorCard(doc)

  const hasRich = Boolean(doc.bio || (doc.credentialGroups && doc.credentialGroups.length) || (doc.schedule && doc.schedule.length))
  const rich: DoctorRichProfile | null = hasRich
    ? {
        hospitalTitleTh: doc.hospitalTitle || '',
        hospitalTitleEn: doc.hospitalTitle || '',
        boardCertificationTh: doc.boardCertification || '',
        boardCertificationEn: doc.boardCertification || '',
        tags: (doc.tags || []).map((tag: any) => {
          const label = tag.label || ''
          return { th: label, en: label }
        }),
        bioTh: lexicalToPlainText(doc.bio),
        bioEn: lexicalToPlainText(doc.bio),
        credentialGroups: (doc.credentialGroups || []).map((group: any) => ({
          headingTh: group.heading || '',
          headingEn: group.heading || '',
          items: (group.items || []).map((item: any) => {
            const text = item.text || ''
            return { th: text, en: text }
          }),
        })),
        schedule: (doc.schedule || []).map((row: any) => ({
          day: row.day,
          hours: row.hours,
          locationNameTh: row.locationName || '',
          locationNameEn: row.locationName || '',
        })),
        contactIntroTh: doc.contactIntro || '',
        contactIntroEn: doc.contactIntro || '',
        contactFactTh: doc.contactFact || '',
        contactFactEn: doc.contactFact || '',
      }
    : null

  return {
    ...card,
    portraitImage: mediaUrl(doc.portrait) || mediaUrl(doc.cardPhoto) || '/assets/images/doctors/dr01.png',
    rich,
    seo: mapSeo(doc.seo),
  }
}

// "Doctor's Journal" — real articles that reference this doctor via
// Articles.relatedDoctors, not hardcoded like the original static page.
export async function getDoctorJournalArticles(doctorId: string | number, locale: LocaleCode): Promise<DoctorJournalCard[]> {
  const docs = await findLocalized<any>('articles', locale, {
    limit: 3,
    depth: 1,
    sort: '-publishedDate',
    where: {
      _status: { equals: 'published' },
      relatedDoctors: { in: [doctorId] },
    },
  })
  return docs
    .filter((d) => hasLocaleContent(d.title))
    .map((doc) => {
      const title = doc.title
      const category = doc.categoryLabel || ''
      const summary = doc.summary || ''
      return {
        slug: doc.slug,
        image: mediaUrl(doc.coverImage) || '/assets/images/doctors/jr-01.png',
        categoryTh: category,
        categoryEn: category,
        titleTh: title,
        titleEn: title,
        summaryTh: summary,
        summaryEn: summary,
        dateTh: formatThaiDate(doc.publishedDate),
        dateEn: formatEnDate(doc.publishedDate),
        readTimeTh: `${doc.readTimeMinutes} นาที`,
        readTimeEn: `${doc.readTimeMinutes} min`,
      }
    })
}

// Branch filter options used to live here as a static list (BRANCH_FILTER_OPTIONS)
// that could go stale against the CMS. The Doctor page now sources branches
// directly from homeData.branches (same CMS-backed list SiteFooter uses) instead —
// same fix applied to PROGRAM_BRANCH_OPTIONS in programsData.ts.

// The specialty dropdown's options (and the hero "spec-pill" row) used to
// live here as a static list (SPECIALTY_FILTER_OPTIONS) that could never
// be edited from the CMS and had drifted out of sync both with the
// homepage's own copy of the same 4 labels AND with each other on this
// same page. Both now come from a single source — see homeData.ts's
// getExpertiseCategoryOptions (reads cms/globals/HomeHero.ts's
// "หมวดความเชี่ยวชาญ" group, same fields the homepage tabs use).
