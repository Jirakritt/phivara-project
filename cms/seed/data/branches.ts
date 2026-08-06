// Source: phivara-design-html/js/site-shell.js `branches` array — the one
// place on the current site that already treats branch data as structured
// data rather than repeated markup.
//
// facilities/directions below are migrated from phivara-design-html/js/
// branch-detail.js's per-branch `branchDataMap` (facilitiesTh/En,
// directionsTh/En) — real operational content (amenities, BTS/parking
// directions), unlike that same file's per-branch doctors/programs/articles
// arrays, which are fictional mockup entries never linked to the real
// Doctors/Programs/Articles collections and are intentionally NOT migrated
// here. Doctors/Programs for a branch page are queried from the real
// collections via their existing `branch` relationship field instead.
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
    facilities: {
      th: [
        'ห้องผ่าตัดปลอดเชื้อแรงดันบวก (Positive Pressure OR) มาตรฐานโรงพยาบาลพญาไท 2',
        'ห้องพักฟื้นส่วนตัว VIP Recovery Suite พร้อมพยาบาลดูแลตลอด 24 ชั่วโมง',
        'เครื่องมือยกกระชับ Ulthera SPT และ Thermage FLX ของแท้ตรวจสอบได้',
        'VIP Private Lounge สำหรับการปรึกษาแบบเป็นส่วนตัวสูง',
      ],
      en: [
        'Phyathai 2 Hospital-grade Positive Pressure Sterile Operating Theaters',
        'Private VIP Recovery Suites with 24-hour dedicated nursing care',
        'Authentic U.S. FDA-approved Ulthera SPT & Thermage FLX technology',
        'Exclusive VIP Lounge for confidential doctor consultations',
      ],
    },
    directions: {
      th: 'เดินทางสะดวกด้วย รถไฟฟ้า BTS ลงสถานีสนามเป้า (ทางออก 1) เชื่อมตรงเข้าสู่โรงพยาบาลพญาไท 2 ชั้น 8 อาคาร A มีอาคารจอดรถกว้างขวางรองรับกว่า 500 คัน พร้อมบริการ Valet Parking',
      en: 'Direct BTS SkyTrain access via Sanampao Station (Exit 1) into Phyathai 2 Hospital, 8th Floor Building A. Spacious parking building for 500+ cars with complimentary Valet Parking.',
    },
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
    facilities: {
      th: [
        'ห้องตรวจวิเคราะห์สุขภาพเชิงลึก Precision Diagnostics Suite',
        'ห้อง IV Drip Lounge บรรยากาศเงียบสงบส่วนตัวระดับเฟิร์สคลาส',
        'ศูนย์วิเคราะห์เส้นผมและหนังศีรษะ Trichology Center',
        'ระบบสำรองนัดหมายและดูแลส่วนบุคคล VIP Concierge Service',
      ],
      en: [
        'Precision Diagnostics Suite for cellular health evaluation',
        'First-class private IV Infusion Therapy Lounge',
        'Advanced Hair & Scalp Trichology Diagnostic Unit',
        'Dedicated VIP Concierge & Personalized Care Team',
      ],
    },
    directions: {
      th: 'ตั้งอยู่บนถนนพหลโยธิน ซอยพหลโยธิน 2 (BTS อารีย์ หรือ BTS สนามเป้า) อาคาร PHIVARA Medical Center ชั้น 6 มีที่จอดรถในอาคารกว่า 150 คัน พร้อมบริการล้างรถและ Valet Service',
      en: 'Located on Phaholyothin Road (BTS Ari or BTS Sanampao), PHIVARA Medical Center 6th Floor. Covered parking for 150+ cars with Valet Service.',
    },
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
    facilities: {
      th: [
        'ห้องหัตถการเลเซอร์และผิวพรรณมาตรฐาน U.S. FDA Certified Suite',
        'เครื่อง Ulthera SPT, Thermage FLX, PicoSure Pro ของแท้มีสติ๊กเกอร์ตรวจสอบ',
        'ระบบสแกนวิเคราะห์สภาพผิวเชิงลึก VISIA Complexion Analysis',
        'ห้องทรีตเมนต์ผ่อนคลายบรรยากาศสปาหรูระดับโรงแรม 5 ดาว',
      ],
      en: [
        'U.S. FDA Certified Laser & Dermatology Procedure Suite',
        'Authentic Ulthera SPT, Thermage FLX & PicoSure Pro equipment',
        'VISIA 3D Complexion & Pigment Analysis technology',
        '5-star hotel luxury private skincare treatment rooms',
      ],
    },
    directions: {
      th: 'ตั้งอยู่บนถนนศรีอยุธยา (ใกล้แยกพญาไท และ BTS พญาไท / Airport Rail Link พญาไท) ชั้น 5 อาคาร PHIVARA Medical Center เดินทางสะดวก มีที่จอดรถใต้ดินกว่า 200 คัน',
      en: 'Located on Sri Ayudhaya Road (Near Phaya Thai Intersection, BTS/ARL Phaya Thai), 5th Floor PHIVARA Medical Center. Underground parking for 200+ vehicles.',
    },
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
    facilities: {
      th: [
        'ศูนย์ดูแลเรือนร่างและสลายไขมันแบบรีสอร์ต Resort-Style Body Wellness Hub',
        'เครื่อง CoolSculpting Elite และ EMSculpt NEO ของแท้มาตรฐาน U.S. FDA',
        'ห้องสปาเชิงบำบัดและไฮโดรเทอราพีส่วนตัว Private Hydro-Therapy Suite',
        'พื้นที่สวนพักผ่อนสีเขียวและบ่อน้ำแร่ธรรมชาติสำหรับผู้ใช้บริการ VIP',
      ],
      en: [
        'Resort-Style Body Wellness & Sculpting Center',
        'Authentic CoolSculpting Elite & EMSculpt NEO technology',
        'Private Therapeutic Hydro-Therapy & Spa Suites',
        'Tranquil green garden lounge & mineral hydro-wellness pool',
      ],
    },
    directions: {
      th: 'ตั้งอยู่ที่ ซอยเพชรเกษม 19 (ใกล้ MRT บางไผ่ เพียง 300 เมตร) อาคาร PHIVARA Wellness Center ชั้น 4 บรรยากาศเงียบสงบสไตล์รีสอร์ต พร้อมลานจอดรถส่วนตัวรองรับ 100 คัน',
      en: 'Located on Petchakasem Soi 19 (Only 300 meters from MRT Bang Phai Station), PHIVARA Wellness Center 4th Floor. Private resort-style parking for 100+ cars.',
    },
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
    facilities: {
      th: [
        'ศูนย์การแพทย์และความงามฝั่งตะวันออก Eastern Seaboard Medical Center Suite',
        'ห้องผ่าตัดมาตรฐานโรงพยาบาลพร้อมวิสัญญีแพทย์ประจำ',
        'บริการผู้ป่วยต่างชาติ International Patient VIP Lounge & Multilingual Staff',
        'วิวทะเลพาโนรามาและบริการ VIP Limousine Transfer จากสนามบินสุวรรณภูมิ/อู่ตะเภา',
      ],
      en: [
        'Eastern Seaboard Premier Medical & Longevity Center Suite',
        'Hospital-grade operating suites with dedicated anesthesiologists',
        'International Patient VIP Lounge with 5-language multilingual team',
        'Panoramic ocean view lounge & VIP Limousine Transfer from BKK/UTP Airports',
      ],
    },
    directions: {
      th: 'ตั้งอยู่ริมถนนสุขุมวิท ใจกลางเมืองศรีราชา (ใกล้โรบินสัน ศรีราชา และโรงพยาบาลสมิติเวช ศรีราชา) ชั้น 7 อาคาร PHIVARA Medical Center พร้อมบริการลานจอดรถ VIP',
      en: 'Located on Sukhumvit Road, Central Si Racha (Near Robinson Si Racha & Samitivej Hospital), 7th Floor PHIVARA Medical Center. VIP parking facilities.',
    },
  },
] as const
