// Shared Lexical root -> flat block-list walker, used by any page.tsx that
// renders a single free-form `richText` field as prose (currently just
// src/lib/privacyPolicyData.ts). Deliberately NOT shared with
// articlesData.ts's parseBodyBlocks — that one also derives article-only
// concerns (isLead, insightStepsAfter, table-of-contents ids feeding a
// sticky nav) on top of the same node walk, and this project's convention
// (see programsData.ts/articlesData.ts file comments) is to keep each
// page's data-shaping local rather than force a premature shared
// abstraction across unrelated features. The list-node handling below is
// copied from articlesData.ts's parseBodyBlocks on purpose — that's the
// fix for lists silently disappearing (list/listitem nodes carry no flat
// .text, only their listitem children do) — see this project's DEPLOY.md
// for the article-list-rendering bug this pattern fixes.
export interface RichTextBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'list'
  tag?: string
  id?: string
  text: string
  listType?: 'bullet' | 'number'
  items?: string[]
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'section'
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseRichTextBlocks(doc: any): RichTextBlock[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = doc?.root?.children || []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getText = (node: any) => (node?.children || []).map((c: any) => c.text || '').join('')

  return nodes.map((node): RichTextBlock => {
    const text = getText(node)

    if (node.type === 'heading') {
      return { type: 'heading', tag: node.tag, id: slugify(text), text }
    }
    if (node.type === 'quote') {
      return { type: 'quote', text }
    }
    if (node.type === 'list') {
      const items: string[] = (node.children || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((li: any) => li.type === 'listitem')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((li: any) =>
          (li.children || [])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((c: any) => c.type !== 'list')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((c: any) => c.text || '')
            .join(''),
        )
      const listType = node.listType === 'number' ? ('number' as const) : ('bullet' as const)
      return { type: 'list', listType, items, text: '' }
    }
    return { type: 'paragraph', text }
  })
}
