import Script from 'next/script'
import type { ReactNode } from 'react'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getExpertiseCategoryOptions, getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import { getPrivacyPolicyContent } from '@/lib/privacyPolicyData'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return {
    title: t('PHIVARA | นโยบายความเป็นส่วนตัว', 'PHIVARA | Privacy Policy'),
  }
}

// PDPA-oriented boilerplate privacy policy. Content is CMS-editable (see
// cms/globals/PrivacyPolicy.ts) — this is a starting draft, not legal
// advice, and the seeded copy still carries bracketed placeholders ([...])
// for facts (registered entity name, address, DPO contact) that need to
// come from PHIVARA's own legal/compliance team before this goes live.
// Linked from the site-wide PDPA consent banner ([locale]/layout.tsx) and
// the footer.
export const revalidate = 60

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [homeData, liveLocales, policy] = await Promise.all([
    getHomeData(locale),
    getPubliclyLiveLocales(),
    getPrivacyPolicyContent(locale),
  ])
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches, categories: getExpertiseCategoryOptions(homeData.hero) }).replace(/</g, '\\u003c')};`
  const updatedAtLabel =
    policy.updatedAtTh && policy.updatedAtEn ? t(policy.updatedAtTh, policy.updatedAtEn) : t('[วันที่ประกาศใช้]', '[effective date]')

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/article-detail.css" />

      <Script id="phivara-privacy-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>

      <SiteHeader page="home" topbar={homeData.topbar} locale={locale} localePath="/privacy-policy" liveLocales={liveLocales} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <span className="current">{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</span>
          </div>
        </div>
      </div>

      <main>
        <section style={{ padding: '64px 0 20px' }}>
          <div className="wrap" style={{ maxWidth: 860 }}>
            <div className="eyebrow">{t('PDPA · ความเป็นส่วนตัว', 'PDPA · PRIVACY')}</div>
            <h1>{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</h1>
            <p className="lead">
              {t('ปรับปรุงล่าสุด: ', 'Last updated: ')}
              {updatedAtLabel}
            </p>
          </div>
        </section>

        <section style={{ padding: '20px 0 80px' }}>
          <div className="wrap" style={{ maxWidth: 860 }}>
            <article className="prose">
              {policy.blocks.map((block, i): ReactNode => {
                if (block.type === 'heading') {
                  const Tag = block.tag === 'h3' ? 'h3' : 'h2'
                  return (
                    <Tag key={i} id={block.id}>
                      {block.text}
                    </Tag>
                  )
                }
                if (block.type === 'quote') {
                  return <blockquote key={i}>{block.text}</blockquote>
                }
                if (block.type === 'list') {
                  const ListTag = block.listType === 'number' ? 'ol' : 'ul'
                  return (
                    <ListTag key={i}>
                      {(block.items || []).map((item, li) => (
                        <li key={li}>{item}</li>
                      ))}
                    </ListTag>
                  )
                }
                return <p key={i}>{block.text}</p>
              })}
            </article>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
    </>
  )
}
