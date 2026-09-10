import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getDoctorDisplayBackgrounds, getDoctorGroupingSettings, getDoctorsListing, groupDoctorsByName } from '@/lib/doctorsData'
import { getExpertiseCategoryOptions, getHomeData } from '@/lib/homeData'
import { canonicalUrl, DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const title = t('PHIVARA | ทีมแพทย์ผู้เชี่ยวชาญ', 'PHIVARA | Medical Specialists')
  const canonical = canonicalUrl(locale, '/doctor')
  return {
    title,
    alternates: { canonical },
    openGraph: {
      title,
      type: 'website',
      url: canonical,
      images: [{ url: '/logo/phivara_logo.jpg', width: 1200, height: 630 }],
    },
  }
}

// Rebuilt from phivara-design-html/doctor.html. The original split its 30
// doctor cards between 12 hardcoded in the HTML and 18 injected by
// js/doctor.js from a hardcoded array — here every published doctor is
// server-rendered directly from Payload, and js/doctor.js (patched) only
// handles filtering/search/pagination on top of the real cards.
export const revalidate = 60

export default async function DoctorListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [doctors, homeData, liveLocales, displayBackgrounds, groupingSettings] = await Promise.all([
    getDoctorsListing(locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
    getDoctorDisplayBackgrounds(),
    getDoctorGroupingSettings(),
  ])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches, categories: getExpertiseCategoryOptions(homeData.hero) }).replace(/</g, '\\u003c')};`
  const searchPlaceholder = t('ค้นหารายชื่อแพทย์, ความเชี่ยวชาญ...', 'Search doctor, specialty...')
  // Same 4 categories + order as the homepage "INTEGRATED EXPERTISE" tabs
  // — see homeData.ts's getExpertiseCategoryOptions comment. Drives both
  // the hero specialty pills and the "All Specialties" dropdown below.
  const categoryOptions = getExpertiseCategoryOptions(homeData.hero)
  // Same doctor, same name, filed as a separate published record per branch
  // (see groupDoctorsByName()'s comment in doctorsData.ts) — merged here so
  // this one listing doesn't show the same face+name once per branch.
  // Whether merging happens at all, and which visual style the merged
  // card's branch label uses, are both admin-only CMS settings (see
  // getDoctorGroupingSettings()) — groupDoctorsByName() itself falls back
  // to one branch per group when groupByBranch is off.
  const groupedDoctors = groupDoctorsByName(doctors, groupingSettings.groupByBranch)

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/catalog.css" />
      <link rel="stylesheet" href="/css/doctor.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-doctor-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <SiteHeader page="doctor" topbar={homeData.topbar} locale={locale} localePath="/doctor" liveLocales={liveLocales} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <span className="current">{t('ทีมแพทย์ผู้เชี่ยวชาญ', 'Medical Specialists')}</span>
          </div>
        </div>
      </div>

      {/* ================= DOCTOR HERO ================= */}
      <section className="doc-hero">
        <div className="wrap">
          <div className="doc-hero-main">
            <div className="eyebrow center">MEDICAL TEAM</div>
            <h1>{t('ทีมแพทย์เฉพาะทาง', 'Our Specialist Medical Team')}</h1>
            <div className="hero-gold-divider">
              <span className="line"></span>
              <span className="diamond">◆</span>
              <span className="line"></span>
            </div>
            <p className="lead">
              {t(
                'รวมทีมแพทย์เฉพาะทางจากหลากหลายสาขาการดูแล เพื่อร่วมวางแผนการดูแลที่สอดคล้องกับความต้องการและลักษณะเฉพาะของแต่ละบุคคล',
                'Bringing together specialists across a range of disciplines to help plan care tailored to your individual needs and characteristics.',
              )}
            </p>
          </div>

          <div className="doc-hero-specialties-row">
            {categoryOptions.map((opt) => (
              <span key={opt.value} className="spec-pill">{t(opt.labelTh, opt.labelEn)}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FILTER & SEARCH SECTION ================= */}
      <section className="catalog-filter-section">
        <div className="wrap">
          <div className="catalog-top">
            <div>
              <span className="eyebrow-green">EXPLORE SPECIALISTS</span>
              <h2>{t('ค้นหาแพทย์เฉพาะทาง', 'Find a Medical Specialist')}</h2>
            </div>
          </div>
          <div className="catalog-filter-card">
            <div className="catalog-filter-row">
              <div className="catalog-search">
                <svg className="catalog-search__icon" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  id="docSearchInput"
                  placeholder={searchPlaceholder}
                  data-th-placeholder="ค้นหารายชื่อแพทย์, ความเชี่ยวชาญ..."
                  data-en-placeholder="Search doctor, specialty..."
                />
                <button type="button" className="catalog-search__clear" id="searchClearBtn" aria-label="Clear Search">&times;</button>
              </div>

              <div className="custom-select-box catalog-filter-select" id="specialtySelectBox">
                <button type="button" className="custom-select-btn" id="specialtyBtn">
                  <svg className="icon-spec" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  <span className="btn-text" id="specialtyBtnText">{t('ทุกสาขาความเชี่ยวชาญ', 'All Specialties')}</span>
                  <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="custom-dropdown-menu" id="specialtyMenu">
                  <button type="button" className="dropdown-item active" data-specialty="all">{t('ทุกสาขาความเชี่ยวชาญ', 'All Specialties')}</button>
                  {categoryOptions.map((opt) => (
                    <button key={opt.value} type="button" className="dropdown-item" data-specialty={opt.value}>
                      {t(opt.labelTh, opt.labelEn)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-select-box catalog-filter-select" id="branchSelectBox">
                <button type="button" className="custom-select-btn" id="branchBtn">
                  <svg className="icon-loc" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="btn-text" id="branchBtnText">{t('ทุกสาขา PHIVARA', 'All Locations')}</span>
                  <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="custom-dropdown-menu" id="branchMenu">
                  <button type="button" className="dropdown-item active" data-branch="all">{t('ทุกสาขา PHIVARA', 'All Locations')}</button>
                  {/* Sourced from homeData.branches (same CMS-backed list used by
                      SiteFooter below) — previously a hardcoded BRANCH_FILTER_OPTIONS
                      list that went stale against the CMS, same bug as on the
                      Programs page. Per team decision, the "PHIVARA " brand prefix is
                      now part of the CMS `name` field itself (edited directly in
                      /admin), not concatenated in code — keep it that way here and
                      in SiteFooter. */}
                  {homeData.branches.map((branch) => (
                    <button key={branch.formValue} type="button" className="dropdown-item" data-branch={branch.formValue}>
                      {t(branch.nameTh, branch.nameEn)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="catalog-results">
            <div>
              <span>{t('แสดงผลการค้นหา:', 'Showing:')}</span>{' '}
              <span className="catalog-count" id="docCountBadge">{doctors.length}</span>{' '}
              <span>{t('ท่าน', 'specialists')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DOCTOR GRID SECTION ================= */}
      <section className="doctor-grid-container">
        <div className="wrap">
          <div className="doctor-grid" id="doctorGrid">
            {groupedDoctors.map((doc) => {
              // Branch label(s) — extracted so the SAME markup can render in
              // either of 2 positions per the CMS admin setting
              // (DoctorDisplaySettings.branchLabelPosition, 2026-09-10):
              // 'top' (under the photo, default/current) or 'bottom' (just
              // above the "ดูประวัติแพทย์" button). Applies to every card,
              // single- or multi-branch alike.
              const branchLabel =
                doc.branches.length > 1 ? (
                  groupingSettings.multiBranchLabelStyle === 'pills' ? (
                    // Style A (CMS admin setting) — compact rounded badges.
                    <div className="program-branch-multi">
                      {doc.branches.map((b) => (
                        <span className="pill" key={b.slug}>
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          {t(b.th, b.en)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    // Style B (CMS admin setting, default) — each branch in
                    // the SAME icon+"PHIVARA"+name style as the
                    // single-branch label below, stacked one per line.
                    <div className="program-branch-list">
                      {doc.branches.map((b) => (
                        <span className="program-branch" key={b.slug}>
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          <span className="program-branch__text">
                            <span className="program-branch__brand">PHIVARA</span>
                            <span className="program-branch__name">{t(b.th, b.en)}</span>
                          </span>
                        </span>
                      ))}
                    </div>
                  )
                ) : (
                  <span className="program-branch">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span className="program-branch__text">
                      <span className="program-branch__brand">PHIVARA</span>
                      <span className="program-branch__name">{t(doc.branchTh, doc.branchEn)}</span>
                    </span>
                  </span>
                )
              const branchLabelAtTop = groupingSettings.branchLabelPosition !== 'bottom'
              return (
              <div
                key={doc.slug}
                className={`spec-card s-item${doc.branches.length > 1 ? ' merged-card' : ''}`}
                data-branch={doc.branches.map((b) => b.slug).join(',')}
                data-specialty={doc.specialty}
                data-doc-id={doc.slug}
              >
                <div
                  className="photo-wrap"
                  style={displayBackgrounds.profileBackground ? { backgroundImage: `url('${displayBackgrounds.profileBackground}')` } : undefined}
                >
                  <img className="ph-photo" src={doc.image} alt={doc.nameTh} />
                </div>
                {branchLabelAtTop && branchLabel}
                <h3>{t(doc.nameTh, doc.nameEn)}</h3>
                <p className="note">{t(doc.noteTh, doc.noteEn)}</p>
                <div className="spec-subnote">{t(doc.subTh, doc.subEn)}</div>
                {!branchLabelAtTop && branchLabel}
                <div className="card-actions">
                  {doc.branches.length > 1 ? (
                    // A branch record's own profile content (bio/credentials/
                    // schedule) can genuinely differ per branch (reported
                    // 2026-09-10), so a single "ดูประวัติแพทย์" can't just
                    // link to one arbitrary branch — this expands the card
                    // in place (see .doctor-profile-expand in doctor.css and
                    // the matching click handler in doctor.js) to let the
                    // visitor pick which branch's profile to open. Same
                    // size/position as the single-branch button below, just
                    // with a chevron indicating it expands instead of
                    // navigating directly.
                    <button
                      type="button"
                      className="btn-doc-detail btn-expand-profiles"
                      data-expand-target={`profile-expand-${doc.slug}`}
                      aria-expanded="false"
                    >
                      <span>{t('ดูประวัติแพทย์', 'View Profile')}</span>
                      <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  ) : (
                    <button className="btn-doc-detail" data-doc-id={doc.slug}>{t('ดูประวัติแพทย์', 'View Profile')}</button>
                  )}
                  {/* data-lock-branches (comma-separated) restricts the VIP
                      modal's branch dropdown to only the branch(es) THIS
                      doctor actually practices at — a single soft
                      pre-select (the old data-branch) still let a customer
                      pick a branch the doctor never works at, causing bad
                      leads (reported 2026-09-10). Covers both single- and
                      multi-branch doctors since doc.branches always has at
                      least 1 entry. See vip-modal.js's openModal(). */}
                  <a
                    href="#contact"
                    className="go vip-trigger"
                    data-doc-name={doc.nameTh}
                    data-lock-branches={doc.branches.map((b) => b.slug).join(',')}
                  >
                    {t('จองปรึกษา →', 'Book →')}
                  </a>
                </div>
                {doc.branches.length > 1 && (
                  <div className="doctor-profile-expand" id={`profile-expand-${doc.slug}`}>
                    {doc.branches.map((b) => (
                      <button key={b.slug} type="button" className="btn-doc-detail branch-profile-pill" data-doc-id={b.recordSlug}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                        <span>PHIVARA {t(b.th, b.en)}</span>
                        <svg className="chevron-right" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              )
            })}
          </div>

          <div className="no-doctor-found" id="noDocFound">
            {t('ไม่พบรายชื่อแพทย์ที่ตรงกับเงื่อนไขการค้นหา', 'No medical specialists match your search criteria.')}
          </div>
          <nav className="doctor-pagination" id="doctorPagination" aria-label="Doctor list pagination"></nav>
        </div>
      </section>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/catalog-controls.js" strategy="afterInteractive" />
      <Script src="/js/doctor.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
