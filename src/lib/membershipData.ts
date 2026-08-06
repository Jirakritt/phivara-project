import { getPayloadClient, mediaUrl } from './payload'

// Source: cms/globals/Membership.ts (a Payload Global, not a collection —
// membership.html is a single landing page, so staff edit one record
// instead of managing a list). Already fully seeded by cms/seed/seed.ts.
export interface MembershipContent {
  hero: { kickerTh: string; kickerEn: string; headlineTh: string; headlineEn: string; leadTh: string; leadEn: string }
  intro: { overlineTh: string; overlineEn: string; headingTh: string; headingEn: string; bodyTh: string; bodyEn: string }
  privileges: Array<{ titleTh: string; titleEn: string; descriptionTh: string; descriptionEn: string }>
  promise: { image: string; quoteTh: string; quoteEn: string; bodyTh: string; bodyEn: string }
  journeySteps: Array<{ titleTh: string; titleEn: string; descriptionTh: string; descriptionEn: string }>
  faq: Array<{ questionTh: string; questionEn: string; answerTh: string; answerEn: string }>
  finalCta: { overlineTh: string; overlineEn: string; headingTh: string; headingEn: string; bodyTh: string; bodyEn: string; buttonLabelTh: string; buttonLabelEn: string }
}

export async function getMembershipContent(): Promise<MembershipContent> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [th, en] = (await Promise.all([
    payload.findGlobal({ slug: 'membership', locale: 'th' }),
    payload.findGlobal({ slug: 'membership', locale: 'en' }),
  ])) as [any, any]

  return {
    hero: {
      kickerTh: th.hero?.kicker || '',
      kickerEn: en?.hero?.kicker || th.hero?.kicker || '',
      headlineTh: th.hero?.headline || '',
      headlineEn: en?.hero?.headline || th.hero?.headline || '',
      leadTh: th.hero?.lead || '',
      leadEn: en?.hero?.lead || th.hero?.lead || '',
    },
    intro: {
      overlineTh: th.intro?.overline || '',
      overlineEn: en?.intro?.overline || th.intro?.overline || '',
      headingTh: th.intro?.heading || '',
      headingEn: en?.intro?.heading || th.intro?.heading || '',
      bodyTh: th.intro?.body || '',
      bodyEn: en?.intro?.body || th.intro?.body || '',
    },
    privileges: (th.privileges || []).map((p: any, i: number) => ({
      titleTh: p.title || '',
      titleEn: en?.privileges?.[i]?.title || p.title || '',
      descriptionTh: p.description || '',
      descriptionEn: en?.privileges?.[i]?.description || p.description || '',
    })),
    promise: {
      image: mediaUrl(th.promise?.image) || '/assets/images/brand/about-lounge.jpg',
      quoteTh: th.promise?.quote || '',
      quoteEn: en?.promise?.quote || th.promise?.quote || '',
      bodyTh: th.promise?.body || '',
      bodyEn: en?.promise?.body || th.promise?.body || '',
    },
    journeySteps: (th.journeySteps || []).map((s: any, i: number) => ({
      titleTh: s.title || '',
      titleEn: en?.journeySteps?.[i]?.title || s.title || '',
      descriptionTh: s.description || '',
      descriptionEn: en?.journeySteps?.[i]?.description || s.description || '',
    })),
    faq: (th.faq || []).map((f: any, i: number) => ({
      questionTh: f.question || '',
      questionEn: en?.faq?.[i]?.question || f.question || '',
      answerTh: f.answer || '',
      answerEn: en?.faq?.[i]?.answer || f.answer || '',
    })),
    finalCta: {
      overlineTh: th.finalCta?.overline || '',
      overlineEn: en?.finalCta?.overline || th.finalCta?.overline || '',
      headingTh: th.finalCta?.heading || '',
      headingEn: en?.finalCta?.heading || th.finalCta?.heading || '',
      bodyTh: th.finalCta?.body || '',
      bodyEn: en?.finalCta?.body || th.finalCta?.body || '',
      buttonLabelTh: th.finalCta?.buttonLabel || '',
      buttonLabelEn: en?.finalCta?.buttonLabel || th.finalCta?.buttonLabel || '',
    },
  }
}
