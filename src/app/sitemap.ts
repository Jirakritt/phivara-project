import type { MetadataRoute } from 'next'

import { getArticlesListing } from '@/lib/articlesData'
import { getBranchesListing } from '@/lib/branchesData'
import { getDoctorsListing } from '@/lib/doctorsData'
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

// Generates /sitemap.xml. Every dynamic [slug] route pulls its list of
// published documents live from Payload (same listing functions the actual
// pages use), so a new doctor/program/article/branch shows up here
// automatically the next time this route is requested — no manual upkeep.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctors, programs, articles, branches] = await Promise.all([
    getDoctorsListing(),
    getProgramsListing(),
    getArticlesListing(),
    getBranchesListing(),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly',
    priority,
  }))

  const doctorEntries: MetadataRoute.Sitemap = doctors.map((doctor) => ({
    url: `${SITE_URL}/doctor/${doctor.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const programEntries: MetadataRoute.Sitemap = programs.map((program) => ({
    url: `${SITE_URL}/program/${program.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/article/${article.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  const branchEntries: MetadataRoute.Sitemap = branches.map((branch) => ({
    url: `${SITE_URL}/branch/${branch.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...doctorEntries, ...programEntries, ...articleEntries, ...branchEntries]
}
