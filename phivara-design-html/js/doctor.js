'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Additional specialists (cards 13-30)
  const additionalDoctors = [
    ['dr13','sanampao','plastic','สนามเป้า','SANAMPAO','PHIVARA SANAMPAO','พญ. ชนิดาภา วัฒนกุล','Dr. Chanidapa Wattanakul','ศัลยกรรมตกแต่งรอบดวงตาและใบหน้า','Oculoplastic & Facial Surgery','ศัลยแพทย์ตกแต่งเฉพาะทางด้านใบหน้า','Facial Plastic Surgery Specialist','assets/images/doctors/dr01.png'],
    ['dr14','phaholyothin','longevity','พหลโยธิน','PHAHOLYOTHIN','PHIVARA PHAHOLYOTHIN','นพ. ธีรภัทร จิรเวช','Dr. Teerapat Jiravej','เวชศาสตร์ป้องกันและสุขภาพเชิงลึก','Preventive & Precision Medicine','ผู้เชี่ยวชาญเวชศาสตร์ป้องกันเฉพาะบุคคล','Precision Medicine Specialist','assets/images/doctors/dr02.png'],
    ['dr15','sriayudhaya','dermatology','ศรีอยุธยา','SRI AYUDHAYA','PHIVARA SRI AYUDHAYA','พญ. พิมพ์ชนก ศรีวรางค์','Dr. Pimchanok Sriwarang','ผิวหนังอักเสบและผิวบอบบาง','Sensitive Skin & Clinical Dermatology','วุฒิบัตรแพทย์เฉพาะทางผิวหนัง','Board Certified Dermatologist','assets/images/treatments/specialist-2.jpg'],
    ['dr16','petchakasem','wellness','เพชรเกษม 19','PETCHAKASEM 19','PHIVARA PETCHAKASEM 19','นพ. อชิระ ธนากร','Dr. Achira Thanakorn','เวชศาสตร์ฟื้นฟูและการเคลื่อนไหว','Rehabilitation & Movement Medicine','ผู้เชี่ยวชาญเวชศาสตร์ฟื้นฟู','Rehabilitation Medicine Specialist','assets/images/treatments/specialist-1.jpg'],
    ['dr17','sriracha','plastic','ศรีราชา','SRIRACHA','PHIVARA SRIRACHA','พญ. รมิดา กาญจนศิลป์','Dr. Ramida Kanchanasilp','ศัลยกรรมปรับรูปหน้าอย่างเป็นธรรมชาติ','Natural Facial Contouring Surgery','ศัลยแพทย์ตกแต่งเฉพาะทาง','Board Certified Plastic Surgeon','assets/images/treatments/expertise-plastic.jpg'],
    ['dr18','sanampao','dermatology','สนามเป้า','SANAMPAO','PHIVARA SANAMPAO','นพ. นราวิชญ์ พัฒนกิจ','Dr. Narawit Pattanakit','เลเซอร์ผิวหนังและแผลเป็น','Laser Dermatology & Scar Treatment','แพทย์เฉพาะทางผิวหนังและเลเซอร์','Dermatology & Laser Specialist','assets/images/treatments/specialist-3.jpg'],
    ['dr19','phaholyothin','longevity','พหลโยธิน','PHAHOLYOTHIN','PHIVARA PHAHOLYOTHIN','พญ. สุพิชญา เลิศวัฒนะ','Dr. Supitchaya Lertwattana','สมดุลฮอร์โมนและสุขภาพสตรี','Hormone Balance & Women’s Health','ผู้เชี่ยวชาญฮอร์โมนและเวชศาสตร์ชะลอวัย','Hormone & Anti-Aging Specialist','assets/images/doctors/dr02.png'],
    ['dr20','sriayudhaya','wellness','ศรีอยุธยา','SRI AYUDHAYA','PHIVARA SRI AYUDHAYA','นพ. กิตติภูมิ รัตนวงศ์','Dr. Kittipoom Rattanawong','การนอนหลับและการจัดการความเครียด','Sleep & Stress Medicine','แพทย์ผู้เชี่ยวชาญสุขภาพองค์รวม','Holistic Wellness Specialist','assets/images/hero/herobg03.png'],
    ['dr21','petchakasem','dermatology','เพชรเกษม 19','PETCHAKASEM 19','PHIVARA PETCHAKASEM 19','พญ. ณัฐริกา สุขประเสริฐ','Dr. Nattarika Sukprasert','สิว ฝ้า และปัญหาสีผิว','Acne, Melasma & Pigmentation','วุฒิบัตรแพทย์เฉพาะทางผิวหนัง','Board Certified Dermatologist','assets/images/treatments/expertise-skin.jpg'],
    ['dr22','sriracha','longevity','ศรีราชา','SRIRACHA','PHIVARA SRIRACHA','นพ. วชิรวิทย์ อินทรกุล','Dr. Wachirawit Intharakul','โภชนาการและสุขภาพเมตาบอลิก','Nutrition & Metabolic Health','ผู้เชี่ยวชาญเวชศาสตร์ชะลอวัย','Anti-Aging Medicine Specialist','assets/images/hero/herobg04.png'],
    ['dr23','sanampao','plastic','สนามเป้า','SANAMPAO','PHIVARA SANAMPAO','พญ. อรปรียา มณีรัตน์','Dr. Orapreeya Maneerat','ศัลยกรรมหน้าอกและรูปร่าง','Breast & Body Surgery','ศัลยแพทย์ตกแต่งเฉพาะทาง','Board Certified Plastic Surgeon','assets/images/doctors/dr01.png'],
    ['dr24','phaholyothin','wellness','พหลโยธิน','PHAHOLYOTHIN','PHIVARA PHAHOLYOTHIN','นพ. ภาคิน วิสุทธิ์วงศ์','Dr. Pakin Wisutwong','สุขภาพบุรุษและสมรรถภาพร่างกาย','Men’s Health & Performance','ผู้เชี่ยวชาญสุขภาพบุรุษเฉพาะบุคคล','Men’s Health Specialist','assets/images/treatments/specialist-1.jpg'],
    ['dr25','sriayudhaya','dermatology','ศรีอยุธยา','SRI AYUDHAYA','PHIVARA SRI AYUDHAYA','พญ. เขมิกา รุ่งเรือง','Dr. Khemika Rungruang','ผิวพรรณและเวชศาสตร์ความงาม','Aesthetic Dermatology','แพทย์เฉพาะทางผิวหนังและความงาม','Aesthetic Dermatology Specialist','assets/images/treatments/specialist-2.jpg'],
    ['dr26','petchakasem','longevity','เพชรเกษม 19','PETCHAKASEM 19','PHIVARA PETCHAKASEM 19','นพ. ศุภณัฐ ธรรมคุณ','Dr. Suphanat Thammakun','สุขภาพลำไส้และภูมิคุ้มกัน','Gut Health & Immunity','แพทย์เวชศาสตร์เชิงหน้าที่','Functional Medicine Practitioner','assets/images/doctors/dr02.png'],
    ['dr27','sriracha','plastic','ศรีราชา','SRIRACHA','PHIVARA SRIRACHA','พญ. ลลิตา วงศ์พิพัฒน์','Dr. Lalita Wongpipat','ศัลยกรรมยกกระชับใบหน้า','Facelift & Rejuvenation Surgery','ศัลยแพทย์ตกแต่งใบหน้าเฉพาะทาง','Facial Plastic Surgery Specialist','assets/images/treatments/expertise-plastic.jpg'],
    ['dr28','sanampao','wellness','สนามเป้า','SANAMPAO','PHIVARA SANAMPAO','นพ. รชต ภูวดล','Dr. Rachata Poowadon','เวชศาสตร์การกีฬาและการฟื้นตัว','Sports Medicine & Recovery','ผู้เชี่ยวชาญการฟื้นฟูสมรรถภาพ','Sports Recovery Specialist','assets/images/brand/about-lounge.jpg'],
    ['dr29','phaholyothin','dermatology','พหลโยธิน','PHAHOLYOTHIN','PHIVARA PHAHOLYOTHIN','พญ. ธัญชนก วีระกุล','Dr. Thanchanok Weerakul','เส้นผมและหนังศีรษะ','Hair & Scalp Dermatology','แพทย์เฉพาะทางผิวหนังและเส้นผม','Hair Dermatology Specialist','assets/images/treatments/expertise-skin.jpg'],
    ['dr30','sriayudhaya','longevity','ศรีอยุธยา','SRI AYUDHAYA','PHIVARA SRI AYUDHAYA','นพ. ปุณณวิช ศิริเมธา','Dr. Punnawit Sirimetha','การประเมินอายุชีวภาพและพันธุกรรม','Biological Age & Genomics','ผู้เชี่ยวชาญเวชศาสตร์แม่นยำ','Precision Longevity Specialist','assets/images/hero/herobg04.png']
  ];

  const doctorGrid = document.getElementById('doctorGrid');
  additionalDoctors.forEach(([id, branch, specialty, branchTh, branchEn, _role, nameTh, nameEn, specTh, specEn, subTh, subEn, photo]) => {
    const card = document.createElement('div');
    card.className = 'spec-card s-item';
    card.dataset.branch = branch;
    card.dataset.specialty = specialty;
    card.dataset.docId = id;
    card.innerHTML = `
      <div class="photo-wrap"><img class="ph-photo" src="${photo}" alt="${nameTh}"></div>
      <span class="program-branch">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
        <span class="program-branch__text"><span class="program-branch__brand">PHIVARA</span><span class="program-branch__name" data-th="${branchTh}" data-en="${branchEn}">${branchTh}</span></span>
      </span>
      <h3 data-th="${nameTh}" data-en="${nameEn}">${nameTh}</h3>
      <p class="note" data-th="${specTh}" data-en="${specEn}">${specTh}</p>
      <div class="spec-subnote" data-th="${subTh}" data-en="${subEn}">${subTh}</div>
      <div class="card-actions">
        <button class="btn-doc-detail" data-doc-id="${id}" data-th="ดูประวัติแพทย์" data-en="View Profile">ดูประวัติแพทย์</button>
        <a href="#contact" class="go vip-trigger" data-doc-name="${nameTh}" data-th="จองปรึกษา →" data-en="Book →">จองปรึกษา →</a>
      </div>`;
    doctorGrid.appendChild(card);
  });

  // Filter Elements & Custom Dropdowns
  const searchInput = document.getElementById('docSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const specialtySelectBox = document.getElementById('specialtySelectBox');
  const specialtyBtn = document.getElementById('specialtyBtn');
  const specialtyBtnText = document.getElementById('specialtyBtnText');
  const specialtyItems = document.querySelectorAll('#specialtyMenu .dropdown-item');
  const branchSelectBox = document.getElementById('branchSelectBox');
  const branchBtn = document.getElementById('branchBtn');
  const branchBtnText = document.getElementById('branchBtnText');
  const branchItems = document.querySelectorAll('#branchMenu .dropdown-item');
  const doctorCards = document.querySelectorAll('#doctorGrid .spec-card');
  const branchLabels = Object.fromEntries(window.PhivaraSiteShell.branches.map(item => [
    item.id,
    [item.nameTh, item.nameEn]
  ]));
  doctorCards.forEach(card => {
    const branch = card.querySelector('.program-branch');
    if(!branch || branch.querySelector('svg')) return;
    const [branchTh, branchEn] = branchLabels[card.dataset.branch] || [
      branch.textContent.trim().replace(/^PHIVARA\s+/i, ''),
      branch.textContent.trim().replace(/^PHIVARA\s+/i, '')
    ];
    branch.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span class="program-branch__text"><span class="program-branch__brand">PHIVARA</span><span class="program-branch__name" data-th="${branchTh}" data-en="${branchEn}">${branchTh}</span></span>`;
  });
  const noDocFound = document.getElementById('noDocFound');
  const docCountBadge = document.getElementById('docCountBadge');
  const doctorPagination = document.getElementById('doctorPagination');

  let selectedSpecialty = 'all';
  let selectedBranch = 'all';
  let currentDoctorPage = 1;
  const doctorsPerPage = 20;
  const paginationControl = window.PhivaraCatalog.createPagination({
    container: doctorPagination,
    showArrows: false,
    onPageChange(page) {
      currentDoctorPage = page;
      filterDoctors(false);
      document.querySelector('.doctor-grid-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  function filterDoctors(resetPage = true) {
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const matchedCards = [];
    doctorCards.forEach(card => {
      const cardSpecialty = card.getAttribute('data-specialty');
      const cardBranch = card.getAttribute('data-branch');
      const textContent = card.textContent.toLowerCase();

      const matchSpecialty = selectedSpecialty === 'all' || cardSpecialty === selectedSpecialty;
      const matchBranch = selectedBranch === 'all' || cardBranch === selectedBranch;
      const matchSearch = searchQuery === '' || textContent.includes(searchQuery);

      if (matchSpecialty && matchBranch && matchSearch) {
        matchedCards.push(card);
      } else {
        card.classList.add('hidden');
      }
    });

    if (resetPage) currentDoctorPage = 1;
    const totalPages = Math.ceil(matchedCards.length / doctorsPerPage);
    if (currentDoctorPage > totalPages) currentDoctorPage = Math.max(1, totalPages);
    const pageStart = (currentDoctorPage - 1) * doctorsPerPage;
    const pageEnd = pageStart + doctorsPerPage;
    matchedCards.forEach((card, index) => {
      card.classList.toggle('hidden', index < pageStart || index >= pageEnd);
    });

    if (noDocFound) {
      noDocFound.style.display = matchedCards.length === 0 ? 'block' : 'none';
    }
    if (docCountBadge) {
      docCountBadge.textContent = matchedCards.length;
    }
    paginationControl.render(currentDoctorPage, totalPages);
  }

  const dropdowns = window.PhivaraCatalog.createDropdownGroup([
    {
      name: 'specialty',
      selectBox: specialtySelectBox,
      button: specialtyBtn,
      buttonText: specialtyBtnText,
      items: specialtyItems,
      valueKey: 'specialty',
      onSelect(value) {
        selectedSpecialty = value;
        filterDoctors();
      }
    },
    {
      name: 'branch',
      selectBox: branchSelectBox,
      button: branchBtn,
      buttonText: branchBtnText,
      items: branchItems,
      valueKey: 'branch',
      onSelect(value) {
        selectedBranch = value;
        filterDoctors();
      }
    }
  ]);

  const searchControl = window.PhivaraCatalog.createSearch({
    input: searchInput,
    clearButton: searchClearBtn,
    onSearch() {
      filterDoctors();
    }
  });

  // Pre-filter from URL, e.g. doctor.html?specialty=longevity (used by ecosystem.html links)
  const urlParams = new URLSearchParams(window.location.search);
  const specialtyParam = urlParams.get('specialty');
  if (specialtyParam && dropdowns.specialty) {
    dropdowns.specialty.selectByValue(specialtyParam);
  }

  // Initial result count and first page
  filterDoctors();

  // Doctor profile navigation
  doctorGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.btn-doc-detail');
    if (!button) return;
    const doctorId = button.dataset.docId || 'dr01';
    window.location.href = `doctor_detail.html?id=${doctorId}`;
  });

  // Pre-fill VIP Concierge Modal when clicking "จองปรึกษา"
  document.querySelectorAll('.vip-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const docName = trigger.getAttribute('data-doc-name');
      const vipNotesInput = document.querySelector('#vipForm textarea[name="notes"]');
      if (docName && vipNotesInput) {
        const lang = document.documentElement.lang || 'th';
        const prefix = lang === 'en' ? 'Book consultation with: ' : 'นัดหมายขอปรึกษาแพทย์: ';
        vipNotesInput.value = prefix + docName;
      }
    });
  });
});
