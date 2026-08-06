// Source: phivara-design-html/js/site-shell.js `branches` array — the one
// place on the current site that already treats branch data as structured
// data rather than repeated markup.
export const branchesData = [
  {
    slug: 'sanampao',
    nameTh: 'สนามเป้า',
    nameEn: 'SANAMPAO',
    tagline: { th: 'ศูนย์ศัลยกรรมตกแต่งระดับโรงพยาบาล', en: 'Hospital-Grade Plastic Surgery Center' },
    description: {
      th: 'สาขาหลักใจกลางเมือง เดินทางสะดวกด้วย BTS สนามเป้า เพียบพร้อมด้วยห้องผ่าตัดมาตรฐานระดับโรงพยาบาลพญาไท ทีมศัลยแพทย์ผู้เชี่ยวชาญเฉพาะทาง ห้องพักฟื้นส่วนตัวระดับ VIP และระบบดูแลหลังผ่าตัดตลอด 24 ชั่วโมง เพื่อผลลัพธ์ที่เป็นธรรมชาติและปลอดภัยสูงสุด',
      en: 'Located in the heart of Bangkok with direct BTS Sanampao access, equipped with Phyathai hospital-grade operating theaters, board-certified plastic surgeons, private VIP recovery suites, and 24-hour post-op care for natural, safe results.',
    },
    address: {
      th: 'ชั้น 8 โรงพยาบาลพญาไท 2 เลขที่ 943 ถนนพหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพมหานคร 10400',
      en: '8th Floor, Phyathai 2 Hospital, 943 Phaholyothin Road, Phaya Thai, Bangkok 10400',
    },
    hours: { th: 'เปิดทุกวัน 09:00–20:00 น.', en: 'Open daily, 9:00 AM–8:00 PM' },
    phone: '02-XXX-XXXX',
    lineId: '@phivara',
    image: 'assets/images/brand/about-lounge.jpg',
  },
  {
    slug: 'phaholyothin',
    nameTh: 'พหลโยธิน',
    nameEn: 'PHAHOLYOTHIN',
    tagline: { th: 'ศูนย์เวชศาสตร์อายุยืนยาวและการฟื้นฟู', en: 'Longevity & Wellness Center' },
    description: {
      th: 'ศูนย์การดูแลสุขภาพเชิงป้องกันและการชะลอวัยระดับพรีเมียม ให้บริการตรวจวิเคราะห์เชิงลึกระดับเซลล์ วางแผนฟื้นฟูสุขภาพแบบเฉพาะบุคคล พร้อมห้องทรีตเมนต์บรรยากาศเงียบสงบผ่อนคลาย ดูแลโดยทีมแพทย์ผู้เชี่ยวชาญด้านเวชศาสตร์อายุยืนยาวโดยตรง',
      en: 'A premium center for preventive medicine and anti-aging care, providing in-depth cellular diagnostics, personalized wellness plans, and serene treatment suites guided by dedicated longevity specialists.',
    },
    address: {
      th: 'ชั้น 6 อาคาร PHIVARA Medical Center เลขที่ 1091 ถนนพหลโยธิน แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
      en: '6th Floor, PHIVARA Medical Center, 1091 Phaholyothin Road, Chom Phon, Chatuchak, Bangkok 10900',
    },
    hours: { th: 'เปิดทุกวัน 09:00–20:00 น.', en: 'Open daily, 9:00 AM–8:00 PM' },
    phone: '02-XXX-XXXX',
    lineId: '@phivara',
    image: 'assets/images/treatments/expertise-plastic.jpg',
  },
  {
    slug: 'sriayudhaya',
    nameTh: 'ศรีอยุธยา',
    nameEn: 'SRI AYUDHAYA',
    tagline: { th: 'ศูนย์ผิวหนังและเทคโนโลยีเลเซอร์ล้ำสมัย', en: 'Advanced Dermatology & Laser Center' },
    description: {
      th: 'สาขาเชี่ยวชาญเฉพาะทางด้านการดูแลผิวพรรณ รวบรวมเทคโนโลยีเลเซอร์ระดับโลกที่ผ่านการรับรองมาตรฐาน U.S. FDA วิเคราะห์สภาพผิวโดยแพทย์ผิวหนังเฉพาะทาง เพื่อออกแบบทรีตเมนต์แก้ปัญหาผิวอย่างแม่นยำ ปลอดภัย และตรงจุด',
      en: 'Specialized dermatology center featuring global U.S. FDA-approved laser technology, led by certified dermatologists who analyze and tailor precise skincare treatments for optimal safety and visible results.',
    },
    address: {
      th: 'ชั้น 5 อาคาร PHIVARA Medical Center เลขที่ 477 ถนนศรีอยุธยา แขวงถนนพญาไท เขตราชเทวี กรุงเทพมหานคร 10400',
      en: '5th Floor, PHIVARA Medical Center, 477 Sri Ayudhaya Road, Thanon Phaya Thai, Ratchathewi, Bangkok 10400',
    },
    hours: { th: 'เปิดทุกวัน 10:00–20:00 น.', en: 'Open daily, 10:00 AM–8:00 PM' },
    phone: '02-XXX-XXXX',
    lineId: '@phivara',
    image: 'assets/images/treatments/specialist-3.jpg',
  },
  {
    slug: 'petchakasem',
    nameTh: 'เพชรเกษม 19',
    nameEn: 'PETCHAKASEM 19',
    tagline: { th: 'ศูนย์สุขภาวะเชิงความงามครบวงจร', en: 'Holistic Aesthetic Wellness Center' },
    description: {
      th: 'พื้นที่ดูแลสุขภาพและความงามครบวงจรในบรรยากาศผ่อนคลายสไตล์รีสอร์ต ให้บริการทรีตเมนต์ฟื้นฟูเรือนร่าง ชะลอวัย และสปาเชิงบำบัด ออกแบบโปรแกรมเฉพาะบุคคลโดยทีมแพทย์ผู้เชี่ยวชาญเพื่อความสมดุลทั้งภายในและภายนอก',
      en: 'A holistic wellness sanctuary offering body contouring, anti-aging therapies, and therapeutic spa treatments in a relaxing resort atmosphere, with personalized plans designed by medical experts for inner and outer vitality.',
    },
    address: {
      th: 'ชั้น 4 อาคาร PHIVARA Wellness Center เลขที่ 25/19 ซอยเพชรเกษม 19 แขวงปากคลองภาษีเจริญ เขตภาษีเจริญ กรุงเทพมหานคร 10160',
      en: '4th Floor, PHIVARA Wellness Center, 25/19 Petchakasem 19, Pak Khlong Phasi Charoen, Bangkok 10160',
    },
    hours: { th: 'เปิดทุกวัน 09:00–19:00 น.', en: 'Open daily, 9:00 AM–7:00 PM' },
    phone: '02-XXX-XXXX',
    lineId: '@phivara',
    image: 'assets/images/hero/herobg03.png',
  },
  {
    slug: 'sriracha',
    nameTh: 'ศรีราชา',
    nameEn: 'SRIRACHA',
    tagline: { th: 'ศูนย์สุขภาพและความงามฝั่งตะวันออก', en: 'Eastern Seaboard Medical Hub' },
    description: {
      th: 'ศูนย์กลางการดูแลสุขภาพและความงามระดับพรีเมียมในภาคตะวันออก รองรับทั้งผู้ใช้บริการชาวไทยและต่างชาติด้วยบริการระดับ Concierge ให้บริการครอบคลุมทั้งเวชศาสตร์ชะลอวัย ศัลยกรรมตกแต่ง และการดูแลสุขภาพเฉพาะบุคคลอย่างครบวงจร',
      en: 'The premier health and beauty hub on the Eastern Seaboard, delivering VIP Concierge services, longevity medicine, plastic surgery, and personalized healthcare for local and international clients.',
    },
    address: {
      th: 'ชั้น 7 อาคาร PHIVARA Medical Center เลขที่ 89 ถนนสุขุมวิท ตำบลศรีราชา อำเภอศรีราชา จังหวัดชลบุรี 20110',
      en: '7th Floor, PHIVARA Medical Center, 89 Sukhumvit Road, Si Racha, Chonburi 20110',
    },
    hours: { th: 'เปิดทุกวัน 09:00–19:00 น.', en: 'Open daily, 9:00 AM–7:00 PM' },
    phone: '038-XXX-XXX',
    lineId: '@phivara',
    image: 'assets/images/hero/herobg04.png',
  },
] as const
