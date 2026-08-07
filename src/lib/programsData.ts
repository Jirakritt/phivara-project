import type { SeoData } from './payload'

import { findBothLocales, mapSeo, mediaUrl } from './payload'

// Card-level fields shown on /program and reused as the base of the detail
// page. Note: program.html's own client-side JS stripped the 2-bullet
// ".card-list" highlights from every rendered card (see
// `document.querySelectorAll(".card-list").forEach(list=>list.remove())`
// in the original inline script) and replaced the card-foot's note text
// with the price — so `highlights`/`cardNote` are captured in the CMS but
// intentionally not rendered on the card here, to match what the original
// page actually displayed.
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

function mapProgramCard(th: any, en: any): ProgramCard {
  const branch = th.branch && typeof th.branch === 'object' ? th.branch : null
  return {
    slug: th.slug,
    code: th.code || '',
    category: th.category,
    titleTh: th.title,
    titleEn: en?.title || th.title,
    shortDescriptionTh: th.shortDescription || '',
    shortDescriptionEn: en?.shortDescription || th.shortDescription || '',
    image: mediaUrl(th.heroImage) || '/assets/images/treatments/expertise-longevity.jpg',
    price: th.price,
    branchSlug: branch?.slug || '',
    branchTh: branch?.nameTh || 'ทุกสาขา',
    branchEn: branch?.nameEn || 'All locations',
    searchKeywords: th.searchKeywords || '',
  }
}

// /program catalog grid — every published program, card-level fields only.
export async function getProgramsListing(): Promise<ProgramCard[]> {
  const pairs = await findBothLocales<any>('programs', {
    limit: 200,
    depth: 1,
    sort: 'slug',
    where: { _status: { equals: 'published' } },
  })
  return pairs.map(({ th, en }) => mapProgramCard(th, en))
}

// "Signature Programs" on a doctor's detail page. The original
// doctor_detail.html hand-curated 4 programs for its one example doctor
// (Dr. Kobkulya) — there was no such curation for any of the other ~30
// real doctors. Rather than leave the section out or add a manual
// per-doctor picker field, this auto-matches by specialty: a longevity
// doctor sees longevity programs, a dermatology doctor sees dermatology
// programs, etc. — same category-first approach as getOtherArticles()'s
// "CONTINUE READING" matching on the article detail page.
export async function getDoctorSignaturePrograms(specialty: string, limit = 4): Promise<ProgramCard[]> {
  if (!specialty) return []
  const pairs = await findBothLocales<any>('programs', {
    limit,
    depth: 1,
    sort: 'slug',
    where: { _status: { equals: 'published' }, category: { equals: specialty } },
  })
  return pairs.map(({ th, en }) => mapProgramCard(th, en))
}

// Highlight carousel at the top of /program — program.html hardcoded
// exactly pv01/pv02/pv03/pv06 here; that's now the `featured` checkbox.
export async function getFeaturedPrograms(): Promise<ProgramHighlightCard[]> {
  const pairs = await findBothLocales<any>('programs', {
    limit: 10,
    depth: 1,
    sort: 'slug',
    where: { _status: { equals: 'published' }, featured: { equals: true } },
  })
  return pairs.map(({ th, en }) => mapProgramCard(th, en))
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

export async function getProgramDetail(slug: string): Promise<ProgramDetail | null> {
  const pairs = await findBothLocales<any>('programs', {
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  if (!pairs.length) return null
  const { th, en } = pairs[0]
  const card = mapProgramCard(th, en)

  return {
    ...card,
    heroImage: mediaUrl(th.heroImage) || card.image,
    aboutProgramTh: lexicalToPlainText(th.aboutProgram),
    aboutProgramEn: lexicalToPlainText(en?.aboutProgram) || lexicalToPlainText(th.aboutProgram),
    purposeList: (th.purposeList || []).map((item: any, i: number) => ({
      th: item.text || '',
      en: en?.purposeList?.[i]?.text || item.text || '',
    })),
    audienceList: (th.audienceList || []).map((item: any, i: number) => ({
      th: item.text || '',
      en: en?.audienceList?.[i]?.text || item.text || '',
    })),
    checkupItems: (th.checkupItems || []).map((item: any, i: number) => ({
      group: item.group || 'all',
      nameTh: item.name || '',
      nameEn: en?.checkupItems?.[i]?.name || item.name || '',
      descriptionTh: item.description || undefined,
      descriptionEn: en?.checkupItems?.[i]?.description || item.description || undefined,
    })),
    termsOfService: (th.termsOfService || []).map((term: any, i: number) => ({
      titleTh: term.title || undefined,
      titleEn: en?.termsOfService?.[i]?.title || term.title || undefined,
      descriptionTh: term.description || '',
      descriptionEn: en?.termsOfService?.[i]?.description || term.description || '',
    })),
    contactLocationTh: th.contactOverride?.location,
    contactLocationEn: en?.contactOverride?.location || th.contactOverride?.location,
    contactHoursTh: th.contactOverride?.hours,
    contactHoursEn: en?.contactOverride?.hours || th.contactOverride?.hours,
    contactPhone: th.contactOverride?.phone,
    seo: mapSeo(th.seo),
  }
}

// Static — matches program.html's category dropdown exactly.
export const PROGRAM_CATEGORY_OPTIONS = [
  { value: 'plastic', th: 'ศัลยกรรมตกแต่ง', en: 'Plastic Surgery' },
  { value: 'longevity', th: 'เวชศาสตร์อายุยืนยาว', en: 'Anti-Aging & Longevity' },
  { value: 'dermatology', th: 'ผิวหนังและเลเซอร์', en: 'Dermatology' },
  { value: 'wellness', th: 'สุขภาวะเชิงความงาม', en: 'Aesthetic Wellness' },
]

export const PROGRAM_BRANCH_OPTIONS = [
  { value: 'sanampao', th: 'PHIVARA สนามเป้า', en: 'PHIVARA Sanampao' },
  { value: 'phaholyothin', th: 'PHIVARA พหลโยธิน', en: 'PHIVARA Phaholyothin' },
  { value: 'sriayudhaya', th: 'PHIVARA ศรีอยุธยา', en: 'PHIVARA Sri Ayudhaya' },
  { value: 'petchakasem', th: 'PHIVARA เพชรเกษม 19', en: 'PHIVARA Petchakasem 19' },
  { value: 'sriracha', th: 'PHIVARA ศรีราชา', en: 'PHIVARA Sriracha' },
]
