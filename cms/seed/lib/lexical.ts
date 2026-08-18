// Minimal builders for Lexical's serialized editor state, the JSON format
// @payloadcms/richtext-lexical stores in richText fields. Good enough for
// migrating plain paragraphs/headings/quotes out of the old static HTML —
// not a full HTML-to-Lexical converter.

type LexicalNode = Record<string, unknown>

const textNode = (text: string, format = 0) => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

export const paragraph = (text: string): LexicalNode => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

export const heading = (tag: 'h2' | 'h3', text: string): LexicalNode => ({
  type: 'heading',
  tag,
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

export const quote = (text: string): LexicalNode => ({
  type: 'quote',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

export const listItem = (text: string, value: number): LexicalNode => ({
  type: 'listitem',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  value,
})

// Lexical's ListNode — children are `listitem` nodes (each holding its own
// text one level down), never text nodes directly. See src/lib/richText.ts's
// parseRichTextBlocks()/articlesData.ts's parseBodyBlocks() for the reader
// side of this same shape, and DEPLOY.md for the bug that shape caused
// before those readers accounted for it.
export const list = (listType: 'bullet' | 'number', items: string[]): LexicalNode => ({
  type: 'list',
  listType,
  tag: listType === 'number' ? 'ol' : 'ul',
  start: 1,
  children: items.map((text, i) => listItem(text, i + 1)),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

export const lexicalDoc = (nodes: LexicalNode[]) => ({
  root: {
    type: 'root',
    children: nodes,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

// Shorthand for the common case: an array of plain paragraph strings.
export const lexicalFromParagraphs = (paragraphs: string[]) => lexicalDoc(paragraphs.map(paragraph))
