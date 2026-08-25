import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import AuthShell, { AuthSteps } from '@/components/member/AuthShell'
import BasicInfoForm from '@/components/member/BasicInfoForm'
import { getBranchesListing } from '@/lib/branchesData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'
import { authenticateMember } from '@/lib/memberSession'
import { hasCompleteProfile } from '@/lib/memberProfile'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return { title: t('PHIVARA | กรอกข้อมูลเบื้องต้น', 'PHIVARA | Basic info') }
}

// Step 3 of 3 — requires a real member session (reached via /login right
// after email verification, or by revisiting this URL directly while
// logged in). No session -> back to login; already has a complete profile
// -> straight to the profile page instead of re-asking.
export default async function BasicInfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE

  const { member: user } = await authenticateMember(await headers())
  if (!user) {
    redirect(`${localizedHref(locale, '/login')}?redirect=${encodeURIComponent(localizedHref(locale, '/register/basic-info'))}`)
  }
  if (hasCompleteProfile(user)) {
    redirect(localizedHref(locale, '/profile'))
  }

  const branchDocs = await getBranchesListing(locale)
  const branches = branchDocs.map((b) => ({ slug: b.slug, nameTh: b.nameTh, nameEn: b.nameEn }))

  return (
    <AuthShell
      locale={locale}
      quoteTh="สิทธิพิเศษเฉพาะสมาชิก เพื่อการดูแลตัวเองที่ไม่มีที่สิ้นสุด"
      quoteEn="Exclusive member privileges, for a self-care journey without limits."
      pointsTh={['สิทธิประโยชน์ตามระดับสมาชิก Silver / Gold / Diamond', 'จัดการข้อมูลและติดตามสิทธิ์ของคุณได้ทุกที่', 'ทีม Concierge ส่วนตัวดูแลทุกการนัดหมาย']}
      pointsEn={['Tiered privileges — Silver / Gold / Diamond', 'Manage your details and track your benefits anywhere', 'A personal Concierge team for every appointment']}
    >
      <AuthSteps current={3} locale={locale} labelTh="ขั้นตอน 3 จาก 3 — ข้อมูลเบื้องต้น" labelEn="Step 3 of 3 — Basic info" />

      <p className="auth-panel__kicker">{translator(locale)('เกือบเสร็จแล้ว', 'Almost there')}</p>
      <h1>{translator(locale)('ขอข้อมูลเบื้องต้นของคุณ', 'A few details about you')}</h1>
      <p className="auth-panel__lead">{translator(locale)('แค่นี้ก่อน — แก้ไขหรือเพิ่มเติมได้ทุกเมื่อภายหลังจากหน้าโปรไฟล์ของคุณ', "That's it for now — you can edit any of this later from your profile.")}</p>

      <BasicInfoForm locale={locale} memberId={user.id} branches={branches} />
    </AuthShell>
  )
}
