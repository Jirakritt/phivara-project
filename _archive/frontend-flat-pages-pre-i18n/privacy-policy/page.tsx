import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'

export const metadata = {
  title: 'PHIVARA | นโยบายความเป็นส่วนตัว — Privacy Policy',
}

// PDPA-oriented boilerplate privacy policy. This is a starting draft, not
// legal advice — bracketed placeholders ([...]) mark facts (registered
// entity name, address, DPO contact) that need to come from PHIVARA's own
// legal/compliance team before this goes live. Linked from the site-wide
// PDPA consent banner (src/app/(frontend)/layout.tsx) and the footer.
export const revalidate = 60

export default async function PrivacyPolicyPage() {
  const homeData = await getHomeData()
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify({ branches: homeData.branches }).replace(/</g, '\\u003c')};`

  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/article-detail.css" />

      <Script id="phivara-privacy-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>

      <SiteHeader page="home" topbar={homeData.topbar} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href="/" data-th="หน้าแรก" data-en="Home">หน้าแรก</a>
            <span className="sep">/</span>
            <span className="current" data-th="นโยบายความเป็นส่วนตัว" data-en="Privacy Policy">นโยบายความเป็นส่วนตัว</span>
          </div>
        </div>
      </div>

      <main>
        <section style={{ padding: '64px 0 20px' }}>
          <div className="wrap" style={{ maxWidth: 860 }}>
            <div className="eyebrow" data-th="PDPA · ความเป็นส่วนตัว" data-en="PDPA · PRIVACY">PDPA · ความเป็นส่วนตัว</div>
            <h1 data-th="นโยบายความเป็นส่วนตัว" data-en="Privacy Policy">นโยบายความเป็นส่วนตัว</h1>
            <p className="lead" data-th="ปรับปรุงล่าสุด: [วันที่ประกาศใช้] — เอกสารฉบับนี้เป็นฉบับร่างเบื้องต้น อยู่ระหว่างการตรวจสอบโดยที่ปรึกษากฎหมายก่อนประกาศใช้จริง" data-en="Last updated: [effective date] — this is an initial draft, pending legal review before publication.">
              ปรับปรุงล่าสุด: [วันที่ประกาศใช้] — เอกสารฉบับนี้เป็นฉบับร่างเบื้องต้น อยู่ระหว่างการตรวจสอบโดยที่ปรึกษากฎหมายก่อนประกาศใช้จริง
            </p>
          </div>
        </section>

        <section style={{ padding: '20px 0 80px' }}>
          <div className="wrap" style={{ maxWidth: 860 }}>
            <article className="prose">
              <p data-th="PHIVARA ('เรา') ให้ความสำคัญกับความเป็นส่วนตัวของท่านและมุ่งมั่นปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) นโยบายฉบับนี้อธิบายว่าเราเก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของท่านอย่างไรเมื่อท่านใช้งานเว็บไซต์และบริการของเรา" data-en="PHIVARA ('we') is committed to protecting your privacy and complying with Thailand's Personal Data Protection Act B.E. 2562 (PDPA). This policy explains how we collect, use, disclose, and protect your personal data when you use our website and services.">
                PHIVARA (&quot;เรา&quot;) ให้ความสำคัญกับความเป็นส่วนตัวของท่านและมุ่งมั่นปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) นโยบายฉบับนี้อธิบายว่าเราเก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของท่านอย่างไรเมื่อท่านใช้งานเว็บไซต์และบริการของเรา
              </p>

              <h2 data-th="1. ผู้ควบคุมข้อมูลส่วนบุคคล" data-en="1. Data Controller">1. ผู้ควบคุมข้อมูลส่วนบุคคล</h2>
              <p data-th="ผู้ควบคุมข้อมูลส่วนบุคคลของท่านคือ [ชื่อนิติบุคคลเต็ม เช่น บริษัท พีวารา จำกัด] ที่อยู่ [ที่อยู่จดทะเบียน] หากท่านมีคำถามเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคล สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ได้ที่ [อีเมล/เบอร์โทร DPO]" data-en="Your personal data controller is [full legal entity name, e.g. PHIVARA Co., Ltd.], registered at [registered address]. For data protection questions, contact our Data Protection Officer (DPO) at [DPO email/phone].">
                ผู้ควบคุมข้อมูลส่วนบุคคลของท่านคือ [ชื่อนิติบุคคลเต็ม เช่น บริษัท พีวารา จำกัด] ที่อยู่ [ที่อยู่จดทะเบียน] หากท่านมีคำถามเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคล สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ได้ที่ [อีเมล/เบอร์โทร DPO]
              </p>

              <h2 data-th="2. ข้อมูลที่เราเก็บรวบรวม" data-en="2. Data We Collect">2. ข้อมูลที่เราเก็บรวบรวม</h2>
              <ul>
                <li data-th="ข้อมูลที่ท่านให้โดยตรง: ชื่อ-นามสกุล เบอร์โทรศัพท์ สาขาและบริการที่สนใจ และข้อความเพิ่มเติม เมื่อท่านกรอกแบบฟอร์มขอนัดหมายหรือติดต่อผ่านเว็บไซต์" data-en="Information you provide directly: full name, phone number, preferred branch and service, and any notes, when you submit an appointment request or contact form on our website.">ข้อมูลที่ท่านให้โดยตรง: ชื่อ-นามสกุล เบอร์โทรศัพท์ สาขาและบริการที่สนใจ และข้อความเพิ่มเติม เมื่อท่านกรอกแบบฟอร์มขอนัดหมายหรือติดต่อผ่านเว็บไซต์</li>
                <li data-th="ข้อมูลการใช้งานเว็บไซต์: หน้าเว็บที่เข้าชม เมื่อท่านยินยอมให้ใช้คุกกี้เพื่อการวิเคราะห์" data-en="Website usage data: pages visited, collected only if you consent to analytics cookies.">ข้อมูลการใช้งานเว็บไซต์: หน้าเว็บที่เข้าชม เมื่อท่านยินยอมให้ใช้คุกกี้เพื่อการวิเคราะห์</li>
                <li data-th="ข้อมูลจากคุกกี้และเทคโนโลยีติดตามของบุคคลที่สาม (Google Analytics, Meta Pixel) เฉพาะเมื่อท่านกดยอมรับในแบนเนอร์คุกกี้เท่านั้น" data-en="Data from third-party cookies/tracking technologies (Google Analytics, Meta Pixel), only when you click accept on our cookie banner.">ข้อมูลจากคุกกี้และเทคโนโลยีติดตามของบุคคลที่สาม (Google Analytics, Meta Pixel) เฉพาะเมื่อท่านกดยอมรับในแบนเนอร์คุกกี้เท่านั้น</li>
              </ul>

              <h2 data-th="3. วัตถุประสงค์ในการเก็บรวบรวมและใช้ข้อมูล" data-en="3. Purpose of Collection and Use">3. วัตถุประสงค์ในการเก็บรวบรวมและใช้ข้อมูล</h2>
              <ul>
                <li data-th="เพื่อติดต่อกลับและดำเนินการตามคำขอนัดหมายปรึกษาของท่าน" data-en="To contact you and process your consultation/appointment request.">เพื่อติดต่อกลับและดำเนินการตามคำขอนัดหมายปรึกษาของท่าน</li>
                <li data-th="เพื่อปรับปรุงเว็บไซต์และบริการของเราให้ดียิ่งขึ้น" data-en="To improve our website and services.">เพื่อปรับปรุงเว็บไซต์และบริการของเราให้ดียิ่งขึ้น</li>
                <li data-th="เพื่อวิเคราะห์การใช้งานเว็บไซต์และวัดผลแคมเปญการตลาด เฉพาะเมื่อได้รับความยินยอมจากท่าน" data-en="To analyze website usage and measure marketing campaigns, only with your consent.">เพื่อวิเคราะห์การใช้งานเว็บไซต์และวัดผลแคมเปญการตลาด เฉพาะเมื่อได้รับความยินยอมจากท่าน</li>
              </ul>

              <h2 data-th="4. คุกกี้และเทคโนโลยีติดตาม" data-en="4. Cookies and Tracking Technologies">4. คุกกี้และเทคโนโลยีติดตาม</h2>
              <p data-th="เว็บไซต์นี้ใช้คุกกี้ที่จำเป็นต่อการทำงานพื้นฐานของเว็บไซต์เสมอ ส่วนคุกกี้เพื่อการวิเคราะห์ (Google Analytics) และการตลาด (Meta Pixel) จะเริ่มทำงานก็ต่อเมื่อท่านกดยอมรับในแบนเนอร์คุกกี้ที่แสดงเมื่อเข้าชมเว็บไซต์ครั้งแรกเท่านั้น ท่านสามารถเปลี่ยนการตั้งค่าความยินยอมได้ทุกเมื่อผ่านลิงก์ 'ตั้งค่าคุกกี้' ที่ท้ายเว็บไซต์" data-en="This website always uses cookies essential to basic site functionality. Analytics cookies (Google Analytics) and marketing cookies (Meta Pixel) only activate after you click accept on the cookie banner shown on your first visit. You can change your consent choice anytime via the 'Cookie Settings' link in the site footer.">
                เว็บไซต์นี้ใช้คุกกี้ที่จำเป็นต่อการทำงานพื้นฐานของเว็บไซต์เสมอ ส่วนคุกกี้เพื่อการวิเคราะห์ (Google Analytics) และการตลาด (Meta Pixel) จะเริ่มทำงานก็ต่อเมื่อท่านกดยอมรับในแบนเนอร์คุกกี้ที่แสดงเมื่อเข้าชมเว็บไซต์ครั้งแรกเท่านั้น ท่านสามารถเปลี่ยนการตั้งค่าความยินยอมได้ทุกเมื่อผ่านลิงก์ &quot;ตั้งค่าคุกกี้&quot; ที่ท้ายเว็บไซต์
              </p>

              <h2 data-th="5. การเปิดเผยข้อมูลแก่บุคคลที่สาม" data-en="5. Disclosure to Third Parties">5. การเปิดเผยข้อมูลแก่บุคคลที่สาม</h2>
              <p data-th="เราไม่ขายข้อมูลส่วนบุคคลของท่าน เราอาจเปิดเผยข้อมูลบางส่วนแก่ผู้ให้บริการที่จำเป็นต่อการดำเนินธุรกิจ ได้แก่ Google (Google Analytics) และ Meta Platforms (Meta Pixel) เฉพาะเมื่อท่านให้ความยินยอม รวมถึงผู้ให้บริการด้านเทคโนโลยีที่ช่วยเราดำเนินเว็บไซต์และระบบนัดหมาย" data-en="We do not sell your personal data. We may share limited data with service providers necessary to operate our business, including Google (Google Analytics) and Meta Platforms (Meta Pixel), only with your consent, as well as technology providers that help us run our website and booking system.">
                เราไม่ขายข้อมูลส่วนบุคคลของท่าน เราอาจเปิดเผยข้อมูลบางส่วนแก่ผู้ให้บริการที่จำเป็นต่อการดำเนินธุรกิจ ได้แก่ Google (Google Analytics) และ Meta Platforms (Meta Pixel) เฉพาะเมื่อท่านให้ความยินยอม รวมถึงผู้ให้บริการด้านเทคโนโลยีที่ช่วยเราดำเนินเว็บไซต์และระบบนัดหมาย
              </p>

              <h2 data-th="6. ระยะเวลาการเก็บรักษาข้อมูล" data-en="6. Data Retention Period">6. ระยะเวลาการเก็บรักษาข้อมูล</h2>
              <p data-th="เราเก็บรักษาข้อมูลคำขอนัดหมายของท่านไว้เป็นระยะเวลา [ระบุระยะเวลา เช่น 24 เดือน] นับจากวันที่ท่านติดต่อเรา หรือจนกว่าท่านจะขอให้ลบข้อมูล เว้นแต่กฎหมายกำหนดให้เก็บนานกว่านั้น" data-en="We retain your appointment request data for [specify period, e.g. 24 months] from the date of contact, or until you request deletion, unless a longer period is required by law.">
                เราเก็บรักษาข้อมูลคำขอนัดหมายของท่านไว้เป็นระยะเวลา [ระบุระยะเวลา เช่น 24 เดือน] นับจากวันที่ท่านติดต่อเรา หรือจนกว่าท่านจะขอให้ลบข้อมูล เว้นแต่กฎหมายกำหนดให้เก็บนานกว่านั้น
              </p>

              <h2 data-th="7. สิทธิของเจ้าของข้อมูลส่วนบุคคล" data-en="7. Your Rights as a Data Subject">7. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
              <p data-th="ภายใต้ PDPA ท่านมีสิทธิดังต่อไปนี้เกี่ยวกับข้อมูลส่วนบุคคลของท่าน:" data-en="Under the PDPA, you have the following rights regarding your personal data:">
                ภายใต้ PDPA ท่านมีสิทธิดังต่อไปนี้เกี่ยวกับข้อมูลส่วนบุคคลของท่าน:
              </p>
              <ul>
                <li data-th="สิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล" data-en="The right to access and receive a copy of your personal data.">สิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล</li>
                <li data-th="สิทธิขอแก้ไขข้อมูลให้ถูกต้อง" data-en="The right to correct inaccurate data.">สิทธิขอแก้ไขข้อมูลให้ถูกต้อง</li>
                <li data-th="สิทธิขอลบหรือทำลายข้อมูล" data-en="The right to request deletion or destruction of data.">สิทธิขอลบหรือทำลายข้อมูล</li>
                <li data-th="สิทธิขอถอนความยินยอมเมื่อใดก็ได้" data-en="The right to withdraw consent at any time.">สิทธิขอถอนความยินยอมเมื่อใดก็ได้</li>
                <li data-th="สิทธิคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล" data-en="The right to object to the collection, use, or disclosure of your data.">สิทธิคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล</li>
                <li data-th="สิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) หากเห็นว่าเราไม่ปฏิบัติตามกฎหมาย" data-en="The right to lodge a complaint with the Office of the Personal Data Protection Committee (PDPC) if you believe we have not complied with the law.">สิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) หากเห็นว่าเราไม่ปฏิบัติตามกฎหมาย</li>
              </ul>
              <p data-th="ท่านสามารถใช้สิทธิเหล่านี้ได้โดยติดต่อเราตามช่องทางในหัวข้อ 'ติดต่อเรา' ด้านล่าง" data-en="You may exercise these rights by contacting us through the channels listed under 'Contact Us' below.">
                ท่านสามารถใช้สิทธิเหล่านี้ได้โดยติดต่อเราตามช่องทางในหัวข้อ &quot;ติดต่อเรา&quot; ด้านล่าง
              </p>

              <h2 data-th="8. มาตรการรักษาความปลอดภัย" data-en="8. Security Measures">8. มาตรการรักษาความปลอดภัย</h2>
              <p data-th="เรามีมาตรการทางเทคนิคและการบริหารจัดการที่เหมาะสมเพื่อป้องกันการเข้าถึง เปลี่ยนแปลง หรือเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต" data-en="We maintain appropriate technical and organizational measures to prevent unauthorized access, alteration, or disclosure of your personal data.">
                เรามีมาตรการทางเทคนิคและการบริหารจัดการที่เหมาะสมเพื่อป้องกันการเข้าถึง เปลี่ยนแปลง หรือเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต
              </p>

              <h2 data-th="9. การเปลี่ยนแปลงนโยบาย" data-en="9. Changes to This Policy">9. การเปลี่ยนแปลงนโยบาย</h2>
              <p data-th="เราอาจปรับปรุงนโยบายฉบับนี้เป็นครั้งคราว โดยจะแจ้งวันที่ปรับปรุงล่าสุดไว้ด้านบนของหน้านี้" data-en="We may update this policy from time to time. The most recent update date will be shown at the top of this page.">
                เราอาจปรับปรุงนโยบายฉบับนี้เป็นครั้งคราว โดยจะแจ้งวันที่ปรับปรุงล่าสุดไว้ด้านบนของหน้านี้
              </p>

              <h2 data-th="10. ติดต่อเรา" data-en="10. Contact Us">10. ติดต่อเรา</h2>
              <p data-th="หากท่านมีคำถามเกี่ยวกับนโยบายฉบับนี้ หรือต้องการใช้สิทธิของท่าน กรุณาติดต่อ [อีเมลติดต่อ] หรือโทร [เบอร์โทรติดต่อ]" data-en="If you have questions about this policy or wish to exercise your rights, please contact [contact email] or call [contact phone].">
                หากท่านมีคำถามเกี่ยวกับนโยบายฉบับนี้ หรือต้องการใช้สิทธิของท่าน กรุณาติดต่อ [อีเมลติดต่อ] หรือโทร [เบอร์โทรติดต่อ]
              </p>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
    </>
  )
}
