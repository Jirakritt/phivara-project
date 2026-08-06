// Source: phivara-design-html/doctor.html (dr01–dr12, static cards) +
// phivara-design-html/js/doctor.js `additionalDoctors` (dr13–dr30).
//
// Only dr01 has a fully written profile in the source (js/doctor-detail.js
// `applyDr01Profile`) — bio, credential groups, weekly schedule, contact
// copy. Every other doctor only has listing-card data (name, specialty,
// one-line note, photo). Those fields are left undefined below; the clinic
// will need to supply full bios for dr02–dr30 before their profile pages
// are complete.
type DoctorSeed = {
  slug: string
  branch: string
  specialty: 'plastic' | 'dermatology' | 'longevity' | 'wellness'
  nameTh: string
  nameEn: string
  specialtyLabel: { th: string; en: string }
  subNote: { th: string; en: string }
  photo: string
  rich?: {
    hospitalTitle: { th: string; en: string }
    boardCertification: { th: string; en: string }
    tags: Array<{ th: string; en: string }>
    bio: { th: string; en: string }
    credentialGroups: Array<{
      heading: { th: string; en: string }
      items: Array<{ th: string; en: string }>
    }>
    schedule: Array<{ day: string; hours: string; locationName: { th: string; en: string } }>
    contactIntro: { th: string; en: string }
    contactFact: { th: string; en: string }
  }
}

