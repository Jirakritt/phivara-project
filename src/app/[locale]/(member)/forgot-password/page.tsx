import AuthShell from '@/components/member/AuthShell'
import ForgotPasswordForm from '@/components/member/ForgotPasswordForm'
import { DEFAULT_LOCALE, isLocaleCode, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | ลืมรหัสผ่าน', 'PHIVARA | Forgot password') }
}

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE

  return (
    <AuthShell
      locale={locale}
      quoteTh="เราจะดูแลคุณให้กลับเข้าใช้งานได้อย่างปลอดภัย"
      quoteEn="We'll get you back in, safely."
      pointsTh={['ลิงก์ตั้งรหัสผ่านใหม่ปลอดภัย หมดอายุอัตโนมัติ', 'ไม่มีใครเห็นรหัสผ่านเดิมของคุณ แม้แต่ทีมงาน PHIVARA']}
      pointsEn={['A secure reset link that expires automatically', 'Nobody — not even the PHIVARA team — ever sees your old password']}
    >
      <ForgotPasswordForm locale={locale} />
    </AuthShell>
  )
}
