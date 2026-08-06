  /* Homepage interactions and dynamic content */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const luxuryPalette = {
    themeColor: '#927448',
    ambientGold: '194,166,123'
  };

  /* Keep browser chrome and interactive light accents aligned with the gold palette */
  document.documentElement.style.setProperty('--ambient-gold-rgb', luxuryPalette.ambientGold);
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if(!themeColorMeta){
    themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.content = luxuryPalette.themeColor;

  /* Prevent off-canvas menus and carousels from restoring a horizontal scroll offset */
  function resetHorizontalScroll(){
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }
  window.addEventListener('pageshow', resetHorizontalScroll);
  window.addEventListener('resize', resetHorizontalScroll, { passive:true });

/* Preloader */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('done'), reduceMotion ? 80 : 1150);
  });

  /* Shared hero image source */
  const heroImages = [
    'assets/images/hero/herobg01.png',
    'assets/images/hero/herobg02.png',
    'assets/images/hero/herobg03.png',
    'assets/images/hero/herobg04.png'
  ];
  const heroBg = document.getElementById('heroBg');
  heroBg.innerHTML = heroImages
    .map((image,index) => `<div class="bg-slide${index === 0 ? ' active' : ''}"><img src="${image}" alt="" aria-hidden="true"></div>`)
    .join('');

  /* Hero background slideshow — auto-detects however many .bg-slide divs exist */
  (function(){
    const heroSlides = document.querySelectorAll('#heroBg .bg-slide');
    if(heroSlides.length > 1 && !reduceMotion){
      let slideIdx = 0;
      setInterval(() => {
        heroSlides[slideIdx].classList.remove('active');
        slideIdx = (slideIdx + 1) % heroSlides.length;
        heroSlides[slideIdx].classList.add('active');
      }, 7000);
    }
  })();

  /* Hero headline word-mask build */
  function buildHeroHeadline(lang = document.documentElement.lang || 'th'){
    const el = document.getElementById('heroHeadline');
    const text = el.getAttribute('data-' + lang);
    const words = text.split(' ');
    el.innerHTML = words.map((w,i) => `<span class="word-mask"><span class="word" style="animation-delay:${reduceMotion ? 0 : 0.35 + i*0.075}s">${w}</span></span>`).join(' ');
  }
  buildHeroHeadline('th');

  /* Sticky header shrink + progress bar */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = pct + '%';
  });

  /* Mobile menu (markup comes from the shared site shell) */
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  /* Language toggle */
  const langToggle = document.getElementById('langToggle');
  function setLang(lang){
    document.querySelectorAll('[data-th]').forEach(el => {
      if(el.id === 'heroHeadline') return;
      if(el.children.length > 0) return;
      const translation = el.getAttribute('data-' + lang);
      if(translation !== null) el.textContent = translation;
    });
    document.querySelectorAll('[data-placeholder-th]').forEach(el => {
      const placeholder = el.getAttribute('data-placeholder-' + lang);
      if(placeholder !== null) el.setAttribute('placeholder', placeholder);
    });
    langToggle.querySelectorAll('span').forEach(s => s.classList.toggle('active', s.dataset.val === lang));
    document.documentElement.lang = lang;
    buildHeroHeadline(lang);
  }
  langToggle.addEventListener('click', (e) => { const val = e.target.dataset.val; if(val) setLang(val); });

  /* Reveal + stagger observer */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in'); } });
  }, { threshold: 0.12, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.stagger').forEach(group => {
    Array.from(group.children).forEach((child,i) => { child.style.transitionDelay = (i*0.1)+'s'; });
  });

  /* Shared expertise category data and panel template */
  const expertiseCategories = [
    { label:'Plastic Surgery', tag:'The Art of Form', titleTh:'ศิลปะการจัดแต่งสัดส่วน', titleEn:'The Art of Form' },
    { label:'Anti-Aging & Longevity', tag:'The Art of Time', titleTh:'ศิลปะแห่งกาลเวลา', titleEn:'The Art of Time' },
    { label:'Dermatology', tag:'The Art of Glow', titleTh:'ศิลปะแห่งผิวเปล่งประกาย', titleEn:'The Art of Glow' },
    { label:'Aesthetic Wellness', tag:'The Art of Balance', titleTh:'ศิลปะแห่งความสมดุล', titleEn:'The Art of Balance' }
  ];
  const expNav = document.getElementById('expTabNav');
  const expTabPanels = document.getElementById('expTabPanels');
  if(expNav && expTabPanels){
    expNav.innerHTML = expertiseCategories.map((category, index) => `
      <button class="exp-tab-btn${index === 0 ? ' active' : ''}" id="exp-tab-${index}" data-tab="${index}" role="tab" aria-controls="exp-panel-${index}" aria-selected="${index === 0}">
        <span>${category.label}</span>
      </button>`).join('') + '<span class="exp-tab-indicator" id="expTabIndicator"></span>';

    expTabPanels.innerHTML = expertiseCategories.map((category, index) => `
      <div class="exp-panel${index === 0 ? ' active' : ''}" id="exp-panel-${index}" data-panel="${index}" role="tabpanel" aria-labelledby="exp-tab-${index}">
        <div class="exp-panel-intro">
          <div class="epi-title">
            <span class="tag">${category.tag}</span>
            <h3 data-th="${category.titleTh}" data-en="${category.titleEn}">${category.titleTh}</h3>
          </div>
          <a href="#" class="arrow-link go more">
            <span data-th="ดูโปรแกรมทั้งหมด" data-en="View All Programs">ดูโปรแกรมทั้งหมด</span>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true"><path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" stroke-width="1.3"/></svg>
          </a>
        </div>
        <div class="exp-card-grid"></div>
      </div>`).join('');
  }

  /* Expertise tabs */
  if(expNav){
    const expBtns = Array.from(expNav.querySelectorAll('.exp-tab-btn'));
    const expPanels = document.querySelectorAll('.exp-panel');
    const expIndicator = document.getElementById('expTabIndicator');
    function moveExpIndicator(btn){
      expIndicator.style.width = btn.offsetWidth + 'px';
      expIndicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    }
    function showExpTab(i){
      expBtns.forEach((b,idx) => { const on = idx===i; b.classList.toggle('active', on); b.setAttribute('aria-selected', on); });
      expPanels.forEach((p,idx) => p.classList.toggle('active', idx===i));
      moveExpIndicator(expBtns[i]);
    }
    expBtns.forEach((b,i) => b.addEventListener('click', () => showExpTab(i)));
    window.addEventListener('resize', () => moveExpIndicator(expBtns.find(b => b.classList.contains('active'))));
    requestAnimationFrame(() => moveExpIndicator(expBtns[0]));
  }

  /* Scrollspy nav */
  const navLinks = document.querySelectorAll('nav.main-nav a');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* Counters */
  const counters = document.querySelectorAll('.counter');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let cur = 0;
        const step = Math.max(1, Math.round(target/40));
        const tick = () => {
          cur += step;
          if(cur >= target){ el.textContent = target; return; }
          el.textContent = cur;
          requestAnimationFrame(tick);
        };
        tick();
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => countObserver.observe(c));

  /* Reuse the program-card structure for expertise cards */
  const homepagePrograms = [
    ['สนามเป้า','SANAMPAO','โปรแกรมประเมินสุขภาพและอายุชีวภาพ','Biological Age & Longevity Assessment','มองเห็นความเสี่ยงก่อนเกิดโรค และประเมินความสมดุลของร่างกายในระดับที่ลึกกว่าการตรวจสุขภาพทั่วไป','See risks before symptoms and evaluate whole-body balance beyond a standard checkup.','assets/images/treatments/expertise-longevity.jpg',24500],
    ['พหลโยธิน','PHAHOLYOTHIN','โปรแกรมตรวจสมดุลฮอร์โมนเชิงลึก','Advanced Hormone Balance','ค้นหาสาเหตุของความเหนื่อยล้า นอนหลับไม่เต็มอิ่ม น้ำหนักเปลี่ยน หรืออารมณ์แปรปรวน','Explore the causes of fatigue, poor sleep, weight changes, and mood fluctuations.','assets/images/treatments/specialist-1.jpg',20000],
    ['ศรีอยุธยา','SRI AYUDHAYA','โปรแกรมประเมินความเสี่ยงหัวใจและหลอดเลือด','Advanced Cardiovascular Risk','วิเคราะห์ปัจจัยเสี่ยงซ่อนเร้น ตั้งแต่ไขมันอนุภาคเล็ก ภาวะอักเสบ ไปจนถึงสมรรถนะการไหลเวียน','Analyze hidden risks from advanced lipids and inflammation to circulatory performance.','assets/images/hero/herobg03.png',18500],
    ['เพชรเกษม 19','PETCHAKASEM 19','โปรแกรมวิเคราะห์สุขภาพผิวและเส้นผม','Skin & Hair Health Analysis','ประเมินปัจจัยภายในที่ส่งผลต่อผิวหมอง ริ้วรอย ผมบาง และการฟื้นตัวของผิว','Assess internal factors behind dullness, aging, hair thinning, and skin recovery.','assets/images/treatments/expertise-skin.jpg',15500],
    ['ศรีราชา','SRIRACHA','โปรแกรมสุขภาพผู้หญิงตามช่วงวัย',"Women's Life-stage Health",'ดูแลสุขภาพในทุกการเปลี่ยนแปลง ตั้งแต่วัยทำงาน การวางแผนครอบครัว จนถึงวัยแห่งสมดุลใหม่','Care through every transition, from working life and family planning to a new stage of balance.','assets/images/treatments/pragnent.png',17500],
    ['สนามเป้า','SANAMPAO','โปรแกรมวิเคราะห์พันธุกรรมเพื่อสุขภาพ','Precision Genetic Health','ถอดรหัสแนวโน้มสุขภาพ การตอบสนองต่ออาหาร การออกกำลังกาย และยาบางกลุ่มจากข้อมูลพันธุกรรม','Decode health tendencies and responses to nutrition, exercise, and selected medications.','assets/images/treatments/specialist-3.jpg',32000],
    ['พหลโยธิน','PHAHOLYOTHIN','โปรแกรมประเมินสุขภาพระดับเซลล์','Cellular Health Assessment','วิเคราะห์ภาวะเครียดออกซิเดชันและประสิทธิภาพการทำงานของเซลล์','Assess oxidative stress and cellular performance.','assets/images/treatments/expertise-longevity.jpg',22500],
    ['ศรีอยุธยา','SRI AYUDHAYA','โปรแกรมตรวจเมตาบอลิซึมและภาวะดื้ออินซูลิน','Metabolic & Insulin Resistance Check','ค้นหาความเสี่ยงเบาหวานและสาเหตุที่ทำให้ควบคุมน้ำหนักได้ยาก','Identify diabetes risk and barriers to healthy weight control.','assets/images/treatments/specialist-1.jpg',16500],
    ['เพชรเกษม 19','PETCHAKASEM 19','โปรแกรมตรวจสมรรถภาพหัวใจสำหรับผู้รักการออกกำลัง','Active Heart Performance','ประเมินความพร้อมของหัวใจและระบบไหลเวียนก่อนวางแผนออกกำลังกาย','Evaluate cardiovascular readiness before an exercise plan.','assets/images/hero/herobg03.png',19500],
    ['ศรีราชา','SRIRACHA','โปรแกรมวิเคราะห์ผิวเสื่อมก่อนวัย','Premature Skin Aging Analysis','ค้นหาปัจจัยภายในที่เร่งริ้วรอย ความแห้ง และการสูญเสียคอลลาเจน','Find internal drivers of wrinkles, dryness, and collagen loss.','assets/images/treatments/expertise-skin.jpg',14500],
    ['สนามเป้า','SANAMPAO','โปรแกรมสุขภาพผู้หญิงวัย 35+','Women 35+ Health Program','ประเมินฮอร์โมน ภาวะขาดสารอาหาร และความเสี่ยงตามช่วงวัย','Review hormones, nutrient status, and age-related risks.','assets/images/treatments/pragnent.png',18500],
    ['พหลโยธิน','PHAHOLYOTHIN','โปรแกรมประเมินภูมิคุ้มกันและการอักเสบ','Immune & Inflammation Balance','วิเคราะห์ภูมิคุ้มกันและภาวะอักเสบเรื้อรังที่อาจส่งผลต่อสุขภาพระยะยาว','Analyze immune balance and chronic inflammation affecting long-term health.','assets/images/treatments/specialist-3.jpg',23500],
    ['ศรีอยุธยา','SRI AYUDHAYA','โปรแกรมตรวจต่อมไทรอยด์เชิงลึก','Advanced Thyroid Assessment','ตรวจการทำงานของไทรอยด์อย่างละเอียดสำหรับผู้มีอาการเหนื่อยง่ายหรือควบคุมน้ำหนักยาก','Detailed thyroid assessment for fatigue and weight concerns.','assets/images/treatments/specialist-1.jpg',12500],
    ['เพชรเกษม 19','PETCHAKASEM 19','โปรแกรมประเมินอายุหลอดเลือด','Vascular Age Assessment','ประเมินความยืดหยุ่นของหลอดเลือดและความเสี่ยงโรคหัวใจในอนาคต','Measure vascular flexibility and future cardiovascular risk.','assets/images/hero/herobg03.png',17500],
    ['ศรีราชา','SRIRACHA','โปรแกรมตรวจสาเหตุผมร่วงเชิงลึก','Advanced Hair Loss Analysis','วิเคราะห์ฮอร์โมน สารอาหาร และปัจจัยสุขภาพที่เกี่ยวข้องกับผมร่วง','Analyze hormonal, nutritional, and health factors behind hair loss.','assets/images/treatments/expertise-skin.jpg',13900],
    ['สนามเป้า','SANAMPAO','โปรแกรมดูแลสุขภาพวัยทองแบบองค์รวม','Complete Menopause Care','ประเมินฮอร์โมน กระดูก หัวใจ และการนอนหลับเพื่อการดูแลวัยทองอย่างสมดุล','Review hormones, bones, heart, and sleep for balanced menopause care.','assets/images/treatments/pragnent.png',18900]
  ];
  const programsPerPanel = 4;
  function renderProgramCard(program, programIndex){
    const [branchTh,branchEn,titleTh,titleEn,descriptionTh,descriptionEn,image,price] = program;
    const href = `program_detail.html?id=pv${String(programIndex + 1).padStart(2,'0')}`;
    const formattedPrice = price.toLocaleString('en-US');

    return `<div class="program-card">
      <div class="card-visual"><a href="${href}" aria-label="${titleTh}"><img src="${image}" alt="${titleTh}"></a></div>
      <div class="card-body">
        <div class="program-branch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
          <span class="program-branch__text"><span class="program-branch__brand">PHIVARA</span><span class="program-branch__name" data-th="${branchTh}" data-en="${branchEn}">${branchTh}</span></span>
        </div>
        <h4><a class="card-title-link" href="${href}" data-th="${titleTh}" data-en="${titleEn}">${titleTh}</a></h4>
        <p data-th="${descriptionTh}" data-en="${descriptionEn}">${descriptionTh}</p>
        <div class="card-foot">
          <span data-th="${formattedPrice}" data-en="${formattedPrice}">${formattedPrice}</span>
          <a class="card-link" href="${href}" data-th="รายละเอียด →" data-en="Details →">รายละเอียด →</a>
        </div>
      </div>
    </div>`;
  }

  document.querySelectorAll('.exp-panel').forEach((panel, panelIndex) => {
    const grid = panel.querySelector('.exp-card-grid');
    if(!grid) return;
    const startIndex = panelIndex * programsPerPanel;
    grid.innerHTML = homepagePrograms
      .slice(startIndex, startIndex + programsPerPanel)
      .map((program, cardIndex) => renderProgramCard(program, startIndex + cardIndex))
      .join('');
  });

  /* Shared journal data and card template */
  const journalArticles = [
    {
      id:'blue-ocean-pathway',
      image:'assets/images/doctors/jr-02.png',
      alt:'What is the Blue Ocean Pathway?',
      categoryTh:'เวชศาสตร์อายุยืนยาว',
      categoryEn:'LONGEVITY',
      titleTh:'Blue Ocean Pathway คืออะไร และช่วยออกแบบสุขภาพอย่างไร',
      titleEn:'What Is the Blue Ocean Pathway?',
      summaryTh:'ทำความรู้จักแนวทางวิเคราะห์สุขภาพเชิงลึก เพื่อวางแผนป้องกันก่อนเกิดโรค',
      summaryEn:'A deeper approach to health analysis and proactive prevention.',
      dateTh:'28 พฤษภาคม 2569',
      dateEn:'28 May 2026',
      readTimeTh:'5 นาที',
      readTimeEn:'5 min'
    },
    {
      id:'skin-care-tips',
      image:'assets/images/doctors/jr-03.png',
      alt:'Skin Care Tips from Our Specialists',
      categoryTh:'สุขภาวะเชิงความงาม',
      categoryEn:'AESTHETIC WELLNESS',
      titleTh:'เคล็ดลับดูแลผิวจากแพทย์ผู้เชี่ยวชาญในทุกช่วงวัย',
      titleEn:'Specialist Skin-Care Tips for Every Age',
      summaryTh:'หลักสำคัญในการเลือกผลิตภัณฑ์และหัตถการให้เหมาะกับสภาพผิวที่เปลี่ยนไป',
      summaryEn:'How to choose products and treatments as your skin evolves.',
      dateTh:'15 พฤษภาคม 2569',
      dateEn:'15 May 2026',
      readTimeTh:'7 นาที',
      readTimeEn:'7 min'
    },
    {
      id:'hormone-balance',
      image:'assets/images/hero/herobg04.png',
      alt:'Hormone Balance and Longevity',
      categoryTh:'เวชศาสตร์อายุยืนยาว',
      categoryEn:'LONGEVITY',
      titleTh:'สมดุลฮอร์โมนกับความอ่อนเยาว์ที่ยั่งยืน',
      titleEn:'Hormone Balance and Lasting Youth',
      summaryTh:'สัญญาณที่ร่างกายกำลังบอก และบทบาทของการตรวจสุขภาพเฉพาะบุคคล',
      summaryEn:'The signals your body sends and the role of personalized screening.',
      dateTh:'2 พฤษภาคม 2569',
      dateEn:'2 May 2026',
      readTimeTh:'8 นาที',
      readTimeEn:'8 min'
    }
  ];
  const journalGrid = document.getElementById('journalGrid');
  journalGrid.innerHTML = journalArticles.map((article,index) => {
    const href = `article_detail.html?id=${article.id}`;
    return `<article class="journal-card s-item" style="transition-delay:${index * 0.1}s">
      <a class="journal-card__media" href="${href}"><img class="journal-card__image" src="${article.image}" alt="${article.alt}"></a>
      <div class="journal-card__body">
        <span class="journal-card__tag" data-th="${article.categoryTh}" data-en="${article.categoryEn}">${article.categoryTh}</span>
        <h3><a href="${href}" data-th="${article.titleTh}" data-en="${article.titleEn}">${article.titleTh}</a></h3>
        <p data-th="${article.summaryTh}" data-en="${article.summaryEn}">${article.summaryTh}</p>
        <div class="journal-card__footer">
          <div class="journal-card__meta">
            <span data-th="${article.dateTh}" data-en="${article.dateEn}">${article.dateTh}</span>
            <span class="dot"></span>
            <span data-th="${article.readTimeTh}" data-en="${article.readTimeEn}">${article.readTimeTh}</span>
          </div>
          <a class="journal-card__link" href="${href}" data-th="อ่านต่อ →" data-en="Read More →">อ่านต่อ →</a>
        </div>
      </div>
    </article>`;
  }).join('');

  /* Shared award data and card template */
  const awards = [
    {
      image:'assets/images/awards/award-01.png',
      alt:'COVID Management Initiative of the Year - Thailand, Healthcare Asia Awards 2022',
      captionTh:'COVID Management Initiative of the Year - Thailand · Healthcare Asia Awards 2022',
      captionEn:'COVID Management Initiative of the Year - Thailand · Healthcare Asia Awards 2022'
    },
    {
      image:'assets/images/awards/award-02.png',
      alt:'Gold Stevie Award, Excellence in Innovation - Health Care Industry, Asia-Pacific Stevie Awards 2026',
      captionTh:'Gold Stevie Award ด้านนวัตกรรมทางการแพทย์ · Asia-Pacific Stevie Awards 2026',
      captionEn:'Gold Stevie Award, Excellence in Innovation - Health Care Industry · Asia-Pacific Stevie Awards 2026'
    },
    {
      image:'assets/images/awards/award-03.png',
      alt:'Asia-Pacific Stevie Awards 2026 medallion',
      captionTh:'เหรียญรางวัล Asia-Pacific Stevie Awards 2026',
      captionEn:'Asia-Pacific Stevie Awards 2026'
    },
    {
      image:'assets/images/awards/award-04.png',
      alt:'Dental Clinic of the Year - Thailand, Healthcare Asia Awards 2026',
      captionTh:'Dental Clinic of the Year - Thailand · Healthcare Asia Awards 2026',
      captionEn:'Dental Clinic of the Year - Thailand · Healthcare Asia Awards 2026'
    },
    {
      image:'assets/images/awards/award-05.png',
      alt:'Health Promotion Initiative of the Year - Thailand, Healthcare Asia Awards 2025',
      captionTh:'Health Promotion Initiative of the Year - Thailand · Healthcare Asia Awards 2025',
      captionEn:'Health Promotion Initiative of the Year - Thailand · Healthcare Asia Awards 2025'
    },
    {
      image:'assets/images/awards/award-06.png',
      alt:'Fertility Centre of the Year in Asia Pacific, GlobalHealth Asia-Pacific Awards 2022',
      captionTh:'Fertility Centre of the Year in Asia Pacific · GlobalHealth Asia-Pacific Awards 2022',
      captionEn:'Fertility Centre of the Year in Asia Pacific · GlobalHealth Asia-Pacific Awards 2022'
    },
    {
      image:'assets/images/awards/award-07.jpeg',
      alt:'Dental Medical Centre of the Year in the Asia Pacific, GlobalHealth Asia-Pacific Awards 2021',
      captionTh:'Dental Medical Centre of the Year in the Asia Pacific · GlobalHealth Asia-Pacific Awards 2021',
      captionEn:'Dental Medical Centre of the Year in the Asia Pacific · GlobalHealth Asia-Pacific Awards 2021'
    },
    {
      image:'assets/images/awards/award-08.jpeg',
      alt:'Integrated Health and Wellness Service Provider of the Year in the Asia-Pacific, GlobalHealth Asia-Pacific Awards 2021',
      captionTh:'Integrated Health and Wellness Service Provider of the Year in the Asia-Pacific · GlobalHealth Asia-Pacific Awards 2021',
      captionEn:'Integrated Health and Wellness Service Provider of the Year in the Asia-Pacific · GlobalHealth Asia-Pacific Awards 2021'
    },
    {
      image:'assets/images/awards/award-09.png',
      alt:'Health and Wellness Initiative of the Year - Thailand, Healthcare Asia Awards 2025',
      captionTh:'Health and Wellness Initiative of the Year - Thailand · Healthcare Asia Awards 2025',
      captionEn:'Health and Wellness Initiative of the Year - Thailand · Healthcare Asia Awards 2025'
    },
    {
      image:'assets/images/awards/award-10.png',
      alt:'Integrated Health and Wellness Service Provider of the Year in Asia Pacific, GlobalHealth Asia-Pacific Awards 2022',
      captionTh:'Integrated Health and Wellness Service Provider of the Year in Asia Pacific · GlobalHealth Asia-Pacific Awards 2022',
      captionEn:'Integrated Health and Wellness Service Provider of the Year in Asia Pacific · GlobalHealth Asia-Pacific Awards 2022'
    }
  ];
  const awardTrack = document.getElementById('awardTrack');
  awardTrack.innerHTML = awards.map(award => `
    <div class="award-card">
      <div class="photo-wrap"><img class="ph-photo" src="${award.image}" alt="${award.alt}" onerror="this.hidden=true"></div>
      <p class="award-caption" data-th="${award.captionTh}" data-en="${award.captionEn}">${award.captionTh}</p>
    </div>
  `).join('');

  /* Awards carousel */
  (function(){
    const track = awardTrack;
    const viewport = track && track.parentElement;
    const cards = track ? Array.from(track.children) : [];
    const prevBtn = document.getElementById('awardPrev');
    const nextBtn = document.getElementById('awardNext');
    const dotsWrap = document.getElementById('awardDots');
    if(!track || !cards.length) return;

    let visible = 1, maxIndex = 0, index = 0, timer = null;

    function getVisible(){
      const w = window.innerWidth;
      if(w <= 640) return 1;
      if(w <= 1024) return 2;
      return 4;
    }

    function buildDots(){
      dotsWrap.innerHTML = '';
      for(let i=0; i<=maxIndex; i++){
        const b = document.createElement('button');
        b.dataset.i = i;
        b.addEventListener('click', () => { goTo(i); restart(); });
        dotsWrap.appendChild(b);
      }
    }

    function updateDots(){
      Array.from(dotsWrap.children).forEach((d,i) => d.classList.toggle('active', i===index));
    }

    function update(){
      const step = cards[0].getBoundingClientRect().width + 28;
      track.style.transform = `translateX(${-index*step}px)`;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === maxIndex;
      updateDots();
    }

    function goTo(i){
      index = Math.max(0, Math.min(maxIndex, i));
      update();
    }

    function layout(){
      visible = getVisible();
      maxIndex = Math.max(0, cards.length - visible);
      index = Math.min(index, maxIndex);
      buildDots();
      update();
    }

    function restart(){
      clearInterval(timer);
      timer = setInterval(() => goTo(index >= maxIndex ? 0 : index+1), 5000);
    }

    prevBtn.addEventListener('click', () => { goTo(index-1); restart(); });
    nextBtn.addEventListener('click', () => { goTo(index+1); restart(); });
    window.addEventListener('resize', layout);

    layout();
    restart();
  })();

  /* Branch content comes from the same shared source as the footer. */
  const branches = window.PhivaraSiteShell.branches;
  const flagshipRail = document.getElementById('flagshipRail');
  const flagshipSlides = document.getElementById('flagshipSlides');

  flagshipRail.innerHTML = branches.map((branch,index) => `
    <button class="flagship-nav-btn${index === 0 ? ' active' : ''}" type="button" role="tab"
      id="flagshipTab${index}" aria-controls="flagshipPanel${index}" aria-selected="${index === 0}" data-slide="${index}">
      <span class="flagship-nav-index">${String(index + 1).padStart(2, '0')}</span>
      <span data-th="PHIVARA ${branch.nameTh}" data-en="PHIVARA ${branch.nameEn}">PHIVARA ${branch.nameTh}</span>
    </button>
  `).join('');

  flagshipSlides.innerHTML = branches.map((branch,index) => `
    <article class="flagship-slide${index === 0 ? ' active' : ''}" id="flagshipPanel${index}"
      role="tabpanel" aria-labelledby="flagshipTab${index}" aria-hidden="${index !== 0}" data-slide="${index}">
      <div class="flagship-body">
        <div class="flagship-media">
          <img src="${branch.image}" alt="PHIVARA ${branch.nameEn} — ${branch.titleEn}">
          <div class="flagship-image-label" aria-hidden="true">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <span>PHIVARA ${branch.nameEn}</span>
          </div>
        </div>
        <div class="flagship-text">
          <div class="flagship-location" data-th="PHIVARA ${branch.nameTh}" data-en="PHIVARA ${branch.nameEn}">PHIVARA ${branch.nameTh}</div>
          <h3 data-th="${branch.titleTh}" data-en="${branch.titleEn}">${branch.titleTh}</h3>
          <p data-th="${branch.descriptionTh}" data-en="${branch.descriptionEn}">${branch.descriptionTh}</p>
          <a href="branch-${branch.id}.html" class="arrow-link flagship-link">
            <span data-th="อ่านข้อมูลสาขา" data-en="Read branch details">อ่านข้อมูลสาขา</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
    </article>
  `).join('');

  /* Flagship branch slideshow */
  (function(){
    const wrap = flagshipSlides;
    if(!wrap) return;
    const slides = Array.from(wrap.querySelectorAll('.flagship-slide'));
    const rail = flagshipRail;
    const thumbs = rail ? Array.from(rail.querySelectorAll('.flagship-nav-btn')) : [];
    if(!slides.length) return;

    let index = 0, timer = null;

    function update(){
      slides.forEach((s,i) => {
        s.classList.toggle('active', i === index);
        s.setAttribute('aria-hidden', i !== index);
      });
      thumbs.forEach((t,i) => {
        t.classList.toggle('active', i === index);
        t.setAttribute('aria-selected', i === index);
        t.tabIndex = i === index ? 0 : -1;
      });
      const activeThumb = thumbs[index];
      if(activeThumb && rail.scrollWidth > rail.clientWidth){
        const targetLeft = activeThumb.offsetLeft - (rail.clientWidth - activeThumb.offsetWidth) / 2;
        rail.scrollTo({ left:targetLeft, behavior:reduceMotion ? 'auto' : 'smooth' });
      }
    }

    function goTo(i){
      index = (i + slides.length) % slides.length;
      update();
    }

    function restart(){
      clearInterval(timer);
      if(reduceMotion) return;
      timer = setInterval(() => goTo(index+1), 8500);
    }

    thumbs.forEach((t,i) => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(i);
        restart();
      });
      t.addEventListener('keydown', (e) => {
        if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        const next = e.key === 'ArrowRight' ? i + 1 : i - 1;
        const nextIndex = (next + thumbs.length) % thumbs.length;
        goTo(nextIndex);
        thumbs[nextIndex].focus();
        restart();
      });
    });

    update();
    restart();
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', () => { if(!reduceMotion) restart(); });
    wrap.addEventListener('focusin', () => clearInterval(timer));
    wrap.addEventListener('focusout', () => { if(!reduceMotion) restart(); });
  })();

  /* Specialists Carousel */
  (function(){
    const specTrack = document.getElementById('specTrack');
    const specPrev = document.getElementById('specPrev');
    const specNext = document.getElementById('specNext');
    const specDots = document.getElementById('specDots');
    if(!specTrack || !specPrev || !specNext) return;

    const doctorProfiles = [
      { id:'dr02', image:'assets/images/doctors/dr02.png', branchTh:'พหลโยธิน', branchEn:'PHAHOLYOTHIN', nameTh:'พญ. กอบกุลยา จึงประเสริฐศรี', nameEn:'Dr. Kobkulya Juengprasertsri', noteTh:'ผู้อำนวยการศูนย์เวชศาสตร์ชะลอวัย', noteEn:'Medical Director, Anti-Aging Center', subTh:'แพทย์ผู้เชี่ยวชาญเวชศาสตร์ชะลอวัยและการแพทย์ป้องกัน', subEn:'Anti-Aging & Regenerative Medicine Specialist' },
      { id:'dr01', image:'assets/images/doctors/dr01.png', branchTh:'ศรีราชา', branchEn:'SRIRACHA', nameTh:'นพ.ดุลยณัฐ อรัญยะปาล', nameEn:'Dr. Dulyanat Aranyapal', noteTh:'แพทย์ประจำศูนย์ศัลยกรรมตกแต่ง โรงพยาบาลพญาไทศรีราชา', noteEn:'Plastic Surgery Center, Phyathai Sriracha Hospital', subTh:'วุฒิบัตรศัลยศาสตร์ตกแต่ง · คณะแพทยศาสตร์ศิริราชพยาบาล', subEn:'Board Certified in Plastic Surgery · Faculty of Medicine Siriraj Hospital' },
      { id:'dr03', image:'assets/images/treatments/specialist-2.jpg', branchTh:'ศรีอยุธยา', branchEn:'SRI AYUDHAYA', nameTh:'นพ. ธนกฤต วิเศษกุล', nameEn:'Dr. Thanakrit Visetkul', noteTh:'ตรวจรักษาโรคผิวหนังและเลเซอร์ความงาม', noteEn:'Dermatology & Laser Aesthetics', subTh:'วุฒิบัตรตรวจรักษาโรคผิวหนัง · ศิริราชพยาบาล', subEn:'Board Certified Dermatologist · Siriraj Hospital' },
      { id:'dr04', image:'assets/images/hero/herobg03.png', branchTh:'เพชรเกษม 19', branchEn:'PETCHAKASEM 19', nameTh:'พญ. ณิชานันท์ อัศวเสนา', nameEn:'Dr. Nichanan Atsawasena', noteTh:'สุขภาวะเชิงความงามและการฟื้นฟู', noteEn:'Aesthetic Wellness & Rehabilitation', subTh:'ผู้เชี่ยวชาญด้านเวชศาสตร์ฟื้นฟูและองค์รวม', subEn:'Rehabilitation & Holistic Wellness Specialist' },
      { id:'dr05', image:'assets/images/treatments/specialist-1.jpg', branchTh:'ศรีราชา', branchEn:'SRIRACHA', nameTh:'นพ. ภัทรดนัย ชัยวัฒน์', nameEn:'Dr. Pattaradanai Chaiwat', noteTh:'สุขภาพและความงามสำหรับผู้ชาย', noteEn:"Men's Health & Aesthetic Programs", subTh:'ผู้เชี่ยวชาญด้านฮอร์โมนและสุขภาพบุรุษ', subEn:"Men's Health & Hormone Specialist" },
      { id:'dr06', image:'assets/images/doctors/dr01.png', branchTh:'สนามเป้า', branchEn:'SANAMPAO', nameTh:'นพ. ปรเมษฐ์ สุจริตตานนท์', nameEn:'Dr. Poramet Sutcharittanon', noteTh:'ศัลยกรรมจมูกและปรับโครงหน้าชั้นลึก', noteEn:'Rhinoplasty & Facial Contouring', subTh:'Fellowship in Facial Reconstruction (South Korea)', subEn:'Fellowship in Facial Surgery (South Korea)' },
      { id:'dr07', image:'assets/images/doctors/dr02.png', branchTh:'พหลโยธิน', branchEn:'PHAHOLYOTHIN', nameTh:'พญ. ชลทิชา วงศ์สว่าง', nameEn:'Dr. Chonticha Vongsawat', noteTh:'ฟื้นฟูสุขภาพระดับเซลล์และฮอร์โมน', noteEn:'Cellular & Hormone Regeneration', subTh:'ปริญญาโทเวชศาสตร์ชะลอวัย · ม.แม่ฟ้าหลวง', subEn:'MSc Anti-Aging Medicine · Mae Fah Luang Univ.' },
      { id:'dr08', image:'assets/images/treatments/specialist-3.jpg', branchTh:'ศรีอยุธยา', branchEn:'SRI AYUDHAYA', nameTh:'พญ. ศิรินภา ปัญญาวงศ์', nameEn:'Dr. Sirinapa Panyawong', noteTh:'หัตถการฉีดสารเติมเต็มและปรับรูปหน้า', noteEn:'Facial Lifting & Injectables', subTh:'National Certified Trainer for Dermal Fillers', subEn:'Certified National Trainer in Injectables' },
      { id:'dr09', image:'assets/images/hero/herobg04.png', branchTh:'เพชรเกษม 19', branchEn:'PETCHAKASEM 19', nameTh:'นพ. กฤษดา เมธาการ', nameEn:'Dr. Kritsada Methakarn', noteTh:'โภชนบำบัดและการชะลอวัยเชิงลึก', noteEn:'Nutritional Therapy & Anti-Aging', subTh:'Certified Functional Medicine Practitioner (IFMCP)', subEn:'Certified Functional Medicine Practitioner (IFMCP)' },
      { id:'dr10', image:'assets/images/brand/about-lounge.jpg', branchTh:'ศรีราชา', branchEn:'SRIRACHA', nameTh:'นพ. พงศกร วรเวช', nameEn:'Dr. Pongsakorn Woravech', noteTh:'ศัลยกรรมกระชับสัดส่วนและดูดไขมัน', noteEn:'Body Contouring & Liposuction', subTh:'สมาชิกสมาคมศัลยกรรมตกแต่งแห่งประเทศไทย', subEn:'Thai Plastic Surgery Association Member' }
    ];
    function renderDoctorCard(profile){
      const profileHref = `doctor_detail.html?id=${profile.id}`;
      return `<div class="spec-card">
        <div class="photo-wrap"><a href="${profileHref}" aria-label="${profile.nameTh}"><img class="ph-photo" src="${profile.image}" alt="${profile.nameTh}"></a></div>
        <div class="program-branch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
          <span class="program-branch__text"><span class="program-branch__brand">PHIVARA</span><span class="program-branch__name" data-th="${profile.branchTh}" data-en="${profile.branchEn}">${profile.branchTh}</span></span>
        </div>
        <h3><a href="${profileHref}" data-th="${profile.nameTh}" data-en="${profile.nameEn}">${profile.nameTh}</a></h3>
        <p class="note" data-th="${profile.noteTh}" data-en="${profile.noteEn}">${profile.noteTh}</p>
        <div class="spec-subnote" data-th="${profile.subTh}" data-en="${profile.subEn}">${profile.subTh}</div>
        <div class="card-actions">
          <a class="btn-doc-detail" href="${profileHref}" data-th="ดูประวัติแพทย์" data-en="View Profile">ดูประวัติแพทย์</a>
          <a href="#contact" class="go vip-trigger" data-doc-name="${profile.nameTh}" data-th="จองปรึกษา →" data-en="Book →">จองปรึกษา →</a>
        </div>
      </div>`;
    }

    specTrack.innerHTML = doctorProfiles.map(renderDoctorCard).join('');
    const cards = specTrack.querySelectorAll('.spec-card');
    let currentIndex = 0;

    function getItemsPerPage(){
      const w = window.innerWidth;
      if(w <= 560) return 1;
      if(w <= 768) return 2;
      if(w <= 1100) return 3;
      return 4;
    }

    function getMaxIndex(){
      const itemsPerPage = getItemsPerPage();
      return Math.max(0, Math.ceil(cards.length / itemsPerPage) - 1);
    }

    function renderDots(){
      if(!specDots) return;
      specDots.innerHTML = '';
      const totalPages = getMaxIndex() + 1;
      if(totalPages <= 1) return;
      for(let i = 0; i < totalPages; i++){
        const dot = document.createElement('button');
        dot.className = `spec-dot ${i === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Page ${i+1}`);
        dot.addEventListener('click', () => goToPage(i));
        specDots.appendChild(dot);
      }
    }

    function updateCarousel(){
      const itemsPerPage = getItemsPerPage();
      const maxIndex = getMaxIndex();
      if(currentIndex > maxIndex) currentIndex = maxIndex;
      if(currentIndex < 0) currentIndex = 0;

      const gap = 20;
      const cardWidth = cards[0] ? cards[0].offsetWidth : 0;
      const shiftAmount = (cardWidth + gap) * itemsPerPage * currentIndex;

      specTrack.style.transform = `translateX(-${shiftAmount}px)`;
      specPrev.disabled = currentIndex === 0;
      specNext.disabled = currentIndex >= maxIndex;

      if(specDots){
        const dots = specDots.querySelectorAll('.spec-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function goToPage(index){
      currentIndex = index;
      updateCarousel();
    }

    specPrev.addEventListener('click', () => {
      if(currentIndex > 0){
        currentIndex--;
        updateCarousel();
      }
    });

    specNext.addEventListener('click', () => {
      if(currentIndex < getMaxIndex()){
        currentIndex++;
        updateCarousel();
      }
    });

    renderDots();
    updateCarousel();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderDots();
        updateCarousel();
      }, 100);
    });
  })();

  /* Soft ambient light follows the pointer on desktop */
  if(window.matchMedia('(pointer:fine)').matches && !reduceMotion){
    const orb = document.createElement('div');
    orb.className = 'ambient-orb';
    document.body.appendChild(orb);
    let orbFrame = null;
    window.addEventListener('pointermove', (e) => {
      if(orbFrame) return;
      orbFrame = requestAnimationFrame(() => {
        orb.style.left = e.clientX + 'px';
        orb.style.top = e.clientY + 'px';
        orb.classList.add('visible');
        orbFrame = null;
      });
    }, { passive:true });
    document.documentElement.addEventListener('mouseleave', () => orb.classList.remove('visible'));
  }

  /* Custom cursor (pointer devices only) */
  if(window.matchMedia('(pointer:fine)').matches && !reduceMotion){
    const ring = document.getElementById('cursorRing');
    document.body.classList.add('has-cursor');
    let mx=0,my=0, rx=0, ry=0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; ring.classList.add('show'); });
    function loop(){ rx += (mx-rx)*.2; ry += (my-ry)*.2; ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); }
    loop();
    document.querySelectorAll('a, button, .program-card, .spec-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });

    /* Hero parallax */
    const heroContent = document.getElementById('heroContent');
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - .5;
      const py = (e.clientY - r.top)/r.height - .5;
      heroContent.style.transform = `translate(${px*-14}px, ${py*-8}px)`;
    });

    /* Magnetic buttons */
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * .28;
        const y = (e.clientY - r.top - r.height/2) * .5;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });

    /* Card tilt */
    document.querySelectorAll('.tilt-target').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width - .5;
        const py = (e.clientY - r.top)/r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${py*-6}deg) rotateY(${px*8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)'; });
    });
  }