export const doctorsData: DoctorSeed[] = [
  {
    slug: 'dr01',
    branch: 'sriracha',
    specialty: 'plastic',
    nameTh: 'นพ.ดุลยณัฐ อรัญยะปาล',
    nameEn: 'Dr. Dulyanat Aranyapal',
    specialtyLabel: {
      th: 'แพทย์ประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา',
      en: 'Plastic Surgery Center, Phyathai Sriracha Hospital',
    },
    subNote: {
      th: 'วุฒิบัตรศัลยศาสตร์ตกแต่ง · คณะแพทยศาสตร์ศิริราชพยาบาล',
      en: 'Board Certified in Plastic Surgery · Faculty of Medicine Siriraj Hospital',
    },
    photo: 'assets/images/doctors/dr01.png',
    rich: {
      hospitalTitle: {
        th: 'แพทย์ประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา',
        en: 'Plastic Surgery Center, Phyathai Sriracha Hospital',
      },
      boardCertification: {
        th: 'วุฒิบัตรสาขาศัลยศาสตร์ตกแต่ง คณะแพทยศาสตร์ศิริราชพยาบาล',
        en: 'Board Certified in Plastic Surgery, Faculty of Medicine Siriraj Hospital',
      },
      tags: [
        { th: '✦ ศัลยกรรมตกแต่ง', en: '✦ Plastic Surgery' },
        { th: '✦ ศัลยกรรมตกแต่งใบหน้า', en: '✦ Facial Plastic Surgery' },
        { th: '✦ ศัลยกรรมแม็กซิลโลเฟเชียล', en: '✦ Maxillofacial Surgery' },
      ],
      bio: {
        th: 'ศัลยแพทย์ตกแต่งผู้ผ่านการอบรมด้านศัลยกรรมตกแต่งใบหน้าจากผู้เชี่ยวชาญประเทศเกาหลี Prof. Hong Ki Lee, M.D., Ph.D. มีประสบการณ์เป็นอาจารย์แพทย์และแพทย์ศัลยกรรมตกแต่ง ปัจจุบันประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา',
        en: 'Plastic surgeon trained in facial plastic surgery under Korean specialist Prof. Hong Ki Lee, M.D., Ph.D. Experienced as a medical lecturer and plastic surgeon, currently practicing at the Plastic Surgery Center, Phyathai Sriracha Hospital.',
      },
      credentialGroups: [
        {
          heading: { th: 'คุณวุฒิและการศึกษา', en: 'Education & Certifications' },
          items: [
            {
              th: 'แพทยศาสตรบัณฑิต คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี มหาวิทยาลัยมหิดล',
              en: 'Doctor of Medicine, Faculty of Medicine Ramathibodi Hospital, Mahidol University',
            },
            {
              th: 'วุฒิบัตรสาขาศัลยศาสตร์ คณะแพทยศาสตร์ มหาวิทยาลัยสงขลานครินทร์',
              en: 'Board Certified in Surgery, Faculty of Medicine, Prince of Songkla University',
            },
            {
              th: 'วุฒิบัตรสาขาศัลยศาสตร์ตกแต่ง คณะแพทยศาสตร์ศิริราชพยาบาล',
              en: 'Board Certified in Plastic Surgery, Faculty of Medicine Siriraj Hospital',
            },
            {
              th: 'เทรนนิ่งหลักสูตรศัลยกรรมตกแต่งใบหน้าจากผู้เชี่ยวชาญประเทศเกาหลี Prof. Hong Ki Lee, M.D., Ph.D.',
              en: 'Facial plastic surgery training under Korean specialist Prof. Hong Ki Lee, M.D., Ph.D.',
            },
          ],
        },
        {
          heading: { th: 'ประวัติการทำงาน', en: 'Professional Experience' },
          items: [
            { th: 'แพทย์โรงพยาบาลมหาวิทยาลัยสงขลานครินทร์', en: 'Physician, Songklanagarind Hospital' },
            {
              th: 'แพทย์ประจำบ้าน สาขาศัลยศาสตร์ มหาวิทยาลัยสงขลานครินทร์',
              en: 'Surgery Resident, Prince of Songkla University',
            },
            { th: 'แพทย์ศัลยกรรมตกแต่ง โรงพยาบาลศิริราช', en: 'Plastic Surgeon, Siriraj Hospital' },
            { th: 'อาจารย์แพทย์ โรงพยาบาลมหาวิทยาลัยสงขลานครินทร์', en: 'Medical Lecturer, Songklanagarind Hospital' },
            {
              th: 'แพทย์ศัลยกรรมตกแต่งและแม็กซิลโลเฟเชียล ประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา',
              en: 'Plastic and Maxillofacial Surgeon, Plastic Surgery Center, Phyathai Sriracha Hospital',
            },
          ],
        },
        {
          heading: { th: 'ความเชี่ยวชาญทางการแพทย์', en: 'Clinical Specialization' },
          items: [
            { th: 'ศัลยศาสตร์', en: 'General Surgery' },
            { th: 'ศัลยศาสตร์ตกแต่ง', en: 'Plastic Surgery' },
            { th: 'ศัลยกรรมตกแต่งใบหน้า', en: 'Facial Plastic Surgery' },
            { th: 'ศัลยกรรมแม็กซิลโลเฟเชียล', en: 'Maxillofacial Surgery' },
          ],
        },
      ],
      schedule: [
        { day: 'monday', hours: '09:00 - 20:00 น.', locationName: { th: 'PHYATHAI SRIRACHA HOSPITAL', en: 'PHYATHAI SRIRACHA HOSPITAL' } },
        { day: 'tuesday', hours: '09:00 - 19:00 น.', locationName: { th: 'PHYATHAI SRIRACHA HOSPITAL', en: 'PHYATHAI SRIRACHA HOSPITAL' } },
        { day: 'wednesday', hours: '09:00 - 18:00 น.', locationName: { th: 'PHYATHAI SRIRACHA HOSPITAL', en: 'PHYATHAI SRIRACHA HOSPITAL' } },
        { day: 'thursday', hours: '09:00 - 14:00 น.', locationName: { th: 'PHYATHAI SRIRACHA HOSPITAL', en: 'PHYATHAI SRIRACHA HOSPITAL' } },
        { day: 'sunday', hours: '10:00 - 20:00 น.', locationName: { th: 'PHYATHAI SRIRACHA HOSPITAL', en: 'PHYATHAI SRIRACHA HOSPITAL' } },
      ],
      contactIntro: {
        th: 'ส่งคำขอนัดหมายเพื่อเข้าพบ นพ.ดุลยณัฐ อรัญยะปาล ตามวันและเวลาที่สะดวก เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันนัดหมาย',
        en: 'Request an appointment with Dr. Dulyanat Aranyapal on your preferred date and time. Our team will contact you to confirm.',
      },
      contactFact: {
        th: 'ศูนย์ศัลยกรรมตกแต่ง · โรงพยาบาลพญาไทศรีราชา',
        en: 'Plastic Surgery Center · Phyathai Sriracha Hospital',
      },
    },
  },
  {
    slug: 'dr02',
    branch: 'phaholyothin',
    specialty: 'longevity',
    nameTh: 'พญ. กอบกุลยา จึงประเสริฐศรี',
    nameEn: 'Dr. Kobkulya Juengprasertsri',
    specialtyLabel: { th: 'ผู้อำนวยการศูนย์เวชศาสตร์ชะลอวัย', en: 'Medical Director, Anti-Aging Center' },
    subNote: {
      th: 'แพทย์ผู้เชี่ยวชาญเวชศาสตร์ชะลอวัยและการแพทย์ป้องกัน',
      en: 'Anti-Aging & Regenerative Medicine Specialist',
    },
    photo: 'assets/images/doctors/dr02.png',
  },
  {
    slug: 'dr03',
    branch: 'sriayudhaya',
    specialty: 'dermatology',
    nameTh: 'นพ. ธนกฤต วิเศษกุล',
    nameEn: 'Dr. Thanakrit Visetkul',
    specialtyLabel: { th: 'ตรวจรักษาโรคผิวหนังและเลเซอร์ความงาม', en: 'Dermatology & Laser Aesthetics' },
    subNote: {
      th: 'วุฒิบัตรตวรจรักษาโรคผิวหนัง · ศิริราชพยาบาล',
      en: 'Board Certified Dermatologist · Siriraj Hospital',
    },
    photo: 'assets/images/treatments/specialist-2.jpg',
  },
  {
    slug: 'dr04',
    branch: 'petchakasem',
    specialty: 'wellness',
    nameTh: 'พญ. ณิชานันท์ อัศวเสนา',
    nameEn: 'Dr. Nichanan Atsawasena',
    specialtyLabel: { th: 'สุขภาวะเชิงความงามและการฟื้นฟู', en: 'Aesthetic Wellness & Rehabilitation' },
    subNote: {
      th: 'ผู้เชี่ยวชาญด้านเวชศาสตร์ฟื้นฟูและองค์รวม',
      en: 'Rehabilitation & Holistic Wellness Specialist',
    },
    photo: 'assets/images/hero/herobg03.png',
  },
  {
    slug: 'dr05',
    branch: 'sriracha',
    specialty: 'wellness',
    nameTh: 'นพ. ภัทรดนัย ชัยวัฒน์',
    nameEn: 'Dr. Pattaradanai Chaiwat',
    specialtyLabel: { th: 'สุขภาพและความงามสำหรับผู้ชาย', en: "Men's Health & Aesthetic Programs" },
    subNote: { th: 'ผู้เชี่ยวชาญด้านฮอร์โมนและสุขภาพบุรุษ', en: "Men's Health & Hormone Specialist" },
    photo: 'assets/images/treatments/specialist-1.jpg',
  },
  {
    slug: 'dr06',
    branch: 'sanampao',
    specialty: 'plastic',
    nameTh: 'นพ. ปรเมษฐ์ สุจริตตานนท์',
    nameEn: 'Dr. Poramet Sutcharittanon',
    specialtyLabel: { th: 'ศัลยกรรมจมูกและปรับโครงหน้าชั้นลึก', en: 'Rhinoplasty & Facial Contouring' },
    subNote: {
      th: 'Fellowship in Facial Reconstruction (South Korea)',
      en: 'Fellowship in Facial Surgery (South Korea)',
    },
    photo: 'assets/images/doctors/dr01.png',
  },
  {
    slug: 'dr07',
    branch: 'phaholyothin',
    specialty: 'longevity',
    nameTh: 'พญ. ชลทิชา วงศ์สว่าง',
    nameEn: 'Dr. Chonticha Vongsawat',
    specialtyLabel: { th: 'ฟื้นฟูสุขภาพระดับเซลล์และฮอร์โมน', en: 'Cellular & Hormone Regeneration' },
    subNote: {
      th: 'ปริญญาโทเวชศาสตร์ชะลอวัย · ม.แม่ฟ้าหลวง',
      en: 'MSc Anti-Aging Medicine · Mae Fah Luang Univ.',
    },
    photo: 'assets/images/doctors/dr02.png',
  },
  {
    slug: 'dr08',
    branch: 'sriayudhaya',
    specialty: 'dermatology',
    nameTh: 'พญ. ศิรินภา ปัญญาวงศ์',
    nameEn: 'Dr. Sirinapa Panyawong',
    specialtyLabel: { th: 'หัตถการฉีดสารเติมเต็มและปรับรูปหน้า', en: 'Facial Lifting & Injectables' },
    subNote: {
      th: 'National Certified Trainer for Dermal Fillers',
      en: 'Certified National Trainer in Injectables',
    },
    photo: 'assets/images/treatments/specialist-3.jpg',
  },
  {
    slug: 'dr09',
    branch: 'petchakasem',
    specialty: 'longevity',
    nameTh: 'นพ. กฤษดา เมธาการ',
    nameEn: 'Dr. Kritsada Methakarn',
    specialtyLabel: { th: 'โภชนบำบัดและการชะลอวัยเชิงลึก', en: 'Nutritional Therapy & Anti-Aging' },
    subNote: {
      th: 'Certified Functional Medicine Practitioner (IFMCP)',
      en: 'Certified Functional Medicine Practitioner (IFMCP)',
    },
    photo: 'assets/images/hero/herobg04.png',
  },
  {
    slug: 'dr10',
    branch: 'sriracha',
    specialty: 'plastic',
    nameTh: 'นพ. พงศกร วรเวช',
    nameEn: 'Dr. Pongsakorn Woravech',
    specialtyLabel: { th: 'ศัลยกรรมกระชับสัดส่วนและดูดไขมัน', en: 'Body Contouring & Liposuction' },
    subNote: {
      th: 'สมาชิกสมาคมศัลยกรรมตกแต่งแห่งประเทศไทย',
      en: 'Thai Plastic Surgery Association Member',
    },
    photo: 'assets/images/brand/about-lounge.jpg',
  },
  {
    slug: 'dr11',
    branch: 'sanampao',
    specialty: 'plastic',
    nameTh: 'พญ. วรินทร เกียรติบูรพา',
    nameEn: 'Dr. Warintorn Kiatburapa',
    specialtyLabel: { th: 'ศัลยกรรมหน้าอกและจัดทรงเรือนร่าง', en: 'Breast & Body Reconstruction' },
    subNote: { th: 'ศัลยแพทย์ตกแต่งเฉพาะทาง · รามาธิบดี', en: 'Plastic Surgery Specialist · Ramathibodi' },
    photo: 'assets/images/treatments/expertise-plastic.jpg',
  },
  {
    slug: 'dr12',
    branch: 'sriayudhaya',
    specialty: 'dermatology',
    nameTh: 'พญ. ปรียานุช รัตนดำรง',
    nameEn: 'Dr. Preeyanuch Rattanadamrong',
    specialtyLabel: { th: 'เลเซอร์รักษาฝ้า กระ และปรับสีผิว', en: 'Advanced Laser & Skin Pigmentation' },
    subNote: { th: 'Board Certified Dermatologist · Harvard Fellow', en: 'Board Certified Dermatologist · Harvard Fellow' },
    photo: 'assets/images/treatments/expertise-skin.jpg',
  },
  {
    slug: 'dr13',
    branch: 'sanampao',
    specialty: 'plastic',
    nameTh: 'พญ. ชนิดาภา วัฒนกุล',
    nameEn: 'Dr. Chanidapa Wattanakul',
    specialtyLabel: { th: 'ศัลยกรรมตกแต่งรอบดวงตาและใบหน้า', en: 'Oculoplastic & Facial Surgery' },
    subNote: { th: 'ศัลยแพทย์ตกแต่งเฉพาะทางด้านใบหน้า', en: 'Facial Plastic Surgery Specialist' },
    photo: 'assets/images/doctors/dr01.png',
  },
  {
    slug: 'dr14',
    branch: 'phaholyothin',
    specialty: 'longevity',
    nameTh: 'นพ. ธีรภัทร จิรเวช',
    nameEn: 'Dr. Teerapat Jiravej',
    specialtyLabel: { th: 'เวชศาสตร์ป้องกันและสุขภาพเชิงลึก', en: 'Preventive & Precision Medicine' },
    subNote: { th: 'ผู้เชี่ยวชาญเวชศาสตร์ป้องกันเฉพาะบุคคล', en: 'Precision Medicine Specialist' },
    photo: 'assets/images/doctors/dr02.png',
  },
  {
    slug: 'dr15',
    branch: 'sriayudhaya',
    specialty: 'dermatology',
    nameTh: 'พญ. พิมพ์ชนก ศรีวรางค์',
    nameEn: 'Dr. Pimchanok Sriwarang',
    specialtyLabel: { th: 'ผิวหนังอักเสบและผิวบอบบาง', en: 'Sensitive Skin & Clinical Dermatology' },
    subNote: { th: 'วุฒิบัตรแพทย์เฉพาะทางผิวหนัง', en: 'Board Certified Dermatologist' },
    photo: 'assets/images/treatments/specialist-2.jpg',
  },
  {
    slug: 'dr16',
    branch: 'petchakasem',
    specialty: 'wellness',
    nameTh: 'นพ. อชิระ ธนากร',
    nameEn: 'Dr. Achira Thanakorn',
    specialtyLabel: { th: 'เวชศาสตร์ฟื้นฟูและการเคลื่อนไหว', en: 'Rehabilitation & Movement Medicine' },
    subNote: { th: 'ผู้เชี่ยวชาญเวชศาสตร์ฟื้นฟู', en: 'Rehabilitation Medicine Specialist' },
    photo: 'assets/images/treatments/specialist-1.jpg',
  },
  {
    slug: 'dr17',
    branch: 'sriracha',
    specialty: 'plastic',
    nameTh: 'พญ. รมิดา กาญจนศิลป์',
    nameEn: 'Dr. Ramida Kanchanasilp',
    specialtyLabel: { th: 'ศัลยกรรมปรับรูปหน้าอย่างเป็นธรรมชาติ', en: 'Natural Facial Contouring Surgery' },
    subNote: { th: 'ศัลยแพทย์ตกแต่งเฉพาะทาง', en: 'Board Certified Plastic Surgeon' },
    photo: 'assets/images/treatments/expertise-plastic.jpg',
  },
  {
    slug: 'dr18',
    branch: 'sanampao',
    specialty: 'dermatology',
    nameTh: 'นพ. นราวิชญ์ พัฒนกิจ',
    nameEn: 'Dr. Narawit Pattanakit',
    specialtyLabel: { th: 'เลเซอร์ผิวหนังและแผลเป็น', en: 'Laser Dermatology & Scar Treatment' },
    subNote: { th: 'แพทย์เฉพาะทางผิวหนังและเลเซอร์', en: 'Dermatology & Laser Specialist' },
    photo: 'assets/images/treatments/specialist-3.jpg',
  },
  {
    slug: 'dr19',
    branch: 'phaholyothin',
    specialty: 'longevity',
    nameTh: 'พญ. สุพิชญา เลิศวัฒนะ',
    nameEn: 'Dr. Supitchaya Lertwattana',
    specialtyLabel: { th: 'สมดุลฮอร์โมนและสุขภาพสตรี', en: "Hormone Balance & Women's Health" },
    subNote: { th: 'ผู้เชี่ยวชาญฮอร์โมนและเวชศาสตร์ชะลอวัย', en: 'Hormone & Anti-Aging Specialist' },
    photo: 'assets/images/doctors/dr02.png',
  },
  {
    slug: 'dr20',
    branch: 'sriayudhaya',
    specialty: 'wellness',
    nameTh: 'นพ. กิตติภูมิ รัตนวงศ์',
    nameEn: 'Dr. Kittipoom Rattanawong',
    specialtyLabel: { th: 'การนอนหลับและการจัดการความเครียด', en: 'Sleep & Stress Medicine' },
    subNote: { th: 'แพทย์ผู้เชี่ยวชาญสุขภาพองค์รวม', en: 'Holistic Wellness Specialist' },
    photo: 'assets/images/hero/herobg03.png',
  },
  {
    slug: 'dr21',
    branch: 'petchakasem',
    specialty: 'dermatology',
    nameTh: 'พญ. ณัฐริกา สุขประเสริฐ',
    nameEn: 'Dr. Nattarika Sukprasert',
    specialtyLabel: { th: 'สิว ฝ้า และปัญหาสีผิว', en: 'Acne, Melasma & Pigmentation' },
    subNote: { th: 'วุฒิบัตรแพทย์เฉพาะทางผิวหนัง', en: 'Board Certified Dermatologist' },
    photo: 'assets/images/treatments/expertise-skin.jpg',
  },
  {
    slug: 'dr22',
    branch: 'sriracha',
    specialty: 'longevity',
    nameTh: 'นพ. วชิรวิทย์ อินทรกุล',
    nameEn: 'Dr. Wachirawit Intharakul',
    specialtyLabel: { th: 'โภชนาการและสุขภาพเมตาบอลิก', en: 'Nutrition & Metabolic Health' },
    subNote: { th: 'ผู้เชี่ยวชาญเวชศาสตร์ชะลอวัย', en: 'Anti-Aging Medicine Specialist' },
    photo: 'assets/images/hero/herobg04.png',
  },
  {
    slug: 'dr23',
    branch: 'sanampao',
    specialty: 'plastic',
    nameTh: 'พญ. อรปรียา มณีรัตน์',
    nameEn: 'Dr. Orapreeya Maneerat',
    specialtyLabel: { th: 'ศัลยกรรมหน้าอกและรูปร่าง', en: 'Breast & Body Surgery' },
    subNote: { th: 'ศัลยแพทย์ตกแต่งเฉพาะทาง', en: 'Board Certified Plastic Surgeon' },
    photo: 'assets/images/doctors/dr01.png',
  },
  {
    slug: 'dr24',
    branch: 'phaholyothin',
    specialty: 'wellness',
    nameTh: 'นพ. ภาคิน วิสุทธิ์วงศ์',
    nameEn: 'Dr. Pakin Wisutwong',
    specialtyLabel: { th: 'สุขภาพบุรุษและสมรรถภาพร่างกาย', en: "Men's Health & Performance" },
    subNote: { th: 'ผู้เชี่ยวชาญสุขภาพบุรุษเฉพาะบุคคล', en: "Men's Health Specialist" },
    photo: 'assets/images/treatments/specialist-1.jpg',
  },
  {
    slug: 'dr25',
    branch: 'sriayudhaya',
    specialty: 'dermatology',
    nameTh: 'พญ. เขมิกา รุ่งเรือง',
    nameEn: 'Dr. Khemika Rungruang',
    specialtyLabel: { th: 'ผิวพรรณและเวชศาสตร์ความงาม', en: 'Aesthetic Dermatology' },
    subNote: { th: 'แพทย์เฉพาะทางผิวหนังและความงาม', en: 'Aesthetic Dermatology Specialist' },
    photo: 'assets/images/treatments/specialist-2.jpg',
  },
  {
    slug: 'dr26',
    branch: 'petchakasem',
    specialty: 'longevity',
    nameTh: 'นพ. ศุภณัฐ ธรรมคุณ',
    nameEn: 'Dr. Suphanat Thammakun',
    specialtyLabel: { th: 'สุขภาพลำไส้และภูมิคุ้มกัน', en: 'Gut Health & Immunity' },
    subNote: { th: 'แพทย์เวชศาสตร์เชิงหน้าที่', en: 'Functional Medicine Practitioner' },
    photo: 'assets/images/doctors/dr02.png',
  },
  {
    slug: 'dr27',
    branch: 'sriracha',
    specialty: 'plastic',
    nameTh: 'พญ. ลลิตา วงศ์พิพัฒน์',
    nameEn: 'Dr. Lalita Wongpipat',
    specialtyLabel: { th: 'ศัลยกรรมยกกระชับใบหน้า', en: 'Facelift & Rejuvenation Surgery' },
    subNote: { th: 'ศัลยแพทย์ตกแต่งใบหน้าเฉพาะทาง', en: 'Facial Plastic Surgery Specialist' },
    photo: 'assets/images/treatments/expertise-plastic.jpg',
  },
  {
    slug: 'dr28',
    branch: 'sanampao',
    specialty: 'wellness',
    nameTh: 'นพ. รชต ภูวดล',
    nameEn: 'Dr. Rachata Poowadon',
    specialtyLabel: { th: 'เวชศาสตร์การกีฬาและการฟื้นตัว', en: 'Sports Medicine & Recovery' },
    subNote: { th: 'ผู้เชี่ยวชาญการฟื้นฟูสมรรถภาพ', en: 'Sports Recovery Specialist' },
    photo: 'assets/images/brand/about-lounge.jpg',
  },
  {
    slug: 'dr29',
    branch: 'phaholyothin',
    specialty: 'dermatology',
    nameTh: 'พญ. ธัญชนก วีระกุล',
    nameEn: 'Dr. Thanchanok Weerakul',
    specialtyLabel: { th: 'เส้นผมและหนังศีรษะ', en: 'Hair & Scalp Dermatology' },
    subNote: { th: 'แพทย์เฉพาะทางผิวหนังและเส้นผม', en: 'Hair Dermatology Specialist' },
    photo: 'assets/images/treatments/expertise-skin.jpg',
  },
  {
    slug: 'dr30',
    branch: 'sriayudhaya',
    specialty: 'longevity',
    nameTh: 'นพ. ปุณณวิช ศิริเมธา',
    nameEn: 'Dr. Punnawit Sirimetha',
    specialtyLabel: { th: 'การประเมินอายุชีวภาพและพันธุกรรม', en: 'Biological Age & Genomics' },
    subNote: { th: 'ผู้เชี่ยวชาญเวชศาสตร์แม่นยำ', en: 'Precision Longevity Specialist' },
    photo: 'assets/images/hero/herobg04.png',
  },
]
