import { headers } from 'next/headers'
import Script from 'next/script'
import { redirect } from 'next/navigation'

import ProfileDashboard from '@/components/member/ProfileDashboard'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getBranchesListing } from '@/lib/branchesData'
import { getHomeData } from '@/lib/homeData'
import { getMemberPrivileges } from '@/lib/memberPrivileges'
import { getMembershipTiers } from '@/lib/membershipTiers'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import { authenticateMember } from '@/lib/memberSession'
import { hasCompleteProfile } from '@/lib/memberProfile'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | บัญชีของฉัน', 'PHIVARA | My Account') }
}

// Ported from member-profile-v2-nocontainer.html — unlike the auth-flow
// pages, this uses the real site header/footer (part of normal browsing,
// not a focused conversion step — matches the mockup's own
// phivara-header/phivara-footer usage).
export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)

  const { member: user } = await authenticateMember(await headers())
  if (!user) {
    redirect(`${localizedHref(locale, '/login')}?redirect=${encodeURIComponent(localizedHref(locale, '/profile'))}`)
  }
  if (!hasCompleteProfile(user)) {
    redirect(localizedHref(locale, '/register/basic-info'))
  }

  const [homeData, liveLocales, branchDocs, privileges, tiers] = await Promise.all([
    getHomeData(locale),
    getPubliclyLiveLocales(),
    getBranchesListing(locale),
    getMemberPrivileges(locale),
    getMembershipTiers(locale),
  ])
  const branches = branchDocs.map((b) => ({ slug: b.slug, nameTh: b.nameTh, nameEn: b.nameEn }))

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/site-shell.css" />

      <div id="preloader">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>

      <SiteHeader page="notFound" topbar={homeData.topbar} locale={locale} localePath="/profile" liveLocales={liveLocales} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <span className="current">{t('บัญชีของฉัน', 'My Account')}</span>
          </div>
        </div>
      </div>

      <ProfileDashboard locale={locale} member={user} branches={branches} privileges={privileges} tiers={tiers} />

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
    </>
  )
}
