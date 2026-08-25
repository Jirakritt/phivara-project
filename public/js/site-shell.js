(function () {
  'use strict';

  const navigation = [
    { key: 'home', href: 'index.html', th: 'หน้าแรก', en: 'Home' },
    { key: 'ecosystem', href: 'ecosystem.html', th: 'เกี่ยวกับเรา', en: 'About Us' },
    { key: 'program', href: 'program.html', th: 'โปรแกรมตรวจ', en: 'Programs' },
    { key: 'doctor', href: 'doctor.html', th: 'แพทย์ผู้เชี่ยวชาญ', en: 'Doctors' },
    { key: 'article', href: 'article.html', th: 'คลังความรู้', en: 'Journal' },
    { key: 'contact', href: 'contact.html', th: 'ติดต่อ', en: 'Contact' }
  ];

  const branches = [
    {
      id: 'pt2',
      formValue: 'pt2',
      nameTh: 'สนามเป้า',
      nameEn: 'SANAMPAO',
      titleTh: 'ศูนย์ศัลยกรรมตกแต่งระดับโรงพยาบาล',
      titleEn: 'Hospital-Grade Plastic Surgery Center',
      descriptionTh: 'สาขาหลักใจกลางเมือง เดินทางสะดวกด้วย BTS สนามเป้า เพียบพร้อมด้วยห้องผ่าตัดมาตรฐานระดับโรงพยาบาลพญาไท ทีมศัลยแพทย์ผู้เชี่ยวชาญเฉพาะทาง ห้องพักฟื้นส่วนตัวระดับ VIP และระบบดูแลหลังผ่าตัดตลอด 24 ชั่วโมง เพื่อผลลัพธ์ที่เป็นธรรมชาติและปลอดภัยสูงสุด',
      descriptionEn: 'Located in the heart of Bangkok with direct BTS Sanampao access, equipped with Phyathai hospital-grade operating theaters, board-certified plastic surgeons, private VIP recovery suites, and 24-hour post-op care for natural, safe results.',
      addressTh: 'ชั้น 8 โรงพยาบาลพญาไท 2 เลขที่ 943 ถนนพหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพมหานคร 10400',
      addressEn: '8th Floor, Phyathai 2 Hospital, 943 Phaholyothin Road, Phaya Thai, Bangkok 10400',
      hoursTh: 'เปิดทุกวัน 09:00–20:00 น.',
      hoursEn: 'Open daily, 9:00 AM–8:00 PM',
      phone: '02-XXX-XXXX',
      line: '@phivara',
      image: 'assets/images/brand/about-lounge.jpg'
    },
    {
      id: 'ptp',
      formValue: 'ptp',
      nameTh: 'พหลโยธิน',
      nameEn: 'PHAHOLYOTHIN',
      titleTh: 'ศูนย์เวชศาสตร์อายุยืนยาวและการฟื้นฟู',
      titleEn: 'Longevity & Wellness Center',
      descriptionTh: 'ศูนย์การดูแลสุขภาพเชิงป้องกันและการชะลอวัยระดับพรีเมียม ให้บริการตรวจวิเคราะห์เชิงลึกระดับเซลล์ วางแผนฟื้นฟูสุขภาพแบบเฉพาะบุคคล พร้อมห้องทรีตเมนต์บรรยากาศเงียบสงบผ่อนคลาย ดูแลโดยทีมแพทย์ผู้เชี่ยวชาญด้านเวชศาสตร์อายุยืนยาวโดยตรง',
      descriptionEn: 'A premium center for preventive medicine and anti-aging care, providing in-depth cellular diagnostics, personalized wellness plans, and serene treatment suites guided by dedicated longevity specialists.',
      addressTh: 'ชั้น 6 อาคาร PHIVARA Medical Center เลขที่ 1091 ถนนพหลโยธิน แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
      addressEn: '6th Floor, PHIVARA Medical Center, 1091 Phaholyothin Road, Chom Phon, Chatuchak, Bangkok 10900',
      hoursTh: 'เปิดทุกวัน 09:00–20:00 น.',
      hoursEn: 'Open daily, 9:00 AM–8:00 PM',
      phone: '02-XXX-XXXX',
      line: '@phivara',
      image: 'assets/images/treatments/expertise-plastic.jpg'
    },
    {
      id: 'pt1',
      formValue: 'pt1',
      nameTh: 'ศรีอยุธยา',
      nameEn: 'SRI AYUDHAYA',
      titleTh: 'ศูนย์ผิวหนังและเทคโนโลยีเลเซอร์ล้ำสมัย',
      titleEn: 'Advanced Dermatology & Laser Center',
      descriptionTh: 'สาขาเชี่ยวชาญเฉพาะทางด้านการดูแลผิวพรรณ รวบรวมเทคโนโลยีเลเซอร์ระดับโลกที่ผ่านการรับรองมาตรฐาน U.S. FDA วิเคราะห์สภาพผิวโดยแพทย์ผิวหนังเฉพาะทาง เพื่อออกแบบทรีตเมนต์แก้ปัญหาผิวอย่างแม่นยำ ปลอดภัย และตรงจุด',
      descriptionEn: 'Specialized dermatology center featuring global U.S. FDA-approved laser technology, led by certified dermatologists who analyze and tailor precise skincare treatments for optimal safety and visible results.',
      addressTh: 'ชั้น 5 อาคาร PHIVARA Medical Center เลขที่ 477 ถนนศรีอยุธยา แขวงถนนพญาไท เขตราชเทวี กรุงเทพมหานคร 10400',
      addressEn: '5th Floor, PHIVARA Medical Center, 477 Sri Ayudhaya Road, Thanon Phaya Thai, Ratchathewi, Bangkok 10400',
      hoursTh: 'เปิดทุกวัน 10:00–20:00 น.',
      hoursEn: 'Open daily, 10:00 AM–8:00 PM',
      phone: '02-XXX-XXXX',
      line: '@phivara',
      image: 'assets/images/treatments/specialist-3.jpg'
    },
    {
      id: 'pt3',
      formValue: 'pt3',
      nameTh: 'เพชรเกษม 19',
      nameEn: 'PETCHAKASEM 19',
      titleTh: 'ศูนย์สุขภาวะเชิงความงามครบวงจร',
      titleEn: 'Holistic Aesthetic Wellness Center',
      descriptionTh: 'พื้นที่ดูแลสุขภาพและความงามครบวงจรในบรรยากาศผ่อนคลายสไตล์รีสอร์ต ให้บริการทรีตเมนต์ฟื้นฟูเรือนร่าง ชะลอวัย และสปาเชิงบำบัด ออกแบบโปรแกรมเฉพาะบุคคลโดยทีมแพทย์ผู้เชี่ยวชาญเพื่อความสมดุลทั้งภายในและภายนอก',
      descriptionEn: 'A holistic wellness sanctuary offering body contouring, anti-aging therapies, and therapeutic spa treatments in a relaxing resort atmosphere, with personalized plans designed by medical experts for inner and outer vitality.',
      addressTh: 'ชั้น 4 อาคาร PHIVARA Wellness Center เลขที่ 25/19 ซอยเพชรเกษม 19 แขวงปากคลองภาษีเจริญ เขตภาษีเจริญ กรุงเทพมหานคร 10160',
      addressEn: '4th Floor, PHIVARA Wellness Center, 25/19 Petchakasem 19, Pak Khlong Phasi Charoen, Bangkok 10160',
      hoursTh: 'เปิดทุกวัน 09:00–19:00 น.',
      hoursEn: 'Open daily, 9:00 AM–7:00 PM',
      phone: '02-XXX-XXXX',
      line: '@phivara',
      image: 'assets/images/hero/herobg03.png'
    },
    {
      id: 'pts',
      formValue: 'pts',
      nameTh: 'ศรีราชา',
      nameEn: 'SRIRACHA',
      titleTh: 'ศูนย์สุขภาพและความงามฝั่งตะวันออก',
      titleEn: 'Eastern Seaboard Medical Hub',
      descriptionTh: 'ศูนย์กลางการดูแลสุขภาพและความงามระดับพรีเมียมในภาคตะวันออก รองรับทั้งผู้ใช้บริการชาวไทยและต่างชาติด้วยบริการระดับ Concierge ให้บริการครอบคลุมทั้งเวชศาสตร์ชะลอวัย ศัลยกรรมตกแต่ง และการดูแลสุขภาพเฉพาะบุคคลอย่างครบวงจร',
      descriptionEn: 'The premier health and beauty hub on the Eastern Seaboard, delivering VIP Concierge services, longevity medicine, plastic surgery, and personalized healthcare for local and international clients.',
      addressTh: 'ชั้น 7 อาคาร PHIVARA Medical Center เลขที่ 89 ถนนสุขุมวิท ตำบลศรีราชา อำเภอศรีราชา จังหวัดชลบุรี 20110',
      addressEn: '7th Floor, PHIVARA Medical Center, 89 Sukhumvit Road, Si Racha, Chonburi 20110',
      hoursTh: 'เปิดทุกวัน 09:00–19:00 น.',
      hoursEn: 'Open daily, 9:00 AM–7:00 PM',
      phone: '038-XXX-XXX',
      line: '@phivara',
      image: 'assets/images/hero/herobg04.png'
    }
  ];

  function currentPage(explicitPage) {
    if (explicitPage) return explicitPage;
    const filename = location.pathname.split('/').pop() || 'index.html';
    if (filename.startsWith('program')) return 'program';
    if (filename.startsWith('doctor')) return 'doctor';
    if (filename.startsWith('article')) return 'article';
    if (filename.startsWith('membership')) return 'membership';
    if (filename.startsWith('contact')) return 'contact';
    if (filename.startsWith('ecosystem')) return 'ecosystem';
    return 'home';
  }

  function pageHref(item, page) {
    if (page === 'home' && item.href.startsWith('index.html#')) {
      return item.href.replace('index.html', '');
    }
    if (page === 'home' && item.key === 'home') return '#top';
    return item.href;
  }

  function renderNavigation(page) {
    return navigation.map((item) => {
      const active = item.key === page ? ' class="active"' : '';
      return `<a href="${pageHref(item, page)}"${active} data-th="${item.th}" data-en="${item.en}">${item.th}</a>`;
    }).join('');
  }

  function fragmentFrom(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
  }

  class PhivaraHeader extends HTMLElement {
    connectedCallback() {
      const page = currentPage(this.dataset.page);
      const links = renderNavigation(page);
      this.replaceWith(fragmentFrom(`
        <div class="topbar">
          <div class="wrap">
            <div class="tb-left" data-th="PHIVARA Aesthetic &amp; Longevity Center" data-en="PHIVARA Aesthetic &amp; Longevity Center">PHIVARA Aesthetic &amp; Longevity Center</div>
            <div class="tb-right">
              <span data-th="สายด่วนส่วนตัว: 02-XXX-XXXX" data-en="Private Hotline: 02-XXX-XXXX">สายด่วนส่วนตัว: 02-XXX-XXXX</span>
              <span data-th="LINE: @phivara" data-en="LINE: @phivara">LINE: @phivara</span>
              <div class="lang-toggle" id="langToggle" aria-label="Language">
                <span class="active" data-val="th">TH</span>
                <span data-val="en">EN</span>
              </div>
            </div>
          </div>
        </div>
        <header class="site" id="siteHeader">
          <div class="wrap">
            <a href="${page === 'home' ? '#top' : 'index.html'}" class="logo-lockup">
              <img src="assets/images/brand/emblem.png" alt="PHIVARA emblem">
              <span class="word">PHIVARA<small>The Art of Beaugevity</small></span>
            </a>
            <nav class="main-nav" id="mainNav" aria-label="Primary navigation">${links}</nav>
            <div class="header-cta">
              <a href="#vipModalOverlay" class="btn btn-outline-dark btn-txt vip-trigger" data-th="จองปรึกษาส่วนตัว" data-en="Book a Private Consultation">จองปรึกษาส่วนตัว</a>
              <button type="button" class="burger" id="burgerBtn" aria-label="Open navigation" aria-controls="mobileMenu" aria-expanded="false">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </header>
        <nav class="mobile-menu" id="mobileMenu" aria-label="Mobile navigation">${links}</nav>
      `));
    }
  }

  class PhivaraFooter extends HTMLElement {
    connectedCallback() {
      this.replaceWith(fragmentFrom(`
        <footer class="site-footer">
          <div class="wrap">
            <div class="foot-grid">
              <div class="foot-brand">
                <div class="logo-lockup">
                  <img src="assets/images/brand/emblem.png" alt="PHIVARA emblem">
                  <span class="word">PHIVARA</span>
                </div>
                <p data-th="จุดหมายด้านความงามและอายุยืนยาวระดับโรงพยาบาล" data-en="A hospital-grade aesthetic &amp; longevity destination.">จุดหมายด้านความงามและอายุยืนยาวระดับโรงพยาบาล</p>
              </div>
              <div class="foot-col">
                <h4 data-th="สำรวจ" data-en="Explore">สำรวจ</h4>
                <a href="doctor.html" data-th="แพทย์ผู้เชี่ยวชาญ" data-en="Doctors">แพทย์ผู้เชี่ยวชาญ</a>
              </div>
              <div class="foot-col">
                <h4 data-th="บริษัท" data-en="Company">บริษัท</h4>
                <a href="article.html" data-th="คลังความรู้" data-en="Journal">คลังความรู้</a>
                <a href="#" data-th="ผู้ป่วยต่างชาติ" data-en="International Patients">ผู้ป่วยต่างชาติ</a>
                <a href="#" data-th="ร่วมงานกับเรา" data-en="Careers">ร่วมงานกับเรา</a>
                <a href="#" data-th="ข่าวประชาสัมพันธ์" data-en="Press">ข่าวประชาสัมพันธ์</a>
              </div>
              <div class="foot-col" id="footerLocations">
                <h4 data-th="สาขา" data-en="Locations">สาขา</h4>
                ${branches.map((branch) => `<span>PHIVARA ${branch.nameEn}</span>`).join('')}
              </div>
            </div>
            <div class="foot-bottom">
              <p data-th="© 2569 PHIVARA สงวนลิขสิทธิ์" data-en="© 2026 PHIVARA. All rights reserved.">© 2569 PHIVARA สงวนลิขสิทธิ์</p>
              <div class="foot-social">
                <a href="#" aria-label="Instagram">IG</a>
                <a href="#" aria-label="Facebook">FB</a>
                <a href="#" aria-label="LINE">LN</a>
              </div>
            </div>
          </div>
        </footer>
      `));
    }
  }

  customElements.define('phivara-header', PhivaraHeader);
  customElements.define('phivara-footer', PhivaraFooter);

  window.PhivaraSiteShell = Object.freeze({ navigation, branches });
})();
