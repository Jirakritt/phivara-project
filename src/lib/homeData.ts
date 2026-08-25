import type { LocaleCode } from './i18n'
import { DEFAULT_LOCALE } from './i18n'
import { findLocalized, getPayloadClient, hasLocaleContent, mediaUrl } from './payload'

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

export interface HomeHero {
  eyebrowTh: string
  eyebrowEn: string
  headlineTh: string
  headlineEn: string
  leadTh: string
  leadEn: string
  ctaLabelTh: string
  ctaLabelEn: string
  backgroundImages: string[]
  // "WHY PHIVARA EXISTS" section — see cms/globals/HomeHero.ts's collapsible
  // group for the field definitions.
  introEyebrowTh: string
  introEyebrowEn: string
  introQuoteTh: string
  introQuoteEn: string
  introBody1Th: string
  introBody1En: string
  introBody2Th: string
  introBody2En: string
  introTaglineTh: string
  introTaglineEn: string
  diagramLabelTlTh: string
  diagramLabelTlEn: string
  diagramLabelTrTh: string
  diagramLabelTrEn: string
  diagramLabelBlTh: string
  diagramLabelBlEn: string
  diagramLabelBrTh: string
  diagramLabelBrEn: string
  // "INTEGRATED EXPERTISE" tabbed section — see cms/globals/HomeHero.ts's
  // second collapsible group. Category keys (plastic/longevity/dermatology/
  // wellness) stay hardcoded in code since they must match
  // Programs.category's select options; only their display text is here.
  expertiseEyebrowTh: string
  expertiseEyebrowEn: string
  expertiseHeadlineTh: string
  expertiseHeadlineEn: string
  expertisePlasticLabelTh: string
  expertisePlasticLabelEn: string
  expertisePlasticTagTh: string
  expertisePlasticTagEn: string
  expertisePlasticTitleTh: string
  expertisePlasticTitleEn: string
  expertiseLongevityLabelTh: string
  expertiseLongevityLabelEn: string
  expertiseLongevityTagTh: string
  expertiseLongevityTagEn: string
  expertiseLongevityTitleTh: string
  expertiseLongevityTitleEn: string
  expertiseDermatologyLabelTh: string
  expertiseDermatologyLabelEn: string
  expertiseDermatologyTagTh: string
  expertiseDermatologyTagEn: string
  expertiseDermatologyTitleTh: string
  expertiseDermatologyTitleEn: string
  expertiseWellnessLabelTh: string
  expertiseWellnessLabelEn: string
  expertiseWellnessTagTh: string
  expertiseWellnessTagEn: string
  expertiseWellnessTitleTh: string
  expertiseWellnessTitleEn: string
  // "PHIVARA DESTINATIONS" section eyebrow/heading — branch cards
  // themselves come from HomeData.branches (the `branches` collection).
  destinationsEyebrowTh: string
  destinationsEyebrowEn: string
  destinationsHeadlineTh: string
  destinationsHeadlineEn: string
  // "OUR SPECIALISTS" section copy — doctor cards themselves come from
  // HomeData.doctors (the `doctors` collection).
  specialistsEyebrowTh: string
  specialistsEyebrowEn: string
  specialistsHeadlineTh: string
  specialistsHeadlineEn: string
  specialistsLeadTh: string
  specialistsLeadEn: string
  specialistsLinkLabelTh: string
  specialistsLinkLabelEn: string
  // "THE JOURNAL" section eyebrow/heading — article cards themselves come
  // from HomeData.articles (the `articles` collection).
  journalEyebrowTh: string
  journalEyebrowEn: string
  journalHeadlineTh: string
  journalHeadlineEn: string
  // "AWARDS & RECOGNITION" section eyebrow/heading — award cards themselves
  // come from HomeData.awards (the `awards` collection).
  awardsEyebrowTh: string
  awardsEyebrowEn: string
  awardsHeadlineTh: string
  awardsHeadlineEn: string
}

