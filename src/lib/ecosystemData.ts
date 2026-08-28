import type { LocaleCode } from './i18n'
import { DEFAULT_LOCALE } from './i18n'
import { getPayloadClient, mediaUrl } from './payload'
import { parseRichTextBlocks } from './richText'
import type { RichTextBlock } from './richText'

// Source: cms/globals/Ecosystem.ts (a Payload Global, not a collection —
// same reasoning as membershipData.ts: ecosystem.html is a single landing
// page, so staff edit one record instead of managing a list).
//
// Unlike the catalog listings in programsData.ts/articlesData.ts/
// doctorsData.ts/branchesData.ts, this page's content is a small set of
// fixed, structural sections (one hero, exactly 4 discipline cards tied to
// DISCIPLINE_META below, one closing CTA) rather than an open-ended list of
// CMS records — hiding one of the 4 discipline cards for an untranslated
// locale would leave the ring/anchor-link UI (built assuming all 4 exist)
// broken, not just "shorter". So this keeps a `th` fallback per-field
// (same deliberate exception as homeData.ts's site-wide chrome helpers)
// instead of the strict per-record "no data = don't show" rule used for
// programs/articles/doctors/branches.
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
    // Was leadTh/leadEn (plain strings) — `lead` is now a `richText` field
    // (cms/globals/Ecosystem.ts) so staff can format a real bullet list, so
    // this carries the already-locale-resolved doc as parsed blocks instead.
    // See src/app/[locale]/(public)/ecosystem/page.tsx for how these render.
    leadBlocks: RichTextBlock[]
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
// Dermatology, Wellness, Plastic Surgery) — deliberately NOT wired to
// getExpertiseCategoryOptions()'s CMS-editable order (homeData.ts) since
// changing that would silently break this page's fixed alternating
// left-right layout. filterValue matches the same specialty/category slugs
// used by getExpertiseCategoryOptions() in doctorsData.ts / programsData.ts
// / articlesData.ts's now-unified category dropdowns.
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

// EN_LOCALE / fallback-to-en-then-th rationale: see homeData.ts's
// resolve() comment (same deliberate exception, same reasoning).
const EN_LOCALE: LocaleCode = 'en'

export async function getEcosystemContent(locale: LocaleCode): Promise<EcosystemContent> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let [target, en, th] = (await Promise.all([
    payload.findGlobal({ slug: 'ecosystem', locale, fallbackLocale: false }),
    payload.findGlobal({ slug: 'ecosystem', locale: EN_LOCALE, fallbackLocale: false }),
    payload.findGlobal({ slug: 'ecosystem', locale: DEFAULT_LOCALE }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [any, any, any]
  // See homeData.ts's getHomeHero() comment — same fix, same reason
  // (2026-08-23 bug: th field cleared in CMS still leaked en's text).
  if (locale === DEFAULT_LOCALE) { en = target; th = target }

  const heroEyebrow = target?.hero?.eyebrow || en?.hero?.eyebrow || th.hero?.eyebrow || ''
  const headlineLine1 = target?.hero?.headlineLine1 || en?.hero?.headlineLine1 || th.hero?.headlineLine1 || ''
  const headlineLine2 = target?.hero?.headlineLine2 || en?.hero?.headlineLine2 || th.hero?.headlineLine2 || ''
  const leadDoc = target?.hero?.lead || en?.hero?.lead || th.hero?.lead || null

  return {
    hero: {
      eyebrowTh: heroEyebrow,
      eyebrowEn: heroEyebrow,
      headlineLine1Th: headlineLine1,
      headlineLine1En: headlineLine1,
      headlineLine2Th: headlineLine2,
      headlineLine2En: headlineLine2,
      leadBlocks: parseRichTextBlocks(leadDoc),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    disciplines: (th.disciplines || []).map((d: any, i: number) => {
      const targetD = target?.disciplines?.[i]
      const enD = en?.disciplines?.[i]
      const meta = DISCIPLINE_META[i] ?? DISCIPLINE_META[0]
      const eyebrow = targetD?.eyebrow || enD?.eyebrow || d.eyebrow || ''
      const title = targetD?.title || enD?.title || d.title || ''
      const subtitle = targetD?.subtitle || enD?.subtitle || d.subtitle || ''
      const description = targetD?.description || enD?.description || d.description || ''
      const doctorLinkLabel = targetD?.doctorLinkLabel || enD?.doctorLinkLabel || d.doctorLinkLabel || ''
      const programLinkLabel = targetD?.programLinkLabel || enD?.programLinkLabel || d.programLinkLabel || ''
      const articleLinkLabel = targetD?.articleLinkLabel || enD?.articleLinkLabel || d.articleLinkLabel || ''
      return {
        id: meta.id,
        filterValue: meta.filterValue,
        tone: meta.tone,
        reverse: meta.reverse,
        eyebrowTh: eyebrow,
        eyebrowEn: eyebrow,
        titleTh: title,
        titleEn: title,
        subtitleTh: subtitle,
        subtitleEn: subtitle,
        descriptionTh: description,
        descriptionEn: description,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chips: (d.chips || []).map((c: any, j: number) => {
          const label = targetD?.chips?.[j]?.label || enD?.chips?.[j]?.label || c.label || ''
          return { th: label, en: label }
        }),
        doctorLinkLabelTh: doctorLinkLabel,
        doctorLinkLabelEn: doctorLinkLabel,
        programLinkLabelTh: programLinkLabel,
        programLinkLabelEn: programLinkLabel,
        articleLinkLabelTh: articleLinkLabel,
        articleLinkLabelEn: articleLinkLabel,
        image: mediaUrl(d.image) || meta.defaultImage,
      }
    }),
    closingCta: {
      eyebrowTh: target?.closingCta?.eyebrow || en?.closingCta?.eyebrow || th.closingCta?.eyebrow || '',
      eyebrowEn: target?.closingCta?.eyebrow || en?.closingCta?.eyebrow || th.closingCta?.eyebrow || '',
      headingTh: target?.closingCta?.heading || en?.closingCta?.heading || th.closingCta?.heading || '',
      headingEn: target?.closingCta?.heading || en?.closingCta?.heading || th.closingCta?.heading || '',
      bodyTh: target?.closingCta?.body || en?.closingCta?.body || th.closingCta?.body || '',
      bodyEn: target?.closingCta?.body || en?.closingCta?.body || th.closingCta?.body || '',
      buttonLabelTh: target?.closingCta?.buttonLabel || en?.closingCta?.buttonLabel || th.closingCta?.buttonLabel || '',
      buttonLabelEn: target?.closingCta?.buttonLabel || en?.closingCta?.buttonLabel || th.closingCta?.buttonLabel || '',
    },
  }
}
