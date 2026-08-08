import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'
import { getFeaturedPrograms, getProgramsListing, PROGRAM_BRANCH_OPTIONS, PROGRAM_CATEGORY_OPTIONS } from '@/lib/programsData'

export const metadata = {
  title: 'PHIVARA | โปรแกรมตรวจเฉพาะทาง',
  description: 'โปรแกรมตรวจสุขภาพเฉพาะทางและแผนดูแลเฉพาะบุคคลโดยทีมแพทย์ PHIVARA',
}

// Rebuilt from phivara-design-html/program.html. The original hardcoded 6
// program cards directly in the HTML, then a large inline <script>
// generated 18 MORE cards from a plain array (`extraPrograms`), injected
// branch/price info client-side, and stripped the highlight bullets back
// out again — every program is now server-rendered directly from Payload
// with real data from the start, so none of that DOM-patching is needed.
export const revalidate = 60

export default async function ProgramListPage() {
  const [programs, featured, homeData] = await Promise.all([
    getProgramsListing(),
    getFeaturedPrograms(),
    getHomeData(),
  ])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

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

      <SiteHeader page="program" topbar={homeData.topbar} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <span className="current" data-th="โปรแกรมตรวจเฉพาะทาง" data-en="Specialized Programs">โปรแกรมตรวจเฉพาะทาง</span>
          </div>
        </div>
      </div>

      <main>
        {featured.length > 0 && (
          <section className="program-highlights program-highlights--cinematic program-highlights--compact" aria-labelledby="highlightTitle">
            <div className="program-highlight-particles" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div className="wrap">
              <div className="highlight-heading">
                <span className="eyebrow-gold" data-th="โปรแกรมแนะนำ · BY PHIVARA" data-en="Recommended · BY PHIVARA">โปรแกรมแนะนำ · BY PHIVARA</span>
                <h2 id="highlightTitle" data-th="โปรแกรมเด่นที่เราแนะนำ" data-en="Our Highlighted Programs">โปรแกรมเด่นที่เราแนะนำ</h2>
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
                          <h3 data-th={program.titleTh} data-en={program.titleEn}>{program.titleTh}</h3>
                          <p data-th={program.shortDescriptionTh} data-en={program.shortDescriptionEn}>{program.shortDescriptionTh}</p>
                          <div className="detail-meta slideshow-meta">
                            <div>
                              <span className="meta-icon">
                                <svg viewBox="0 0 24 24"><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1116 0z" /><circle cx="12" cy="10" r="2.5" /></svg>
                              </span>
                              <span><small data-th="สาขา" data-en="LOCATION">สาขา</small><strong data-th={program.branchTh} data-en={program.branchEn}>{program.branchTh}</strong></span>
                            </div>
                            <div>
                              <span className="meta-icon">
                                <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
                              </span>
                              <span><small data-th="รับบริการได้ถึง" data-en="VALID UNTIL">รับบริการได้ถึง</small><strong data-th="30/12/69" data-en="30/12/26">30/12/69</strong></span>
                            </div>
                          </div>
                          <div className="highlight-actions">
                            <div className="highlight-price">
                              <small data-th="เริ่มต้น" data-en="FROM">เริ่มต้น</small>
                              <span className="price-value">{program.price.toLocaleString('en-US')}</span>
                              <small data-th="บาท" data-en="THB">บาท</small>
                            </div>
                            <a className="highlight-link" href={`/program/${program.slug}`} data-th="ดูรายละเอียด" data-en="View details">ดูรายละเอียด</a>
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
                <h2 data-th="โปรแกรมตรวจเฉพาะทาง" data-en="Specialized programs">โปรแกรมตรวจเฉพาะทาง</h2>
              </div>
            </div>

            <div className="program-filter-card">
              <div className="program-filter-top">
                <label className="program-search">
                  <input id="programSearch" type="search" placeholder="ค้นหาชื่อโปรแกรม หรือความต้องการ..." data-th-placeholder="ค้นหาชื่อโปรแกรม หรือความต้องการ..." data-en-placeholder="Search program or health concern..." />
                  <svg className="search-mark" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                </label>
                <div className="program-filter-selects">
                  <div className="custom-select-box" id="categorySelectBox">
                    <button type="button" className="custom-select-btn" id="categoryBtn">
                      <svg className="icon-spec" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                      <span className="btn-text" id="categoryBtnText" data-th="ทุกหมวดโปรแกรม" data-en="All Program Categories">ทุกหมวดโปรแกรม</span>
                      <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <div className="custom-dropdown-menu" id="categoryMenu">
                      <button type="button" className="dropdown-item active" data-category="all" data-th="ทุกหมวดโปรแกรม" data-en="All Program Categories">ทุกหมวดโปรแกรม</button>
                      {PROGRAM_CATEGORY_OPTIONS.map((opt) => (
                        <button key={opt.value} type="button" className="dropdown-item" data-category={opt.value} data-th={opt.th} data-en={opt.en}>{opt.th}</button>
                      ))}
                    </div>
                  </div>
                  <div className="custom-select-box" id="branchSelectBox">
                    <button type="button" className="custom-select-btn" id="branchBtn">
                      <svg className="icon-loc" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <span className="btn-text" id="branchBtnText" data-th="ทุกสาขา PHIVARA" data-en="All PHIVARA Locations">ทุกสาขา PHIVARA</span>
                      <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                    </button>
                    <div className="custom-dropdown-menu" id="branchMenu">
                      <button type="button" className="dropdown-item active" data-branch="all" data-th="ทุกสาขา PHIVARA" data-en="All PHIVARA Locations">ทุกสาขา PHIVARA</button>
                      {PROGRAM_BRANCH_OPTIONS.map((opt) => (
                        <button key={opt.value} type="button" className="dropdown-item" data-branch={opt.value} data-th={opt.th} data-en={opt.en}>{opt.th}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="catalog-results">
              <div>
                <span data-th="แสดงผลการค้นหา:" data-en="Showing:">แสดงผลการค้นหา:</span>{' '}
                <span className="catalog-count" id="programCount">{programs.length}</span>{' '}
                <span data-th="โปรแกรม" data-en="programs">โปรแกรม</span>
              </div>
            </div>

            <div className="program-grid" id="programGrid">
              {programs.map((program) => (
                <article key={program.slug} className="program-card" data-category={program.category} data-branch={program.branchSlug} data-search={program.searchKeywords}>
                  <div className="card-visual">
                    <a href={`/program/${program.slug}`} aria-label={program.titleTh}>
                      <img src={program.image} alt={program.titleTh} />
                    </a>
                  </div>
                  <div className="card-body">
                    <span className="program-branch">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                      <span className="program-branch__text">
                        <span className="program-branch__brand">PHIVARA</span>
                        <span className="program-branch__name" data-th={program.branchTh} data-en={program.branchEn}>{program.branchTh}</span>
                      </span>
                    </span>
                    <span className="card-code">{program.code}</span>
                    <h3><a className="card-title-link" href={`/program/${program.slug}`} data-th={program.titleTh} data-en={program.titleEn}>{program.titleTh}</a></h3>
                    <p data-th={program.shortDescriptionTh} data-en={program.shortDescriptionEn}>{program.shortDescriptionTh}</p>
                    <div className="card-foot">
                      <span data-th={program.price.toLocaleString('en-US')} data-en={program.price.toLocaleString('en-US')}>{program.price.toLocaleString('en-US')}</span>
                      <a className="card-link" href={`/program/${program.slug}`} data-th="รายละเอียด →" data-en="Details →">รายละเอียด →</a>
                    </div>
                  </div>
                </article>
              ))}
              <div className="no-results" id="noResults" data-th="ไม่พบโปรแกรมที่ตรงกับการค้นหา กรุณาลองใช้คำค้นอื่น" data-en="No matching program found. Please try another search.">
                ไม่พบโปรแกรมที่ตรงกับการค้นหา กรุณาลองใช้คำค้นอื่น
              </div>
            </div>
            <nav className="program-pagination" id="programPagination" aria-label="Program pagination"></nav>
          </div>
        </section>

        <section className="signature">
          <div className="wrap signature-grid">
            <div className="signature-copy">
              <span className="eyebrow">PHIVARA SIGNATURE</span>
              <h2 data-th="ไม่แน่ใจว่าควรเริ่มจากโปรแกรมไหน?" data-en="Not sure where to begin?">ไม่แน่ใจว่าควรเริ่ม<br />จากโปรแกรมไหน?</h2>
              <p data-th="เริ่มต้นด้วยการพูดคุยกับ Health Concierge เพื่อช่วยทำความเข้าใจเป้าหมาย และประสานแพทย์ที่เหมาะสมกับคุณ โดยไม่มีค่าใช้จ่าย" data-en="Begin with our Health Concierge, who will understand your goals and connect you with the right physician, at no charge.">
                เริ่มต้นด้วยการพูดคุยกับ Health Concierge เพื่อช่วยทำความเข้าใจเป้าหมาย และประสานแพทย์ที่เหมาะสมกับคุณ โดยไม่มีค่าใช้จ่าย
              </p>
            </div>
            <div className="signature-panel">
              <span className="label">PERSONAL HEALTH DISCOVERY</span>
              <h3 data-th="Private Health Consultation" data-en="Private Health Consultation">Private Health Consultation</h3>
              <p data-th="การพูดคุยเบื้องต้น 20 นาที เพื่อค้นหาโปรแกรมที่เหมาะกับคุณที่สุด" data-en="A 20-minute discovery conversation to find the program that fits you best.">
                การพูดคุยเบื้องต้น 20 นาที เพื่อค้นหาโปรแกรมที่เหมาะกับคุณที่สุด
              </p>
              <div className="signature-includes">
                <div data-th="✓ ประเมินเป้าหมายสุขภาพ" data-en="✓ Review health goals">✓ ประเมินเป้าหมายสุขภาพ</div>
                <div data-th="✓ แนะนำโปรแกรมที่เหมาะสม" data-en="✓ Recommend suitable programs">✓ แนะนำโปรแกรมที่เหมาะสม</div>
                <div data-th="✓ เลือกแพทย์และสาขา" data-en="✓ Select doctor & location">✓ เลือกแพทย์และสาขา</div>
                <div data-th="✓ ไม่มีค่าใช้จ่าย" data-en="✓ Complimentary">✓ ไม่มีค่าใช้จ่าย</div>
              </div>
              <button className="program-btn booking-trigger" data-th="นัดหมาย Health Concierge  →" data-en="Book Health Concierge  →">นัดหมาย Health Concierge&nbsp; →</button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/catalog-controls.js" strategy="afterInteractive" />
      <Script src="/js/program.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
