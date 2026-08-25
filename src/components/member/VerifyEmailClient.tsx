'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { verifyMemberEmail } from '@/lib/memberAuthClient'
import { localizedHref, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Payload's own email-verification endpoint (POST /api/members/verify/:id)
// only marks the account verified — it does NOT log the visitor in (proving
// you clicked a link in your inbox isn't the same as proving you know the
// password). So unlike the mockup's direct verify-email -> register-basic-info
// link, this redirects to /login instead; login itself then sends a
// first-time member on to /register/basic-info (see LoginForm.tsx).
export default function VerifyEmailClient({ locale }: { locale: LocaleCode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = translator(locale)
  const [state, setState] = useState<'checking' | 'ok' | 'error'>('checking')
  // React 18 Strict Mode (dev only) mounts, cleans up, then re-mounts every
  // component once — which fires this effect twice. The old `cancelled`
  // flag only guarded against a stale *state update*, not against sending
  // the request itself twice, so both calls to POST
  // /api/members/verify/:token actually went out. The verify token is
  // one-time-use (Payload deletes/invalidates it on success), so the first
  // call correctly verified the account while the second got a 403 —
  // whichever response arrived last is what set `state`, so a real
  // successful verification could still land on the "link expired" screen.
  // Confirmed live: login worked immediately after seeing that false
  // "expired" page, proving the account really had been verified. This ref
  // (persists across the mount/cleanup/remount cycle, unlike a variable
  // captured by the effect closure) makes sure the network call itself
  // only ever fires once per token.
  const requested = useRef(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setState('error')
      return
    }
    if (requested.current) return
    requested.current = true
    let cancelled = false
    verifyMemberEmail(token).then((res) => {
      if (cancelled) return
      if (res.ok) {
        setState('ok')
      } else {
        router.replace(`${localizedHref(locale, '/link-expired')}?reason=verify`)
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state === 'checking') {
    return (
      <div className="auth-status">
        <p className="auth-panel__kicker">{t('กำลังยืนยัน...', 'Verifying...')}</p>
        <h1>{t('กำลังตรวจสอบลิงก์ของคุณ', 'Checking your link')}</h1>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="auth-status">
        <div className="auth-status__icon error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
        </div>
        <p className="auth-panel__kicker">{t('ลิงก์ใช้งานไม่ได้', 'Link not valid')}</p>
        <h1>{t('ไม่พบลิงก์ยืนยันที่ถูกต้อง', "We couldn't find a valid verification link")}</h1>
        <a href={localizedHref(locale, '/register')} className="auth-btn">{t('กลับไปสมัครสมาชิก', 'Back to register')}</a>
      </div>
    )
  }

  return (
    <div className="auth-status">
      <div className="auth-status__icon ok">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 6L9 17l-5-5" /></svg>
      </div>
      <p className="auth-panel__kicker">{t('ยืนยันอีเมลสำเร็จ', 'Email verified')}</p>
      <h1>{t('ยินดีต้อนรับสู่ PHIVARA', 'Welcome to PHIVARA')}</h1>
      <p className="auth-panel__lead">
        {t(
          'อีเมลของคุณได้รับการยืนยันแล้ว เข้าสู่ระบบเพื่อกรอกข้อมูลเบื้องต้นและเริ่มใช้งานสิทธิสมาชิกของคุณ',
          'Your email is verified. Log in to complete your basic info and start using your membership.',
        )}
      </p>
      <a href={localizedHref(locale, '/login')} className="auth-btn">
        {t('เข้าสู่ระบบ', 'Log in')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </a>
    </div>
  )
}
