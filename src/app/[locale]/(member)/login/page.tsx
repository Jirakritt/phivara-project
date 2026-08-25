import { Suspense } from 'react'

import AuthShell from '@/components/member/AuthShell'
import LoginForm from '@/components/member/LoginForm'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | เข้าสู่ระบบ', 'PHIVARA | Log in') }
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)

  return (
    <AuthShell
      locale={locale}
      quoteTh="ยินดีต้อนรับกลับมา สิทธิพิเศษของคุณรออยู่"
      quoteEn="Welcome back — your privileges are waiting."
      pointsTh={['ดูสิทธิประโยชน์ตามระดับสมาชิกของคุณ', 'จัดการข้อมูลส่วนตัวและความยินยอมได้เอง', 'ทีม Concierge ส่วนตัวดูแลทุกการนัดหมาย']}
      pointsEn={['See your tier-based privileges', 'Manage your details and consent yourself', 'A personal Concierge team for every appointment']}
    >
      <p className="auth-panel__kicker">{t('สมาชิก PHIVARA', 'PHIVARA Member')}</p>
      <h1>{t('เข้าสู่ระบบ', 'Log in')}</h1>
      <p className="auth-panel__lead">{t('เข้าสู่ระบบเพื่อจัดการโปรไฟล์และสิทธิสมาชิกของคุณ', 'Log in to manage your profile and membership privileges.')}</p>

      <Suspense fallback={null}>
        <LoginForm locale={locale} />
      </Suspense>

      <div className="auth-foot">
        {t('ยังไม่มีบัญชี?', "Don't have an account?")} <a href={localizedHref(locale, '/register')}>{t('สมัครสมาชิก', 'Register')}</a>
      </div>
    </AuthShell>
  )
}
