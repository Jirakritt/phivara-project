import Script from 'next/script'

import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { getHomeData } from '@/lib/homeData'

// Rebuilt from phivara-design-html/index.html. The hero banner (eyebrow/
// headline/lead/CTA + rotating background images) now comes from the
// `home-hero` Payload Global — see src/lib/homeData.ts's getHomeHero() and
// cms/globals/HomeHero.ts. Everything else below it (intro/pillars,
// membership teaser) is still static brand copy hardcoded here like the
// original, not modeled in Payload. The sections main.js used to fill from
// hardcoded const arrays (expertise/program cards, branch rail, specialists
// carousel, journal grid, and now the hero background slideshow too) are
// driven by real CMS content: this component fetches it from Payload and
// injects it as `window.__PHIVARA_DATA__` for the (lightly patched)
// public/js/main.js to render, so the original interactions/carousels/
// animations keep working unchanged.
export default async function HomePage() {
  const data = await getHomeData()
  const dataScript = `window.__PHIVARA_DATA__ = ${JSON.stringify(data).replace(/</g, '\\u003c')};`

  return (
    <>
      <link rel="stylesheet" href="/css/journal-card.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <Script id="phivara-home-data" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: dataScript }} />

      <div id="preloader">
        <svg viewBox="0 0 100 100">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <SiteHeader page="home" />

      {/* ================= HERO ================= */}
      <section className="hero" id="top">
        <div className="bg-stack" id="heroBg"></div>
        <div className="scrim"></div>
        <div className="wrap">
          <div className="content" id="heroContent">
            <div className="eyebrow" data-th={data.hero.eyebrowTh} data-en={data.hero.eyebrowEn}>{data.hero.eyebrowTh}</div>
            <h1
              id="heroHeadline"
              data-th={data.hero.headlineTh}
              data-en={data.hero.headlineEn}
            ></h1>
            <p
              className="sub"
              data-th={data.hero.leadTh}
              data-en={data.hero.leadEn}
            >
              {data.hero.leadTh}
            </p>
            <div className="cta-row">
              <a href="#contact" className="btn btn-outline vip-trigger" data-th={data.hero.ctaLabelTh} data-en={data.hero.ctaLabelEn}>
                {data.hero.ctaLabelTh}
              </a>
            </div>
          </div>
        </div>
        <div className="scroll-cue">
          <span data-th="เลื่อนลง" data-en="Scroll">เลื่อนลง</span>
          <span className="line"></span>
        </div>
      </section>

      {/* ================= BRAND INTRO + PILLARS ================= */}
      <section className="intro" id="about">
        <div className="watermark">Beaugevity</div>
        <div className="wrap">
          <div className="grid">
            <div className="intro-diagram reveal">
              <div className="diagram-frame">
                <svg className="diagram-ring" viewBox="0 0 320 320" aria-hidden="true">
                  <circle className="ring-bg" cx="160" cy="160" r="132" />
                  <circle className="ring-seg seg-tl" cx="160" cy="160" r="132" transform="rotate(180 160 160)" />
                  <circle className="ring-seg seg-tr" cx="160" cy="160" r="132" transform="rotate(270 160 160)" />
                  <circle className="ring-seg seg-bl" cx="160" cy="160" r="132" transform="rotate(90 160 160)" />
                  <circle className="ring-seg seg-br" cx="160" cy="160" r="132" transform="rotate(0 160 160)" />
                </svg>
                <div className="diagram-core">
                  <img className="diagram-core-logo" src="/logo/phivara_logo.jpg" alt="PHIVARA" />
                </div>
                <div className="diagram-tags stagger">
                  <div className="diagram-tag tag-tl s-item">
                    <span className="tag-dot"></span>
                    <span data-th="เวชศาสตร์อายุยืนยาว" data-en="Anti-Aging &amp; Longevity">เวชศาสตร์อายุยืนยาว</span>
                  </div>
                  <div className="diagram-tag tag-tr s-item">
                    <span className="tag-dot"></span>
                    <span data-th="ผิวหนัง" data-en="Dermatology">ผิวหนัง</span>
                  </div>
                  <div className="diagram-tag tag-bl s-item">
                    <span className="tag-dot"></span>
                    <span data-th="สุขภาวะเชิงความงาม" data-en="Aesthetic Wellness">สุขภาวะเชิงความงาม</span>
                  </div>
                  <div className="diagram-tag tag-br s-item">
                    <span className="tag-dot"></span>
                    <span data-th="ศัลยกรรมตกแต่ง" data-en="Plastic Surgery">ศัลยกรรมตกแต่ง</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal">
              <div className="eyebrow" data-th="WHY PHIVARA EXISTS" data-en="WHY PHIVARA EXISTS">WHY PHIVARA EXISTS</div>
              <blockquote
                data-th="&ldquo;ความงามที่แท้จริง เริ่มต้นจากสุขภาพที่ดีจากภายใน ไม่ใช่การไล่ตามความเยาว์วัย&rdquo;"
                data-en="&ldquo;True beauty begins with good health from within — not the pursuit of youth.&rdquo;"
              >
                &ldquo;ความงามที่แท้จริง เริ่มต้นจากสุขภาพที่ดีจากภายใน ไม่ใช่การไล่ตามความเยาว์วัย&rdquo;
              </blockquote>
              <p
                className="body"
                data-th="Beaugevity คือแก่นความเชื่อของ PHIVARA ที่หลอมรวมศาสตร์ความงามและเวชศาสตร์อายุยืนยาวเข้าไว้ด้วยกันบนพื้นฐานทางการแพทย์ ทุกการดูแลเริ่มต้นจากการตรวจวินิจฉัยและประเมินสุขภาพเชิงลึกโดยแพทย์เฉพาะทาง ก่อนออกแบบแผนการดูแลเฉพาะบุคคลที่ผสานศัลยกรรมตกแต่ง ผิวหนัง และเวชศาสตร์ชะลอวัยไว้ในทีมเดียว"
                data-en="Beaugevity is the core belief behind PHIVARA — the fusion of beauty and longevity medicine, grounded in clinical practice. Every treatment begins with in-depth diagnostics and health assessment by specialist physicians, followed by a personalized care plan that integrates plastic surgery, dermatology, and longevity medicine under one team."
              >
                Beaugevity คือแก่นความเชื่อของ PHIVARA ที่หลอมรวมศาสตร์ความงามและเวชศาสตร์อายุยืนยาวเข้าไว้ด้วยกันบนพื้นฐานทางการแพทย์
                ทุกการดูแลเริ่มต้นจากการตรวจวินิจฉัยและประเมินสุขภาพเชิงลึกโดยแพทย์เฉพาะทาง
                ก่อนออกแบบแผนการดูแลเฉพาะบุคคลที่ผสานศัลยกรรมตกแต่ง ผิวหนัง และเวชศาสตร์ชะลอวัยไว้ในทีมเดียว
              </p>
              <p
                className="body"
                data-th="ดำเนินการภายใต้มาตรฐานความปลอดภัยระดับโรงพยาบาล และทีมสหสาขาวิชาชีพที่ติดตามผลลัพธ์อย่างต่อเนื่อง เพื่อผลลัพธ์ที่ปลอดภัย แม่นยำ และยั่งยืน"
                data-en="Delivered under hospital-grade safety standards, with a multidisciplinary team monitoring outcomes at every step — for results that are safe, precise, and built to last."
              >
                ดำเนินการภายใต้มาตรฐานความปลอดภัยระดับโรงพยาบาล และทีมสหสาขาวิชาชีพที่ติดตามผลลัพธ์อย่างต่อเนื่อง เพื่อผลลัพธ์ที่ปลอดภัย แม่นยำ และยั่งยืน
              </p>
              <div className="sig">— The Art of Beaugevity</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EXPERTISE ================= */}
      <section className="expertise" id="expertise">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow center" data-th="INTEGRATED EXPERTISE" data-en="INTEGRATED EXPERTISE">INTEGRATED EXPERTISE</div>
            <h2 data-th="หนึ่งทีม หนึ่งเส้นทาง เพื่อคุณโดยเฉพาะ" data-en="One Team, One Journey — Built Around You">
              หนึ่งทีม หนึ่งเส้นทาง เพื่อคุณโดยเฉพาะ
            </h2>
          </div>
          <div className="exp-tabs reveal">
            <div className="exp-tab-nav" id="expTabNav" role="tablist"></div>
            <div className="exp-tab-panels" id="expTabPanels"></div>
          </div>
        </div>
      </section>

      {/* ================= BRANCH HIGHLIGHT ================= */}
      <section className="flagship" id="flagship">
        <div className="wrap flagship-heading">
          <div>
            <div className="eyebrow" data-th="PHIVARA DESTINATIONS" data-en="PHIVARA DESTINATIONS">PHIVARA DESTINATIONS</div>
            <h2 data-th="พื้นที่ดูแลที่ออกแบบมาเพื่อทุกเส้นทางของคุณ" data-en="Distinctive spaces, designed around your journey">
              พื้นที่ดูแลที่ออกแบบมาเพื่อทุกเส้นทางของคุณ
            </h2>
          </div>
        </div>
        <div className="wrap flagship-stage">
          <div className="flagship-nav" id="flagshipRail" role="tablist" aria-label="PHIVARA branches"></div>
          <div className="flagship-slides" id="flagshipSlides"></div>
        </div>
      </section>

      {/* ================= SPECIALISTS ================= */}
      <section className="specialists" id="specialists">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow center" data-th="OUR SPECIALISTS" data-en="OUR SPECIALISTS">OUR SPECIALISTS</div>
            <h2 data-th="พบแพทย์และผู้เชี่ยวชาญของ PHIVARA" data-en="Meet Our Specialists">พบแพทย์และผู้เชี่ยวชาญของ PHIVARA</h2>
            <p
              data-th="ทุกท่านยึดหลักฐานเชิงประจักษ์ มีคุณวุฒิรับรอง และทุ่มเทให้กับเส้นทางของคุณเป็นการส่วนตัว"
              data-en="Evidence-based, credentialed, and personally invested in your journey."
            >
              ทุกท่านยึดหลักฐานเชิงประจักษ์ มีคุณวุฒิรับรอง และทุ่มเทให้กับเส้นทางของคุณเป็นการส่วนตัว
            </p>
            <a href="/doctor" className="arrow-link spec-all-link">
              <span data-th="ดูรายชื่อทีมแพทย์และผู้เชี่ยวชาญทั้งหมด" data-en="View All Medical Specialists">
                ดูรายชื่อทีมแพทย์และผู้เชี่ยวชาญทั้งหมด
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <div className="spec-carousel-wrapper">
            <button className="carousel-nav spec-nav spec-prev" id="specPrev" aria-label="Previous Specialists">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="spec-track-outer">
              <div className="spec-track" id="specTrack"></div>
            </div>
            <button className="carousel-nav spec-nav spec-next" id="specNext" aria-label="Next Specialists">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="spec-dots" id="specDots"></div>
        </div>
      </section>

      {/* ================= JOURNAL ================= */}
      <section className="journal" id="journal">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow center" data-th="THE JOURNAL" data-en="THE JOURNAL">THE JOURNAL</div>
            <h2 data-th="สาระความงามจากผู้เชี่ยวชาญ" data-en="Insights From Our Specialists">สาระความงามจากผู้เชี่ยวชาญ</h2>
          </div>
          <div className="journal-grid stagger" id="journalGrid"></div>
        </div>
      </section>

      {/* ================= AWARDS ================= */}
      <section className="awards">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="eyebrow center" data-th="AWARDS & RECOGNITION" data-en="AWARDS & RECOGNITION">AWARDS & RECOGNITION</div>
            <h2 data-th="ความไว้วางใจที่สั่งสมมาอย่างยาวนาน" data-en="A Legacy of Trust and Recognition">
              ความไว้วางใจที่สั่งสมมาอย่างยาวนาน
            </h2>
          </div>
          <div className="award-carousel reveal">
            <button className="carousel-nav award-nav prev" id="awardPrev" aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <div className="award-viewport">
              <div className="award-track" id="awardTrack"></div>
            </div>
            <button className="carousel-nav award-nav next" id="awardNext" aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <div className="award-dots" id="awardDots"></div>
        </div>
      </section>

      {/* ================= MEMBERSHIP ================= */}
      {/* Sourced from Payload's `membership` Global (hero + finalCta.buttonLabel)
          — same content that powers /membership — see getHomeData()/
          getMembershipTeaser() in src/lib/homeData.ts. */}
      <section className="membership" id="membership">
        <div className="mem-grid">
          <img className="ph-photo reveal" src={data.membershipTeaser.image} alt="PHIVARA AUM Membership" />
          <div className="mem-text reveal">
            <div className="eyebrow" data-th={data.membershipTeaser.eyebrowTh} data-en={data.membershipTeaser.eyebrowEn}>
              {data.membershipTeaser.eyebrowTh}
            </div>
            <h2 data-th={data.membershipTeaser.headlineTh} data-en={data.membershipTeaser.headlineEn}>
              {data.membershipTeaser.headlineTh}
            </h2>
            <p data-th={data.membershipTeaser.leadTh} data-en={data.membershipTeaser.leadEn}>
              {data.membershipTeaser.leadTh}
            </p>
            <div className="mem-cta-row">
              <a
                href="#vipModalOverlay"
                className="btn btn-outline vip-trigger"
                data-service="membership"
                data-th={data.membershipTeaser.ctaLabelTh}
                data-en={data.membershipTeaser.ctaLabelEn}
              >
                {data.membershipTeaser.ctaLabelTh}
              </a>
              <a href="/membership" className="arrow-link">
                <span data-th="ดูรายละเอียด" data-en="View Details">ดูรายละเอียด</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter branches={data.branches} />

      <Script src="/js/main.js" strategy="afterInteractive" />
      <Script src="/js/vip-modal.js" strategy="afterInteractive" />
    </>
  )
}
