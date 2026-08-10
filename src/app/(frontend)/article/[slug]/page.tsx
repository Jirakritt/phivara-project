import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { ReactNode } from 'react'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getArticleDetail, getOtherArticles, getPopularArticles } from '@/lib/articlesData'
import { getHomeData } from '@/lib/homeData'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleDetail(slug)
  if (!article) return {}

  const title = article.seo.title || `${article.titleEn} | PHIVARA Journal`
  const description = article.seo.description || article.summaryEn || article.summaryTh || undefined
  const ogImage = article.seo.ogImage || article.image

  return {
    title,
    description,
    robots: article.seo.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

// Rebuilt from phivara-design-html/article_detail.html, which was a single
// static page hand-built for one article (blue-ocean-pathway). Differences
// from the original, made deliberately to prefer real data where it exists:
// - RELATED PROGRAMS stays static/generic (article_detail.html's own CTAs
//   were never tied to real program data, and Articles has no
//   `relatedPrograms` relationship field), so it's kept as a faithful copy.
// - MEDICAL TEAM is now driven by the real `relatedDoctors` relationship
//   (only dr02 in the real seed data) instead of the original's 3 hardcoded
//   entries, one of which reused dr02's photo under two different names.
// - MOST READ uses the real `popular` boolean field instead of 3 hardcoded
//   links.
// - "CONTINUE READING" pulls the next few real articles instead of 3
//   hardcoded cards.
export const revalidate = 60

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [article, homeData] = await Promise.all([getArticleDetail(slug), getHomeData()])
  if (!article) notFound()

  const [popularArticles, otherArticles] = await Promise.all([
    getPopularArticles(article.slug, 3),
    getOtherArticles(article.slug, article.category, 3),
  ])

  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

  // article.authorNameTh/En store the full byline phrase ("บทความโดย ..." /
  // "By ..." — see cms/seed/data/articles.ts authorName), which is what the
  // story-meta byline needs verbatim. The author-box further down needs just
  // the bare name, so strip the leading phrase here.
  const authorBareNameTh = article.authorNameTh.replace(/^บทความโดย\s+/, '')
  const authorBareNameEn = article.authorNameEn.replace(/^By\s+/, '')

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/journal-card.css" />
      <link rel="stylesheet" href="/css/article-detail.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-article-detail-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div className="reading-progress" id="readingProgress"></div>

      <SiteHeader page="article" topbar={homeData.topbar} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <a href="/article" data-th="คลังความรู้" data-en="Journal">คลังความรู้</a>
            <span className="sep">/</span>
            <span className="current" data-th={article.titleTh} data-en={article.titleEn}>{article.titleTh}</span>
          </div>
        </div>
      </div>

      <main>
        <div className="main-content-grid">
          <div className="article-primary">
            <section className="story-hero">
              <div className="wrap story-head">
                <div className="story-category" data-th={article.categoryLabelTh} data-en={article.categoryLabelEn}>{article.categoryLabelTh}</div>
                <h1 data-th={article.titleTh} data-en={article.titleEn}>{article.titleTh}</h1>
                <div className="story-meta">
                  <span className="story-author">
                    <img src={article.authorImage} alt="" />
                    {/* author.name already stores the full "บทความโดย ..." / "By ..." phrase (see cms/seed/data/articles.ts authorName), not just the bare name */}
                    <span data-th={article.authorNameTh} data-en={article.authorNameEn}>{article.authorNameTh}</span>
                  </span>
                  <span className="dot"></span>
                  <time data-th={article.dateTh} data-en={article.dateEn}>{article.dateTh}</time>
                  <span className="dot"></span>
                  <span data-th={`อ่าน ${article.readTimeMinutes} นาที`} data-en={`${article.readTimeMinutes} min read`}>อ่าน {article.readTimeMinutes} นาที</span>
                </div>
              </div>
            </section>
            <div className="cover-wrap"><figure className="story-cover"><img src={article.image} alt={article.titleTh} /></figure></div>

            <div className="article-shell">
              <aside className="toc" aria-label="สารบัญ">
                <span className="toc-label" data-th="ในบทความนี้" data-en="In this article">ในบทความนี้</span>
                {article.toc.map((entry) => (
                  <a key={entry.id} href={`#${entry.id}`} data-th={entry.th} data-en={entry.en}>{entry.th}</a>
                ))}
              </aside>

              <article className="prose" id="articleBody">
                {article.bodyBlocks.map((block, i) => {
                  const showNoteBox = article.noteBox && block.type === 'heading' && block.insightStepsAfter
                  const nodes: ReactNode[] = []
                  if (showNoteBox && article.noteBox) {
                    nodes.push(
                      <div className="note-box" key={`note-${i}`}>
                        <strong data-th={article.noteBox.headingTh} data-en={article.noteBox.headingEn}>{article.noteBox.headingTh}</strong>
                        <p data-th={article.noteBox.textTh} data-en={article.noteBox.textEn}>{article.noteBox.textTh}</p>
                      </div>
                    )
                  }
                  if (block.type === 'heading') {
                    const Tag = block.tag === 'h3' ? 'h3' : 'h2'
                    nodes.push(
                      <Tag key={i} id={block.id} data-th={block.textTh} data-en={block.textEn}>{block.textTh}</Tag>
                    )
                    if (block.insightStepsAfter && article.insightSteps.length > 0) {
                      nodes.push(
                        <div className="insight-grid" key={`insight-${i}`}>
                          {article.insightSteps.map((step, si) => (
                            <div className="insight-card" key={si}>
                              <span className="insight-no">{String(si + 1).padStart(2, '0')}</span>
                              <h3 data-th={step.titleTh} data-en={step.titleEn}>{step.titleTh}</h3>
                              <p data-th={step.descriptionTh} data-en={step.descriptionEn}>{step.descriptionTh}</p>
                            </div>
                          ))}
                        </div>
                      )
                    }
                  } else if (block.type === 'quote') {
                    nodes.push(
                      <blockquote key={i} data-th={block.textTh} data-en={block.textEn}>{block.textTh}</blockquote>
                    )
                  } else {
                    nodes.push(
                      <p key={i} className={block.isLead ? 'lead' : undefined} data-th={block.textTh} data-en={block.textEn}>{block.textTh}</p>
                    )
                  }
                  return nodes
                })}

                {article.tags.length > 0 && (
                  <div className="article-tags">
                    {article.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                  </div>
                )}

                <div className="author-box">
                  <img src={article.authorImage} alt={authorBareNameTh} />
                  <div>
                    <small>MEDICAL REVIEW</small>
                    <h3 data-th={authorBareNameTh} data-en={authorBareNameEn}>{authorBareNameTh}</h3>
                    <p data-th="ดูแลสุขภาพแบบองค์รวมด้วยข้อมูลทางการแพทย์ และออกแบบแนวทางที่เหมาะกับเป้าหมายเฉพาะบุคคล" data-en="Holistic, evidence-informed care designed around each person's individual health goals.">
                      ดูแลสุขภาพแบบองค์รวมด้วยข้อมูลทางการแพทย์ และออกแบบแนวทางที่เหมาะกับเป้าหมายเฉพาะบุคคล
                    </p>
                  </div>
                </div>
              </article>

              <aside className="share-rail" aria-label="Share article">
                <span className="share-label" data-th="แบ่งปัน" data-en="SHARE">แบ่งปัน</span>
                <button className="share-btn" type="button" data-share="facebook" aria-label="Share on Facebook">f</button>
                <button className="share-btn" type="button" data-share="line" aria-label="Share on LINE">LINE</button>
                <button className="share-btn" type="button" data-share="copy" aria-label="Copy link">↗</button>
              </aside>
            </div>
          </div>

          <aside className="article-sidebar" aria-label="ข้อมูลที่เกี่ยวข้อง">
            <section className="sidebar-card">
              <div className="sidebar-card-head"><small>RELATED PROGRAMS</small><h2 data-th="โปรแกรมตรวจที่เกี่ยวข้อง" data-en="Related Health Programs">โปรแกรมตรวจที่เกี่ยวข้อง</h2></div>
              <div className="program-list">
                <a className="program-item vip-trigger" href="#vipModalOverlay"><small>LONGEVITY</small><strong data-th="ตรวจสุขภาพเชิงลึกเฉพาะบุคคล" data-en="Personalized In-depth Health Screening">ตรวจสุขภาพเชิงลึกเฉพาะบุคคล</strong><span data-th="ประเมินความเสี่ยงและตัวชี้วัดสุขภาพสำคัญตามช่วงวัย" data-en="Assess age-specific risks and key health indicators.">ประเมินความเสี่ยงและตัวชี้วัดสุขภาพสำคัญตามช่วงวัย</span></a>
                <a className="program-item vip-trigger" href="#vipModalOverlay"><small>HORMONE</small><strong data-th="โปรแกรมตรวจสมดุลฮอร์โมน" data-en="Hormone Balance Assessment">โปรแกรมตรวจสมดุลฮอร์โมน</strong><span data-th="สำหรับผู้ที่มีความเหนื่อยล้า นอนหลับไม่ดี หรือน้ำหนักเปลี่ยนแปลง" data-en="For fatigue, poor sleep or unexplained weight changes.">สำหรับผู้ที่มีความเหนื่อยล้า นอนหลับไม่ดี หรือน้ำหนักเปลี่ยนแปลง</span></a>
                <a className="program-item vip-trigger" href="#vipModalOverlay"><small>METABOLIC</small><strong data-th="ตรวจสุขภาพระบบเผาผลาญ" data-en="Metabolic Health Screening">ตรวจสุขภาพระบบเผาผลาญ</strong><span data-th="วิเคราะห์น้ำตาล ไขมัน องค์ประกอบร่างกาย และความเสี่ยงระยะยาว" data-en="Review glucose, lipids, body composition and long-term risks.">วิเคราะห์น้ำตาล ไขมัน องค์ประกอบร่างกาย และความเสี่ยงระยะยาว</span></a>
                <a className="program-item vip-trigger" href="#vipModalOverlay"><small>VITAMIN &amp; MINERAL</small><strong data-th="ตรวจวิตามินและสารอาหาร" data-en="Vitamin &amp; Nutrient Profile">ตรวจวิตามินและสารอาหาร</strong><span data-th="ค้นหาภาวะขาดสารอาหารที่อาจกระทบพลังงานและภูมิคุ้มกัน" data-en="Identify nutrient gaps that may affect energy and immunity.">ค้นหาภาวะขาดสารอาหารที่อาจกระทบพลังงานและภูมิคุ้มกัน</span></a>
              </div>
            </section>

            {article.relatedDoctors.length > 0 && (
              <section className="sidebar-card">
                <div className="sidebar-card-head"><small>MEDICAL TEAM</small><h2 data-th="ปรึกษาแพทย์ผู้เชี่ยวชาญ" data-en="Consult a Specialist">ปรึกษาแพทย์ผู้เชี่ยวชาญ</h2></div>
                {article.relatedDoctors.map((doctor) => (
                  <div className="sidebar-doctor" key={doctor.slug}>
                    <img src={doctor.image} alt={doctor.nameTh} />
                    <div>
                      <small data-th={doctor.noteTh} data-en={doctor.noteEn}>{doctor.noteTh}</small>
                      <h3 data-th={doctor.nameTh} data-en={doctor.nameEn}>{doctor.nameTh}</h3>
                      <a href={`/doctor/${doctor.slug}`} data-th="ดูข้อมูลแพทย์ →" data-en="View doctor profile →">ดูข้อมูลแพทย์ →</a>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {popularArticles.length > 0 && (
              <section className="sidebar-card">
                <div className="sidebar-card-head"><small>MOST READ</small><h2 data-th="บทความยอดนิยม" data-en="Popular Articles">บทความยอดนิยม</h2></div>
                <div className="popular-list">
                  {popularArticles.map((popular) => (
                    <a className="popular-item" href={`/article/${popular.slug}`} key={popular.slug}>
                      <strong data-th={popular.titleTh} data-en={popular.titleEn}>{popular.titleTh}</strong>
                      <span data-th={`อ่าน ${popular.readTimeMinutes} นาที`} data-en={`${popular.readTimeMinutes} min read`}>อ่าน {popular.readTimeMinutes} นาที</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section className="sidebar-cta">
              <h2 data-th="ไม่แน่ใจว่าควรเริ่มตรวจจากโปรแกรมไหน?" data-en="Not sure which program is right for you?">ไม่แน่ใจว่าควรเริ่มตรวจจากโปรแกรมไหน?</h2>
              <p data-th="พูดคุยกับทีม PHIVARA เพื่อช่วยประเมินเบื้องต้นและเลือกโปรแกรมที่เหมาะกับเป้าหมายของคุณ" data-en="Talk with PHIVARA for an initial assessment and a program matched to your goals.">
                พูดคุยกับทีม PHIVARA เพื่อช่วยประเมินเบื้องต้นและเลือกโปรแกรมที่เหมาะกับเป้าหมายของคุณ
              </p>
              <button type="button" className="vip-trigger" data-th="นัดหมายปรึกษา" data-en="Book a Consultation">นัดหมายปรึกษา</button>
            </section>
          </aside>
        </div>

        {otherArticles.length > 0 && (
          <section className="related">
            <div className="wrap">
              <div className="related-head">
                <div>
                  <div className="eyebrow" data-th="CONTINUE READING" data-en="CONTINUE READING">CONTINUE READING</div>
                  <h2 data-th="บทความที่คุณอาจสนใจ" data-en="You may also be interested in">บทความที่คุณอาจสนใจ</h2>
                </div>
                <a href="/article" data-th="ดูบทความทั้งหมด →" data-en="View all articles →">ดูบทความทั้งหมด →</a>
              </div>

              <div className="journal-grid stagger in" id="journalGrid">
                {otherArticles.map((other) => (
                  <article className="journal-card s-item" key={other.slug}>
                    <a className="journal-card__media" href={`/article/${other.slug}`}>
                      <img className="journal-card__image" src={other.image} alt={other.titleTh} loading="lazy" decoding="async" />
                    </a>
                    <div className="journal-card__body">
                      <span className="journal-card__tag" data-th={other.categoryLabelTh} data-en={other.categoryLabelEn}>{other.categoryLabelTh}</span>
                      <h3><a href={`/article/${other.slug}`} data-th={other.titleTh} data-en={other.titleEn}>{other.titleTh}</a></h3>
                      <p data-th={other.summaryTh} data-en={other.summaryEn}>{other.summaryTh}</p>
                      <div className="journal-card__footer">
                        <div className="journal-card__meta">
                          <span data-th={other.dateTh} data-en={other.dateEn}>{other.dateTh}</span>
                          <span className="dot"></span>
                          <span data-th={other.readTimeTh} data-en={other.readTimeEn}>{other.readTimeTh}</span>
                        </div>
                        <a className="journal-card__link" href={`/article/${other.slug}`} data-th="อ่านต่อ →" data-en="Read More →">อ่านต่อ →</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} />
      <div className="copy-toast" id="copyToast" data-th="คัดลอกลิงก์แล้ว" data-en="Link copied">คัดลอกลิงก์แล้ว</div>

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/article-detail.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
