import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { ARTICLE_CATEGORY_OPTIONS, getArticlesListing } from '@/lib/articlesData'
import { getHomeData } from '@/lib/homeData'

export const metadata = {
  title: 'PHIVARA Journal | คลังความรู้จากผู้เชี่ยวชาญ',
  description: 'PHIVARA Journal — บทความด้านความงาม สุขภาพผิว และเวชศาสตร์อายุยืนยาวจากแพทย์ผู้เชี่ยวชาญ',
}

// Rebuilt from phivara-design-html/article.html. The original hardcoded 20
// `.journal-card` entries directly in the HTML, but only 3 of them
// (blue-ocean-pathway, skin-care-tips, hormone-balance) correspond to real
// CMS content — the other 17 were mockup placeholders never wired to data.
// The grid here is server-rendered from the real Articles collection only;
// article.js's filter/sort/search/pagination logic is otherwise reused as-is.
export const revalidate = 60

export default async function ArticleListPage() {
  const [articles, homeData] = await Promise.all([getArticlesListing(), getHomeData()])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/catalog.css" />
      <link rel="stylesheet" href="/css/journal-card.css" />
      <link rel="stylesheet" href="/css/article.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-article-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <SiteHeader page="article" />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <span className="current" data-th="คลังความรู้" data-en="Journal">คลังความรู้</span>
          </div>
        </div>
      </div>

      <main>
        <section className="article-hero">
          <div className="wrap article-hero-inner">
            <div className="eyebrow center">PHIVARA JOURNAL</div>
            <h1 data-th="ความรู้เพื่อความงามและสุขภาวะที่ยั่งยืน" data-en="Insights for Lasting Beauty &amp; Wellbeing">ความรู้เพื่อความงามและสุขภาวะที่ยั่งยืน</h1>
            <div className="hero-gold-divider"><span className="line"></span><span className="diamond">◆</span><span className="line"></span></div>
            <p data-th="บทความจากทีมแพทย์ผู้เชี่ยวชาญที่ถ่ายทอดหลักการดูแลอย่างเข้าใจ ครอบคลุมผิวพรรณ ศัลยกรรมความงาม เวชศาสตร์ชะลอวัย และสุขภาพแบบองค์รวม" data-en="Expert-led perspectives on skin, aesthetic surgery, longevity medicine and holistic wellbeing, thoughtfully explained for informed decisions.">
              บทความจากทีมแพทย์ผู้เชี่ยวชาญที่ถ่ายทอดหลักการดูแลอย่างเข้าใจ ครอบคลุมผิวพรรณ ศัลยกรรมความงาม เวชศาสตร์ชะลอวัย และสุขภาพแบบองค์รวม
            </p>
          </div>
        </section>

        <div className="catalog-filter-section">
          <div className="wrap">
            <div className="catalog-top">
              <div>
                <span className="eyebrow-green">EXPLORE JOURNAL</span>
                <h2 id="articleSectionTitle">บทความทั้งหมด</h2>
              </div>
            </div>
            <div className="catalog-filter-card">
              <div className="catalog-filter-row">
                <label className="catalog-search">
                  <svg className="catalog-search__icon" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
                  <input id="articleSearch" type="search" data-th-placeholder="ค้นหาชื่อบทความ, หัวข้อที่สนใจ..." data-en-placeholder="Search articles, topics..." placeholder="ค้นหาชื่อบทความ, หัวข้อที่สนใจ..." />
                  <button type="button" className="catalog-search__clear" id="articleSearchClear" aria-label="Clear search">&times;</button>
                </label>
                <div className="custom-select-box catalog-filter-select" id="articleCategorySelectBox">
                  <button type="button" className="custom-select-btn" id="articleCategoryBtn">
                    <svg className="icon-spec" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h10"></path></svg>
                    <span className="btn-text" id="articleCategoryBtnText" data-th="บทความทั้งหมด" data-en="All Articles">บทความทั้งหมด</span>
                    <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8}><path d="m6 9 6 6 6-6"></path></svg>
                  </button>
                  <div className="custom-dropdown-menu" id="articleCategoryMenu">
                    <button type="button" className="dropdown-item active" data-category="all" data-th="บทความทั้งหมด" data-en="All Articles">บทความทั้งหมด</button>
                    {ARTICLE_CATEGORY_OPTIONS.map((opt) => (
                      <button key={opt.value} type="button" className="dropdown-item" data-category={opt.value} data-th={opt.th} data-en={opt.en}>{opt.th}</button>
                    ))}
                  </div>
                </div>
                <div className="custom-select-box catalog-filter-select" id="articleSortSelectBox">
                  <button type="button" className="custom-select-btn" id="articleSortBtn">
                    <svg className="icon-spec" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h12M8 12h9M8 18h6"></path><path d="m3 5 2-2 2 2M5 3v16"></path></svg>
                    <span className="btn-text" id="articleSortBtnText" data-th="ล่าสุด" data-en="Latest">ล่าสุด</span>
                    <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8}><path d="m6 9 6 6 6-6"></path></svg>
                  </button>
                  <div className="custom-dropdown-menu" id="articleSortMenu">
                    <button type="button" className="dropdown-item active" data-sort="newest" data-th="ล่าสุด" data-en="Latest">ล่าสุด</button>
                    <button type="button" className="dropdown-item" data-sort="oldest" data-th="เก่าที่สุด" data-en="Oldest">เก่าที่สุด</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="catalog-results">
              <div>
                <span data-th="แสดงผลการค้นหา:" data-en="Showing:">แสดงผลการค้นหา:</span>{' '}
                <span className="catalog-count" id="articleFilterCount">{articles.length}</span>{' '}
                <span data-th="บทความ" data-en="articles">บทความ</span>
              </div>
            </div>
          </div>
        </div>

        <section className="article-content">
          <div className="wrap">
            <div className="journal-grid stagger in" id="articleGrid">
              {articles.map((article) => (
                <article key={article.slug} className="journal-card s-item" data-category={article.category}>
                  <a className="journal-card__media" href={`/article/${article.slug}`}>
                    <img className="journal-card__image" src={article.image} alt={article.titleTh} />
                  </a>
                  <div className="journal-card__body">
                    <span className="journal-card__tag" data-th={article.categoryLabelTh} data-en={article.categoryLabelEn}>{article.categoryLabelTh}</span>
                    <h3><a href={`/article/${article.slug}`} data-th={article.titleTh} data-en={article.titleEn}>{article.titleTh}</a></h3>
                    <p data-th={article.summaryTh} data-en={article.summaryEn}>{article.summaryTh}</p>
                    <div className="journal-card__footer">
                      <div className="journal-card__meta">
                        <span data-th={article.dateTh} data-en={article.dateEn}>{article.dateTh}</span>
                        <span className="dot"></span>
                        <span data-th={article.readTimeTh} data-en={article.readTimeEn}>{article.readTimeTh}</span>
                      </div>
                      <a className="journal-card__link" href={`/article/${article.slug}`} data-th="อ่านต่อ →" data-en="Read More →">อ่านต่อ →</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="no-results" id="noResults" data-th="ไม่พบบทความที่ตรงกับคำค้นหา" data-en="No articles match your search.">ไม่พบบทความที่ตรงกับคำค้นหา</div>
            <nav className="article-pagination" id="articlePagination" aria-label="Article pagination"></nav>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/catalog-controls.js" strategy="afterInteractive" />
      <Script src="/js/article.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
