// Source: the privacy-policy page's original hardcoded JSX content
// (src/app/[locale]/(public)/privacy-policy/page.tsx before it became
// CMS-editable via cms/globals/PrivacyPolicy.ts). Seeded verbatim so
// nothing changes for a visitor the moment this ships — bracketed
// placeholders ([...]) still mark facts (registered entity name, address,
// DPO contact, retention period, contact email/phone) that need to come
// from PHIVARA's own legal/compliance team before this goes live. This is
// a starting draft, not legal advice.
export type PrivacyPolicyBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }

export const privacyPolicyBlocks: { th: PrivacyPolicyBlock[]; en: PrivacyPolicyBlock[] } = {
  th: [
    {
      type: 'p',
      text: 'PHIVARA (“เรา”) ให้ความสำคัญกับความเป็นส่วนตัวของท่านและมุ่งมั่นปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) นโยบายฉบับนี้อธิบายว่าเราเก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของท่านอย่างไรเมื่อท่านใช้งานเว็บไซต์และบริการของเรา',
    },
    { type: 'h2', text: '1. ผู้ควบคุมข้อมูลส่วนบุคคล' },
    {
      type: 'p',
      text: 'ผู้ควบคุมข้อมูลส่วนบุคคลของท่านคือ [ชื่อนิติบุคคลเต็ม เช่น บริษัท พีวารา จำกัด] ที่อยู่ [ที่อยู่จดทะเบียน] หากท่านมีคำถามเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคล สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ได้ที่ [อีเมล/เบอร์โทร DPO]',
    },
    { type: 'h2', text: '2. ข้อมูลที่เราเก็บรวบรวม' },
    {
      type: 'ul',
      items: [
        'ข้อมูลที่ท่านให้โดยตรง: ชื่อ-นามสกุล เบอร์โทรศัพท์ สาขาและบริการที่สนใจ และข้อความเพิ่มเติม เมื่อท่านกรอกแบบฟอร์มขอนัดหมายหรือติดต่อผ่านเว็บไซต์',
        'ข้อมูลการใช้งานเว็บไซต์: หน้าเว็บที่เข้าชม เมื่อท่านยินยอมให้ใช้คุกกี้เพื่อการวิเคราะห์',
        'ข้อมูลจากคุกกี้และเทคโนโลยีติดตามของบุคคลที่สาม (Google Analytics, Meta Pixel) เฉพาะเมื่อท่านกดยอมรับในแบนเนอร์คุกกี้เท่านั้น',
      ],
    },
    { type: 'h2', text: '3. วัตถุประสงค์ในการเก็บรวบรวมและใช้ข้อมูล' },
    {
      type: 'ul',
      items: [
        'เพื่อติดต่อกลับและดำเนินการตามคำขอนัดหมายปรึกษาของท่าน',
        'เพื่อปรับปรุงเว็บไซต์และบริการของเราให้ดียิ่งขึ้น',
        'เพื่อวิเคราะห์การใช้งานเว็บไซต์และวัดผลแคมเปญการตลาด เฉพาะเมื่อได้รับความยินยอมจากท่าน',
      ],
    },
    { type: 'h2', text: '4. คุกกี้และเทคโนโลยีติดตาม' },
    {
      type: 'p',
      text: 'เว็บไซต์นี้ใช้คุกกี้ที่จำเป็นต่อการทำงานพื้นฐานของเว็บไซต์เสมอ ส่วนคุกกี้เพื่อการวิเคราะห์ (Google Analytics) และการตลาด (Meta Pixel) จะเริ่มทำงานก็ต่อเมื่อท่านกดยอมรับในแบนเนอร์คุกกี้ที่แสดงเมื่อเข้าชมเว็บไซต์ครั้งแรกเท่านั้น ท่านสามารถเปลี่ยนการตั้งค่าความยินยอมได้ทุกเมื่อผ่านลิงก์ “ตั้งค่าคุกกี้” ที่ท้ายเว็บไซต์',
    },
    { type: 'h2', text: '5. การเปิดเผยข้อมูลแก่บุคคลที่สาม' },
    {
      type: 'p',
      text: 'เราไม่ขายข้อมูลส่วนบุคคลของท่าน เราอาจเปิดเผยข้อมูลบางส่วนแก่ผู้ให้บริการที่จำเป็นต่อการดำเนินธุรกิจ ได้แก่ Google (Google Analytics) และ Meta Platforms (Meta Pixel) เฉพาะเมื่อท่านให้ความยินยอม รวมถึงผู้ให้บริการด้านเทคโนโลยีที่ช่วยเราดำเนินเว็บไซต์และระบบนัดหมาย',
    },
    { type: 'h2', text: '6. ระยะเวลาการเก็บรักษาข้อมูล' },
    {
      type: 'p',
      text: 'เราเก็บรักษาข้อมูลคำขอนัดหมายของท่านไว้เป็นระยะเวลา [ระบุระยะเวลา เช่น 24 เดือน] นับจากวันที่ท่านติดต่อเรา หรือจนกว่าท่านจะขอให้ลบข้อมูล เว้นแต่กฎหมายกำหนดให้เก็บนานกว่านั้น',
    },
    { type: 'h2', text: '7. สิทธิของเจ้าของข้อมูลส่วนบุคคล' },
    { type: 'p', text: 'ภายใต้ PDPA ท่านมีสิทธิดังต่อไปนี้เกี่ยวกับข้อมูลส่วนบุคคลของท่าน:' },
    {
      type: 'ul',
      items: [
        'สิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล',
        'สิทธิขอแก้ไขข้อมูลให้ถูกต้อง',
        'สิทธิขอลบหรือทำลายข้อมูล',
        'สิทธิขอถอนความยินยอมเมื่อใดก็ได้',
        'สิทธิคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล',
        'สิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) หากเห็นว่าเราไม่ปฏิบัติตามกฎหมาย',
      ],
    },
    { type: 'p', text: 'ท่านสามารถใช้สิทธิเหล่านี้ได้โดยติดต่อเราตามช่องทางในหัวข้อ “ติดต่อเรา” ด้านล่าง' },
    { type: 'h2', text: '8. มาตรการรักษาความปลอดภัย' },
    {
      type: 'p',
      text: 'เรามีมาตรการทางเทคนิคและการบริหารจัดการที่เหมาะสมเพื่อป้องกันการเข้าถึง เปลี่ยนแปลง หรือเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต',
    },
    { type: 'h2', text: '9. การเปลี่ยนแปลงนโยบาย' },
    {
      type: 'p',
      text: 'เราอาจปรับปรุงนโยบายฉบับนี้เป็นครั้งคราว โดยจะแจ้งวันที่ปรับปรุงล่าสุดไว้ด้านบนของหน้านี้',
    },
    { type: 'h2', text: '10. ติดต่อเรา' },
    {
      type: 'p',
      text: 'หากท่านมีคำถามเกี่ยวกับนโยบายฉบับนี้ หรือต้องการใช้สิทธิของท่าน กรุณาติดต่อ [อีเมลติดต่อ] หรือโทร [เบอร์โทรติดต่อ]',
    },
  ],
  en: [
    {
      type: 'p',
      text: "PHIVARA ('we') is committed to protecting your privacy and complying with Thailand's Personal Data Protection Act B.E. 2562 (PDPA). This policy explains how we collect, use, disclose, and protect your personal data when you use our website and services.",
    },
    { type: 'h2', text: '1. Data Controller' },
    {
      type: 'p',
      text: 'Your personal data controller is [full legal entity name, e.g. PHIVARA Co., Ltd.], registered at [registered address]. For data protection questions, contact our Data Protection Officer (DPO) at [DPO email/phone].',
    },
    { type: 'h2', text: '2. Data We Collect' },
    {
      type: 'ul',
      items: [
        'Information you provide directly: full name, phone number, preferred branch and service, and any notes, when you submit an appointment request or contact form on our website.',
        'Website usage data: pages visited, collected only if you consent to analytics cookies.',
        'Data from third-party cookies/tracking technologies (Google Analytics, Meta Pixel), only when you click accept on our cookie banner.',
      ],
    },
    { type: 'h2', text: '3. Purpose of Collection and Use' },
    {
      type: 'ul',
      items: [
        'To contact you and process your consultation/appointment request.',
        'To improve our website and services.',
        'To analyze website usage and measure marketing campaigns, only with your consent.',
      ],
    },
    { type: 'h2', text: '4. Cookies and Tracking Technologies' },
    {
      type: 'p',
      text: "This website always uses cookies essential to basic site functionality. Analytics cookies (Google Analytics) and marketing cookies (Meta Pixel) only activate after you click accept on the cookie banner shown on your first visit. You can change your consent choice anytime via the 'Cookie Settings' link in the site footer.",
    },
    { type: 'h2', text: '5. Disclosure to Third Parties' },
    {
      type: 'p',
      text: 'We do not sell your personal data. We may share limited data with service providers necessary to operate our business, including Google (Google Analytics) and Meta Platforms (Meta Pixel), only with your consent, as well as technology providers that help us run our website and booking system.',
    },
    { type: 'h2', text: '6. Data Retention Period' },
    {
      type: 'p',
      text: 'We retain your appointment request data for [specify period, e.g. 24 months] from the date of contact, or until you request deletion, unless a longer period is required by law.',
    },
    { type: 'h2', text: '7. Your Rights as a Data Subject' },
    { type: 'p', text: 'Under the PDPA, you have the following rights regarding your personal data:' },
    {
      type: 'ul',
      items: [
        'The right to access and receive a copy of your personal data.',
        'The right to correct inaccurate data.',
        'The right to request deletion or destruction of data.',
        'The right to withdraw consent at any time.',
        'The right to object to the collection, use, or disclosure of your data.',
        'The right to lodge a complaint with the Office of the Personal Data Protection Committee (PDPC) if you believe we have not complied with the law.',
      ],
    },
    { type: 'p', text: "You may exercise these rights by contacting us through the channels listed under 'Contact Us' below." },
    { type: 'h2', text: '8. Security Measures' },
    {
      type: 'p',
      text: 'We maintain appropriate technical and organizational measures to prevent unauthorized access, alteration, or disclosure of your personal data.',
    },
    { type: 'h2', text: '9. Changes to This Policy' },
    {
      type: 'p',
      text: 'We may update this policy from time to time. The most recent update date will be shown at the top of this page.',
    },
    { type: 'h2', text: '10. Contact Us' },
    {
      type: 'p',
      text: 'If you have questions about this policy or wish to exercise your rights, please contact [contact email] or call [contact phone].',
    },
  ],
}
