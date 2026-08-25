import type { LocaleCode } from './i18n'
import type { SeoData } from './payload'

import { findLocalized, hasLocaleContent, mapSeo, mediaUrl } from './payload'

export interface ArticleCard {
  slug: string
  category: string
  categoryLabelTh: string
  categoryLabelEn: string
  titleTh: string
  titleEn: string
  summaryTh: string
  summaryEn: string
  image: string
  dateTh: string
  dateEn: string
  readTimeMinutes: number
  readTimeTh: string
  readTimeEn: string
}

export interface ArticleBodyBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'list'
  tag?: 'h2' | 'h3'
  id?: string
  textTh: string
  textEn: string
  isLead?: boolean
  insightStepsAfter?: boolean
  // Only set when type === 'list' — Lexical's `list` node (bullet/number)
  // and its `listitem` children never carried a flat .text value, so the
  // old parseBodyBlocks fell through to the generic paragraph case and
  // rendered an empty <p>, silently dropping every list in an article body.
  listType?: 'bullet' | 'number'
  items?: Array<{ textTh: string; textEn: string }>
}

export interface ArticleTocEntry {
  id: string
  th: string
  en: string
}

export interface ArticleDoctorRef {
  slug: string
  nameTh: string
  nameEn: string
  noteTh: string
  noteEn: string
  image: string
}

export interface ArticleDetail extends ArticleCard {
  authorNameTh: string
  authorNameEn: string
  authorImage: string
  bodyBlocks: ArticleBodyBlock[]
  toc: ArticleTocEntry[]
  insightSteps: Array<{ titleTh: string; titleEn: string; descriptionTh: string; descriptionEn: string }>
  noteBox: { headingTh: string; headingEn: string; textTh: string; textEn: string } | null
  tags: string[]
  relatedDoctors: ArticleDoctorRef[]
  seo: SeoData
}