export interface HomeAward {
  image: string
  captionTh: string
  captionEn: string
}

export interface HomeMembershipTeaser {
  eyebrowTh: string
  eyebrowEn: string
  headlineTh: string
  headlineEn: string
  leadTh: string
  leadEn: string
  ctaLabelTh: string
  ctaLabelEn: string
  image: string
}

export interface HomeFooterLink {
  labelTh: string
  labelEn: string
  url: string
}

export interface HomeFooterGroup {
  headingTh: string
  headingEn: string
  links: HomeFooterLink[]
}

export interface HomeFooter {
  taglineTh: string
  taglineEn: string
  linkGroups: HomeFooterGroup[]
  copyrightTh: string
  copyrightEn: string
  social: { instagram: string; facebook: string; line: string }
}

export interface HomeTopBar {
  taglineTh: string
  taglineEn: string
  hotlineTextTh: string
  hotlineTextEn: string
  lineTextTh: string
  lineTextEn: string
}

export interface HomeData {
  hero: HomeHero
  branches: HomeBranch[]
  doctors: HomeDoctor[]
  programs: HomeProgram[]
  articles: HomeArticle[]
  awards: HomeAward[]
  membershipTeaser: HomeMembershipTeaser
  footer: HomeFooter
  topbar: HomeTopBar
}

// Site-wide chrome (hero, footer, topbar, membership teaser) is always
// rendered on every page regardless of locale, so — unlike the listing
// collections below — it deliberately keeps a th fallback instead of
// disappearing when untranslated: an empty homepage hero would read as a
// broken page, not "this content isn't available in your language" the
// way a missing catalog item does. `resolve()` below picks the requested
// locale's value with Payload's own fallback disabled (see
// payload.ts's findLocalized), and falls back to `en` (then `th` as a
// last resort, since `en` itself could theoretically be blank) in code
// when that's genuinely empty — `en` rather than `th` specifically so a
// visitor on an untranslated locale like /ja sees English chrome instead
// of Thai, which reads as far less jarring/broken to a non-Thai-speaking
// visitor. This is a deliberate exception to the "no cross-locale
// fallback" rule applied everywhere else in this file (and in
// articlesData.ts/doctorsData.ts/programsData.ts/branchesData.ts) —
// flagged here since it's the one place this project intentionally still
// falls back across languages.
const EN_LOCALE: LocaleCode = 'en'
function resolve(target: any, en: any, th: any, field: string): string {
  return target?.[field] || en?.[field] || th?.[field] || ''
}

