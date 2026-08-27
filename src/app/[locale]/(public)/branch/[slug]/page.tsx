import { notFound } from 'next/navigation'
import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getBranchDetail } from '@/lib/branchesData'
import type { BranchDetail } from '@/lib/branchesData'
import { getDoctorDisplayBackgrounds } from '@/lib/doctorsData'
import { getExpertiseCategoryOptions, getHomeData } from '@/lib/homeData'
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
//
// The "featured lead doctor" hero treatment (motivational quote,
// "ความชำนาญ"/"ความชำนาญพิเศษเฉพาะทาง" facts, checklist highlights) WAS
// dropped for the same reason above for a while — it had no home in the
// Doctor schema. It's now restored via cms/collections/Doctors.ts's
// "แพทย์หลักประจำสาขา" tab (isBranchFeatured/quote/featuredHighlights).
// A branch with 0 doctors checked renders exactly as before (plain grid
// only). 1 doctor checked renders a single static card
// (renderFeaturedDoctorCard below). >1 renders a one-at-a-time slide
// (public/js/branch-doctor-featured-slider.js, modeled on the Awards
// carousel in main.js/main.css — reuses its .award-nav/.award-viewport/
// .award-track/.award-dots classes). Featured doctors are excluded from
// the plain grid below (see branchesData.ts's getBranchDetail) so nobody
// appears twice.
export const revalidate = 60

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [branch, homeData, liveLocales, displayBackgrounds] = await Promise.all([
    getBranchDetail(slug, locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
    getDoctorDisplayBackgrounds(),
  ])
  if (!branch) notFound()

  const branchIndex = homeData.branches.findIndex((b) => b.formValue === slug)
  const numStr = String(branchIndex >= 0 ? branchIndex + 1 : 1).padStart(2, '0')
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches, categories: getExpertiseCategoryOptions(homeData.hero) }).replace(/</g, '\\u003c')};`

  // Markup mirrors the original hardcoded card in public/js/branch-detail.js
  // (lines ~790-863) 1:1, reusing the same (already-loaded, previously
  // unused) branch-detail.css classes — see the file comment above.
  //
  // The card background used to BE doc.featuredImage directly. Now that
  // Doctors.ts's featuredPhoto is a transparent PNG cutout (see that
  // field's comment), the card's background-image is the shared
  // "featuredBackground" room shot from Doctor Display Settings instead,
  // and the cutout renders as its own <img> floating on top
  // (.branch-doctor-featured__photo) — see branch-detail.css for the
  // desktop (left-aligned, full height) vs mobile (centered, shrunk into
  // the shorter top strip) positioning.
  function renderFeaturedDoctorCard(doc: BranchDetail['featuredDoctors'][number]) {
    return (
      <div
        className="branch-doctor-featured"
        style={displayBackgrounds.featuredBackground ? { backgroundImage: `url('${displayBackgrounds.featuredBackground}')` } : undefined}
      >
        {doc.featuredImage && (
          <img className="branch-doctor-featured__photo" src={doc.featuredImage} alt={doc.nameTh} />
        )}
        <div className="branch-doctor-featured__body">
          <div className="branch-doctor-featured__header">
            <h3 className="branch-doctor-featured__name">{t(doc.nameTh, doc.nameEn)}</h3>
            {(doc.subTh || doc.subEn) && (
              <div className="branch-doctor-featured__title-badge">{t(doc.subTh, doc.subEn)}</div>
            )}
          </div>

          {(doc.quoteTh || doc.quoteEn) && (
            <div className="branch-doctor-featured__quote">
              <span className="quote-mark">&ldquo;</span>
              <p>{t(doc.quoteTh, doc.quoteEn)}</p>
            </div>
          )}

          {(doc.noteTh || doc.noteEn || doc.subSpecialtyTh || doc.subSpecialtyEn) && (
            <div className="branch-doctor-featured__specs-card">
              {(doc.noteTh || doc.noteEn) && (
                <div className="spec-row">
                  <div className="spec-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div className="spec-info">
                    <span className="spec-badge">{t('ความชำนาญ', 'Expertise')}</span>
                    <span className="spec-value">{t(doc.noteTh, doc.noteEn)}</span>
                  </div>
                </div>
              )}
              {(doc.subSpecialtyTh || doc.subSpecialtyEn) && (
                <div className="spec-row">
                  <div className="spec-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                  </div>
                  <div className="spec-info">
                    <span className="spec-badge">{t('ความชำนาญพิเศษเฉพาะทาง', 'Specialty')}</span>
                    <span className="spec-value">{t(doc.subSpecialtyTh, doc.subSpecialtyEn)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {doc.featuredHighlights.length > 0 && (
            <div className="branch-doctor-featured__highlights">
              {doc.featuredHighlights.map((h, i) => (
                <div className="branch-doctor-featured__highlight-item" key={i}>
                  <span className="branch-doctor-featured__highlight-item-icon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                  <span>{t(h.th, h.en)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="branch-doctor-featured__actions">
            <a href={localizedHref(locale, `/doctor/${doc.slug}`)} className="branch-doctor-featured__btn-profile">
              <span>{t('ดูประวัติแพทย์อย่างละเอียด', 'View Profile')}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#vipModalOverlay" className="branch-doctor-featured__btn-book vip-trigger" data-doc-name={doc.nameTh}>
              <span>{t('จองปรึกษาแพทย์', 'Book Consultation')}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </div>
    )
  }

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

        {(branch.featuredDoctors.length > 0 || branch.doctors.length > 0) && (
          <section className="branch-doctors-section">
            <div className="wrap">
              <div className="branch-section-head">
                <div className="eyebrow">MEDICAL SPECIALISTS</div>
                <h2>{t('ทีมแพทย์ผู้เชี่ยวชาญประจำสาขา', 'Specialists at This Location')}</h2>
                <p>{t('การันตีด้วยวุฒิบัตรและทีมอาจารย์แพทย์ผู้เชี่ยวชาญ คอยให้คำปรึกษาและออกแบบการรักษาเฉพาะบุคคล', 'Our board-certified specialists and clinical leaders dedicated to personalized medical care.')}</p>
              </div>

              {branch.featuredDoctors.length > 0 && (
                branch.featuredDoctors.length === 1 ? (
                  renderFeaturedDoctorCard(branch.featuredDoctors[0])
                ) : (
                  <>
                    <div className="branch-doctor-featured-carousel">
                      <div className="award-viewport">
                        <div className="award-track branch-doctor-featured-track" id="branchFeaturedTrack">
                          {branch.featuredDoctors.map((doc) => (
                            <div key={doc.slug} className="branch-doctor-featured-slide">
                              {renderFeaturedDoctorCard(doc)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="award-dots branch-doctor-featured-dots" id="branchFeaturedDots"></div>
                  </>
                )
              )}

              {branch.doctors.length > 0 && (
                <div className="branch-doctor-grid">
                  {branch.doctors.map((doc) => (
                  <div key={doc.slug} className="spec-card">
                    <div
                      className="photo-wrap"
                      style={displayBackgrounds.profileBackground ? { backgroundImage: `url('${displayBackgrounds.profileBackground}')` } : undefined}
                    >
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
              )}
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
      <Script src="/js/branch-doctor-featured-slider.js" strategy="afterInteractive" />
    </>
  )
}
