import { notFound } from 'next/navigation'
import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getExpertiseCategoryOptions, getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'
import { getProgramDetail } from '@/lib/programsData'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const program = await getProgramDetail(slug, locale)
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
export const revalidate = 60

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [program, homeData, liveLocales] = await Promise.all([
    getProgramDetail(slug, locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
  ])
  if (!program) notFound()

  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches, categories: getExpertiseCategoryOptions(homeData.hero) }).replace(/</g, '\\u003c')};`
  // Same 4 categories as the homepage "INTEGRATED EXPERTISE" tabs — see
  // homeData.ts's getExpertiseCategoryOptions comment.
  const categoryLabel = getExpertiseCategoryOptions(homeData.hero).find((c) => c.value === program.category)
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
        <img src="/assets/images/brand/logo_color.svg" alt="" style={{ width: 54 }} />
      </div>
      <div id="progressBar"></div>

      <SiteHeader page="program" topbar={homeData.topbar} locale={locale} localePath={`/program/${slug}`} liveLocales={liveLocales} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <a href={localizedHref(locale, '/program')}>{t('โปรแกรมตรวจ', 'Programs')}</a>
            <span className="sep">/</span>
            <span className="current">{t(program.titleTh, program.titleEn)}</span>
          </div>
        </div>
      </div>

      <main>
        <section className="program-detail-hero">
          <div className="wrap detail-hero-grid">
            <div className="detail-visual">
              <img src={program.heroImage} alt={program.titleTh} />
              <div className="visual-price-tag" aria-label={t(`ราคาแพ็กเกจ ${program.price.toLocaleString('en-US')} บาท`, `Package price ${program.price.toLocaleString('en-US')} THB`)}>
                <small className="phivara-type-size-override">PACKAGE PRICE</small>
                <strong className="phivara-type-size-override">{program.price.toLocaleString('en-US')}</strong>
                <span>{t('บาท', 'THB')}</span>
              </div>
            </div>
            <div className="detail-copy">
              <span className="eyebrow">{program.code}</span>
              <h1>{t(program.titleTh, program.titleEn)}</h1>
              <div className="detail-meta">
                <div>
                  <span className="meta-copy">
                    <span className="meta-label">
                      <span className="meta-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 12h4l2.2-5 4 10 2.3-5H21" /><circle cx="12" cy="12" r="10" /></svg></span>
                      <small>{t('หมวดหมู่', 'CATEGORY')}</small>
                    </span>
                    <strong>{t(categoryLabel?.labelTh || program.category, categoryLabel?.labelEn || program.category)}</strong>
                  </span>
                </div>
                <div>
                  <span className="meta-copy">
                    <span className="meta-label">
                      <span className="meta-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1116 0z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
                      <small>{t('สาขา', 'LOCATION')}</small>
                    </span>
                    <strong>{t(program.branchTh, program.branchEn)}</strong>
                  </span>
                </div>
                <div>
                  <span className="meta-copy">
                    <span className="meta-label">
                      <span className="meta-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /><path d="M8 14h3M8 17h5" /></svg></span>
                      <small>{t('รับบริการได้ถึง', 'VALID UNTIL')}</small>
                    </span>
                    <strong>{t('30/12/69', '30/12/26')}</strong>
                  </span>
                </div>
              </div>
              <div className="hero-actions">
                <button className="detail-btn booking-trigger" data-program={program.titleTh}>{t('นัดหมายปรึกษาโปรแกรม', 'Book a Consultation')} <span>→</span></button>
                <a href="#overview" className="detail-btn outline">{t('ดูรายละเอียด', 'Explore Details')}</a>
              </div>
            </div>
          </div>
        </section>

        <section className="detail-overview" id="overview">
          <div className="wrap overview-grid">
            <div className="overview-intro">
              <span className="section-label">PACKAGE DETAILS</span>
              <h2>{t('รายละเอียดโปรแกรมตรวจ', 'Program details')}</h2>
            </div>
            <div className="benefit-list" id="audienceContent">
              <div className="program-description">
                <h3>{t('เกี่ยวกับโปรแกรมตรวจ', 'About This Program')}</h3>
                <p>{t(program.aboutProgramTh, program.aboutProgramEn)}</p>
              </div>
              <div className="program-card-grid">
                <article className="program-audience-card">
                  <h3>{t('ตรวจเพื่ออะไร', 'Purpose of This Checkup')}</h3>
                  <ul className="diamond-list">
                    {program.purposeList.map((item, i) => (
                      <li key={i}>{t(item.th, item.en)}</li>
                    ))}
                  </ul>
                </article>
                <article className="program-audience-card">
                  <h3>{t('เหมาะกับใคร', 'Who It’s For')}</h3>
                  <ul className="diamond-list">
                    {program.audienceList.map((item, i) => (
                      <li key={i}>{t(item.th, item.en)}</li>
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
              <h2>{t('รายการตรวจ', 'Checkup list')}</h2>
            </div>
            {hasGenderGroups ? (
              <div className="includes-list gender-checkup-list">
                <div className="gender-checkup-grid">
                  <section className="gender-checkup-group">
                    <h3>{t('รายการตรวจสำหรับผู้ชาย', 'Checkup Items — Men')}</h3>
                    <table className="checkup-table"><tbody>
                      {maleItems.map((item, i) => (
                        <tr key={i}><td>
                          <span className="checkup-number">{String(i + 1).padStart(2, '0')}</span>
                          <span className="checkup-copy">
                            <span className="checkup-name">{t(item.nameTh, item.nameEn)}</span>
                            {item.descriptionTh && <span className="checkup-description">{t(item.descriptionTh, item.descriptionEn || item.descriptionTh)}</span>}
                          </span>
                        </td></tr>
                      ))}
                    </tbody></table>
                  </section>
                  <section className="gender-checkup-group">
                    <h3>{t('รายการตรวจสำหรับผู้หญิง', 'Checkup Items — Women')}</h3>
                    <table className="checkup-table"><tbody>
                      {femaleItems.map((item, i) => (
                        <tr key={i}><td>
                          <span className="checkup-number">{String(i + 1).padStart(2, '0')}</span>
                          <span className="checkup-copy">
                            <span className="checkup-name">{t(item.nameTh, item.nameEn)}</span>
                            {item.descriptionTh && <span className="checkup-description">{t(item.descriptionTh, item.descriptionEn || item.descriptionTh)}</span>}
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
                  <thead><tr><th scope="col">{t('รายการตรวจ', 'CHECKUP ITEMS')}</th></tr></thead>
                  <tbody>
                    {allItems.map((item, i) => (
                      <tr key={i}><td>
                        <span className="checkup-number">{String(i + 1).padStart(2, '0')}</span>
                        <span className="checkup-name">{t(item.nameTh, item.nameEn)}</span>
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
              <h2>{t('เงื่อนไขการเข้ารับบริการ', 'Terms of service')}</h2>
            </div>
            <div className={`process-grid${hasGenderGroups ? ' hormone-terms' : ''}`} id="termsGrid">
              {program.termsOfService.map((term, i) => (
                <article key={i} className="process-step">
                  <b>{i + 1}</b>
                  <div>
                    {term.titleTh && <h3>{t(term.titleTh, term.titleEn || term.titleTh)}</h3>}
                    <p>{t(term.descriptionTh, term.descriptionEn)}</p>
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
                <h2>{t('ติดต่อรับบริการ', 'Service contact')}</h2>
              </div>
              <div className="contact-list">
                <div className="contact-item">
                  <span className="contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg></span>
                  <div>
                    <small>{t('สถานที่', 'LOCATION')}</small>
                    <strong>
                      {t(
                        program.contactLocationTh || 'PHIVARA Aesthetic & Longevity Center ทุกสาขา',
                        program.contactLocationEn || 'All PHIVARA Aesthetic & Longevity Center locations',
                      )}
                    </strong>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></span>
                  <div>
                    <small>{t('เวลาทำการ', 'OPENING HOURS')}</small>
                    <strong>
                      {t(
                        program.contactHoursTh || 'ทุกวัน เวลา 09:00–20:00 น. (กรุณานัดหมายล่วงหน้า)',
                        program.contactHoursEn || 'Daily, 9:00 AM–8:00 PM (advance booking recommended)',
                      )}
                    </strong>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 3.5 10 8 7.8 9.8a14.5 14.5 0 0 0 6.4 6.4L16 14l4.5 2.5v3A1.5 1.5 0 0 1 19 21C10.2 21 3 13.8 3 5a1.5 1.5 0 0 1 1.5-1.5h3Z" /></svg></span>
                  <div>
                    <small>{t('โทร', 'PHONE')}</small>
                    <strong>{program.contactPhone ? <a href={`tel:${program.contactPhone.replace(/[^0-9]/g, '')}`}>{program.contactPhone}</a> : <a href="tel:02XXXXXXX">02-XXX-XXXX</a>} · LINE: @phivara</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
