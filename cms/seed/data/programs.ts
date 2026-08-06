// Source: phivara-design-html/program_detail.html `programs` object (pv01–pv24,
// canonical title/description/image per detail page) + categoryByProgram
// (category) + phivara-design-html/program.html catalog cards & `extraPrograms`
// (tag/highlights/cardNote/searchKeywords/branch, only available for a subset)
// + phivara-design-html/js/main.js `homepagePrograms` (price + branch, pv01/pv03–pv16).
//
// KNOWN SOURCE CONFLICT — pv02: program.html's catalog card calls this
// "โปรแกรมตรวจสมดุลฮอร์โมนเชิงลึก / Advanced Hormone Balance" (price
// 20,000), but program_detail.html's own data object defines pv02 as a
// completely different program — "โปรแกรมตรวจวัดระดับฮอร์โมนเพศ / Sex
// Hormone Checkup" — with its own male/female test lists. That's what
// actually renders when a visitor opens the detail page, so it's used
// below as the canonical pv02. Flag this for the clinic to resolve before
// launch; the catalog card price/branch for the OTHER "hormone balance"
// program was dropped rather than guessed.
//
// Programs pv17–pv24 have no price anywhere in the source — marked
// PRICE_TODO below; confirm real pricing with the clinic before publishing.
export const PRICE_TODO = 9999

// pv25–pv32 are NOT from the original site — program.html/program_detail.html
// never listed a "Plastic Surgery" or "Aesthetic Wellness" category program,
// which left those two homepage tabs empty. Added at the client's request as
// placeholder samples (4 per category, reusing genericProgramCopy like the
// rest) so every tab shows something. Titles/prices are illustrative only —
// the clinic should review and replace via /admin before launch.

export const genericProgramCopy = {
  // No English version of this generic paragraph exists in the source —
  // program_detail.html's dynamic "about" text is Thai-only for every
  // program except pv02. Confirm/write an EN equivalent before launch.
  aboutSuffixTh:
    'โปรแกรมนี้ออกแบบเพื่อประเมินตัวชี้วัดที่เกี่ยวข้องอย่างเป็นระบบ และช่วยให้เห็นความเชื่อมโยงของข้อมูลสุขภาพมากกว่าการอ่านผลแต่ละค่าแยกกัน แพทย์จะพิจารณาผลร่วมกับประวัติ อาการ การใช้ยา อาหาร การนอน การออกกำลังกาย และรูปแบบการใช้ชีวิต เพื่ออธิบายความหมายของผลตรวจให้เข้าใจง่าย พร้อมระบุประเด็นที่ควรให้ความสำคัญ ผู้รับบริการสามารถนำข้อมูลไปใช้วางแผนป้องกัน ปรับพฤติกรรม และติดตามการเปลี่ยนแปลงของสุขภาพได้อย่างเหมาะสม โดยคำแนะนำจะปรับตามสภาพร่างกาย ความเสี่ยง และเป้าหมายเฉพาะบุคคล',
  purposeList: [
    { th: 'ค้นหาความเสี่ยงหรือความผิดปกติที่อาจยังไม่แสดงอาการ' },
    { th: 'ช่วยให้แพทย์เชื่อมโยงตัวชี้วัดสำคัญได้เป็นระบบ' },
    { th: 'ใช้วางแผนป้องกัน ดูแล หรือติดตามสุขภาพระยะยาว' },
  ],
  audienceList: [
    { th: 'ผู้ที่ต้องการตรวจสุขภาพเชิงป้องกัน' },
    { th: 'ผู้มีอาการเรื้อรังหรือไม่ทราบสาเหตุ' },
    { th: 'ผู้มีประวัติครอบครัวเสี่ยงโรคหรือสังเกตเห็นสุขภาพเปลี่ยนแปลง' },
  ],
  checkupItems: [
    { name: { th: 'ตรวจความสมบูรณ์ของเม็ดเลือดและการทำงานของอวัยวะ', en: 'Blood count and organ function' } },
    { name: { th: 'ประเมินระบบเผาผลาญและความเสี่ยงหัวใจ', en: 'Metabolic and cardiovascular assessment' } },
    { name: { th: 'ตรวจฮอร์โมน วิตามิน และแร่ธาตุสำคัญ', en: 'Hormones, vitamins, and minerals' } },
    { name: { th: 'พบแพทย์เพื่อสรุปผลและรับแผนดูแล', en: 'Physician review and care plan' } },
  ],
  termsOfService: [
    {
      title: { th: 'นัดหมายล่วงหน้า', en: 'Advance booking' },
      description: {
        th: 'กรุณานัดหมายอย่างน้อย 1–2 วัน และแจ้งประวัติสุขภาพหรือยาที่ใช้อยู่',
        en: 'Book 1–2 days ahead and share relevant health or medication history.',
      },
    },
    {
      title: { th: 'งดอาหารก่อนตรวจ', en: 'Fasting' },
      description: {
        th: 'งดอาหารและเครื่องดื่มที่มีแคลอรี 8–10 ชั่วโมง ดื่มน้ำเปล่าได้',
        en: 'Fast from food and caloric drinks for 8–10 hours; water is allowed.',
      },
    },
    {
      title: { th: 'สิทธิ์การใช้แพ็กเกจ', en: 'Package validity' },
      description: {
        th: 'แพ็กเกจสำหรับ 1 ท่าน ใช้ได้ภายในระยะเวลาที่กำหนด และไม่สามารถแลกเป็นเงินสด',
        en: 'For one person, valid within the stated period, and not redeemable for cash.',
      },
    },
    {
      title: { th: 'เงื่อนไขทางการแพทย์', en: 'Medical conditions' },
      description: {
        th: 'รายการตรวจอาจเปลี่ยนตามดุลยพินิจแพทย์ และค่าใช้จ่ายเพิ่มเติมจะแจ้งก่อนบริการ',
        en: 'Tests may change by physician assessment; extra costs will be advised in advance.',
      },
    },
  ],
}

