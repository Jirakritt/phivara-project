import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'
import { getHomeData } from '@/lib/homeData'
import { getFeaturedPrograms, getProgramsListing, PROGRAM_BRANCH_OPTIONS, PROGRAM_CATEGORY_OPTIONS } from '@/lib/programsData'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return {
    title: t('PHIVARA | โปรแกรมตรวจเฉพาะทาง', 'PHIVARA | Specialized Programs'),
    description: t(
      'โปรแกรมตรวจสุขภาพเฉพาะทางและแผนดูแลเฉพาะบุคคลโดยทีมแพทย์ PHIVARA',
      'Specialized health screening programs and personalized care plans by the PHIVARA medical team.',
    ),
  }
}

// Rebuilt from phivara-design-html/program.html. The original hardcoded 6
// program cards directly in the HTML, then a large inline <script>
// generated 18 MORE cards from a plain array (`extraPrograms`), injected
// branch/price info client-side, and stripped the highlight bullets back
// out again — every program is now server-rendered directly from Payload
// with real data from the start, so none of that DOM-patching is needed.
export const revalidate = 60

export default async function ProgramListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [programs, featured, homeData, liveLocales] = await Promise.all([
    getProgramsListing(locale),
    getFeaturedPrograms(locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
  ])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`
  const searchPlaceholder = t('ค้นหาชื่อโปรแกรม หรือความต้องการ...', 'Search program or health concern...')

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/catalog.css" />
      <link rel="stylesheet" href="/css/program.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-program-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <SiteHeader page="program" topbar={homeData.topbar} locale={locale} localePath="/program" liveLocales={liveLocales} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <span className="current">{t('โปรแกรมตรวจเฉพาะทาง', 'Specialized Programs')}</span>
          </div>
        </div>
      </div>

      <main>
        {featured.length > 0 && (
          <section className="program-highlights program-highlights--cinematic program-highlights--compact" aria-labelledby="highlightTitle">
            <div className="program-highlight-particles" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div className="wrap">
              <div className="highlight-heading">
                <span className="eyebrow-gold">{t('โปรแกรมแนะนำ · BY PHIVARA', 'Recommended · BY PHIVARA')}</span>
                <h2 id="highlightTitle">{t('โปรแกรมเด่นที่เราแนะนำ', 'Our Highlighted Programs')}</h2>
              </div>
              <div className="highlight-carousel" id="highlightCarousel">
                <div className="highlight-carousel-viewport">
                  <div className="highlight-grid">
                    {featured.map((program) => (
                      <article key={program.slug} className="highlight-card">
                        <div className="card-media">
                          <img src={program.image} alt={program.titleTh} />
                        </div>
                        <div className="highlight-content">
                          <span className="eyebrow">{program.code}</span>
                          <h3>{t(program.titleTh, program.titleEn)}</h3>
                          <p>{t(program.shortDescriptionTh, program.shortDescriptionEn)}</p>
                          <div className="detail-meta slideshow-meta">
                            <div>
                              <span className="meta-icon">
                                <svg viewBox="0 0 24 24"><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1116 0z" /><circle cx="12" cy="10" r="2.5" /></svg>
                              </span>
                              <span><small>{t('สาขา', 'LOCATION')}</small><strong>{t(program.branchTh, program.branchEn)}</strong></span>
                            </div>
                            <div>
                              <span className="meta-icon">
                                <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
                              </span>
                              <span><small>{t('รับบริการได้ถึง', 'VALID UNTIL')}</small><strong>{t('30/12/69', '30/12/26')}</strong></span>
                            </div>
                          </div>
                          <div className="highlight-actions">
                            <div className="highlight-price">
                              <small>{t('เริ่มต้น', 'FROM')}</small>
                              <span className="price-value">{program.price.toLocaleString('en-US')}</span>
                              <small>{t('บาท', 'THB')}</small>
                            </div>
                            <a className="highlight-link" href={localizedHref(locale, `/program/${program.slug}`)}>{t('ดูรายละเอียด', 'View details')}</a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="highlight-carousel-controls">
                  <span className="highlight-carousel-counter" id="highlightCounter" aria-live="polite">{`01 / ${String(featured.length).padStart(2, '0')}`}</span>
                  <span className="highlight-carousel-progress" aria-hidden="true"><span></span></span>
                  <button className="highlight-carousel-btn highlight-carousel-prev" type="button" aria-label="Previous highlighted program">‹</button>
                  <div className="highlight-carousel-dots" aria-label="Highlighted programs"></div>
                  <button className="highlight-carousel-btn highlight-carousel-next" type="button" aria-label="Next highlighted program">›</button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="program-catalog" id="programs">
          <div className="wrap">
            <div className="catalog-top">
              <div>
                <span className="eyebrow-green">EXPLORE PROGRAMS</span>
                <h2>{t('โปรแกรมตรวจเฉพาะทาง', 'Specialized programs')}</h2>
              </div>
            </div>

            <div className="program-filter-card">
              <div className="program-filter-top">
                <label className="program-search">
                  <input id="programSearch" type="search" placeholder={searchPlaceholder} data-th-placeholder="ค้นหาชื่อโปรแกรม หรือความต้องการ..." data-en-placeholder="Search program or health concern..." />
                  <svg className="search-mark" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                </label>
                <div className="program-filter-selects">
                  <div className="custom-select-box" id="categorySelectBox">
                    <button type="button" className="custom-select-btn" id="categoryBtn">
                      <svg className="icon-spec" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                      <span className="btn-text" id="categoryBtnText">{t('ทุกหมวดโปรแกรม', 'All Program Categories')}</span>
                      <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <div className="custom-dropdown-menu" id="categoryMenu">
                      <button type="button" className="dropdown-item active" data-category="all">{t('ทุกหมวดโปรแกรม', 'All Program Categories')}</button>
                      {PROGRAM_CATEGORY_OPTIONS.map((opt) => (
                        <button key={opt.value} type="button" className="dropdown-item" data-category={opt.value}>{t(opt.th, opt.en)}</button>
                      ))}
                    </div>
                  </div>
                  <div className="custom-select-box" id="branchSelectBox">
                    <button type="button" className="custom-select-btn" id="branchBtn">
                      <svg className="icon-loc" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <span className="btn-text" id="branchBtnText">{t('ทุกสาขา PHIVARA', 'All PHIVARA Locations')}</span>
                      <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <div className="custom-dropdown-menu" id="branchMenu">
                      <button type="button" className="dropdown-item active" data-branch="all">{t('ทุกสาขา PHIVARA', 'All PHIVARA Locations')}</button>
                      {PROGRAM_BRANCH_OPTIONS.map((opt) => (
                        <button key={opt.value} type="button" className="dropdown-item" data-branch={opt.value}>{t(opt.th, opt.en)}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="catalog-results">
              <div>
                <span>{t('แสดงผลการค้นหา:', 'Showing:')}</span>{' '}
                <span className="catalog-count" id="programCount">{programs.length}</span>{' '}
                <span>{t('โปรแกรม', 'programs')}</span>
              </div>
            </div>

            <div className="program-grid" id="programGrid">
              {programs.map((program) => (
                <article key={program.slug} className="program-card" data-category={program.category} data-branch={program.branchSlug} data-search={program.searchKeywords}>
                  <div className="card-visual">
                    <a href={localizedHref(locale, `/program/${program.slug}`)} aria-label={program.titleTh}>
                      <img src={program.image} alt={program.titleTh} />
                    </a>
                  </div>
                  <div className="card-body">
                    <span className="program-branch">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                      <span className="program-branch__text">
                        <span className="program-branch__brand">PHIVARA</span>
                        <span className="program-branch__name">{t(program.branchTh, program.branchEn)}</span>
                      </span>
                    </span>
                    <span className="card-code">{program.code}</span>
                    <h3><a className="card-title-link" href={localizedHref(locale, `/program/${program.slug}`)}>{t(program.titleTh, program.titleEn)}</a></h3>
                    <p>{t(program.shortDescriptionTh, program.shortDescriptionEn)}</p>
                    <div className="card-foot">
                      <span>{program.price.toLocaleString('en-US')}</span>
                      <a className="card-link" href={localizedHref(locale, `/program/${program.slug}`)}>{t('รายละเอียด →', 'Details →')}</a>
                    </div>
                  </div>
                </article>
              ))}
              <div className="no-results" id="noResults">
                {t('ไม่พบโปรแกรมที่ตรงกับการค้นหา กรุณาลองใช้คำค้นอื่น', 'No matching program found. Please try another search.')}
              </div>
            </div>
            <nav className="program-pagination" id="programPagination" aria-label="Program pagination"></nav>
          </div>
        </section>

        <section className="signature">
          <div className="wrap signature-grid">
            <div className="signature-copy">
              <span className="eyebrow">PHIVARA SIGNATURE</span>
              <h2>{t('ไม่แน่ใจว่าควรเริ่มจากโปรแกรมไหน?', 'Not sure where to begin?')}</h2>
              <p>
                {t(
                  'เริ่มต้นด้วยการพูดคุยกับ Health Concierge เพื่อช่วยทำความเข้าใจเป้าหมาย และประสานแพทย์ที่เหมาะสมกับคุณ โดยไม่มีค่าใช้จ่าย',
                  'Begin with our Health Concierge, who will understand your goals and connect you with the right physician, at no charge.',
                )}
              </p>
            </div>
            <div className="signature-panel">
              <span className="label">PERSONAL HEALTH DISCOVERY</span>
              <h3>Private Health Consultation</h3>
              <p>{t('การพูดคุยเบื้องต้น 20 นาที เพื่อค้นหาโปรแกรมที่เหมาะกับคุณที่สุด', 'A 20-minute discovery conversation to find the program that fits you best.')}</p>
              <div className="signature-includes">
                <div>{t('✓ ประเมินเป้าหมายสุขภาพ', '✓ Review health goals')}</div>
                <div>{t('✓ แนะนำโปรแกรมที่เหมาะสม', '✓ Recommend suitable programs')}</div>
                <div>{t('✓ เลือกแพทย์และสาขา', '✓ Select doctor & location')}</div>
                <div>{t('✓ ไม่มีค่าใช้จ่าย', '✓ Complimentary')}</div>
              </div>
              <button className="program-btn booking-trigger">{t('นัดหมาย Health Concierge  →', 'Book Health Concierge  →')}</button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/catalog-controls.js" strategy="afterInteractive" />
      <Script src="/js/program.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
