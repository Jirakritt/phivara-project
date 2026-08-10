import { getDoctorsListing, type DoctorCard } from './doctorsData'
import { findBothLocales, mediaUrl } from './payload'
import { getProgramsListing, type ProgramCard } from './programsData'

export interface BranchCard {
  slug: string
  nameTh: string
  nameEn: string
  taglineTh: string
  taglineEn: string
  descriptionTh: string
  descriptionEn: string
  addressTh: string
  addressEn: string
  hoursTh: string
  hoursEn: string
  phone: string
  lineId: string
  image: string
  mapUrl: string
}

export interface BranchDetail extends BranchCard {
  facilitiesTh: string[]
  facilitiesEn: string[]
  directionsTh: string
  directionsEn: string
  // Not fetched from a `branch` relationship on Doctors/Programs directly —
  // reuses the existing listing functions and filters by branchSlug, since
  // both already carry real branch data per card. phivara-design-html/js/
  // branch-detail.js instead hardcoded a completely separate, fictional
  // per-branch doctor/program roster (different names, different program
  // codes) that was never linked to the real Doctors/Programs collections;
  // that fictional data is intentionally not reproduced here.
  doctors: DoctorCard[]
  programs: ProgramCard[]
}

function mapBranchCard(th: any, en: any): BranchCard {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(th.address || th.nameEn)}`
  return {
    slug: th.slug,
    nameTh: th.nameTh,
    nameEn: th.nameEn,
    taglineTh: th.tagline || '',
    taglineEn: en?.tagline || th.tagline || '',
    descriptionTh: th.description || '',
    descriptionEn: en?.description || th.description || '',
    addressTh: th.address || '',
    addressEn: en?.address || th.address || '',
    hoursTh: th.hours || '',
    hoursEn: en?.hours || th.hours || '',
    phone: th.phone || '',
    lineId: th.lineId || '@phivara',
    image: mediaUrl(th.heroImage) || '/assets/images/brand/about-lounge.jpg',
    mapUrl: th.mapUrl || mapHref,
  }
}

// /contact branch grid — all 5 locations, card-level fields only. Sorted by
// `id` (creation order), not slug — matches homeData.ts's branch query so
// "LOCATION 01" numbering here, in the footer, and on /branch/[slug] all
// agree with each other and with the original site's curated order
// (Sanampao first, as the flagship branch).
// depth:1 (not 0) is required even though these are "card-level" fields —
// mapBranchCard() reads heroImage.url via mediaUrl(), which only exists
// once the upload relationship is populated one level deep (same bug/fix as
// articlesData.ts's getArticlesListing — see its comment for the full
// explanation). At depth:0 heroImage comes back as a bare ID, mediaUrl()
// silently returns undefined, and every card falls through to the
// hardcoded placeholder photo regardless of what was actually uploaded.
export async function getBranchesListing(): Promise<BranchCard[]> {
  const pairs = await findBothLocales<any>('branches', {
    limit: 20,
    depth: 1,
    sort: 'id',
  })
  return pairs.map(({ th, en }) => mapBranchCard(th, en))
}

export async function getBranchDetail(slug: string): Promise<BranchDetail | null> {
  const [pairs, doctors, programs] = await Promise.all([
    findBothLocales<any>('branches', { limit: 1, depth: 1, where: { slug: { equals: slug } } }),
    getDoctorsListing(),
    getProgramsListing(),
  ])
  if (!pairs.length) return null
  const { th, en } = pairs[0]
  const card = mapBranchCard(th, en)

  return {
    ...card,
    facilitiesTh: (th.facilities || []).map((f: any) => f.text),
    facilitiesEn: (en?.facilities || th.facilities || []).map((f: any) => f.text),
    directionsTh: th.directions || '',
    directionsEn: en?.directions || th.directions || '',
    doctors: doctors.filter((d) => d.branchSlug === slug),
    programs: programs.filter((p) => p.branchSlug === slug),
  }
}
