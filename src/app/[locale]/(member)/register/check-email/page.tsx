import AuthShell, { AuthSteps } from '@/components/member/AuthShell'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | ตรวจสอบอีเมลของคุณ', 'PHIVARA | Check your email') }
}

// Step 2 (part 1) — ported from register-check-email.html. Purely
// informational; the actual "resend" action re-submits the register form
// (Payload's create endpoint re-sends the verification email on repeat
// calls with the same email as long as the account is still unverified).
export default async function CheckEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ email?: string }>
}) {
  const { locale: rawLocale } = await params
  const { email } = await searchParams
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)

  return (
    <AuthShell
      locale={locale}
      quoteTh="สิทธิพิเศษเฉพาะสมาชิก เพื่อการดูแลตัวเองที่ไม่มีที่สิ้นสุด"
      quoteEn="Exclusive member privileges, for a self-care journey without limits."
      pointsTh={[
        'สิทธิประโยชน์ตามระดับสมาชิก Silver / Gold / Diamond',
        'จัดการข้อมูลและติดตามสิทธิ์ของคุณได้ทุกที่',
        'ทีม Concierge ส่วนตัวดูแลทุกการนัดหมาย',
      ]}
      pointsEn={[
        'Tiered privileges — Silver / Gold / Diamond',
        'Manage your details and track your benefits anywhere',
        'A personal Concierge team for every appointment',
      ]}
    >
      <AuthSteps current={2} locale={locale} labelTh="ขั้นตอน 2 จาก 3 — รอยืนยันอีเมล" labelEn="Step 2 of 3 — Awaiting verification" />

      <div className="auth-status">
        <div className="auth-status__icon pending">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
        </div>
        <p className="auth-panel__kicker">{t('ตรวจสอบอีเมลของคุณ', 'Check your email')}</p>
        <h1>{t('เราส่งลิงก์ยืนยันไปให้แล้ว', 'We sent you a verification link')}</h1>
        {email && <span className="email-chip">✉️ {email}</span>}
        <p className="auth-panel__lead">
          {t(
            'กดลิงก์ในอีเมลเพื่อยืนยันตัวตนและดำเนินการต่อ ถ้าไม่เจอในกล่องข้อความหลัก ลองเช็คโฟลเดอร์สแปม/โปรโมชั่นด้วย',
            'Click the link in your email to verify and continue. If you don’t see it, check your spam/promotions folder too.',
          )}
        </p>

        <div className="auth-foot" style={{ textAlign: 'left', paddingTop: 22, marginTop: 22, borderTop: '1px solid var(--line)', width: '100%' }}>
          {t('กรอกอีเมลผิด?', 'Entered the wrong email?')} <a href={localizedHref(locale, '/register')}>{t('กลับไปแก้ไข', 'Go back')}</a>
        </div>
      </div>
    </AuthShell>
  )
}
