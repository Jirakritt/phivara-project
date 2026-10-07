'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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
// Ordering with the PDPA cookie banner: (public)/page.tsx sets
// window.__PHIVARA_POPUP_GATE__ = 'pending' before this runs and
// consent-banner.js holds the banner back while it's 'pending'/'open'.
// This component MUST move the gate to 'done' on every path (no popup,
// cooldown, error, or closed) so the banner is never withheld for good.

interface ActivePopup {
  key: string
  imageUrl: string
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
  const [popup, setPopup] = useState<ActivePopup | null>(null)
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
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
        if (!(await preloadImage(active.imageUrl))) return
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
    closeRef.current?.focus()
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
        <button ref={closeRef} type="button" className="home-popup-close" aria-label={locale === 'th' ? 'ปิด' : 'Close'} onClick={close}>
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
