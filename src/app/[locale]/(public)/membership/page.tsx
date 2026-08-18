import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'
import { getMembershipContent } from '@/lib/membershipData'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return {
    title: 'PHIVARA AUM | Private Membership',
    description: t(
      'PHIVARA AUM Private Membership การดูแลสุขภาพและความงามเฉพาะบุคคล พร้อมทีมแพทย์และ VIP Concierge ตลอดทั้งปี',
      'PHIVARA AUM Private Membership — personalized health and beauty care with a dedicated medical team and year-round VIP Concierge.',
    ),
  }
}

// Rebuilt from phivara-design-html/membership.html — the original was fully
// static (no JS content injection beyond the shared header/footer/VIP
// modal), so this page is a near-literal port. Content now comes from the
// `membership` Payload Global (cms/globals/Membership.ts) instead of being
// hardcoded, so staff can edit copy without a code change.
export const revalidate = 60

export default async function MembershipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [content, homeData, liveLocales] = await Promise.all([
    getMembershipContent(locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
  ])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/membership.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-membership-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>

      <SiteHeader page="membership" topbar={homeData.topbar} locale={locale} localePath="/membership" liveLocales={liveLocales} />

      <main>
        <section className="aum-hero" id="top">
          <div className="aum-hero-copy">
            <div className="aum-hero-inner">
              <p className="aum-kicker">{t(content.hero.kickerTh, content.hero.kickerEn)}</p>
              <p className="aum-mark" aria-hidden="true">AUM</p>
              <h1>{t(content.hero.headlineTh, content.hero.headlineEn)}</h1>
              <p className="aum-lead">{t(content.hero.leadTh, content.hero.leadEn)}</p>
              <div className="aum-actions">
                <a href="#vipModalOverlay" className="aum-btn aum-btn-light vip-trigger" data-service="membership">{t(content.finalCta.buttonLabelTh, content.finalCta.buttonLabelEn)}</a>
                <a href="#privileges" className="aum-text-link">{t('สำรวจสิทธิสมาชิก ↓', 'Explore Membership ↓')}</a>
              </div>
            </div>
          </div>
          <div className="aum-hero-image" role="img" aria-label="PHIVARA private concierge welcoming a member">
            <div className="aum-edition">
              <span>PRIVATE EDITION</span>
              <strong>01</strong>
              <small>{t('BY INVITATION', 'BY INVITATION')}</small>
            </div>
          </div>
        </section>

        <section className="aum-intro">
          <div className="wrap aum-intro-grid">
            <div className="aum-intro-label">
              <span className="aum-overline">{t(content.intro.overlineTh, content.intro.overlineEn)}</span>
              <span className="aum-rule"></span>
            </div>
            <div className="aum-intro-copy">
              <h2>{t(content.intro.headingTh, content.intro.headingEn)}</h2>
              <p>{t(content.intro.bodyTh, content.intro.bodyEn)}</p>
            </div>
          </div>
        </section>

        <section className="aum-privileges" id="privileges">
          <div className="wrap">
            <div className="aum-section-head">
              <span className="aum-overline">{t('สิทธิพิเศษสมาชิก AUM', 'THE AUM PRIVILEGES')}</span>
              <h2>{t('ทุกจังหวะของการดูแล ถูกออกแบบรอบตัวคุณ', 'Every detail of care, designed around you.')}</h2>
              <p>{t('บริการที่เชื่อมการดูแลจากทีมแพทย์ ผู้ประสานงาน และพื้นที่ส่วนตัว ให้เป็นประสบการณ์เดียวอย่างไร้รอยต่อ', 'A seamless experience connecting your specialists, personal coordinator, and private spaces in one thoughtful journey.')}</p>
            </div>

            <div className="aum-privilege-grid">
              {content.privileges.map((privilege, i) => (
                <article key={i} className="aum-privilege-card">
                  <span className="aum-card-number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="aum-card-line"></div>
                  <h3>{t(privilege.titleTh, privilege.titleEn)}</h3>
                  <p>{t(privilege.descriptionTh, privilege.descriptionEn)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="aum-promise">
          <div className="wrap aum-promise-grid">
            <div className="aum-promise-photo">
              <img src={content.promise.image} alt="Private lounge at PHIVARA" />
              <div className="aum-photo-note">
                <span>{t('ความเป็นส่วนตัว', 'PRIVACY')}</span>
                <strong>01 — 01</strong>
              </div>
            </div>
            <div className="aum-promise-copy">
              <span className="aum-overline">{t('THE AUM PROMISE', 'THE AUM PROMISE')}</span>
              <blockquote>{t(content.promise.quoteTh, content.promise.quoteEn)}</blockquote>
              <p>{t(content.promise.bodyTh, content.promise.bodyEn)}</p>
              <div className="aum-signature">The Art of Beaugevity</div>
            </div>
          </div>
        </section>

        <section className="aum-journey">
          <div className="wrap">
            <div className="aum-section-head aum-section-head-light">
              <span className="aum-overline">{t('เส้นทางสู่สมาชิก AUM', 'YOUR MEMBERSHIP JOURNEY')}</span>
              <h2>{t('เริ่มจากการทำความรู้จัก ไม่ใช่การขายสมาชิก', 'It begins with understanding, not a sales pitch.')}</h2>
            </div>
            <ol className="aum-steps">
              {content.journeySteps.map((step, i) => (
                <li key={i}>
                  <span className="aum-step-number">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{t(step.titleTh, step.titleEn)}</h3>
                    <p>{t(step.descriptionTh, step.descriptionEn)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="aum-faq">
          <div className="wrap aum-faq-grid">
            <div className="aum-faq-heading">
              <span className="aum-overline">{t('คำถามที่พบบ่อย', 'FREQUENTLY ASKED')}</span>
              <h2>{t('รายละเอียดก่อนเริ่มต้น', 'Before you begin.')}</h2>
              <p>{t('หากต้องการข้อมูลเพิ่มเติม ทีม VIP Concierge พร้อมพูดคุยกับคุณเป็นการส่วนตัว', 'For anything more specific, our VIP Concierge team is ready to speak with you privately.')}</p>
            </div>
            <div className="aum-faq-list">
              {content.faq.map((item, i) => (
                <details key={i} open={i === 0}>
                  <summary>{t(item.questionTh, item.questionEn)}</summary>
                  <p>{t(item.answerTh, item.answerEn)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="aum-final">
          <div className="aum-final-image" aria-hidden="true"></div>
          <div className="aum-final-overlay"></div>
          <div className="wrap aum-final-content">
            <span className="aum-overline">{t(content.finalCta.overlineTh, content.finalCta.overlineEn)}</span>
            <h2>{t(content.finalCta.headingTh, content.finalCta.headingEn)}</h2>
            <p>{t(content.finalCta.bodyTh, content.finalCta.bodyEn)}</p>
            <a href="#vipModalOverlay" className="aum-btn aum-btn-light vip-trigger" data-service="membership">{t(content.finalCta.buttonLabelTh, content.finalCta.buttonLabelEn)}</a>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
