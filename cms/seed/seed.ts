// One-time migration: reads the content already extracted from
// phivara-design-html and writes it into Payload via the Local API.
//
// Run with: npm run seed
//
// Safe to re-run any time — it deletes everything it previously seeded
// (articles, programs, doctors, branches, media) before writing fresh
// copies. It does NOT touch the `users` collection, so your admin login
// survives a re-seed.
import 'dotenv/config'

import { getPayload, type Payload } from 'payload'

import config from '../payload.config'
import { articlesData } from './data/articles'
import { awardsData } from './data/awards'
import { branchesData } from './data/branches'
import { doctorsData } from './data/doctors'
import { ecosystemData } from './data/ecosystem'
import { footerData } from './data/footer'
import { homeHeroData } from './data/homeHero'
import { membershipData } from './data/membership'
import { genericProgramCopy, programsData, pv02SpecialCopy } from './data/programs'
import { heading, lexicalFromParagraphs, paragraph, quote } from './lib/lexical'
import { getOrCreateMedia } from './lib/media'

// Doctors/Programs/Articles have `versions: { drafts: true }` for the
// medical/legal review workflow. Payload's `_status` field defaults to
// 'draft' unless a document is explicitly published — passing `draft:true`
// or omitting it entirely both leave it as a draft, invisible to the
// public site's `_status: 'published'` queries. Force it here so seeded
// content actually shows up on the frontend.
const VERSIONED_COLLECTIONS = new Set(['doctors', 'programs', 'articles'])

// Payload always fully replaces an array field's rows on update rather than
// merging by position. When the 'en' locale update sends a fresh array with
// no `id`s, Payload can't tell those rows are "the same" ones created under
// 'th' — it deletes the old rows and inserts brand new ones. Those new rows
// only ever get their localized sub-fields (e.g. tags[].label,
// checkupItems[].name) written for the 'en' locale, so the 'th' value is
// silently lost even though the create+update calls both succeed with no
// error. Fix: walk the just-created doc and copy each array row's real
// `id` onto the matching enData row (recursively, for nested arrays like
// credentialGroups[].items) so the 'en' update modifies the existing rows
// in place instead of replacing them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function attachRowIds(enValue: any, sourceValue: any): any {
  if (!Array.isArray(enValue) || !Array.isArray(sourceValue)) return enValue
  return enValue.map((item, i) => {
    const source = sourceValue[i]
    if (!source || typeof item !== 'object' || item === null) return item
    const merged: Record<string, unknown> = { ...item }
    if (source.id) merged.id = source.id
    for (const key of Object.keys(item)) {
      if (Array.isArray((item as Record<string, unknown>)[key]) && Array.isArray(source[key])) {
        merged[key] = attachRowIds((item as Record<string, unknown>)[key], source[key])
      }
    }
    return merged
  })
}

async function createLocalized(
  payload: Payload,
  collection: 'branches' | 'doctors' | 'programs' | 'articles' | 'awards',
  thData: Record<string, unknown>,
  enData: Record<string, unknown>,
): Promise<string | number> {
  const data = VERSIONED_COLLECTIONS.has(collection) ? { ...thData, _status: 'published' } : thData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = await payload.create({ collection: collection as any, data: data as any, locale: 'th' })
  if (Object.keys(enData).length) {
    const enDataWithIds: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(enData)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enDataWithIds[key] = attachRowIds(value, (doc as any)[key])
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.update({ collection: collection as any, id: doc.id, data: enDataWithIds as any, locale: 'en' })
  }
  // Keep the native ID type (number for Postgres) — see note in lib/media.ts.
  return doc.id
}

async function clearExisting(payload: Payload) {
  const collections = ['articles', 'programs', 'doctors', 'branches', 'awards', 'media'] as const
  for (const collection of collections) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { docs } = await payload.find({ collection: collection as any, limit: 1000, depth: 0 })
    for (const doc of docs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.delete({ collection: collection as any, id: doc.id })
    }
    if (docs.length) console.log(`  cleared ${docs.length} existing ${collection}`)
  }
}

