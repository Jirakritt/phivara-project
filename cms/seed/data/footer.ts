// Source: original hardcoded content in src/components/SiteFooter.tsx /
// phivara-design-html/js/site-shell.js — seeded here so the "footer" Global
// starts out matching what was on the site before it became CMS-editable.
// The "สาขา" column is NOT included — it's wired directly to the Branches
// collection (see src/lib/homeData.ts), not this Global.
export const footerData = {
  tagline: {
    th: 'จุดหมายด้านความงามและอายุยืนยาวระดับโรงพยาบาล',
    en: 'A hospital-grade aesthetic & longevity destination.',
  },
  linkGroups: [
    {
      heading: { th: 'สำรวจ', en: 'Explore' },
      links: [{ label: { th: 'แพทย์ผู้เชี่ยวชาญ', en: 'Doctors' }, url: '/doctor' }],
    },
    {
      heading: { th: 'บริษัท', en: 'Company' },
      links: [
        { label: { th: 'คลังความรู้', en: 'Journal' }, url: '/article' },
        { label: { th: 'ผู้ป่วยต่างชาติ', en: 'International Patients' }, url: '#' },
        { label: { th: 'ร่วมงานกับเรา', en: 'Careers' }, url: '#' },
        { label: { th: 'ข่าวประชาสัมพันธ์', en: 'Press' }, url: '#' },
      ],
    },
  ],
  copyrightText: {
    th: '© 2569 PHIVARA สงวนลิขสิทธิ์',
    en: '© 2026 PHIVARA. All rights reserved.',
  },
  socialLinks: {
    instagram: '',
    facebook: '',
    line: '',
  },
}
