(() => {
  'use strict';

  const isDr01 = new URLSearchParams(window.location.search).get('id') === 'dr01';

  const DOCTOR_NOTES = isDr01
    ? {
        th: 'นัดหมายขอปรึกษาแพทย์: นพ.ดุลยณัฐ อรัญยะปาล',
        en: 'Book appointment with: Dr. Dulyanat Aranyapal'
      }
    : {
        th: 'นัดหมายขอปรึกษาแพทย์: พญ. กอบกุลยา จึงประเสริฐศรี',
        en: 'Book appointment with: Dr. Kobkulya Juengprasertsri'
      };

  const SUCCESS_MESSAGES = isDr01
    ? {
        th: 'ขอบคุณครับ/ค่ะ ระบบได้รับข้อมูลการนัดหมายปรึกษา นพ.ดุลยณัฐ แล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด',
        en: 'Thank you. Your consultation request with Dr. Dulyanat has been received. Our team will contact you shortly.'
      }
    : {
        th: 'ขอบคุณครับ/ค่ะ ระบบได้รับข้อมูลการนัดหมายปรึกษา พญ. กอบกุลยา แล้ว เจ้าหน้าที่ VIP Concierge จะติดต่อกลับโดยเร็วที่สุด',
        en: 'Thank you. Your consultation request with Dr. Kobkulya has been received. Our concierge will contact you shortly.'
      };

  const PHONE_ERRORS = {
    th: 'กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66',
    en: 'Enter a 9–10 digit phone number or use the +66 format'
  };

  const currentLanguage = () => (
    document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'th'
  );

  function setBilingual(element, th, en) {
    if (!element) return;
    element.dataset.th = th;
    element.dataset.en = en;
    element.textContent = currentLanguage() === 'en' ? en : th;
  }

  function replaceCredentialList(card, items) {
    const list = card?.querySelector('.credential-list');
    if (!list) return;

    const entries = items.map(({ th, en }) => {
      const item = document.createElement('li');
      item.dataset.th = th;
      item.dataset.en = en;
      item.textContent = currentLanguage() === 'en' ? en : th;
      return item;
    });

    list.replaceChildren(...entries);
  }

  function applyDr01Profile() {
    if (!isDr01) return;

    document.title = 'PHIVARA | นพ.ดุลยณัฐ อรัญยะปาล - ศัลยแพทย์ตกแต่ง';
    document.body.classList.add('doctor-profile--plastic');

    setBilingual(
      document.querySelector('.doc-breadcrumb .current'),
      'นพ.ดุลยณัฐ อรัญยะปาล',
      'Dr. Dulyanat Aranyapal'
    );

    const portrait = document.querySelector('.portrait-img-large');
    if (portrait) {
      portrait.src = 'assets/images/doctors/dr01.png';
      portrait.width = 1015;
      portrait.height = 1448;
      portrait.dataset.altTh = 'นพ.ดุลยณัฐ อรัญยะปาล';
      portrait.dataset.altEn = 'Dr. Dulyanat Aranyapal';
      portrait.alt = currentLanguage() === 'en' ? portrait.dataset.altEn : portrait.dataset.altTh;
    }

    setBilingual(
      document.querySelector('.doc-hero-name'),
      'นพ.ดุลยณัฐ อรัญยะปาล',
      'Dr. Dulyanat Aranyapal, M.D.'
    );
    setBilingual(
      document.querySelector('.doc-hero-title-badge'),
      'แพทย์ประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา',
      'Plastic Surgery Center, Phyathai Sriracha Hospital'
    );

    const branchLabel = document.querySelector('.doc-branch-label');
    const branchIcon = branchLabel?.querySelector('svg');
    if (branchLabel && branchIcon) {
      branchLabel.replaceChildren(branchIcon, document.createTextNode(' PHYATHAI SRIRACHA'));
    }

    setBilingual(
      document.querySelector('.doc-hero-sub-title'),
      'วุฒิบัตรสาขาศัลยศาสตร์ตกแต่ง คณะแพทยศาสตร์ศิริราชพยาบาล',
      'Board Certified in Plastic Surgery, Faculty of Medicine Siriraj Hospital'
    );

    const tags = document.querySelectorAll('.doc-tag-pill');
    const tagContent = [
      { th: '✦ ศัลยกรรมตกแต่ง', en: '✦ Plastic Surgery' },
      { th: '✦ ศัลยกรรมตกแต่งใบหน้า', en: '✦ Facial Plastic Surgery' },
      { th: '✦ ศัลยกรรมแม็กซิลโลเฟเชียล', en: '✦ Maxillofacial Surgery' }
    ];
    tags.forEach((tag, index) => {
      if (tagContent[index]) setBilingual(tag, tagContent[index].th, tagContent[index].en);
    });

    setBilingual(
      document.querySelector('.doc-bio'),
      'ศัลยแพทย์ตกแต่งผู้ผ่านการอบรมด้านศัลยกรรมตกแต่งใบหน้าจากผู้เชี่ยวชาญประเทศเกาหลี Prof. Hong Ki Lee, M.D., Ph.D. มีประสบการณ์เป็นอาจารย์แพทย์และแพทย์ศัลยกรรมตกแต่ง ปัจจุบันประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา',
      'Plastic surgeon trained in facial plastic surgery under Korean specialist Prof. Hong Ki Lee, M.D., Ph.D. Experienced as a medical lecturer and plastic surgeon, currently practicing at the Plastic Surgery Center, Phyathai Sriracha Hospital.'
    );

    document.querySelectorAll('a.vip-trigger[data-doc-name]').forEach((button) => {
      button.dataset.docName = 'นพ.ดุลยณัฐ อรัญยะปาล';
      setBilingual(button, 'จองนัดหมายปรึกษา นพ.ดุลยณัฐ', 'Book Consultation with Dr. Dulyanat');
    });

    setBilingual(
      document.querySelector('#credentials-heading'),
      'ประวัติการศึกษาและประสบการณ์ทำงาน',
      'Education & Professional Experience'
    );

    const cards = document.querySelectorAll('.doc-credential-card');
    setBilingual(cards[0]?.querySelector('h3'), 'คุณวุฒิและการศึกษา', 'Education & Certifications');
    replaceCredentialList(cards[0], [
      {
        th: 'แพทยศาสตรบัณฑิต คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี มหาวิทยาลัยมหิดล',
        en: 'Doctor of Medicine, Faculty of Medicine Ramathibodi Hospital, Mahidol University'
      },
      {
        th: 'วุฒิบัตรสาขาศัลยศาสตร์ คณะแพทยศาสตร์ มหาวิทยาลัยสงขลานครินทร์',
        en: 'Board Certified in Surgery, Faculty of Medicine, Prince of Songkla University'
      },
      {
        th: 'วุฒิบัตรสาขาศัลยศาสตร์ตกแต่ง คณะแพทยศาสตร์ศิริราชพยาบาล',
        en: 'Board Certified in Plastic Surgery, Faculty of Medicine Siriraj Hospital'
      },
      {
        th: 'เทรนนิ่งหลักสูตรศัลยกรรมตกแต่งใบหน้าจากผู้เชี่ยวชาญประเทศเกาหลี Prof. Hong Ki Lee, M.D., Ph.D.',
        en: 'Facial plastic surgery training under Korean specialist Prof. Hong Ki Lee, M.D., Ph.D.'
      }
    ]);

    setBilingual(cards[1]?.querySelector('h3'), 'ประวัติการทำงาน', 'Professional Experience');
    replaceCredentialList(cards[1], [
      { th: 'แพทย์โรงพยาบาลมหาวิทยาลัยสงขลานครินทร์', en: 'Physician, Songklanagarind Hospital' },
      {
        th: 'แพทย์ประจำบ้าน สาขาศัลยศาสตร์ มหาวิทยาลัยสงขลานครินทร์',
        en: 'Surgery Resident, Prince of Songkla University'
      },
      { th: 'แพทย์ศัลยกรรมตกแต่ง โรงพยาบาลศิริราช', en: 'Plastic Surgeon, Siriraj Hospital' },
      { th: 'อาจารย์แพทย์ โรงพยาบาลมหาวิทยาลัยสงขลานครินทร์', en: 'Medical Lecturer, Songklanagarind Hospital' },
      {
        th: 'แพทย์ศัลยกรรมตกแต่งและแม็กซิลโลเฟเชียล ประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา',
        en: 'Plastic and Maxillofacial Surgeon, Plastic Surgery Center, Phyathai Sriracha Hospital'
      }
    ]);

    setBilingual(cards[2]?.querySelector('h3'), 'ความเชี่ยวชาญทางการแพทย์', 'Clinical Specialization');
    replaceCredentialList(cards[2], [
      { th: 'ศัลยศาสตร์', en: 'General Surgery' },
      { th: 'ศัลยศาสตร์ตกแต่ง', en: 'Plastic Surgery' },
      { th: 'ศัลยกรรมตกแต่งใบหน้า', en: 'Facial Plastic Surgery' },
      { th: 'ศัลยกรรมแม็กซิลโลเฟเชียล', en: 'Maxillofacial Surgery' }
    ]);

    document.querySelector('#programs')?.setAttribute('hidden', '');
    document.querySelector('#doctor-journal')?.setAttribute('hidden', '');
    document.querySelector('.doc-schedule-section .btn-outline-dark')?.setAttribute('hidden', '');

    setBilingual(
      document.querySelector('.doc-schedule-section .section-intro p'),
      'ตารางออกตรวจ ณ ศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา กรุณานัดหมายล่วงหน้า',
      'Outpatient schedule at the Plastic Surgery Center, Phyathai Sriracha Hospital. Advance appointment is recommended.'
    );

    const scheduleRows = [
      { th: 'จันทร์ (Monday)', en: 'Monday', hours: '09:00 - 20:00 น.' },
      { th: 'อังคาร (Tuesday)', en: 'Tuesday', hours: '09:00 - 19:00 น.' },
      { th: 'พุธ (Wednesday)', en: 'Wednesday', hours: '09:00 - 18:00 น.' },
      { th: 'พฤหัสบดี (Thursday)', en: 'Thursday', hours: '09:00 - 14:00 น.' },
      { th: 'อาทิตย์ (Sunday)', en: 'Sunday', hours: '10:00 - 20:00 น.' }
    ];
    const scheduleBody = document.querySelector('.schedule-table tbody');
    if (scheduleBody) {
      const rows = scheduleRows.map(({ th, en, hours }) => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        const day = document.createElement('strong');
        setBilingual(day, th, en);
        dayCell.append(day);

        const hoursCell = document.createElement('td');
        hoursCell.textContent = hours;

        const locationCell = document.createElement('td');
        const location = document.createElement('strong');
        location.textContent = 'PHYATHAI SRIRACHA HOSPITAL';
        const center = document.createElement('div');
        center.className = 'branch-subtext';
        setBilingual(center, 'ศูนย์ศัลยกรรมตกแต่ง', 'Plastic Surgery Center');
        locationCell.append(location, center);

        row.append(dayCell, hoursCell, locationCell);
        return row;
      });
      scheduleBody.replaceChildren(...rows);
    }

    const contactImage = document.querySelector('.contact-visual > img');
    if (contactImage) {
      contactImage.dataset.altTh = 'พื้นที่รับรองสำหรับการนัดหมาย';
      contactImage.dataset.altEn = 'Appointment reception lounge';
      contactImage.alt = currentLanguage() === 'en' ? contactImage.dataset.altEn : contactImage.dataset.altTh;
    }
    setBilingual(
      document.querySelector('.contact-visual-content > p'),
      'ส่งคำขอนัดหมายเพื่อเข้าพบ นพ.ดุลยณัฐ อรัญยะปาล ตามวันและเวลาที่สะดวก เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันนัดหมาย',
      'Request an appointment with Dr. Dulyanat Aranyapal on your preferred date and time. Our team will contact you to confirm.'
    );
    setBilingual(
      document.querySelector('.contact-fact span'),
      'ศูนย์ศัลยกรรมตกแต่ง · โรงพยาบาลพญาไทศรีราชา',
      'Plastic Surgery Center · Phyathai Sriracha Hospital'
    );

    const branchOption = document.querySelector('#appointmentBranch option');
    if (branchOption) {
      branchOption.value = 'phyathai-sriracha';
      setBilingual(
        branchOption,
        'ศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา',
        'Plastic Surgery Center, Phyathai Sriracha Hospital'
      );
    }

    const notesInput = document.querySelector('#vipNotesInput');
    if (notesInput) notesInput.value = DOCTOR_NOTES[currentLanguage()];
  }

  function setLanguage(language) {
    const notesInput = document.getElementById('vipNotesInput');
    const hasDefaultNotes = notesInput && Object.values(DOCTOR_NOTES).includes(notesInput.value.trim());

    document.documentElement.lang = language;

    document.querySelectorAll('[data-th][data-en]').forEach((element) => {
      element.textContent = element.dataset[language];
    });

    document.querySelectorAll('[data-placeholder-th][data-placeholder-en]').forEach((element) => {
      element.placeholder = language === 'th'
        ? element.dataset.placeholderTh
        : element.dataset.placeholderEn;
    });

    document.querySelectorAll('[data-alt-th][data-alt-en]').forEach((image) => {
      image.alt = language === 'th' ? image.dataset.altTh : image.dataset.altEn;
    });

    document.querySelectorAll('[data-aria-label-th][data-aria-label-en]').forEach((element) => {
      element.setAttribute(
        'aria-label',
        language === 'th' ? element.dataset.ariaLabelTh : element.dataset.ariaLabelEn
      );
    });

    document.querySelectorAll('#langToggle [data-val]').forEach((option) => {
      option.classList.toggle('active', option.dataset.val === language);
    });

    const formStatus = document.getElementById('appointmentFormStatus');
    if (formStatus && !formStatus.hidden) {
      formStatus.textContent = SUCCESS_MESSAGES[language];
    }

    const phoneInput = document.getElementById('appointmentPhone');
    if (phoneInput?.getAttribute('aria-invalid') === 'true') {
      phoneInput.setCustomValidity(PHONE_ERRORS[language]);
    }

    if (hasDefaultNotes) notesInput.value = DOCTOR_NOTES[language];
  }

  function initLanguageSwitcher() {
    document.getElementById('langToggle')?.addEventListener('click', (event) => {
      const language = event.target.closest('[data-val]')?.dataset.val;
      if (language === 'th' || language === 'en') setLanguage(language);
    });
  }

  function initMobileMenu() {
    const burgerButton = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!burgerButton || !mobileMenu) return;

    const setMenuOpen = (isOpen) => {
      burgerButton.classList.toggle('open', isOpen);
      burgerButton.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    burgerButton.addEventListener('click', () => {
      setMenuOpen(!mobileMenu.classList.contains('open'));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  }

  function initScrollUi() {
    const siteHeader = document.getElementById('siteHeader');
    const progressBar = document.getElementById('progressBar');
    let animationFrame = null;

    const update = () => {
      const page = document.documentElement;
      const scrollableHeight = Math.max(1, page.scrollHeight - page.clientHeight);

      siteHeader?.classList.toggle('scrolled', window.scrollY > 40);
      if (progressBar) {
        progressBar.style.width = `${(page.scrollTop / scrollableHeight) * 100}%`;
      }

      animationFrame = null;
    };

    window.addEventListener('scroll', () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

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

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validatePhone(true)) {
        phoneInput.reportValidity();
        phoneInput.focus();
        return;
      }

      const language = currentLanguage();
      form.reset();
      notesInput.value = DOCTOR_NOTES[language];
      phoneInput.setAttribute('aria-invalid', 'false');
      phoneError.hidden = true;
      formStatus.textContent = SUCCESS_MESSAGES[language];
      formStatus.hidden = false;
    });
  }

  function initPreloader() {
    const hide = () => {
      window.setTimeout(() => {
        document.getElementById('preloader')?.classList.add('done');
      }, 400);
    };

    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide, { once: true });
  }

  applyDr01Profile();
  initLanguageSwitcher();
  initMobileMenu();
  initScrollUi();
  setMinimumAppointmentDate();
  initAppointmentForm();
  initPreloader();
})();
