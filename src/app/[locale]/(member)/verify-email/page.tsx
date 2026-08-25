import { Suspense } from 'react'

import AuthShell, { AuthSteps } from '@/components/member/AuthShell'
import VerifyEmailClient from '@/components/member/VerifyEmailClient'
import { DEFAULT_LOCALE, isLocaleCode, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | ยืนยันอีเมล', 'PHIVARA | Verify email') }
}

// Step 2 (part 2) / entry point of the link a member clicks in their
// verification email — ?token=... — see VerifyEmailClient for the actual
// verify call + success/error states.
export default async function VerifyEmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE

  return (
    <AuthShell
      locale={locale}
      quoteTh="สิทธิพิเศษเฉพาะสมาชิก เพื่อการดูแลตัวเองที่ไม่มีที่สิ้นสุด"
      quoteEn="Exclusive member privileges, for a self-care journey without limits."
      pointsTh={['สิทธิประโยชน์ตามระดับสมาชิก Silver / Gold / Diamond', 'จัดการข้อมูลและติดตามสิทธิ์ของคุณได้ทุกที่']}
      pointsEn={['Tiered privileges — Silver / Gold / Diamond', 'Manage your details and track your benefits anywhere']}
    >
      <AuthSteps current={2} locale={locale} labelTh="ขั้นตอน 2 จาก 3 — ยืนยันอีเมล" labelEn="Step 2 of 3 — Verify email" />
      <Suspense fallback={null}>
        <VerifyEmailClient locale={locale} />
      </Suspense>
    </AuthShell>
  )
}
