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
//
// i18n rewrite (Phase 2): text now resolves server-side via t() instead of
// data-th/data-en + client JS, and internal links carry the current
// locale prefix (localizedHref) so footer navigation stays on the same
// language the visitor is reading.
import type { HomeFooter } from '@/lib/homeData'
import type { LocaleCode } from '@/lib/i18n'
import { localizedHref, translator } from '@/lib/i18n'

export default function SiteFooter({
  branches,
  footer,
  // Optional + defaults to 'th' so the still-live, not-yet-migrated flat
  // routes (everything outside the new [locale]/ tree — see SiteHeader.tsx's
  // matching comment) keep compiling and rendering unchanged while both
  // route trees temporarily coexist during the rollout.
  locale = 'th' as LocaleCode,
}: {
  branches: Array<{ nameEn: string }>
  footer: HomeFooter
  locale?: LocaleCode
}) {
  const t = translator(locale)

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="logo-lockup">
              <img src="/assets/images/brand/emblem.png" alt="PHIVARA emblem" />
              <span className="word">PHIVARA</span>
            </div>
            <p>{t(footer.taglineTh, footer.taglineEn)}</p>
          </div>
          {footer.linkGroups.map((group, i) => (
            <div className="foot-col" key={`${group.headingTh}-${i}`}>
              <h4>{t(group.headingTh, group.headingEn)}</h4>
              {group.links.map((link, j) => (
                <a key={`${link.url}-${j}`} href={localizedHref(locale, link.url)}>
                  {t(link.labelTh, link.labelEn)}
                </a>
              ))}
            </div>
          ))}
          <div className="foot-col" id="footerLocations">
            <h4>{t('สาขา', 'Locations')}</h4>
            {/* Per team decision, "PHIVARA " is now part of the CMS branch `name`
                field itself (edited directly in /admin), not concatenated here —
                keep in sync with the same choice in program/page.tsx and
                doctor/page.tsx's branch filter dropdowns. */}
            {branches.map((branch) => (
              <span key={branch.nameEn}>{branch.nameEn}</span>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <p>{t(footer.copyrightTh, footer.copyrightEn)}</p>
          <div className="foot-legal">
            <a href={localizedHref(locale, '/privacy-policy')}>{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</a>
            {/* Reopens the PDPA consent banner (public/js/consent-banner.js) so
                a visitor can change their earlier accept/decline choice. */}
            <a href="#" id="cookieSettingsLink">{t('ตั้งค่าคุกกี้', 'Cookie Settings')}</a>
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
