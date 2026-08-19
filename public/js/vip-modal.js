(function(){
  'use strict';

  const triggerSelector = '#vipConciergeBtn, .vip-trigger, .booking-trigger, [data-vip-modal], a[href="#vipModalOverlay"], .header-cta > a, .header-cta > button:not(.burger):not(#burgerBtn)';
  const bookingText = /จอง|นัดหมาย|book|appointment|consult|enquire|consideration/i;
  const scriptUrl = document.currentScript && document.currentScript.src;
  const emblemUrl = scriptUrl ? new URL('../assets/images/brand/emblem.png', scriptUrl).href : 'assets/images/brand/emblem.png';

  // Strings come from window.__PHIVARA_VIP_MODAL__, injected server-side by
  // src/app/[locale]/layout.tsx using the same t()/UI_DICTIONARY every
  // other page uses — see that file's comment. This FALLBACK (Thai, the
  // site's default locale) only kicks in if the global is somehow missing
  // (e.g. this script loaded before the layout's inline script ran), so
  // the modal never renders with blank text.
  const FALLBACK_T = {
    brandQuote: 'การดูแลที่ออกแบบ รอบตัวคุณ',
    point1: 'ผู้ประสานงานส่วนตัวตลอดการนัดหมาย',
    point2: 'เลือกเวลาและสาขาที่เหมาะกับคุณ',
    point3: 'ข้อมูลของคุณได้รับการดูแลอย่างเป็นส่วนตัว',
    modalTitle: 'นัดหมายปรึกษาเฉพาะบุคคล',
    modalLead: 'ฝากข้อมูลไว้ แล้วทีม Concierge จะติดต่อกลับเพื่อจัดเวลาที่เหมาะกับคุณ',
    fieldName: 'ชื่อ - นามสกุล',
    namePlaceholder: 'คุณสมชาย ใจดี',
    fieldPhone: 'เบอร์โทรศัพท์',
    phonePlaceholder: '081-XXX-XXXX',
    phoneError: 'กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66',
    fieldBranch: 'สาขาที่สะดวก',
    selectBranchPlaceholder: 'เลือกสาขาที่สะดวก',
    fieldService: 'บริการที่สนใจ',
    selectServicePlaceholder: 'เลือกบริการที่สนใจ',
    servicePlasticSurgery: 'Plastic Surgery (ศัลยกรรมตกแต่ง)',
    serviceLongevity: 'Anti-Aging & Longevity (เวชศาสตร์อายุยืนยาว)',
    serviceDermatology: 'Dermatology (ผิวหนัง)',
    serviceWellness: 'Aesthetic Wellness (สุขภาวะเชิงความงาม)',
    serviceMembership: 'สมาชิก PHIVARA AUM',
    fieldNotes: 'ข้อความเพิ่มเติม / เวลาที่สะดวก',
    notesPlaceholder: 'ระบุเรื่องที่ต้องการปรึกษาหรือเวลาที่สะดวก',
    formNote: 'ข้อมูลของคุณจะใช้เพื่อการติดต่อกลับและจัดการนัดหมายเท่านั้น',
    formError: 'ขออภัย ระบบไม่สามารถส่งคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือโทรติดต่อเราโดยตรง',
    submitLabel: 'ส่งคำขอนัดหมาย',
    thankYouTitle: 'ขอบคุณค่ะ',
    thankYouBody: 'ทีมงาน PHIVARA VIP Concierge จะติดต่อกลับโดยเร็วที่สุด',
    doctorPrefix: 'แพทย์ที่ต้องการปรึกษา: ',
    programPrefix: 'โปรแกรมที่สนใจ: ',
  };
  const T = Object.assign({}, FALLBACK_T, (window.__PHIVARA_VIP_MODAL__ && window.__PHIVARA_VIP_MODAL__.t) || {});
  // Branches come from Payload (injected as window.__PHIVARA_DATA__ by each
  // page — see src/lib/homeData.ts). site-shell.js / window.PhivaraSiteShell
  // is no longer loaded on Next.js pages. branch.nameTh/nameEn already both
  // hold the SAME already-resolved-for-the-current-locale value (see
  // homeData.ts's file comment), so either one is already correct text for
  // any locale — no per-locale branching needed here.
  // "PHIVARA " is part of the CMS branch `name` field itself now (per team
  // decision) — not concatenated here.
  const branches = ((window.__PHIVARA_DATA__ && window.__PHIVARA_DATA__.branches) || []).map((branch) => [
    branch.formValue,
    branch.nameTh,
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
    const branchOptions = branches.map(([value,label]) =>
      `<option value="${value}">${label}</option>`
    ).join('');

    return `<div class="vip-modal-overlay" id="vipModalOverlay" aria-hidden="true">
      <div class="vip-modal" role="dialog" aria-modal="true" aria-labelledby="vipModalTitle" tabindex="-1">
        <button type="button" class="vip-modal-close" id="vipModalClose" aria-label="Close">&times;</button>
        <div class="vip-modal-brand">
          <img src="${emblemUrl}" alt="" aria-hidden="true">
          <div class="vip-modal-eyebrow">PHIVARA VIP CONCIERGE</div>
          <p class="vip-brand-quote">${T.brandQuote}</p>
          <div class="vip-concierge-points">
            <p><span aria-hidden="true">01</span>${T.point1}</p>
            <p><span aria-hidden="true">02</span>${T.point2}</p>
            <p><span aria-hidden="true">03</span>${T.point3}</p>
          </div>
        </div>
        <div class="vip-modal-content">
          <div class="vip-modal-head">
            <div class="vip-modal-kicker">PRIVATE APPOINTMENT</div>
            <h3 id="vipModalTitle">${T.modalTitle}</h3>
            <p>${T.modalLead}</p>
          </div>
          <form class="vip-form" id="vipForm">
            <div class="vip-form-grid">
              <label>
                <span>${T.fieldName}</span>
                <input type="text" name="name" autocomplete="name" placeholder="${T.namePlaceholder}" required>
              </label>
              <label>
                <span>${T.fieldPhone}</span>
                <input type="tel" name="phone" autocomplete="tel" inputmode="tel" maxlength="20" aria-describedby="vipPhoneError" placeholder="${T.phonePlaceholder}" required>
                <small class="vip-field-error" id="vipPhoneError" hidden>${T.phoneError}</small>
              </label>
              <label class="vip-field-wide">
                <span>${T.fieldBranch}</span>
                <select name="branch" required>
                  <option value="">${T.selectBranchPlaceholder}</option>
                  ${branchOptions}
                </select>
              </label>
              <label class="vip-field-wide">
                <span>${T.fieldService}</span>
                <select name="service" required>
                  <option value="">${T.selectServicePlaceholder}</option>
                  <option value="plastic-surgery">${T.servicePlasticSurgery}</option>
                  <option value="longevity">${T.serviceLongevity}</option>
                  <option value="dermatology">${T.serviceDermatology}</option>
                  <option value="wellness">${T.serviceWellness}</option>
                  <option value="membership">${T.serviceMembership}</option>
                </select>
              </label>
              <label class="vip-field-wide">
                <span>${T.fieldNotes}</span>
                <textarea name="notes" rows="3" placeholder="${T.notesPlaceholder}" required></textarea>
              </label>
            </div>
            <p class="vip-form-note">${T.formNote}</p>
            <p class="vip-form-error" id="vipFormError" hidden>${T.formError}</p>
            <button type="submit" class="btn-vip-submit">
              <span>${T.submitLabel}</span>
              <svg viewBox="0 0 20 12" fill="none" aria-hidden="true"><path d="M1 6h17M13 1l5 5-5 5" stroke="currentColor" stroke-width="1.3"/></svg>
            </button>
          </form>
          <div class="vip-form-success" id="vipFormSuccess">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>
            <h3>${T.thankYouTitle}</h3>
            <p>${T.thankYouBody}</p>
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

    // Markup is already built in `T`'s locale (see modalMarkup() — the
    // strings came from the server, resolved for the real page locale, not
    // just an en/th guess), so no runtime re-translation pass is needed
    // here anymore. triggerContext()/validatePhone() below use `T` for the
    // same reason instead of a separate en/th check.

    function triggerContext(trigger){
      const doctor = trigger.dataset.docName;
      const program = trigger.dataset.program || trigger.querySelector('strong')?.textContent.trim();
      if(doctor) return `${T.doctorPrefix}${doctor}`;
      if(program) return `${T.programPrefix}${program}`;
      return '';
    }

    function validatePhone(showMessage){
      const compactPhone = phone.value.replace(/[\s().-]/g,'');
      const valid = /^0\d{8,9}$/.test(compactPhone) || /^\+66\d{8,9}$/.test(compactPhone);
      const message = valid ? '' : T.phoneError;
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
  }

  if(document.readyState === 'complete') init();
  else window.addEventListener('load',init,{once:true});
})();
