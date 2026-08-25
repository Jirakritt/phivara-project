'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { loginMember } from '@/lib/memberAuthClient'
import { localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'
import { hasCompleteProfile } from '@/lib/memberProfile'

export default function LoginForm({ locale }: { locale: LocaleCode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = translator(locale)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { user } = await loginMember(email, password)
      // First login after email verification: no profile on file yet —
      // send them to finish register-basic-info (step 3) before the
      // profile. hasCompleteProfile() also covers dob/preferredBranch now
      // (see that file's comment), so a member who's only ever done the
      // old firstName/lastName/phone-only version of step 3 gets sent back
      // to fill in the rest too.
      const hasProfile = hasCompleteProfile(user)
      const redirectTo = searchParams.get('redirect')
      router.push(hasProfile ? redirectTo || localizedHref(locale, '/profile') : localizedHref(locale, '/register/basic-info'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'Incorrect email or password'))
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" noValidate onSubmit={handleSubmit}>
      <div className="auth-field">
        <span>{t('อีเมล', 'Email')} <span className="req">*</span></span>
        <input type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="auth-field">
        <span>{t('รหัสผ่าน', 'Password')} <span className="req">*</span></span>
        <div className="auth-password-row">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? t('ซ่อน', 'Hide') : t('แสดง', 'Show')}
          </button>
        </div>
        {error && <span className="auth-field-error">{error}</span>}
      </div>

      <div className="auth-row-between">
        <span />
        <a href={localizedHref(locale, '/forgot-password')}>{t('ลืมรหัสผ่าน?', 'Forgot password?')}</a>
      </div>

      <button type="submit" className="auth-btn" disabled={submitting}>
        {submitting ? t('กำลังเข้าสู่ระบบ...', 'Logging in...') : t('เข้าสู่ระบบ', 'Log in')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </form>
  )
}
