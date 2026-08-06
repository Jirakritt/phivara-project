// Source: phivara-design-html/ecosystem.html (The PHIVARA Ecosystem page).
export const ecosystemData = {
  hero: {
    eyebrow: { th: 'THE PHIVARA ECOSYSTEM', en: 'THE PHIVARA ECOSYSTEM' },
    headlineLine1: { th: 'หนึ่งระบบนิเวศ', en: 'One Ecosystem' },
    headlineLine2: {
      th: 'สี่ศาสตร์แห่งความงามและอายุยืนยาว',
      en: 'Four Disciplines of Beauty & Longevity',
    },
    lead: {
      th: 'PHIVARA หลอมรวมสี่ศาสตร์ — เวชศาสตร์อายุยืนยาว ผิวหนัง สุขภาวะเชิงความงาม และศัลยกรรมตกแต่ง — ไว้ภายใต้ทีมแพทย์เฉพาะทางเดียวกัน ทุกการดูแลเริ่มต้นจากการตรวจประเมินสุขภาพอย่างละเอียด ก่อนออกแบบแผนเฉพาะบุคคลที่เชื่อมโยงทั้งสี่หมวดเข้าด้วยกันอย่างไร้รอยต่อ เพื่อผลลัพธ์ที่ปลอดภัย เป็นธรรมชาติ และยั่งยืน เลือกหมวดที่สนใจด้านล่างเพื่อสำรวจแพทย์ผู้เชี่ยวชาญ โปรแกรมการรักษา และบทความความรู้ที่เกี่ยวข้องทั้งหมดในที่เดียว',
      en: 'PHIVARA brings four disciplines — Longevity Medicine, Dermatology, Aesthetic Wellness, and Plastic Surgery — together under one specialist medical team. Every journey begins with a thorough health assessment before a personalized plan seamlessly connects all four for results that are safe, natural, and built to last. Choose a category below to explore its specialists, treatment programs, and related articles in one place.',
    },
  },
  // Order matters — must stay Longevity, Dermatology, Wellness, Plastic
  // Surgery to match the fixed structural constants (anchor id, filter
  // slug, tone class) zipped in by src/lib/ecosystemData.ts.
  disciplines: [
    {
      eyebrow: { th: '01 — ANTI-AGING & LONGEVITY', en: '01 — ANTI-AGING & LONGEVITY' },
      title: { th: 'เวชศาสตร์อายุยืนยาว', en: 'Longevity Medicine' },
      subtitle: { th: 'ชะลอวัยจากภายในระดับเซลล์', en: 'Aging Slower, From the Cell Up' },
      description: {
        th: 'เวชศาสตร์อายุยืนยาวที่ PHIVARA มุ่งชะลอความเสื่อมของร่างกายตั้งแต่ระดับเซลล์ด้วยหลักฐานทางการแพทย์ ทุกแผนเริ่มจากการตรวจค่าชีวภาพ (biomarker) และประเมินอายุทางชีวภาพเทียบกับอายุจริง ก่อนออกแบบโปรแกรมเฉพาะบุคคลที่ครอบคลุมฮอร์โมน พันธุกรรม และเมตาบอลิซึม ผสานการบำบัดด้วย NAD+ เปปไทด์ และฮอร์โมนทดแทนภายใต้การดูแลของแพทย์ พร้อมติดตามผลอย่างต่อเนื่องเพื่อคุณภาพชีวิตที่ดีในทุกปีที่เพิ่มขึ้น',
        en: "PHIVARA's longevity medicine slows cellular decline through evidence-based protocols. Every plan starts with biomarker testing and biological-age assessment against chronological age, before specialists design a personalized program spanning hormones, genetics, and metabolic health — combining NAD+ therapy, peptides, and hormone replacement under medical supervision, with continuous follow-up for a better quality of life each year.",
      },
      chips: [
        { th: 'NAD+ Therapy', en: 'NAD+ Therapy' },
        { th: 'Peptide Therapy', en: 'Peptide Therapy' },
        { th: 'ฮอร์โมนบำบัด (HRT)', en: 'Hormone Replacement (HRT)' },
        { th: 'ตรวจอายุชีวภาพ', en: 'Biological Age Testing' },
        { th: 'IV Vitamin Drip', en: 'IV Vitamin Drip' },
        { th: 'ตรวจพันธุกรรม', en: 'Genomic Screening' },
      ],
      doctorLinkLabel: { th: 'แพทย์เฉพาะทางเวชศาสตร์ชะลอวัย', en: 'Longevity Specialists' },
      programLinkLabel: { th: 'โปรแกรมตรวจและทรีทเมนต์', en: 'Longevity Programs' },
      articleLinkLabel: { th: 'บทความน่ารู้เรื่องอายุยืนยาว', en: 'Longevity Articles' },
      image: 'assets/images/treatments/expertise-longevity.jpg',
    },
    {
      eyebrow: { th: '02 — DERMATOLOGY', en: '02 — DERMATOLOGY' },
      title: { th: 'ผิวหนัง', en: 'Dermatology' },
      subtitle: { th: 'วิทยาศาสตร์แห่งผิวสุขภาพดี', en: 'The Science of Healthy Skin' },
      description: {
        th: 'ศาสตร์ผิวหนังที่ PHIVARA ดำเนินการโดยแพทย์ผิวหนังเฉพาะทางที่ผ่านการรับรองวุฒิบัตร ครอบคลุมตั้งแต่การวินิจฉัยโรคผิวหนังไปจนถึงหัตถการเสริมความงามที่อิงหลักฐานทางวิทยาศาสตร์ ทุกเคสเริ่มจากการตรวจวิเคราะห์สภาพผิวอย่างละเอียดเพื่อหาสาเหตุที่แท้จริง ไม่ว่าจะเป็นสิว ฝ้า กระ หรือผิวแพ้ง่าย ก่อนออกแบบแผนที่ผสานสกินแคร์ตามใบสั่งแพทย์ เลเซอร์ เคมีพีล และดูแลเส้นผม โดยยึดความปลอดภัยและผลลัพธ์ที่ยั่งยืนเป็นสำคัญ',
        en: "PHIVARA's dermatology is led by board-certified specialists, from diagnosing skin conditions to evidence-based aesthetic procedures. Every case starts with a thorough skin analysis to find the true cause — acne, melasma, pigmentation, or sensitivity — before building a plan around prescription skincare, lasers, peels, and hair care, prioritizing safety and lasting results.",
      },
      chips: [
        { th: 'สกินแคร์ตามใบสั่งแพทย์', en: 'Prescription Skincare' },
        { th: 'เลเซอร์ & IPL', en: 'Laser & IPL Treatments' },
        { th: 'เคมีพีล', en: 'Chemical Peels' },
        { th: 'รักษาสิว-ฝ้า-กระ', en: 'Acne & Melasma Therapy' },
        { th: 'เส้นผมและหนังศีรษะ', en: 'Hair & Scalp Dermatology' },
      ],
      doctorLinkLabel: { th: 'แพทย์ผิวหนังเฉพาะทาง', en: 'Dermatology Specialists' },
      programLinkLabel: { th: 'โปรแกรมและทรีทเมนต์ผิว', en: 'Dermatology Programs' },
      articleLinkLabel: { th: 'บทความน่ารู้เรื่องผิวหนัง', en: 'Dermatology Articles' },
      image: 'assets/images/treatments/expertise-skin.jpg',
    },
    {
      eyebrow: { th: '03 — AESTHETIC WELLNESS', en: '03 — AESTHETIC WELLNESS' },
      title: { th: 'สุขภาวะเชิงความงาม', en: 'Aesthetic Wellness' },
      subtitle: { th: 'ดูดีและรู้สึกดีในทุกวัน', en: 'Looking & Feeling Good, Every Day' },
      description: {
        th: 'สุขภาวะเชิงความงามที่ PHIVARA เน้นคุณภาพชีวิตและความรู้สึกดีที่สัมผัสได้จริงในระยะสั้นถึงกลาง ครอบคลุมหัตถการไม่ผ่าตัด เช่น โบท็อกซ์ ฟิลเลอร์ และเทคโนโลยีกระชับผิว HIFU และ RF ควบคู่กับการดูแลรูปร่างและการผ่อนคลายทั้งกายและใจผ่านการนวดบำบัด สปา และโปรแกรมจัดการการนอนหลับและความเครียด เพื่อสร้างความมั่นใจที่รู้สึกได้ในทุกวัน ไม่ใช่แค่วันพิเศษ',
        en: "PHIVARA's aesthetic wellness focuses on quality of life and results you can feel now. It spans non-surgical procedures like Botox, fillers, and HIFU or RF skin-tightening, alongside body contouring and relaxation through massage, spa care, and sleep and stress programs — building confidence that's felt every day, not just on special occasions.",
      },
      chips: [
        { th: 'โบท็อกซ์ & ฟิลเลอร์', en: 'Botox & Dermal Fillers' },
        { th: 'HIFU / RF กระชับผิว', en: 'HIFU / RF Skin Tightening' },
        { th: 'นวด & สปาเพื่อสุขภาพ', en: 'Therapeutic Massage & Spa' },
        { th: 'กระชับสัดส่วน', en: 'Body Contouring' },
        { th: 'โปรแกรมนอนหลับ-ลดเครียด', en: 'Sleep & Stress Programs' },
      ],
      doctorLinkLabel: { th: 'แพทย์ด้านสุขภาวะความงาม', en: 'Wellness Specialists' },
      programLinkLabel: { th: 'โปรแกรมสุขภาวะความงาม', en: 'Wellness Programs' },
      articleLinkLabel: { th: 'บทความน่ารู้เรื่องสุขภาวะ', en: 'Wellness Articles' },
      image: 'assets/images/brand/about-lounge.jpg',
    },
    {
      eyebrow: { th: '04 — PLASTIC SURGERY', en: '04 — PLASTIC SURGERY' },
      title: { th: 'ศัลยกรรมตกแต่ง', en: 'Plastic Surgery' },
      subtitle: {
        th: 'ปรับรูปลักษณ์อย่างเป็นธรรมชาติและปลอดภัย',
        en: 'Natural, Safe, Precision Reshaping',
      },
      description: {
        th: 'ศัลยกรรมตกแต่งที่ PHIVARA ดำเนินการโดยศัลยแพทย์เฉพาะทางที่ผ่านการรับรองวุฒิบัตร ภายใต้มาตรฐานความปลอดภัยระดับโรงพยาบาลตั้งแต่การปรึกษาไปจนถึงการดูแลหลังผ่าตัด 24 ชั่วโมง ครอบคลุมศัลยกรรมปรับรูปหน้า หน้าอกและทรวดทรง ดูดไขมัน และศัลยกรรมฟื้นฟู โดยออกแบบผลลัพธ์เฉพาะบุคคลที่กลมกลืนกับโครงสร้างธรรมชาติ พร้อมทีมสหสาขาวิชาชีพติดตามการฟื้นตัวอย่างใกล้ชิดเพื่อความปลอดภัยสูงสุด',
        en: "PHIVARA's plastic surgery is performed by board-certified surgeons under hospital-grade safety standards, from consultation through 24-hour post-op care. It covers facial contouring, breast and body surgery, liposuction, and reconstructive procedures, designing personalized outcomes that respect natural structure, with a multidisciplinary team monitoring recovery closely for maximum safety.",
      },
      chips: [
        { th: 'ศัลยกรรมปรับรูปหน้า', en: 'Facial Contouring' },
        { th: 'ศัลยกรรมหน้าอกและทรวดทรง', en: 'Breast & Body Surgery' },
        { th: 'ดูดไขมัน', en: 'Liposuction' },
        { th: 'ศัลยกรรมฟื้นฟู', en: 'Reconstructive Surgery' },
        { th: 'ดูแลหลังผ่าตัด 24 ชม.', en: '24-Hr Post-Op Care' },
      ],
      doctorLinkLabel: { th: 'ศัลยแพทย์ตกแต่งเฉพาะทาง', en: 'Plastic Surgery Specialists' },
      programLinkLabel: { th: 'โปรแกรมและแพ็กเกจศัลยกรรม', en: 'Surgery Programs' },
      articleLinkLabel: { th: 'บทความน่ารู้เรื่องศัลยกรรม', en: 'Plastic Surgery Articles' },
      image: 'assets/images/treatments/expertise-plastic.jpg',
    },
  ],
  closingCta: {
    eyebrow: { th: 'BEGIN YOUR JOURNEY', en: 'BEGIN YOUR JOURNEY' },
    heading: { th: 'ไม่แน่ใจว่าควรเริ่มจากหมวดไหน?', en: 'Not Sure Where to Start?' },
    body: {
      th: 'ปรึกษาทีมแพทย์ PHIVARA เพื่อประเมินและออกแบบเส้นทางการดูแลที่ผสานทั้ง 4 ศาสตร์ให้เหมาะกับคุณโดยเฉพาะ',
      en: 'Consult the PHIVARA medical team for a personalized care plan that blends all four disciplines around you.',
    },
    buttonLabel: { th: 'จองปรึกษาส่วนตัว', en: 'Book a Private Consultation' },
  },
}
