// Originally ported 1:1 from phivara-design-html/js/site-shell.js's
// <phivara-footer> custom element — see SiteHeader.tsx for why this is a
// React component instead of a custom element, and for why internal links
// here are plain <a> tags rather than next/link (forces a full page load so
// each page's legacy JS re-initializes instead of silently no-op'ing on
// client-side route transitions).
//
// Tagline / link columns / copyright / social links now come from the
// `footer` Global (cms/globals/Footer.ts, fetched via
// src/lib/homeData.ts's getFooterContent()) instead of being hardcoded —
// editable in /admin. The "สาขา" column stays wired directly to the
// Branches collection (the `branches` prop), same as before.
import type { HomeFooter } from '@/lib/homeData'

export default function SiteFooter({
  branches,
  footer,
}: {
  branches: Array<{ nameEn: string }>
  footer: HomeFooter
}) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="logo-lockup">
              <img src="/assets/images/brand/emblem.png" alt="PHIVARA emblem" />
              <span className="word">PHIVARA</span>
            </div>
            <p data-th={footer.taglineTh} data-en={footer.taglineEn}>
              {footer.taglineTh}
            </p>
          </div>
          {footer.linkGroups.map((group, i) => (
            <div className="foot-col" key={`${group.headingTh}-${i}`}>
              <h4 data-th={group.headingTh} data-en={group.headingEn}>
                {group.headingTh}
              </h4>
              {group.links.map((link, j) => (
                <a key={`${link.url}-${j}`} href={link.url} data-th={link.labelTh} data-en={link.labelEn}>
                  {link.labelTh}
                </a>
              ))}
            </div>
          ))}
          <div className="foot-col" id="footerLocations">
            <h4 data-th="สาขา" data-en="Locations">สาขา</h4>
            {branches.map((branch) => (
              <span key={branch.nameEn}>PHIVARA {branch.nameEn}</span>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <p data-th={footer.copyrightTh} data-en={footer.copyrightEn}>
            {footer.copyrightTh}
          </p>
          <div className="foot-legal">
            <a href="/privacy-policy" data-th="นโยบายความเป็นส่วนตัว" data-en="Privacy Policy">นโยบายความเป็นส่วนตัว</a>
            {/* Reopens the PDPA consent banner (public/js/consent-banner.js) so
                a visitor can change their earlier accept/decline choice. */}
            <a href="#" id="cookieSettingsLink" data-th="ตั้งค่าคุกกี้" data-en="Cookie Settings">ตั้งค่าคุกกี้</a>
          </div>
          <div className="foot-social">
            {footer.social.instagram && (
              <a href={footer.social.instagram} aria-label="Instagram">IG</a>
            )}
            {footer.social.facebook && (
              <a href={footer.social.facebook} aria-label="Facebook">FB</a>
            )}
            {footer.social.line && <a href={footer.social.line} aria-label="LINE">LN</a>}
          </div>
        </div>
      </div>
    </footer>
  )
}
