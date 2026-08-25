'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Every page.tsx renders its own `<div id="preloader">` (see e.g.
// (public)/page.tsx, (member)/profile/page.tsx) — a full-bleed overlay that
// used to be dismissed by public/js/site-runtime.js's initPreloader(),
// added via a `<Script strategy="afterInteractive">` tag. That worked fine
// for the very first page a visitor lands on, but Next.js dedupes
// `next/script` tags by `src`: once loaded, it never re-executes on
// subsequent client-side navigations (next/link clicks, router.push()
// redirects like the one LoginForm/RegisterForm use after a successful
// submit). Each of those navigations mounts a BRAND NEW `#preloader` div
// that initPreloader() never touches again, since its one-time run already
// happened against the very first page's (now-unmounted) node — so the new
// overlay just sits there forever, fully blocking the page underneath
// (`pointer-events:none` only gets applied by the `.done` class, which
// never gets added). Confirmed live: the post-login/register redirect left
// the profile page permanently hidden behind a frozen loading screen.
//
// Fixed by moving the dismiss logic here, mounted once in the root
// [locale]/layout.tsx (which persists across every client-side
// navigation instead of remounting). `usePathname()` changes on every
// route transition — including router.push() ones — which re-runs this
// effect and re-grabs whatever `#preloader` node is currently in the DOM,
// full page load or not. Renders nothing itself; it only ever reaches into
// the DOM for the preloader/progressBar nodes owned by each page.
export default function PreloaderController() {
  const pathname = usePathname()

  useEffect(() => {
    const preloader = document.getElementById('preloader')
    if (!preloader) return

    let hidden = false
    const hide = () => {
      if (hidden) return
      hidden = true
      preloader.classList.add('done')
    }

    // Same timing as the old initPreloader(): a short delay so the reveal
    // doesn't feel like a flash, plus a safety-net timeout so a slow/blocked
    // resource (or, previously, a navigation this effect didn't cover) can
    // never leave the overlay stuck indefinitely.
    const revealTimer = window.setTimeout(hide, 500)
    const safetyTimer = window.setTimeout(hide, 4000)

    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(safetyTimer)
    }
  }, [pathname])

  return null
}
