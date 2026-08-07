import { notFound } from 'next/navigation'
import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'
import { getProgramDetail, PROGRAM_CATEGORY_OPTIONS } from '@/lib/programsData'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await getProgramDetail(slug)
  if (!program) return {}

  const title = program.seo.title || `PHIVARA | ${program.titleEn} — ${program.titleTh}`
  const description = program.seo.description || program.shortDescriptionEn || program.shortDescriptionTh || undefined
  const ogImage = program.seo.ogImage || program.image

  return {
    title,
    description,
    robots: program.seo.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

// Rebuilt from phivara-design-html/program_detail.html. The original was a
// single static page driven entirely by a client-side `programs` object
// keyed by `?id=pvNN` (~200 lines of inline JS building the DOM from that
// object) — every program now gets its own server-rendered route with real
// data from Payload, and the male/female checkup-table branching (pv02's
// unique layout) is a JSX conditional instead of runtime DOM surgery.
//
// The original page's local "#bookingModal" is intentionally not ported —
// public/js/vip-modal.js already intercepts every ".booking-trigger" click
// site-wide and opens the shared VIP modal, prefilled via `data-program`.
export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [program, homeData] = await Promise.all([getProgramDetail(slug), getHomeData()])
  if (!program) notFound()

  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`
  const categoryLabel = PROGRAM_CATEGORY_OPTIONS.find((c) => c.value === program.category)
  const hasGenderGroups = program.checkupItems.some((item) => item.group === 'male' || item.group === 'female')
  const maleItems = program.checkupItems.filter((item) => item.group === 'male')
  const femaleItems = program.checkupItems.filter((item) => item.group === 'female')
  const allItems = program.checkupItems.filter((item) => item.group === 'all')

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/program-detail.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-program-detail-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <img src="/assets/images/brand/emblem.png" alt="" style={{ width: 54 }} />
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>

      <SiteHeader page="program" />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <a href="/program" data-th="โปรแกรมตรวจ" data-en="Programs">โปรแกรมตรวจ</a>
            <span className="sep">/</span>
            <span className="current" data-th={program.titleTh} data-en={program.titleEn}>{program.titleTh}</span>
          </div>
        </div>
      </div>

      <main>
        <section className="program-detail-hero">
          <div className="wrap detail-hero-grid">
            <div className="detail-visual">
              <img src={program.heroImage} alt={program.titleTh} />
              <div className="visual-price-tag" aria-label={`ราคาแพ็กเกจ ${program.price.toLocaleString('en-US')} บาท`}>
                <small className="phivara-type-size-override">PACKAGE PRICE</small>
                <strong className="phivara-type-size-override">{program.price.toLocaleString('en-US')}</strong>
                <span>บาท</span>
              </div>
            </div>
            <div className="detail-copy">
              <span className="eyebrow">{program.code}</span>
              <h1 data-th={program.titleTh} data-en={program.titleEn}>{program.titleTh}</h1>
              <div className="detail-meta">
                <div>
                  <span className="meta-copy">
                    <span className="meta-label">
                      <span className="meta-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 12h4l2.2-5 4 10 2.3-5H21" /><circle cx="12" cy="12" r="10" /></svg></span>
                      <small data-th="หมวดหมู่" data-en="CATEGORY">หมวดหมู่</small>
                    </span>
                    <strong data-th={categoryLabel?.th || program.category} data-en={categoryLabel?.en || program.category}>{categoryLabel?.th || program.category}</strong>
                  </span>
                </div>
                <div>
                  <span className="meta-copy">
                    <span className="meta-label">
                      <span className="meta-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1116 0z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
                      <small data-th="สาขา" data-en="LOCATION">สาขา</small>
                    </span>
                    <strong data-th={program.branchTh} data-en={program.branchEn}>{program.branchTh}</strong>
                  </span>
                </div>
                <div>
                  <span className="meta-copy">
                    <span className="meta-label">
                      <span className="meta-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /><path d="M8 14h3M8 17h5" /></svg></span>
                      <small data-th="รับบริการได้ถึง" data-en="VALID UNTIL">รับบริการได้ถึง</small>
                    </span>
                    <strong data-th="30/12/69" data-en="30/12/26">30/12/69</strong>
                  </span>
                </div>
              </div>
              <div className="hero-actions">
                <button className="detail-btn booking-trigger" data-program={program.titleTh} data-th="นัดหมายปรึกษาโปรแกรม" data-en="Book a Consultation">นัดหมายปรึกษาโปรแกรม <span>→</span></button>
                <a href="#overview" className="detail-btn outline" data-th="ดูรายละเอียด" data-en="Explore Details">ดูรายละเอียด</a>
              </div>
            </div>
          </div>
        </section>

        <section className="detail-overview" id="overview">
          <div className="wrap overview-grid">
            <div className="overview-intro">
              <span className="section-label">PACKAGE DETAILS</span>
              <h2 data-th="รายละเอียดโปรแกรมตรวจ" data-en="Program details">รายละเอียดโปรแกรมตรวจ</h2>
            </div>
            <div className="benefit-list" id="audienceContent">
              <div className="program-description">
                <h3>เกี่ยวกับโปรแกรมตรวจ</h3>
                <p data-th={program.aboutProgramTh} data-en={program.aboutProgramEn}>{program.aboutProgramTh}</p>
              </div>
              <div className="program-card-grid">
                <article className="program-audience-card">
                  <h3>ตรวจเพื่ออะไร</h3>
                  <ul className="diamond-list">
                    {program.purposeList.map((item, i) => (
                      <li key={i} data-th={item.th} data-en={item.en}>{item.th}</li>
                    ))}
                  </ul>
                </article>
                <article className="program-audience-card">
                  <h3>เหมาะกับใคร</h3>
                  <ul className="diamond-list">
                    {program.audienceList.map((item, i) => (
                      <li key={i} data-th={item.th} data-en={item.en}>{item.th}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="detail-includes">
          <div className="wrap includes-grid">
            <div className="includes-copy">
              <span className="section-label">CHECKUP LIST</span>
              <h2 data-th="รายการตรวจ" data-en="Checkup list">รายการตรวจ</h2>
            </div>
            {hasGenderGroups ? (
              <div className="includes-list gender-checkup-list">
                <div className="gender-checkup-grid">
                  <section className="gender-checkup-group">
                    <h3>รายการตรวจสำหรับผู้ชาย</h3>
                    <table className="checkup-table"><tbody>
                      {maleItems.map((item, i) => (
                        <tr key={i}><td>
                          <span className="checkup-number">{String(i + 1).padStart(2, '0')}</span>
                          <span className="checkup-copy">
                            <span className="checkup-name" data-th={item.nameTh} data-en={item.nameEn}>{item.nameTh}</span>
                            {item.descriptionTh && <span className="checkup-description" data-th={item.descriptionTh} data-en={item.descriptionEn}>{item.descriptionTh}</span>}
                          </span>
                        </td></tr>
                      ))}
                    </tbody></table>
                  </section>
                  <section className="gender-checkup-group">
                    <h3>รายการตรวจสำหรับผู้หญิง</h3>
                    <table className="checkup-table"><tbody>
                      {femaleItems.map((item, i) => (
                        <tr key={i}><td>
                          <span className="checkup-number">{String(i + 1).padStart(2, '0')}</span>
                          <span className="checkup-copy">
                            <span className="checkup-name" data-th={item.nameTh} data-en={item.nameEn}>{item.nameTh}</span>
                            {item.descriptionTh && <span className="checkup-description" data-th={item.descriptionTh} data-en={item.descriptionEn}>{item.descriptionTh}</span>}
                          </span>
                        </td></tr>
                      ))}
                    </tbody></table>
                  </section>
                </div>
              </div>
            ) : (
              <div className="includes-list">
                <table className="checkup-table" id="checkupList">
                  <thead><tr><th scope="col" data-th="รายการตรวจ" data-en="CHECKUP ITEMS">รายการตรวจ</th></tr></thead>
                  <tbody>
                    {allItems.map((item, i) => (
                      <tr key={i}><td>
                        <span className="checkup-number">{String(i + 1).padStart(2, '0')}</span>
                        <span className="checkup-name" data-th={item.nameTh} data-en={item.nameEn}>{item.nameTh}</span>
                      </td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="detail-process">
          <div className="wrap">
            <div className="process-heading">
              <span className="section-label">TERMS OF SERVICE</span>
              <h2 data-th="เงื่อนไขการเข้ารับบริการ" data-en="Terms of service">เงื่อนไขการเข้ารับบริการ</h2>
            </div>
            <div className={`process-grid${hasGenderGroups ? ' hormone-terms' : ''}`} id="termsGrid">
              {program.termsOfService.map((term, i) => (
                <article key={i} className="process-step">
                  <b>{i + 1}</b>
                  <div>
                    {term.titleTh && <h3 data-th={term.titleTh} data-en={term.titleEn}>{term.titleTh}</h3>}
                    <p data-th={term.descriptionTh} data-en={term.descriptionEn}>{term.descriptionTh}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="wrap">
            <div className="contact-card">
              <div>
                <span className="section-label">CONTACT</span>
                <h2 data-th="ติดต่อรับบริการ" data-en="Service contact">ติดต่อรับบริการ</h2>
              </div>
              <div className="contact-list">
                <div className="contact-item">
                  <span className="contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
                  <div>
                    <small data-th="สถานที่" data-en="LOCATION">สถานที่</small>
                    <strong data-th={program.contactLocationTh || 'PHIVARA Aesthetic & Longevity Center ทุกสาขา'} data-en={program.contactLocationEn || 'All PHIVARA Aesthetic & Longevity Center locations'}>
                      {program.contactLocationTh || 'PHIVARA Aesthetic & Longevity Center ทุกสาขา'}
                    </strong>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>
                  <div>
                    <small data-th="เวลาทำการ" data-en="OPENING HOURS">เวลาทำการ</small>
                    <strong data-th={program.contactHoursTh || 'ทุกวัน เวลา 09:00–20:00 น. (กรุณานัดหมายล่วงหน้า)'} data-en={program.contactHoursEn || 'Daily, 9:00 AM–8:00 PM (advance booking recommended)'}>
                      {program.contactHoursTh || 'ทุกวัน เวลา 09:00–20:00 น. (กรุณานัดหมายล่วงหน้า)'}
                    </strong>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 3.5 10 8 7.8 9.8a14.5 14.5 0 0 0 6.4 6.4L16 14l4.5 2.5v3A1.5 1.5 0 0 1 19 21C10.2 21 3 13.8 3 5a1.5 1.5 0 0 1 1.5-1.5h3Z" /></svg></span>
                  <div>
                    <small data-th="โทร" data-en="PHONE">โทร</small>
                    <strong>{program.contactPhone ? <a href={`tel:${program.contactPhone.replace(/[^0-9]/g, '')}`}>{program.contactPhone}</a> : <a href="tel:02XXXXXXX">02-XXX-XXXX</a>} · LINE: @phivara</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
