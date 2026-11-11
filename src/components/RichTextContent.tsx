import { Fragment } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { FONT_SIZE_VALUES } from '../../cms/fields/fontSizes'
import { isOptimizable, optimizedSrc, optimizedSrcSet, QUALITY } from '@/lib/imageOpt'

// Renders a Payload (Lexical) richText document with the formatting the CMS
// editor shows: paragraphs (incl. empty ones used as spacing), headings,
// bold/italic/underline/strike/code/sub/sup, links, nested lists, quotes,
// alignment, indent and uploaded images. Previously pages flattened the
// document to plain text in a single <p>, so layout and images authored in
// the CMS never appeared on the site. Pure React elements (no
// dangerouslySetInnerHTML), so content can never inject markup.
//
// Lexical text `format` bitmask: 1 bold, 2 italic, 4 strikethrough,
// 8 underline, 16 code, 32 subscript, 64 superscript.

/* eslint-disable @typescript-eslint/no-explicit-any */
type LexNode = any

const ALIGN: Record<string, CSSProperties['textAlign']> = {
  left: 'left',
  center: 'center',
  right: 'right',
  justify: 'justify',
  start: 'start',
  end: 'end',
}

function safeHref(url: unknown): string {
  const u = typeof url === 'string' ? url.trim() : ''
  if (!u) return '#'
  if (u.startsWith('/') || u.startsWith('#')) return u
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u
  return '#'
}

function blockStyle(node: LexNode): CSSProperties | undefined {
  const style: CSSProperties = {}
  const align = ALIGN[node.format as string]
  if (align) style.textAlign = align
  if (typeof node.indent === 'number' && node.indent > 0) style.paddingInlineStart = `${node.indent * 2}em`
  return Object.keys(style).length ? style : undefined
}

function renderText(node: LexNode, key: number): ReactNode {
  // Plain text is returned as-is (NO <span> wrapper): main.css locks `span` to
  // 12px and `strong` to 14px, so wrapping every text run in a span made the
  // whole article render tiny. Only formatted runs get semantic tags.
  let el: ReactNode = node.text
  const f: number = node.format || 0
  if (f & 16) el = <code>{el}</code>
  if (f & 1) el = <strong>{el}</strong>
  if (f & 2) el = <em>{el}</em>
  if (f & 4) el = <s>{el}</s>
  if (f & 8) el = <u>{el}</u>
  if (f & 32) el = <sub>{el}</sub>
  if (f & 64) el = <sup>{el}</sup>
  // CMS "font size" menu (TextStateFeature): stored as { $: { fontSize: '20' } }.
  // Rendered as a class (not inline style) because the program CSS forces inline
  // elements to inherit size with !important; .rt-fs-NN in
  // public/css/rich-text-sizes.css wins over that. Unknown keys are ignored.
  const sizeKey = Number(node.$?.fontSize)
  if ((FONT_SIZE_VALUES as readonly number[]).includes(sizeKey)) {
    el = <span className={`rt-fs-${sizeKey}`}>{el}</span>
  }
  return <Fragment key={key}>{el}</Fragment>
}

function renderInline(children: LexNode[] | undefined): ReactNode[] {
  return (children || []).map((c, i): ReactNode => {
    switch (c.type) {
      case 'text':
        return renderText(c, i)
      case 'linebreak':
        return <br key={i} />
      case 'tab':
        return <span key={i}>{'    '}</span>
      case 'link':
      case 'autolink': {
        const url = c.fields?.url ?? c.url
        const newTab = Boolean(c.fields?.newTab)
        return (
          <a key={i} href={safeHref(url)} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {renderInline(c.children)}
          </a>
        )
      }
      default:
        return c.children ? <span key={i}>{renderInline(c.children)}</span> : null
    }
  })
}

function isEmptyBlock(node: LexNode): boolean {
  const kids: LexNode[] = node.children || []
  return kids.every((c) => c.type === 'text' && !String(c.text || '').trim())
}

function renderUpload(node: LexNode, key: number): ReactNode {
  const media = node.value && typeof node.value === 'object' ? node.value : null
  const src: string | undefined = media?.url
  if (!src) return null
  const alt: string = media.alt || ''
  const w = Number(media.width) || undefined
  const h = Number(media.height) || undefined
  return (
    // Inline sizing on purpose: /css/*.css has no content hash and is cached by
    // browsers for 1h, so a visitor with the previous CSS would otherwise see
    // the width/height ATTRIBUTES (e.g. 4501x5625) applied literally and the
    // image stretched ~4x vertically. height:auto keeps the aspect ratio
    // regardless of which stylesheet version is loaded.
    <figure key={key} className="rt-figure" style={{ margin: '20px 0', maxWidth: 'min(100%, 620px)' }}>
      <img
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        src={isOptimizable(src) ? optimizedSrc(src, 1080, QUALITY.photo) : src}
        srcSet={optimizedSrcSet(src, [640, 828, 1080, 1920], QUALITY.photo)}
        sizes="(max-width: 900px) 100vw, 900px"
        alt={alt}
        loading="lazy"
        decoding="async"
        {...(w && h ? { width: w, height: h } : {})}
      />
      {media.caption ? <figcaption>{String(media.caption)}</figcaption> : null}
    </figure>
  )
}

function renderList(node: LexNode, key: number): ReactNode {
  const Tag = node.listType === 'number' ? 'ol' : 'ul'
  return (
    <Tag key={key}>
      {(node.children || []).map((li: LexNode, i: number) => {
        // Nested lists live in a listitem whose only child is a list node.
        const nested = (li.children || []).filter((c: LexNode) => c.type === 'list')
        const inline = (li.children || []).filter((c: LexNode) => c.type !== 'list')
        return (
          <li key={i} style={nested.length && !inline.length ? { listStyle: 'none' } : undefined}>
            {renderInline(inline)}
            {nested.map((n: LexNode, j: number) => renderList(n, j))}
          </li>
        )
      })}
    </Tag>
  )
}

function renderBlock(node: LexNode, key: number): ReactNode {
  switch (node.type) {
    case 'paragraph':
      return isEmptyBlock(node) ? (
        <p key={key} className="rt-empty" aria-hidden="true" />
      ) : (
        <p key={key} style={blockStyle(node)}>
          {renderInline(node.children)}
        </p>
      )
    case 'heading': {
      const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag) ? node.tag : 'h3') as 'h3'
      return (
        <Tag key={key} style={blockStyle(node)}>
          {renderInline(node.children)}
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote key={key} style={blockStyle(node)}>
          {renderInline(node.children)}
        </blockquote>
      )
    case 'list':
      return renderList(node, key)
    case 'upload':
      return renderUpload(node, key)
    case 'horizontalrule':
      return <hr key={key} />
    default:
      return node.children ? (
        <div key={key}>{renderInline(node.children)}</div>
      ) : null
  }
}

/** True when the document has any visible content (text or image). */
export function hasRichTextContent(doc: LexNode): boolean {
  const walk = (n: LexNode): boolean =>
    n.type === 'upload' ||
    n.type === 'horizontalrule' ||
    (n.type === 'text' && String(n.text || '').trim().length > 0) ||
    (Array.isArray(n.children) && n.children.some(walk))
  return Boolean(doc?.root?.children?.some(walk))
}

export default function RichTextContent({ doc, className }: { doc: LexNode; className?: string }) {
  const nodes: LexNode[] = doc?.root?.children || []
  if (!nodes.length) return null
  return <div className={`rich-text${className ? ` ${className}` : ''}`}>{nodes.map(renderBlock)}</div>
}
