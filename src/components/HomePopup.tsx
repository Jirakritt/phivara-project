'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Homepage "special day" popup. Content/schedule come from the Popups
// collection via /api/popup/active (evaluated per request — see that
// route's comment for why this isn't baked into the ISR homepage).
//
// Re-show rule: remember WHEN this campaign was last shown in
// localStorage; on the next visit/refresh show it again only once the
// admin-configured interval (default 15 min) has passed since then. The
// storage entry is keyed to the campaign's `key` (popup id + image
// identity), so a new popup or a replaced image shows immediately.
// localStorage unavailable (private mode) → shows on every load; accepted.
//
// Fullscreen splash: same schedule/cooldown/gate logic, different markup —
// a <picture> picks the desktop or mobile image by viewport (phones and any
// portrait screen get the 9:16 one), a gold "enter website" button (goes to
// the CMS link, or just closes the splash when there is none / it points at
// the page already open) and a small × in the corner. No backdrop-click
// dismissal (the image IS the backdrop); ESC still closes.
//
// Ordering with the PDPA cookie banner: (public)/page.tsx sets
// window.__PHIVARA_POPUP_GATE__ = 'pending' before this runs and
// consent-banner.js holds the banner back while it's 'pending'/'open'.
// This component MUST move the gate to 'done' on every path (no popup,
// cooldown, error, or closed) so the banner is never withheld for good.

interface ActivePopup {
  key: string
  // 'modal' = the original centred image box; 'fullscreen' = full-viewport
  // splash (desktop image + mobile image + "enter website" button).
  mode: 'modal' | 'fullscreen'
  imageUrl: string
  mobileImageUrl: string | null
  buttonLabel: string
  width: number | null
  height: number | null
  alt: string
  linkUrl: string | null
  reshowIntervalMinutes: number
}

const STORAGE_KEY = 'phivara_popup'

type PopupWindow = Window & { __PHIVARA_POPUP_GATE__?: string; phivaraPopupDone?: () => void }

function releaseGate() {
  const w = window as PopupWindow
  w.__PHIVARA_POPUP_GATE__ = 'done'
  if (typeof w.phivaraPopupDone === 'function') w.phivaraPopupDone()
}

function wasShownRecently(popup: ActivePopup): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const saved = JSON.parse(raw) as { key?: string; shownAt?: number }
    if (saved.key !== popup.key || typeof saved.shownAt !== 'number') return false
    return Date.now() - saved.shownAt < popup.reshowIntervalMinutes * 60_000
  } catch {
    return false
  }
}

function markShown(popup: ActivePopup) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ key: popup.key, shownAt: Date.now() }))
  } catch {
    /* storage unavailable — popup will just show again next load */
  }
}

// Wait for the homepage's full-screen #preloader (PreloaderController adds
// `.done`, within ~0.5–4s) so the popup doesn't appear underneath/behind it.
function waitForPreloader(): Promise<void> {
  return new Promise((resolve) => {
    const started = Date.now()
    const tick = () => {
      const el = document.getElementById('preloader')
      if (!el || el.classList.contains('done') || Date.now() - started > 5000) resolve()
      else window.setTimeout(tick, 150)
    }
    tick()
  })
}

// Same media query the <picture> below uses, so the preloaded file is the one
// the browser actually renders.
const MOBILE_QUERY = '(max-width: 768px), (orientation: portrait)'
function isMobileViewport(): boolean {
  try {
    return window.matchMedia(MOBILE_QUERY).matches
  } catch {
    return false
  }
}

function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = window.setTimeout(() => resolve(false), 8000)
    img.onload = () => {
      window.clearTimeout(timer)
      resolve(true)
    }
    img.onerror = () => {
      window.clearTimeout(timer)
      resolve(false)
    }
    img.src = src
  })
}

export default function HomePopup({ locale }: { locale: LocaleCode }) {
  const t = translator(locale)
  const [popup, setPopup] = useState<ActivePopup | null>(null)
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const ctaRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // ?booking=open auto-opens the VIP booking modal (LINE Rich Menu
        // link) — don't stack a promo on top of that.
        if (new URLSearchParams(window.location.search).get('booking') === 'open') return
        const res = await fetch(`/api/popup/active?locale=${encodeURIComponent(locale)}`, { cache: 'no-store' })
        if (!res.ok) return
        const body = (await res.json()) as { popup: ActivePopup | null }
        const active = body.popup
        if (!active || wasShownRecently(active)) return
        const wantMobile = active.mode === 'fullscreen' && isMobileViewport()
        if (!(await preloadImage((wantMobile && active.mobileImageUrl) || active.imageUrl))) return
        await waitForPreloader()
        if (cancelled) return
        markShown(active)
        ;(window as PopupWindow).__PHIVARA_POPUP_GATE__ = 'open'
        previouslyFocused.current = document.activeElement as HTMLElement | null
        setPopup(active)
        setOpen(true)
      } catch {
        /* never let the popup break the page */
      } finally {
        // If we didn't open a popup, let the cookie banner proceed.
        if (!cancelled && (window as PopupWindow).__PHIVARA_POPUP_GATE__ !== 'open') releaseGate()
      }
    })()
    return () => {
      cancelled = true
    }
  }, [locale])

  const close = useCallback(() => {
    setOpen(false)
    releaseGate()
    previouslyFocused.current?.focus?.()
  }, [])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ;(ctaRef.current || closeRef.current)?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  if (!popup || !open) return null

  if (popup.mode === 'fullscreen') {
    const url = popup.linkUrl
    const isExternal = url ? /^https?:\/\//i.test(url) : false
    // A link to the page that's already open would just reload it — treat
    // that (and no link at all) as "close the splash".
    const samePage = (() => {
      if (!url) return true
      try {
        const u = new URL(url, window.location.origin)
        return u.origin === window.location.origin && u.pathname + u.search === window.location.pathname + window.location.search
      } catch {
        return false
      }
    })()
    const label = popup.buttonLabel
    const arrow = (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    )
    return (
      <div className="home-splash" role="dialog" aria-modal="true" aria-label={popup.alt}>
        <picture>
          {popup.mobileImageUrl && <source media={MOBILE_QUERY} srcSet={popup.mobileImageUrl} />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="home-splash-img" src={popup.imageUrl} alt={popup.alt} />
        </picture>
        <button ref={closeRef} type="button" className="home-splash-close" aria-label={t('ปิด', 'Close')} onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {samePage ? (
          <button ref={ctaRef as React.RefObject<HTMLButtonElement>} type="button" className="home-splash-cta" onClick={close}>
            <span>{label}</span>
            {arrow}
          </button>
        ) : (
          <a
            ref={ctaRef as React.RefObject<HTMLAnchorElement>}
            className="home-splash-cta"
            href={url as string}
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={close}
          >
            <span>{label}</span>
            {arrow}
          </a>
        )}
      </div>
    )
  }

  const external = popup.linkUrl ? /^https?:\/\//i.test(popup.linkUrl) : false
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="home-popup-img"
      src={popup.imageUrl}
      alt={popup.alt}
      width={popup.width || undefined}
      height={popup.height || undefined}
    />
  )

  return (
    <div
      className="home-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={popup.alt}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="home-popup">
        <button ref={closeRef} type="button" className="home-popup-close" aria-label={t('ปิด', 'Close')} onClick={close}>
          ×
        </button>
        {popup.linkUrl ? (
          <a
            href={popup.linkUrl}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={close}
          >
            {img}
          </a>
        ) : (
          img
        )}
      </div>
    </div>
  )
}
