import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getFeaturedPrograms } from '@/lib/programsData'
import { getPopularArticles } from '@/lib/articlesData'
import { getHomeData } from '@/lib/homeData'

// Shared body for both 404 entry points this app needs:
//   - src/app/(frontend)/not-found.tsx — renders when a *matched* route
//     (e.g. /doctor/[slug]) calls notFound() for a missing record.
//   - src/app/global-not-found.tsx — renders for a URL that doesn't match
//     any route at all (typo'd/deleted link). This app has two root
//     layouts ((frontend) and (payload) for the Payload admin panel), so
//     there's no single layout tree Next.js can hang a normal root
//     not-found.tsx off of for *unmatched* URLs — hence the separate
//     experimental global-not-found.js convention (next.config.mjs's
//     experimental.globalNotFound) alongside this one.
// Deliberately does NOT own <head>/css <link> tags or the preloader/
// progressBar/cursorRing shell divs — global-not-found.tsx bypasses the
// RootLayout entirely and has to supply its own, so each entry point wires
// those up itself; this component is just the part both share.
//
// Ported from phivara-design-html/404.html. Surfaces 2 featured programs
// (`featured` checkbox — same source as /program's hero carousel) and 2
// popular articles (`popular` checkbox — same source as the "MOST READ"
// sidebar) instead of a blank error page.
export default async function NotFoundContent() {
  const [programs, articles, homeData] = await Promise.all([
    getFeaturedPrograms(),
    getPopularArticles(undefined, 2),
    getHomeData(),
  ])
  const featuredPrograms = programs.slice(0, 2)

  return (
    <>
      {/* Next.js's `export const metadata` on (frontend)/not-found.tsx only
          reliably sets the tab title when the URL itself is unmatched —
          when this renders because a *matched* route called notFound()
          (e.g. /doctor/[slug] for a missing doctor), the resolved <title>
          stays whatever the route's own segment tree produced (here, the
          RootLayout's default), a known Next.js metadata-resolution gap.
          Setting document.title directly sidesteps it for both entry
          points, so the browser tab is correct no matter which one fired. */}
      <Script
        id="notfound-title-fix"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: "document.title = 'PHIVARA | ไม่พบหน้าที่คุณค้นหา';" }}
      />

      <SiteHeader page="notFound" />

      <main>
        <section className="notfound-hero">
          <div className="wrap">
            <p className="notfound-code" aria-hidden="true">404</p>
            <div className="eyebrow center" data-th="ไม่พบหน้าที่คุณค้นหา" data-en="PAGE NOT FOUND">ไม่พบหน้าที่คุณค้นหา</div>
            <h1 data-th="ดูเหมือนหน้านี้จะถูกย้าย หรือไม่มีอยู่จริง" data-en="This page seems to have moved, or doesn’t exist">ดูเหมือนหน้านี้จะถูกย้าย หรือไม่มีอยู่จริง</h1>
            <p className="lead" data-th="ลองกลับไปหน้าแรก หรือเลือกดูโปรแกรมและบทความที่น่าสนใจของเราด้านล่างแทนได้เลย" data-en="Head back home, or browse a few of our featured programs and articles below.">ลองกลับไปหน้าแรก หรือเลือกดูโปรแกรมและบทความที่น่าสนใจของเราด้านล่างแทนได้เลย</p>

            <div className="notfound-actions">
              <a href="/" className="btn btn-gold" data-th="กลับหน้าแรก" data-en="Back to Home">กลับหน้าแรก</a>
              <a href="/contact" className="btn btn-outline-dark" data-th="ติดต่อเรา" data-en="Contact Us">ติดต่อเรา</a>
            </div>
          </div>
        </section>

        <section className="notfound-suggest">
          <div className="wrap">
            <div className="section-top">
              <div className="eyebrow center" data-th="แนะนำสำหรับคุณ" data-en="RECOMMENDED FOR YOU">แนะนำสำหรับคุณ</div>
              <h2 data-th="อาจจะเป็นสิ่งที่คุณกำลังมองหา" data-en="You Might Be Looking For">อาจจะเป็นสิ่งที่คุณกำลังมองหา</h2>
            </div>

            <div className="notfound-grid">
              {featuredPrograms.map((program) => (
                <article key={program.slug} className="journal-card">
                  <a className="journal-card__media" href={`/program/${program.slug}`}>
                    <img className="journal-card__image" src={program.image} alt={program.titleTh} />
                  </a>
                  <div className="journal-card__body">
                    <span className="journal-card__tag journal-card__tag--program" data-th="โปรแกรมแนะนำ" data-en="FEATURED PROGRAM">โปรแกรมแนะนำ</span>
                    <h3><a href={`/program/${program.slug}`} data-th={program.titleTh} data-en={program.titleEn}>{program.titleTh}</a></h3>
                    <p data-th={program.shortDescriptionTh} data-en={program.shortDescriptionEn}>{program.shortDescriptionTh}</p>
                    <div className="journal-card__footer">
                      <div className="journal-card__meta">
                        <span data-th={program.code} data-en={program.code}>{program.code}</span>
                      </div>
                      <a className="journal-card__link" href={`/program/${program.slug}`} data-th="ดูโปรแกรม →" data-en="View Program →">ดูโปรแกรม →</a>
                    </div>
                  </div>
                </article>
              ))}

              {articles.map((article) => (
                <article key={article.slug} className="journal-card">
                  <a className="journal-card__media" href={`/article/${article.slug}`}>
                    <img className="journal-card__image" src={article.image} alt={article.titleTh} />
                  </a>
                  <div className="journal-card__body">
                    <span className="journal-card__tag" data-th={article.categoryLabelTh} data-en={article.categoryLabelEn}>{article.categoryLabelTh}</span>
                    <h3><a href={`/article/${article.slug}`} data-th={article.titleTh} data-en={article.titleEn}>{article.titleTh}</a></h3>
                    <p data-th={article.summaryTh} data-en={article.summaryEn}>{article.summaryTh}</p>
                    <div className="journal-card__footer">
                      <div className="journal-card__meta">
                        <span data-th={article.readTimeTh} data-en={article.readTimeEn}>{article.readTimeTh}</span>
                      </div>
                      <a className="journal-card__link" href={`/article/${article.slug}`} data-th="อ่านต่อ →" data-en="Read More →">อ่านต่อ →</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
