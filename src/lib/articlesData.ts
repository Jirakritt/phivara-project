import { findBothLocales, mediaUrl } from './payload'

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
  type: 'paragraph' | 'heading' | 'quote'
  tag?: 'h2' | 'h3'
  id?: string
  textTh: string
  textEn: string
  isLead?: boolean
  // program_detail-style content gap: the seed data leaves a heading with no
  // paragraph under it when that section's real content lives in a separate
  // field instead (see insightSteps below) — e.g. "กระบวนการ 4 ขั้นตอน" is
  // immediately followed by the next h2 in the raw body. Detected here so
  // the page can render the insight-grid in the right spot without a
  // dedicated "insert after section X" field in the schema.
  insightStepsAfter?: boolean
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
  bodyBlocks: ArticleBodyBlock[]
  toc: ArticleTocEntry[]
  insightSteps: Array<{ titleTh: string; titleEn: string; descriptionTh: string; descriptionEn: string }>
  noteBox: { headingTh: string; headingEn: string; textTh: string; textEn: string } | null
  tags: string[]
  relatedDoctors: ArticleDoctorRef[]
}

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

function mapArticleCard(th: any, en: any): ArticleCard {
  return {
    slug: th.slug,
    category: th.category,
    categoryLabelTh: th.categoryLabel || '',
    categoryLabelEn: en?.categoryLabel || th.categoryLabel || '',
    titleTh: th.title,
    titleEn: en?.title || th.title,
    summaryTh: th.summary || '',
    summaryEn: en?.summary || th.summary || '',
    image: mediaUrl(th.coverImage) || '/assets/images/doctors/jr-02.png',
    dateTh: formatThaiDate(th.publishedDate),
    dateEn: formatEnDate(th.publishedDate),
    readTimeMinutes: th.readTimeMinutes,
    readTimeTh: `${th.readTimeMinutes} นาที`,
    readTimeEn: `${th.readTimeMinutes} min`,
  }
}

// /article catalog grid — every published article, card-level fields only.
export async function getArticlesListing(): Promise<ArticleCard[]> {
  const pairs = await findBothLocales<any>('articles', {
    limit: 200,
    depth: 0,
    sort: '-publishedDate',
    where: { _status: { equals: 'published' } },
  })
  return pairs.map(({ th, en }) => mapArticleCard(th, en))
}

// "MOST READ" sidebar + related-articles style lookups.
export async function getPopularArticles(excludeSlug?: string, limit = 3): Promise<ArticleCard[]> {
  const pairs = await findBothLocales<any>('articles', {
    limit: limit + 1,
    depth: 0,
    sort: '-publishedDate',
    where: { _status: { equals: 'published' }, popular: { equals: true } },
  })
  return pairs.map(({ th, en }) => mapArticleCard(th, en)).filter((a) => a.slug !== excludeSlug).slice(0, limit)
}

// "CONTINUE READING" — same-category articles first (most relevant to what
// the reader is on), then backfills with the latest published articles
// overall if the category doesn't have enough to fill `limit`. Both passes
// dedupe against the current article and against each other so the
// fallback never repeats a card already picked from the category pass.
export async function getOtherArticles(excludeSlug: string, category?: string, limit = 3): Promise<ArticleCard[]> {
  const collected: ArticleCard[] = []
  const seenSlugs = new Set([excludeSlug])

  if (category) {
    const categoryPairs = await findBothLocales<any>('articles', {
      limit: limit + 1,
      depth: 0,
      sort: '-publishedDate',
      where: { _status: { equals: 'published' }, category: { equals: category } },
    })
    for (const { th, en } of categoryPairs) {
      if (collected.length >= limit) break
      const card = mapArticleCard(th, en)
      if (seenSlugs.has(card.slug)) continue
      collected.push(card)
      seenSlugs.add(card.slug)
    }
  }

  if (collected.length < limit) {
    const fallbackPairs = await findBothLocales<any>('articles', {
      limit: limit + seenSlugs.size,
      depth: 0,
      sort: '-publishedDate',
      where: { _status: { equals: 'published' } },
    })
    for (const { th, en } of fallbackPairs) {
      if (collected.length >= limit) break
      const card = mapArticleCard(th, en)
      if (seenSlugs.has(card.slug)) continue
      collected.push(card)
      seenSlugs.add(card.slug)
    }
  }

  return collected
}

