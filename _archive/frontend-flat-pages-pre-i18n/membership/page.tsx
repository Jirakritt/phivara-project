import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'
import { getMembershipContent } from '@/lib/membershipData'

export const metadata = {
  title: 'PHIVARA AUM | Private Membership',
  description: 'PHIVARA AUM Private Membership การดูแลสุขภาพและความงามเฉพาะบุคคล พร้อมทีมแพทย์และ VIP Concierge ตลอดทั้งปี',
}

// Rebuilt from phivara-design-html/membership.html — the original was fully
// static (no JS content injection beyond the shared header/footer/VIP
// modal), so this page is a near-literal port. Content now comes from the
// `membership` Payload Global (cms/globals/Membership.ts) instead of being
// hardcoded, so staff can edit copy without a code change.
export const revalidate = 60

export default async function MembershipPage() {
  const [content, homeData] = await Promise.all([getMembershipContent(), getHomeData()])
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

      <SiteHeader page="membership" topbar={homeData.topbar} />

      <main>
        <section className="aum-hero" id="top">
          <div className="aum-hero-copy">
            <div className="aum-hero-inner">
              <p className="aum-kicker" data-th={content.hero.kickerTh} data-en={content.hero.kickerEn}>{content.hero.kickerTh}</p>
              <p className="aum-mark" aria-hidden="true">AUM</p>
              <h1 data-th={content.hero.headlineTh} data-en={content.hero.headlineEn}>{content.hero.headlineTh}</h1>
              <p className="aum-lead" data-th={content.hero.leadTh} data-en={content.hero.leadEn}>{content.hero.leadTh}</p>
              <div className="aum-actions">
                <a href="#vipModalOverlay" className="aum-btn aum-btn-light vip-trigger" data-service="membership" data-th={content.finalCta.buttonLabelTh} data-en={content.finalCta.buttonLabelEn}>{content.finalCta.buttonLabelTh}</a>
                <a href="#privileges" className="aum-text-link" data-th="สำรวจสิทธิสมาชิก ↓" data-en="Explore Membership ↓">สำรวจสิทธิสมาชิก ↓</a>
              </div>
            </div>
          </div>
          <div className="aum-hero-image" role="img" aria-label="PHIVARA private concierge welcoming a member">
            <div className="aum-edition">
              <span>PRIVATE EDITION</span>
              <strong>01</strong>
              <small data-th="BY INVITATION" data-en="BY INVITATION">BY INVITATION</small>
            </div>
          </div>
        </section>

        <section className="aum-intro">
          <div className="wrap aum-intro-grid">
            <div className="aum-intro-label">
              <span className="aum-overline" data-th={content.intro.overlineTh} data-en={content.intro.overlineEn}>{content.intro.overlineTh}</span>
              <span className="aum-rule"></span>
            </div>
            <div className="aum-intro-copy">
              <h2 data-th={content.intro.headingTh} data-en={content.intro.headingEn}>{content.intro.headingTh}</h2>
              <p data-th={content.intro.bodyTh} data-en={content.intro.bodyEn}>{content.intro.bodyTh}</p>
            </div>
          </div>
        </section>

        <section className="aum-privileges" id="privileges">
          <div className="wrap">
            <div className="aum-section-head">
              <span className="aum-overline" data-th="สิทธิพิเศษสมาชิก AUM" data-en="THE AUM PRIVILEGES">สิทธิพิเศษสมาชิก AUM</span>
              <h2 data-th="ทุกจังหวะของการดูแล ถูกออกแบบรอบตัวคุณ" data-en="Every detail of care, designed around you.">ทุกจังหวะของการดูแล<br />ถูกออกแบบรอบตัวคุณ</h2>
              <p data-th="บริการที่เชื่อมการดูแลจากทีมแพทย์ ผู้ประสานงาน และพื้นที่ส่วนตัว ให้เป็นประสบการณ์เดียวอย่างไร้รอยต่อ" data-en="A seamless experience connecting your specialists, personal coordinator, and private spaces in one thoughtful journey.">บริการที่เชื่อมการดูแลจากทีมแพทย์ ผู้ประสานงาน และพื้นที่ส่วนตัว ให้เป็นประสบการณ์เดียวอย่างไร้รอยต่อ</p>
            </div>

            <div className="aum-privilege-grid">
              {content.privileges.map((privilege, i) => (
                <article key={i} className="aum-privilege-card">
                  <span className="aum-card-number">{String(i + 1).padStart(2, '0')}</span>
                  <div className="aum-card-line"></div>
                  <h3 data-th={privilege.titleTh} data-en={privilege.titleEn}>{privilege.titleTh}</h3>
                  <p data-th={privilege.descriptionTh} data-en={privilege.descriptionEn}>{privilege.descriptionTh}</p>
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
                <span data-th="ความเป็นส่วนตัว" data-en="PRIVACY">ความเป็นส่วนตัว</span>
                <strong>01 — 01</strong>
              </div>
            </div>
            <div className="aum-promise-copy">
              <span className="aum-overline" data-th="THE AUM PROMISE" data-en="THE AUM PROMISE">THE AUM PROMISE</span>
              <blockquote data-th={content.promise.quoteTh} data-en={content.promise.quoteEn}>{content.promise.quoteTh}</blockquote>
              <p data-th={content.promise.bodyTh} data-en={content.promise.bodyEn}>{content.promise.bodyTh}</p>
              <div className="aum-signature">The Art of Beaugevity</div>
            </div>
          </div>
        </section>

        <section className="aum-journey">
          <div className="wrap">
            <div className="aum-section-head aum-section-head-light">
              <span className="aum-overline" data-th="เส้นทางสู่สมาชิก AUM" data-en="YOUR MEMBERSHIP JOURNEY">เส้นทางสู่สมาชิก AUM</span>
              <h2 data-th="เริ่มจากการทำความรู้จัก ไม่ใช่การขายสมาชิก" data-en="It begins with understanding, not a sales pitch.">เริ่มจากการทำความรู้จัก<br />ไม่ใช่การขายสมาชิก</h2>
            </div>
            <ol className="aum-steps">
              {content.journeySteps.map((step, i) => (
                <li key={i}>
                  <span className="aum-step-number">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 data-th={step.titleTh} data-en={step.titleEn}>{step.titleTh}</h3>
                    <p data-th={step.descriptionTh} data-en={step.descriptionEn}>{step.descriptionTh}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="aum-faq">
          <div className="wrap aum-faq-grid">
            <div className="aum-faq-heading">
              <span className="aum-overline" data-th="คำถามที่พบบ่อย" data-en="FREQUENTLY ASKED">คำถามที่พบบ่อย</span>
              <h2 data-th="รายละเอียดก่อนเริ่มต้น" data-en="Before you begin.">รายละเอียด<br />ก่อนเริ่มต้น</h2>
              <p data-th="หากต้องการข้อมูลเพิ่มเติม ทีม VIP Concierge พร้อมพูดคุยกับคุณเป็นการส่วนตัว" data-en="For anything more specific, our VIP Concierge team is ready to speak with you privately.">หากต้องการข้อมูลเพิ่มเติม ทีม VIP Concierge พร้อมพูดคุยกับคุณเป็นการส่วนตัว</p>
            </div>
            <div className="aum-faq-list">
              {content.faq.map((item, i) => (
                <details key={i} open={i === 0}>
                  <summary data-th={item.questionTh} data-en={item.questionEn}>{item.questionTh}</summary>
                  <p data-th={item.answerTh} data-en={item.answerEn}>{item.answerTh}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="aum-final">
          <div className="aum-final-image" aria-hidden="true"></div>
          <div className="aum-final-overlay"></div>
          <div className="wrap aum-final-content">
            <span className="aum-overline" data-th={content.finalCta.overlineTh} data-en={content.finalCta.overlineEn}>{content.finalCta.overlineTh}</span>
            <h2 data-th={content.finalCta.headingTh} data-en={content.finalCta.headingEn}>{content.finalCta.headingTh}</h2>
            <p data-th={content.finalCta.bodyTh} data-en={content.finalCta.bodyEn}>{content.finalCta.bodyTh}</p>
            <a href="#vipModalOverlay" className="aum-btn aum-btn-light vip-trigger" data-service="membership" data-th={content.finalCta.buttonLabelTh} data-en={content.finalCta.buttonLabelEn}>{content.finalCta.buttonLabelTh}</a>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
