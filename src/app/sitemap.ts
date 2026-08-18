import type { MetadataRoute } from 'next'

import { getArticlesListing } from '@/lib/articlesData'
import { getBranchesListing } from '@/lib/branchesData'
import { getDoctorsListing } from '@/lib/doctorsData'
import { localizedHref } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'
import { getProgramsListing } from '@/lib/programsData'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Pages that aren't backed by a repeatable Payload collection, so there's
// no listing function to pull slugs from — just the fixed route list.
// (No standalone /branch listing page exists — /contact serves that role —
// so it's deliberately not included here.)
const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: '', priority: 1 },
  { path: '/ecosystem', priority: 0.8 },
  { path: '/doctor', priority: 0.8 },
  { path: '/program', priority: 0.8 },
  { path: '/article', priority: 0.8 },
  { path: '/contact', priority: 0.7 },
  { path: '/membership', priority: 0.7 },
  { path: '/privacy-policy', priority: 0.3 },
]

function buildEntry(
  path: string,
  locales: LocaleCode[],
  extra: { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number },
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${SITE_URL}${localizedHref(locale, path)}`]),
  )
  return locales.map((locale) => ({
    url: `${SITE_URL}${localizedHref(locale, path)}`,
    alternates: { languages },
    ...extra,
  }))
}

// Builds a slug -> [locales that actually have this record translated] map
// from one listing fetcher's result across every live locale — each
// listing fetcher already filters out records with no content in the
// locale it was called with (see programsData.ts's file comment), so a
// slug's presence here IS the "does this locale have real content"
// signal. Used so a record translated into th/en only produces exactly 2
// <url> entries (with a 2-language hreflang alternates map), not one per
// every live locale regardless of whether that locale actually has the
// content — an untranslated locale's URL would otherwise 404 (see
// src/app/[locale]/(public)/*/[slug]/page.tsx's `if (!x) notFound()`,
// which now returns null for exactly this case).
function buildSlugLocaleMap(perLocaleLists: Array<{ locale: LocaleCode; items: Array<{ slug: string }> }>): Map<string, LocaleCode[]> {
  const map = new Map<string, LocaleCode[]>()
  for (const { locale, items } of perLocaleLists) {
    for (const item of items) {
      const existing = map.get(item.slug)
      if (existing) existing.push(locale)
      else map.set(item.slug, [locale])
    }
  }
  return map
}

function buildRecordEntries(
  pathPrefix: string,
  slugLocales: Map<string, LocaleCode[]>,
  extra: { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number },
): MetadataRoute.Sitemap {
  return Array.from(slugLocales.entries()).flatMap(([slug, locales]) => buildEntry(`${pathPrefix}/${slug}`, locales, extra))
}

// Generates /sitemap.xml. Every dynamic [slug] route pulls its list of
// published, per-locale-translated documents live from Payload (same
// listing functions the actual pages use), so a new doctor/program/
// article/branch — or a newly-translated one — shows up here
// automatically the next time this route is requested.
//
// i18n rewrite: every static path gets one <url> entry per currently
// publiclyLive locale, same as before. Every per-record path ([slug]
// routes) instead gets one <url> entry per locale that record actually
// has content in — see buildSlugLocaleMap()'s comment for why that
// stopped being the same set as "every live locale" once per-locale
// content filtering shipped.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const liveLocales = await getPubliclyLiveLocales()

  const [doctorsByLocale, programsByLocale, articlesByLocale, branchesByLocale] = await Promise.all([
    Promise.all(liveLocales.map(async (locale) => ({ locale, items: await getDoctorsListing(locale) }))),
    Promise.all(liveLocales.map(async (locale) => ({ locale, items: await getProgramsListing(locale) }))),
    Promise.all(liveLocales.map(async (locale) => ({ locale, items: await getArticlesListing(locale) }))),
    Promise.all(liveLocales.map(async (locale) => ({ locale, items: await getBranchesListing(locale) }))),
  ])

  const staticEntries = STATIC_ROUTES.flatMap(({ path, priority }) =>
    buildEntry(path, liveLocales, { changeFrequency: 'weekly', priority }),
  )

  const doctorEntries = buildRecordEntries('/doctor', buildSlugLocaleMap(doctorsByLocale), { changeFrequency: 'monthly', priority: 0.6 })
  const programEntries = buildRecordEntries('/program', buildSlugLocaleMap(programsByLocale), { changeFrequency: 'monthly', priority: 0.6 })
  const articleEntries = buildRecordEntries('/article', buildSlugLocaleMap(articlesByLocale), { changeFrequency: 'monthly', priority: 0.5 })
  const branchEntries = buildRecordEntries('/branch', buildSlugLocaleMap(branchesByLocale), { changeFrequency: 'monthly', priority: 0.6 })

  return [...staticEntries, ...doctorEntries, ...programEntries, ...articleEntries, ...branchEntries]
}
