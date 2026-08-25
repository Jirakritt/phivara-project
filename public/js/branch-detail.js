(function () {
  'use strict';

  const branches = window.PhivaraSiteShell?.branches || [];
  const branchId = document.body.dataset.branchId;
  const branch = branches.find((item) => item.id === branchId);

  if (!branch) {
    window.location.replace('contact.html');
    return;
  }

  const branchIndex = branches.findIndex((item) => item.id === branchId);

  const branchDataMap = {
    pt2: {
      doctors: [
        {
          id: 'dr13',
          nameTh: 'พญ. กอบกุลยา จึงประเสริฐศรี',
          nameEn: 'Dr. Kobkulya Juengprasertsri',
          specTh: 'แพทย์ผู้อำนวยการศูนย์เวชศาสตร์ชะลอวัย โรงพยาบาลพญาไท 2',
          specEn: 'Medical Director, Anti-Aging & Regenerative Medicine Center, Phyathai 2 Hospital',
          subTh: 'แพทย์เชี่ยวชาญด้านเวชศาสตร์ชะลอวัยและการแพทย์เชิงป้องกันแบบองค์รวม',
          subEn: 'Specialist in Anti-Aging & Integrative Preventive Medicine',
          photo: 'assets/images/doctors/dr-highlight-sanampao.png'
        },
        {
          id: 'dr18',
          nameTh: 'นพ. นราวิชญ์ พัฒนกิจ',
          nameEn: 'Dr. Narawit Pattanakit',
          specTh: 'เลเซอร์ผิวหนังและแผลเป็น',
          specEn: 'Laser Dermatology & Scar Treatment',
          subTh: 'แพทย์เฉพาะทางผิวหนังและเลเซอร์',
          subEn: 'Dermatology & Laser Specialist',
          photo: 'assets/images/treatments/specialist-3.jpg'
        },
        {
          id: 'dr23',
          nameTh: 'พญ. อรปรียา มณีรัตน์',
          nameEn: 'Dr. Orapreeya Maneerat',
          specTh: 'ศัลยกรรมหน้าอกและรูปร่าง',
          specEn: 'Breast & Body Surgery',
          subTh: 'ศัลยแพทย์ตกแต่งเฉพาะทาง',
          subEn: 'Board Certified Plastic Surgeon',
          photo: 'assets/images/doctors/dr01.png'
        },
        {
          id: 'dr28',
          nameTh: 'นพ. รชต ภูวดล',
          nameEn: 'Dr. Rachata Poowadon',
          specTh: 'เวชศาสตร์การกีฬาและการฟื้นตัว',
          specEn: 'Sports Medicine & Recovery',
          subTh: 'ผู้เชี่ยวชาญการฟื้นฟูสมรรถภาพ',
          subEn: 'Sports Recovery Specialist',
          photo: 'assets/images/treatments/specialist-1.jpg'
        },
        {
          id: 'dr01',
          nameTh: 'นพ. พงศกร สุวรรณรัตน์',
          nameEn: 'Dr. Pongsakorn Suwanarat',
          specTh: 'ศัลยกรรมปรับโครงสร้างใบหน้า',
          specEn: 'Facial Structural Surgery',
          subTh: 'ศัลยแพทย์ตกแต่งเฉพาะทาง',
          subEn: 'Facial Plastic Specialist',
          photo: 'assets/images/doctors/dr01.png'
        },
        {
          id: 'dr08',
          nameTh: 'พญ. สิริกร กิตติเวช',
          nameEn: 'Dr. Sirikorn Kittivech',
          specTh: 'ศัลยกรรมแก้ไขหนังตาตกและกล้ามเนื้อตา',
          specEn: 'Ptosis Correction & Oculoplastic',
          subTh: 'จักษุแพทย์เฉพาะทางตกแต่งรอบดวงตา',
          subEn: 'Oculoplastic Specialist',
          photo: 'assets/images/doctors/dr01.png'
        },
        {
          id: 'dr09',
          nameTh: 'นพ. วรเมธ สุจริตกุล',
          nameEn: 'Dr. Worameth Sutjaritkul',
          specTh: 'ศัลยกรรมตกแต่งจมูกโอเพ่น',
          specEn: 'Open Rhinoplasty Specialist',
          subTh: 'ศัลยแพทย์ตกแต่งเฉพาะทางใบหน้า',
          subEn: 'Facial Surgery Specialist',
          photo: 'assets/images/treatments/specialist-1.jpg'
        },
        {
          id: 'dr10',
          nameTh: 'พญ. ปณิดา วิวัฒนานนท์',
          nameEn: 'Dr. Panida Wiwattananon',
          specTh: 'เลเซอร์ยกกระชับและฟื้นฟูผิว',
          specEn: 'Laser & Skin Rejuvenation',
          subTh: 'แพทย์เฉพาะทางผิวหนัง',
          subEn: 'Dermatology Specialist',
          photo: 'assets/images/treatments/specialist-2.jpg'
        },
        {
          id: 'dr11',
          nameTh: 'นพ. กฤษดา ศิริอนันต์',
          nameEn: 'Dr. Kritsada Sirianan',
          specTh: 'ศัลยกรรมตกแต่งเสริมสร้างเฉพาะทาง',
          specEn: 'Reconstructive Plastic Surgery',
          subTh: 'ศัลยแพทย์ตกแต่งเฉพาะทาง',
          subEn: 'Board Certified Plastic Surgeon',
          photo: 'assets/images/doctors/dr01.png'
        }
      ],
      programs: [
        {
          code: 'PRG-SP01',
          tagTh: 'ศัลยกรรมตกแต่ง',
          tagEn: 'PLASTIC SURGERY',
          titleTh: 'โปรแกรมศัลยกรรมตาสองชั้น & ปรับโครงสร้างตา VIP',
          titleEn: 'VIP Oculoplastic & Eyelid Reconstruction',
          descTh: 'เทคนิคแก้ปัญหาหนังตาตก ตาชั้นเดียว โดยศัลยแพทย์เฉพาะทางระดับโรงพยาบาล ผลลัพธ์แผลเล็ก บวมน้อย และเป็นธรรมชาติ',
          descEn: 'Natural double eyelid surgery & ptosis correction by oculoplastic specialists with minimal downtime.',
          price: '35,000',
          image: 'assets/images/treatments/expertise-plastic.jpg'
        },
        {
          code: 'PRG-SP02',
          tagTh: 'ศัลยกรรมปรับรูปหน้า',
          tagEn: 'FACIAL SURGERY',
          titleTh: 'โปรแกรมศัลยกรรมเสริมจมูก Open Reconstruction',
          titleEn: 'Open Rhinoplasty Reconstruction',
          descTh: 'ปรับโครงสร้างจมูกตอกฐาน ปลูกถ่ายกระดูกอ่อนหลังหูและผนังกั้นห้องจมูก ทรงสวยสโลปปลายพุ่งเป็นธรรมชาติ',
          descEn: 'Open rhinoplasty with septal cartilage grafting for structural refinement and high safety.',
          price: '85,000',
          image: 'assets/images/treatments/specialist-1.jpg'
        },
        {
          code: 'PRG-SP03',
          tagTh: 'VIP RECOVERY',
          tagEn: 'VIP CARE',
          titleTh: 'โปรแกรมดมยาสลบโดยวิสัญญีแพทย์ & ห้องพักฟื้นส่วนตัว VIP',
          titleEn: 'Anesthesia Care & VIP Recovery Suite',
          descTh: 'ระบบความปลอดภัยระดับโรงพยาบาลพญาไท เฝ้าระวังโดยวิสัญญีแพทย์แบบ 1 ต่อ 1 พร้อมห้องพักฟื้นส่วนตัวตลอด 24 ชม.',
          descEn: 'Hospital-standard general anesthesia with 1-on-1 anesthesiologist monitoring and VIP recovery suite.',
          price: '25,000',
          image: 'assets/images/brand/about-lounge.jpg'
        },
        {
          tagTh: 'LONGEVITY',
          tagEn: 'LONGEVITY',
          titleTh: 'โปรแกรมประเมินสุขภาพและอายุชีวภาพ',
          titleEn: 'Biological Age & Longevity Assessment',
          descTh: 'มองเห็นความเสี่ยงก่อนเกิดโรค และประเมินความสมดุลของร่างกายในระดับที่ลึกกว่าการตรวจสุขภาพทั่วไป',
          descEn: 'See risks before symptoms and evaluate whole-body balance beyond a standard checkup.',
          price: '24,500',
          image: 'assets/images/treatments/expertise-longevity.jpg'
        },
        {
          tagTh: 'HORMONE',
          tagEn: 'HORMONE',
          titleTh: 'โปรแกรมตรวจสมดุลฮอร์โมนเชิงลึก',
          titleEn: 'Advanced Hormone Balance',
          descTh: 'ค้นหาสาเหตุของความเหนื่อยล้า นอนหลับไม่เต็มอิ่ม น้ำหนักเปลี่ยน หรืออารมณ์แปรปรวน',
          descEn: 'Explore the causes of fatigue, poor sleep, weight changes, and mood fluctuations.',
          price: '20,000',
          image: 'assets/images/treatments/specialist-1.jpg'
        },
        {
          tagTh: 'CARDIOVASCULAR',
          tagEn: 'CARDIOVASCULAR',
          titleTh: 'โปรแกรมประเมินความเสี่ยงหัวใจและหลอดเลือด',
          titleEn: 'Advanced Cardiovascular Risk',
          descTh: 'วิเคราะห์ปัจจัยเสี่ยงซ่อนเร้น ตั้งแต่ไขมันอนุภาคเล็ก ภาวะอักเสบ ไปจนถึงสมรรถนะการไหลเวียน',
          descEn: 'Analyze hidden risks from advanced lipids and inflammation to circulatory performance.',
          price: '18,500',
          image: 'assets/images/hero/herobg03.png'
        },
        {
          tagTh: 'SKIN & HAIR',
          tagEn: 'SKIN & HAIR',
          titleTh: 'โปรแกรมวิเคราะห์สุขภาพผิวและเส้นผม',
          titleEn: 'Skin & Hair Health Analysis',
          descTh: 'ประเมินปัจจัยภายในที่ส่งผลต่อผิวหมอง ริ้วรอย ผมบาง และการฟื้นตัวของผิว',
          descEn: 'Assess internal factors behind dullness, aging, hair thinning, and skin recovery.',
          price: '15,500',
          image: 'assets/images/treatments/expertise-skin.jpg'
        },
        {
          tagTh: 'PRECISION HEALTH',
          tagEn: 'PRECISION HEALTH',
          titleTh: 'โปรแกรมวิเคราะห์พันธุกรรมเพื่อสุขภาพ',
          titleEn: 'Precision Genetic Health',
          descTh: 'ถอดรหัสแนวโน้มสุขภาพ การตอบสนองต่ออาหาร การออกกำลังกาย และยาบางกลุ่มจากข้อมูลพันธุกรรม',
          descEn: 'Decode health tendencies and responses to nutrition, exercise, and selected medications.',
          price: '32,000',
          image: 'assets/images/treatments/specialist-3.jpg'
        }
      ],
      articles: [
        {
          tag: 'FACIAL SURGERY',
          titleTh: 'ไขข้อข้องใจ: ทำตาสองชั้นเทคนิคซ่อนแผล พักฟื้นกี่วัน และดูแลอย่างไรให้เข้าทรงเร็ว',
          titleEn: 'Invisible Scar Eyelid Surgery: Recovery Guide & Post-Op Care',
          descTh: 'เจาะลึกเทคนิคศัลยกรรมตาสองชั้นระดับโรงพยาบาลพญาไท 2 แผลเล็ก กรีดสั้น ไม่ต้องพักฟื้นนาน',
          image: 'assets/images/treatments/expertise-plastic.jpg',
          meta: '12 มิ.ย. 2026 • อ่าน 5 นาที'
        },
        {
          tag: 'INNOVATION',
          titleTh: 'Ulthera SPT vs Thermage FLX: เลือกเทคโนโลยีไหนให้เหมาะกับโครงสร้างผิวของคุณ',
          titleEn: 'Ulthera SPT vs Thermage FLX: Choosing the Right Technology',
          descTh: 'เปรียบเทียบข้อดี ความแตกต่าง และผลลัพธ์ของสองสุดยอดเครื่องมือยกกระชับระดับโลกที่ผ่านการรับรอง U.S. FDA',
          image: 'assets/images/treatments/specialist-2.jpg',
          meta: '18 ก.ค. 2026 • อ่าน 6 นาที'
        },
        {
          tag: 'SAFETY GUIDE',
          titleTh: 'มาตรฐานความปลอดภัยห้องผ่าตัดแรงดันบวก (Positive Pressure Operating Room)',
          titleEn: 'Hospital-Grade Positive Pressure Operating Suite Standards',
          descTh: 'ทำไมห้องผ่าตัดปราศจากเชื้อและระบบกรองอากาศ HEPA Filter ถึงสำคัญที่สุดสำหรับการศัลยกรรมตกแต่ง',
          image: 'assets/images/brand/about-lounge.jpg',
          meta: '02 ก.ค. 2026 • อ่าน 4 นาที'
        }
      ],
      facilitiesTh: [
        'ห้องผ่าตัดปลอดเชื้อแรงดันบวก (Positive Pressure OR) มาตรฐานโรงพยาบาลพญาไท 2',
        'ห้องพักฟื้นส่วนตัว VIP Recovery Suite พร้อมพยาบาลดูแลตลอด 24 ชั่วโมง',
        'เครื่องมือยกกระชับ Ulthera SPT และ Thermage FLX ของแท้ตรวจสอบได้',
        'VIP Private Lounge สำหรับการปรึกษาแบบเป็นส่วนตัวสูง'
      ],
      facilitiesEn: [
        'Phyathai 2 Hospital-grade Positive Pressure Sterile Operating Theaters',
        'Private VIP Recovery Suites with 24-hour dedicated nursing care',
        'Authentic U.S. FDA-approved Ulthera SPT & Thermage FLX technology',
        'Exclusive VIP Lounge for confidential doctor consultations'
      ],
      directionsTh: 'เดินทางสะดวกด้วย รถไฟฟ้า BTS ลงสถานีสนามเป้า (ทางออก 1) เชื่อมตรงเข้าสู่โรงพยาบาลพญาไท 2 ชั้น 8 อาคาร A มีอาคารจอดรถกว้างขวางรองรับกว่า 500 คัน พร้อมบริการ Valet Parking',
      directionsEn: 'Direct BTS SkyTrain access via Sanampao Station (Exit 1) into Phyathai 2 Hospital, 8th Floor Building A. Spacious parking building for 500+ cars with complimentary Valet Parking.'
    },
    ptp: {
      doctors: [
        {
          id: 'dr14',
          nameTh: 'นพ. ธีรภัทร จิรเวช',
          nameEn: 'Dr. Teerapat Jiravej',
          specTh: 'เวชศาสตร์ป้องกันและสุขภาพเชิงลึก',
          specEn: 'Preventive & Precision Medicine',
          subTh: 'ผู้เชี่ยวชาญเวชศาสตร์ป้องกันเฉพาะบุคคล',
          subEn: 'Precision Medicine Specialist',
          photo: 'assets/images/doctors/dr02.png'
        },
        {
          id: 'dr19',
          nameTh: 'พญ. สุพิชญา เลิศวัฒนะ',
          nameEn: 'Dr. Supitchaya Lertwattana',
          specTh: 'สมดุลฮอร์โมนและสุขภาพสตรี',
          specEn: 'Hormone Balance & Women’s Health',
          subTh: 'ผู้เชี่ยวชาญฮอร์โมนและเวชศาสตร์ชะลอวัย',
          subEn: 'Hormone & Anti-Aging Specialist',
          photo: 'assets/images/doctors/dr02.png'
        },
        {
          id: 'dr24',
          nameTh: 'นพ. ภาคิน วิสุทธิ์วงศ์',
          nameEn: 'Dr. Pakin Wisutwong',
          specTh: 'สุขภาพบุรุษและสมรรถภาพร่างกาย',
          specEn: 'Men’s Health & Performance',
          subTh: 'ผู้เชี่ยวชาญสุขภาพบุรุษเฉพาะบุคคล',
          subEn: 'Men’s Health Specialist',
          photo: 'assets/images/treatments/specialist-1.jpg'
        },
        {
          id: 'dr29',
          nameTh: 'พญ. ธัญชนก วีระกุล',
          nameEn: 'Dr. Thanchanok Weerakul',
          specTh: 'เส้นผมและหนังศีรษะ',
          specEn: 'Hair & Scalp Dermatology',
          subTh: 'แพทย์เฉพาะทางผิวหนังและเส้นผม',
          subEn: 'Hair Dermatology Specialist',
          photo: 'assets/images/treatments/expertise-skin.jpg'
        },
        {
          id: 'dr02',
          nameTh: 'พญ. วรัญญา ศิริวัฒน์',
          nameEn: 'Dr. Waranya Siriwat',
          specTh: 'เวชศาสตร์ชะลอวัยและฟื้นฟูเซลล์',
          specEn: 'Anti-Aging & Cellular Rejuvenation',
          subTh: 'แพทย์เฉพาะทางชะลอวัย',
          subEn: 'Anti-Aging Specialist',
          photo: 'assets/images/doctors/dr02.png'
        }
      ],
      programs: [
        {
          code: 'PRG-PH01',
          tagTh: 'CELLULAR LONGEVITY',
          tagEn: 'LONGEVITY',
          titleTh: 'โปรแกรมตรวจวิเคราะห์อายุชีวภาพ Cellular Bio-Age Profile',
          titleEn: 'Cellular Bio-Age & Telomere Analysis',
          descTh: 'ตรวจวัดความยาวสายดีเอ็นเอ (Telomere Length) และความเสื่อมระดับเซลล์ เพื่อวางแผนย้อนวัยอย่างแม่นยำ',
          descEn: 'In-depth telomere length & cellular bio-age testing to customize your personalized anti-aging therapy.',
          price: '28,000'
        },
        {
          code: 'PRG-PH02',
          tagTh: 'IV THERAPY',
          tagEn: 'IV REJUVENATION',
          titleTh: 'โปรแกรมฟื้นฟู NAD+ & IV Longevity Infusion',
          titleEn: 'NAD+ Cellular Energy & Longevity Infusion',
          descTh: 'เติมพลังงานไมโทคอนเดรีย ซ่อมแซม DNA ลดความอ่อนล้า และกระตุ้นความจำชะลอความชราอย่างสมบูรณ์แบบ',
          descEn: 'Replenish mitochondrial energy, repair DNA, improve mental focus, and slow cellular aging.',
          price: '19,500'
        },
        {
          code: 'PRG-PH03',
          tagTh: 'HORMONE BALANCE',
          tagEn: 'HORMONE CARE',
          titleTh: 'โปรแกรมสมดุลฮอร์โมนธรรมชาติ Bio-identical Hormone Therapy',
          titleEn: 'Bio-Identical Hormone Replacement Therapy',
          descTh: 'ตรวจระดับฮอร์โมน 12 รายการ และจัดสูตรฮอร์โมนธรรมชาติเฉพาะบุคคล ฟื้นฟูอารมณ์ การนอนหลับ และความสดชื่น',
          descEn: 'Comprehensive 12-hormone panel assessment with personalized bio-identical hormone optimization.',
          price: '22,000'
        }
      ],
      articles: [
        {
          tag: 'LONGEVITY MEDICINE',
          titleTh: 'NAD+ Therapy: นวัตกรรมชะลอวัยระดับเซลล์ที่ย้อนอายุชีวภาพได้อย่างไร',
          titleEn: 'NAD+ Therapy: How Cellular Energy Therapy Reverses Biological Aging',
          descTh: 'ทำความรู้จักสารสำคัญในร่างกายที่ช่วยกระตุ้นยีนชะลอวัย Sirtuins และการซ่อมแซมเซลล์ที่อ่อนล้า',
          image: 'assets/images/treatments/expertise-longevity.jpg',
          meta: '15 ก.ค. 2026 • อ่าน 5 นาที'
        },
        {
          tag: 'HORMONE WELLNESS',
          titleTh: 'สัญญาณเตือนภาวะฮอร์โมนพร่องก่อนวัยอันควร และวิธีปรับสมดุลอย่างปลอดภัย',
          titleEn: 'Early Warning Signs of Hormone Imbalance & Safe Optimization',
          descTh: 'นอนไม่หลับ อ่อนเพลียเรื้อรัง อารมณ์แปรปรวน รู้ทันและแก้ไขได้ด้วยเวชศาสตร์ชะลอวัย',
          image: 'assets/images/hero/herobg03.png',
          meta: '08 ก.ค. 2026 • อ่าน 4 นาที'
        },
        {
          tag: 'HAIR DERMATOLOGY',
          titleTh: 'ฟื้นฟูผมร่วง ผมบาง ด้วยนวัตกรรม PRP & Cell Hair Rejuvenation',
          titleEn: 'Hair Loss & Thinning Treatments: PRP & Autologous Cell Therapy',
          descTh: 'กระตุ้นรากผมให้แข็งแรง ดกดำ ด้วยเกล็ดเลือดเข้มข้นสกัดบริสุทธิ์เฉพาะบุคคล',
          image: 'assets/images/treatments/expertise-skin.jpg',
          meta: '28 มิ.ย. 2026 • อ่าน 5 นาที'
        }
      ],
      facilitiesTh: [
        'ห้องตรวจวิเคราะห์สุขภาพเชิงลึก Precision Diagnostics Suite',
        'ห้อง IV Drip Lounge บรรยากาศเงียบสงบส่วนตัวระดับเฟิร์สคลาส',
        'ศูนย์วิเคราะห์เส้นผมและหนังศีรษะ Trichology Center',
        'ระบบสำรองนัดหมายและดูแลส่วนบุคคล VIP Concierge Service'
      ],
      facilitiesEn: [
        'Precision Diagnostics Suite for cellular health evaluation',
        'First-class private IV Infusion Therapy Lounge',
        'Advanced Hair & Scalp Trichology Diagnostic Unit',
        'Dedicated VIP Concierge & Personalized Care Team'
      ],
      directionsTh: 'ตั้งอยู่บนถนนพหลโยธิน ซอยพหลโยธิน 2 (BTS อารีย์ หรือ BTS สนามเป้า) อาคาร PHIVARA Medical Center ชั้น 6 มีที่จอดรถในอาคารกว่า 150 คัน พร้อมบริการล้างรถและ Valet Service',
      directionsEn: 'Located on Phaholyothin Road (BTS Ari or BTS Sanampao), PHIVARA Medical Center 6th Floor. Covered parking for 150+ cars with Valet Service.'
    },
    pt1: {
      doctors: [
        {
          id: 'dr15',
          nameTh: 'พญ. พิมพ์ชนก ศรีวรางค์',
          nameEn: 'Dr. Pimchanok Sriwarang',
          specTh: 'ผิวหนังอักเสบและผิวบอบบาง',
          specEn: 'Sensitive Skin & Clinical Dermatology',
          subTh: 'วุฒิบัตรแพทย์เฉพาะทางผิวหนัง',
          subEn: 'Board Certified Dermatologist',
          photo: 'assets/images/treatments/specialist-2.jpg'
        },
        {
          id: 'dr20',
          nameTh: 'นพ. กิตติภูมิ รัตนวงศ์',
          nameEn: 'Dr. Kittipoom Rattanawong',
          specTh: 'การนอนหลับและการจัดการความเครียด',
          specEn: 'Sleep & Stress Medicine',
          subTh: 'แพทย์ผู้เชี่ยวชาญสุขภาพองค์รวม',
          subEn: 'Holistic Wellness Specialist',
          photo: 'assets/images/hero/herobg03.png'
        },
        {
          id: 'dr25',
          nameTh: 'พญ. เขมิกา รุ่งเรือง',
          nameEn: 'Dr. Khemika Rungruang',
          specTh: 'ผิวพรรณและเวชศาสตร์ความงาม',
          specEn: 'Aesthetic Dermatology',
          subTh: 'แพทย์เฉพาะทางผิวหนังและความงาม',
          subEn: 'Aesthetic Dermatology Specialist',
          photo: 'assets/images/treatments/specialist-2.jpg'
        },
        {
          id: 'dr30',
          nameTh: 'นพ. ปุณณวิช ศิริเมธา',
          nameEn: 'Dr. Punnawit Sirimetha',
          specTh: 'การประเมินอายุชีวภาพและพันธุกรรม',
          specEn: 'Biological Age & Genomics',
          subTh: 'ผู้เชี่ยวชาญเวชศาสตร์แม่นยำ',
          subEn: 'Precision Longevity Specialist',
          photo: 'assets/images/hero/herobg04.png'
        },
        {
          id: 'dr03',
          nameTh: 'นพ. ธันวา ชัยประเสริฐ',
          nameEn: 'Dr. Thanwa Chaiprasert',
          specTh: 'เลเซอร์ผิวหนังและฟื้นฟูคอลลาเจน',
          specEn: 'Clinical Laser & Skincare Specialist',
          subTh: 'แพทย์เฉพาะทางผิวหนัง',
          subEn: 'Dermatology Specialist',
          photo: 'assets/images/treatments/specialist-3.jpg'
        }
      ],
      programs: [
        {
          code: 'PRG-SA01',
          tagTh: 'ULTHERAPY SPT',
          tagEn: 'SMAS LIFTING',
          titleTh: 'โปรแกรม Ulthera SPT Real-time Visualization 800 Lines',
          titleEn: 'Ulthera SPT Real-Time SMAS Lifting 800 Lines',
          descTh: 'ยกกระชับกรอบหน้า แก้ม เหนียง ด้วยหน้าจอแสดงผลชั้นผิว Real-time ยิงลึกถึงชั้น SMAS แม่นยำ ไม่เจ็บ',
          descEn: 'Non-invasive SMAS lifting using U.S. FDA-approved Ulthera SPT with real-time ultrasound visualization.',
          price: '59,000'
        },
        {
          code: 'PRG-SA02',
          tagTh: 'THERMAGE FLX',
          tagEn: 'SKIN TIGHTENING',
          titleTh: 'โปรแกรม Thermage FLX Total Face & Eye Rejuvenation',
          titleEn: 'Thermage FLX Face & Eye Collagen Tightening',
          descTh: 'สลายไขมันแก้ม เหนียง และกระตุ้นคอลลาเจนใหม่ด้วยคลื่น Monopolar RF หัวทิปแท้ตรวจสอบได้ 900 Shot',
          descEn: 'Monopolar RF collagen remodeling & fat reduction for firm, contour-refined facial skin.',
          price: '65,000'
        },
        {
          code: 'PRG-SA03',
          tagTh: 'PICO LASER',
          tagEn: 'PIGMENT CLEARS',
          titleTh: 'โปรแกรม PicoSure Pro Laser Full Face & Brightening',
          titleEn: 'PicoSure Pro Laser Pigmentation & Texture Clearance',
          descTh: 'ลบรอยดำ ฝ้า กระ รอยแผลเป็นสิว และสว่างกระจ่างใสด้วยเทคโนโลยี Picosecond 755nm ที่ดีที่สุดในโลก',
          descEn: '755nm Picosecond laser for melasma, acne scars, and instant skin tone brightening.',
          price: '15,000'
        }
      ],
      articles: [
        {
          tag: 'ULTHERA SPT',
          titleTh: 'Ulthera SPT นวัตกรรมยกกระชับชั้น SMAS แบบ Real-time แม่นยำ ปลอดภัย เห็นผลทันที',
          titleEn: 'Ulthera SPT: Real-time Ultrasound SMAS Lifting Technology Explained',
          descTh: 'ทำไมเทคโนโลยีการมองเห็นชั้นผิวขณะยิงถึงเป็นหัวใจสำคัญของการยกกระชับกรอบหน้าให้อยู่ได้นานถึง 1-2 ปี',
          image: 'assets/images/treatments/specialist-2.jpg',
          meta: '20 ก.ค. 2026 • อ่าน 6 นาที'
        },
        {
          tag: 'FILLER INJECTION',
          titleTh: 'ฉีด Filler อย่างไรให้ดูเป็นธรรมชาติ ไม่เป็นก้อน ปลอดภัยด้วยการสแกนหลอดเลือด',
          titleEn: 'Natural Dermal Filler Injection Techniques & Vascular Safety Mapping',
          descTh: 'เทคนิคการเติมเต็มร่องลึก ปรับโหงวเฮ้ง และการเลือกสารเติมเต็ม Hyaluronic Acid แท้มาตรฐานระดับโลก',
          image: 'assets/images/treatments/expertise-skin.jpg',
          meta: '10 ก.ค. 2026 • อ่าน 5 นาที'
        },
        {
          tag: 'PICOSECOND LASER',
          titleTh: 'PicoSure Pro 755nm: เทคโนโลยีเลเซอร์รักษาฝ้า กระ และรอยดำที่ไม่ทำร้ายชั้นผิว',
          titleEn: 'PicoSure Pro 755nm: Advanced Picosecond Laser for Flawless Skin Texture',
          descTh: 'เจาะลึกนวัตกรรมคลื่นความถี่ 755 นาโนเมตรที่สลายเม็ดสีเป็นผุยผงโดยไม่เสี่ยงหน้าดำหลังทำ',
          image: 'assets/images/treatments/specialist-3.jpg',
          meta: '01 ก.ค. 2026 • อ่าน 4 นาที'
        }
      ],
      facilitiesTh: [
        'ห้องหัตถการเลเซอร์และผิวพรรณมาตรฐาน U.S. FDA Certified Suite',
        'เครื่อง Ulthera SPT, Thermage FLX, PicoSure Pro ของแท้มีสติ๊กเกอร์ตรวจสอบ',
        'ระบบสแกนวิเคราะห์สภาพผิวเชิงลึก VISIA Complexion Analysis',
        'ห้องทรีตเมนต์ผ่อนคลายบรรยากาศสปาหรูระดับโรงแรม 5 ดาว'
      ],
      facilitiesEn: [
        'U.S. FDA Certified Laser & Dermatology Procedure Suite',
        'Authentic Ulthera SPT, Thermage FLX & PicoSure Pro equipment',
        'VISIA 3D Complexion & Pigment Analysis technology',
        '5-star hotel luxury private skincare treatment rooms'
      ],
      directionsTh: 'ตั้งอยู่บนถนนศรีอยุธยา (ใกล้แยกพญาไท และ BTS พญาไท / Airport Rail Link พญาไท) ชั้น 5 อาคาร PHIVARA Medical Center เดินทางสะดวก มีที่จอดรถใต้ดินกว่า 200 คัน',
      directionsEn: 'Located on Sri Ayudhaya Road (Near Phaya Thai Intersection, BTS/ARL Phaya Thai), 5th Floor PHIVARA Medical Center. Underground parking for 200+ vehicles.'
    },
    pt3: {
      doctors: [
        {
          id: 'dr16',
          nameTh: 'นพ. อชิระ ธนากร',
          nameEn: 'Dr. Achira Thanakorn',
          specTh: 'เวชศาสตร์ฟื้นฟูและการเคลื่อนไหว',
          specEn: 'Rehabilitation & Movement Medicine',
          subTh: 'ผู้เชี่ยวชาญเวชศาสตร์ฟื้นฟู',
          subEn: 'Rehabilitation Medicine Specialist',
          photo: 'assets/images/treatments/specialist-1.jpg'
        },
        {
          id: 'dr21',
          nameTh: 'พญ. ณัฐริกา สุขประเสริฐ',
          nameEn: 'Dr. Nattarika Sukprasert',
          specTh: 'สิว ฝ้า และปัญหาสีผิว',
          specEn: 'Acne, Melasma & Pigmentation',
          subTh: 'วุฒิบัตรแพทย์เฉพาะทางผิวหนัง',
          subEn: 'Board Certified Dermatologist',
          photo: 'assets/images/treatments/expertise-skin.jpg'
        },
        {
          id: 'dr26',
          nameTh: 'นพ. ศุภณัฐ ธรรมคุณ',
          nameEn: 'Dr. Suphanat Thammakun',
          specTh: 'สุขภาพลำไส้และภูมิคุ้มกัน',
          specEn: 'Gut Health & Immunity',
          subTh: 'แพทย์เวชศาสตร์เชิงหน้าที่',
          subEn: 'Functional Medicine Practitioner',
          photo: 'assets/images/doctors/dr02.png'
        },
        {
          id: 'dr04',
          nameTh: 'พญ. ปรียาภรณ์ มั่นคง',
          nameEn: 'Dr. Preeyaporn Mankong',
          specTh: 'กายภาพบำบัดและจัดโครงสร้างร่างกาย',
          specEn: 'Physical Medicine & Rehabilitation',
          subTh: 'แพทย์เฉพาะทางกายภาพบำบัด',
          subEn: 'Rehabilitation Specialist',
          photo: 'assets/images/treatments/specialist-2.jpg'
        },
        {
          id: 'dr05',
          nameTh: 'นพ. วัฒนา ทรงศักดิ์',
          nameEn: 'Dr. Wattana Songsak',
          specTh: 'สุขภาพองค์รวมและการจัดการความปวด',
          specEn: 'Holistic Wellness & Pain Management',
          subTh: 'ผู้เชี่ยวชาญบำบัดความปวด',
          subEn: 'Pain Management Specialist',
          photo: 'assets/images/treatments/specialist-1.jpg'
        }
      ],
      programs: [
        {
          code: 'PRG-PK01',
          tagTh: 'BODY CONTOURING',
          tagEn: 'BODY SCULPTING',
          titleTh: 'โปรแกรมสลายไขมันด้วยความเย็น CoolSculpting Elite 4 Applicators',
          titleEn: 'CoolSculpting Elite Cryolipolysis Body Contouring',
          descTh: 'แช่แข็งสลายเซลล์ไขมันส่วนเกินบริเวณหน้าท้อง เอว ต้นขา อย่างถาวร ปลอดภัย ไม่ต้องผ่าตัด ไม่ต้องพักฟื้น',
          descEn: 'Permanent non-invasive fat freezing body contouring with DualSculpting technology.',
          price: '32,000'
        },
        {
          code: 'PRG-PK02',
          tagTh: 'MUSCLE & RECOVERY',
          tagEn: 'MUSCLE THERAPY',
          titleTh: 'โปรแกรมสร้างกล้ามเนื้อ & ลดอาการปวด EMSculpt NEO Therapy',
          titleEn: 'EMSculpt NEO Muscle Building & Core Therapy',
          descTh: 'ผสานพลังงาน HIEMST และ RF สร้างกล้ามเนื้อหน้าท้อง สะโพก พร้อมบรรเทาอาการปวดหลังและออฟฟิศซินโดรม',
          descEn: 'Simultaneous HIFEM muscle building & RF fat reduction for core strength & posture recovery.',
          price: '18,000'
        },
        {
          code: 'PRG-PK03',
          tagTh: 'HOLISTIC DETOX',
          tagEn: 'HOLISTIC WELLNESS',
          titleTh: 'โปรแกรมดีท็อกซ์ขับสารพิษ & ฟื้นฟูสมดุลตับ Liver Hydrotherapy',
          titleEn: 'Liver Detoxification & Herbal Hydro-Wellness Spa',
          descTh: 'ฟื้นฟูตับ ล้างสารพิษสะสม ปรับระบบขับถ่าย และสปาเชิงบำบัดในบรรยากาศรีสอร์ตธรรมชาติ',
          descEn: 'Deep liver detox, heavy metal elimination, and therapeutic wellness hydro-spa.',
          price: '12,500'
        }
      ],
      articles: [
        {
          tag: 'BODY CONTOURING',
          titleTh: 'CoolSculpting Elite: สลายไขมันส่วนเกินอย่างถาวรด้วยความเย็น -22°C',
          titleEn: 'CoolSculpting Elite: Permanent Non-Invasive Fat Reduction Technology',
          descTh: 'ทำความเข้าใจกระบวนการ Apoptosis ลบล้างไขมันดื้อดึงที่ไม่ยอมลงด้วยการออกกำลังกาย',
          image: 'assets/images/hero/herobg03.png',
          meta: '22 ก.ค. 2026 • อ่าน 5 นาที'
        },
        {
          tag: 'OFFICE SYNDROME',
          titleTh: 'บอกลาออฟฟิศซินโดรมและการปวดเรื้อรัง ด้วยเวชศาสตร์ฟื้นฟูและการกายภาพเชิงบำบัด',
          titleEn: 'Overcoming Chronic Pain & Office Syndrome with Rehabilitation Medicine',
          descTh: 'ปรับโครงสร้างร่างกายและแก้อาการปวดสะบัก คอ บ่า ไหล่ อย่างตรงจุดโดยแพทย์เฉพาะทาง',
          image: 'assets/images/treatments/specialist-1.jpg',
          meta: '14 ก.ค. 2026 • อ่าน 4 นาที'
        },
        {
          tag: 'GUT HEALTH',
          titleTh: 'สุขภาพลำไส้กับผิวพรรณ: ทำไมการล้างสารพิษถึงช่วยให้ผิวใสและสดชื่นจากภายใน',
          titleEn: 'Gut-Skin Axis: How Gut Microbiome & Detox Impact Radiance Skin',
          descTh: 'เชื่อมโยงระบบย่อยอาหาร ภูมิคุ้มกัน และความกระจ่างใสของผิวพรรณด้วยเวชศาสตร์เชิงหน้าที่',
          image: 'assets/images/brand/about-lounge.jpg',
          meta: '05 ก.ค. 2026 • อ่าน 5 นาที'
        }
      ],
      facilitiesTh: [
        'ศูนย์ดูแลเรือนร่างและสลายไขมันแบบรีสอร์ต Resort-Style Body Wellness Hub',
        'เครื่อง CoolSculpting Elite และ EMSculpt NEO ของแท้มาตรฐาน U.S. FDA',
        'ห้องสปาเชิงบำบัดและไฮโดรเทอราพีส่วนตัว Private Hydro-Therapy Suite',
        'พื้นที่สวนพักผ่อนสีเขียวและบ่อน้ำแร่ธรรมชาติสำหรับผู้ใช้บริการ VIP'
      ],
      facilitiesEn: [
        'Resort-Style Body Wellness & Sculpting Center',
        'Authentic CoolSculpting Elite & EMSculpt NEO technology',
        'Private Therapeutic Hydro-Therapy & Spa Suites',
        'Tranquil green garden lounge & mineral hydro-wellness pool'
      ],
      directionsTh: 'ตั้งอยู่ที่ ซอยเพชรเกษม 19 (ใกล้ MRT บางไผ่ เพียง 300 เมตร) อาคาร PHIVARA Wellness Center ชั้น 4 บรรยากาศเงียบสงบสไตล์รีสอร์ต พร้อมลานจอดรถส่วนตัวรองรับ 100 คัน',
      directionsEn: 'Located on Petchakasem Soi 19 (Only 300 meters from MRT Bang Phai Station), PHIVARA Wellness Center 4th Floor. Private resort-style parking for 100+ cars.'
    },
    pts: {
      doctors: [
        {
          id: 'dr17',
          nameTh: 'พญ. รมิดา กาญจนศิลป์',
          nameEn: 'Dr. Ramida Kanchanasilp',
          specTh: 'ศัลยกรรมปรับรูปหน้าอย่างเป็นธรรมชาติ',
          specEn: 'Natural Facial Contouring Surgery',
          subTh: 'ศัลยแพทย์ตกแต่งเฉพาะทาง',
          subEn: 'Board Certified Plastic Surgeon',
          photo: 'assets/images/treatments/expertise-plastic.jpg'
        },
        {
          id: 'dr22',
          nameTh: 'นพ. วชิรวิทย์ อินทรกุล',
          nameEn: 'Dr. Wachirawit Intharakul',
          specTh: 'โภชนาการและสุขภาพเมตาบอลิก',
          specEn: 'Nutrition & Metabolic Health',
          subTh: 'ผู้เชี่ยวชาญเวชศาสตร์ชะลอวัย',
          subEn: 'Anti-Aging Medicine Specialist',
          photo: 'assets/images/hero/herobg04.png'
        },
        {
          id: 'dr27',
          nameTh: 'พญ. ลลิตา วงศ์พิพัฒน์',
          nameEn: 'Dr. Lalita Wongpipat',
          specTh: 'ศัลยกรรมยกกระชับใบหน้า',
          specEn: 'Facelift & Rejuvenation Surgery',
          subTh: 'ศัลยแพทย์ตกแต่งใบหน้าเฉพาะทาง',
          subEn: 'Facial Plastic Surgery Specialist',
          photo: 'assets/images/treatments/expertise-plastic.jpg'
        },
        {
          id: 'dr06',
          nameTh: 'นพ. ภัทรพล เลิศวิทยา',
          nameEn: 'Dr. Pattarapon Lertwitthaya',
          specTh: 'ศัลยกรรมตกแต่งจมูกและปรับโครงหน้า',
          specEn: 'Facial Plastic & Rhinoplasty',
          subTh: 'ศัลยแพทย์ตกแต่งเฉพาะทาง',
          subEn: 'Plastic Surgery Specialist',
          photo: 'assets/images/doctors/dr01.png'
        },
        {
          id: 'dr07',
          nameTh: 'พญ. กานดา วงศ์สุวรรณ',
          nameEn: 'Dr. Kanda Wongsuwan',
          specTh: 'เวชศาสตร์ชะลอวัยและฟื้นฟูผิว',
          specEn: 'Anti-Aging & Skincare Wellness',
          subTh: 'แพทย์เฉพาะทางชะลอวัย',
          subEn: 'Anti-Aging Specialist',
          photo: 'assets/images/doctors/dr02.png'
        }
      ],
      programs: [
        {
          code: 'PRG-SR01',
          tagTh: 'EASTERN EXECUTIVE',
          tagEn: 'EXECUTIVE LONGEVITY',
          titleTh: 'โปรแกรมตรวจสุขภาพชะลอวัย Eastern Seaboard Executive Checkup',
          titleEn: 'Eastern Seaboard Executive Longevity Checkup',
          descTh: 'ตรวจคัดกรองความเสี่ยงโรคหลอดเลือด ฮอร์โมน สารต้านอนุมูลอิสระ และโลหะหนักสะสมอย่างครอบคลุม',
          descEn: 'Comprehensive executive health assessment targeting cardiovascular risk, hormones & heavy metals.',
          price: '42,000'
        },
        {
          code: 'PRG-SR02',
          tagTh: 'RESTYLANE FILLER',
          tagEn: 'FACIAL REFINEMENT',
          titleTh: 'โปรแกรมปรับโครงหน้า & เติมผิวนุ่มฟู Restylane Skinbooster & Volyme',
          titleEn: 'Restylane Facial Contouring & Skinbooster Rejuvenation',
          descTh: 'ฉีดฟิลเลอร์ปรับรูปหน้าให้มีมิติ พร้อมเติมความชุ่มชื้นให้ผิวฉ่ำวาวอิ่มน้ำด้วยเทคโนโลยี NASHA & OBT',
          descEn: 'NASHA & OBT technology dermal filler injection for structural facial definition & hydration.',
          price: '28,000'
        },
        {
          code: 'PRG-SR03',
          tagTh: 'AFTER-SUN CARE',
          tagEn: 'SKIN RECOVERY',
          titleTh: 'โปรแกรมฟื้นฟูผิวเสียแดดทะเล Coastal Sun-Damage Recovery',
          titleEn: 'Coastal Sun-Damage Repair & Radiance Infusion',
          descTh: 'ปลอบประโลมผิวที่ถูกทำร้ายจากแสงแดด ลดการอักเสบ และเติมวิตามินเข้มข้นให้ผิวกระจ่างใสสุขภาพดี',
          descEn: 'Soothe UV-damaged skin, eliminate sun spots, and infuse skin-repairing antioxidants.',
          price: '16,000'
        }
      ],
      articles: [
        {
          tag: 'FACELIFT SURGERY',
          titleTh: 'เทคนิคศัลยกรรมดึงหน้ายกกระชับ Deep Plane Facelift อ่อนเยาว์ลง 10-15 ปี',
          titleEn: 'Deep Plane Facelift Surgery: Natural Rejuvenation That Lasts Decades',
          descTh: 'ไขข้อขัดแย้งระหว่างการฉีดไหมกับการศัลยกรรมดึงชั้น SMAS ลึกเพื่อผลลัพธ์ที่เป็นธรรมชาติที่สุด',
          image: 'assets/images/treatments/expertise-plastic.jpg',
          meta: '25 ก.ค. 2026 • อ่าน 6 นาที'
        },
        {
          tag: 'SUN PROTECTION',
          titleTh: 'การดูแลผิวพรรณสำหรับผู้พำนักริมทะเล: สู้ UV และมลภาวะอย่างไรไม่ให้ผิวแก่ก่อนวัย',
          titleEn: 'Coastal Skincare Protocol: Protecting Against UV Rays & Marine Pollution',
          descTh: 'คำแนะนำจากแพทย์ผิวหนังเฉพาะทางในการเลือกครีมกันแดดและสารต้านอนุมูลอิสระ',
          image: 'assets/images/hero/herobg04.png',
          meta: '17 ก.ค. 2026 • อ่าน 4 นาที'
        },
        {
          tag: 'EXPAT WELLNESS',
          titleTh: 'บริการ VIP Concierge และการดูแลสุขภาพสำหรับชาวต่างชาติบนพื้นที่ EEC',
          titleEn: 'International Patient Care & VIP Concierge Services in Eastern Seaboard',
          descTh: 'ยกระดับบริการทางการแพทย์มาตรฐานสากล พร้อมทีมงานสื่อสารได้ 5 ภาษาดูแลแบบ 1 ต่อ 1',
          image: 'assets/images/brand/about-lounge.jpg',
          meta: '09 ก.ค. 2026 • อ่าน 5 นาที'
        }
      ],
      facilitiesTh: [
        'ศูนย์การแพทย์และความงามฝั่งตะวันออก Eastern Seaboard Medical Center Suite',
        'ห้องผ่าตัดมาตรฐานโรงพยาบาลพร้อมวิสัญญีแพทย์ประจำ',
        'บริการผู้ป่วยต่างชาติ International Patient VIP Lounge & Multilingual Staff',
        'วิวทะเลพาโนรามาและบริการ VIP Limousine Transfer จากสนามบินสุวรรณภูมิ/อู่ตะเภา'
      ],
      facilitiesEn: [
        'Eastern Seaboard Premier Medical & Longevity Center Suite',
        'Hospital-grade operating suites with dedicated anesthesiologists',
        'International Patient VIP Lounge with 5-language multilingual team',
        'Panoramic ocean view lounge & VIP Limousine Transfer from BKK/UTP Airports'
      ],
      directionsTh: 'ตั้งอยู่ริมถนนสุขุมวิท ใจกลางเมืองศรีราชา (ใกล้โรบินสัน ศรีราชา และโรงพยาบาลสมิติเวช ศรีราชา) ชั้น 7 อาคาร PHIVARA Medical Center พร้อมบริการลานจอดรถ VIP',
      directionsEn: 'Located on Sukhumvit Road, Central Si Racha (Near Robinson Si Racha & Samitivej Hospital), 7th Floor PHIVARA Medical Center. VIP parking facilities.'
    }
  };

  function currentLanguage() {
    return document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'th';
  }

  function text(key) {
    return branch[`${key}${currentLanguage() === 'en' ? 'En' : 'Th'}`];
  }

  function render() {
    const isEn = currentLanguage() === 'en';
    const branchName = isEn ? branch.nameEn : branch.nameTh;
    const fullName = `PHIVARA ${branchName}`;
    const numStr = String(branchIndex + 1).padStart(2, '0');
    const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.addressTh)}`;
    const image = document.getElementById('branchDetailImage');
    const extra = branchDataMap[branchId] || branchDataMap.pt2;

    document.title = `${fullName} | PHIVARA`;

    // 1. Header & Hero Card
    if (document.getElementById('branchHeroKicker')) document.getElementById('branchHeroKicker').textContent = `PHIVARA LOCATION ${numStr}`;
    if (document.getElementById('branchHeroTitle')) document.getElementById('branchHeroTitle').textContent = isEn ? `PHIVARA ${branchName} Center` : `PHIVARA สาขา${branchName}`;
    if (document.getElementById('branchDetailCrumb')) document.getElementById('branchDetailCrumb').textContent = fullName;
    if (document.getElementById('branchDetailKicker')) document.getElementById('branchDetailKicker').textContent = `PHIVARA LOCATION ${numStr}`;
    if (document.getElementById('branchDetailTitle')) document.getElementById('branchDetailTitle').textContent = fullName;
    if (document.getElementById('branchDetailService')) document.getElementById('branchDetailService').textContent = text('title');
    if (document.getElementById('branchDetailDescription')) document.getElementById('branchDetailDescription').textContent = text('description');
    if (document.getElementById('branchDetailAddress')) document.getElementById('branchDetailAddress').textContent = text('address');
    if (document.getElementById('branchDetailHours')) document.getElementById('branchDetailHours').textContent = text('hours');
    if (document.getElementById('branchDetailPhone')) document.getElementById('branchDetailPhone').textContent = branch.phone;
    if (document.getElementById('branchDetailLine')) document.getElementById('branchDetailLine').textContent = branch.line;
    if (document.getElementById('branchDetailNumber')) document.getElementById('branchDetailNumber').textContent = `LOCATION ${numStr}`;
    if (document.getElementById('branchDetailMap')) document.getElementById('branchDetailMap').href = mapHref;
    if (document.getElementById('branchDetailBook')) document.getElementById('branchDetailBook').dataset.branch = branch.formValue;
    
    if (image) {
      image.src = branch.image;
      image.alt = isEn ? fullName : `PHIVARA สาขา${branchName}`;
    }

    // 2. Render Doctors Section (1 Highlighted Lead Doctor + Remaining Doctor Cards)
    const doctorsContainer = document.getElementById('branchDoctorsGrid');
    if (doctorsContainer) {
      const leadDoctor = extra.doctors[0];
      const otherDoctors = extra.doctors.slice(1);

      let featuredHtml = '';
      if (leadDoctor) {
        featuredHtml = `
          <div class="branch-doctor-featured" style="background-image: url('${leadDoctor.photo}');">
            <div class="branch-doctor-featured__body">
              <div class="branch-doctor-featured__header">
                <h3 class="branch-doctor-featured__name">${isEn ? leadDoctor.nameEn : leadDoctor.nameTh}</h3>
                <div class="branch-doctor-featured__title-badge">
                  ${isEn ? (leadDoctor.specEn || 'Medical Director, Anti-Aging & Regenerative Medicine Center') : (leadDoctor.specTh || 'แพทย์ผู้อำนวยการศูนย์เวชศาสตร์ชะลอวัย โรงพยาบาลพญาไท 2')}
                </div>
              </div>

              <div class="branch-doctor-featured__quote">
                <span class="quote-mark">“</span>
                <p>${isEn ? 'Dedicated to sustainable quality of life through evidence-based anti-aging and personalized preventive healthcare.' : 'มุ่งมั่นยกระดับคุณภาพชีวิตอย่างยั่งยืน ด้วยศาสตร์แห่งการแพทย์ชะลอวัยและการดูแลสุขภาพเชิงป้องกัน'}</p>
              </div>

              <div class="branch-doctor-featured__specs-card">
                <div class="spec-row">
                  <div class="spec-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div class="spec-info">
                    <span class="spec-badge">${isEn ? 'Expertise' : 'ความชำนาญ'}</span>
                    <span class="spec-value">${isEn ? 'Dermatology' : 'ตจวิทยา'}</span>
                  </div>
                </div>
                <div class="spec-row">
                  <div class="spec-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div class="spec-info">
                    <span class="spec-badge">${isEn ? 'Specialty' : 'ความชำนาญพิเศษเฉพาะทาง'}</span>
                    <span class="spec-value">${isEn ? 'Dermatology' : 'ตจวิทยา'}</span>
                  </div>
                </div>
              </div>

              <div class="branch-doctor-featured__highlights">
                <div class="branch-doctor-featured__highlight-item">
                  <span class="branch-doctor-featured__highlight-item-icon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  <span>${isEn ? 'Comprehensive Bio-Age & Health Profiling' : 'ประเมินสุขภาพเชิงลึก & ฟื้นฟูสมดุล'}</span>
                </div>
                <div class="branch-doctor-featured__highlight-item">
                  <span class="branch-doctor-featured__highlight-item-icon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  <span>${isEn ? 'Personalized Longevity & Wellness Strategy' : 'วางแผนดูแลสุขภาพเฉพาะบุคคล'}</span>
                </div>
                <div class="branch-doctor-featured__highlight-item">
                  <span class="branch-doctor-featured__highlight-item-icon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  <span>${isEn ? 'Integrative Longevity & Lifestyle Medicine' : 'บูรณาการเวชศาสตร์ชะลอวัย & โภชนาการ'}</span>
                </div>
                <div class="branch-doctor-featured__highlight-item">
                  <span class="branch-doctor-featured__highlight-item-icon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  <span>${isEn ? 'International Speaker in Healthy Aging' : 'วิทยากรนวัตกรรมชะลอวัยระดับสากล'}</span>
                </div>
              </div>

              <div class="branch-doctor-featured__actions">
                <a href="doctor_detail.html?id=${leadDoctor.id}" class="branch-doctor-featured__btn-profile">
                  <span>${isEn ? 'View Profile' : 'ดูประวัติแพทย์อย่างละเอียด'}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="#vipModalOverlay" class="branch-doctor-featured__btn-book vip-trigger" data-doc-name="${leadDoctor.nameTh}">
                  <span>${isEn ? 'Book Consultation' : 'จองปรึกษาแพทย์ผู้อำนวยการ'}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        `;
      }

      const isSanampao = branch.id === 'pt2';
      const initialPageSize = isSanampao ? 4 : otherDoctors.length;
      const visibleDoctors = otherDoctors.slice(0, initialPageSize);

      const renderDocCard = (doc) => `
        <div class="spec-card s-item">
          <div class="photo-wrap">
            <a href="doctor_detail.html?id=${doc.id}" aria-label="${isEn ? doc.nameEn : doc.nameTh}">
              <img class="ph-photo" src="${doc.photo}" alt="${doc.nameTh}" loading="lazy">
            </a>
          </div>
          <span class="program-branch">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <span class="program-branch__text">
              <span class="program-branch__brand">PHIVARA</span>
              <span class="program-branch__name">${branchName}</span>
            </span>
          </span>
          <h3><a href="doctor_detail.html?id=${doc.id}">${isEn ? doc.nameEn : doc.nameTh}</a></h3>
          <p class="note">${isEn ? doc.specEn : doc.specTh}</p>
          <div class="spec-subnote">${isEn ? doc.subEn : doc.subTh}</div>
          <div class="card-actions">
            <a href="doctor_detail.html?id=${doc.id}" class="btn-doc-detail">${isEn ? 'View Profile' : 'ดูประวัติแพทย์'}</a>
            <a href="#vipModalOverlay" class="go vip-trigger" data-doc-name="${doc.nameTh}">${isEn ? 'Book →' : 'จองปรึกษา →'}</a>
          </div>
        </div>
      `;

      let gridCardsHtml = visibleDoctors.map(renderDocCard).join('');

      let featuredContainer = document.getElementById('branchDoctorFeatured');
      if (featuredContainer) {
        featuredContainer.innerHTML = featuredHtml;
        doctorsContainer.innerHTML = gridCardsHtml;
      } else {
        // If single container, render featuredHtml followed by doctor grid
        doctorsContainer.outerHTML = `${featuredHtml}<div class="branch-doctor-grid" id="branchDoctorsGrid">${gridCardsHtml}</div>`;
      }

      let doctorFooter = document.getElementById('branchDoctorFooter');
      if (doctorFooter) {
        if (isSanampao && otherDoctors.length > initialPageSize) {
          doctorFooter.innerHTML = `
            <button type="button" id="btnLoadMoreSanampao" class="branch-view-all-btn" style="cursor:pointer; text-transform:none;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
              <span>${isEn ? 'Load More Doctors' : 'โหลดแพทย์เพิ่มเติม'}</span>
            </button>
          `;

          const btnLoadMore = document.getElementById('btnLoadMoreSanampao');
          if (btnLoadMore) {
            btnLoadMore.addEventListener('click', () => {
              btnLoadMore.disabled = true;
              btnLoadMore.style.opacity = '0.75';
              btnLoadMore.innerHTML = `
                <svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <span>${isEn ? 'Loading Specialists...' : 'กำลังโหลดข้อมูลทีมแพทย์...'}</span>
              `;

              setTimeout(() => {
                const remainingDocs = otherDoctors.slice(initialPageSize);
                const grid = document.getElementById('branchDoctorsGrid');
                if (grid && remainingDocs.length > 0) {
                  const newCardsHtml = remainingDocs.map((doc, idx) => `
                    <article class="spec-card s-item doc-card-fade-in" style="animation-delay: ${idx * 0.08}s;">
                      <div class="photo-wrap">
                        <img class="ph-photo" src="${doc.photo}" alt="${doc.nameTh}" loading="lazy">
                      </div>
                      <span class="program-branch">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
                        <span class="program-branch__text">
                          <span class="program-branch__brand">PHIVARA</span>
                          <span class="program-branch__name">${branchName}</span>
                        </span>
                      </span>
                      <h3>${isEn ? doc.nameEn : doc.nameTh}</h3>
                      <p class="note">${isEn ? doc.specEn : doc.specTh}</p>
                      <div class="spec-subnote">${isEn ? doc.subEn : doc.subTh}</div>
                      <div class="card-actions">
                        <a href="doctor_detail.html?id=${doc.id}" class="btn-doc-detail">${isEn ? 'View Profile' : 'ดูประวัติแพทย์'}</a>
                        <a href="#vipModalOverlay" class="go vip-trigger" data-doc-name="${doc.nameTh}">${isEn ? 'Book →' : 'จองปรึกษา →'}</a>
                      </div>
                    </article>
                  `).join('');

                  grid.insertAdjacentHTML('beforeend', newCardsHtml);

                  doctorFooter.innerHTML = `
                    <p class="doc-card-fade-in" style="color:var(--gold); font-size:13.5px; font-weight:500; margin:0; display:inline-flex; align-items:center; gap:8px; padding:10px 22px; background:rgba(255,255,255,.7); border:1px solid var(--gold-line); border-radius:30px; box-shadow:0 4px 14px rgba(50,42,24,.05);">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>${isEn ? 'Showing all specialists at Sanampao Branch' : 'แสดงทีมแพทย์ประจำสาขาสนามเป้าครบถ้วนแล้ว'}</span>
                    </p>
                  `;
                }
              }, 400);
            });
          }
        } else {
          doctorFooter.innerHTML = `
            <a href="doctor.html" class="branch-view-all-btn">
              <span>${isEn ? 'View All 30 PHIVARA Medical Specialists →' : 'ดูทีมแพทย์ PHIVARA ทั้งหมด 30 ท่าน →'}</span>
            </a>
          `;
        }
      }
    }

    // 3. Render Programs Section (Matching index.html program card format)
    const programsGrid = document.getElementById('branchProgramsGrid');
    if (programsGrid) {
      const programPageSize = 4;
      let visibleProgramCount = Math.min(programPageSize, extra.programs.length);
      const renderProgramCard = (prg, animate = false) => `
        <article class="program-card${animate ? ' doc-card-fade-in' : ''}">
          <div class="card-visual">
            <a href="program_detail.html">
              <img src="${prg.image || branch.image}" alt="${prg.titleTh}" loading="lazy">
            </a>
            <span class="card-tag">${isEn ? prg.tagEn : prg.tagTh}</span>
          </div>
          <div class="card-body">
            <div class="program-branch">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
              <span class="program-branch__text">
                <span class="program-branch__brand">PHIVARA</span>
                <span class="program-branch__name">${branchName}</span>
              </span>
            </div>
            <h3><a class="card-title-link" href="program_detail.html">${isEn ? prg.titleEn : prg.titleTh}</a></h3>
            <p>${isEn ? prg.descEn : prg.descTh}</p>
            <div class="card-foot">
              <span>${prg.price}</span>
              <a href="#vipModalOverlay" class="card-link vip-trigger">${isEn ? 'Book Program →' : 'จองโปรแกรม →'}</a>
            </div>
          </div>
        </article>
      `;

      programsGrid.innerHTML = extra.programs
        .slice(0, visibleProgramCount)
        .map((prg) => renderProgramCard(prg))
        .join('');

      const programFooter = document.getElementById('branchProgramFooter');
      if (programFooter && extra.programs.length > visibleProgramCount) {
        programFooter.innerHTML = `
          <button type="button" id="btnLoadMorePrograms" class="branch-view-all-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
            <span>${isEn ? 'Load More Programs' : 'โหลดโปรแกรมเพิ่มเติม'}</span>
          </button>
        `;

        const btnLoadMorePrograms = document.getElementById('btnLoadMorePrograms');
        btnLoadMorePrograms.addEventListener('click', () => {
          btnLoadMorePrograms.disabled = true;
          btnLoadMorePrograms.style.opacity = '0.75';
          btnLoadMorePrograms.innerHTML = `
            <svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <span>${isEn ? 'Loading Programs...' : 'กำลังโหลดโปรแกรม...'}</span>
          `;

          window.setTimeout(() => {
            const nextPrograms = extra.programs.slice(visibleProgramCount, visibleProgramCount + programPageSize);
            programsGrid.insertAdjacentHTML('beforeend', nextPrograms.map((prg) => renderProgramCard(prg, true)).join(''));
            visibleProgramCount += nextPrograms.length;

            if (visibleProgramCount >= extra.programs.length) {
              programFooter.innerHTML = `
                <p class="doc-card-fade-in branch-program-complete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${isEn ? 'Showing all programs at Sanampao Branch' : 'แสดงโปรแกรมประจำสาขาสนามเป้าครบถ้วนแล้ว'}</span>
                </p>
              `;
            } else {
              btnLoadMorePrograms.disabled = false;
              btnLoadMorePrograms.style.opacity = '1';
              btnLoadMorePrograms.innerHTML = `
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                <span>${isEn ? 'Load More Programs' : 'โหลดโปรแกรมเพิ่มเติม'}</span>
              `;
            }
          }, 400);
        });
      } else if (programFooter) {
        programFooter.innerHTML = '';
      }
    }

    // 4. Render Articles / Innovations Section (Matching index.html journal card format)
    const articlesGrid = document.getElementById('branchArticlesGrid');
    if (articlesGrid) {
      articlesGrid.innerHTML = extra.articles.map((art) => `
        <article class="journal-card">
          <a href="article_detail.html" class="journal-card__media">
            <img src="${art.image}" alt="${art.titleTh}" class="journal-card__image" loading="lazy">
          </a>
          <div class="journal-card__body">
            <span class="journal-card__tag">${art.tag}</span>
            <h3><a href="article_detail.html">${isEn ? art.titleEn : art.titleTh}</a></h3>
            <p>${isEn ? art.descEn : art.descTh}</p>
            <div class="journal-card__footer">
              <div class="journal-card__meta">
                <span>${art.meta}</span>
              </div>
              <a href="article_detail.html" class="journal-card__link">${isEn ? 'Read Article →' : 'อ่านบทความ →'}</a>
            </div>
          </div>
        </article>
      `).join('');
    }

    // 5. Render Facilities Checklist
    const facilitiesGrid = document.getElementById('branchFacilitiesGrid');
    if (facilitiesGrid) {
      const facilityItems = isEn ? extra.facilitiesEn : extra.facilitiesTh;
      facilitiesGrid.innerHTML = facilityItems.map((item) => `
        <div class="facility-card">
          <div class="facility-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="facility-text">${item}</div>
        </div>
      `).join('');
    }

    // 6. Directions & Parking text
    if (document.getElementById('branchDirectionsText')) {
      document.getElementById('branchDirectionsText').textContent = isEn ? extra.directionsEn : extra.directionsTh;
    }
    if (document.getElementById('branchDirectionsMapBtn')) {
      document.getElementById('branchDirectionsMapBtn').href = mapHref;
    }
  }

  document.addEventListener('phivara:languagechange', render);
  render();

  function initFacilityGallery() {
    const lightbox = document.getElementById('branchGalleryLightbox');
    if (!lightbox) return;

    const triggers = Array.from(document.querySelectorAll('.branch-gallery-open'));
    const image = document.getElementById('branchGalleryLightboxImage');
    const caption = document.getElementById('branchGalleryLightboxCaption');
    const closeButton = lightbox.querySelector('.branch-gallery-lightbox__close');
    const previousButton = lightbox.querySelector('.branch-gallery-lightbox__nav--prev');
    const nextButton = lightbox.querySelector('.branch-gallery-lightbox__nav--next');

    if (!triggers.length || !image || !caption || !closeButton || !previousButton || !nextButton) return;

    let activeIndex = 0;
    let lastFocusedElement = null;
    let closeTimer = null;

    const showImage = (index) => {
      activeIndex = (index + triggers.length) % triggers.length;
      const trigger = triggers[activeIndex];
      const thumbnail = trigger.querySelector('img');
      const itemCaption = trigger.closest('.branch-gallery-item')?.querySelector('figcaption');

      image.src = thumbnail.currentSrc || thumbnail.src;
      image.alt = thumbnail.alt;
      caption.textContent = itemCaption?.textContent.trim() || thumbnail.alt;
    };

    const openLightbox = (index) => {
      window.clearTimeout(closeTimer);
      lastFocusedElement = document.activeElement;
      showImage(index);
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('branch-gallery-lightbox-open');
      window.requestAnimationFrame(() => lightbox.classList.add('is-open'));
      closeButton.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('branch-gallery-lightbox-open');
      closeTimer = window.setTimeout(() => {
        lightbox.hidden = true;
        image.src = '';
      }, 280);
      lastFocusedElement?.focus();
    };

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => openLightbox(index));
    });

    closeButton.addEventListener('click', closeLightbox);
    previousButton.addEventListener('click', () => showImage(activeIndex - 1));
    nextButton.addEventListener('click', () => showImage(activeIndex + 1));

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
      if (lightbox.hidden) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
      if (event.key === 'ArrowRight') showImage(activeIndex + 1);
    });
  }

  initFacilityGallery();
})();