// Shown next to the byline and in the "MEDICAL REVIEW" box when an
// article's author.avatar (Articles.ts) is left blank.
const DEFAULT_AUTHOR_IMAGE = '/assets/images/authors/default-author.png'

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
function formatThaiDate(dateString: string): string {
  const d = new Date(dateString)
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`
}
function formatEnDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'section'
}

// Per-locale filtering (see src/lib/payload.ts's findLocalized/
// hasLocaleContent, and programsData.ts's file comment for the full
// rationale): every getX() below only returns articles that have a
// `title` filled in for the exact `locale` requested. `xxxTh`/`xxxEn`
// fields on the returned objects both hold the SAME already-resolved
// value — see programsData.ts's comment for why that's deliberate and
// keeps every existing page.tsx `t(item.xxxTh, item.xxxEn)` call site
// working unmodified for every locale.
function mapArticleCard(doc: any): ArticleCard {
  const title = doc.title
  const summary = doc.summary || ''
  const categoryLabel = doc.categoryLabel || ''
  return {
    slug: doc.slug,
    category: doc.category,
    categoryLabelTh: categoryLabel,
    categoryLabelEn: categoryLabel,
    titleTh: title,
    titleEn: title,
    summaryTh: summary,
    summaryEn: summary,
    image: mediaUrl(doc.coverImage) || '/assets/images/doctors/jr-02.png',
    dateTh: formatThaiDate(doc.publishedDate),
    dateEn: formatEnDate(doc.publishedDate),
    readTimeMinutes: doc.readTimeMinutes,
    readTimeTh: `${doc.readTimeMinutes} นาที`,
    readTimeEn: `${doc.readTimeMinutes} min`,
  }
}

// /article catalog grid — every published article with a title in `locale`.
export async function getArticlesListing(locale: LocaleCode): Promise<ArticleCard[]> {
  const docs = await findLocalized<any>('articles', locale, {
    limit: 200,
    depth: 1,
    sort: '-publishedDate',
    where: { _status: { equals: 'published' } },
  })
  return docs.filter((d) => hasLocaleContent(d.title)).map(mapArticleCard)
}

// "MOST READ" sidebar + related-articles style lookups.
export async function getPopularArticles(locale: LocaleCode, excludeSlug?: string, limit = 3): Promise<ArticleCard[]> {
  const docs = await findLocalized<any>('articles', locale, {
    limit: limit + 1,
    depth: 1,
    sort: '-publishedDate',
    where: { _status: { equals: 'published' }, popular: { equals: true } },
  })
  return docs.filter((d) => hasLocaleContent(d.title)).map(mapArticleCard).filter((a) => a.slug !== excludeSlug).slice(0, limit)
}

// "CONTINUE READING" — same-category articles first, then backfills with
// the latest published articles overall if the category doesn't have
// enough to fill `limit`. Both passes only ever consider articles that
// have content in `locale`.
export async function getOtherArticles(locale: LocaleCode, excludeSlug: string, category?: string, limit = 3): Promise<ArticleCard[]> {
  const collected: ArticleCard[] = []
  const seenSlugs = new Set([excludeSlug])

  if (category) {
    const categoryDocs = await findLocalized<any>('articles', locale, {
      limit: limit + 1,
      depth: 1,
      sort: '-publishedDate',
      where: { _status: { equals: 'published' }, category: { equals: category } },
    })
    for (const doc of categoryDocs) {
      if (collected.length >= limit) break
      if (!hasLocaleContent(doc.title)) continue
      const card = mapArticleCard(doc)
      if (seenSlugs.has(card.slug)) continue
      collected.push(card)
      seenSlugs.add(card.slug)
    }
  }

  if (collected.length < limit) {
    const fallbackDocs = await findLocalized<any>('articles', locale, {
      limit: limit + seenSlugs.size,
      depth: 1,
      sort: '-publishedDate',
      where: { _status: { equals: 'published' } },
    })
    for (const doc of fallbackDocs) {
      if (collected.length >= limit) break
      if (!hasLocaleContent(doc.title)) continue
      const card = mapArticleCard(doc)
      if (seenSlugs.has(card.slug)) continue
      collected.push(card)
      seenSlugs.add(card.slug)
    }
  }

  return collected
}

// Walks a Lexical root and pulls the plain text back out.
function parseBodyBlocks(doc: any): ArticleBodyBlock[] {
  const nodes: any[] = doc?.root?.children || []
  const getText = (node: any) => (node?.children || []).map((c: any) => c.text || '').join('')

  let sawFirstParagraph = false
  return nodes.map((node, i) => {
    const text = getText(node)
    const nextNode = nodes[i + 1]

    if (node.type === 'heading') {
      const id = slugifyHeading(text)
      const insightStepsAfter = nextNode?.type === 'heading'
      return { type: 'heading' as const, tag: node.tag, id, textTh: text, textEn: text, insightStepsAfter }
    }
    if (node.type === 'quote') {
      return { type: 'quote' as const, textTh: text, textEn: text }
    }
    if (node.type === 'list') {
      // A `list` node's children are `listitem` nodes, not text nodes, so
      // the shallow getText() above returns '' for it — that's what made
      // lists disappear. Each listitem's own text lives directly on ITS
      // children though (one level down), except when a listitem itself
      // wraps a nested sub-list — skip those grandchild `list` nodes here
      // so a nested list isn't flattened into its parent item's label.
      const items = (node.children || [])
        .filter((li: any) => li.type === 'listitem')
        .map((li: any) => {
          const itemText = (li.children || [])
            .filter((c: any) => c.type !== 'list')
            .map((c: any) => c.text || '')
            .join('')
          return { textTh: itemText, textEn: itemText }
        })
      const listType = node.listType === 'number' ? 'number' as const : 'bullet' as const
      return { type: 'list' as const, listType, items, textTh: '', textEn: '' }
    }
    const isLead = !sawFirstParagraph
    sawFirstParagraph = true
    return { type: 'paragraph' as const, textTh: text, textEn: text, isLead }
  })
}

export async function getArticleDetail(slug: string, locale: LocaleCode): Promise<ArticleDetail | null> {
  const docs = await findLocalized<any>('articles', locale, {
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  const doc = docs[0]
  if (!doc || !hasLocaleContent(doc.title)) return null
  const card = mapArticleCard(doc)

  const bodyBlocks = parseBodyBlocks(doc.body)
  const toc: ArticleTocEntry[] = bodyBlocks
    .filter((b): b is ArticleBodyBlock & { id: string; tag: 'h2' } => b.type === 'heading' && b.tag === 'h2')
    .map((b) => ({ id: b.id!, th: b.textTh, en: b.textEn }))

  const relatedDoctors: ArticleDoctorRef[] = (doc.relatedDoctors || [])
    .filter((d: any) => d && typeof d === 'object')
    .map((d: any) => {
      const name = d.name || d.nameTh || ''
      const note = d.specialtyLabel || ''
      return {
        slug: d.slug,
        nameTh: name,
        nameEn: name,
        noteTh: note,
        noteEn: note,
        image: mediaUrl(d.cardPhoto) || mediaUrl(d.portrait) || '/assets/images/doctors/dr01.png',
      }
    })

  const authorName = doc.author?.name || 'ทีมแพทย์ PHIVARA'

  return {
    ...card,
    authorNameTh: authorName,
    authorNameEn: authorName,
    authorImage: mediaUrl(doc.author?.avatar) || DEFAULT_AUTHOR_IMAGE,
    bodyBlocks,
    toc,
    insightSteps: (doc.insightSteps || []).map((step: any) => {
      const title = step.title || ''
      const description = step.description || ''
      return { titleTh: title, titleEn: title, descriptionTh: description, descriptionEn: description }
    }),
    noteBox: doc.noteBox?.text
      ? {
          headingTh: doc.noteBox.heading || '',
          headingEn: doc.noteBox.heading || '',
          textTh: doc.noteBox.text,
          textEn: doc.noteBox.text,
        }
      : null,
    tags: (doc.tags || []).map((t: any) => t.text),
    relatedDoctors,
    seo: mapSeo(doc.seo),
  }
}

// The category dropdown's options used to live here as a static list
// (ARTICLE_CATEGORY_OPTIONS) that could never be edited from the CMS and
// had drifted out of sync with the homepage's own copy of the same 4
// labels. Both now come from a single source — see homeData.ts's
// getExpertiseCategoryOptions (reads cms/globals/HomeHero.ts's
// "หมวดความเชี่ยวชาญ" group, same fields the homepage tabs use).
