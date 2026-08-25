import type { ReactNode } from 'react'

import { translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Shared left brand panel + card shell for every auth-flow page (register,
// verify, login, forgot/reset password, link-expired) — ported from
// phivara-design-html/css/auth.css's .auth-shell/.auth-card/.auth-brand.
// Deliberately standalone (no SiteHeader/SiteFooter) — matches every
// mockup, which are focused single-purpose conversion screens, not part of
// normal site browsing (member-profile is the exception; it uses the real
// site header/footer — see profile/page.tsx).
export default function AuthShell({
  locale,
  quoteTh,
  quoteEn,
  pointsTh,
  pointsEn,
  children,
}: {
  locale: LocaleCode
  quoteTh: string
  quoteEn: string
  pointsTh: string[]
  pointsEn: string[]
  children: ReactNode
}) {
  const t = translator(locale)
  return (
    <>
      <link rel="stylesheet" href="/css/auth.css" />
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-brand__logo">
              <img src="/assets/images/brand/emblem.png" alt="PHIVARA" />
              <span className="word">PHIVARA<small>{t('Private Membership', 'Private Membership')}</small></span>
            </div>
            <span className="auth-brand__eyebrow">PHIVARA PRIVATE MEMBERSHIP</span>
            <p className="auth-brand__quote">{t(quoteTh, quoteEn)}</p>
            <div className="auth-brand__points">
              {pointsTh.map((pTh, i) => (
                <p key={i}><span>✦</span> {t(pTh, pointsEn[i] ?? pTh)}</p>
              ))}
            </div>
          </div>
          <div className="auth-panel">{children}</div>
        </div>
      </div>
    </>
  )
}

// Shared step-dots used by register.html / register-check-email.html /
// verify-email.html / register-basic-info.html (steps 1–3 of the
// registration flow only — login/forgot-password/reset-password/
// link-expired don't show step progress in the mockups).
export function AuthSteps({ current, labelTh, labelEn, locale }: { current: 1 | 2 | 3; labelTh: string; labelEn: string; locale: LocaleCode }) {
  const t = translator(locale)
  return (
    <div className="auth-steps">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`auth-steps__dot${n === current ? ' active' : n < current ? ' done' : ''}`} />
      ))}
      <span className="auth-steps__label">{t(labelTh, labelEn)}</span>
    </div>
  )
}
