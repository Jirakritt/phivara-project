import type { LocaleCode } from './i18n'
import type { SeoData } from './payload'

import { findLocalized, getPayloadClient, hasLocaleContent, mapSeo, mediaUrl } from './payload'

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
  // Branches.displayOrder (0 default) — carried through so
  // groupDoctorsByName() can sort a merged card's branches the same way
  // homeData.ts/branchesData.ts order branches everywhere else on the
  // site, instead of whatever order the doctor records themselves happen
  // to sort in (see that function's comment).
  branchDisplayOrder: number
  specialty: string
  nameTh: string
  nameEn: string
  noteTh: string
  noteEn: string
  subTh: string
  subEn: string
  // "แพทย์หลักประจำสาขา" fields (cms/collections/Doctors.ts) — only
  // meaningful when isBranchFeatured is true.
  isBranchFeatured: boolean
  // Deliberately separate from `image` (cardPhoto/portrait) — the featured
  // card uses this as a wide 16:9 background-image, not a square/portrait
  // photo-frame, so the two are never interchangeable (see the
  // `featuredPhoto` field comment on Doctors.ts). Falls back to `image`
  // only so a doctor checked as featured without this filled in doesn't
  // render with a missing image — see mapDoctorCard below.
  featuredImage: string
  quoteTh: string
  quoteEn: string
  // subSpecialty (not boardCertification — that's a different field, used
  // on /doctor for credential text) powers the featured card's second spec
  // row ("ความชำนาญพิเศษเฉพาะทาง"), alongside noteTh/noteEn
  // (specialtyLabel) for the first ("ความชำนาญ").
  subSpecialtyTh: string
  subSpecialtyEn: string
  featuredHighlights: Array<{ th: string; en: string }>
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
  const quote = doc.quote || ''
  const subSpecialty = doc.subSpecialty || ''
  const image = mediaUrl(doc.cardPhoto) || mediaUrl(doc.portrait) || '/assets/images/doctors/dr01.png'
  return {
    id: doc.id,
    slug: doc.slug,
    image,
    branchSlug: branch?.slug || '',
    branchTh: branch?.name || '',
    branchEn: branch?.name || '',
    branchDisplayOrder: typeof branch?.displayOrder === 'number' ? branch.displayOrder : 0,
    specialty: doc.specialty || '',
    nameTh: name,
    nameEn: name,
    noteTh: note,
    noteEn: note,
    subTh: sub,
    subEn: sub,
    isBranchFeatured: Boolean(doc.isBranchFeatured),
    featuredImage: mediaUrl(doc.featuredPhoto) || image,
    quoteTh: quote,
    quoteEn: quote,
    subSpecialtyTh: subSpecialty,
    subSpecialtyEn: subSpecialty,
    featuredHighlights: (doc.featuredHighlights || []).map((h: any) => {
      const text = h.text || ''
      return { th: text, en: text }
    }),
  }
}

// Doctor listing (/doctor) — every published doctor with a `name` in `locale`.
export async function getDoctorsListing(locale: LocaleCode): Promise<DoctorCard[]> {
  const docs = await findLocalized<any>('doctors', locale, {
    limit: 200,
    depth: 1,
    sort: ['displayOrder', 'id'],
    where: { _status: { equals: 'published' } },
  })
  return docs.filter((d) => hasLocaleContent(d.name)).map(mapDoctorCard)
}

export interface DoctorCardBranch {
  slug: string
  th: string
  en: string
  // The specific Doctor record's OWN page slug for this branch — different
  // from the group's inherited `slug` (which is just whichever record
  // happened to be first). Each branch's record has different content
  // (bio/credentials/schedule can genuinely differ per branch — see
  // groupDoctorsByName()'s comment below), so "ดูประวัติแพทย์" on a merged
  // card must be able to link to each branch's own /doctor/[recordSlug]
  // rather than only ever the first one. Guaranteed unique per record by
  // Doctors.ts's `slug` field (unique: true).
  recordSlug: string
  // Branches.displayOrder — used to sort this array in groupDoctorsByName()
  // below, so a merged card's branches always appear in the same order as
  // everywhere else branches are listed site-wide (home/contact/footer),
  // instead of whichever order the underlying Doctor records happened to
  // sort in (reported 2026-09-10).
  displayOrder: number
}

export interface DoctorCardGroup extends DoctorCard {
  // Every branch this doctor is assigned to, each carrying its own
  // recordSlug (see DoctorCardBranch) since branch records can have
  // different profile content. branches[0] is still the same branch as the
  // inherited branchSlug/branchTh/branchEn/slug fields — used as the
  // default target for "จองปรึกษา" (see groupDoctorsByName() below for why
  // a doctor can have more than one).
  branches: DoctorCardBranch[]
}

