(function(){
  'use strict';

  const triggerSelector = '#vipConciergeBtn, .vip-trigger, .booking-trigger, [data-vip-modal], a[href="#vipModalOverlay"], .header-cta > a, .header-cta > button:not(.burger):not(#burgerBtn)';
  const bookingText = /จอง|นัดหมาย|book|appointment|consult|enquire|consideration/i;
  const scriptUrl = document.currentScript && document.currentScript.src;
  const emblemUrl = scriptUrl ? new URL('../assets/images/brand/emblem.png', scriptUrl).href : 'assets/images/brand/emblem.png';
  // Branches come from Payload (injected as window.__PHIVARA_DATA__ by each
  // page — see src/lib/homeData.ts). site-shell.js / window.PhivaraSiteShell
  // is no longer loaded on Next.js pages.
  const branches = ((window.__PHIVARA_DATA__ && window.__PHIVARA_DATA__.branches) || []).map((branch) => [
    branch.formValue,
    `PHIVARA ${branch.nameTh}`,
    `PHIVARA ${branch.nameEn}`
  ]);

  function isBookingControl(element){
    if(!element || !element.matches('a, button')) return false;
    if(element.matches('.branch-modal__booking')) return false;
    if(element.matches(triggerSelector)) return true;
    if(element.matches('button[type="submit"], input[type="submit"]')) return false;
    return bookingText.test(element.textContent || '');
  }

  function findTrigger(target){
    const explicit = target.closest(triggerSelector);
    if(explicit) return explicit;
    const control = target.closest('a, button');
    return isBookingControl(control) ? control : null;
  }

  function modalMarkup(){
    const branchOptions = branches.map(([value,th,en]) =>
      `<option value="${value}" data-th="${th}" data-en="${en}">${th}</option>`
    ).join('');

    return `<div class="vip-modal-overlay" id="vipModalOverlay" aria-hidden="true">
      <div class="vip-modal" role="dialog" aria-modal="true" aria-labelledby="vipModalTitle" tabindex="-1">
        <button type="button" class="vip-modal-close" id="vipModalClose" aria-label="Close">&times;</button>
        <div class="vip-modal-brand">
          <img src="${emblemUrl}" alt="" aria-hidden="true">
          <div class="vip-modal-eyebrow">PHIVARA VIP CONCIERGE</div>
          <p class="vip-brand-quote" data-th="การดูแลที่ออกแบบ รอบตัวคุณ" data-en="Care designed around you.">การดูแลที่ออกแบบ<br>รอบตัวคุณ</p>
          <div class="vip-concierge-points">
            <p data-th="ผู้ประสานงานส่วนตัวตลอดการนัดหมาย" data-en="A dedicated coordinator throughout your appointment"><span aria-hidden="true">01</span>ผู้ประสานงานส่วนตัวตลอดการนัดหมาย</p>
            <p data-th="เลือกเวลาและสาขาที่เหมาะกับคุณ" data-en="Choose a time and location that suits you"><span aria-hidden="true">02</span>เลือกเวลาและสาขาที่เหมาะกับคุณ</p>
            <p data-th="ข้อมูลของคุณได้รับการดูแลอย่างเป็นส่วนตัว" data-en="Your information is handled with discretion"><span aria-hidden="true">03</span>ข้อมูลของคุณได้รับการดูแลอย่างเป็นส่วนตัว</p>
          </div>
        </div>
        <div class="vip-modal-content">
          <div class="vip-modal-head">
            <div class="vip-modal-kicker">PRIVATE APPOINTMENT</div>
            <h3 id="vipModalTitle" data-th="นัดหมายปรึกษาเฉพาะบุคคล" data-en="Book a Private Consultation">นัดหมายปรึกษาเฉพาะบุคคล</h3>
            <p data-th="ฝากข้อมูลไว้ แล้วทีม Concierge จะติดต่อกลับเพื่อจัดเวลาที่เหมาะกับคุณ" data-en="Share your details and our Concierge team will arrange a time that suits you.">ฝากข้อมูลไว้ แล้วทีม Concierge จะติดต่อกลับเพื่อจัดเวลาที่เหมาะกับคุณ</p>
          </div>
          <form class="vip-form" id="vipForm">
            <div class="vip-form-grid">
              <label>
                <span data-th="ชื่อ - นามสกุล" data-en="Full Name">ชื่อ - นามสกุล</span>
                <input type="text" name="name" autocomplete="name" placeholder="คุณสมชาย ใจดี" data-placeholder-th="คุณสมชาย ใจดี" data-placeholder-en="Your full name" required>
              </label>
              <label>
                <span data-th="เบอร์โทรศัพท์" data-en="Phone Number">เบอร์โทรศัพท์</span>
                <input type="tel" name="phone" autocomplete="tel" inputmode="tel" maxlength="20" aria-describedby="vipPhoneError" placeholder="081-XXX-XXXX" data-placeholder-th="081-XXX-XXXX" data-placeholder-en="Your phone number" required>
                <small class="vip-field-error" id="vipPhoneError" data-th="กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66" data-en="Enter a 9–10 digit phone number or use the +66 format" hidden>กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66</small>
              </label>
              <label class="vip-field-wide">
                <span data-th="สาขาที่สะดวก" data-en="Preferred Location">สาขาที่สะดวก</span>
                <select name="branch" required>
                  <option value="" data-th="เลือกสาขาที่สะดวก" data-en="Select a location">เลือกสาขาที่สะดวก</option>
                  ${branchOptions}
                </select>
              </label>
              <label class="vip-field-wide">
                <span data-th="บริการที่สนใจ" data-en="Service of Interest">บริการที่สนใจ</span>
                <select name="service" required>
                  <option value="" data-th="เลือกบริการที่สนใจ" data-en="Select a service">เลือกบริการที่สนใจ</option>
                  <option value="plastic-surgery" data-th="Plastic Surgery (ศัลยกรรมตกแต่ง)" data-en="Plastic Surgery">Plastic Surgery (ศัลยกรรมตกแต่ง)</option>
                  <option value="longevity" data-th="Anti-Aging &amp; Longevity (เวชศาสตร์อายุยืนยาว)" data-en="Anti-Aging &amp; Longevity">Anti-Aging &amp; Longevity (เวชศาสตร์อายุยืนยาว)</option>
                  <option value="dermatology" data-th="Dermatology (ผิวหนัง)" data-en="Dermatology">Dermatology (ผิวหนัง)</option>
                  <option value="wellness" data-th="Aesthetic Wellness (สุขภาวะเชิงความงาม)" data-en="Aesthetic Wellness">Aesthetic Wellness (สุขภาวะเชิงความงาม)</option>
                  <option value="membership" data-th="สมาชิก PHIVARA AUM" data-en="PHIVARA AUM Membership">สมาชิก PHIVARA AUM</option>
                </select>
              </label>
              <label class="vip-field-wide">
                <span data-th="ข้อความเพิ่มเติม / เวลาที่สะดวก" data-en="Notes / Preferred Time">ข้อความเพิ่มเติม / เวลาที่สะดวก</span>
                <textarea name="notes" rows="3" placeholder="ระบุเรื่องที่ต้องการปรึกษาหรือเวลาที่สะดวก" data-placeholder-th="ระบุเรื่องที่ต้องการปรึกษาหรือเวลาที่สะดวก" data-placeholder-en="Tell us what you would like to discuss or your preferred time" required></textarea>
              </label>
            </div>
            <p class="vip-form-note" data-th="ข้อมูลของคุณจะใช้เพื่อการติดต่อกลับและจัดการนัดหมายเท่านั้น" data-en="Your information will only be used to contact you and arrange this appointment.">ข้อมูลของคุณจะใช้เพื่อการติดต่อกลับและจัดการนัดหมายเท่านั้น</p>
            <p class="vip-form-error" id="vipFormError" hidden data-th="ขออภัย ระบบไม่สามารถส่งคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือโทรติดต่อเราโดยตรง" data-en="Sorry, we couldn't submit your request right now. Please try again or call us directly.">ขออภัย ระบบไม่สามารถส่งคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือโทรติดต่อเราโดยตรง</p>
            <button type="submit" class="btn-vip-submit">
              <span data-th="ส่งคำขอนัดหมาย" data-en="Request an Appointment">ส่งคำขอนัดหมาย</span>
              <svg viewBox="0 0 20 12" fill="none" aria-hidden="true"><path d="M1 6h17M13 1l5 5-5 5" stroke="currentColor" stroke-width="1.3"/></svg>
            </button>
          </form>
          <div class="vip-form-success" id="vipFormSuccess">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>
            <h3 data-th="ขอบคุณค่ะ" data-en="Thank You">ขอบคุณค่ะ</h3>
            <p data-th="ทีมงาน PHIVARA VIP Concierge จะติดต่อกลับโดยเร็วที่สุด" data-en="Our PHIVARA VIP Concierge team will be in touch with you shortly.">ทีมงาน PHIVARA VIP Concierge จะติดต่อกลับโดยเร็วที่สุด</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  function init(){
    const knownTriggers = [...document.querySelectorAll('a, button')].filter(isBookingControl);
    if(!knownTriggers.length) return;

    document.querySelectorAll('#vipModalOverlay, #bookingModal').forEach(modal => modal.remove());
    document.body.insertAdjacentHTML('beforeend', modalMarkup());

    const overlay = document.getElementById('vipModalOverlay');
    const dialog = overlay.querySelector('.vip-modal');
    const form = document.getElementById('vipForm');
    const success = document.getElementById('vipFormSuccess');
    const formError = document.getElementById('vipFormError');
    const submitButton = form.querySelector('.btn-vip-submit');
    const notes = form.elements.notes;
    const service = form.elements.service;
    const phone = form.elements.phone;
    const phoneError = document.getElementById('vipPhoneError');
    let lastFocusedElement = null;

    function currentLang(){
      return document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'th';
    }

    function translateModal(){
      const lang = currentLang();
      overlay.querySelectorAll('[data-th]').forEach(element => {
        const translation = element.getAttribute('data-' + lang);
        if(translation !== null) element.childNodes.forEach(node => {
          if(node.nodeType === Node.TEXT_NODE) node.remove();
        });
        if(translation !== null){
          const marker = element.querySelector(':scope > span[aria-hidden="true"]');
          if(marker) marker.insertAdjacentText('afterend', translation);
          else element.textContent = translation;
        }
      });
      overlay.querySelectorAll('[data-placeholder-th]').forEach(element => {
        element.placeholder = element.getAttribute('data-placeholder-' + lang) || '';
      });
    }

    function triggerContext(trigger){
      const lang = currentLang();
      const doctor = trigger.dataset.docName;
      const program = trigger.dataset.program || trigger.querySelector('strong')?.textContent.trim();
      if(doctor) return lang === 'en' ? `Preferred doctor: ${doctor}` : `แพทย์ที่ต้องการปรึกษา: ${doctor}`;
      if(program) return lang === 'en' ? `Program of interest: ${program}` : `โปรแกรมที่สนใจ: ${program}`;
      return '';
    }

    function validatePhone(showMessage){
      const compactPhone = phone.value.replace(/[\s().-]/g,'');
      const valid = /^0\d{8,9}$/.test(compactPhone) || /^\+66\d{8,9}$/.test(compactPhone);
      const message = valid ? '' : (currentLang() === 'en'
        ? 'Enter a 9–10 digit phone number or use the +66 format'
        : 'กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66');
      phone.setCustomValidity(message);
      phone.setAttribute('aria-invalid', String(!valid));
      phoneError.hidden = valid || !showMessage;
      return valid;
    }

    function openModal(trigger){
      lastFocusedElement = trigger;
      form.style.display = '';
      success.classList.remove('show');
      formError.hidden = true;
      const context = triggerContext(trigger);
      notes.value = context;
      if(trigger.dataset.branch && [...form.elements.branch.options].some(option => option.value === trigger.dataset.branch)){
        form.elements.branch.value = trigger.dataset.branch;
      }
      if(trigger.dataset.service && [...service.options].some(option => option.value === trigger.dataset.service)){
        service.value = trigger.dataset.service;
      }
      translateModal();
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => form.elements.name.focus(),80);
    }

    function closeModal(){
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      if(lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
      setTimeout(() => {
        form.reset();
        form.style.display = '';
        success.classList.remove('show');
      },400);
    }

    document.addEventListener('click', event => {
      if(event.target.closest('#vipModalClose')){
        event.preventDefault();
        closeModal();
        return;
      }
      if(event.target === overlay){
        closeModal();
        return;
      }
      const trigger = findTrigger(event.target);
      if(!trigger || overlay.contains(trigger)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openModal(trigger);
    },true);

    document.addEventListener('click', event => {
      if(event.target.closest('#langToggle,[data-val]')) setTimeout(translateModal,0);
    });

    document.addEventListener('keydown', event => {
      if(!overlay.classList.contains('open')) return;
      if(event.key === 'Escape'){
        event.preventDefault();
        closeModal();
        return;
      }
      if(event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll('button,input,select,textarea,a[href]')].filter(element => !element.disabled);
      if(!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if(event.shiftKey && document.activeElement === first){ event.preventDefault(); last.focus(); }
      else if(!event.shiftKey && document.activeElement === last){ event.preventDefault(); first.focus(); }
    });

    phone.addEventListener('blur',() => {
      if(phone.value) validatePhone(true);
    });
    phone.addEventListener('input',() => {
      if(phone.getAttribute('aria-invalid') === 'true') validatePhone(true);
      else phone.setCustomValidity('');
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if(!validatePhone(true)){
        phone.reportValidity();
        phone.focus();
        return;
      }

      formError.hidden = true;
      submitButton.disabled = true;

      // Submits to our own /api/leads route (backed by the `leads` Payload
      // collection) rather than showing a fake success state — every
      // ".booking-trigger"/".vip-trigger" click site-wide funnels through
      // this one form, so this is the single place that needed fixing.
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.elements.name.value.trim(),
            phone: phone.value.trim(),
            branch: form.elements.branch.value,
            service: service.value,
            notes: notes.value.trim(),
            sourcePath: window.location.pathname
          })
        });

        if(!response.ok) throw new Error('Lead submission failed');

        // Fires GA4's generate_lead / Meta Pixel's Lead event, defined in
        // consent-banner.js. Safe no-op if the visitor never accepted the
        // PDPA consent banner (or no GA4/Pixel id is configured yet) —
        // phivaraTrackLead only exists once analytics was actually loaded.
        window.phivaraTrackLead?.();

        form.style.display = 'none';
        success.classList.add('show');
        success.querySelector('h3').focus?.();
      } catch(error) {
        formError.hidden = false;
      } finally {
        submitButton.disabled = false;
      }
    });

    translateModal();
  }

  if(document.readyState === 'complete') init();
  else window.addEventListener('load',init,{once:true});
})();