type ProgramSeed = {
  slug: string
  code: string
  category: 'plastic' | 'dermatology' | 'longevity' | 'wellness'
  tag?: string
  titleTh: string
  titleEn: string
  descTh: string
  descEn: string
  image: string
  price: number
  branch?: string
  highlights?: Array<{ th: string; en: string }>
  cardNote?: { th: string; en: string }
  searchKeywords?: string
}

export const programsData: ProgramSeed[] = [
  {
    slug: 'pv01',
    code: 'PV · 01',
    category: 'longevity',
    tag: 'LONGEVITY',
    titleTh: 'โปรแกรมประเมินสุขภาพและอายุชีวภาพ',
    titleEn: 'Biological Age & Longevity Assessment',
    descTh: 'มองเห็นความเสี่ยงก่อนเกิดโรค และประเมินความสมดุลของร่างกายในระดับที่ลึกกว่าการตรวจสุขภาพทั่วไป',
    descEn: 'See risks before symptoms and evaluate whole-body balance beyond a standard checkup.',
    image: 'assets/images/treatments/expertise-longevity.jpg',
    price: 24500,
    branch: 'sanampao',
    highlights: [
      { th: 'ตรวจเลือดเชิงลึกกว่า 50 รายการ', en: '50+ advanced biomarkers' },
      { th: 'ประเมินอายุชีวภาพและภาวะอักเสบ', en: 'Biological age & inflammation' },
    ],
    cardNote: { th: 'ปรึกษาแพทย์พร้อมสรุปผล', en: 'Doctor review included' },
    searchKeywords: 'longevity สุขภาพองค์รวม ชะลอวัย biological age',
  },
  {
    // See KNOWN SOURCE CONFLICT note above — this is program_detail.html's
    // actual pv02 content (Sex Hormone Checkup), not program.html's catalog
    // card ("Advanced Hormone Balance").
    slug: 'pv02',
    code: 'PV · 02 — SEX HORMONE CHECKUP',
    category: 'longevity',
    tag: 'HORMONE',
    titleTh: 'โปรแกรมตรวจวัดระดับฮอร์โมนเพศ',
    titleEn: 'Sex Hormone Checkup',
    descTh:
      'ประเมินระดับฮอร์โมนเพศที่เกี่ยวข้องกับระบบสืบพันธุ์ การเผาผลาญ การนอน อารมณ์ กระดูกและกล้ามเนื้อ สำหรับผู้ชายและผู้หญิง',
    descEn:
      'Assess sex hormones related to reproductive health, metabolism, sleep, mood, bones, and muscles.',
    image: 'assets/images/treatments/specialist-1.jpg',
    price: PRICE_TODO,
  },
  {
    slug: 'pv03',
    code: 'PV · 03',
    category: 'longevity',
    tag: 'CARDIOVASCULAR',
    titleTh: 'โปรแกรมประเมินความเสี่ยงหัวใจและหลอดเลือด',
    titleEn: 'Advanced Cardiovascular Risk',
    descTh: 'วิเคราะห์ปัจจัยเสี่ยงซ่อนเร้น ตั้งแต่ไขมันอนุภาคเล็ก ภาวะอักเสบ ไปจนถึงสมรรถนะการไหลเวียน',
    descEn: 'Analyze hidden risks from advanced lipids and inflammation to circulatory performance.',
    image: 'assets/images/hero/herobg03.png',
    price: 18500,
    branch: 'sriayudhaya',
    highlights: [
      { th: 'ตรวจ Advanced Lipid Profile', en: 'Advanced lipid profile' },
      { th: 'ประเมินความเสี่ยงเฉพาะบุคคล', en: 'Personal risk stratification' },
    ],
    cardNote: { th: 'เน้นการป้องกันระยะยาว', en: 'Long-term prevention' },
    searchKeywords: 'heart หัวใจ หลอดเลือด ไขมัน ความดัน',
  },
  {
    slug: 'pv04',
    code: 'PV · 04',
    category: 'dermatology',
    tag: 'SKIN & HAIR',
    titleTh: 'โปรแกรมวิเคราะห์สุขภาพผิวและเส้นผม',
    titleEn: 'Skin & Hair Health Analysis',
    descTh: 'ประเมินปัจจัยภายในที่ส่งผลต่อผิวหมอง ริ้วรอย ผมบาง และการฟื้นตัวของผิว',
    descEn: 'Assess internal factors behind dullness, aging, hair thinning, and skin recovery.',
    image: 'assets/images/treatments/expertise-skin.jpg',
    price: 15500,
    branch: 'petchakasem',
    highlights: [
      { th: 'วิเคราะห์สารอาหารและฮอร์โมน', en: 'Nutrient & hormone analysis' },
      { th: 'ออกแบบแผนดูแลจากภายใน', en: 'Inside-out care plan' },
    ],
    cardNote: { th: 'ดูแลโดยแพทย์ผิวหนัง', en: 'Dermatologist-led' },
    searchKeywords: 'skin hair ผิว ผม ร่วง collagen',
  },
  {
    slug: 'pv05',
    code: 'PV · 05',
    category: 'longevity',
    tag: "WOMEN'S HEALTH",
    titleTh: 'โปรแกรมสุขภาพผู้หญิงตามช่วงวัย',
    titleEn: "Women's Life-stage Health",
    descTh: 'ดูแลสุขภาพในทุกการเปลี่ยนแปลง ตั้งแต่วัยทำงาน การวางแผนครอบครัว จนถึงวัยแห่งสมดุลใหม่',
    descEn: 'Care through every transition, from working life and family planning to a new stage of balance.',
    image: 'assets/images/treatments/pragnent.png',
    price: 17500,
    branch: 'sriracha',
    highlights: [
      { th: 'ประเมินฮอร์โมนและสุขภาพกระดูก', en: 'Hormone & bone health' },
      { th: 'คำแนะนำโภชนาการเฉพาะวัย', en: 'Life-stage nutrition guidance' },
    ],
    cardNote: { th: 'พื้นที่ปรึกษาเป็นส่วนตัว', en: 'Private consultation' },
    searchKeywords: 'women ผู้หญิง วัยทอง menopause fertility',
  },
  {
    slug: 'pv06',
    code: 'PV · 06',
    category: 'longevity',
    tag: 'PRECISION HEALTH',
    titleTh: 'โปรแกรมวิเคราะห์พันธุกรรมเพื่อสุขภาพ',
    titleEn: 'Precision Genetic Health',
    descTh: 'ถอดรหัสแนวโน้มสุขภาพ การตอบสนองต่ออาหาร การออกกำลังกาย และยาบางกลุ่มจากข้อมูลพันธุกรรม',
    descEn: 'Decode health tendencies and responses to nutrition, exercise, and selected medications.',
    image: 'assets/images/treatments/specialist-3.jpg',
    price: 32000,
    branch: 'sanampao',
    highlights: [
      { th: 'รายงานสุขภาพหลายมิติ', en: 'Multi-dimensional health report' },
      { th: 'แพทย์แปลผลและวางแผน', en: 'Physician interpretation & plan' },
    ],
    cardNote: { th: 'ผลตรวจใช้วางแผนระยะยาว', en: 'Built for long-term planning' },
    searchKeywords: 'genetic dna พันธุกรรม nutrition ยา',
  },
  {
    slug: 'pv07',
    code: 'PV · 07',
    category: 'longevity',
    tag: 'CELLULAR HEALTH',
    titleTh: 'โปรแกรมประเมินสุขภาพระดับเซลล์',
    titleEn: 'Cellular Health Assessment',
    descTh: 'วิเคราะห์ภาวะเครียดออกซิเดชันและประสิทธิภาพการทำงานของเซลล์',
    descEn: 'Assess oxidative stress and cellular performance.',
    image: 'assets/images/treatments/expertise-longevity.jpg',
    price: 22500,
    branch: 'phaholyothin',
  },
  {
    slug: 'pv08',
    code: 'PV · 08',
    category: 'longevity',
    tag: 'METABOLIC HEALTH',
    titleTh: 'โปรแกรมตรวจเมตาบอลิซึมและภาวะดื้ออินซูลิน',
    titleEn: 'Metabolic & Insulin Resistance Check',
    descTh: 'ค้นหาความเสี่ยงเบาหวานและสาเหตุที่ทำให้ควบคุมน้ำหนักได้ยาก',
    descEn: 'Identify diabetes risk and barriers to healthy weight control.',
    image: 'assets/images/treatments/specialist-1.jpg',
    price: 16500,
    branch: 'sriayudhaya',
  },
  {
    slug: 'pv09',
    code: 'PV · 09',
    category: 'longevity',
    tag: 'HEART PERFORMANCE',
    titleTh: 'โปรแกรมตรวจสมรรถภาพหัวใจสำหรับผู้รักการออกกำลัง',
    titleEn: 'Active Heart Performance',
    descTh: 'ประเมินความพร้อมของหัวใจและระบบไหลเวียนก่อนวางแผนออกกำลังกาย',
    descEn: 'Evaluate cardiovascular readiness before an exercise plan.',
    image: 'assets/images/hero/herobg03.png',
    price: 19500,
    branch: 'petchakasem',
  },
  {
    slug: 'pv10',
    code: 'PV · 10',
    category: 'dermatology',
    tag: 'SKIN VITALITY',
    titleTh: 'โปรแกรมวิเคราะห์ผิวเสื่อมก่อนวัย',
    titleEn: 'Premature Skin Aging Analysis',
    descTh: 'ค้นหาปัจจัยภายในที่เร่งริ้วรอย ความแห้ง และการสูญเสียคอลลาเจน',
    descEn: 'Find internal drivers of wrinkles, dryness, and collagen loss.',
    image: 'assets/images/treatments/expertise-skin.jpg',
    price: 14500,
    branch: 'sriracha',
  },
  {
    slug: 'pv11',
    code: 'PV · 11',
    category: 'longevity',
    tag: 'WOMEN 35+',
    titleTh: 'โปรแกรมสุขภาพผู้หญิงวัย 35+',
    titleEn: 'Women 35+ Health Program',
    descTh: 'ประเมินฮอร์โมน ภาวะขาดสารอาหาร และความเสี่ยงตามช่วงวัย',
    descEn: 'Review hormones, nutrient status, and age-related risks.',
    image: 'assets/images/treatments/pragnent.png',
    price: 18500,
    branch: 'sanampao',
  },
  {
    slug: 'pv12',
    code: 'PV · 12',
    category: 'longevity',
    tag: 'IMMUNE BALANCE',
    titleTh: 'โปรแกรมประเมินภูมิคุ้มกันและการอักเสบ',
    titleEn: 'Immune & Inflammation Balance',
    descTh: 'วิเคราะห์ภูมิคุ้มกันและภาวะอักเสบเรื้อรังที่อาจส่งผลต่อสุขภาพระยะยาว',
    descEn: 'Analyze immune balance and chronic inflammation affecting long-term health.',
    image: 'assets/images/treatments/specialist-3.jpg',
    price: 23500,
    branch: 'phaholyothin',
  },
  {
    slug: 'pv13',
    code: 'PV · 13',
    category: 'longevity',
    tag: 'THYROID FOCUS',
    titleTh: 'โปรแกรมตรวจต่อมไทรอยด์เชิงลึก',
    titleEn: 'Advanced Thyroid Assessment',
    descTh: 'ตรวจการทำงานของไทรอยด์อย่างละเอียดสำหรับผู้มีอาการเหนื่อยง่ายหรือควบคุมน้ำหนักยาก',
    descEn: 'Detailed thyroid assessment for fatigue and weight concerns.',
    image: 'assets/images/treatments/specialist-1.jpg',
    price: 12500,
    branch: 'sriayudhaya',
  },
  {
    slug: 'pv14',
    code: 'PV · 14',
    category: 'longevity',
    tag: 'VASCULAR AGE',
    titleTh: 'โปรแกรมประเมินอายุหลอดเลือด',
    titleEn: 'Vascular Age Assessment',
    descTh: 'ประเมินความยืดหยุ่นของหลอดเลือดและความเสี่ยงโรคหัวใจในอนาคต',
    descEn: 'Measure vascular flexibility and future cardiovascular risk.',
    image: 'assets/images/hero/herobg03.png',
    price: 17500,
    branch: 'petchakasem',
  },
  {
    slug: 'pv15',
    code: 'PV · 15',
    category: 'dermatology',
    tag: 'HAIR ROOT',
    titleTh: 'โปรแกรมตรวจสาเหตุผมร่วงเชิงลึก',
    titleEn: 'Advanced Hair Loss Analysis',
    descTh: 'วิเคราะห์ฮอร์โมน สารอาหาร และปัจจัยสุขภาพที่เกี่ยวข้องกับผมร่วง',
    descEn: 'Analyze hormonal, nutritional, and health factors behind hair loss.',
    image: 'assets/images/treatments/expertise-skin.jpg',
    price: 13900,
    branch: 'sriracha',
  },
  {
    slug: 'pv16',
    code: 'PV · 16',
    category: 'longevity',
    tag: 'MENOPAUSE CARE',
    titleTh: 'โปรแกรมดูแลสุขภาพวัยทองแบบองค์รวม',
    titleEn: 'Complete Menopause Care',
    descTh: 'ประเมินฮอร์โมน กระดูก หัวใจ และการนอนหลับเพื่อการดูแลวัยทองอย่างสมดุล',
    descEn: 'Review hormones, bones, heart, and sleep for balanced menopause care.',
    image: 'assets/images/treatments/pragnent.png',
    price: 18900,
    branch: 'sanampao',
  },
  {
    slug: 'pv17',
    code: 'PV · 17',
    category: 'longevity',
    tag: 'BRAIN LONGEVITY',
    titleTh: 'โปรแกรมประเมินสุขภาพสมองและความจำ',
    titleEn: 'Brain & Memory Longevity',
    descTh: 'ประเมินปัจจัยเสี่ยงด้านความจำ สมาธิ และสุขภาพสมองระยะยาว',
    descEn: 'Assess memory, focus, and long-term brain health risks.',
    image: 'assets/images/treatments/expertise-longevity.jpg',
    price: PRICE_TODO,
  },
  {
    slug: 'pv18',
    code: 'PV · 18',
    category: 'longevity',
    tag: 'ADRENAL & STRESS',
    titleTh: 'โปรแกรมตรวจความเครียดและต่อมหมวกไต',
    titleEn: 'Stress & Adrenal Assessment',
    descTh: 'วิเคราะห์การตอบสนองต่อความเครียดและภาวะอ่อนล้าสะสม',
    descEn: 'Analyze stress response and accumulated fatigue.',
    image: 'assets/images/treatments/specialist-1.jpg',
    price: PRICE_TODO,
  },
  {
    slug: 'pv19',
    code: 'PV · 19',
    category: 'longevity',
    tag: 'LIPID PRECISION',
    titleTh: 'โปรแกรมตรวจไขมันอนุภาคเชิงลึก',
    titleEn: 'Precision Lipid Profile',
    descTh: 'วิเคราะห์ชนิดและขนาดอนุภาคไขมันเพื่อประเมินความเสี่ยงหัวใจอย่างแม่นยำ',
    descEn: 'Analyze lipid particle type and size for precise heart-risk assessment.',
    image: 'assets/images/hero/herobg03.png',
    price: PRICE_TODO,
  },
  {
    slug: 'pv20',
    code: 'PV · 20',
    category: 'dermatology',
    tag: 'ACNE ROOT CAUSE',
    titleTh: 'โปรแกรมค้นหาต้นเหตุสิวเรื้อรัง',
    titleEn: 'Chronic Acne Root Cause',
    descTh: 'เชื่อมโยงฮอร์โมน ลำไส้ อาหาร และการอักเสบที่เกี่ยวข้องกับสิว',
    descEn: 'Connect hormonal, gut, dietary, and inflammatory acne factors.',
    image: 'assets/images/treatments/expertise-skin.jpg',
    price: PRICE_TODO,
  },
  {
    slug: 'pv21',
    code: 'PV · 21',
    category: 'longevity',
    tag: 'PRECONCEPTION',
    titleTh: 'โปรแกรมเตรียมสุขภาพก่อนวางแผนครอบครัว',
    titleEn: 'Preconception Health Program',
    descTh: 'ประเมินความพร้อมด้านฮอร์โมน สารอาหาร และสุขภาพโดยรวมก่อนตั้งครรภ์',
    descEn: 'Assess hormones, nutrition, and overall health before pregnancy.',
    image: 'assets/images/treatments/pragnent.png',
    price: PRICE_TODO,
  },
  {
    slug: 'pv22',
    code: 'PV · 22',
    category: 'longevity',
    tag: 'GUT HEALTH',
    titleTh: 'โปรแกรมตรวจสมดุลลำไส้และไมโครไบโอม',
    titleEn: 'Gut & Microbiome Balance',
    descTh: 'วิเคราะห์ระบบย่อยอาหาร จุลินทรีย์ และความเชื่อมโยงต่อภูมิคุ้มกัน',
    descEn: 'Analyze digestion, microbiome, and links to immune health.',
    image: 'assets/images/treatments/specialist-3.jpg',
    price: PRICE_TODO,
  },
  {
    slug: 'pv23',
    code: 'PV · 23',
    category: 'longevity',
    tag: 'MALE VITALITY',
    titleTh: 'โปรแกรมสุขภาพและฮอร์โมนสำหรับผู้ชาย',
    titleEn: "Men's Hormone & Vitality",
    descTh: 'ประเมินฮอร์โมน พลังงาน มวลกล้ามเนื้อ และความเสี่ยงตามช่วงวัย',
    descEn: 'Review hormones, energy, muscle mass, and age-related risks.',
    image: 'assets/images/treatments/specialist-1.jpg',
    price: PRICE_TODO,
  },
  {
    slug: 'pv24',
    code: 'PV · 24',
    category: 'longevity',
    tag: 'SLEEP HEALTH',
    titleTh: 'โปรแกรมประเมินคุณภาพการนอนหลับ',
    titleEn: 'Sleep Quality Assessment',
    descTh: 'ค้นหาปัจจัยด้านฮอร์โมน ความเครียด และพฤติกรรมที่รบกวนการนอน',
    descEn: 'Identify hormonal, stress, and lifestyle factors affecting sleep.',
    image: 'assets/images/treatments/expertise-longevity.jpg',
    price: PRICE_TODO,
  },
  // --- Plastic Surgery placeholders (see note above) ---
  {
    slug: 'pv25',
    code: 'PV · 25',
    category: 'plastic',
    tag: 'FACIAL CONTOURING',
    titleTh: 'โปรแกรมปรึกษาและตรวจสุขภาพก่อนศัลยกรรมปรับรูปหน้า',
    titleEn: 'Facial Contouring Consultation & Pre-Op Screening',
    descTh: 'พบศัลยแพทย์ตกแต่งเพื่อวางแผนปรับรูปหน้า พร้อมตรวจสุขภาพเตรียมความพร้อมก่อนการผ่าตัด',
    descEn: 'Meet a plastic surgeon to plan facial contouring, with pre-operative health screening included.',
    image: 'assets/images/treatments/expertise-plastic.jpg',
    price: PRICE_TODO,
    branch: 'sanampao',
    highlights: [
      { th: 'ปรึกษาศัลยแพทย์ผู้เชี่ยวชาญเฉพาะทาง', en: 'Board-certified plastic surgeon consult' },
      { th: 'ตรวจร่างกายเตรียมพร้อมก่อนผ่าตัด', en: 'Pre-op health screening' },
    ],
    cardNote: { th: 'ห้องผ่าตัดมาตรฐานโรงพยาบาล', en: 'Hospital-grade OR standards' },
    searchKeywords: 'plastic surgery ศัลยกรรม ปรับรูปหน้า facial contouring',
  },
  {
    slug: 'pv26',
    code: 'PV · 26',
    category: 'plastic',
    tag: 'RHINOPLASTY',
    titleTh: 'โปรแกรมตรวจสุขภาพก่อนศัลยกรรมจมูก',
    titleEn: 'Rhinoplasty Pre-Surgical Health Screening',
    descTh: 'ประเมินความพร้อมของร่างกายและปรึกษาแนวทางการผ่าตัดจมูกกับศัลยแพทย์เฉพาะทาง',
    descEn: 'Assess surgical readiness and discuss rhinoplasty options with a specialist surgeon.',
    image: 'assets/images/treatments/nose.png',
    price: PRICE_TODO,
    branch: 'sanampao',
    highlights: [
      { th: 'ตรวจเลือดและความพร้อมก่อนผ่าตัด', en: 'Blood work & surgical fitness check' },
      { th: 'ออกแบบทรงจมูกเฉพาะบุคคล', en: 'Personalized nose design' },
    ],
    cardNote: { th: 'ทีมพยาบาลดูแลตลอดกระบวนการ', en: 'Full nursing support throughout' },
    searchKeywords: 'rhinoplasty จมูก ศัลยกรรมจมูก nose surgery',
  },
  {
    slug: 'pv27',
    code: 'PV · 27',
    category: 'plastic',
    tag: 'BODY CONTOURING',
    titleTh: 'โปรแกรมตรวจประเมินก่อนศัลยกรรมกระชับสัดส่วน',
    titleEn: 'Body Contouring & Liposuction Pre-Op Program',
    descTh: 'ตรวจสุขภาพและปรึกษาแนวทางศัลยกรรมกระชับสัดส่วนหรือดูดไขมันอย่างปลอดภัย',
    descEn: 'Health screening and consultation for safe body contouring or liposuction planning.',
    image: 'assets/images/treatments/womanbody.png',
    price: PRICE_TODO,
    branch: 'sanampao',
    highlights: [
      { th: 'ประเมินสัดส่วนและวางแผนเฉพาะบุคคล', en: 'Personalized body assessment' },
      { th: 'ห้องพักฟื้นส่วนตัวระดับ VIP', en: 'Private VIP recovery suite' },
    ],
    cardNote: { th: 'ดูแลหลังผ่าตัดตลอด 24 ชั่วโมง', en: '24-hour post-op care' },
    searchKeywords: 'liposuction body contouring ดูดไขมัน กระชับสัดส่วน',
  },
  {
    slug: 'pv28',
    code: 'PV · 28',
    category: 'plastic',
    tag: 'POST-SURGICAL CARE',
    titleTh: 'โปรแกรมติดตามผลและฟื้นฟูหลังศัลยกรรม',
    titleEn: 'Post-Surgical Recovery & Follow-up Program',
    descTh: 'ติดตามผลการฟื้นตัวหลังศัลยกรรมอย่างใกล้ชิดโดยทีมศัลยแพทย์และพยาบาล',
    descEn: 'Close post-operative recovery monitoring by the surgical and nursing team.',
    image: 'assets/images/treatments/filler.png',
    price: PRICE_TODO,
    branch: 'sanampao',
    highlights: [
      { th: 'นัดติดตามผลตามระยะการฟื้นตัว', en: 'Staged follow-up visits' },
      { th: 'ปรึกษาศัลยแพทย์เจ้าของไข้โดยตรง', en: 'Direct access to your surgeon' },
    ],
    cardNote: { th: 'เหมาะสำหรับผู้ที่เพิ่งเข้ารับการผ่าตัด', en: 'For recent surgical patients' },
    searchKeywords: 'post surgery recovery ฟื้นฟูหลังผ่าตัด follow up',
  },
  // --- Aesthetic Wellness placeholders (see note above) ---
  {
    slug: 'pv29',
    code: 'PV · 29',
    category: 'wellness',
    tag: 'DETOX & RESTORE',
    titleTh: 'โปรแกรมดีท็อกซ์และฟื้นฟูร่างกาย',
    titleEn: 'Body Detox & Wellness Restoration',
    descTh: 'ฟื้นฟูร่างกายจากความเหนื่อยล้าสะสม ด้วยการดูแลแบบองค์รวมในบรรยากาศรีสอร์ต',
    descEn: 'Restore the body from accumulated fatigue with holistic care in a resort-like setting.',
    image: 'assets/images/brand/about-lounge.jpg',
    price: PRICE_TODO,
    branch: 'petchakasem',
    highlights: [
      { th: 'ประเมินสุขภาพองค์รวมก่อนเริ่มโปรแกรม', en: 'Holistic health assessment first' },
      { th: 'ทรีตเมนต์ฟื้นฟูในบรรยากาศผ่อนคลาย', en: 'Restorative treatments, resort setting' },
    ],
    cardNote: { th: 'ออกแบบเฉพาะบุคคล', en: 'Personalized program' },
    searchKeywords: 'detox wellness ดีท็อกซ์ ฟื้นฟูร่างกาย',
  },
  {
    slug: 'pv30',
    code: 'PV · 30',
    category: 'wellness',
    tag: 'WEIGHT MANAGEMENT',
    titleTh: 'โปรแกรมควบคุมน้ำหนักและปรับสัดส่วนร่างกาย',
    titleEn: 'Weight Management & Body Recomposition',
    descTh: 'วางแผนควบคุมน้ำหนักและปรับสัดส่วนร่างกายอย่างยั่งยืน ดูแลโดยแพทย์ผู้เชี่ยวชาญ',
    descEn: 'Sustainable weight management and body recomposition planning, physician-guided.',
    image: 'assets/images/treatments/womanbody.png',
    price: PRICE_TODO,
    branch: 'petchakasem',
    highlights: [
      { th: 'วิเคราะห์องค์ประกอบร่างกาย', en: 'Body composition analysis' },
      { th: 'แผนโภชนาการและการออกกำลังกาย', en: 'Nutrition & exercise plan' },
    ],
    cardNote: { th: 'ติดตามผลอย่างต่อเนื่อง', en: 'Ongoing progress tracking' },
    searchKeywords: 'weight management น้ำหนัก สัดส่วน body recomposition',
  },
  {
    slug: 'pv31',
    code: 'PV · 31',
    category: 'wellness',
    tag: 'IV THERAPY',
    titleTh: 'โปรแกรมวิตามินบำบัดทางหลอดเลือดเพื่อเพิ่มพลังงาน',
    titleEn: 'IV Vitamin Therapy & Energy Boost',
    descTh: 'เติมวิตามินและแร่ธาตุที่จำเป็นทางหลอดเลือด เพื่อฟื้นฟูพลังงานและความสดชื่น',
    descEn: 'Replenish essential vitamins and minerals intravenously to restore energy and vitality.',
    image: 'assets/images/treatments/specialist-2.jpg',
    price: PRICE_TODO,
    branch: 'petchakasem',
    highlights: [
      { th: 'ปรับสูตรวิตามินตามความต้องการ', en: 'Customized vitamin formula' },
      { th: 'ให้บริการโดยพยาบาลวิชาชีพ', en: 'Administered by licensed nurses' },
    ],
    cardNote: { th: 'ใช้เวลาประมาณ 30–45 นาที', en: 'About 30–45 minutes' },
    searchKeywords: 'IV drip vitamin therapy วิตามิน หลอดเลือด energy',
  },
  {
    slug: 'pv32',
    code: 'PV · 32',
    category: 'wellness',
    tag: 'SPA & RELAXATION',
    titleTh: 'โปรแกรมสปาผ่อนคลายและฟื้นฟูองค์รวม',
    titleEn: 'Relaxation & Holistic Spa Wellness',
    descTh: 'ผ่อนคลายกล้ามเนื้อและจิตใจด้วยทรีตเมนต์สปาเชิงบำบัด ในพื้นที่ส่วนตัวเงียบสงบ',
    descEn: 'Relax body and mind with therapeutic spa treatments in a private, tranquil setting.',
    image: 'assets/images/brand/about-lounge.jpg',
    price: PRICE_TODO,
    branch: 'petchakasem',
    highlights: [
      { th: 'ทรีตเมนต์สปาเชิงบำบัดครบวงจร', en: 'Full therapeutic spa treatment' },
      { th: 'พื้นที่ส่วนตัวบรรยากาศรีสอร์ต', en: 'Private, resort-style space' },
    ],
    cardNote: { th: 'เหมาะสำหรับการผ่อนคลายประจำเดือน', en: 'Great for a monthly reset' },
    searchKeywords: 'spa relaxation สปา ผ่อนคลาย wellness',
  },
]

