// Custom admin-panel branding — replaces Payload's default logo/icon with the
// PHIVARA emblem. Wired via payload.config.ts admin.components.graphics.
// Reuses the same asset already served for the public site
// (public/assets/images/brand/emblem.png), so no new file to add.
//
// graphics.Logo: shown on the Login view (larger).
// graphics.Icon: shown inside the breadcrumb's home link, top-left of every
// admin page (Payload's StepNav — see @payloadcms/ui's
// elements/StepNav/index.scss `.step-nav__home`, which is a FIXED 18x18px
// box, 16x16px below the `mid-break` breakpoint). Icon used to render at a
// hardcoded 24px height with width:auto — bigger than that box on every
// screen size, with nothing clipping the overflow, so the emblem visually
// spilled into the "/" separator right after it (reported as the logo
// looking "crooked" 2026-09-09). Filling 100%/100% + objectFit:'contain'
// instead makes it always exactly match whatever box Payload gives it,
// at any breakpoint, with no hardcoded pixel value to drift out of sync
// again if Payload's own CSS ever changes that box size.
export function Logo() {
  return (
    <img
      src="/assets/images/brand/emblem.png"
      alt="PHIVARA"
      style={{ height: '48px', width: 'auto' }}
    />
  )
}

export function Icon() {
  return (
    <img
      src="/assets/images/brand/emblem.png"
      alt="PHIVARA"
      style={{ height: '100%', width: '100%', objectFit: 'contain', display: 'block' }}
    />
  )
}
