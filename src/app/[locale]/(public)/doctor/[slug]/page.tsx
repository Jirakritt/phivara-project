import { notFound } from 'next/navigation'
import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getDoctorDetail, getDoctorJournalArticles } from '@/lib/doctorsData'
import { getExpertiseCategoryOptions, getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'
import { getDoctorSignaturePrograms } from '@/lib/programsData'

// Doctors.schedule.day is a plain select enum (monday..sunday) with no
// bilingual label of its own — map it to display text matching the
// original site's "อังคาร (Tuesday)" style.
const DAY_LABELS: Record<string, { th: string; en: string }> = {
  monday: { th: 'จันทร์', en: 'Monday' },
  tuesday: { th: 'อังคาร', en: 'Tuesday' },
  wednesday: { th: 'พุธ', en: 'Wednesday' },
  thursday: { th: 'พฤหัสบดี', en: 'Thursday' },
  friday: { th: 'ศุกร์', en: 'Friday' },
  saturday: { th: 'เสาร์', en: 'Saturday' },
  sunday: { th: 'อาทิตย์', en: 'Sunday' },
}

// Doctors.specialty ('plastic' | 'longevity' | 'dermatology' | 'wellness',
// see getExpertiseCategoryOptions in homeData.ts) uses different value
// strings than Leads.service ('plastic-surgery' | 'longevity' |
// 'dermatology' | 'wellness' | 'membership') — this form has no service
// picker of its own (unlike the VIP modal), so the doctor's own specialty
// stands in for it, mapped through here rather than duplicating the
// mismatch inline.
const SPECIALTY_TO_LEAD_SERVICE: Record<string, string> = {
  plastic: 'plastic-surgery',
  longevity: 'longevity',
  dermatology: 'dermatology',
  wellness: 'wellness',
}

// Previously missing entirely — doctor pages just inherited the root
// layout's static title/description. Same seo.title/description/ogImage/
// noIndex pattern as the article and program detail pages.
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const doctor = await getDoctorDetail(slug, locale)
  if (!doctor) return {}

  const title = doctor.seo.title || `${doctor.nameEn} | PHIVARA`
  const description = doctor.seo.description || doctor.rich?.bioEn || doctor.noteEn || undefined
  const ogImage = doctor.seo.ogImage || doctor.portraitImage

  return {
    title,
    description,
    robots: doctor.seo.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      type: 'profile',
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

// Rebuilt from phivara-design-html/doctor_detail.html. The original page
// was hardcoded for one doctor (Dr. Kobkulya) with a JS overlay
// (applyDr01Profile) that DOM-patched it into a second hardcoded doctor
// (Dr. Dulyanat) when visited with ?id=dr01 — every OTHER doctor id just
// showed Dr. Kobkulya's content, which was really a bug in the static
// site. Here every doctor gets their own correct page from Payload.
//
// Only doctors with the "rich" profile fields filled in (currently just
// dr01) get the full credentials/schedule layout — everyone else gets a
// simpler but still correct profile (photo, name, specialty, branch,
// booking CTA) instead of someone else's bio.
export const revalidate = 60

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [doctor, homeData, liveLocales] = await Promise.all([
    getDoctorDetail(slug, locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
  ])
  if (!doctor) notFound()

  const journal = await getDoctorJournalArticles(doctor.id, locale)
  const signaturePrograms = await getDoctorSignaturePrograms(doctor.specialty, locale)
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches, categories: getExpertiseCategoryOptions(homeData.hero) }).replace(/</g, '\\u003c')};`
  const rich = doctor.rich

  const notesDefaultTh = `นัดหมายขอปรึกษาแพทย์: ${doctor.nameTh}`
  const notesDefaultEn = `Book appointment with: ${doctor.nameEn}`
  const leadService = SPECIALTY_TO_LEAD_SERVICE[doctor.specialty] || 'longevity'

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />
      <link rel="stylesheet" href="/css/doctor-detail.css" />

      <Script id="phivara-doctor-detail-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar" aria-hidden="true"></div>
      <div id="cursorRing" aria-hidden="true"></div>

      <SiteHeader page="doctor" topbar={homeData.topbar} locale={locale} localePath={`/doctor/${slug}`} liveLocales={liveLocales} />

      <nav className="breadcrumb-subbar" aria-label="Breadcrumb">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <a href={localizedHref(locale, '/doctor')}>{t('ทีมแพทย์ผู้เชี่ยวชาญ', 'Medical Specialists')}</a>
            <span className="sep">/</span>
            <span className="current">{t(doctor.nameTh, doctor.nameEn)}</span>
          </div>
        </div>
      </nav>

      <section className="doc-hero-redesign" aria-labelledby="doctor-name">
        <div className="wrap">
          <div className="doc-grid-stage">
            <div className="doc-portrait-stage">
              <div className="portrait-card-glow">
                <img className="portrait-img-large" src={doctor.portraitImage} alt={doctor.nameTh} fetchPriority="high" decoding="async" />
              </div>
            </div>

            <div className="doc-info-stage">
              <div className="doc-header-eyebrow">PHIVARA MEDICAL SPECIALIST</div>
              <h1 className="doc-hero-name" id="doctor-name">{t(doctor.nameTh, doctor.nameEn)}</h1>

              <div className="doc-role-row">
                <div className="doc-hero-title-badge">
                  {t(rich?.hospitalTitleTh || doctor.noteTh, rich?.hospitalTitleEn || doctor.noteEn)}
                </div>
                <span className="doc-branch-label">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  PHIVARA {doctor.branchEn}
                </span>
              </div>

              {(rich?.boardCertificationTh || doctor.subTh) && (
                <div className="doc-hero-sub-title">
                  {t(rich?.boardCertificationTh || doctor.subTh, rich?.boardCertificationEn || doctor.subEn)}
                </div>
              )}

              {rich && rich.tags.length > 0 && (
                <div className="doc-tags-wrap">
                  {rich.tags.map((tag, i) => (
                    <span key={i} className="doc-tag-pill">{t(tag.th, tag.en)}</span>
                  ))}
                </div>
              )}

              {rich?.bioTh && (
                <p className="doc-bio">{t(rich.bioTh, rich.bioEn)}</p>
              )}

              <div className="doc-cta-group">
                <a href="#contact" className="btn btn-gold vip-trigger" data-doc-name={doctor.nameTh}>
                  {t(`จองนัดหมายปรึกษา ${doctor.nameTh}`, `Book Consultation with ${doctor.nameEn}`)}
                </a>
                {rich && rich.schedule.length > 0 && (
                  <a href="#schedule" className="btn btn-outline-dark">{t('ดูตารางเวรออกตรวจ', 'View Clinic Schedule')}</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {rich && rich.credentialGroups.length > 0 && (
        <section className="doc-details-section" aria-labelledby="credentials-heading">
          <div className="wrap">
            <div className="section-intro section-intro--compact">
              <div className="eyebrow center">ACADEMIC CREDENTIALS</div>
              <h2 id="credentials-heading">
                {t('คุณวุฒิ ประวัติการศึกษา และผลงานทางวิชาการ', 'Academic Qualifications & Certifications')}
              </h2>
            </div>

            <div className="doc-three-col-grid">
              {rich.credentialGroups.map((group, gi) => (
                <article key={gi} className="doc-credential-card">
                  <div className="card-head">
                    <h3>{t(group.headingTh, group.headingEn)}</h3>
                  </div>
                  <ul className="credential-list">
                    {group.items.map((item, ii) => (
                      <li key={ii}>{t(item.th, item.en)}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {signaturePrograms.length > 0 && (
        <section className="signature-programs-section" id="programs" aria-labelledby="programs-heading">
          <div className="wrap">
            <div className="section-intro">
              <div className="eyebrow center">SIGNATURE MEDICAL PROGRAMS</div>
              <h2 id="programs-heading">{t('โปรแกรมการตรวจที่เกี่ยวข้อง', 'Related Medical Programs')}</h2>
            </div>

            <div className="prog-grid">
              {signaturePrograms.map((program) => (
                <article key={program.slug} className="prog-card">
                  <div className="prog-icon-badge" aria-hidden="true">
                    {/* One consistent icon for every card — the original
                        hand-picked a bespoke icon per one-off curated
                        program, which doesn't apply now that this section
                        is auto-matched from real program data. */}
                    <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                  </div>
                  <h3>{t(program.titleTh, program.titleEn)}</h3>
                  <p>{t(program.shortDescriptionTh, program.shortDescriptionEn)}</p>
                  <a className="prog-detail-link" href={localizedHref(locale, `/program/${program.slug}`)}>
                    <span>{t('อ่านรายละเอียดโปรแกรม', 'View Program Details')}</span>
                    <svg viewBox="0 0 18 12" aria-hidden="true"><path d="M1 6h15M12 2l4 4-4 4" /></svg>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {rich && rich.schedule.length > 0 && (
        <section className="doc-schedule-section" id="schedule" aria-labelledby="schedule-heading">
          <div className="wrap">
            <div className="section-intro section-intro--compact">
              <div className="eyebrow center">OUTPATIENT SCHEDULE</div>
              <h2 id="schedule-heading">{t('ตารางเวลาออกตรวจ', 'Outpatient Schedule')}</h2>
              <p>
                {t(
                  `กรุณานัดหมายล่วงหน้าเพื่อเข้าพบ ${doctor.nameTh} แบบส่วนตัว`,
                  `Advance VIP reservation is required for private consultation with ${doctor.nameEn}.`,
                )}
              </p>
            </div>

            <div className="schedule-table-card">
              <table className="schedule-table" aria-labelledby="schedule-heading">
                <thead>
                  <tr>
                    <th>{t('วันออกตรวจ', 'Day')}</th>
                    <th>{t('ช่วงเวลา', 'Hours')}</th>
                    <th>{t('สาขา / สถานที่', 'Clinic Location')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rich.schedule.map((row, i) => {
                    const dayLabel = DAY_LABELS[row.day] || { th: row.day, en: row.day }
                    return (
                    <tr key={i}>
                      <td><strong>{t(`${dayLabel.th} (${dayLabel.en})`, dayLabel.en)}</strong></td>
                      <td>{row.hours}</td>
                      <td>
                        <strong>PHIVARA {doctor.branchEn}</strong>
                        {row.locationNameTh && (
                          <div className="branch-subtext">{t(row.locationNameTh, row.locationNameEn)}</div>
                        )}
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="section-actions">
              <a href="#contact" className="btn btn-gold vip-trigger" data-doc-name={doctor.nameTh}>
                {t(`จองนัดหมายปรึกษา ${doctor.nameTh}`, `Reserve Consultation with ${doctor.nameEn}`)}
              </a>
            </div>
          </div>
        </section>
      )}

      {journal.length > 0 && (
        <section className="journal doctor-journal" id="doctor-journal" aria-labelledby="journal-heading">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow center">DOCTOR&apos;S JOURNAL</div>
              <h2 id="journal-heading">{t('องค์ความรู้เพื่อสุขภาพที่ยืนยาว', 'Insights for a Longer, Healthier Life')}</h2>
            </div>

            <div className="article-grid">
              {journal.map((article) => (
                <article key={article.slug} className="article-card">
                  <div className="card-image">
                    <a href={localizedHref(locale, `/article/${article.slug}`)}>
                      <img src={article.image} alt={article.titleTh} loading="lazy" decoding="async" />
                    </a>
                  </div>
                  <div className="card-copy">
                    <span className="article-kicker">{t(article.categoryTh, article.categoryEn)}</span>
                    <h3><a href={localizedHref(locale, `/article/${article.slug}`)}>{t(article.titleTh, article.titleEn)}</a></h3>
                    <p>{t(article.summaryTh, article.summaryEn)}</p>
                    <div className="card-footer-row">
                      <div className="article-meta">
                        <span>{t(article.dateTh, article.dateEn)}</span>
                        <span className="dot"></span>
                        <span>{t(article.readTimeTh, article.readTimeEn)}</span>
                      </div>
                      <a className="go" href={localizedHref(locale, `/article/${article.slug}`)}>{t('อ่านต่อ →', 'Read More →')}</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="contact-section" id="contact" aria-labelledby="contact-heading">
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-visual">
              {/* "PHIVARA " is part of the CMS branch `name` field itself now
                  (per team decision) — not concatenated here or below. */}
              <img src="/assets/images/brand/about-lounge.jpg" alt={doctor.branchEn} loading="lazy" decoding="async" />
              <div className="contact-visual-content">
                <div className="eyebrow">VIP PRIVATE APPOINTMENT</div>
                <h2 id="contact-heading">{t('นัดหมายปรึกษาแบบส่วนตัว', 'Book a Private Consultation')}</h2>
                <p>
                  {t(
                    rich?.contactIntroTh || `รับคำปรึกษาอย่างเป็นส่วนตัว ณ ${doctor.branchTh} พร้อมทีม VIP Concierge ดูแลทุกขั้นตอนของการนัดหมาย`,
                    rich?.contactIntroEn || `Enjoy a private consultation at ${doctor.branchEn}, with our VIP Concierge team supporting every step of your appointment.`,
                  )}
                </p>
                <div className="contact-facts">
                  <div className="contact-fact">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span>
                      {t(rich?.contactFactTh || doctor.branchTh, rich?.contactFactEn || doctor.branchEn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form
              className="contact-form-card"
              id="vipDirectForm"
              aria-labelledby="appointment-form-heading"
              data-service={leadService}
              data-success-th="ขอบคุณครับ/ค่ะ ระบบได้รับข้อมูลการนัดหมายแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด"
              data-success-en="Thank you. Your appointment request has been received. Our team will contact you shortly."
              data-error-th="ขออภัย ระบบไม่สามารถส่งคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือโทรติดต่อเราโดยตรง"
              data-error-en="Sorry, we couldn't submit your request right now. Please try again or call us directly."
            >
              <div className="contact-form-head">
                <div className="eyebrow">APPOINTMENT DETAILS</div>
                <h3 id="appointment-form-heading">{t('ส่งคำขอนัดหมาย', 'Submit an Appointment Request')}</h3>
                <p>{t('กรอกข้อมูลด้านล่างเพื่อให้ทีมงานติดต่อกลับและยืนยันเวลาที่เหมาะสม', 'Share your details and our team will contact you to confirm a suitable time.')}</p>
              </div>

              {/* Spam honeypot — real visitors never see this (off-screen,
                  not display:none, so it still trips bots that skip hidden
                  fields); checked server-side in Leads.ts's beforeValidate
                  hook. See public/js/vip-modal.js for the same pattern. */}
              <label style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                <span>Website</span>
                <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
              </label>

              <div className="contact-name-row">
                <div>
                  <label className="form-label" htmlFor="appointmentName">{t('ชื่อ-นามสกุล *', 'Full Name *')}</label>
                  <input className="form-control" type="text" id="appointmentName" name="name" autoComplete="name" required placeholder={t('ชื่อ-นามสกุล ของคุณ', 'Your full name')} data-th-placeholder="ชื่อ-นามสกุล ของคุณ" data-en-placeholder="Your full name" />
                </div>
                <div>
                  <label className="form-label" htmlFor="appointmentPhone">{t('เบอร์โทรศัพท์ *', 'Phone Number *')}</label>
                  <input className="form-control" type="tel" id="appointmentPhone" name="phone" autoComplete="tel" inputMode="tel" maxLength={20} required aria-describedby="appointmentPhoneError" placeholder={t('08X-XXX-XXXX', 'Your phone number')} data-th-placeholder="08X-XXX-XXXX" data-en-placeholder="Your phone number" />
                  <small className="form-error" id="appointmentPhoneError" hidden>
                    {t('กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66', 'Enter a 9–10 digit phone number or use the +66 format')}
                  </small>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="appointmentBranch">{t('เลือกสาขาที่สะดวกเข้ารับบริการ', 'Preferred Branch')}</label>
                <select className="form-control" id="appointmentBranch" name="branch" defaultValue={doctor.branchSlug}>
                  <option value={doctor.branchSlug}>PHIVARA {doctor.branchEn}</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="preferredAppointmentDate">{t('วันที่ต้องการนัดหมาย *', 'Preferred Appointment Date *')}</label>
                <input className="form-control" type="date" id="preferredAppointmentDate" name="preferredAppointmentDate" required />
              </div>

              <div className="form-field form-field--large">
                <label className="form-label" htmlFor="vipNotesInput">{t('เรื่องที่ต้องการปรึกษา', 'Consultation Topic')}</label>
                <textarea className="form-control" id="vipNotesInput" name="notes" rows={5} defaultValue={t(notesDefaultTh, notesDefaultEn)} data-default-th={notesDefaultTh} data-default-en={notesDefaultEn} />
              </div>

              <button type="submit" className="btn btn-gold form-submit">{t('ยืนยันการนัดหมาย VIP', 'Submit VIP Reservation')}</button>
              <p className="form-status" id="appointmentFormStatus" role="status" aria-live="polite" aria-atomic="true" hidden></p>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/doctor-appointment-form.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