// pv02's own purpose/audience/checkup/terms/contact — replaces the generic
// copy above for that one program.
export const pv02SpecialCopy = {
  aboutTh:
    'ฮอร์โมนเพศทำงานเชื่อมโยงกันและมีบทบาทมากกว่าระบบสืบพันธุ์ โดยสัมพันธ์กับรอบเดือน พลังงาน อารมณ์ กระดูก กล้ามเนื้อ และสุขภาพทางเพศ แพทย์จึงพิจารณาค่าฮอร์โมนหลายชนิดร่วมกับอายุ เพศ อาการ ประวัติสุขภาพ และช่วงเวลาที่เข้ารับการตรวจ',
  purposeList: [
    { th: 'ค้นหาความผิดปกติของระดับฮอร์โมนเพศ' },
    { th: 'ประเมินความเชื่อมโยงกับการนอน อารมณ์ และระบบเผาผลาญ' },
    { th: 'ใช้ประกอบการประเมินความเสี่ยงสุขภาพในอนาคต' },
  ],
  audienceList: [
    { th: 'ผู้ชายและผู้หญิงที่มีอายุ 15 ปีขึ้นไป' },
    { th: 'ผู้ที่สังเกตเห็นการเปลี่ยนแปลงด้านการนอน อารมณ์ หรือน้ำหนัก' },
    { th: 'ผู้ที่ต้องการประเมินสุขภาพเชิงลึกในระดับฮอร์โมน' },
  ],
  maleTests: [
    { name: { th: 'Physical Examination' }, description: { th: 'ซักประวัติและตรวจร่างกายโดยแพทย์' } },
    { name: { th: 'Follicle Stimulating Hormone (FSH)' }, description: { th: 'ตรวจระดับฮอร์โมนเพศ' } },
    { name: { th: 'Progesterone' }, description: { th: 'ตรวจระดับฮอร์โมนเพศ' } },
    { name: { th: 'Testosterone' }, description: { th: 'ตรวจระดับฮอร์โมนเพศชาย' } },
  ],
  femaleTests: [
    { name: { th: 'Physical Examination' }, description: { th: 'ซักประวัติและตรวจร่างกายโดยแพทย์' } },
    { name: { th: 'E2 — Estradiol' }, description: { th: 'ตรวจระดับฮอร์โมนเพศหญิง' } },
    { name: { th: 'Follicle Stimulating Hormone (FSH)' }, description: { th: 'ตรวจระดับฮอร์โมนเพศ' } },
    { name: { th: 'Progesterone' }, description: { th: 'ตรวจระดับฮอร์โมนเพศหญิงที่ช่วยควบคุมประจำเดือน' } },
  ],
  termsOfService: [
    'ราคาดังกล่าวรวมค่าแพทย์ ค่าบริการพยาบาล และค่าบริการโรงพยาบาลเรียบร้อยแล้ว',
    'ราคาดังกล่าวรวมคูปองอาหารว่างและสมุดรายงานผลตรวจสุขภาพเรียบร้อยแล้ว',
    'ค่าแพทย์ดังกล่าวคือค่าแพทย์แจ้งผลในแพ็กเกจที่ตรวจ กรณีต้องการปรึกษาแพทย์ก่อนตรวจ อาจมีค่าแพทย์เพิ่ม 500–800 บาท',
    'แพ็กเกจนี้เหมาะสำหรับผู้ที่มีอายุ 15 ปีขึ้นไป',
    'โปรแกรมนี้สำหรับชาวไทย และชาวต่างชาติที่ทำงานหรือมีสามีหรือภรรยาเป็นชาวไทย (Expat) เท่านั้น',
    'กรณีซื้อโปรแกรมผ่านช่องทางออนไลน์ กรุณานำคูปองมาแสดงต่อเจ้าหน้าที่เพื่อรับสิทธิ์ก่อนเข้าตรวจทุกครั้ง',
    'เข้าใช้บริการได้ที่ศูนย์พรีเมียร์ไลฟ์เซ็นเตอร์ โรงพยาบาลพญาไท 2 ชั้น 8 อาคาร B วันจันทร์–ศุกร์ เวลา 08:00–16:00 น. และวันเสาร์–อาทิตย์ เวลา 08:00–12:00 น.',
    'เพื่อความสะดวก กรุณานัดหมายล่วงหน้าก่อนเข้ารับการตรวจทุกครั้ง ติดต่อศูนย์พรีเมียร์ไลฟ์เซ็นเตอร์ โทร. 02-617-2444 ต่อ 3857 หรือ 065-517-1889 หรือ Phyathai Call Center โทร. 1772',
  ],
  contactOverride: {
    location: { th: 'ศูนย์พรีเมียร์ไลฟ์เซ็นเตอร์ โรงพยาบาลพญาไท 2 ชั้น 8 อาคาร B' },
    hours: { th: 'วันจันทร์–ศุกร์ เวลา 08:00–16:00 น. และวันเสาร์–อาทิตย์ เวลา 08:00–12:00 น.' },
    phone: '02-617-2444 ต่อ 3857',
  },
}
