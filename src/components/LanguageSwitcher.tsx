'use client'

import { useEffect, useRef, useState } from 'react'

import { LOCALE_LABELS, localizedHref } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Replaces the old always-visible th/en pill pair in the topbar (see
// site-shell.css's .lang-toggle, now unused by this component) with a
// click-to-open dropdown — needed now that Admin can turn on any of the 14
// provisioned locales from the CMS, not just two. Client component (the
// only one in the header) purely for the open/closed menu state; every
// link inside is a real <a href> so language switching stays a real
// navigation, not a JS-only swap.
export default function LanguageSwitcher({
  locale,
  localePath,
  liveLocales,
}: {
  /** Current request locale. */
  locale: LocaleCode
  /** Current page's path with no locale prefix, e.g. '/', '/doctor/some-slug'. */
  localePath: string
  /** Locales an Admin has actually turned on for real visitors (see getPubliclyLiveLocales()). */
  liveLocales: LocaleCode[]
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Nothing to switch to (e.g. only Thai is publiclyLive right now) — don't
  // render a dropdown with a single, disabled-feeling option in it.
  if (liveLocales.length <= 1) return null

  return (
    <div className={`lang-select-box${open ? ' open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="lang-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{LOCALE_LABELS[locale] ?? locale.toUpperCase()}</span>
        <svg className="icon-arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="lang-dropdown-menu" role="listbox">
        {liveLocales.map((code) => (
          <a
            key={code}
            href={localizedHref(code, localePath)}
            role="option"
            aria-selected={code === locale}
            className={`lang-dropdown-item${code === locale ? ' active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {LOCALE_LABELS[code] ?? code.toUpperCase()}
          </a>
        ))}
      </div>
    </div>
  )
}