// Walks a Lexical root and pairs up TH/EN nodes positionally (both locales
// were built from the same bodyTh block list in seed.ts, so they're always
// the same length/shape — see cms/seed/data/articles.ts).
function parseBodyBlocks(thDoc: any, enDoc: any): ArticleBodyBlock[] {
  const thNodes: any[] = thDoc?.root?.children || []
  const enNodes: any[] = enDoc?.root?.children || []
  const getText = (node: any) => (node?.children || []).map((c: any) => c.text || '').join('')

  let sawFirstParagraph = false
  return thNodes.map((node, i) => {
    const enNode = enNodes[i]
    const textTh = getText(node)
    const textEn = enNode ? getText(enNode) : textTh
    const nextNode = thNodes[i + 1]

    if (node.type === 'heading') {
      const id = slugifyHeading(textTh)
      const insightStepsAfter = nextNode?.type === 'heading'
      return { type: 'heading' as const, tag: node.tag, id, textTh, textEn, insightStepsAfter }
    }
    if (node.type === 'quote') {
      return { type: 'quote' as const, textTh, textEn }
    }
    const isLead = !sawFirstParagraph
    sawFirstParagraph = true
    return { type: 'paragraph' as const, textTh, textEn, isLead }
  })
}

export async function getArticleDetail(slug: string): Promise<ArticleDetail | null> {
  const pairs = await findBothLocales<any>('articles', {
    limit: 1,
    depth: 2,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  if (!pairs.length) return null
  const { th, en } = pairs[0]
  const card = mapArticleCard(th, en)

  const bodyBlocks = parseBodyBlocks(th.body, en?.body)
  const toc: ArticleTocEntry[] = bodyBlocks
    .filter((b): b is ArticleBodyBlock & { id: string; tag: 'h2' } => b.type === 'heading' && b.tag === 'h2')
    .map((b) => ({ id: b.id!, th: b.textTh, en: b.textEn }))

  const relatedDoctors: ArticleDoctorRef[] = (th.relatedDoctors || [])
    .filter((d: any) => d && typeof d === 'object')
    .map((d: any, i: number) => {
      const enDoctor = en?.relatedDoctors?.[i]
      return {
        slug: d.slug,
        nameTh: d.nameTh,
        nameEn: (typeof enDoctor === 'object' && enDoctor?.nameEn) || d.nameEn,
        noteTh: d.specialtyLabel || '',
        noteEn: (typeof enDoctor === 'object' && enDoctor?.specialtyLabel) || d.specialtyLabel || '',
        image: mediaUrl(d.cardPhoto) || mediaUrl(d.portrait) || '/assets/images/doctors/dr01.png',
      }
    })

  return {
    ...card,
    authorNameTh: th.author?.name || 'ทีมแพทย์ PHIVARA',
    authorNameEn: en?.author?.name || th.author?.name || 'PHIVARA Medical Team',
    bodyBlocks,
    toc,
    insightSteps: (th.insightSteps || []).map((step: any, i: number) => ({
      titleTh: step.title || '',
      titleEn: en?.insightSteps?.[i]?.title || step.title || '',
      descriptionTh: step.description || '',
      descriptionEn: en?.insightSteps?.[i]?.description || step.description || '',
    })),
    noteBox: th.noteBox?.text
      ? {
          headingTh: th.noteBox.heading || '',
          headingEn: en?.noteBox?.heading || th.noteBox.heading || '',
          textTh: th.noteBox.text,
          textEn: en?.noteBox?.text || th.noteBox.text,
        }
      : null,
    tags: (th.tags || []).map((t: any) => t.text),
    relatedDoctors,
  }
}

// Static — matches article.html's category dropdown exactly.
export const ARTICLE_CATEGORY_OPTIONS = [
  { value: 'plastic', th: 'ศัลยกรรมตกแต่ง', en: 'Plastic Surgery' },
  { value: 'longevity', th: 'เวชศาสตร์อายุยืนยาว', en: 'Anti-Aging & Longevity' },
  { value: 'dermatology', th: 'ผิวหนังและเลเซอร์', en: 'Dermatology' },
  { value: 'wellness', th: 'สุขภาวะเชิงความงาม', en: 'Aesthetic Wellness' },
]
