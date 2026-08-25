import { Suspense } from 'react'

import AuthShell from '@/components/member/AuthShell'
import ResetPasswordForm from '@/components/member/ResetPasswordForm'
import { DEFAULT_LOCALE, isLocaleCode, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | ตั้งรหัสผ่านใหม่', 'PHIVARA | Reset password') }
}

export default async function ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE

  return (
    <AuthShell
      locale={locale}
      quoteTh="ตั้งรหัสผ่านใหม่ให้ปลอดภัย เข้าใช้งานได้ทันที"
      quoteEn="A secure new password, and you're straight back in."
      pointsTh={['หลังตั้งรหัสผ่านใหม่ ระบบพาเข้าสู่โปรไฟล์ของคุณทันที ไม่ต้อง login ซ้ำ']}
      pointsEn={["After setting a new password, you're taken straight to your profile — no need to log in again"]}
    >
      <Suspense fallback={null}>
        <ResetPasswordForm locale={locale} />
      </Suspense>
    </AuthShell>
  )
}
