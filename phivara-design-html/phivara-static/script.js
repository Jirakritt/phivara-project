(() => {
  const notes = [
  "เอกสารนี้วางทิศทาง Digital Marketing ตั้งแต่ Soft Launch วันที่ 10 กันยายน 2569 เพื่อเริ่มสะสมฐานลูกค้าออนไลน์ ไปจนถึง Grand Opening ต้นปี 2570 และช่วงขยายผลหลังเปิดตัว",
  "Phase 1 เริ่ม Soft Launch วันที่ 10 กันยายน 2569 เพื่อสร้าง Organic Core Engine และสะสมฐานลูกค้าออนไลน์ ส่วน Phase 2 เปิด Grand Opening ต้นปี 2570 พร้อม Integrated Growth Engine ครอบคลุม Paid Media, SEO/AEO, CRM และ KOL/Earned Media",
  "Phase 1 วาง Website, LINE OA, CRM Tags และ Tracking เป็น Core System พร้อมใช้ Facebook, Instagram และ TikTok สะสม Audience, Engagement และ First-party Signals เข้ามาใน Owned Hub เดียวกัน",
  "Phase 1 คือช่วง Soft Launch ตั้งแต่กรกฎาคมถึงธันวาคม 2569 โดยเร่งสะสมฐานลูกค้าออนไลน์ผ่าน Organic Demand, Website, LINE OA, Tracking และ CRM",
  "Section แรกของ Phase 1 วางบทบาทของ Organic Social และ Website ให้ทำงานเป็นเส้นทางเดียวกัน",
  "Facebook เน้น Trust, Instagram เน้น Premium Perception และ TikTok เน้น Discovery ผ่าน Short-form Education",
  "Website คือ Credibility Hub ที่ต้องพิสูจน์มาตรฐาน ทำให้ Booking จบได้ภายในไม่เกินสามขั้นตอน และวางโครงสร้าง SEO/AEO ไปพร้อมกัน",
  "Section ที่สองของ Phase 1 กำหนดแกนข้อความ สัดส่วนเนื้อหา และระบบผลิต Content ที่สร้าง Trust ก่อน Demand",
  "แนะนำสัดส่วน Content เป็น Doctor Post 30%, Education Product 30%, Campaign Promotion 20% และ Content Lifestyle 20% เพื่อให้น้ำหนักกับ Authority และ Education รวมกัน 60%",
  "Phase 1 ใช้ Organic Learning Loop เพื่อเผยแพร่ วัดผล เรียนรู้ และปรับ Content อย่างต่อเนื่อง โดยดู Reach, Engagement, Save, Share และ Chat Intent พร้อม Governance ทางการแพทย์และกฎหมาย",
  "ตัวอย่าง Calendar หนึ่งเดือนมี 20 Contents แบ่งเป็น Campaign 4, Doctor 6, Education 6 และ Lifestyle 4 ชิ้น ตรงกับสัดส่วน 20%, 30%, 30% และ 20%",
  "Phase 2 เริ่มต้นด้วย Grand Opening ช่วงต้นปี 2570 พร้อมซื้อ Ads อย่างเต็มระบบ เมื่อ Organic Winner, Tracking, CRM และ Operations จาก Phase 1 พร้อมสำหรับการขยายผล",
  "Section แรกของ Phase 2 อธิบาย Growth Action Plan และเงื่อนไขที่ต้องผ่านก่อนเปิดเครื่องมือขยายผลแต่ละประเภท",
  "Phase 2 มี Action Plan ราย Channel ที่เชื่อมกัน: SEO/AEO สร้าง Authority, Meta Ads สร้าง Demand และ Retarget, Google Search Ads จับ High-intent Demand, LINE Ads เพิ่มฐาน Owned Audience, TikTok Ads ทดสอบการเข้าถึงใหม่, KOL/Earned Media เพิ่ม Third-party Credibility และ CRM เปลี่ยนการนัดหมายครั้งแรกเป็นความสัมพันธ์ระยะยาว",
  "Section ที่สองของ Phase 2 เปลี่ยน Search Signal และคำถามจริงของลูกค้าให้เป็น SEO/AEO Content ที่สร้าง Authority",
  "SEO สร้าง Organic Visibility, AEO ทำให้ AI เข้าใจและอ้างอิง PHIVARA ส่วน Google Search Ads จับ High-intent Demand ได้ทันที โดย Phase 1 วาง Core Pages, Landing Pages, Tracking และ Schema ก่อนใช้ Search Terms กับ Conversion Data ขยายผลใน Phase 2",
  "Section ที่สามของ Phase 2 ใช้ Paid Media ขยาย Organic Winner จับ Existing Demand และพาคนเข้าสู่การนัดหมายที่วัดผลได้",
  "เลือก Channel ตาม Objective: Awareness ใช้ Facebook, Instagram และ KOL; Consideration เชื่อม Meta, Google Search และ Website; Conversion ใช้ Search, Retargeting และ LINE; Retention ใช้ LINE, CRM และ Retargeting",
  "Google Ads มีหน้าที่จับ Existing Demand จากคนที่กำลังค้นหา โดยเริ่มจาก Search Campaign ที่แยกตาม Intent ส่งเข้าหน้า Program ที่ตรงคำค้น และใช้ Booked Consultation เป็น Primary Conversion",
  "Facebook Ads มีหน้าที่สร้าง Demand และพาคนลง Funnel ผ่าน Prospecting, Engagement, High-intent Retargeting และ Customer Expansion โดยแยก Audience และ Exclusion ให้ชัดเจน",
  "ข้อเสนอคือใช้ Phase 1 ตั้งแต่ Soft Launch 10 กันยายน 2569 เพื่อสะสมฐานลูกค้าออนไลน์และพิสูจน์ Content จากนั้นเปิด Grand Opening ต้นปี 2570 พร้อมซื้อ Ads อย่างเต็มระบบ โดยใช้ Tracking, CRM และ Organic Signal จาก Phase 1 เป็นฐาน",
  "เป้าหมายสุดท้ายคือสร้าง Category of One ที่ลูกค้าเชื่อถือ นัดหมายได้ง่าย และกลับมาดูแลต่อเนื่องกับ PHIVARA"
];
  const slides = [...document.querySelectorAll(".slide")];
  const progress = document.querySelector(".progress span");
  const counter = document.querySelector(".counter");
  const buttons = {
    overview: document.querySelector('[aria-label="เปิดภาพรวมสไลด์"]'),
    notes: document.querySelector('[aria-label="เปิด Presenter Notes"]'),
    fullscreen: document.querySelector('[aria-label="แสดงเต็มหน้าจอ"]'),
    previous: document.querySelector('[aria-label="สไลด์ก่อนหน้า"]'),
    next: document.querySelector('[aria-label="สไลด์ถัดไป"]')
  };
  let current = Math.max(0, Math.min(slides.length - 1, Number(location.hash.match(/slide-(\d+)/)?.[1] || 1) - 1));
  let touchStart = null;

  function pad(value) { return String(value).padStart(2, "0"); }
  function slideTitle(slide) {
    return slide.querySelector("h1, h2")?.textContent?.replace(/\s+/g, " ").trim() || "PHIVARA";
  }
  function update(index, updateHash = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
      slide.setAttribute("aria-hidden", String(i !== current));
    });
    if (progress) progress.style.width = ((current + 1) / slides.length * 100) + "%";
    if (counter) counter.textContent = pad(current + 1) + " / " + pad(slides.length);
    if (buttons.previous) buttons.previous.disabled = current === 0;
    if (buttons.next) buttons.next.disabled = current === slides.length - 1;
    if (updateHash) history.replaceState(null, "", "#slide-" + (current + 1));
  }
  function closeOverlay() { document.querySelector(".static-overlay")?.remove(); }
  function showOverview() {
    closeOverlay();
    const overlay = document.createElement("div");
    overlay.className = "overlay static-overlay";
    overlay.innerHTML = '<div class="overview-panel"><header><div><span>SLIDE OVERVIEW</span><h2>Choose a Slide</h2></div><button class="close-overlay">ปิด ×</button></header><div class="overview-grid"></div></div>';
    const grid = overlay.querySelector(".overview-grid");
    slides.forEach((slide, i) => {
      const button = document.createElement("button");
      if (i === current) button.className = "current";
      button.innerHTML = "<span>" + pad(i + 1) + "</span><b>" + slideTitle(slide) + "</b><small>" + (slide.querySelector(".slide-chrome span")?.textContent || "PHIVARA") + "</small>";
      button.addEventListener("click", () => { update(i); closeOverlay(); });
      grid.appendChild(button);
    });
    overlay.querySelector(".close-overlay").addEventListener("click", closeOverlay);
    overlay.addEventListener("click", event => { if (event.target === overlay) closeOverlay(); });
    document.body.appendChild(overlay);
  }
  function showNotes() {
    closeOverlay();
    const overlay = document.createElement("div");
    overlay.className = "overlay static-overlay";
    overlay.innerHTML = '<div class="notes-panel"><span>PRESENTER NOTES · SLIDE ' + pad(current + 1) + '</span><h2>' + slideTitle(slides[current]) + '</h2><p></p><div><button class="close-overlay">ปิด</button><button class="next-note">สไลด์ถัดไป →</button></div></div>';
    overlay.querySelector("p").textContent = notes[current] || "";
    overlay.querySelector(".close-overlay").addEventListener("click", closeOverlay);
    overlay.querySelector(".next-note").addEventListener("click", () => { closeOverlay(); update(current + 1); });
    overlay.addEventListener("click", event => { if (event.target === overlay) closeOverlay(); });
    document.body.appendChild(overlay);
  }

  buttons.previous?.addEventListener("click", () => update(current - 1));
  buttons.next?.addEventListener("click", () => update(current + 1));
  buttons.overview?.addEventListener("click", showOverview);
  buttons.notes?.addEventListener("click", showNotes);
  buttons.fullscreen?.addEventListener("click", () => document.documentElement.requestFullscreen?.());
  addEventListener("keydown", event => {
    if (document.querySelector(".static-overlay")) {
      if (event.key === "Escape") closeOverlay();
      return;
    }
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); update(current + 1); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); update(current - 1); }
    if (event.key === "Home") update(0);
    if (event.key === "End") update(slides.length - 1);
    if (event.key.toLowerCase() === "o") showOverview();
    if (event.key.toLowerCase() === "n") showNotes();
    if (event.key.toLowerCase() === "f") document.documentElement.requestFullscreen?.();
  });
  addEventListener("hashchange", () => update(Number(location.hash.match(/slide-(\d+)/)?.[1] || 1) - 1, false));
  const stage = document.querySelector(".stage-wrap");
  stage?.addEventListener("touchstart", event => { touchStart = event.touches[0].clientX; }, { passive: true });
  stage?.addEventListener("touchend", event => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 55) update(current + (delta < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  update(current);
})();
