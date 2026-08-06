'use strict';

// Handles just the VIP appointment form on doctor detail pages. The rest of
// what phivara-design-html/js/doctor-detail.js used to do — language
// toggle, mobile menu, scroll header state, preloader, reveal animations —
// is now covered by the shared js/site-runtime.js (loaded alongside this
// file), and the doctor-specific content itself is server-rendered from
// Payload instead of being DOM-patched in for a single hardcoded "dr01".
(() => {
  const PHONE_ERRORS = {
    th: 'กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66',
    en: 'Enter a 9–10 digit phone number or use the +66 format',
  };

  const currentLanguage = () => (document.documentElement.lang || 'th').toLowerCase().startsWith('en') ? 'en' : 'th';

  function setMinimumAppointmentDate() {
    const dateInput = document.getElementById('preferredAppointmentDate');
    if (!dateInput) return;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${year}-${month}-${day}`;
  }

  function initAppointmentForm() {
    const form = document.getElementById('vipDirectForm');
    const notesInput = document.getElementById('vipNotesInput');
    const phoneInput = document.getElementById('appointmentPhone');
    const phoneError = document.getElementById('appointmentPhoneError');
    const formStatus = document.getElementById('appointmentFormStatus');
    if (!form || !notesInput || !phoneInput || !phoneError || !formStatus) return;

    const defaultNotes = {
      th: notesInput.dataset.defaultTh || notesInput.value,
      en: notesInput.dataset.defaultEn || notesInput.value,
    };
    const successMessages = {
      th: form.dataset.successTh || 'ขอบคุณครับ/ค่ะ ระบบได้รับข้อมูลการนัดหมายแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด',
      en: form.dataset.successEn || 'Thank you. Your appointment request has been received. Our team will contact you shortly.',
    };

    const validatePhone = (showError) => {
      const compactPhone = phoneInput.value.replace(/[\s().-]/g, '');
      const isValid = /^0\d{8,9}$/.test(compactPhone) || /^\+66\d{8,9}$/.test(compactPhone);
      const errorMessage = isValid ? '' : PHONE_ERRORS[currentLanguage()];

      phoneInput.setCustomValidity(errorMessage);
      phoneInput.setAttribute('aria-invalid', String(!isValid));
      phoneError.hidden = isValid || !showError;
      return isValid;
    };

    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value) validatePhone(true);
    });

    phoneInput.addEventListener('input', () => {
      if (phoneInput.getAttribute('aria-invalid') === 'true') validatePhone(true);
      else phoneInput.setCustomValidity('');
    });

    form.addEventListener('input', () => {
      formStatus.hidden = true;
    });

    document.addEventListener('phivara:languagechange', (event) => {
      const language = event.detail.language;
      const hasDefaultNotes = Object.values(defaultNotes).includes(notesInput.value.trim());
      if (hasDefaultNotes) notesInput.value = defaultNotes[language];
      if (!formStatus.hidden) formStatus.textContent = successMessages[language];
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validatePhone(true)) {
        phoneInput.reportValidity();
        phoneInput.focus();
        return;
      }

      const language = currentLanguage();
      form.reset();
      notesInput.value = defaultNotes[language];
      phoneInput.setAttribute('aria-invalid', 'false');
      phoneError.hidden = true;
      formStatus.textContent = successMessages[language];
      formStatus.hidden = false;
    });
  }

  setMinimumAppointmentDate();
  initAppointmentForm();
})();