// cms/collections/Doctors.ts's `branch` field is intentionally a single,
// required relationship — one Doctor record per branch, so a Content
// Editor scoped to one branch (see Users.assignedBranches) can manage their
// own doctor profiles without touching another branch's data. A doctor who
// genuinely practices at several branches therefore exists as several
// separate published records sharing the same name, each with its own slug
// (so branch pages and the sitemap still need every record untouched — see
// getBranchDetail() in branchesData.ts and sitemap.ts, both of which call
// getDoctorsListing() directly). Only the /doctor aggregate listing showed
// the same face+name repeated once per branch (reported 2026-09-10), so
// this groups by name for that ONE page instead of changing the data model.
// Groups by the already locale-resolved `nameTh` (see mapDoctorCard() above
// — nameTh/nameEn hold the same value by convention) — a plain text match,
// so two DIFFERENT doctors who happen to share an identical name would
// incorrectly merge. Accepted tradeoff for now; revisit with an explicit
// "same doctor" field on Doctors.ts if that ever actually happens.
//
// `enabled` (default true) is the admin-configurable
// DoctorDisplaySettings.groupDoctorsByBranch toggle (see
// getDoctorGroupingSettings() above) — when false, every record just
// becomes its own 1-branch "group" so the caller's rendering code (which
// always checks `branches.length > 1`) naturally falls back to one card
// per branch, same as before this feature existed.
export function groupDoctorsByName(cards: DoctorCard[], enabled = true): DoctorCardGroup[] {
  if (!enabled) {
    return cards.map((card) => ({
      ...card,
      branches: [
        {
          slug: card.branchSlug,
          th: card.branchTh,
          en: card.branchEn,
          recordSlug: card.slug,
          displayOrder: card.branchDisplayOrder,
        },
      ],
    }))
  }
  const order: string[] = []
  const groups = new Map<string, DoctorCardGroup>()
  for (const card of cards) {
    const key = card.nameTh.trim() || String(card.id)
    const branch: DoctorCardBranch = {
      slug: card.branchSlug,
      th: card.branchTh,
      en: card.branchEn,
      recordSlug: card.slug,
      displayOrder: card.branchDisplayOrder,
    }
    const existing = groups.get(key)
    if (existing) {
      existing.branches.push(branch)
    } else {
      groups.set(key, { ...card, branches: [branch] })
      order.push(key)
    }
  }
  // Sort each merged card's branches by Branches.displayOrder (ascending),
  // same field/order used everywhere else branches are listed site-wide
  // (home/contact/footer) — falls back to branch name so equal/blank
  // displayOrder values (default 0) stay in a stable, predictable order
  // instead of whatever order the underlying Doctor records happened to
  // come back in.
  return order.map((key) => {
    const group = groups.get(key) as DoctorCardGroup
    group.branches.sort((a, b) => a.displayOrder - b.displayOrder || a.th.localeCompare(b.th))
    return group
  })
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

export interface DoctorDisplayBackgrounds {
  profileBackground: string
  featuredBackground: string
}

// Shared "room" backdrops composited behind every doctor cutout photo
// site-wide (cms/globals/DoctorDisplaySettings.ts) — see the field comment
// there and Doctors.ts's portrait/cardPhoto/featuredPhoto comments. Neither
// field is localized, so a single un-scoped findGlobal call is enough —
// none of homeData.ts's th/en/th fallback dance (that's only needed for
// text fields, not media relationships).
export async function getDoctorDisplayBackgrounds(): Promise<DoctorDisplayBackgrounds> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = (await payload.findGlobal({ slug: 'doctor-display-settings' })) as any
  return {
    profileBackground: mediaUrl(settings?.profileBackground) || '',
    featuredBackground: mediaUrl(settings?.featuredBackground) || '',
  }
}

export interface DoctorGroupingSettings {
  groupByBranch: boolean
  multiBranchLabelStyle: 'pills' | 'list'
}

// Same global as getDoctorDisplayBackgrounds() above (cms/globals/
// DoctorDisplaySettings.ts), but kept as a separate function/call rather
// than folded into that one — the 2 other callers of
// getDoctorDisplayBackgrounds() (branch/[slug]/page.tsx, doctor/[slug]/
// page.tsx) only care about the background images and have nothing to do
// with the /doctor listing's grouping behavior, so this keeps that page's
// settings request scoped to only the one page that needs it. Both fields
// are admin-only to edit in the CMS (isAdminField) — see the field
// comments on DoctorDisplaySettings.ts.
export async function getDoctorGroupingSettings(): Promise<DoctorGroupingSettings> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = (await payload.findGlobal({ slug: 'doctor-display-settings' })) as any
  return {
    groupByBranch: settings?.groupDoctorsByBranch !== false,
    multiBranchLabelStyle: settings?.multiBranchLabelStyle === 'pills' ? 'pills' : 'list',
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
