import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getBranchesListing } from '@/lib/branchesData'
import { getHomeData } from '@/lib/homeData'

export const metadata = {
  title: 'PHIVARA | ติดต่อทั้ง 5 สาขา',
  description: 'ข้อมูลติดต่อและรายละเอียด PHIVARA ทั้ง 5 สาขา',
}

// Rebuilt from phivara-design-html/contact.html + js/contact.js. The
// original built the branch grid client-side from the shared
// `PhivaraSiteShell.branches` array; every branch card is now
// server-rendered directly from Payload.
export const revalidate = 60

export default async function ContactPage() {
  const [branches, homeData] = await Promise.all([getBranchesListing(), getHomeData()])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/contact.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-contact-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <SiteHeader page="contact" />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <span className="current" data-th="ติดต่อเรา ทั้ง 5 สาขา" data-en="PHIVARA Locations">ติดต่อเรา ทั้ง 5 สาขา</span>
          </div>
        </div>
      </div>

      <main>
        <section className="contact-hero">
          <div className="wrap">
            <div className="doc-hero-main">
              <div className="eyebrow center" data-th="PHIVARA LOCATIONS" data-en="PHIVARA LOCATIONS">PHIVARA LOCATIONS</div>
              <h1 data-th="พบเราได้ที่ PHIVARA ทั้ง 5 สาขา" data-en="Visit PHIVARA at 5 Locations">พบเราได้ที่ PHIVARA ทั้ง 5 สาขา</h1>
              <div className="hero-gold-divider">
                <span className="line"></span>
                <span className="diamond">◆</span>
                <span className="line"></span>
              </div>
              <p className="lead" data-th="เลือกสาขาที่ใกล้คุณ พร้อมดูข้อมูลการเดินทาง เวลาเปิดให้บริการ และบริการเด่นของแต่ละสาขา" data-en="Find your nearest location, with directions, opening hours, and each center&rsquo;s signature services.">
                เลือกสาขาที่ใกล้คุณ พร้อมดูข้อมูลการเดินทาง เวลาเปิดให้บริการ และบริการเด่นของแต่ละสาขา
              </p>
            </div>

            <div className="doc-hero-specialties-row contact-hero-location-pills">
              {branches.map((b) => (
                <a key={b.slug} href="#branchList" className="spec-pill" data-th={b.nameTh} data-en={b.nameEn}>{b.nameTh}</a>
              ))}
            </div>
          </div>
        </section>

        <section className="branch-section" id="branchList">
          <div className="wrap">
            <div className="branch-grid stagger in">
              {branches.map((branch, index) => {
                const numStr = String(index + 1).padStart(2, '0')
                return (
                  <article key={branch.slug} className="branch-card">
                    <div className="branch-card__media">
                      <img src={branch.image} alt={`PHIVARA ${branch.nameEn}`} loading="lazy" decoding="async" />
                      <span className="branch-card__number">{`LOCATION ${numStr}`}</span>
                    </div>
                    <div className="branch-card__body">
                      <p className="eyebrow">{`PHIVARA LOCATION ${numStr}`}</p>
                      <h3 data-th={`PHIVARA ${branch.nameTh}`} data-en={`PHIVARA ${branch.nameEn}`}>{`PHIVARA ${branch.nameTh}`}</h3>
                      <p className="branch-card__service" data-th={branch.taglineTh} data-en={branch.taglineEn}>{branch.taglineTh}</p>
                      <p className="branch-card__description" data-th={branch.descriptionTh} data-en={branch.descriptionEn}>{branch.descriptionTh}</p>
                      <div className="branch-card__address">
                        <span className="branch-card__label">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                          <span data-th="ที่อยู่" data-en="Address">ที่อยู่</span>
                        </span>
                        <p data-th={branch.addressTh} data-en={branch.addressEn}>{branch.addressTh}</p>
                      </div>
                      <div className="branch-card__meta">
                        <div>
                          <span className="branch-card__label">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span data-th="เวลาทำการ" data-en="Opening Hours">เวลาทำการ</span>
                          </span>
                          <strong data-th={branch.hoursTh} data-en={branch.hoursEn}>{branch.hoursTh}</strong>
                        </div>
                        <div>
                          <span className="branch-card__label">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <span data-th="เบอร์โทร" data-en="Telephone">เบอร์โทร</span>
                          </span>
                          <strong>{branch.phone}</strong>
                        </div>
                        <div>
                          <span className="branch-card__label">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            <span>LINE</span>
                          </span>
                          <strong>{branch.lineId}</strong>
                        </div>
                      </div>
                      <div className="branch-card__actions">
                        <a className="branch-map-link" href={branch.mapUrl} target="_blank" rel="noopener noreferrer">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                          <span data-th="เปิดใน Google Maps" data-en="Open in Google Maps">เปิดใน Google Maps</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                        </a>
                        <a className="branch-detail-trigger" href={`/branch/${branch.slug}`}>
                          <span data-th="ดูรายละเอียดสาขาเพิ่มเติม →" data-en="View Branch Details →">ดูรายละเอียดสาขาเพิ่มเติม →</span>
                        </a>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="contact-concierge">
          <div className="wrap">
            <div className="concierge-card">
              <div>
                <p className="eyebrow eyebrow--light">PHIVARA VIP CONCIERGE</p>
                <h2 data-th="ยังไม่แน่ใจว่าสาขาไหนเหมาะกับคุณ?" data-en="Not Sure Which Center Is Right for You?">ยังไม่แน่ใจว่าสาขาไหนเหมาะกับคุณ?</h2>
                <p data-th="บอกความต้องการของคุณให้ทีม Concierge ช่วยแนะนำสาขา แพทย์ และช่วงเวลาที่เหมาะสม" data-en="Tell our Concierge what you need, and we&rsquo;ll recommend the right location, specialist, and appointment time.">
                  บอกความต้องการของคุณให้ทีม Concierge ช่วยแนะนำสาขา แพทย์ และช่วงเวลาที่เหมาะสม
                </p>
              </div>
              <a className="concierge-card__button vip-trigger" href="#vipModalOverlay" data-th="ให้ทีมงานติดต่อกลับ" data-en="Request a Callback">ให้ทีมงานติดต่อกลับ</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
