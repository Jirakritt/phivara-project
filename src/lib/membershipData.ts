import type { LocaleCode } from './i18n'
import { DEFAULT_LOCALE } from './i18n'
import { getPayloadClient, mediaUrl } from './payload'

// Source: cms/globals/Membership.ts (a Payload Global, not a collection —
// membership.html is a single landing page, so staff edit one record
// instead of managing a list). Already fully seeded by cms/seed/seed.ts.
//
// Same deliberate fallback-to-en(-then-th) exception as ecosystemData.ts/
// homeData.ts's chrome helpers — see homeData.ts's resolve() comment for
// the full rationale (fixed marketing sections, not an open-ended catalog
// of records, so nothing here gets hidden for an untranslated locale; en
// rather than th so an untranslated visitor sees English, not Thai).
const EN_LOCALE: LocaleCode = 'en'

export interface MembershipContent {
  hero: { kickerTh: string; kickerEn: string; headlineTh: string; headlineEn: string; leadTh: string; leadEn: string }
  intro: { overlineTh: string; overlineEn: string; headingTh: string; headingEn: string; bodyTh: string; bodyEn: string }
  privileges: Array<{ titleTh: string; titleEn: string; descriptionTh: string; descriptionEn: string }>
  promise: { image: string; quoteTh: string; quoteEn: string; bodyTh: string; bodyEn: string }
  journeySteps: Array<{ titleTh: string; titleEn: string; descriptionTh: string; descriptionEn: string }>
  faq: Array<{ questionTh: string; questionEn: string; answerTh: string; answerEn: string }>
  finalCta: { overlineTh: string; overlineEn: string; headingTh: string; headingEn: string; bodyTh: string; bodyEn: string; buttonLabelTh: string; buttonLabelEn: string }
}

export async function getMembershipContent(locale: LocaleCode): Promise<MembershipContent> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let [target, en, th] = (await Promise.all([
    payload.findGlobal({ slug: 'membership', locale, fallbackLocale: false }),
    payload.findGlobal({ slug: 'membership', locale: EN_LOCALE, fallbackLocale: false }),
    payload.findGlobal({ slug: 'membership', locale: DEFAULT_LOCALE }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [any, any, any]
  // th is the default locale — a field left blank here was deliberately
  // cleared by an admin, not "not yet translated", so it must never leak
  // en's leftover text. Aliasing en/th to target collapses every
  // `target || en || th` fallback below to just `target` for this locale.
  // Same fix as homeData.ts's getHomeHero() (see that comment for the
  // full 2026-08-23 bug writeup).
  if (locale === DEFAULT_LOCALE) { en = target; th = target }

  const kicker = target?.hero?.kicker || en?.hero?.kicker || th.hero?.kicker || ''
  const headline = target?.hero?.headline || en?.hero?.headline || th.hero?.headline || ''
  const lead = target?.hero?.lead || en?.hero?.lead || th.hero?.lead || ''
  const introOverline = target?.intro?.overline || en?.intro?.overline || th.intro?.overline || ''
  const introHeading = target?.intro?.heading || en?.intro?.heading || th.intro?.heading || ''
  const introBody = target?.intro?.body || en?.intro?.body || th.intro?.body || ''
  const promiseQuote = target?.promise?.quote || en?.promise?.quote || th.promise?.quote || ''
  const promiseBody = target?.promise?.body || en?.promise?.body || th.promise?.body || ''
  const finalOverline = target?.finalCta?.overline || en?.finalCta?.overline || th.finalCta?.overline || ''
  const finalHeading = target?.finalCta?.heading || en?.finalCta?.heading || th.finalCta?.heading || ''
  const finalBody = target?.finalCta?.body || en?.finalCta?.body || th.finalCta?.body || ''
  const finalButtonLabel = target?.finalCta?.buttonLabel || en?.finalCta?.buttonLabel || th.finalCta?.buttonLabel || ''

  return {
    hero: { kickerTh: kicker, kickerEn: kicker, headlineTh: headline, headlineEn: headline, leadTh: lead, leadEn: lead },
    intro: {
      overlineTh: introOverline,
      overlineEn: introOverline,
      headingTh: introHeading,
      headingEn: introHeading,
      bodyTh: introBody,
      bodyEn: introBody,
    },
    privileges: (th.privileges || []).map((p: any, i: number) => {
      const title = target?.privileges?.[i]?.title || en?.privileges?.[i]?.title || p.title || ''
      const description = target?.privileges?.[i]?.description || en?.privileges?.[i]?.description || p.description || ''
      return { titleTh: title, titleEn: title, descriptionTh: description, descriptionEn: description }
    }),
    promise: {
      image: mediaUrl(th.promise?.image) || '/assets/images/brand/about-lounge.jpg',
      quoteTh: promiseQuote,
      quoteEn: promiseQuote,
      bodyTh: promiseBody,
      bodyEn: promiseBody,
    },
    journeySteps: (th.journeySteps || []).map((s: any, i: number) => {
      const title = target?.journeySteps?.[i]?.title || en?.journeySteps?.[i]?.title || s.title || ''
      const description = target?.journeySteps?.[i]?.description || en?.journeySteps?.[i]?.description || s.description || ''
      return { titleTh: title, titleEn: title, descriptionTh: description, descriptionEn: description }
    }),
    faq: (th.faq || []).map((f: any, i: number) => {
      const question = target?.faq?.[i]?.question || en?.faq?.[i]?.question || f.question || ''
      const answer = target?.faq?.[i]?.answer || en?.faq?.[i]?.answer || f.answer || ''
      return { questionTh: question, questionEn: question, answerTh: answer, answerEn: answer }
    }),
    finalCta: {
      overlineTh: finalOverline,
      overlineEn: finalOverline,
      headingTh: finalHeading,
      headingEn: finalHeading,
      bodyTh: finalBody,
      bodyEn: finalBody,
      buttonLabelTh: finalButtonLabel,
      buttonLabelEn: finalButtonLabel,
    },
  }
}
