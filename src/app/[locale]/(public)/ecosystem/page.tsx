import Script from 'next/script'
import type { ReactNode } from 'react'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getEcosystemContent } from '@/lib/ecosystemData'
import { getExpertiseCategoryOptions, getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return {
    title: t(
      'PHIVARA | ระบบนิเวศ Beaugevity — Anti-Aging, Dermatology, Wellness, Plastic Surgery',
      'PHIVARA | The Beaugevity Ecosystem — Anti-Aging, Dermatology, Wellness, Plastic Surgery',
    ),
  }
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

export default async function EcosystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [content, homeData, liveLocales] = await Promise.all([
    getEcosystemContent(locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
  ])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches, categories: getExpertiseCategoryOptions(homeData.hero) }).replace(/</g, '\\u003c')};`

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

      <SiteHeader page="ecosystem" topbar={homeData.topbar} locale={locale} localePath="/ecosystem" liveLocales={liveLocales} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <span className="current">{t('ระบบนิเวศ PHIVARA', 'The PHIVARA Ecosystem')}</span>
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
                    <span>{t(d.titleTh, d.titleEn)}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="eco-hero-head reveal">
              <div className="eyebrow">{t(content.hero.eyebrowTh, content.hero.eyebrowEn)}</div>
              <h1>
                <span>{t(content.hero.headlineLine1Th, content.hero.headlineLine1En)}</span><br />
                <span>{t(content.hero.headlineLine2Th, content.hero.headlineLine2En)}</span>
              </h1>
              {content.hero.leadBlocks.map((block, i): ReactNode => {
                if (block.type === 'list') {
                  const ListTag = block.listType === 'number' ? 'ol' : 'ul'
                  return (
                    <ListTag key={i} className="eco-hero-lead-list">
                      {(block.items || []).map((item, li) => (
                        <li key={li}>{item}</li>
                      ))}
                    </ListTag>
                  )
                }
                return <p key={i}>{block.text}</p>
              })}
              <div className="cta-row">
                <a href="#vipModalOverlay" className="btn btn-outline-dark vip-trigger">{t('จองปรึกษาส่วนตัว', 'Book a Private Consultation')}</a>
              </div>
            </div>
          </div>
        </section>

        {content.disciplines.map((d, i) => (
          <div key={d.id}>
            <section className={`eco-section tone-${d.id} reveal${d.reverse ? ' reverse' : ''}`} id={d.id}>
              <div className="wrap eco-section-grid">
                <div className="eco-content">
                  <div className="eco-tone-eyebrow">{t(d.eyebrowTh, d.eyebrowEn)}</div>
                  <h2>
                    <span>{t(d.titleTh, d.titleEn)}</span>
                    <span className="eco-h2-sub">{t(d.subtitleTh, d.subtitleEn)}</span>
                  </h2>
                  <p className="eco-desc">{t(d.descriptionTh, d.descriptionEn)}</p>
                  <div className="eco-chip-row">
                    {d.chips.map((chip, j) => (
                      <span key={j} className="eco-chip">{t(chip.th, chip.en)}</span>
                    ))}
                  </div>
                  <div className="eco-links">
                    <a className="eco-link-card" href={localizedHref(locale, `/doctor?specialty=${d.filterValue}`)}>
                      <span className="eco-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 1 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>
                      </span>
                      <span className="eco-link-label">{t(d.doctorLinkLabelTh, d.doctorLinkLabelEn)}</span>
                      <span className="eco-link-arrow">
                        <span>{t('ดูรายชื่อแพทย์', 'View Doctors')}</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </a>
                    <a className="eco-link-card" href={localizedHref(locale, `/program?category=${d.filterValue}`)}>
                      <span className="eco-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                      </span>
                      <span className="eco-link-label">{t(d.programLinkLabelTh, d.programLinkLabelEn)}</span>
                      <span className="eco-link-arrow">
                        <span>{t('ดูโปรแกรม', 'View Programs')}</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </a>
                    <a className="eco-link-card" href={localizedHref(locale, `/article?category=${d.filterValue}`)}>
                      <span className="eco-link-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                      </span>
                      <span className="eco-link-label">{t(d.articleLinkLabelTh, d.articleLinkLabelEn)}</span>
                      <span className="eco-link-arrow">
                        <span>{t('อ่านบทความ', 'Read Articles')}</span>
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
            <div className="eyebrow center" style={{ color: '#F2E3C9' }}>{t(content.closingCta.eyebrowTh, content.closingCta.eyebrowEn)}</div>
            <h2>{t(content.closingCta.headingTh, content.closingCta.headingEn)}</h2>
            <p>{t(content.closingCta.bodyTh, content.closingCta.bodyEn)}</p>
            <a href="#vipModalOverlay" className="btn btn-gold vip-trigger">{t(content.closingCta.buttonLabelTh, content.closingCta.buttonLabelEn)}</a>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/ecosystem.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
