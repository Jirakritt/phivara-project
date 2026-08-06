// Source: phivara-design-html/js/main.js `journalArticles` (card fields for
// all 3) + phivara-design-html/article_detail.html (full body — but that
// detail page only exists for "blue-ocean-pathway"; the other two articles
// were never built past the card stage on the current site, so their body
// below is a placeholder the content team needs to write).
export const articlesData = [
  {
    slug: 'blue-ocean-pathway',
    category: 'longevity' as const,
    categoryLabel: { th: 'เวชศาสตร์อายุยืนยาว', en: 'Longevity Medicine' },
    title: {
      th: 'Blue Ocean Pathway คืออะไร และช่วยออกแบบสุขภาพอย่างไร',
      en: 'What Is the Blue Ocean Pathway — and How Does It Redesign Your Health?',
    },
    summary: {
      th: 'ทำความรู้จักแนวทางวิเคราะห์สุขภาพเชิงลึก เพื่อวางแผนป้องกันก่อนเกิดโรค',
      en: 'A deeper approach to health analysis and proactive prevention.',
    },
    image: 'assets/images/doctors/jr-02.png',
    publishedDate: '2026-05-28',
    readTimeMinutes: 5,
    authorName: { th: 'บทความโดย ทีมแพทย์ PHIVARA', en: 'By PHIVARA Medical Team' },
    popular: true,
    tags: ['Longevity', 'PreventiveMedicine', 'HealthyAging', 'PHIVARAJournal'],
    relatedDoctorSlugs: ['dr02'],
    noteBox: {
      heading: { th: 'สิ่งสำคัญที่ควรรู้', en: 'Important to know' },
      text: {
        th: 'Blue Ocean Pathway เป็นกรอบสำหรับประเมินและวางแผนสุขภาพ ไม่ใช่การรับรองว่าจะป้องกันโรคได้ทั้งหมด และไม่ทดแทนการวินิจฉัยหรือการรักษาตามมาตรฐาน หากมีอาการผิดปกติหรือภาวะฉุกเฉินควรพบแพทย์โดยตรงโดยไม่รอการประเมินโปรแกรม',
        en: 'The Blue Ocean Pathway supports health assessment and planning; it cannot guarantee prevention and does not replace standard diagnosis or treatment. New, concerning or urgent symptoms require direct medical attention without waiting for a program assessment.',
      },
    },
    insightSteps: [
      {
        title: { th: 'เริ่มจากคำถามสุขภาพ', en: 'Begin with the health question' },
        description: {
          th: 'แพทย์รับฟังอาการ ความกังวล เป้าหมาย ประวัติครอบครัว และกิจวัตร เพื่อกำหนดประเด็นที่ควรประเมินก่อน',
          en: 'The doctor reviews symptoms, concerns, goals, family history and routines to define the questions that matter first.',
        },
      },
      {
        title: { th: 'เลือกตรวจอย่างมีเหตุผล', en: 'Select tests with purpose' },
        description: {
          th: 'ทบทวนผลเดิมและเลือกเฉพาะการตรวจที่มีข้อบ่งชี้ เพื่อหลีกเลี่ยงข้อมูลส่วนเกินที่ไม่ช่วยเปลี่ยนแผนดูแล',
          en: 'Previous results are reviewed and tests are selected only when indicated, avoiding excess data that would not change care.',
        },
      },
      {
        title: { th: 'แปลงข้อมูลเป็นแผน', en: 'Turn findings into a plan' },
        description: {
          th: 'สรุปสิ่งที่ควรทำก่อน 2–3 เรื่อง พร้อมเป้าหมาย วิธีติดตาม และคำแนะนำที่ปรับให้เข้ากับตารางชีวิตจริง',
          en: "Two or three priorities are set with targets, monitoring and recommendations adapted to the person's real schedule.",
        },
      },
      {
        title: { th: 'ติดตามและปรับแผน', en: 'Review and recalibrate' },
        description: {
          th: 'ประเมินทั้งผลตรวจ อาการ และสิ่งที่ทำได้จริง แล้วปรับระดับเป้าหมายให้เหมาะกับการเปลี่ยนแปลงของร่างกาย',
          en: "Results, symptoms and real-world adherence are reviewed before goals are adjusted to the body's changing needs.",
        },
      },
    ],
    // Paragraph-by-paragraph plain-text body (headings marked). Converted to
    // Lexical richText nodes by seed.ts using cms/seed/lib/lexical.ts — good
    // enough for a first migration pass; the note-box and insight-grid above
    // are NOT duplicated in here since they render as separate fields.
    bodyTh: [
      { type: 'p', text: 'ผลตรวจสุขภาพที่อยู่ในเกณฑ์ปกติอาจทำให้เราสบายใจ แต่ไม่ได้ตอบทุกคำถามว่าเหตุใดเราจึงเหนื่อยง่าย นอนหลับไม่เต็มอิ่ม ฟื้นตัวช้าลง หรือรู้สึกว่าร่างกายไม่เหมือนเดิม การดูแลสุขภาพเชิงลึกจึงเริ่มจากการมองข้อมูลหลายด้านร่วมกัน ไม่ใช่พิจารณาตัวเลขใดตัวเลขหนึ่งเพียงลำพัง' },
      { type: 'p', text: 'Blue Ocean Pathway คือแนวทางวางแผนสุขภาพเฉพาะบุคคลของ PHIVARA ที่รวบรวมประวัติสุขภาพ วิถีชีวิต เป้าหมาย และข้อมูลทางการแพทย์มาเรียงเป็นภาพเดียว เพื่อช่วยให้แพทย์และผู้รับบริการเห็นลำดับความสำคัญร่วมกันว่า วันนี้ควรดูแลเรื่องใดก่อน เรื่องใดติดตามต่อ และเรื่องใดยังไม่จำเป็นต้องตรวจเพิ่ม' },
      { type: 'h2', text: 'Blue Ocean Pathway คืออะไร' },
      { type: 'p', text: 'คำว่า "Blue Ocean" สื่อถึงพื้นที่ของสุขภาพที่ยังมีโอกาสพัฒนาได้อีกมาก แทนที่จะรอให้ค่าตรวจผิดปกติหรือเกิดอาการชัดเจน แนวทางนี้ชวนให้สำรวจสัญญาณเล็ก ๆ ที่เกิดขึ้นในชีวิตประจำวัน เช่น ระดับพลังงาน คุณภาพการนอน ความเครียด การเปลี่ยนแปลงของน้ำหนัก สมาธิ ระบบขับถ่าย และความสามารถในการฟื้นตัวหลังออกกำลังกาย' },
      { type: 'p', text: 'แพทย์จะนำข้อมูลเหล่านี้มาอ่านร่วมกับประวัติครอบครัว โรคประจำตัว ยาที่ใช้ ผลตรวจเดิม และเป้าหมายชีวิตของแต่ละคน เพราะข้อมูลชุดเดียวกันอาจมีความหมายต่างกันในคนที่อายุ อาชีพ ตารางชีวิต และความเสี่ยงไม่เหมือนกัน จุดสำคัญจึงไม่ใช่การตรวจให้มากที่สุด แต่คือการเลือกข้อมูลที่ช่วยตอบคำถามสุขภาพของคนนั้นได้จริง' },
      { type: 'quote', text: 'เป้าหมายไม่ใช่เพียงการเพิ่มจำนวนปีให้ชีวิต แต่คือการเพิ่มคุณภาพชีวิตให้กับทุกปีที่มี' },
      { type: 'h2', text: 'ต่างจากการตรวจสุขภาพทั่วไปอย่างไร' },
      { type: 'p', text: 'การตรวจสุขภาพประจำปียังคงเป็นพื้นฐานสำคัญสำหรับคัดกรองโรคตามวัยและความเสี่ยง ส่วน Blue Ocean Pathway ทำหน้าที่ต่อยอดจากข้อมูลพื้นฐานนั้น โดยให้ความสำคัญกับ "แนวโน้ม" มากกว่าผลเพียงครั้งเดียว ตัวอย่างเช่น ค่าบางอย่างอาจยังอยู่ในช่วงอ้างอิง แต่เปลี่ยนแปลงต่อเนื่องเมื่อเทียบกับปีก่อน หรือสัมพันธ์กับอาการและพฤติกรรมบางอย่างที่ควรได้รับการติดตาม' },
      { type: 'p', text: 'อีกความแตกต่างคือผลลัพธ์ไม่ได้จบที่รายงานผลตรวจ แต่ถูกแปลงเป็นแผนปฏิบัติที่วัดผลได้ เช่น ปรับเวลานอน เพิ่มกิจกรรมทางกาย เปลี่ยนสัดส่วนอาหาร จัดการความเครียด หรือวางแผนพบแพทย์เฉพาะทางเมื่อมีข้อบ่งชี้ แผนที่ดีควรมีจำนวนเป้าหมายไม่มากเกินไป ทำได้ในชีวิตจริง และกำหนดช่วงเวลาทบทวนอย่างชัดเจน' },
      { type: 'h2', text: 'กระบวนการ 4 ขั้นตอน' },
      { type: 'h2', text: 'แนวทางนี้เหมาะกับใคร' },
      { type: 'p', text: 'แนวทางนี้เหมาะกับผู้ที่ต้องการวางแผนสุขภาพระยะยาวอย่างเป็นระบบ ผู้ที่มีประวัติโรคในครอบครัว ผู้ที่เริ่มสังเกตความเปลี่ยนแปลงของพลังงาน การนอน น้ำหนัก หรือการฟื้นตัว รวมถึงผู้ที่มีผลตรวจจากหลายแห่งแต่ยังไม่ทราบว่าข้อมูลใดสำคัญและควรเริ่มดูแลจากจุดไหน' },
      { type: 'p', text: 'อย่างไรก็ตาม ไม่ใช่ทุกคนจำเป็นต้องตรวจเชิงลึกในระดับเดียวกัน คนที่สุขภาพแข็งแรง ไม่มีปัจจัยเสี่ยง และตรวจสุขภาพตามวัยสม่ำเสมอ อาจเริ่มจากการทบทวนพฤติกรรมและผลตรวจเดิมก่อน ส่วนผู้ที่มีโรคประจำตัวควรให้แพทย์ผู้รักษาหลักมีส่วนร่วม เพื่อให้คำแนะนำใหม่สอดคล้องกับแผนการรักษาที่ใช้อยู่' },
      { type: 'h2', text: 'เริ่มต้นอย่างไรให้ไม่ซับซ้อน' },
      { type: 'p', text: 'ก่อนเข้ารับคำปรึกษา ลองจดอาการหรือสิ่งที่เปลี่ยนแปลงในช่วง 2–3 เดือนที่ผ่านมา เตรียมรายชื่อยาและอาหารเสริม ประวัติสุขภาพของคนในครอบครัว และผลตรวจย้อนหลังเท่าที่มี ข้อมูลเหล่านี้ช่วยให้การสนทนามีทิศทางและอาจลดการตรวจซ้ำที่ไม่จำเป็น' },
      { type: 'p', text: 'การเริ่มต้นที่ดีไม่จำเป็นต้องเปลี่ยนทุกอย่างพร้อมกัน หลังประเมิน แพทย์อาจแนะนำให้เริ่มจากพื้นฐานที่ส่งผลกว้างที่สุดก่อน เช่น เวลานอนที่สม่ำเสมอ การเคลื่อนไหวในแต่ละวัน คุณภาพอาหาร หรือการจัดการความเครียด แล้วจึงติดตามผลในช่วงเวลาที่เหมาะสม หากพบข้อบ่งชี้จึงค่อยเพิ่มการตรวจหรือส่งต่อเฉพาะทาง' },
      { type: 'p', text: 'หัวใจของ Blue Ocean Pathway จึงไม่ใช่จำนวนรายการตรวจ แต่คือการทำให้ข้อมูลสุขภาพเข้าใจง่าย เชื่อมโยงกับชีวิตจริง และนำไปสู่การตัดสินใจที่เหมาะกับแต่ละคน เมื่อมีเป้าหมายที่ชัดและติดตามอย่างต่อเนื่อง การดูแลสุขภาพจะกลายเป็นกระบวนการที่ทำได้จริง มากกว่าความตั้งใจระยะสั้นหลังได้รับผลตรวจเพียงครั้งเดียว' },
    ],
  },
  {
    slug: 'skin-care-tips',
    category: 'wellness' as const,
    categoryLabel: { th: 'สุขภาวะเชิงความงาม', en: 'AESTHETIC WELLNESS' },
    title: {
      th: 'เคล็ดลับดูแลผิวจากแพทย์ผู้เชี่ยวชาญในทุกช่วงวัย',
      en: 'Specialist Skin-Care Tips for Every Age',
    },
    summary: {
      th: 'หลักสำคัญในการเลือกผลิตภัณฑ์และหัตถการให้เหมาะกับสภาพผิวที่เปลี่ยนไป',
      en: 'How to choose products and treatments as your skin evolves.',
    },
    image: 'assets/images/doctors/jr-03.png',
    publishedDate: '2026-05-15',
    readTimeMinutes: 7,
    authorName: { th: 'บทความโดย ทีมแพทย์ PHIVARA', en: 'By PHIVARA Medical Team' },
    popular: false,
    tags: [],
    relatedDoctorSlugs: [],
    // No full detail page exists in the source site for this article yet —
    // placeholder body, needs real content from the clinic before publish.
    bodyTh: [
      {
        type: 'p',
        text: '[ยังไม่มีเนื้อหาฉบับเต็มในเว็บต้นฉบับ — ต้องขอเนื้อหาจริงจากทีมคลินิกก่อนเผยแพร่]',
      },
    ],
  },
  {
    slug: 'hormone-balance',
    category: 'longevity' as const,
    categoryLabel: { th: 'เวชศาสตร์อายุยืนยาว', en: 'LONGEVITY' },
    title: {
      th: 'สมดุลฮอร์โมนกับความอ่อนเยาว์ที่ยั่งยืน',
      en: 'Hormone Balance and Lasting Youth',
    },
    summary: {
      th: 'สัญญาณที่ร่างกายกำลังบอก และบทบาทของการตรวจสุขภาพเฉพาะบุคคล',
      en: 'The signals your body sends and the role of personalized screening.',
    },
    image: 'assets/images/hero/herobg04.png',
    publishedDate: '2026-05-02',
    readTimeMinutes: 8,
    authorName: { th: 'บทความโดย ทีมแพทย์ PHIVARA', en: 'By PHIVARA Medical Team' },
    popular: false,
    tags: [],
    relatedDoctorSlugs: [],
    // Same as above — card-only in the source, no full detail page built yet.
    bodyTh: [
      {
        type: 'p',
        text: '[ยังไม่มีเนื้อหาฉบับเต็มในเว็บต้นฉบับ — ต้องขอเนื้อหาจริงจากทีมคลินิกก่อนเผยแพร่]',
      },
    ],
  },
]
