import NotFoundContent from '@/components/NotFoundContent'

// Handles notFound() calls thrown from a *matched* route in this group
// (e.g. /doctor/[slug] for a slug that doesn't exist — see the notFound()
// calls in doctor/[slug], article/[slug], program/[slug], branch/[slug]).
// RootLayout ((frontend)/layout.tsx) already supplies <html>/<body>, fonts,
// and main_gpt.css/site-shell.css/consent-banner.css, so this only needs
// its own page-specific CSS plus the preloader shell every page renders.
// For URLs that don't match any route at all, see src/app/global-not-found.tsx —
// this file alone doesn't catch those (see NotFoundContent's comment for why).
export const metadata = {
  title: 'PHIVARA | ไม่พบหน้าที่คุณค้นหา',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/journal-card.css" />
      <link rel="stylesheet" href="/css/404.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <div id="preloader">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <NotFoundContent />
    </>
  )
}
