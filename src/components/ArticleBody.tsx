import type { ReactNode } from 'react'

import {
  blockStyleOf,
  isEmptyBlockNode,
  renderInlineNodes,
  renderListNode,
  renderUploadNode,
} from '@/components/RichTextContent'
import type { ArticleDetail } from '@/lib/articlesData'

// Renders the article body (CMS rich text) keeping the article-specific layout:
// ids on headings for the table of contents, the `.lead` first paragraph, the
// note box + insight cards after a heading that is followed by another heading.
// Block layout is unchanged from the old plain-text renderer; what's new is that
// each block's content comes from the Lexical node, so bold/italic/links,
// images, alignment and the CMS font-size menu now show up on the page.
// `t` is the page's translator (used for the note box / insight cards only).
export function renderArticleBody(
  article: Pick<ArticleDetail, 'bodyBlocks' | 'noteBox' | 'insightSteps'>,
  t: (th: string, en: string) => string,
): ReactNode[] {
  return article.bodyBlocks.map((block, i) => {
    const showNoteBox = article.noteBox && block.type === 'heading' && block.insightStepsAfter
    const nodes: ReactNode[] = []
    if (showNoteBox && article.noteBox) {
      nodes.push(
        <div className="note-box" key={`note-${i}`}>
          <strong>{t(article.noteBox.headingTh, article.noteBox.headingEn)}</strong>
          <p>{t(article.noteBox.textTh, article.noteBox.textEn)}</p>
        </div>,
      )
    }
    const children = block.node?.children
    const inline = (): ReactNode => (children ? renderInlineNodes(children) : t(block.textTh, block.textEn))

    if (block.type === 'heading') {
      const Tag = block.tag === 'h3' ? 'h3' : 'h2'
      nodes.push(
        <Tag key={i} id={block.id} style={block.node ? blockStyleOf(block.node) : undefined}>
          {inline()}
        </Tag>,
      )
      if (block.insightStepsAfter && article.insightSteps.length > 0) {
        nodes.push(
          <div className="insight-grid" key={`insight-${i}`}>
            {article.insightSteps.map((step, si) => (
              <div className="insight-card" key={si}>
                <span className="insight-no">{String(si + 1).padStart(2, '0')}</span>
                <h3>{t(step.titleTh, step.titleEn)}</h3>
                <p>{t(step.descriptionTh, step.descriptionEn)}</p>
              </div>
            ))}
          </div>,
        )
      }
    } else if (block.type === 'quote') {
      nodes.push(
        <blockquote key={i} style={block.node ? blockStyleOf(block.node) : undefined}>
          {inline()}
        </blockquote>,
      )
    } else if (block.type === 'list') {
      nodes.push(
        block.node ? (
          renderListNode(block.node, i)
        ) : (
          <ul key={i}>
            {(block.items || []).map((item, li) => (
              <li key={li}>{t(item.textTh, item.textEn)}</li>
            ))}
          </ul>
        ),
      )
    } else if (block.type === 'upload') {
      nodes.push(renderUploadNode(block.node, i))
    } else if (block.type === 'rule') {
      nodes.push(<hr key={i} />)
    } else {
      // Empty paragraphs stay plain empty <p> (the editors' spacing, as before).
      const empty = block.node ? isEmptyBlockNode(block.node) : !block.textTh
      nodes.push(
        <p key={i} className={block.isLead ? 'lead' : undefined} style={block.node ? blockStyleOf(block.node) : undefined}>
          {empty ? null : inline()}
        </p>,
      )
    }
    return nodes
  })
}
