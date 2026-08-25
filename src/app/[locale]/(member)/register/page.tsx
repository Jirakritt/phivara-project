import AuthShell, { AuthSteps } from '@/components/member/AuthShell'
import RegisterForm from '@/components/member/RegisterForm'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | สมัครสมาชิก', 'PHIVARA | Register') }
}

// Step 1 of 3 — ported from phivara-design-html/register.html, with a
// password field added (the mockup had none; see conversation scope
// confirmation — email+password auth, not passwordless/magic-link).
export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
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
      <AuthSteps current={1} locale={locale} labelTh="ขั้นตอน 1 จาก 3 — ยืนยันอีเมล" labelEn="Step 1 of 3 — Verify email" />

      <p className="auth-panel__kicker">{t('สมัครสมาชิก', 'Register')}</p>
      <h1>{t('เริ่มต้นเป็นสมาชิก PHIVARA', 'Begin your PHIVARA membership')}</h1>
      <p className="auth-panel__lead">{t('กรอกอีเมลของคุณ เราจะส่งลิงก์ยืนยันตัวตนไปให้ ใช้เวลาไม่ถึง 1 นาที', 'Enter your email and we’ll send a verification link — takes under a minute.')}</p>

      <RegisterForm locale={locale} />

      <div className="auth-divider">{t('หรือ', 'or')}</div>
      <a href={localizedHref(locale, '/login')} className="auth-btn-outline" style={{ width: '100%' }}>
        {t('เข้าสู่ระบบด้วยบัญชีที่มีอยู่', 'Log in with an existing account')}
      </a>

      <div className="auth-foot">
        {t('มีบัญชีอยู่แล้ว?', 'Already have an account?')} <a href={localizedHref(locale, '/login')}>{t('เข้าสู่ระบบ', 'Log in')}</a>
      </div>
    </AuthShell>
  )
}
