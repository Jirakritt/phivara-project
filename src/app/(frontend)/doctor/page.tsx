import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'
import { BRANCH_FILTER_OPTIONS, getDoctorsListing, SPECIALTY_FILTER_OPTIONS } from '@/lib/doctorsData'

export const metadata = {
  title: 'PHIVARA | Medical Specialists - ทีมแพทย์ผู้เชี่ยวชาญ',
}

// Rebuilt from phivara-design-html/doctor.html. The original split its 30
// doctor cards between 12 hardcoded in the HTML and 18 injected by
// js/doctor.js from a hardcoded array — here every published doctor is
// server-rendered directly from Payload, and js/doctor.js (patched) only
// handles filtering/search/pagination on top of the real cards.
export const revalidate = 60

export default async function DoctorListPage() {
  const [doctors, homeData] = await Promise.all([getDoctorsListing(), getHomeData()])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

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

      <SiteHeader page="doctor" />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <span className="current" data-th="ทีมแพทย์ผู้เชี่ยวชาญ" data-en="Medical Specialists">ทีมแพทย์ผู้เชี่ยวชาญ</span>
          </div>
        </div>
      </div>

      {/* ================= DOCTOR HERO ================= */}
      <section className="doc-hero">
        <div className="wrap">
          <div className="doc-hero-main">
            <div className="eyebrow center" data-th="MEDICAL TEAM" data-en="MEDICAL TEAM">MEDICAL TEAM</div>
            <h1 data-th="ทีมแพทย์ผู้เชี่ยวชาญเฉพาะทาง" data-en="Our Board-Certified Medical Specialists">ทีมแพทย์ผู้เชี่ยวชาญเฉพาะทาง</h1>
            <div className="hero-gold-divider">
              <span className="line"></span>
              <span className="diamond">◆</span>
              <span className="line"></span>
            </div>
            <p
              className="lead"
              data-th="รวมทีมแพทย์เฉพาะทางและผู้เชี่ยวชาญระดับอาจารย์แพทย์ที่ยึดมั่นในหลักการแพทย์เชิงประจักษ์ ออกแบบการดูแลเฉพาะบุคคลครอบคลุม ศัลยกรรมตกแต่ง เวชศาสตร์ชะลอวัย ผิวหนัง และสุขภาวะเชิงความงาม"
              data-en="Our distinguished team of board-certified specialists and clinical leaders, dedicated to evidence-based medicine and highly personalized care across Plastic Surgery, Longevity Medicine, Dermatology, and Aesthetic Wellness."
            >
              รวมทีมแพทย์เฉพาะทางและผู้เชี่ยวชาญระดับอาจารย์แพทย์ที่ยึดมั่นในหลักการแพทย์เชิงประจักษ์
              ออกแบบการดูแลเฉพาะบุคคลครอบคลุม ศัลยกรรมตกแต่ง เวชศาสตร์ชะลอวัย ผิวหนัง และสุขภาวะเชิงความงาม
            </p>
          </div>

          <div className="doc-hero-specialties-row">
            <span className="spec-pill" data-th="ศัลยกรรมตกแต่ง" data-en="Plastic Surgery">ศัลยกรรมตกแต่ง</span>
            <span className="spec-pill" data-th="เวชศาสตร์ชะลอวัย" data-en="Anti-Aging Medicine">เวชศาสตร์ชะลอวัย</span>
            <span className="spec-pill" data-th="ผิวหนัง &amp; เลเซอร์" data-en="Dermatology &amp; Lasers">ผิวหนัง &amp; เลเซอร์</span>
            <span className="spec-pill" data-th="สุขภาวะความงาม" data-en="Aesthetic Wellness">สุขภาวะความงาม</span>
          </div>
        </div>
      </section>

      {/* ================= FILTER & SEARCH SECTION ================= */}
      <section className="catalog-filter-section">
        <div className="wrap">
          <div className="catalog-top">
            <div>
              <span className="eyebrow-green">EXPLORE SPECIALISTS</span>
              <h2 data-th="ค้นหาแพทย์เฉพาะทาง" data-en="Find a Medical Specialist">ค้นหาแพทย์เฉพาะทาง</h2>
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
                  placeholder="ค้นหารายชื่อแพทย์, ความเชี่ยวชาญ..."
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
                  <span className="btn-text" id="specialtyBtnText" data-th="ทุกสาขาความเชี่ยวชาญ" data-en="All Specialties">ทุกสาขาความเชี่ยวชาญ</span>
                  <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="custom-dropdown-menu" id="specialtyMenu">
                  <button type="button" className="dropdown-item active" data-specialty="all" data-th="ทุกสาขาความเชี่ยวชาญ" data-en="All Specialties">ทุกสาขาความเชี่ยวชาญ</button>
                  {SPECIALTY_FILTER_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" className="dropdown-item" data-specialty={opt.value} data-th={opt.th} data-en={opt.en}>
                      {opt.th}
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
                  <span className="btn-text" id="branchBtnText" data-th="ทุกสาขา PHIVARA" data-en="All Locations">ทุกสาขา PHIVARA</span>
                  <svg className="icon-arrow" viewBox="0 0 24 24" fill="none" strokeWidth={1.8}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="custom-dropdown-menu" id="branchMenu">
                  <button type="button" className="dropdown-item active" data-branch="all" data-th="ทุกสาขา PHIVARA" data-en="All Locations">ทุกสาขา PHIVARA</button>
                  {BRANCH_FILTER_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button" className="dropdown-item" data-branch={opt.value} data-th={opt.th} data-en={opt.en}>
                      {opt.th}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="catalog-results">
            <div>
              <span data-th="แสดงผลการค้นหา:" data-en="Showing:">แสดงผลการค้นหา:</span>{' '}
              <span className="catalog-count" id="docCountBadge">{doctors.length}</span>{' '}
              <span data-th="ท่าน" data-en="specialists">ท่าน</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DOCTOR GRID SECTION ================= */}
      <section className="doctor-grid-container">
        <div className="wrap">
          <div className="doctor-grid" id="doctorGrid">
            {doctors.map((doc) => (
              <div key={doc.slug} className="spec-card s-item" data-branch={doc.branchSlug} data-specialty={doc.specialty} data-doc-id={doc.slug}>
                <div className="photo-wrap">
                  <img className="ph-photo" src={doc.image} alt={doc.nameTh} />
                </div>
                <span className="program-branch">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span className="program-branch__text">
                    <span className="program-branch__brand">PHIVARA</span>
                    <span className="program-branch__name" data-th={doc.branchTh} data-en={doc.branchEn}>{doc.branchTh}</span>
                  </span>
                </span>
                <h3 data-th={doc.nameTh} data-en={doc.nameEn}>{doc.nameTh}</h3>
                <p className="note" data-th={doc.noteTh} data-en={doc.noteEn}>{doc.noteTh}</p>
                <div className="spec-subnote" data-th={doc.subTh} data-en={doc.subEn}>{doc.subTh}</div>
                <div className="card-actions">
                  <button className="btn-doc-detail" data-doc-id={doc.slug} data-th="ดูประวัติแพทย์" data-en="View Profile">ดูประวัติแพทย์</button>
                  <a href="#contact" className="go vip-trigger" data-doc-name={doc.nameTh} data-th="จองปรึกษา →" data-en="Book →">จองปรึกษา →</a>
                </div>
              </div>
            ))}
          </div>

          <div className="no-doctor-found" id="noDocFound" data-th="ไม่พบรายชื่อแพทย์ที่ตรงกับเงื่อนไขการค้นหา" data-en="No medical specialists match your search criteria.">
            ไม่พบรายชื่อแพทย์ที่ตรงกับเงื่อนไขการค้นหา
          </div>
          <nav className="doctor-pagination" id="doctorPagination" aria-label="Doctor list pagination"></nav>
        </div>
      </section>

      <SiteFooter branches={homeData.branches} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/catalog-controls.js" strategy="afterInteractive" />
      <Script src="/js/doctor.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
