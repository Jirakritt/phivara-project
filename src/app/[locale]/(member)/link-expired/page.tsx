import AuthShell from '@/components/member/AuthShell'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | ลิงก์หมดอายุ', 'PHIVARA | Link expired') }
}

// Shared error state for both the email-verification link and the
// password-reset link (ported from link-expired.html) — ?reason=verify|reset
// only changes the "get a new link" destination.
export default async function LinkExpiredPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ reason?: string }>
}) {
  const { locale: rawLocale } = await params
  const { reason } = await searchParams
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const newLinkHref = localizedHref(locale, reason === 'reset' ? '/forgot-password' : '/register')

  return (
    <AuthShell
      locale={locale}
      quoteTh="เพื่อความปลอดภัยของบัญชีคุณ ลิงก์ทุกลิงก์มีอายุการใช้งานจำกัด"
      quoteEn="For your account's security, every link has a limited lifetime."
      pointsTh={['ขอลิงก์ใหม่ได้ทันที ไม่มีค่าใช้จ่าย']}
      pointsEn={['Request a new link anytime, at no cost']}
    >
      <div className="auth-status">
        <div className="auth-status__icon error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
        </div>
        <p className="auth-panel__kicker">{t('ลิงก์ใช้งานไม่ได้แล้ว', 'This link no longer works')}</p>
        <h1>{t('ลิงก์นี้หมดอายุหรือถูกใช้ไปแล้ว', 'This link has expired or was already used')}</h1>
        <p className="auth-panel__lead">
          {t('ลิงก์ยืนยันตัวตน/ตั้งรหัสผ่านมีอายุการใช้งานจำกัดเพื่อความปลอดภัย ขอลิงก์ใหม่ได้เลย ใช้เวลาไม่ถึง 1 นาที', 'Verification/reset links have a limited lifetime for security. Request a new one — it takes under a minute.')}
        </p>
        <a href={newLinkHref} className="auth-btn">
          {t('ขอลิงก์ใหม่', 'Request a new link')}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
        <div className="auth-foot" style={{ textAlign: 'left', paddingTop: 22, marginTop: 22, borderTop: '1px solid var(--line)', width: '100%' }}>
          {t('หรือ', 'Or')} <a href={localizedHref(locale, '/login')}>{t('กลับไปเข้าสู่ระบบ', 'back to login')}</a>
        </div>
      </div>
    </AuthShell>
  )
}
