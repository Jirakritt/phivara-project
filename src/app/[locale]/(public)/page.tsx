import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'

// Rebuilt from phivara-design-html/index.html. The hero banner (eyebrow/
// headline/lead/CTA + rotating background images) now comes from the
// `home-hero` Payload Global — see src/lib/homeData.ts's getHomeHero() and
// cms/globals/HomeHero.ts. Everything else below it (intro/pillars,
// membership teaser) is still static brand copy hardcoded here like the
// original, not modeled in Payload. The sections main.js used to fill from
// hardcoded const arrays (expertise/program cards, branch rail, specialists
// carousel, journal grid, and now the hero background slideshow too) are
// driven by real CMS content: this component fetches it from Payload and
// injects it as `window.__PHIVARA_DATA__` for the (lightly patched)
// public/js/main.js to render, so the original interactions/carousels/
// animations keep working unchanged.
//
// i18n rewrite (Phase 2): text now resolves server-side via t(locale) based
// on the URL's [locale] segment instead of client-side data-th/data-en
// swapping — see src/lib/i18n.ts. data-th/data-en attributes are left in
// place on purpose (harmless now that the JS-based #langToggle is gone —
// see SiteHeader.tsx) because public/js/main.js's buildHeroHeadline() still
// reads data-{lang} off #heroHeadline directly to build its word-mask
// animation; every other data-th/data-en pair is now inert markup, safe to
// clean up in a later pass.
// Regenerate this static page in the background at most every 60s, so
// content published in the CMS shows up on the live site without needing a
// full `next build` + restart (see DEPLOY.md — deploys already do a build,
// this just keeps in-between edits fresh too).
export const revalidate = 60

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [data, liveLocales] = await Promise.all([getHomeData(locale), getPubliclyLiveLocales()])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify(data).replace(/</g, '\\u003c')};`

  // public/js/main.js's own data-th/data-en swap only ever ran on a click
  // of the old #langToggle element (removed — see SiteHeader.tsx), so it
  // silently never re-translated the handful of hardcoded microcopy
  // strings and expertise-category titles that live in that file — see
  // its comment for the full story. Injected the same way vip-modal.js's
  // strings are (via [locale]/layout.tsx's window.__PHIVARA_VIP_MODAL__).
  const mainStringsScript = `window.__PHIVARA_MAIN_STRINGS__ = ${JSON.stringify({
    viewAllPrograms: t('ดูโปรแกรมทั้งหมด', 'View All Programs'),
    programDetails: t('รายละเอียด →', 'Details →'),
    noPrograms: t('ยังไม่มีโปรแกรมในหมวดนี้ในขณะนี้', 'No programs published in this category yet.'),
    readMore: t('อ่านต่อ →', 'Read More →'),
    readBranchDetails: t('อ่านข้อมูลสาขา', 'Read branch details'),
    viewProfile: t('ดูประวัติแพทย์', 'View Profile'),
    book: t('จองปรึกษา →', 'Book →'),
    categoryTitles: {
      plastic: t('ศิลปะการจัดแต่งสัดส่วน', 'The Art of Form'),
      longevity: t('ศิลปะแห่งกาลเวลา', 'The Art of Time'),
      dermatology: t('ศิลปะแห่งผิวเปล่งประกาย', 'The Art of Glow'),
      wellness: t('ศิลปะแห่งความสมดุล', 'The Art of Balance'),
    },
  }).replace(/</g, '\\u003c')};`

  return (
    <>
      <link rel="stylesheet" href="/css/journal-card.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-home-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />
      <Script id="phivara-main-strings" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: mainStringsScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <SiteHeader page="home" topbar={data.topbar} locale={locale} localePath="/" liveLocales={liveLocales} />

      {/* ================= HERO ================= */}
      <section className="hero" id="top">
        <div className="bg-stack" id="heroBg"></div>
        <div className="scrim"></div>
        <div className="wrap">
          <div className="content" id="heroContent">
            <div className="eyebrow" data-th={data.hero.eyebrowTh} data-en={data.hero.eyebrowEn}>
              {t(data.hero.eyebrowTh, data.hero.eyebrowEn)}
            </div>
            <h1
              id="heroHeadline"
              data-th={data.hero.headlineTh}
              data-en={data.hero.headlineEn}
            >
              {t(data.hero.headlineTh, data.hero.headlineEn)}
            </h1>
            <p
              className="sub"
              data-th={data.hero.leadTh}
              data-en={data.hero.leadEn}
            >
              {t(data.hero.leadTh, data.hero.leadEn)}
            </p>
            <div className="cta-row">
              <a href="#contact" className="btn btn-outline vip-trigger" data-th={data.hero.ctaLabelTh} data-en={data.hero.ctaLabelEn}>
                {t(data.hero.ctaLabelTh, data.hero.ctaLabelEn)}
              </a>
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <span>{t('เลื่อนลง', 'Scroll')}</span>
          <span className="line"></span>
        </div>
      </section>

      {/* ================= BRAND INTRO + PILLARS ================= */}
      <section className="intro" id="about">
        <div className="watermark">Beaugevity</div>
        <div className="wrap">
          <div className="grid">
            <div className="intro-diagram reveal">
              <div className="diagram-frame">
                <svg className="diagram-ring" viewBox="0 0 320 320" aria-hidden="true">
                  <circle className="ring-bg" cx="160" cy="160" r="132" />
                  <circle className="ring-seg seg-tl" cx="160" cy="160" r="132" transform="rotate(180 160 160)" />
                  <circle className="ring-seg seg-tr" cx="160" cy="160" r="132" transform="rotate(270 160 160)" />
                  <circle className="ring-seg seg-bl" cx="160" cy="160" r="132" transform="rotate(90 160 160)" />
                  <circle className="ring-seg seg-br" cx="160" cy="160" r="132" transform="rotate(0 160 160)" />
                </svg>
                <div className="diagram-core">
                  <img className="diagram-core-logo" src="/logo/phivara_logo.jpg" alt="PHIVARA" />
                </div>
                <div className="diagram-tags stagger">
                  <div className="diagram-tag tag-tl s-item">
                    <span className="tag-dot"></span>
                    <span>{t('เวชศาสตร์อายุยืนยาว', 'Anti-Aging & Longevity')}</span>
                  </div>
                  <div className="diagram-tag tag-tr s-item">
                    <span className="tag-dot"></span>
                    <span>{t('ผิวหนัง', 'Dermatology')}</span>
                  </div>
                  <div className="diagram-tag tag-bl s-item">
                    <span className="tag-dot"></span>
                    <span>{t('สุขภาวะเชิงความงาม', 'Aesthetic Wellness')}</span>
                  </div>
                  <div className="diagram-tag tag-br s-item">
                    <span className="tag-dot"></span>
                    <span>{t('ศัลยกรรมตกแต่ง', 'Plastic Surgery')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal">
              <div className="eyebrow">WHY PHIVARA EXISTS</div>
              <blockquote>
                {t(
                  '“ความงามที่แท้จริง เริ่มต้นจากสุขภาพที่ดีจากภายใน ไม่ใช่การไล่ตามความเยาว์วัย”',
                  '“True beauty begins with good health from within — not the pursuit of youth.”',
                )}
              </blockquote>
              <p className="body">
                {t(
                  'Beaugevity คือแก่นความเชื่อของ PHIVARA ที่หลอมรวมศาสตร์ความงามและเวชศาสตร์อายุยืนยาวเข้าไว้ด้วยกันบนพื้นฐานทางการแพทย์ ทุกการดูแลเริ่มต้นจากการตรวจวินิจฉัยและประเมินสุขภาพเชิงลึกโดยแพทย์เฉพาะทาง ก่อนออกแบบแผนการดูแลเฉพาะบุคคลที่ผสานศัลยกรรมตกแต่ง ผิวหนัง และเวชศาสตร์ชะลอวัยไว้ในทีมเดียว',
                  'Beaugevity is the core belief behind PHIVARA — the fusion of beauty and longevity medicine, grounded in clinical practice. Every treatment begins with in-depth diagnostics and health assessment by specialist physicians, followed by a personalized care plan that integrates plastic surgery, dermatology, and longevity medicine under one team.',
                )}
              </p>
              <p className="body">
                {t(
                  'ดำเนินการภายใต้มาตรฐานความปลอดภัยระดับโรงพยาบาล และทีมสหสาขาวิชาชีพที่ติดตามผลลัพธ์อย่างต่อเนื่อง เพื่อผลลัพธ์ที่ปลอดภัย แม่นยำ และยั่งยืน',
                  'Delivered under hospital-grade safety standards, with a multidisciplinary team monitoring outcomes at every step — for results that are safe, precise, and built to last.',
                )}
              </p>
              <div className="sig">— The Art of Beaugevity</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPERTISE ================= */}
      <section className="expertise" id="expertise">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow center">INTEGRATED EXPERTISE</div>
            <h2>{t('หนึ่งทีม หนึ่งเส้นทาง เพื่อคุณโดยเฉพาะ', 'One Team, One Journey — Built Around You')}</h2>
          </div>
          <div className="exp-tabs reveal">
            <div className="exp-tab-nav" id="expTabNav" role="tablist"></div>
            <div className="exp-tab-panels" id="expTabPanels"></div>
          </div>
        </div>
      </section>

      {/* ================= BRANCH HIGHLIGHT ================= */}
      <section className="flagship" id="flagship">
        <div className="wrap flagship-heading">
          <div>
            <div className="eyebrow">PHIVARA DESTINATIONS</div>
            <h2>{t('พื้นที่ดูแลที่ออกแบบมาเพื่อทุกเส้นทางของคุณ', 'Distinctive spaces, designed around your journey')}</h2>
          </div>
        </div>
        <div className="wrap flagship-stage">
          <div className="flagship-nav" id="flagshipRail" role="tablist" aria-label="PHIVARA branches"></div>
          <div className="flagship-slides" id="flagshipSlides"></div>
        </div>
      </section>

      {/* ================= SPECIALISTS ================= */}
      <section className="specialists" id="specialists">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow center">OUR SPECIALISTS</div>
            <h2>{t('พบแพทย์และผู้เชี่ยวชาญของ PHIVARA', 'Meet Our Specialists')}</h2>
            <p>{t('ทุกท่านยึดหลักฐานเชิงประจักษ์ มีคุณวุฒิรับรอง และทุ่มเทให้กับเส้นทางของคุณเป็นการส่วนตัว', 'Evidence-based, credentialed, and personally invested in your journey.')}</p>
            <a href={localizedHref(locale, '/doctor')} className="arrow-link spec-all-link">
              <span>{t('ดูรายชื่อทีมแพทย์และผู้เชี่ยวชาญทั้งหมด', 'View All Medical Specialists')}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <div className="spec-carousel-wrapper">
            <button className="carousel-nav spec-nav spec-prev" id="specPrev" aria-label="Previous Specialists">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="spec-track-outer">
              <div className="spec-track" id="specTrack"></div>
            </div>
            <button className="carousel-nav spec-nav spec-next" id="specNext" aria-label="Next Specialists">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="spec-dots" id="specDots"></div>
        </div>
      </section>

      {/* ================= JOURNAL ================= */}
      <section className="journal" id="journal">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow center">THE JOURNAL</div>
            <h2>{t('สาระความงามจากผู้เชี่ยวชาญ', 'Insights From Our Specialists')}</h2>
          </div>
          <div className="journal-grid stagger" id="journalGrid"></div>
        </div>
      </section>

      {/* ================= AWARDS ================= */}
      <section className="awards">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow center">AWARDS &amp; RECOGNITION</div>
            <h2>{t('ความไว้วางใจที่สั่งสมมาอย่างยาวนาน', 'A Legacy of Trust and Recognition')}</h2>
          </div>
          <div className="award-carousel reveal">
            <button className="carousel-nav award-nav prev" id="awardPrev" aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <div className="award-viewport">
              <div className="award-track" id="awardTrack"></div>
            </div>
            <button className="carousel-nav award-nav next" id="awardNext" aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <div className="award-dots" id="awardDots"></div>
        </div>
      </section>

      {/* ================= MEMBERSHIP ================= */}
      {/* Sourced from Payload's `membership` Global (hero + finalCta.buttonLabel)
          — same content that powers /membership — see getHomeData()/
          getMembershipTeaser() in src/lib/homeData.ts. */}
      <section className="membership" id="membership">
        <div className="mem-grid">
          <img className="ph-photo reveal" src={data.membershipTeaser.image} alt="PHIVARA AUM Membership" />
          <div className="mem-text reveal">
            <div className="eyebrow">{t(data.membershipTeaser.eyebrowTh, data.membershipTeaser.eyebrowEn)}</div>
            <h2>{t(data.membershipTeaser.headlineTh, data.membershipTeaser.headlineEn)}</h2>
            <p>{t(data.membershipTeaser.leadTh, data.membershipTeaser.leadEn)}</p>
            <div className="mem-cta-row">
              <a
                href="#vipModalOverlay"
                className="btn btn-outline vip-trigger"
                data-service="membership"
              >
                {t(data.membershipTeaser.ctaLabelTh, data.membershipTeaser.ctaLabelEn)}
              </a>
              <a href={localizedHref(locale, '/membership')} className="arrow-link">
                <span>{t('ดูรายละเอียด', 'View Details')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter branches={data.branches} footer={data.footer} locale={locale} />

      <Script src="/js/main.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
