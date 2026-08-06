// Ported 1:1 from phivara-design-html/js/site-shell.js's <phivara-footer>
// custom element — see SiteHeader.tsx for why this is a React component
// instead of a custom element, and for why internal links here are plain
// <a> tags rather than next/link (forces a full page load so each page's
// legacy JS re-initializes instead of silently no-op'ing on client-side
// route transitions).

export default function SiteFooter({ branches }: { branches: Array<{ nameEn: string }> }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="logo-lockup">
              <img src="/assets/images/brand/emblem.png" alt="PHIVARA emblem" />
              <span className="word">PHIVARA</span>
            </div>
            <p data-th="จุดหมายด้านความงามและอายุยืนยาวระดับโรงพยาบาล" data-en="A hospital-grade aesthetic &amp; longevity destination.">
              จุดหมายด้านความงามและอายุยืนยาวระดับโรงพยาบาล
            </p>
          </div>
          <div className="foot-col">
            <h4 data-th="สำรวจ" data-en="Explore">สำรวจ</h4>
            <a href="/doctor" data-th="แพทย์ผู้เชี่ยวชาญ" data-en="Doctors">แพทย์ผู้เชี่ยวชาญ</a>
          </div>
          <div className="foot-col">
            <h4 data-th="บริษัท" data-en="Company">บริษัท</h4>
            <a href="/article" data-th="คลังความรู้" data-en="Journal">คลังความรู้</a>
            <a href="#" data-th="ผู้ป่วยต่างชาติ" data-en="International Patients">ผู้ป่วยต่างชาติ</a>
            <a href="#" data-th="ร่วมงานกับเรา" data-en="Careers">ร่วมงานกับเรา</a>
            <a href="#" data-th="ข่าวประชาสัมพันธ์" data-en="Press">ข่าวประชาสัมพันธ์</a>
          </div>
          <div className="foot-col" id="footerLocations">
            <h4 data-th="สาขา" data-en="Locations">สาขา</h4>
            {branches.map((branch) => (
              <span key={branch.nameEn}>PHIVARA {branch.nameEn}</span>
            ))}
          </div>
        </div>
        <div className="foot-bottom">
          <p data-th="© 2569 PHIVARA สงวนลิขสิทธิ์" data-en="© 2026 PHIVARA. All rights reserved.">© 2569 PHIVARA สงวนลิขสิทธิ์</p>
          <div className="foot-social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="LINE">LN</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
