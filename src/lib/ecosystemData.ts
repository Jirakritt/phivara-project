import { getPayloadClient, mediaUrl } from './payload'

// Source: cms/globals/Ecosystem.ts (a Payload Global, not a collection —
// same reasoning as membershipData.ts: ecosystem.html is a single landing
// page, so staff edit one record instead of managing a list).
export interface EcosystemDiscipline {
  // Structural fields, not stored in the CMS — see DISCIPLINE_META below.
  id: string
  filterValue: string
  tone: string
  reverse: boolean
  eyebrowTh: string
  eyebrowEn: string
  titleTh: string
  titleEn: string
  subtitleTh: string
  subtitleEn: string
  descriptionTh: string
  descriptionEn: string
  chips: Array<{ th: string; en: string }>
  doctorLinkLabelTh: string
  doctorLinkLabelEn: string
  programLinkLabelTh: string
  programLinkLabelEn: string
  articleLinkLabelTh: string
  articleLinkLabelEn: string
  image: string
}

export interface EcosystemContent {
  hero: {
    eyebrowTh: string
    eyebrowEn: string
    headlineLine1Th: string
    headlineLine1En: string
    headlineLine2Th: string
    headlineLine2En: string
    leadTh: string
    leadEn: string
  }
  disciplines: EcosystemDiscipline[]
  closingCta: {
    eyebrowTh: string
    eyebrowEn: string
    headingTh: string
    headingEn: string
    bodyTh: string
    bodyEn: string
    buttonLabelTh: string
    buttonLabelEn: string
  }
}

// Anchor id / doctor-program-article filter slug / CSS tone class / L-R
// layout direction — fixed routing & layout plumbing, not editable copy, so
// it lives in code rather than the CMS. Order must match
// cms/seed/data/ecosystem.ts's `disciplines` array exactly (Longevity,
// Dermatology, Wellness, Plastic Surgery). filterValue matches the same
// specialty/category slugs already used by SPECIALTY_FILTER_OPTIONS /
// CATEGORY_FILTER_OPTIONS in doctorsData.ts / programsData.ts / articlesData.ts.
const DISCIPLINE_META = [
  {
    id: 'longevity',
    filterValue: 'longevity',
    tone: 'tone-longevity',
    reverse: false,
    defaultImage: '/assets/images/treatments/expertise-longevity.jpg',
  },
  {
    id: 'dermatology',
    filterValue: 'dermatology',
    tone: 'tone-dermatology',
    reverse: true,
    defaultImage: '/assets/images/treatments/expertise-skin.jpg',
  },
  {
    id: 'wellness',
    filterValue: 'wellness',
    tone: 'tone-wellness',
    reverse: false,
    defaultImage: '/assets/images/brand/about-lounge.jpg',
  },
  {
    id: 'plastic',
    filterValue: 'plastic',
    tone: 'tone-plastic',
    reverse: true,
    defaultImage: '/assets/images/treatments/expertise-plastic.jpg',
  },
] as const

export async function getEcosystemContent(): Promise<EcosystemContent> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [th, en] = (await Promise.all([
    payload.findGlobal({ slug: 'ecosystem', locale: 'th' }),
    payload.findGlobal({ slug: 'ecosystem', locale: 'en' }),
  ])) as [any, any]

  return {
    hero: {
      eyebrowTh: th.hero?.eyebrow || '',
      eyebrowEn: en?.hero?.eyebrow || th.hero?.eyebrow || '',
      headlineLine1Th: th.hero?.headlineLine1 || '',
      headlineLine1En: en?.hero?.headlineLine1 || th.hero?.headlineLine1 || '',
      headlineLine2Th: th.hero?.headlineLine2 || '',
      headlineLine2En: en?.hero?.headlineLine2 || th.hero?.headlineLine2 || '',
      leadTh: th.hero?.lead || '',
      leadEn: en?.hero?.lead || th.hero?.lead || '',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    disciplines: (th.disciplines || []).map((d: any, i: number) => {
      const enD = en?.disciplines?.[i]
      const meta = DISCIPLINE_META[i] ?? DISCIPLINE_META[0]
      return {
        id: meta.id,
        filterValue: meta.filterValue,
        tone: meta.tone,
        reverse: meta.reverse,
        eyebrowTh: d.eyebrow || '',
        eyebrowEn: enD?.eyebrow || d.eyebrow || '',
        titleTh: d.title || '',
        titleEn: enD?.title || d.title || '',
        subtitleTh: d.subtitle || '',
        subtitleEn: enD?.subtitle || d.subtitle || '',
        descriptionTh: d.description || '',
        descriptionEn: enD?.description || d.description || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chips: (d.chips || []).map((c: any, j: number) => ({
          th: c.label || '',
          en: enD?.chips?.[j]?.label || c.label || '',
        })),
        doctorLinkLabelTh: d.doctorLinkLabel || '',
        doctorLinkLabelEn: enD?.doctorLinkLabel || d.doctorLinkLabel || '',
        programLinkLabelTh: d.programLinkLabel || '',
        programLinkLabelEn: enD?.programLinkLabel || d.programLinkLabel || '',
        articleLinkLabelTh: d.articleLinkLabel || '',
        articleLinkLabelEn: enD?.articleLinkLabel || d.articleLinkLabel || '',
        image: mediaUrl(d.image) || meta.defaultImage,
      }
    }),
    closingCta: {
      eyebrowTh: th.closingCta?.eyebrow || '',
      eyebrowEn: en?.closingCta?.eyebrow || th.closingCta?.eyebrow || '',
      headingTh: th.closingCta?.heading || '',
      headingEn: en?.closingCta?.heading || th.closingCta?.heading || '',
      bodyTh: th.closingCta?.body || '',
      bodyEn: en?.closingCta?.body || th.closingCta?.body || '',
      buttonLabelTh: th.closingCta?.buttonLabel || '',
      buttonLabelEn: en?.closingCta?.buttonLabel || th.closingCta?.buttonLabel || '',
    },
  }
}
