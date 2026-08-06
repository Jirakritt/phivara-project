import { notFound } from 'next/navigation'
import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getBranchDetail } from '@/lib/branchesData'
import { getHomeData } from '@/lib/homeData'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const branch = await getBranchDetail(slug)
  if (!branch) return {}
  return { title: `PHIVARA ${branch.nameEn} | PHIVARA` }
}

// Rebuilt from phivara-design-html/branch-*.html (5 nearly-identical pages)
// + js/branch-detail.js. The original hardcoded a completely separate,
// fictional per-branch roster of doctors/programs/articles inside
// branch-detail.js (different names and program codes than the real
// Doctors/Programs collections) — that data is NOT reproduced here.
// Instead, doctors and programs are the real ones already linked to this
// branch via their own `branch` field, filtered from the same listings used
// on /doctor and /program.
//
// Also intentionally dropped vs. the original:
// - The "Innovation & Clinical Knowledge" per-branch articles section — no
//   branch/article relationship exists in the Articles schema, and the
//   original's 3 articles per branch (15 total) were entirely fictional
//   mockup content, never linked to the real Articles collection.
// - Sanampao's one-off photo gallery section (present on only 1 of 5 branch
//   pages in the source site) — standardized on the facilities-checklist
//   layout used by the other 4 branches so all 5 pages are consistent.
// - The "featured lead doctor" hero treatment (motivational quote,
//   "Expertise"/"Specialty" labeled facts) — that copy was hardcoded per
//   branch in branch-detail.js and has no home in the Doctor schema, so all
//   of a branch's doctors render uniformly as the same spec-card used on
//   /doctor instead.
export default async function BranchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [branch, homeData] = await Promise.all([getBranchDetail(slug), getHomeData()])
  if (!branch) notFound()

  const branchIndex = homeData.branches.findIndex((b) => b.formValue === slug)
  const numStr = String(branchIndex >= 0 ? branchIndex + 1 : 1).padStart(2, '0')
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/catalog.css" />
      <link rel="stylesheet" href="/css/doctor.css" />
      <link rel="stylesheet" href="/css/branch-detail.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-branch-detail-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>

      <SiteHeader page="contact" />

      <main className="branch-detail-main">
        <div className="branch-detail-crumb">
          <div className="wrap">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span aria-hidden="true">/</span>
            <a href="/contact" data-th="ติดต่อและสาขา" data-en="Locations">ติดต่อและสาขา</a>
            <span aria-hidden="true">/</span>
            <span data-th={`PHIVARA ${branch.nameTh}`} data-en={`PHIVARA ${branch.nameEn}`}>{`PHIVARA ${branch.nameTh}`}</span>
          </div>
        </div>

        <section className="branch-detail-hero">
          <div className="wrap branch-detail-layout">
            <div className="branch-detail-media">
              <img src={branch.image} alt={`PHIVARA ${branch.nameTh}`} />
              <span className="branch-detail-number">{`LOCATION ${numStr}`}</span>
            </div>
            <div className="branch-detail-content">
              <p className="eyebrow" data-th={`PHIVARA LOCATION ${numStr}`} data-en={`PHIVARA LOCATION ${numStr}`}>{`PHIVARA LOCATION ${numStr}`}</p>
              <h1 data-th={`PHIVARA ${branch.nameTh}`} data-en={`PHIVARA ${branch.nameEn}`}>{`PHIVARA ${branch.nameTh}`}</h1>
              <p className="branch-detail-service" data-th={branch.taglineTh} data-en={branch.taglineEn}>{branch.taglineTh}</p>
              <p className="branch-detail-description" data-th={branch.descriptionTh} data-en={branch.descriptionEn}>{branch.descriptionTh}</p>

              <div className="branch-detail-address">
                <span className="branch-detail-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span data-th="ที่อยู่" data-en="Address">ที่อยู่</span>
                </span>
                <p data-th={branch.addressTh} data-en={branch.addressEn}>{branch.addressTh}</p>
              </div>

              <div className="branch-detail-meta">
                <div>
                  <span className="branch-detail-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span data-th="เวลาทำการ" data-en="Opening Hours">เวลาทำการ</span>
                  </span>
                  <strong data-th={branch.hoursTh} data-en={branch.hoursEn}>{branch.hoursTh}</strong>
                </div>
                <div>
                  <span className="branch-detail-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    <span data-th="เบอร์โทร" data-en="Telephone">เบอร์โทร</span>
                  </span>
                  <strong>{branch.phone}</strong>
                </div>
                <div>
                  <span className="branch-detail-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    <span>LINE</span>
                  </span>
                  <strong>{branch.lineId}</strong>
                </div>
              </div>

              <div className="branch-detail-actions">
                <a className="branch-detail-map" href={branch.mapUrl} target="_blank" rel="noopener noreferrer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span data-th="เปิดใน Google Maps" data-en="Open in Google Maps">เปิดใน Google Maps</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                </a>
                <a className="branch-detail-book vip-trigger" href="#vipModalOverlay" data-branch={branch.nameTh} data-th="นัดหมายสาขานี้" data-en="Book This Location">นัดหมายสาขานี้</a>
              </div>
            </div>
          </div>
        </section>

        {branch.doctors.length > 0 && (
          <section className="branch-doctors-section">
            <div className="wrap">
              <div className="branch-section-head">
                <div className="eyebrow" data-th="MEDICAL SPECIALISTS" data-en="MEDICAL SPECIALISTS">MEDICAL SPECIALISTS</div>
                <h2 data-th="ทีมแพทย์ผู้เชี่ยวชาญประจำสาขา" data-en="Specialists at This Location">ทีมแพทย์ผู้เชี่ยวชาญประจำสาขา</h2>
                <p data-th="การันตีด้วยวุฒิบัตรและทีมอาจารย์แพทย์ผู้เชี่ยวชาญ คอยให้คำปรึกษาและออกแบบการรักษาเฉพาะบุคคล" data-en="Our board-certified specialists and clinical leaders dedicated to personalized medical care.">การันตีด้วยวุฒิบัตรและทีมอาจารย์แพทย์ผู้เชี่ยวชาญ คอยให้คำปรึกษาและออกแบบการรักษาเฉพาะบุคคล</p>
              </div>
              <div className="branch-doctor-grid">
                {branch.doctors.map((doc) => (
                  <div key={doc.slug} className="spec-card">
                    <div className="photo-wrap">
                      <a href={`/doctor/${doc.slug}`} aria-label={doc.nameTh}>
                        <img className="ph-photo" src={doc.image} alt={doc.nameTh} loading="lazy" />
                      </a>
                    </div>
                    <span className="program-branch">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                      <span className="program-branch__text">
                        <span className="program-branch__brand">PHIVARA</span>
                        <span className="program-branch__name" data-th={branch.nameTh} data-en={branch.nameEn}>{branch.nameTh}</span>
                      </span>
                    </span>
                    <h3><a href={`/doctor/${doc.slug}`} data-th={doc.nameTh} data-en={doc.nameEn}>{doc.nameTh}</a></h3>
                    <p className="note" data-th={doc.noteTh} data-en={doc.noteEn}>{doc.noteTh}</p>
                    <div className="spec-subnote" data-th={doc.subTh} data-en={doc.subEn}>{doc.subTh}</div>
                    <div className="card-actions">
                      <a href={`/doctor/${doc.slug}`} className="btn-doc-detail" data-th="ดูประวัติแพทย์" data-en="View Profile">ดูประวัติแพทย์</a>
                      <a href="#vipModalOverlay" className="go vip-trigger" data-doc-name={doc.nameTh} data-th="จองปรึกษา →" data-en="Book →">จองปรึกษา →</a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="branch-section-footer">
                <a href="/doctor" className="branch-view-all-btn">
                  <span data-th="ดูทีมแพทย์ PHIVARA ทั้งหมด →" data-en="View All PHIVARA Medical Specialists →">ดูทีมแพทย์ PHIVARA ทั้งหมด →</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {branch.programs.length > 0 && (
          <section className="branch-programs-section">
            <div className="wrap">
              <div className="branch-section-head">
                <div className="eyebrow" data-th="FEATURED PROGRAMS" data-en="FEATURED PROGRAMS">FEATURED PROGRAMS</div>
                <h2 data-th="โปรแกรมตรวจและหัตถการเด่นประจำสาขา" data-en="Signature Programs &amp; Treatments">โปรแกรมตรวจและหัตถการเด่นประจำสาขา</h2>
                <p data-th="รังสรรค์โปรแกรมการดูแลสุขภาพและความงามที่มีประสิทธิภาพสูงสุด ออกแบบเฉพาะสาขานี้" data-en="Curated health checkups and advanced treatment programs tailored for this location.">รังสรรค์โปรแกรมการดูแลสุขภาพและความงามที่มีประสิทธิภาพสูงสุด ออกแบบเฉพาะสาขานี้</p>
              </div>
              <div className="branch-program-grid program-grid">
                {branch.programs.map((prg) => (
                  <article key={prg.slug} className="program-card">
                    <div className="card-visual">
                      <a href={`/program/${prg.slug}`} aria-label={prg.titleTh}>
                        <img src={prg.image} alt={prg.titleTh} loading="lazy" />
                      </a>
                    </div>
                    <div className="card-body">
                      <span className="program-branch">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                        <span className="program-branch__text">
                          <span className="program-branch__brand">PHIVARA</span>
                          <span className="program-branch__name" data-th={branch.nameTh} data-en={branch.nameEn}>{branch.nameTh}</span>
                        </span>
                      </span>
                      <span className="card-code">{prg.code}</span>
                      <h3><a className="card-title-link" href={`/program/${prg.slug}`} data-th={prg.titleTh} data-en={prg.titleEn}>{prg.titleTh}</a></h3>
                      <p data-th={prg.shortDescriptionTh} data-en={prg.shortDescriptionEn}>{prg.shortDescriptionTh}</p>
                      <div className="card-foot">
                        <span>{prg.price.toLocaleString('en-US')}</span>
                        <a className="card-link" href={`/program/${prg.slug}`} data-th="รายละเอียด →" data-en="Details →">รายละเอียด →</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="branch-section-footer">
                <a href="/program" className="branch-view-all-btn">
                  <span data-th="ดูโปรแกรมตรวจทั้งหมด →" data-en="View All Programs →">ดูโปรแกรมตรวจทั้งหมด →</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {branch.facilitiesTh.length > 0 && (
          <section className="branch-facilities-section">
            <div className="wrap">
              <div className="branch-section-head">
                <div className="eyebrow" data-th="VIP FACILITIES" data-en="VIP FACILITIES">VIP FACILITIES</div>
                <h2 data-th="บรรยากาศและสิ่งอำนวยความสะดวกระดับพรีเมียม" data-en="Premium Atmosphere &amp; Facilities">บรรยากาศและสิ่งอำนวยความสะดวกระดับพรีเมียม</h2>
                <p data-th="สัมผัสประสบการณ์การรักษาที่สะดวกสบาย เป็นส่วนตัว พร้อมอุปกรณ์และสิ่งอำนวยความสะดวกครบครัน" data-en="Experience confidential, hospital-grade luxury care with state-of-the-art medical amenities.">สัมผัสประสบการณ์การรักษาที่สะดวกสบาย เป็นส่วนตัว พร้อมอุปกรณ์และสิ่งอำนวยความสะดวกครบครัน</p>
              </div>
              <div className="facilities-grid">
                {branch.facilitiesTh.map((item, i) => (
                  <div className="facility-card" key={i}>
                    <div className="facility-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div className="facility-text" data-th={item} data-en={branch.facilitiesEn[i] || item}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {branch.directionsTh && (
          <section className="branch-directions-section">
            <div className="wrap">
              <div className="directions-card">
                <div className="directions-info">
                  <div className="eyebrow" data-th="LOCATION &amp; ACCESS" data-en="LOCATION &amp; ACCESS">LOCATION &amp; ACCESS</div>
                  <h3 data-th="การเดินทางและสถานที่จอดรถ" data-en="Directions &amp; Parking Info">การเดินทางและสถานที่จอดรถ</h3>
                  <p data-th={branch.directionsTh} data-en={branch.directionsEn}>{branch.directionsTh}</p>
                </div>
                <div className="directions-actions">
                  <a className="branch-detail-map" href={branch.mapUrl} target="_blank" rel="noopener noreferrer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span data-th="เปิดใน Google Maps" data-en="Open in Google Maps">เปิดใน Google Maps</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="branch-detail-back">
          <div className="wrap">
            <a href="/contact#branchList" data-th="← ดูสาขา PHIVARA ทั้งหมด" data-en="← View All PHIVARA Locations">← ดูสาขา PHIVARA ทั้งหมด</a>
          </div>
        </div>
      </main>

      <SiteFooter branches={homeData.branches} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
