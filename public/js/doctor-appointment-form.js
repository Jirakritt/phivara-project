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

    const submitButton = form.querySelector('.form-submit');

    const defaultNotes = {
      th: notesInput.dataset.defaultTh || notesInput.value,
      en: notesInput.dataset.defaultEn || notesInput.value,
    };
    const successMessages = {
      th: form.dataset.successTh || 'ขอบคุณครับ/ค่ะ ระบบได้รับข้อมูลการนัดหมายแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด',
      en: form.dataset.successEn || 'Thank you. Your appointment request has been received. Our team will contact you shortly.',
    };
    const errorMessages = {
      th: form.dataset.errorTh || 'ขออภัย ระบบไม่สามารถส่งคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือโทรติดต่อเราโดยตรง',
      en: form.dataset.errorEn || "Sorry, we couldn't submit your request right now. Please try again or call us directly.",
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
      if (!formStatus.hidden) {
        const messages = formStatus.classList.contains('form-status--error') ? errorMessages : successMessages;
        formStatus.textContent = messages[language];
      }
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!validatePhone(true)) {
        phoneInput.reportValidity();
        phoneInput.focus();
        return;
      }

      const language = currentLanguage();
      formStatus.hidden = true;
      formStatus.classList.remove('form-status--error');
      if (submitButton) submitButton.disabled = true;

      // Posts to the same /api/leads route as the site-wide VIP modal (see
      // public/js/vip-modal.js) — both land in the same `leads` Payload
      // collection. form.dataset.service comes from the doctor's own
      // specialty (this form has no service picker of its own; see
      // SPECIALTY_TO_LEAD_SERVICE in the doctor detail page).
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.elements.name.value.trim(),
            phone: phoneInput.value.trim(),
            branch: form.elements.branch.value,
            service: form.dataset.service || '',
            notes: notesInput.value.trim(),
            preferredDate: form.elements.preferredAppointmentDate ? form.elements.preferredAppointmentDate.value : '',
            sourcePath: window.location.pathname,
            honeypot: form.elements.honeypot ? form.elements.honeypot.value : '',
          }),
        });

        if (!response.ok) throw new Error('Lead submission failed');

        // Fires GA4's generate_lead / Meta Pixel's Lead event (see
        // public/js/consent-banner.js) — same conversion event the VIP
        // modal fires, so both booking touchpoints attribute together.
        // Safe no-op if analytics was never loaded.
        window.phivaraTrackLead?.();

        form.reset();
        notesInput.value = defaultNotes[language];
        phoneInput.setAttribute('aria-invalid', 'false');
        phoneError.hidden = true;
        formStatus.textContent = successMessages[language];
        formStatus.hidden = false;
      } catch (error) {
        formStatus.textContent = errorMessages[language];
        formStatus.classList.add('form-status--error');
        formStatus.hidden = false;
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  setMinimumAppointmentDate();
  initAppointmentForm();
})();
