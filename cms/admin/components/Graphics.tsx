// Custom admin-panel branding — replaces Payload's default logo/icon with the
// PHIVARA emblem. Wired via payload.config.ts admin.components.graphics.
// Reuses the same asset already served for the public site
// (public/assets/images/brand/emblem.png), so no new file to add.
//
// graphics.Logo: shown on the Login view (larger).
// graphics.Icon: shown above the Nav in the admin panel (small, square).
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
      style={{ height: '24px', width: 'auto' }}
    />
  )
}
