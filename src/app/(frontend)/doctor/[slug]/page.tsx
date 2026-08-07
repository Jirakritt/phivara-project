import { notFound } from 'next/navigation'
import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'
import { getDoctorDetail, getDoctorJournalArticles } from '@/lib/doctorsData'
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
// see SPECIALTY_FILTER_OPTIONS in doctorsData.ts) uses different value
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
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doctor = await getDoctorDetail(slug)
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
export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [doctor, homeData] = await Promise.all([getDoctorDetail(slug), getHomeData()])
  if (!doctor) notFound()

  const journal = await getDoctorJournalArticles(doctor.id)
  const signaturePrograms = await getDoctorSignaturePrograms(doctor.specialty)
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`
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

      <SiteHeader page="doctor" />

      <nav className="breadcrumb-subbar" aria-label="Breadcrumb">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <a href="/doctor" data-th="ทีมแพทย์ผู้เชี่ยวชาญ" data-en="Medical Specialists">ทีมแพทย์ผู้เชี่ยวชาญ</a>
            <span className="sep">/</span>
            <span className="current" data-th={doctor.nameTh} data-en={doctor.nameEn}>{doctor.nameTh}</span>
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
              <div className="doc-header-eyebrow" data-th="PHIVARA MEDICAL SPECIALIST" data-en="PHIVARA MEDICAL SPECIALIST">PHIVARA MEDICAL SPECIALIST</div>
              <h1 className="doc-hero-name" id="doctor-name" data-th={doctor.nameTh} data-en={doctor.nameEn}>{doctor.nameTh}</h1>

              <div className="doc-role-row">
                <div className="doc-hero-title-badge" data-th={rich?.hospitalTitleTh || doctor.noteTh} data-en={rich?.hospitalTitleEn || doctor.noteEn}>
                  {rich?.hospitalTitleTh || doctor.noteTh}
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
                <div className="doc-hero-sub-title" data-th={rich?.boardCertificationTh || doctor.subTh} data-en={rich?.boardCertificationEn || doctor.subEn}>
                  {rich?.boardCertificationTh || doctor.subTh}
                </div>
              )}

              {rich && rich.tags.length > 0 && (
                <div className="doc-tags-wrap">
                  {rich.tags.map((tag, i) => (
                    <span key={i} className="doc-tag-pill" data-th={tag.th} data-en={tag.en}>{tag.th}</span>
                  ))}
                </div>
              )}

              {rich?.bioTh && (
                <p className="doc-bio" data-th={rich.bioTh} data-en={rich.bioEn}>{rich.bioTh}</p>
              )}

              <div className="doc-cta-group">
                <a href="#contact" className="btn btn-gold vip-trigger" data-doc-name={doctor.nameTh} data-th={`จองนัดหมายปรึกษา ${doctor.nameTh}`} data-en={`Book Consultation with ${doctor.nameEn}`}>
                  {`จองนัดหมายปรึกษา ${doctor.nameTh}`}
                </a>
                {rich && rich.schedule.length > 0 && (
                  <a href="#schedule" className="btn btn-outline-dark" data-th="ดูตารางเวรออกตรวจ" data-en="View Clinic Schedule">ดูตารางเวรออกตรวจ</a>
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
              <div className="eyebrow center" data-th="ACADEMIC CREDENTIALS" data-en="ACADEMIC CREDENTIALS">ACADEMIC CREDENTIALS</div>
              <h2 id="credentials-heading" data-th="คุณวุฒิ ประวัติการศึกษา และผลงานทางวิชาการ" data-en="Academic Qualifications & Certifications">
                คุณวุฒิ ประวัติการศึกษา และผลงานทางวิชาการ
              </h2>
            </div>

            <div className="doc-three-col-grid">
              {rich.credentialGroups.map((group, gi) => (
                <article key={gi} className="doc-credential-card">
                  <div className="card-head">
                    <h3 data-th={group.headingTh} data-en={group.headingEn}>{group.headingTh}</h3>
                  </div>
                  <ul className="credential-list">
                    {group.items.map((item, ii) => (
                      <li key={ii} data-th={item.th} data-en={item.en}>{item.th}</li>
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
              <div className="eyebrow center" data-th="SIGNATURE MEDICAL PROGRAMS" data-en="SIGNATURE MEDICAL PROGRAMS">SIGNATURE MEDICAL PROGRAMS</div>
              <h2 id="programs-heading" data-th="โปรแกรมการตรวจที่เกี่ยวข้อง" data-en="Related Medical Programs">โปรแกรมการตรวจที่เกี่ยวข้อง</h2>
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
                  <h3 data-th={program.titleTh} data-en={program.titleEn}>{program.titleTh}</h3>
                  <p data-th={program.shortDescriptionTh} data-en={program.shortDescriptionEn}>{program.shortDescriptionTh}</p>
                  <a className="prog-detail-link" href={`/program/${program.slug}`}>
                    <span data-th="อ่านรายละเอียดโปรแกรม" data-en="View Program Details">อ่านรายละเอียดโปรแกรม</span>
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
              <div className="eyebrow center" data-th="OUTPATIENT SCHEDULE" data-en="OUTPATIENT SCHEDULE">OUTPATIENT SCHEDULE</div>
              <h2 id="schedule-heading" data-th="ตารางเวลาออกตรวจ" data-en="Outpatient Schedule">ตารางเวลาออกตรวจ</h2>
              <p data-th={`กรุณานัดหมายล่วงหน้าเพื่อเข้าพบ ${doctor.nameTh} แบบส่วนตัว`} data-en={`Advance VIP reservation is required for private consultation with ${doctor.nameEn}.`}>
                {`กรุณานัดหมายล่วงหน้าเพื่อเข้าพบ ${doctor.nameTh} แบบส่วนตัว`}
              </p>
            </div>

            <div className="schedule-table-card">
              <table className="schedule-table" aria-labelledby="schedule-heading">
                <thead>
                  <tr>
                    <th data-th="วันออกตรวจ" data-en="Day">วันออกตรวจ</th>
                    <th data-th="ช่วงเวลา" data-en="Hours">ช่วงเวลา</th>
                    <th data-th="สาขา / สถานที่" data-en="Clinic Location">สาขา / สถานที่</th>
                  </tr>
                </thead>
                <tbody>
                  {rich.schedule.map((row, i) => {
                    const dayLabel = DAY_LABELS[row.day] || { th: row.day, en: row.day }
                    return (
                    <tr key={i}>
                      <td><strong data-th={`${dayLabel.th} (${dayLabel.en})`} data-en={dayLabel.en}>{`${dayLabel.th} (${dayLabel.en})`}</strong></td>
                      <td>{row.hours}</td>
                      <td>
                        <strong>PHIVARA {doctor.branchEn}</strong>
                        {row.locationNameTh && (
                          <div className="branch-subtext" data-th={row.locationNameTh} data-en={row.locationNameEn}>{row.locationNameTh}</div>
                        )}
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="section-actions">
              <a href="#contact" className="btn btn-gold vip-trigger" data-doc-name={doctor.nameTh} data-th={`จองนัดหมายปรึกษา ${doctor.nameTh}`} data-en={`Reserve Consultation with ${doctor.nameEn}`}>
                {`จองนัดหมายปรึกษา ${doctor.nameTh}`}
              </a>
            </div>
          </div>
        </section>
      )}

      {journal.length > 0 && (
        <section className="journal doctor-journal" id="doctor-journal" aria-labelledby="journal-heading">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow center" data-th="DOCTOR'S JOURNAL" data-en="DOCTOR'S JOURNAL">DOCTOR'S JOURNAL</div>
              <h2 id="journal-heading" data-th="องค์ความรู้เพื่อสุขภาพที่ยืนยาว" data-en="Insights for a Longer, Healthier Life">องค์ความรู้เพื่อสุขภาพที่ยืนยาว</h2>
            </div>

            <div className="article-grid">
              {journal.map((article) => (
                <article key={article.slug} className="article-card">
                  <div className="card-image">
                    <a href={`/article/${article.slug}`}>
                      <img src={article.image} alt={article.titleTh} loading="lazy" decoding="async" />
                    </a>
                  </div>
                  <div className="card-copy">
                    <span className="article-kicker" data-th={article.categoryTh} data-en={article.categoryEn}>{article.categoryTh}</span>
                    <h3><a href={`/article/${article.slug}`} data-th={article.titleTh} data-en={article.titleEn}>{article.titleTh}</a></h3>
                    <p data-th={article.summaryTh} data-en={article.summaryEn}>{article.summaryTh}</p>
                    <div className="card-footer-row">
                      <div className="article-meta">
                        <span data-th={article.dateTh} data-en={article.dateEn}>{article.dateTh}</span>
                        <span className="dot"></span>
                        <span data-th={article.readTimeTh} data-en={article.readTimeEn}>{article.readTimeTh}</span>
                      </div>
                      <a className="go" href={`/article/${article.slug}`} data-th="อ่านต่อ →" data-en="Read More →">อ่านต่อ →</a>
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
              <img src="/assets/images/brand/about-lounge.jpg" alt={`PHIVARA ${doctor.branchEn}`} loading="lazy" decoding="async" />
              <div className="contact-visual-content">
                <div className="eyebrow" data-th="VIP PRIVATE APPOINTMENT" data-en="VIP PRIVATE APPOINTMENT">VIP PRIVATE APPOINTMENT</div>
                <h2 id="contact-heading" data-th="นัดหมายปรึกษาแบบส่วนตัว" data-en="Book a Private Consultation">นัดหมายปรึกษาแบบส่วนตัว</h2>
                <p
                  data-th={rich?.contactIntroTh || `รับคำปรึกษาอย่างเป็นส่วนตัว ณ PHIVARA ${doctor.branchTh} พร้อมทีม VIP Concierge ดูแลทุกขั้นตอนของการนัดหมาย`}
                  data-en={rich?.contactIntroEn || `Enjoy a private consultation at PHIVARA ${doctor.branchEn}, with our VIP Concierge team supporting every step of your appointment.`}
                >
                  {rich?.contactIntroTh || `รับคำปรึกษาอย่างเป็นส่วนตัว ณ PHIVARA ${doctor.branchTh} พร้อมทีม VIP Concierge ดูแลทุกขั้นตอนของการนัดหมาย`}
                </p>
                <div className="contact-facts">
                  <div className="contact-fact">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <span data-th={rich?.contactFactTh || `PHIVARA ${doctor.branchTh}`} data-en={rich?.contactFactEn || `PHIVARA ${doctor.branchEn}`}>
                      {rich?.contactFactTh || `PHIVARA ${doctor.branchTh}`}
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
                <div className="eyebrow" data-th="APPOINTMENT DETAILS" data-en="APPOINTMENT DETAILS">APPOINTMENT DETAILS</div>
                <h3 id="appointment-form-heading" data-th="ส่งคำขอนัดหมาย" data-en="Submit an Appointment Request">ส่งคำขอนัดหมาย</h3>
                <p data-th="กรอกข้อมูลด้านล่างเพื่อให้ทีมงานติดต่อกลับและยืนยันเวลาที่เหมาะสม" data-en="Share your details and our team will contact you to confirm a suitable time.">
                  กรอกข้อมูลด้านล่างเพื่อให้ทีมงานติดต่อกลับและยืนยันเวลาที่เหมาะสม
                </p>
              </div>

              <div className="contact-name-row">
                <div>
                  <label className="form-label" htmlFor="appointmentName" data-th="ชื่อ-นามสกุล *" data-en="Full Name *">ชื่อ-นามสกุล *</label>
                  <input className="form-control" type="text" id="appointmentName" name="name" autoComplete="name" required placeholder="คุณสมชาย ใจดี" data-th-placeholder="คุณสมชาย ใจดี" data-en-placeholder="Your full name" />
                </div>
                <div>
                  <label className="form-label" htmlFor="appointmentPhone" data-th="เบอร์โทรศัพท์ *" data-en="Phone Number *">เบอร์โทรศัพท์ *</label>
                  <input className="form-control" type="tel" id="appointmentPhone" name="phone" autoComplete="tel" inputMode="tel" maxLength={20} required aria-describedby="appointmentPhoneError" placeholder="08X-XXX-XXXX" data-th-placeholder="08X-XXX-XXXX" data-en-placeholder="Your phone number" />
                  <small className="form-error" id="appointmentPhoneError" data-th="กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66" data-en="Enter a 9–10 digit phone number or use the +66 format" hidden>
                    กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66
                  </small>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="appointmentBranch" data-th="เลือกสาขาที่สะดวกเข้ารับบริการ" data-en="Preferred Branch">เลือกสาขาที่สะดวกเข้ารับบริการ</label>
                <select className="form-control" id="appointmentBranch" name="branch" defaultValue={doctor.branchSlug}>
                  <option value={doctor.branchSlug}>PHIVARA {doctor.branchEn}</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="preferredAppointmentDate" data-th="วันที่ต้องการนัดหมาย *" data-en="Preferred Appointment Date *">วันที่ต้องการนัดหมาย *</label>
                <input className="form-control" type="date" id="preferredAppointmentDate" name="preferredAppointmentDate" required />
              </div>

              <div className="form-field form-field--large">
                <label className="form-label" htmlFor="vipNotesInput" data-th="เรื่องที่ต้องการปรึกษา" data-en="Consultation Topic">เรื่องที่ต้องการปรึกษา</label>
                <textarea className="form-control" id="vipNotesInput" name="notes" rows={5} defaultValue={notesDefaultTh} data-default-th={notesDefaultTh} data-default-en={notesDefaultEn} />
              </div>

              <button type="submit" className="btn btn-gold form-submit" data-th="ยืนยันการนัดหมาย VIP" data-en="Submit VIP Reservation">ยืนยันการนัดหมาย VIP</button>
              <p className="form-status" id="appointmentFormStatus" role="status" aria-live="polite" aria-atomic="true" hidden></p>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter branches={homeData.branches} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/doctor-appointment-form.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
