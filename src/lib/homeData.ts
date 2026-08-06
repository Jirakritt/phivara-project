import { findBothLocales, mediaUrl } from './payload'

// Thai months in Buddhist Era style, matching the original site's date
// formatting (e.g. "28 พฤษภาคม 2569").
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

function formatThaiDate(dateString: string): string {
  const d = new Date(dateString)
  const buddhistYear = d.getFullYear() + 543
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${buddhistYear}`
}

function formatEnDate(dateString: string): string {
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

export interface HomeBranch {
  id: string
  formValue: string
  nameTh: string
  nameEn: string
  titleTh: string
  titleEn: string
  descriptionTh: string
  descriptionEn: string
  addressTh: string
  addressEn: string
  hoursTh: string
  hoursEn: string
  phone: string
  line: string
  image: string
}

export interface HomeDoctor {
  id: string
  image: string
  branchTh: string
  branchEn: string
  nameTh: string
  nameEn: string
  noteTh: string
  noteEn: string
  subTh: string
  subEn: string
}

export interface HomeProgram {
  slug: string
  category: string
  branchTh: string
  branchEn: string
  titleTh: string
  titleEn: string
  descriptionTh: string
  descriptionEn: string
  image: string
  price: number
}

export interface HomeArticle {
  id: string
  image: string
  alt: string
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

export interface HomeData {
  branches: HomeBranch[]
  doctors: HomeDoctor[]
  programs: HomeProgram[]
  articles: HomeArticle[]
}

// The raw Payload doc shapes below are intentionally loose (`any`-ish) —
// this file's only job is reshaping CMS content into the flat objects
// public/js/main.js already knows how to render, not modeling the full
// Payload schema in TypeScript.

export async function getHomeData(): Promise<HomeData> {
  const [branchPairs, doctorPairs, programPairs, articlePairs] = await Promise.all([
    // No manual "display order" field exists yet — sort by id (creation
    // order) so branches render in the same order they were seeded
    // (sanampao, phaholyothin, sriayudhaya, petchakasem, sriracha), matching
    // the original site's hardcoded array order.
    findBothLocales<any>('branches', { limit: 10, depth: 1, sort: 'id' }),
    findBothLocales<any>('doctors', {
      limit: 12,
      depth: 1,
      sort: 'slug',
      where: { _status: { equals: 'published' } },
    }),
    findBothLocales<any>('programs', { limit: 100, depth: 1, where: { _status: { equals: 'published' } } }),
    findBothLocales<any>('articles', {
      limit: 3,
      depth: 1,
      sort: '-publishedDate',
      where: { _status: { equals: 'published' } },
    }),
  ])

  const branches: HomeBranch[] = branchPairs.map(({ th, en }) => ({
    id: th.slug,
    formValue: th.slug,
    nameTh: th.nameTh,
    nameEn: th.nameEn,
    titleTh: th.tagline || '',
    titleEn: en?.tagline || th.tagline || '',
    descriptionTh: th.description || '',
    descriptionEn: en?.description || th.description || '',
    addressTh: th.address || '',
    addressEn: en?.address || th.address || '',
    hoursTh: th.hours || '',
    hoursEn: en?.hours || th.hours || '',
    phone: th.phone || '',
    line: th.lineId || '@phivara',
    image: mediaUrl(th.heroImage) || '/assets/images/brand/about-lounge.jpg',
  }))

  const doctors: HomeDoctor[] = doctorPairs.map(({ th, en }) => {
    const branch = th.branch && typeof th.branch === 'object' ? th.branch : null
    return {
      id: th.slug,
      image: mediaUrl(th.cardPhoto) || mediaUrl(th.portrait) || '/assets/images/doctors/dr01.png',
      branchTh: branch?.nameTh || '',
      branchEn: branch?.nameEn || '',
      nameTh: th.nameTh,
      nameEn: th.nameEn,
      noteTh: th.specialtyLabel || '',
      noteEn: en?.specialtyLabel || th.specialtyLabel || '',
      subTh: th.subNote || '',
      subEn: en?.subNote || th.subNote || '',
    }
  })

  const programs: HomeProgram[] = programPairs.map(({ th, en }) => {
    const branch = th.branch && typeof th.branch === 'object' ? th.branch : null
    return {
      slug: th.slug,
      category: th.category,
      branchTh: branch?.nameTh || '',
      branchEn: branch?.nameEn || '',
      titleTh: th.title || '',
      titleEn: en?.title || th.title || '',
      descriptionTh: th.shortDescription || '',
      descriptionEn: en?.shortDescription || th.shortDescription || '',
      image: mediaUrl(th.heroImage) || '/assets/images/treatments/expertise-longevity.jpg',
      price: th.price,
    }
  })

  const articles: HomeArticle[] = articlePairs.map(({ th, en }) => ({
    id: th.slug,
    image: mediaUrl(th.coverImage) || '/assets/images/doctors/jr-02.png',
    alt: th.title,
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

  return { branches, doctors, programs, articles }
}
