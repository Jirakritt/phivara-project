'use client'

import { useState } from 'react'

import { requestPasswordReset } from '@/lib/memberAuthClient'
import { localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

export default function ForgotPasswordForm({ locale }: { locale: LocaleCode }) {
  const t = translator(locale)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // Payload's forgot-password endpoint always returns success regardless
      // of whether the email exists, by design — prevents leaking which
      // emails are registered.
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'Something went wrong. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="auth-status">
        <div className="auth-status__icon pending">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
        </div>
        <p className="auth-panel__kicker">{t('ส่งลิงก์แล้ว', 'Link sent')}</p>
        <h1>{t('เช็คอีเมลของคุณ', 'Check your email')}</h1>
        <span className="email-chip">✉️ {email}</span>
        <p className="auth-panel__lead">
          {t('กดลิงก์ในอีเมลเพื่อตั้งรหัสผ่านใหม่ ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง เพื่อความปลอดภัยของบัญชีคุณ', 'Click the link in your email to set a new password. It expires in 1 hour for your account’s security.')}
        </p>
        <div className="auth-foot" style={{ textAlign: 'left', paddingTop: 22, marginTop: 22, borderTop: '1px solid var(--line)', width: '100%' }}>
          <a href={localizedHref(locale, '/login')}>{t('กลับไปเข้าสู่ระบบ', 'Back to login')}</a>
        </div>
      </div>
    )
  }

  return (
    <>
      <p className="auth-panel__kicker">{t('รีเซ็ตรหัสผ่าน', 'Reset password')}</p>
      <h1>{t('ลืมรหัสผ่านใช่ไหม?', 'Forgot your password?')}</h1>
      <p className="auth-panel__lead">{t('กรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้', 'Enter the email you registered with and we’ll send you a reset link.')}</p>

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <div className="auth-field">
          <span>{t('อีเมล', 'Email')} <span className="req">*</span></span>
          <input type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <span className="auth-field-error">{error}</span>}
        <button type="submit" className="auth-btn" disabled={submitting}>
          {submitting ? t('กำลังส่ง...', 'Sending...') : t('ส่งลิงก์รีเซ็ตรหัสผ่าน', 'Send reset link')}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </form>

      <div className="auth-foot">
        {t('นึกรหัสผ่านออกแล้ว?', 'Remember your password?')} <a href={localizedHref(locale, '/login')}>{t('กลับไปเข้าสู่ระบบ', 'Back to login')}</a>
      </div>
    </>
  )
}