async function run() {
  const payload = await getPayload({ config })
  console.log('Seeding PHIVARA content from phivara-design-html...')

  console.log('Clearing previously seeded content (safe to re-run)...')
  await clearExisting(payload)

  // ---------------------------------------------------------------------
  // Branches
  // ---------------------------------------------------------------------
  const branchIds: Record<string, string | number> = {}
  for (const b of branchesData) {
    const heroImage = await getOrCreateMedia(payload, b.image, {
      th: `${b.nameTh} — PHIVARA`,
      en: `${b.nameEn} — PHIVARA`,
    })
    const id = await createLocalized(
      payload,
      'branches',
      {
        slug: b.slug,
        nameTh: b.nameTh,
        nameEn: b.nameEn,
        tagline: b.tagline.th,
        description: b.description.th,
        address: b.address.th,
        hours: b.hours.th,
        phone: b.phone,
        lineId: b.lineId,
        heroImage,
        facilities: b.facilities.th.map((text) => ({ text })),
        directions: b.directions.th,
      },
      {
        tagline: b.tagline.en,
        description: b.description.en,
        address: b.address.en,
        hours: b.hours.en,
        facilities: b.facilities.en.map((text) => ({ text })),
        directions: b.directions.en,
      },
    )
    branchIds[b.slug] = id
    console.log(`  branch: ${b.nameEn} -> ${id}`)
  }

  // ---------------------------------------------------------------------
  // Doctors
  // ---------------------------------------------------------------------
  const doctorIds: Record<string, string | number> = {}
  for (const d of doctorsData) {
    const cardPhoto = await getOrCreateMedia(payload, d.photo, { th: d.nameTh, en: d.nameEn })

    const thData: Record<string, unknown> = {
      slug: d.slug,
      nameTh: d.nameTh,
      nameEn: d.nameEn,
      branch: branchIds[d.branch],
      specialty: d.specialty,
      specialtyLabel: d.specialtyLabel.th,
      subNote: d.subNote.th,
      cardPhoto,
    }
    const enData: Record<string, unknown> = {
      specialtyLabel: d.specialtyLabel.en,
      subNote: d.subNote.en,
    }

    if (d.rich) {
      const portrait = await getOrCreateMedia(payload, d.photo, { th: d.nameTh, en: d.nameEn })
      thData.portrait = portrait
      thData.hospitalTitle = d.rich.hospitalTitle.th
      thData.boardCertification = d.rich.boardCertification.th
      thData.tags = d.rich.tags.map((t) => ({ label: t.th }))
      thData.bio = lexicalFromParagraphs([d.rich.bio.th])
      thData.credentialGroups = d.rich.credentialGroups.map((g) => ({
        heading: g.heading.th,
        items: g.items.map((i) => ({ text: i.th })),
      }))
      thData.schedule = d.rich.schedule.map((s) => ({
        day: s.day,
        hours: s.hours,
        locationName: s.locationName.th,
      }))
      thData.contactIntro = d.rich.contactIntro.th
      thData.contactFact = d.rich.contactFact.th

      enData.hospitalTitle = d.rich.hospitalTitle.en
      enData.boardCertification = d.rich.boardCertification.en
      enData.tags = d.rich.tags.map((t) => ({ label: t.en }))
      enData.bio = lexicalFromParagraphs([d.rich.bio.en])
      enData.credentialGroups = d.rich.credentialGroups.map((g) => ({
        heading: g.heading.en,
        items: g.items.map((i) => ({ text: i.en })),
      }))
      enData.schedule = d.rich.schedule.map((s) => ({
        day: s.day,
        hours: s.hours,
        locationName: s.locationName.en,
      }))
      enData.contactIntro = d.rich.contactIntro.en
      enData.contactFact = d.rich.contactFact.en
    }

    const id = await createLocalized(payload, 'doctors', thData, enData)
    doctorIds[d.slug] = id
    console.log(`  doctor: ${d.nameEn} -> ${id}`)
  }

  // ---------------------------------------------------------------------
  // Programs
  // ---------------------------------------------------------------------
  const programIds: Record<string, string | number> = {}
  for (const p of programsData) {
    const heroImage = await getOrCreateMedia(payload, p.image, { th: p.titleTh, en: p.titleEn })
    const isPv02 = p.slug === 'pv02'

    const aboutTh = isPv02 ? pv02SpecialCopy.aboutTh : `${p.descTh} ${genericProgramCopy.aboutSuffixTh}`
    const purposeList = isPv02 ? pv02SpecialCopy.purposeList : genericProgramCopy.purposeList
    const audienceList = isPv02 ? pv02SpecialCopy.audienceList : genericProgramCopy.audienceList

    const thData: Record<string, unknown> = {
      slug: p.slug,
      code: p.code,
      category: p.category,
      tag: p.tag,
      title: p.titleTh,
      shortDescription: p.descTh,
      highlights: p.highlights?.map((h) => ({ text: h.th })),
      cardNote: p.cardNote?.th,
      price: p.price,
      // program.html's highlight carousel hardcoded exactly these 4 slugs
      // in this order — see phivara-design-html/program.html's
      // #highlightCarousel markup.
      featured: ['pv01', 'pv02', 'pv03', 'pv06'].includes(p.slug),
      branch: p.branch ? branchIds[p.branch] : undefined,
      heroImage,
      aboutProgram: lexicalFromParagraphs([aboutTh]),
      purposeList: purposeList.map((i) => ({ text: i.th })),
      audienceList: audienceList.map((i) => ({ text: i.th })),
      searchKeywords: p.searchKeywords,
    }
    const enData: Record<string, unknown> = {
      tag: p.tag,
      title: p.titleEn,
      shortDescription: p.descEn,
      highlights: p.highlights?.map((h) => ({ text: h.en })),
      cardNote: p.cardNote?.en,
      aboutProgram: lexicalFromParagraphs([p.descEn]), // no EN generic suffix exists in source — see programs.ts note
      // No English translation exists in source for these two lists either —
      // reusing the Thai text as a placeholder so the EN locale isn't left
      // empty. TODO: get real English copy from the clinic before launch.
      purposeList: purposeList.map((i) => ({ text: i.th })),
      audienceList: audienceList.map((i) => ({ text: i.th })),
    }

    if (isPv02) {
      // No English translation exists in source for pv02's checkup tables
      // or terms of service — reusing Thai text as an EN placeholder (same
      // TODO as purposeList/audienceList above).
      thData.checkupItems = [
        ...pv02SpecialCopy.maleTests.map((t) => ({ group: 'male', name: t.name.th, description: t.description.th })),
        ...pv02SpecialCopy.femaleTests.map((t) => ({ group: 'female', name: t.name.th, description: t.description.th })),
      ]
      enData.checkupItems = [
        ...pv02SpecialCopy.maleTests.map((t) => ({ group: 'male', name: t.name.th, description: t.description.th })),
        ...pv02SpecialCopy.femaleTests.map((t) => ({ group: 'female', name: t.name.th, description: t.description.th })),
      ]
      thData.termsOfService = pv02SpecialCopy.termsOfService.map((text) => ({ description: text }))
      enData.termsOfService = pv02SpecialCopy.termsOfService.map((text) => ({ description: text }))
      thData.contactOverride = {
        location: pv02SpecialCopy.contactOverride.location.th,
        hours: pv02SpecialCopy.contactOverride.hours.th,
        phone: pv02SpecialCopy.contactOverride.phone,
      }
      enData.contactOverride = {
        location: pv02SpecialCopy.contactOverride.location.th,
        hours: pv02SpecialCopy.contactOverride.hours.th,
        phone: pv02SpecialCopy.contactOverride.phone,
      }
    } else {
      thData.checkupItems = genericProgramCopy.checkupItems.map((c) => ({ group: 'all', name: c.name.th }))
      enData.checkupItems = genericProgramCopy.checkupItems.map((c) => ({ group: 'all', name: c.name.en }))
      thData.termsOfService = genericProgramCopy.termsOfService.map((t) => ({
        title: t.title.th,
        description: t.description.th,
      }))
      enData.termsOfService = genericProgramCopy.termsOfService.map((t) => ({
        title: t.title.en,
        description: t.description.en,
      }))
    }

    const id = await createLocalized(payload, 'programs', thData, enData)
    programIds[p.slug] = id
    console.log(`  program: ${p.titleEn} -> ${id}`)
  }

  // ---------------------------------------------------------------------
  // Articles
  // ---------------------------------------------------------------------
  for (const a of articlesData) {
    const coverImage = await getOrCreateMedia(payload, a.image, { th: a.title.th, en: a.title.en })

    const bodyNodes = a.bodyTh.map((block) => {
      if (block.type === 'h2') return heading('h2', block.text)
      if (block.type === 'quote') return quote(block.text)
      return paragraph(block.text)
    })

    const thData: Record<string, unknown> = {
      slug: a.slug,
      title: a.title.th,
      summary: a.summary.th,
      category: a.category,
      categoryLabel: a.categoryLabel.th,
      coverImage,
      author: { name: a.authorName.th },
      publishedDate: a.publishedDate,
      readTimeMinutes: a.readTimeMinutes,
      body: { root: { type: 'root', children: bodyNodes, direction: 'ltr', format: '', indent: 0, version: 1 } },
      tags: a.tags.map((t) => ({ text: t })),
      relatedDoctors: a.relatedDoctorSlugs.map((slug) => doctorIds[slug]).filter(Boolean),
      popular: a.popular,
      ...(a.noteBox
        ? { noteBox: { heading: a.noteBox.heading.th, text: a.noteBox.text.th } }
        : {}),
      ...(a.insightSteps
        ? { insightSteps: a.insightSteps.map((s) => ({ title: s.title.th, description: s.description.th })) }
        : {}),
    }
    const enData: Record<string, unknown> = {
      title: a.title.en,
      summary: a.summary.en,
      categoryLabel: a.categoryLabel.en,
      author: { name: a.authorName.en },
      ...(a.noteBox
        ? { noteBox: { heading: a.noteBox.heading.en, text: a.noteBox.text.en } }
        : {}),
      ...(a.insightSteps
        ? { insightSteps: a.insightSteps.map((s) => ({ title: s.title.en, description: s.description.en })) }
        : {}),
      // No English body copy exists in source (article_detail.html is
      // Thai-only) — reusing the Thai body as a placeholder so the EN page
      // isn't blank. TODO: get real English copy before launch.
      body: { root: { type: 'root', children: bodyNodes, direction: 'ltr', format: '', indent: 0, version: 1 } },
    }

    const id = await createLocalized(payload, 'articles', thData, enData)
    console.log(`  article: ${a.title.en} -> ${id}`)
  }

  // ---------------------------------------------------------------------
  // Awards
  // ---------------------------------------------------------------------
  for (const a of awardsData) {
    const image = await getOrCreateMedia(payload, a.image, { th: a.captionTh, en: a.captionEn })
    const id = await createLocalized(
      payload,
      'awards',
      { image, caption: a.captionTh },
      { caption: a.captionEn },
    )
    console.log(`  award: ${a.captionEn} -> ${id}`)
  }

  // ---------------------------------------------------------------------
  // Membership global
  // ---------------------------------------------------------------------
  const promiseImage = await getOrCreateMedia(payload, membershipData.promise.image, {
    th: 'พื้นที่รับรองส่วนตัว PHIVARA',
    en: 'PHIVARA private lounge',
  })

  const membershipTh = await payload.updateGlobal({
    slug: 'membership',
    locale: 'th',
    data: {
      hero: { kicker: membershipData.hero.kicker.th, headline: membershipData.hero.headline.th, lead: membershipData.hero.lead.th },
      intro: {
        overline: membershipData.intro.overline.th,
        heading: membershipData.intro.heading.th,
        body: membershipData.intro.body.th,
      },
      privileges: membershipData.privileges.map((p) => ({ title: p.title.th, description: p.description.th })),
      promise: { image: promiseImage, quote: membershipData.promise.quote.th, body: membershipData.promise.body.th },
      journeySteps: membershipData.journeySteps.map((s) => ({ title: s.title.th, description: s.description.th })),
      faq: membershipData.faq.map((f) => ({ question: f.question.th, answer: f.answer.th })),
      finalCta: {
        overline: membershipData.finalCta.overline.th,
        heading: membershipData.finalCta.heading.th,
        body: membershipData.finalCta.body.th,
        buttonLabel: membershipData.finalCta.buttonLabel.th,
      },
    },
  })
  await payload.updateGlobal({
    slug: 'membership',
    locale: 'en',
    data: {
      hero: { kicker: membershipData.hero.kicker.en, headline: membershipData.hero.headline.en, lead: membershipData.hero.lead.en },
      intro: {
        overline: membershipData.intro.overline.en,
        heading: membershipData.intro.heading.en,
        body: membershipData.intro.body.en,
      },
      // Payload replaces an array field's rows wholesale on update rather
      // than merging by position (see attachRowIds's comment above) — a
      // Global hits the exact same issue collections do. Without
      // reattaching the row ids the 'th' update just created, this 'en'
      // update would delete+recreate the privileges/journeySteps/faq rows,
      // silently losing every 'th' value that lived on the old rows.
      privileges: attachRowIds(
        membershipData.privileges.map((p) => ({ title: p.title.en, description: p.description.en })),
        membershipTh.privileges,
      ),
      promise: { quote: membershipData.promise.quote.en, body: membershipData.promise.body.en },
      journeySteps: attachRowIds(
        membershipData.journeySteps.map((s) => ({ title: s.title.en, description: s.description.en })),
        membershipTh.journeySteps,
      ),
      faq: attachRowIds(
        membershipData.faq.map((f) => ({ question: f.question.en, answer: f.answer.en })),
        membershipTh.faq,
      ),
      finalCta: {
        overline: membershipData.finalCta.overline.en,
        heading: membershipData.finalCta.heading.en,
        body: membershipData.finalCta.body.en,
        buttonLabel: membershipData.finalCta.buttonLabel.en,
      },
    },
  })
  console.log('  membership global updated')

  // ---------------------------------------------------------------------
  // Ecosystem global
  // ---------------------------------------------------------------------
  const disciplineImages = await Promise.all(
    ecosystemData.disciplines.map((d) =>
      getOrCreateMedia(payload, d.image, {
        th: `${d.title.th} — PHIVARA`,
        en: `${d.title.en} — PHIVARA`,
      }),
    ),
  )

  const ecosystemTh = await payload.updateGlobal({
    slug: 'ecosystem',
    locale: 'th',
    data: {
      hero: {
        eyebrow: ecosystemData.hero.eyebrow.th,
        headlineLine1: ecosystemData.hero.headlineLine1.th,
        headlineLine2: ecosystemData.hero.headlineLine2.th,
        lead: ecosystemData.hero.lead.th,
      },
      disciplines: ecosystemData.disciplines.map((d, i) => ({
        eyebrow: d.eyebrow.th,
        title: d.title.th,
        subtitle: d.subtitle.th,
        description: d.description.th,
        chips: d.chips.map((c) => ({ label: c.th })),
        doctorLinkLabel: d.doctorLinkLabel.th,
        programLinkLabel: d.programLinkLabel.th,
        articleLinkLabel: d.articleLinkLabel.th,
        image: disciplineImages[i],
      })),
      closingCta: {
        eyebrow: ecosystemData.closingCta.eyebrow.th,
        heading: ecosystemData.closingCta.heading.th,
        body: ecosystemData.closingCta.body.th,
        buttonLabel: ecosystemData.closingCta.buttonLabel.th,
      },
    },
  })
  await payload.updateGlobal({
    slug: 'ecosystem',
    locale: 'en',
    data: {
      hero: {
        eyebrow: ecosystemData.hero.eyebrow.en,
        headlineLine1: ecosystemData.hero.headlineLine1.en,
        headlineLine2: ecosystemData.hero.headlineLine2.en,
        lead: ecosystemData.hero.lead.en,
      },
      // Same wholesale-array-replace issue as the Membership global above —
      // reattach the row/sub-row ids the 'th' update just created so this
      // 'en' update merges chips/disciplines in place instead of deleting
      // and recreating them (which would silently drop the 'th' values).
      disciplines: attachRowIds(
        ecosystemData.disciplines.map((d) => ({
          eyebrow: d.eyebrow.en,
          title: d.title.en,
          subtitle: d.subtitle.en,
          description: d.description.en,
          chips: d.chips.map((c) => ({ label: c.en })),
          doctorLinkLabel: d.doctorLinkLabel.en,
          programLinkLabel: d.programLinkLabel.en,
          articleLinkLabel: d.articleLinkLabel.en,
        })),
        ecosystemTh.disciplines,
      ),
      closingCta: {
        eyebrow: ecosystemData.closingCta.eyebrow.en,
        heading: ecosystemData.closingCta.heading.en,
        body: ecosystemData.closingCta.body.en,
        buttonLabel: ecosystemData.closingCta.buttonLabel.en,
      },
    },
  })
  console.log('  ecosystem global updated')

  // ---------------------------------------------------------------------
  // Home hero global
  // ---------------------------------------------------------------------
  const heroBackgroundImages = await Promise.all(
    homeHeroData.backgroundImages.map((path, i) =>
      getOrCreateMedia(payload, path, { th: `PHIVARA hero background ${i + 1}`, en: `PHIVARA hero background ${i + 1}` }),
    ),
  )

  await payload.updateGlobal({
    slug: 'home-hero',
    locale: 'th',
    data: {
      eyebrow: homeHeroData.eyebrow.th,
      headline: homeHeroData.headline.th,
      lead: homeHeroData.lead.th,
      ctaLabel: homeHeroData.ctaLabel.th,
      // Not localized (see cms/globals/HomeHero.ts) — set once here, never
      // touched by the 'en' update below, so there's no risk of the usual
      // wholesale-array-replace issue clobbering it.
      backgroundImages: heroBackgroundImages.map((image) => ({ image })),
    },
  })
  await payload.updateGlobal({
    slug: 'home-hero',
    locale: 'en',
    data: {
      eyebrow: homeHeroData.eyebrow.en,
      headline: homeHeroData.headline.en,
      lead: homeHeroData.lead.en,
      ctaLabel: homeHeroData.ctaLabel.en,
    },
  })
  console.log('  home-hero global updated')

  // ---------------------------------------------------------------------
  // Footer global
  // ---------------------------------------------------------------------
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'th',
    data: {
      tagline: footerData.tagline.th,
      linkGroups: footerData.linkGroups.map((group) => ({
        heading: group.heading.th,
        links: group.links.map((link) => ({ label: link.label.th, url: link.url })),
      })),
      copyrightText: footerData.copyrightText.th,
      socialLinks: footerData.socialLinks,
    },
  })
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: {
      tagline: footerData.tagline.en,
      linkGroups: footerData.linkGroups.map((group) => ({
        heading: group.heading.en,
        links: group.links.map((link) => ({ label: link.label.en, url: link.url })),
      })),
      copyrightText: footerData.copyrightText.en,
    },
  })
  console.log('  footer global updated')

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
