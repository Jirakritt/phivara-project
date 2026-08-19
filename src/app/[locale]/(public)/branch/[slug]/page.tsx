import { notFound } from 'next/navigation'
import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getBranchDetail } from '@/lib/branchesData'
import { getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const branch = await getBranchDetail(slug, locale)
  if (!branch) return {}
  // "PHIVARA " is part of the CMS branch `name` field itself now (per team
  // decision) — not concatenated here or elsewhere on this page.
  return { title: `${branch.nameEn} | PHIVARA` }
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
export const revalidate = 60

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [branch, homeData, liveLocales] = await Promise.all([
    getBranchDetail(slug, locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
  ])
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

      <SiteHeader page="contact" topbar={homeData.topbar} locale={locale} localePath={`/branch/${slug}`} liveLocales={liveLocales} />

      <main className="branch-detail-main">
        <div className="branch-detail-crumb">
          <div className="wrap">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span aria-hidden="true">/</span>
            <a href={localizedHref(locale, '/contact')}>{t('ติดต่อและสาขา', 'Locations')}</a>
            <span aria-hidden="true">/</span>
            <span>{t(branch.nameTh, branch.nameEn)}</span>
          </div>
        </div>

        <section className="branch-detail-hero">
          <div className="wrap branch-detail-layout">
            <div className="branch-detail-media">
              <img src={branch.image} alt={branch.nameTh} />
              <span className="branch-detail-number">{`LOCATION ${numStr}`}</span>
            </div>
            <div className="branch-detail-content">
              <p className="eyebrow">{`PHIVARA LOCATION ${numStr}`}</p>
              <h1>{t(branch.nameTh, branch.nameEn)}</h1>
              <p className="branch-detail-service">{t(branch.taglineTh, branch.taglineEn)}</p>
              <p className="branch-detail-description">{t(branch.descriptionTh, branch.descriptionEn)}</p>

              <div className="branch-detail-address">
                <span className="branch-detail-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>{t('ที่อยู่', 'Address')}</span>
                </span>
                <p>{t(branch.addressTh, branch.addressEn)}</p>
              </div>

              <div className="branch-detail-meta">
                <div>
                  <span className="branch-detail-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span>{t('เวลาทำการ', 'Opening Hours')}</span>
                  </span>
                  <strong>{t(branch.hoursTh, branch.hoursEn)}</strong>
                </div>
                <div>
                  <span className="branch-detail-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    <span>{t('เบอร์โทร', 'Telephone')}</span>
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
                  <span>{t('เปิดใน Google Maps', 'Open in Google Maps')}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                </a>
                <a className="branch-detail-book vip-trigger" href="#vipModalOverlay" data-branch={branch.nameTh}>{t('นัดหมายสาขานี้', 'Book This Location')}</a>
              </div>
            </div>
          </div>
        </section>

        {branch.doctors.length > 0 && (
          <section className="branch-doctors-section">
            <div className="wrap">
              <div className="branch-section-head">
                <div className="eyebrow">MEDICAL SPECIALISTS</div>
                <h2>{t('ทีมแพทย์ผู้เชี่ยวชาญประจำสาขา', 'Specialists at This Location')}</h2>
                <p>{t('การันตีด้วยวุฒิบัตรและทีมอาจารย์แพทย์ผู้เชี่ยวชาญ คอยให้คำปรึกษาและออกแบบการรักษาเฉพาะบุคคล', 'Our board-certified specialists and clinical leaders dedicated to personalized medical care.')}</p>
              </div>
              <div className="branch-doctor-grid">
                {branch.doctors.map((doc) => (
                  <div key={doc.slug} className="spec-card">
                    <div className="photo-wrap">
                      <a href={localizedHref(locale, `/doctor/${doc.slug}`)} aria-label={doc.nameTh}>
                        <img className="ph-photo" src={doc.image} alt={doc.nameTh} loading="lazy" />
                      </a>
                    </div>
                    <span className="program-branch">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                      <span className="program-branch__text">
                        <span className="program-branch__brand">PHIVARA</span>
                        <span className="program-branch__name">{t(branch.nameTh, branch.nameEn)}</span>
                      </span>
                    </span>
                    <h3><a href={localizedHref(locale, `/doctor/${doc.slug}`)}>{t(doc.nameTh, doc.nameEn)}</a></h3>
                    <p className="note">{t(doc.noteTh, doc.noteEn)}</p>
                    <div className="spec-subnote">{t(doc.subTh, doc.subEn)}</div>
                    <div className="card-actions">
                      <a href={localizedHref(locale, `/doctor/${doc.slug}`)} className="btn-doc-detail">{t('ดูประวัติแพทย์', 'View Profile')}</a>
                      <a href="#vipModalOverlay" className="go vip-trigger" data-doc-name={doc.nameTh}>{t('จองปรึกษา →', 'Book →')}</a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="branch-section-footer">
                <a href={localizedHref(locale, '/doctor')} className="branch-view-all-btn">
                  <span>{t('ดูทีมแพทย์ PHIVARA ทั้งหมด →', 'View All PHIVARA Medical Specialists →')}</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {branch.programs.length > 0 && (
          <section className="branch-programs-section">
            <div className="wrap">
              <div className="branch-section-head">
                <div className="eyebrow">FEATURED PROGRAMS</div>
                <h2>{t('โปรแกรมตรวจและหัตถการเด่นประจำสาขา', 'Signature Programs & Treatments')}</h2>
                <p>{t('รังสรรค์โปรแกรมการดูแลสุขภาพและความงามที่มีประสิทธิภาพสูงสุด ออกแบบเฉพาะสาขานี้', 'Curated health checkups and advanced treatment programs tailored for this location.')}</p>
              </div>
              <div className="branch-program-grid program-grid">
                {branch.programs.map((prg) => (
                  <article key={prg.slug} className="program-card">
                    <div className="card-visual">
                      <a href={localizedHref(locale, `/program/${prg.slug}`)} aria-label={prg.titleTh}>
                        <img src={prg.image} alt={prg.titleTh} loading="lazy" />
                      </a>
                    </div>
                    <div className="card-body">
                      <span className="program-branch">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                        <span className="program-branch__text">
                          <span className="program-branch__brand">PHIVARA</span>
                          <span className="program-branch__name">{t(branch.nameTh, branch.nameEn)}</span>
                        </span>
                      </span>
                      <span className="card-code">{prg.code}</span>
                      <h3><a className="card-title-link" href={localizedHref(locale, `/program/${prg.slug}`)}>{t(prg.titleTh, prg.titleEn)}</a></h3>
                      <p>{t(prg.shortDescriptionTh, prg.shortDescriptionEn)}</p>
                      <div className="card-foot">
                        <span>{prg.price.toLocaleString('en-US')}</span>
                        <a className="card-link" href={localizedHref(locale, `/program/${prg.slug}`)}>{t('รายละเอียด →', 'Details →')}</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="branch-section-footer">
                <a href={localizedHref(locale, '/program')} className="branch-view-all-btn">
                  <span>{t('ดูโปรแกรมตรวจทั้งหมด →', 'View All Programs →')}</span>
                </a>
              </div>
            </div>
          </section>
        )}

        {branch.facilitiesTh.length > 0 && (
          <section className="branch-facilities-section">
            <div className="wrap">
              <div className="branch-section-head">
                <div className="eyebrow">VIP FACILITIES</div>
                <h2>{t('บรรยากาศและสิ่งอำนวยความสะดวกระดับพรีเมียม', 'Premium Atmosphere & Facilities')}</h2>
                <p>{t('สัมผัสประสบการณ์การรักษาที่สะดวกสบาย เป็นส่วนตัว พร้อมอุปกรณ์และสิ่งอำนวยความสะดวกครบครัน', 'Experience confidential, hospital-grade luxury care with state-of-the-art medical amenities.')}</p>
              </div>
              <div className="facilities-grid">
                {branch.facilitiesTh.map((item, i) => (
                  <div className="facility-card" key={i}>
                    <div className="facility-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <div className="facility-text">{t(item, branch.facilitiesEn[i] || item)}</div>
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
                  <div className="eyebrow">LOCATION & ACCESS</div>
                  <h3>{t('การเดินทางและสถานที่จอดรถ', 'Directions & Parking Info')}</h3>
                  <p>{t(branch.directionsTh, branch.directionsEn)}</p>
                </div>
                <div className="directions-actions">
                  <a className="branch-detail-map" href={branch.mapUrl} target="_blank" rel="noopener noreferrer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span>{t('เปิดใน Google Maps', 'Open in Google Maps')}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="branch-detail-back">
          <div className="wrap">
            <a href={localizedHref(locale, '/contact#branchList')}>{t('← ดูสาขา PHIVARA ทั้งหมด', '← View All PHIVARA Locations')}</a>
          </div>
        </div>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
