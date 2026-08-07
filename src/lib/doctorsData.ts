import type { SeoData } from './payload'

import { findBothLocales, mapSeo, mediaUrl } from './payload'

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

function mapDoctorCard(th: any, en: any): DoctorCard {
  const branch = th.branch && typeof th.branch === 'object' ? th.branch : null
  return {
    id: th.id,
    slug: th.slug,
    image: mediaUrl(th.cardPhoto) || mediaUrl(th.portrait) || '/assets/images/doctors/dr01.png',
    branchSlug: branch?.slug || '',
    branchTh: branch?.nameTh || '',
    branchEn: branch?.nameEn || '',
    specialty: th.specialty || '',
    nameTh: th.nameTh,
    nameEn: th.nameEn,
    noteTh: th.specialtyLabel || '',
    noteEn: en?.specialtyLabel || th.specialtyLabel || '',
    subTh: th.subNote || '',
    subEn: en?.subNote || th.subNote || '',
  }
}

// Doctor listing (/doctor) — every published doctor, card-level fields only.
export async function getDoctorsListing(): Promise<DoctorCard[]> {
  const pairs = await findBothLocales<any>('doctors', {
    limit: 200,
    depth: 1,
    sort: 'slug',
    where: { _status: { equals: 'published' } },
  })
  return pairs.map(({ th, en }) => mapDoctorCard(th, en))
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

export async function getDoctorDetail(slug: string): Promise<DoctorDetail | null> {
  const pairs = await findBothLocales<any>('doctors', {
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  if (!pairs.length) return null
  const { th, en } = pairs[0]
  const card = mapDoctorCard(th, en)

  const hasRich = Boolean(th.bio || (th.credentialGroups && th.credentialGroups.length) || (th.schedule && th.schedule.length))
  const rich: DoctorRichProfile | null = hasRich
    ? {
        hospitalTitleTh: th.hospitalTitle || '',
        hospitalTitleEn: en?.hospitalTitle || th.hospitalTitle || '',
        boardCertificationTh: th.boardCertification || '',
        boardCertificationEn: en?.boardCertification || th.boardCertification || '',
        tags: (th.tags || []).map((tag: any, i: number) => ({
          th: tag.label || '',
          en: en?.tags?.[i]?.label || tag.label || '',
        })),
        bioTh: lexicalToPlainText(th.bio),
        bioEn: lexicalToPlainText(en?.bio) || lexicalToPlainText(th.bio),
        credentialGroups: (th.credentialGroups || []).map((group: any, gi: number) => ({
          headingTh: group.heading || '',
          headingEn: en?.credentialGroups?.[gi]?.heading || group.heading || '',
          items: (group.items || []).map((item: any, ii: number) => ({
            th: item.text || '',
            en: en?.credentialGroups?.[gi]?.items?.[ii]?.text || item.text || '',
          })),
        })),
        schedule: (th.schedule || []).map((row: any, i: number) => ({
          day: row.day,
          hours: row.hours,
          locationNameTh: row.locationName || '',
          locationNameEn: en?.schedule?.[i]?.locationName || row.locationName || '',
        })),
        contactIntroTh: th.contactIntro || '',
        contactIntroEn: en?.contactIntro || th.contactIntro || '',
        contactFactTh: th.contactFact || '',
        contactFactEn: en?.contactFact || th.contactFact || '',
      }
    : null

  return {
    ...card,
    portraitImage: mediaUrl(th.portrait) || mediaUrl(th.cardPhoto) || '/assets/images/doctors/dr01.png',
    rich,
    seo: mapSeo(th.seo),
  }
}

// "Doctor's Journal" — real articles that reference this doctor via
// Articles.relatedDoctors, not hardcoded like the original static page.
export async function getDoctorJournalArticles(doctorId: string | number): Promise<DoctorJournalCard[]> {
  const pairs = await findBothLocales<any>('articles', {
    limit: 3,
    depth: 1,
    sort: '-publishedDate',
    where: {
      _status: { equals: 'published' },
      relatedDoctors: { in: [doctorId] },
    },
  })
  return pairs.map(({ th, en }) => ({
    slug: th.slug,
    image: mediaUrl(th.coverImage) || '/assets/images/doctors/jr-01.png',
    categoryTh: th.categoryLabel || '',
    categoryEn: en?.categoryLabel || th.categoryLabel || '',
    titleTh: th.title,
    titleEn: en?.title || th.title,
    summaryTh: th.summary || '',
    summaryEn: en?.summary || th.summary || '',
    dateTh: formatThaiDate(th.publishedDate),
    dateEn: formatEnDate(th.publishedDate),
    readTimeTh: `${th.readTimeMinutes} นาที`,
    readTimeEn: `${th.readTimeMinutes} min`,
  }))
}

// Static — matches the original doctor.html branch dropdown exactly (5
// fixed PHIVARA locations, rarely changes).
export const BRANCH_FILTER_OPTIONS = [
  { value: 'sanampao', th: 'PHIVARA สนามเป้า', en: 'PHIVARA Sanampao' },
  { value: 'phaholyothin', th: 'PHIVARA พหลโยธิน', en: 'PHIVARA Phaholyothin' },
  { value: 'sriayudhaya', th: 'PHIVARA ศรีอยุธยา', en: 'PHIVARA Sri Ayudhaya' },
  { value: 'petchakasem', th: 'PHIVARA เพชรเกษม 19', en: 'PHIVARA Petchakasem 19' },
  { value: 'sriracha', th: 'PHIVARA ศรีราชา', en: 'PHIVARA Sriracha' },
]

export const SPECIALTY_FILTER_OPTIONS = [
  { value: 'plastic', th: 'ศัลยกรรมตกแต่ง', en: 'Plastic Surgery' },
  { value: 'longevity', th: 'เวชศาสตร์อายุยืนยาว', en: 'Anti-Aging & Longevity' },
  { value: 'dermatology', th: 'ผิวหนังและเลเซอร์', en: 'Dermatology' },
  { value: 'wellness', th: 'สุขภาวะเชิงความงาม', en: 'Aesthetic Wellness' },
]
