import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getEcosystemContent } from '@/lib/ecosystemData'
import { getHomeData } from '@/lib/homeData'

export const metadata = {
  title: 'PHIVARA | ระบบนิเวศ Beaugevity — Anti-Aging, Dermatology, Wellness, Plastic Surgery',
}

// Rebuilt from phivara-design-html/ecosystem.html — like membership.html,
// the original was fully static (no per-page JS content injection beyond
// the shared header/footer/VIP modal), so this is a near-literal port.
// Content comes from the `ecosystem` Payload Global (cms/globals/Ecosystem.ts)
// instead of being hardcoded, so staff can edit copy without a code change.
// The 4 discipline cards each link out to /doctor, /program, and /article
// pre-filtered via query params (?specialty=/?category=) that those pages
// already read on load — see src/lib/ecosystemData.ts's DISCIPLINE_META
// comment for why those slugs live in code rather than the CMS.
export const revalidate = 60

export default async function EcosystemPage() {
  const [content, homeData] = await Promise.all([getEcosystemContent(), getHomeData()])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/ecosystem.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-ecosystem-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <SiteHeader page="ecosystem" />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <span className="current" data-th="ระบบนิเวศ PHIVARA" data-en="The PHIVARA Ecosystem">ระบบนิเวศ PHIVARA</span>
          </div>
        </div>
      </div>

      <main>
        <section className="eco-hero" id="ecoHero">
          <div className="eco-orb" id="ecoOrb"></div>
          <div className="wrap eco-hero-split">
            <div className="eco-ring-wrap reveal">
              <svg className="eco-ring-svg" viewBox="0 0 320 320" aria-hidden="true">
                <circle className="eco-ring-bg" cx="160" cy="160" r="132" />
                <circle className="eco-ring-seg eco-seg-longevity" cx="160" cy="160" r="132" transform="rotate(180 160 160)" />
                <circle className="eco-ring-seg eco-seg-dermatology" cx="160" cy="160" r="132" transform="rotate(270 160 160)" />
                <circle className="eco-ring-seg eco-seg-wellness" cx="160" cy="160" r="132" transform="rotate(90 160 160)" />
                <circle className="eco-ring-seg eco-seg-plastic" cx="160" cy="160" r="132" transform="rotate(0 160 160)" />
              </svg>
              <div className="eco-ring-core">
                <img src="/logo/phivara_logo.jpg" alt="PHIVARA" />
              </div>
              <div className="eco-ring-tags">
                {content.disciplines.map((d) => (
                  <a key={d.id} href={`#${d.id}`} className={`eco-ring-tag tag-${d.id}`}>
                    <span className="eco-tag-dot"></span>
                    <span data-th={d.titleTh} data-en={d.titleEn}>{d.titleTh}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="eco-hero-head reveal">
              <div className="eyebrow" data-th={content.hero.eyebrowTh} data-en={content.hero.eyebrowEn}>{content.hero.eyebrowTh}</div>
              <h1>
                <span data-th={content.hero.headlineLine1Th} data-en={content.hero.headlineLine1En}>{content.hero.headlineLine1Th}</span><br />
                <span data-th={content.hero.headlineLine2Th} data-en={content.hero.headlineLine2En}>{content.hero.headlineLine2Th}</span>
              </h1>
              <p data-th={content.hero.leadTh} data-en={content.hero.leadEn}>{content.hero.leadTh}</p>
              <div className="cta-row">
                <a href="#vipModalOverlay" className="btn btn-outline-dark vip-trigger" data-th="จองปรึกษาส่วนตัว" data-en="Book a Private Consultation">จองปรึกษาส่วนตัว</a>
              </div>
            </div>
          </div>
        </section>

        {content.disciplines.map((d, i) => (
          <div key={d.id}>
            <section className={`eco-section tone-${d.id} reveal${d.reverse ? ' reverse' : ''}`} id={d.id}>
              <div className="wrap eco-section-grid">
                <div className="eco-content">
                  <div className="eco-tone-eyebrow" data-th={d.eyebrowTh} data-en={d.eyebrowEn}>{d.eyebrowTh}</div>
                  <h2>
                    <span data-th={d.titleTh} data-en={d.titleEn}>{d.titleTh}</span>
                    <span className="eco-h2-sub" data-th={d.subtitleTh} data-en={d.subtitleEn}>{d.subtitleTh}</span>
                  </h2>
                  <p className="eco-desc" data-th={d.descriptionTh} data-en={d.descriptionEn}>{d.descriptionTh}</p>
                  <div className="eco-chip-row">
                    {d.chips.map((chip, j) => (
                      <span key={j} className="eco-chip" data-th={chip.th} data-en={chip.en}>{chip.th}</span>
                    ))}
                  </div>
                  <div className="eco-links">
                    <a className="eco-link-card" href={`/doctor?specialty=${d.filterValue}`}>
                      <span className="eco-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 1 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>
                      </span>
                      <span className="eco-link-label" data-th={d.doctorLinkLabelTh} data-en={d.doctorLinkLabelEn}>{d.doctorLinkLabelTh}</span>
                      <span className="eco-link-arrow">
                        <span data-th="ดูรายชื่อแพทย์" data-en="View Doctors">ดูรายชื่อแพทย์</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </a>
                    <a className="eco-link-card" href={`/program?category=${d.filterValue}`}>
                      <span className="eco-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                      </span>
                      <span className="eco-link-label" data-th={d.programLinkLabelTh} data-en={d.programLinkLabelEn}>{d.programLinkLabelTh}</span>
                      <span className="eco-link-arrow">
                        <span data-th="ดูโปรแกรม" data-en="View Programs">ดูโปรแกรม</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </a>
                    <a className="eco-link-card" href={`/article?category=${d.filterValue}`}>
                      <span className="eco-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                      </span>
                      <span className="eco-link-label" data-th={d.articleLinkLabelTh} data-en={d.articleLinkLabelEn}>{d.articleLinkLabelTh}</span>
                      <span className="eco-link-arrow">
                        <span data-th="อ่านบทความ" data-en="Read Articles">อ่านบทความ</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="eco-visual">
                <div className="eco-visual-frame-wrap">
                  <div className="eco-visual-frame">
                    <div className="eco-visual-media"><img src={d.image} alt={d.titleEn} loading="lazy" /></div>
                    <div className="eco-visual-tint"></div>
                    <div className="eco-visual-frame-inset" aria-hidden="true"></div>
                  </div>
                </div>
              </div>
            </section>
            {i < content.disciplines.length - 1 && (
              <div className="eco-divider" aria-hidden="true"><span className="eco-divider-diamond"></span></div>
            )}
          </div>
        ))}

        <section className="eco-cta">
          <div className="eco-cta-inner reveal">
            <div className="eyebrow center" style={{ color: '#F2E3C9' }} data-th={content.closingCta.eyebrowTh} data-en={content.closingCta.eyebrowEn}>{content.closingCta.eyebrowTh}</div>
            <h2 data-th={content.closingCta.headingTh} data-en={content.closingCta.headingEn}>{content.closingCta.headingTh}</h2>
            <p data-th={content.closingCta.bodyTh} data-en={content.closingCta.bodyEn}>{content.closingCta.bodyTh}</p>
            <a href="#vipModalOverlay" className="btn btn-gold vip-trigger" data-th={content.closingCta.buttonLabelTh} data-en={content.closingCta.buttonLabelEn}>{content.closingCta.buttonLabelTh}</a>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/ecosystem.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
