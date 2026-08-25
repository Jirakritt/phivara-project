'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { resetMemberPassword } from '@/lib/memberAuthClient'
import { localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Payload's reset-password endpoint sets the session cookie itself on
// success (see cms/collections/Members.ts's comment) — matches the
// mockup's "ระบบพาเข้าสู่โปรไฟล์ของคุณทันที ไม่ต้อง login ซ้ำ" copy exactly,
// no extra engineering needed to make that true.
export default function ResetPasswordForm({ locale }: { locale: LocaleCode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = translator(locale)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const token = searchParams.get('token')
    if (!token) {
      router.replace(`${localizedHref(locale, '/link-expired')}?reason=reset`)
      return
    }
    if (password.length < 8) {
      setError(t('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', 'Password must be at least 8 characters'))
      return
    }
    if (password !== confirm) {
      setError(t('รหัสผ่านไม่ตรงกัน', 'Passwords do not match'))
      return
    }
    setSubmitting(true)
    try {
      await resetMemberPassword(token, password)
      router.push(localizedHref(locale, '/profile'))
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (/expired|invalid|token/i.test(message)) {
        router.replace(`${localizedHref(locale, '/link-expired')}?reason=reset`)
        return
      }
      setError(message || t('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'Something went wrong. Please try again.'))
      setSubmitting(false)
    }
  }

  return (
    <>
      <p className="auth-panel__kicker">{t('ตั้งรหัสผ่านใหม่', 'Set new password')}</p>
      <h1>{t('สร้างรหัสผ่านใหม่ของคุณ', 'Create your new password')}</h1>

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <div className="auth-field">
          <span>{t('รหัสผ่านใหม่', 'New password')} <span className="req">*</span></span>
          <div className="auth-password-row">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? t('ซ่อน', 'Hide') : t('แสดง', 'Show')}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <span>{t('ยืนยันรหัสผ่านใหม่', 'Confirm new password')} <span className="req">*</span></span>
          <div className="auth-password-row">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {error && <span className="auth-field-error">{error}</span>}
        </div>

        <button type="submit" className="auth-btn" disabled={submitting}>
          {submitting ? t('กำลังบันทึก...', 'Saving...') : t('ตั้งรหัสผ่านใหม่และเข้าสู่ระบบ', 'Set password and log in')}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </form>
    </>
  )
}
