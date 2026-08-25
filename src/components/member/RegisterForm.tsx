'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { registerMember } from '@/lib/memberAuthClient'
import { localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Step 1 of 3 (see phivara-design-html/register.html) — email + password +
// terms acceptance. Deliberately no name/phone here (those are collected in
// step 3, register/basic-info, after the account exists and its email is
// verified) — see cms/collections/Members.ts's comment on why
// firstName/lastName/phone are optional at the schema level.
export default function RegisterForm({ locale }: { locale: LocaleCode }) {
  const router = useRouter()
  const t = translator(locale)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!acceptTerms) {
      setError(t('กรุณายอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัว', 'Please accept the Terms of Use and Privacy Policy'))
      return
    }
    if (password.length < 8) {
      setError(t('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', 'Password must be at least 8 characters'))
      return
    }
    setSubmitting(true)
    try {
      await registerMember(email, password, locale)
      router.push(`${localizedHref(locale, '/register/check-email')}?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'Something went wrong. Please try again.'))
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      <div className="auth-field">
        <span>{t('อีเมล', 'Email')} <span className="req">*</span></span>
        <input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <span>{t('รหัสผ่าน', 'Password')} <span className="req">*</span></span>
        <input
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="auth-field-hint">{t('อย่างน้อย 8 ตัวอักษร', 'At least 8 characters')}</span>
      </div>

      <div className="auth-checkbox-row">
        <input type="checkbox" id="acceptTerms" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
        <label htmlFor="acceptTerms">
          {t('ฉันยอมรับ', 'I accept the')} <a href={localizedHref(locale, '/privacy-policy')}>{t('ข้อตกลงการใช้งาน', 'Terms of Use')}</a>{' '}
          {t('และ', 'and')} <a href={localizedHref(locale, '/privacy-policy')}>{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</a> {t('ของ PHIVARA', 'of PHIVARA')}
        </label>
      </div>

      {error && <span className="auth-field-error">{error}</span>}

      <button type="submit" className="auth-btn" disabled={submitting}>
        {submitting ? t('กำลังส่ง...', 'Sending...') : t('ส่งลิงก์ยืนยัน', 'Send verification link')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </form>
  )
}