async function getHomeHero(locale: LocaleCode): Promise<HomeHero> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let [target, en, th] = (await Promise.all([
    payload.findGlobal({ slug: 'home-hero', locale, fallbackLocale: false }),
    payload.findGlobal({ slug: 'home-hero', locale: EN_LOCALE, fallbackLocale: false }),
    payload.findGlobal({ slug: 'home-hero', locale: DEFAULT_LOCALE }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [any, any, any]
  // The th visitor IS the default locale — a field left blank here was
  // deliberately cleared by an admin, not "not yet translated", so it must
  // never leak en's leftover text. Aliasing en/th to target collapses every
  // `target || en || th` fallback below to just `target` for this locale.
  if (locale === DEFAULT_LOCALE) { en = target; th = target }

  return {
    eyebrowTh: resolve(target, en, th, 'eyebrow'),
    eyebrowEn: resolve(target, en, th, 'eyebrow'),
    headlineTh: resolve(target, en, th, 'headline'),
    headlineEn: resolve(target, en, th, 'headline'),
    leadTh: resolve(target, en, th, 'lead'),
    leadEn: resolve(target, en, th, 'lead'),
    ctaLabelTh: resolve(target, en, th, 'ctaLabel'),
    ctaLabelEn: resolve(target, en, th, 'ctaLabel'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backgroundImages: ((th.backgroundImages || []) as any[])
      .map((row: any) => mediaUrl(row.image))
      .filter((url: string | undefined): url is string => Boolean(url)),
    introEyebrowTh: resolve(target, en, th, 'introEyebrow'),
    introEyebrowEn: resolve(target, en, th, 'introEyebrow'),
    introQuoteTh: resolve(target, en, th, 'introQuote'),
    introQuoteEn: resolve(target, en, th, 'introQuote'),
    introBody1Th: resolve(target, en, th, 'introBody1'),
    introBody1En: resolve(target, en, th, 'introBody1'),
    introBody2Th: resolve(target, en, th, 'introBody2'),
    introBody2En: resolve(target, en, th, 'introBody2'),
    introTaglineTh: resolve(target, en, th, 'introTagline'),
    introTaglineEn: resolve(target, en, th, 'introTagline'),
    diagramLabelTlTh: resolve(target, en, th, 'diagramLabelTl'),
    diagramLabelTlEn: resolve(target, en, th, 'diagramLabelTl'),
    diagramLabelTrTh: resolve(target, en, th, 'diagramLabelTr'),
    diagramLabelTrEn: resolve(target, en, th, 'diagramLabelTr'),
    diagramLabelBlTh: resolve(target, en, th, 'diagramLabelBl'),
    diagramLabelBlEn: resolve(target, en, th, 'diagramLabelBl'),
    diagramLabelBrTh: resolve(target, en, th, 'diagramLabelBr'),
    diagramLabelBrEn: resolve(target, en, th, 'diagramLabelBr'),
    expertiseEyebrowTh: resolve(target, en, th, 'expertiseEyebrow'),
    expertiseEyebrowEn: resolve(target, en, th, 'expertiseEyebrow'),
    expertiseHeadlineTh: resolve(target, en, th, 'expertiseHeadline'),
    expertiseHeadlineEn: resolve(target, en, th, 'expertiseHeadline'),
    expertisePlasticLabelTh: resolve(target, en, th, 'expertisePlasticLabel'),
    expertisePlasticLabelEn: resolve(target, en, th, 'expertisePlasticLabel'),
    expertisePlasticTagTh: resolve(target, en, th, 'expertisePlasticTag'),
    expertisePlasticTagEn: resolve(target, en, th, 'expertisePlasticTag'),
    expertisePlasticTitleTh: resolve(target, en, th, 'expertisePlasticTitle'),
    expertisePlasticTitleEn: resolve(target, en, th, 'expertisePlasticTitle'),
    expertiseLongevityLabelTh: resolve(target, en, th, 'expertiseLongevityLabel'),
    expertiseLongevityLabelEn: resolve(target, en, th, 'expertiseLongevityLabel'),
    expertiseLongevityTagTh: resolve(target, en, th, 'expertiseLongevityTag'),
    expertiseLongevityTagEn: resolve(target, en, th, 'expertiseLongevityTag'),
    expertiseLongevityTitleTh: resolve(target, en, th, 'expertiseLongevityTitle'),
    expertiseLongevityTitleEn: resolve(target, en, th, 'expertiseLongevityTitle'),
    expertiseDermatologyLabelTh: resolve(target, en, th, 'expertiseDermatologyLabel'),
    expertiseDermatologyLabelEn: resolve(target, en, th, 'expertiseDermatologyLabel'),
    expertiseDermatologyTagTh: resolve(target, en, th, 'expertiseDermatologyTag'),
    expertiseDermatologyTagEn: resolve(target, en, th, 'expertiseDermatologyTag'),
    expertiseDermatologyTitleTh: resolve(target, en, th, 'expertiseDermatologyTitle'),
    expertiseDermatologyTitleEn: resolve(target, en, th, 'expertiseDermatologyTitle'),
    expertiseWellnessLabelTh: resolve(target, en, th, 'expertiseWellnessLabel'),
    expertiseWellnessLabelEn: resolve(target, en, th, 'expertiseWellnessLabel'),
    expertiseWellnessTagTh: resolve(target, en, th, 'expertiseWellnessTag'),
    expertiseWellnessTagEn: resolve(target, en, th, 'expertiseWellnessTag'),
    expertiseWellnessTitleTh: resolve(target, en, th, 'expertiseWellnessTitle'),
    expertiseWellnessTitleEn: resolve(target, en, th, 'expertiseWellnessTitle'),
    destinationsEyebrowTh: resolve(target, en, th, 'destinationsEyebrow'),
    destinationsEyebrowEn: resolve(target, en, th, 'destinationsEyebrow'),
    destinationsHeadlineTh: resolve(target, en, th, 'destinationsHeadline'),
    destinationsHeadlineEn: resolve(target, en, th, 'destinationsHeadline'),
    specialistsEyebrowTh: resolve(target, en, th, 'specialistsEyebrow'),
    specialistsEyebrowEn: resolve(target, en, th, 'specialistsEyebrow'),
    specialistsHeadlineTh: resolve(target, en, th, 'specialistsHeadline'),
    specialistsHeadlineEn: resolve(target, en, th, 'specialistsHeadline'),
    specialistsLeadTh: resolve(target, en, th, 'specialistsLead'),
    specialistsLeadEn: resolve(target, en, th, 'specialistsLead'),
    specialistsLinkLabelTh: resolve(target, en, th, 'specialistsLinkLabel'),
    specialistsLinkLabelEn: resolve(target, en, th, 'specialistsLinkLabel'),
    journalEyebrowTh: resolve(target, en, th, 'journalEyebrow'),
    journalEyebrowEn: resolve(target, en, th, 'journalEyebrow'),
    journalHeadlineTh: resolve(target, en, th, 'journalHeadline'),
    journalHeadlineEn: resolve(target, en, th, 'journalHeadline'),
    awardsEyebrowTh: resolve(target, en, th, 'awardsEyebrow'),
    awardsEyebrowEn: resolve(target, en, th, 'awardsEyebrow'),
    awardsHeadlineTh: resolve(target, en, th, 'awardsHeadline'),
    awardsHeadlineEn: resolve(target, en, th, 'awardsHeadline'),
  }
}

// Homepage "VIP Concierge" teaser (before the footer) — reuses the
// `membership` Global that already powers the full /membership page.
async function getMembershipTeaser(locale: LocaleCode): Promise<HomeMembershipTeaser> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let [target, en, th] = (await Promise.all([
    payload.findGlobal({ slug: 'membership', locale, fallbackLocale: false }),
    payload.findGlobal({ slug: 'membership', locale: EN_LOCALE, fallbackLocale: false }),
    payload.findGlobal({ slug: 'membership', locale: DEFAULT_LOCALE }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [any, any, any]
  // See getHomeHero's comment above — same fix, same reason.
  if (locale === DEFAULT_LOCALE) { en = target; th = target }

  const kicker = target?.hero?.kicker || en?.hero?.kicker || th?.hero?.kicker || ''
  const headline = target?.hero?.headline || en?.hero?.headline || th?.hero?.headline || ''
  const lead = target?.hero?.lead || en?.hero?.lead || th?.hero?.lead || ''
  const ctaLabel = target?.finalCta?.buttonLabel || en?.finalCta?.buttonLabel || th?.finalCta?.buttonLabel || ''

  return {
    eyebrowTh: kicker,
    eyebrowEn: kicker,
    headlineTh: headline,
    headlineEn: headline,
    leadTh: lead,
    leadEn: lead,
    ctaLabelTh: ctaLabel,
    ctaLabelEn: ctaLabel,
    image: mediaUrl(th.hero?.heroImage) || '/assets/images/hero/herobgcopy.png',
  }
}

// Site-wide footer (cms/globals/Footer.ts) — shown on every page. The
// "สาขา" column is deliberately NOT sourced from here (see that file's
// comment); this only covers the manually-authored columns/tagline/
// copyright/social links.
async function getFooterContent(locale: LocaleCode): Promise<HomeFooter> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let [target, en, th] = (await Promise.all([
    payload.findGlobal({ slug: 'footer', locale, fallbackLocale: false }),
    payload.findGlobal({ slug: 'footer', locale: EN_LOCALE, fallbackLocale: false }),
    payload.findGlobal({ slug: 'footer', locale: DEFAULT_LOCALE }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [any, any, any]
  // See getHomeHero's comment above — same fix, same reason.
  if (locale === DEFAULT_LOCALE) { en = target; th = target }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkGroups: HomeFooterGroup[] = (th.linkGroups || []).map((group: any, i: number) => {
    const targetGroup = target?.linkGroups?.[i]
    const enGroup = en?.linkGroups?.[i]
    const heading = targetGroup?.heading || enGroup?.heading || group.heading || ''
    return {
      headingTh: heading,
      headingEn: heading,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      links: (group.links || []).map((link: any, j: number) => {
        const targetLink = targetGroup?.links?.[j]
        const enLink = enGroup?.links?.[j]
        const label = targetLink?.label || enLink?.label || link.label || ''
        return { labelTh: label, labelEn: label, url: link.url || '#' }
      }),
    }
  })

  const tagline = target?.tagline || en?.tagline || th.tagline || ''
  const copyright = target?.copyrightText || en?.copyrightText || th.copyrightText || ''

  return {
    taglineTh: tagline,
    taglineEn: tagline,
    linkGroups,
    copyrightTh: copyright,
    copyrightEn: copyright,
    social: {
      instagram: th.socialLinks?.instagram || '',
      facebook: th.socialLinks?.facebook || '',
      line: th.socialLinks?.line || '',
    },
  }
}

// Site-wide top bar (cms/globals/TopBar.ts) — the thin gold strip above the
// main header, shown on every page.
async function getTopBarContent(locale: LocaleCode): Promise<HomeTopBar> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let [target, en, th] = (await Promise.all([
    payload.findGlobal({ slug: 'topbar', locale, fallbackLocale: false }),
    payload.findGlobal({ slug: 'topbar', locale: EN_LOCALE, fallbackLocale: false }),
    payload.findGlobal({ slug: 'topbar', locale: DEFAULT_LOCALE }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [any, any, any]
  // See getHomeHero's comment above — same fix, same reason. This is the
  // specific bug reported 2026-08-23: clearing Topbar > Hotline Text (TH)
  // in the CMS still showed the leftover EN placeholder on /th pages.
  if (locale === DEFAULT_LOCALE) { en = target; th = target }

  const tagline = target?.tagline || en?.tagline || th.tagline || ''
  const hotlineText = target?.hotlineText || en?.hotlineText || th.hotlineText || ''
  const lineText = target?.lineText || en?.lineText || th.lineText || ''

  return {
    taglineTh: tagline,
    taglineEn: tagline,
    hotlineTextTh: hotlineText,
    hotlineTextEn: hotlineText,
    lineTextTh: lineText,
    lineTextEn: lineText,
  }
}

// The raw Payload doc shapes below are intentionally loose (`any`-ish) —
// this file's only job is reshaping CMS content into the flat objects
// public/js/main.js already knows how to render, not modeling the full
// Payload schema in TypeScript.
//
// The 4 listing arrays below (branches, doctors, programs, articles) DO
// follow the strict "no cross-locale fallback" rule (unlike the chrome
// helpers above) — same hasLocaleContent() presence filter as
// programsData.ts/articlesData.ts/doctorsData.ts/branchesData.ts, so a
// homepage teaser never shows a doctor/program/article that doesn't
// actually have `locale` content yet.
export async function getHomeData(locale: LocaleCode): Promise<HomeData> {
  const [hero, membershipTeaser, footer, topbar, branchDocs, doctorDocs, programDocs, articleDocs, awardDocs] = await Promise.all([
    getHomeHero(locale),
    getMembershipTeaser(locale),
    getFooterContent(locale),
    getTopBarContent(locale),
    findLocalized<any>('branches', locale, { limit: 10, depth: 1, sort: 'id' }),
    findLocalized<any>('doctors', locale, {
      limit: 12,
      depth: 1,
      sort: 'slug',
      where: { _status: { equals: 'published' } },
    }),
    findLocalized<any>('programs', locale, { limit: 100, depth: 1, where: { _status: { equals: 'published' } } }),
    findLocalized<any>('articles', locale, {
      limit: 3,
      depth: 1,
      sort: '-publishedDate',
      where: { _status: { equals: 'published' } },
    }),
    findLocalized<any>('awards', locale, { limit: 50, depth: 1, sort: 'id' }),
  ])

  const branches: HomeBranch[] = branchDocs
    .filter((doc) => hasLocaleContent(doc.name))
    .map((doc) => {
      const name = doc.name
      const tagline = doc.tagline || ''
      const description = doc.description || ''
      const address = doc.address || ''
      const hours = doc.hours || ''
      return {
        id: doc.slug,
        formValue: doc.slug,
        nameTh: name,
        nameEn: name,
        titleTh: tagline,
        titleEn: tagline,
        descriptionTh: description,
        descriptionEn: description,
        addressTh: address,
        addressEn: address,
        hoursTh: hours,
        hoursEn: hours,
        phone: doc.phone || '',
        line: doc.lineId || '@phivara',
        image: mediaUrl(doc.heroImage) || '/assets/images/brand/about-lounge.jpg',
      }
    })

  const doctors: HomeDoctor[] = doctorDocs
    .filter((doc) => hasLocaleContent(doc.name))
    .map((doc) => {
      const branch = doc.branch && typeof doc.branch === 'object' ? doc.branch : null
      const note = doc.specialtyLabel || ''
      const sub = doc.subNote || ''
      return {
        id: doc.slug,
        image: mediaUrl(doc.cardPhoto) || mediaUrl(doc.portrait) || '/assets/images/doctors/dr01.png',
        branchTh: branch?.name || '',
        branchEn: branch?.name || '',
        nameTh: doc.name,
        nameEn: doc.name,
        noteTh: note,
        noteEn: note,
        subTh: sub,
        subEn: sub,
      }
    })

  const programs: HomeProgram[] = programDocs
    .filter((doc) => hasLocaleContent(doc.title))
    .map((doc) => {
      const branch = doc.branch && typeof doc.branch === 'object' ? doc.branch : null
      const title = doc.title || ''
      const description = doc.shortDescription || ''
      return {
        slug: doc.slug,
        category: doc.category,
        branchTh: branch?.name || '',
        branchEn: branch?.name || '',
        titleTh: title,
        titleEn: title,
        descriptionTh: description,
        descriptionEn: description,
        image: mediaUrl(doc.heroImage) || '/assets/images/treatments/expertise-longevity.jpg',
        price: doc.price,
      }
    })

  const articles: HomeArticle[] = articleDocs
    .filter((doc) => hasLocaleContent(doc.title))
    .map((doc) => {
      const title = doc.title
      const category = doc.categoryLabel || ''
      const summary = doc.summary || ''
      return {
        id: doc.slug,
        image: mediaUrl(doc.coverImage) || '/assets/images/doctors/jr-02.png',
        alt: title,
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

  const awards: HomeAward[] = awardDocs
    .filter((doc) => hasLocaleContent(doc.caption))
    .map((doc) => {
      const caption = doc.caption || ''
      return { image: mediaUrl(doc.image) || '', captionTh: caption, captionEn: caption }
    })

  return { hero, branches, doctors, programs, articles, awards, membershipTeaser, footer, topbar }
}
