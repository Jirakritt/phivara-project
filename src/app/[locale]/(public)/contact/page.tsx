import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getBranchesListing } from '@/lib/branchesData'
import { getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return {
    title: t('PHIVARA | ติดต่อทั้ง 5 สาขา', 'PHIVARA | Contact Our 5 Locations'),
    description: t('ข้อมูลติดต่อและรายละเอียด PHIVARA ทั้ง 5 สาขา', 'Contact information and details for all 5 PHIVARA locations.'),
  }
}

// Rebuilt from phivara-design-html/contact.html + js/contact.js. The
// original built the branch grid client-side from the shared
// `PhivaraSiteShell.branches` array; every branch card is now
// server-rendered directly from Payload.
export const revalidate = 60

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [branches, homeData, liveLocales] = await Promise.all([
    getBranchesListing(locale),
    getHomeData(locale),
    getPubliclyLiveLocales(),
  ])
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

      <SiteHeader page="contact" topbar={homeData.topbar} locale={locale} localePath="/contact" liveLocales={liveLocales} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <span className="current">{t('ติดต่อเรา ทั้ง 5 สาขา', 'PHIVARA Locations')}</span>
          </div>
        </div>
      </div>

      <main>
        <section className="contact-hero">
          <div className="wrap">
            <div className="doc-hero-main">
              <div className="eyebrow center">PHIVARA LOCATIONS</div>
              <h1>{t('พบเราได้ที่ PHIVARA ทั้ง 5 สาขา', 'Visit PHIVARA at 5 Locations')}</h1>
              <div className="hero-gold-divider">
                <span className="line"></span>
                <span className="diamond">◆</span>
                <span className="line"></span>
              </div>
              <p className="lead">
                {t(
                  'เลือกสาขาที่ใกล้คุณ พร้อมดูข้อมูลการเดินทาง เวลาเปิดให้บริการ และบริการเด่นของแต่ละสาขา',
                  'Find your nearest location, with directions, opening hours, and each center’s signature services.',
                )}
              </p>
            </div>

            <div className="doc-hero-specialties-row contact-hero-location-pills">
              {branches.map((b) => (
                <a key={b.slug} href="#branchList" className="spec-pill">{t(b.nameTh, b.nameEn)}</a>
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
                      <h3>{t(`PHIVARA ${branch.nameTh}`, `PHIVARA ${branch.nameEn}`)}</h3>
                      <p className="branch-card__service">{t(branch.taglineTh, branch.taglineEn)}</p>
                      <p className="branch-card__description">{t(branch.descriptionTh, branch.descriptionEn)}</p>
                      <div className="branch-card__address">
                        <span className="branch-card__label">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                          <span>{t('ที่อยู่', 'Address')}</span>
                        </span>
                        <p>{t(branch.addressTh, branch.addressEn)}</p>
                      </div>
                      <div className="branch-card__meta">
                        <div>
                          <span className="branch-card__label">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span>{t('เวลาทำการ', 'Opening Hours')}</span>
                          </span>
                          <strong>{t(branch.hoursTh, branch.hoursEn)}</strong>
                        </div>
                        <div>
                          <span className="branch-card__label">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <span>{t('เบอร์โทร', 'Telephone')}</span>
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
                          <span>{t('เปิดใน Google Maps', 'Open in Google Maps')}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7" /><path d="M7 7h10v10" /></svg>
                        </a>
                        <a className="branch-detail-trigger" href={localizedHref(locale, `/branch/${branch.slug}`)}>
                          <span>{t('ดูรายละเอียดสาขาเพิ่มเติม →', 'View Branch Details →')}</span>
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
                <h2>{t('ยังไม่แน่ใจว่าสาขาไหนเหมาะกับคุณ?', 'Not Sure Which Center Is Right for You?')}</h2>
                <p>
                  {t(
                    'บอกความต้องการของคุณให้ทีม Concierge ช่วยแนะนำสาขา แพทย์ และช่วงเวลาที่เหมาะสม',
                    'Tell our Concierge what you need, and we’ll recommend the right location, specialist, and appointment time.',
                  )}
                </p>
              </div>
              <a className="concierge-card__button vip-trigger" href="#vipModalOverlay">{t('ให้ทีมงานติดต่อกลับ', 'Request a Callback')}</a>
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
