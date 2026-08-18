import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'
import { DEFAULT_LOCALE, isLocaleCode, localizedHref, translator } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  return {
    title: t('PHIVARA | นโยบายความเป็นส่วนตัว', 'PHIVARA | Privacy Policy'),
  }
}

// PDPA-oriented boilerplate privacy policy. This is a starting draft, not
// legal advice — bracketed placeholders ([...]) mark facts (registered
// entity name, address, DPO contact) that need to come from PHIVARA's own
// legal/compliance team before this goes live. Linked from the site-wide
// PDPA consent banner ([locale]/layout.tsx) and the footer.
export const revalidate = 60

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : DEFAULT_LOCALE
  const t = translator(locale)
  const [homeData, liveLocales] = await Promise.all([getHomeData(locale), getPubliclyLiveLocales()])
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

      <SiteHeader page="home" topbar={homeData.topbar} locale={locale} localePath="/privacy-policy" liveLocales={liveLocales} />

      <div className="breadcrumb-subbar">
        <div className="wrap">
          <div className="doc-breadcrumb">
            <a href={localizedHref(locale, '/')}>{t('หน้าแรก', 'Home')}</a>
            <span className="sep">/</span>
            <span className="current">{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</span>
          </div>
        </div>
      </div>

      <main>
        <section style={{ padding: '64px 0 20px' }}>
          <div className="wrap" style={{ maxWidth: 860 }}>
            <div className="eyebrow">{t('PDPA · ความเป็นส่วนตัว', 'PDPA · PRIVACY')}</div>
            <h1>{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</h1>
            <p className="lead">
              {t(
                'ปรับปรุงล่าสุด: [วันที่ประกาศใช้] — เอกสารฉบับนี้เป็นฉบับร่างเบื้องต้น อยู่ระหว่างการตรวจสอบโดยที่ปรึกษากฎหมายก่อนประกาศใช้จริง',
                'Last updated: [effective date] — this is an initial draft, pending legal review before publication.',
              )}
            </p>
          </div>
        </section>

        <section style={{ padding: '20px 0 80px' }}>
          <div className="wrap" style={{ maxWidth: 860 }}>
            <article className="prose">
              <p>
                {t(
                  'PHIVARA (“เรา”) ให้ความสำคัญกับความเป็นส่วนตัวของท่านและมุ่งมั่นปฏิบัติตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) นโยบายฉบับนี้อธิบายว่าเราเก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของท่านอย่างไรเมื่อท่านใช้งานเว็บไซต์และบริการของเรา',
                  "PHIVARA ('we') is committed to protecting your privacy and complying with Thailand's Personal Data Protection Act B.E. 2562 (PDPA). This policy explains how we collect, use, disclose, and protect your personal data when you use our website and services.",
                )}
              </p>

              <h2>{t('1. ผู้ควบคุมข้อมูลส่วนบุคคล', '1. Data Controller')}</h2>
              <p>
                {t(
                  'ผู้ควบคุมข้อมูลส่วนบุคคลของท่านคือ [ชื่อนิติบุคคลเต็ม เช่น บริษัท พีวารา จำกัด] ที่อยู่ [ที่อยู่จดทะเบียน] หากท่านมีคำถามเกี่ยวกับการคุ้มครองข้อมูลส่วนบุคคล สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ได้ที่ [อีเมล/เบอร์โทร DPO]',
                  'Your personal data controller is [full legal entity name, e.g. PHIVARA Co., Ltd.], registered at [registered address]. For data protection questions, contact our Data Protection Officer (DPO) at [DPO email/phone].',
                )}
              </p>

              <h2>{t('2. ข้อมูลที่เราเก็บรวบรวม', '2. Data We Collect')}</h2>
              <ul>
                <li>
                  {t(
                    'ข้อมูลที่ท่านให้โดยตรง: ชื่อ-นามสกุล เบอร์โทรศัพท์ สาขาและบริการที่สนใจ และข้อความเพิ่มเติม เมื่อท่านกรอกแบบฟอร์มขอนัดหมายหรือติดต่อผ่านเว็บไซต์',
                    'Information you provide directly: full name, phone number, preferred branch and service, and any notes, when you submit an appointment request or contact form on our website.',
                  )}
                </li>
                <li>
                  {t(
                    'ข้อมูลการใช้งานเว็บไซต์: หน้าเว็บที่เข้าชม เมื่อท่านยินยอมให้ใช้คุกกี้เพื่อการวิเคราะห์',
                    'Website usage data: pages visited, collected only if you consent to analytics cookies.',
                  )}
                </li>
                <li>
                  {t(
                    'ข้อมูลจากคุกกี้และเทคโนโลยีติดตามของบุคคลที่สาม (Google Analytics, Meta Pixel) เฉพาะเมื่อท่านกดยอมรับในแบนเนอร์คุกกี้เท่านั้น',
                    'Data from third-party cookies/tracking technologies (Google Analytics, Meta Pixel), only when you click accept on our cookie banner.',
                  )}
                </li>
              </ul>

              <h2>{t('3. วัตถุประสงค์ในการเก็บรวบรวมและใช้ข้อมูล', '3. Purpose of Collection and Use')}</h2>
              <ul>
                <li>{t('เพื่อติดต่อกลับและดำเนินการตามคำขอนัดหมายปรึกษาของท่าน', 'To contact you and process your consultation/appointment request.')}</li>
                <li>{t('เพื่อปรับปรุงเว็บไซต์และบริการของเราให้ดียิ่งขึ้น', 'To improve our website and services.')}</li>
                <li>
                  {t(
                    'เพื่อวิเคราะห์การใช้งานเว็บไซต์และวัดผลแคมเปญการตลาด เฉพาะเมื่อได้รับความยินยอมจากท่าน',
                    'To analyze website usage and measure marketing campaigns, only with your consent.',
                  )}
                </li>
              </ul>

              <h2>{t('4. คุกกี้และเทคโนโลยีติดตาม', '4. Cookies and Tracking Technologies')}</h2>
              <p>
                {t(
                  'เว็บไซต์นี้ใช้คุกกี้ที่จำเป็นต่อการทำงานพื้นฐานของเว็บไซต์เสมอ ส่วนคุกกี้เพื่อการวิเคราะห์ (Google Analytics) และการตลาด (Meta Pixel) จะเริ่มทำงานก็ต่อเมื่อท่านกดยอมรับในแบนเนอร์คุกกี้ที่แสดงเมื่อเข้าชมเว็บไซต์ครั้งแรกเท่านั้น ท่านสามารถเปลี่ยนการตั้งค่าความยินยอมได้ทุกเมื่อผ่านลิงก์ “ตั้งค่าคุกกี้” ที่ท้ายเว็บไซต์',
                  "This website always uses cookies essential to basic site functionality. Analytics cookies (Google Analytics) and marketing cookies (Meta Pixel) only activate after you click accept on the cookie banner shown on your first visit. You can change your consent choice anytime via the 'Cookie Settings' link in the site footer.",
                )}
              </p>

              <h2>{t('5. การเปิดเผยข้อมูลแก่บุคคลที่สาม', '5. Disclosure to Third Parties')}</h2>
              <p>
                {t(
                  'เราไม่ขายข้อมูลส่วนบุคคลของท่าน เราอาจเปิดเผยข้อมูลบางส่วนแก่ผู้ให้บริการที่จำเป็นต่อการดำเนินธุรกิจ ได้แก่ Google (Google Analytics) และ Meta Platforms (Meta Pixel) เฉพาะเมื่อท่านให้ความยินยอม รวมถึงผู้ให้บริการด้านเทคโนโลยีที่ช่วยเราดำเนินเว็บไซต์และระบบนัดหมาย',
                  'We do not sell your personal data. We may share limited data with service providers necessary to operate our business, including Google (Google Analytics) and Meta Platforms (Meta Pixel), only with your consent, as well as technology providers that help us run our website and booking system.',
                )}
              </p>

              <h2>{t('6. ระยะเวลาการเก็บรักษาข้อมูล', '6. Data Retention Period')}</h2>
              <p>
                {t(
                  'เราเก็บรักษาข้อมูลคำขอนัดหมายของท่านไว้เป็นระยะเวลา [ระบุระยะเวลา เช่น 24 เดือน] นับจากวันที่ท่านติดต่อเรา หรือจนกว่าท่านจะขอให้ลบข้อมูล เว้นแต่กฎหมายกำหนดให้เก็บนานกว่านั้น',
                  'We retain your appointment request data for [specify period, e.g. 24 months] from the date of contact, or until you request deletion, unless a longer period is required by law.',
                )}
              </p>

              <h2>{t('7. สิทธิของเจ้าของข้อมูลส่วนบุคคล', '7. Your Rights as a Data Subject')}</h2>
              <p>{t('ภายใต้ PDPA ท่านมีสิทธิดังต่อไปนี้เกี่ยวกับข้อมูลส่วนบุคคลของท่าน:', 'Under the PDPA, you have the following rights regarding your personal data:')}</p>
              <ul>
                <li>{t('สิทธิขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล', 'The right to access and receive a copy of your personal data.')}</li>
                <li>{t('สิทธิขอแก้ไขข้อมูลให้ถูกต้อง', 'The right to correct inaccurate data.')}</li>
                <li>{t('สิทธิขอลบหรือทำลายข้อมูล', 'The right to request deletion or destruction of data.')}</li>
                <li>{t('สิทธิขอถอนความยินยอมเมื่อใดก็ได้', 'The right to withdraw consent at any time.')}</li>
                <li>{t('สิทธิคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล', 'The right to object to the collection, use, or disclosure of your data.')}</li>
                <li>
                  {t(
                    'สิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) หากเห็นว่าเราไม่ปฏิบัติตามกฎหมาย',
                    'The right to lodge a complaint with the Office of the Personal Data Protection Committee (PDPC) if you believe we have not complied with the law.',
                  )}
                </li>
              </ul>
              <p>
                {t(
                  'ท่านสามารถใช้สิทธิเหล่านี้ได้โดยติดต่อเราตามช่องทางในหัวข้อ “ติดต่อเรา” ด้านล่าง',
                  "You may exercise these rights by contacting us through the channels listed under 'Contact Us' below.",
                )}
              </p>

              <h2>{t('8. มาตรการรักษาความปลอดภัย', '8. Security Measures')}</h2>
              <p>
                {t(
                  'เรามีมาตรการทางเทคนิคและการบริหารจัดการที่เหมาะสมเพื่อป้องกันการเข้าถึง เปลี่ยนแปลง หรือเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต',
                  'We maintain appropriate technical and organizational measures to prevent unauthorized access, alteration, or disclosure of your personal data.',
                )}
              </p>

              <h2>{t('9. การเปลี่ยนแปลงนโยบาย', '9. Changes to This Policy')}</h2>
              <p>
                {t(
                  'เราอาจปรับปรุงนโยบายฉบับนี้เป็นครั้งคราว โดยจะแจ้งวันที่ปรับปรุงล่าสุดไว้ด้านบนของหน้านี้',
                  'We may update this policy from time to time. The most recent update date will be shown at the top of this page.',
                )}
              </p>

              <h2>{t('10. ติดต่อเรา', '10. Contact Us')}</h2>
              <p>
                {t(
                  'หากท่านมีคำถามเกี่ยวกับนโยบายฉบับนี้ หรือต้องการใช้สิทธิของท่าน กรุณาติดต่อ [อีเมลติดต่อ] หรือโทร [เบอร์โทรติดต่อ]',
                  'If you have questions about this policy or wish to exercise your rights, please contact [contact email] or call [contact phone].',
                )}
              </p>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter branches={homeData.branches} footer={homeData.footer} locale={locale} />

      <Script src="/js/site-runtime.js" strategy="afterInteractive" />
    </>
  )
}
