import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { DEFAULT_LOCALE, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'
import { getFeaturedPrograms } from '@/lib/programsData'
import { getPopularArticles } from '@/lib/articlesData'
import { getHomeData } from '@/lib/homeData'

// Shared body for both 404 entry points this app needs:
//   - src/app/[locale]/not-found.tsx — renders when a *matched* route
//     (e.g. /doctor/[slug]) calls notFound() for a missing record.
//   - src/app/global-not-found.tsx — renders for a URL that doesn't match
//     any route at all (typo'd/deleted link). This app has two root
//     layouts ([locale] and (payload) for the Payload admin panel), so
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
export default async function NotFoundContent({
  // Optional + defaults to 'th' so global-not-found.tsx (which can't know
  // a locale — it renders for URLs that don't match any route, including
  // ones with no valid locale prefix at all) keeps rendering unchanged —
  // src/app/[locale]/not-found.tsx passes its real locale explicitly.
  locale = DEFAULT_LOCALE,
}: {
  locale?: LocaleCode
}) {
  const t = translator(locale)
  const [programs, articles, homeData, liveLocales] = await Promise.all([
    getFeaturedPrograms(locale),
    getPopularArticles(locale, undefined, 2),
    getHomeData(locale),
    getPubliclyLiveLocales(),
  ])
  const featuredPrograms = programs.slice(0, 2)
  const title = t('PHIVARA | ไม่พบหน้าที่คุณค้นหา', 'PHIVARA | Page Not Found')
  // vip-modal.js reads window.__PHIVARA_DATA__.branches for its "Preferred
  // Location" dropdown — every other page injects this via its own
  // page.tsx, but this shared 404 body previously didn't, so the dropdown
  // silently rendered empty on both 404 entry points. Same pattern as
  // article/page.tsx etc.
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

  return (
    <>
      {/* afterInteractive, not beforeInteractive like the analogous data
          scripts on every other page.tsx — this component renders inside
          Next's dedicated not-found render tree rather than a normal page,
          and a beforeInteractive Script placed here was silently dropped
          (never appeared in the DOM at all). afterInteractive matches the
          strategy already used below for site-runtime.js/vip-modal.js, and
          since script tags with the same strategy execute in document
          order, this still runs before vip-modal.js reads the global. */}
      <Script id="notfound-phivara-data" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      {/* Next.js's `export const metadata` on not-found.tsx only reliably
          sets the tab title when the URL itself is unmatched — when this
          renders because a *matched* route called notFound() (e.g.
          /doctor/[slug] for a missing doctor), the resolved <title> stays
          whatever the route's own segment tree produced (here, the
          layout's default), a known Next.js metadata-resolution gap.
          Setting document.title directly sidesteps it for both entry
          points, so the browser tab is correct no matter which one fired. */}
      <Script
        id="notfound-title-fix"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `document.title = ${JSON.stringify(title)};` }}
      />

      <SiteHeader page="notFound" topbar={homeData.topbar} locale={locale} localePath="/" liveLocales={liveLocales} />

      <main>
        <section className="notfound-hero">
          <div className="wrap">
            <p className="notfound-code" aria-hidden="true">404</p>
            <div className="eyebrow center">{t('ไม่พบหน้าที่คุณค้นหา', 'PAGE NOT FOUND')}</div>
            <h1>{t('ดูเหมือนหน้านี้จะถูกย้าย หรือไม่มีอยู่จริง', 'This page seems to have moved, or doesn’t exist')}</h1>
            <p className="lead">{t('ลองกลับไปหน้าแรก หรือเลือกดูโปรแกรมและบทความที่น่าสนใจของเราด้านล่างแทนได้เลย', 'Head back home, or browse a few of our featured programs and articles below.')}</p>

            <div className="notfound-actions">
              <a href={localizedHref(locale, '/')} className="btn btn-gold">{t('กลับหน้าแรก', 'Back to Home')}</a>
              <a href={localizedHref(locale, '/contact')} className="btn btn-outline-dark">{t('ติดต่อเรา', 'Contact Us')}</a>
            </div>
          </div>
        </section>

        <section className="notfound-suggest">
          <div className="wrap">
            <div className="section-top">
              <div className="eyebrow center">{t('แนะนำสำหรับคุณ', 'RECOMMENDED FOR YOU')}</div>
              <h2>{t('อาจจะเป็นสิ่งที่คุณกำลังมองหา', 'You Might Be Looking For')}</h2>
            </div>

            <div className="notfound-grid">
              {featuredPrograms.map((program) => (
                <article key={program.slug} className="journal-card">
                  <a className="journal-card__media" href={localizedHref(locale, `/program/${program.slug}`)}>
                    <img className="journal-card__image" src={program.image} alt={program.titleTh} />
                  </a>
                  <div className="journal-card__body">
                    <span className="journal-card__tag journal-card__tag--program">{t('โปรแกรมแนะนำ', 'FEATURED PROGRAM')}</span>
                    <h3><a href={localizedHref(locale, `/program/${program.slug}`)}>{t(program.titleTh, program.titleEn)}</a></h3>
                    <p>{t(program.shortDescriptionTh, program.shortDescriptionEn)}</p>
                    <div className="journal-card__footer">
                      <div className="journal-card__meta">
                        <span>{program.code}</span>
                      </div>
                      <a className="journal-card__link" href={localizedHref(locale, `/program/${program.slug}`)}>{t('ดูโปรแกรม →', 'View Program →')}</a>
                    </div>
                  </div>
                </article>
              ))}

              {articles.map((article) => (
                <article key={article.slug} className="journal-card">
                  <a className="journal-card__media" href={localizedHref(locale, `/article/${article.slug}`)}>
                    <img className="journal-card__image" src={article.image} alt={article.titleTh} />
                  </a>
                  <div className="journal-card__body">
                    <span className="journal-card__tag">{t(article.categoryLabelTh, article.categoryLabelEn)}</span>
                    <h3><a href={localizedHref(locale, `/article/${article.slug}`)}>{t(article.titleTh, article.titleEn)}</a></h3>
                    <p>{t(article.summaryTh, article.summaryEn)}</p>
                    <div className="journal-card__footer">
                      <div className="journal-card__meta">
                        <span>{t(article.readTimeTh, article.readTimeEn)}</span>
                      </div>
                      <a className="journal-card__link" href={localizedHref(locale, `/article/${article.slug}`)}>{t('อ่านต่อ →', 'Read More →')}</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
