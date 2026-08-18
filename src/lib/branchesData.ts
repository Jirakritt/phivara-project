import type { LocaleCode } from './i18n'
import { getDoctorsListing, type DoctorCard } from './doctorsData'
import { findLocalized, hasLocaleContent, mediaUrl } from './payload'
import { getProgramsListing, type ProgramCard } from './programsData'

// Per-locale filtering (see src/lib/payload.ts's findLocalized/
// hasLocaleContent, and programsData.ts's file comment for the full
// rationale). A branch now counts as "available" in a locale when the new
// localized `name` field (cms/collections/Branches.ts — added alongside
// the old flat nameTh/nameEn, see cms/scripts/backfillLocalizedNames.ts)
// has content for that locale. `xxxTh`/`xxxEn` on the returned objects
// both hold the SAME already-resolved value — see programsData.ts's
// comment for why.
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
  // reuses the existing listing functions and filters by branchSlug.
  doctors: DoctorCard[]
  programs: ProgramCard[]
}

function mapBranchCard(doc: any): BranchCard {
  const name = doc.name
  const tagline = doc.tagline || ''
  const description = doc.description || ''
  const address = doc.address || ''
  const hours = doc.hours || ''
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.address || doc.nameEn || doc.name)}`
  return {
    slug: doc.slug,
    nameTh: name,
    nameEn: name,
    taglineTh: tagline,
    taglineEn: tagline,
    descriptionTh: description,
    descriptionEn: description,
    addressTh: address,
    addressEn: address,
    hoursTh: hours,
    hoursEn: hours,
    phone: doc.phone || '',
    lineId: doc.lineId || '@phivara',
    image: mediaUrl(doc.heroImage) || '/assets/images/brand/about-lounge.jpg',
    mapUrl: doc.mapUrl || mapHref,
  }
}

// /contact branch grid — all locations with a `name` in `locale`. Sorted by
// `id` (creation order), not slug — matches homeData.ts's branch query so
// "LOCATION 01" numbering here, in the footer, and on /branch/[slug] all
// agree with each other.
export async function getBranchesListing(locale: LocaleCode): Promise<BranchCard[]> {
  const docs = await findLocalized<any>('branches', locale, {
    limit: 20,
    depth: 1,
    sort: 'id',
  })
  return docs.filter((d) => hasLocaleContent(d.name)).map(mapBranchCard)
}

export async function getBranchDetail(slug: string, locale: LocaleCode): Promise<BranchDetail | null> {
  const [docs, doctors, programs] = await Promise.all([
    findLocalized<any>('branches', locale, { limit: 1, depth: 1, where: { slug: { equals: slug } } }),
    getDoctorsListing(locale),
    getProgramsListing(locale),
  ])
  const doc = docs[0]
  if (!doc || !hasLocaleContent(doc.name)) return null
  const card = mapBranchCard(doc)

  const facilities = (doc.facilities || []).map((f: any) => f.text)
  const directions = doc.directions || ''

  return {
    ...card,
    facilitiesTh: facilities,
    facilitiesEn: facilities,
    directionsTh: directions,
    directionsEn: directions,
    doctors: doctors.filter((d) => d.branchSlug === slug),
    programs: programs.filter((p) => p.branchSlug === slug),
  }
}
