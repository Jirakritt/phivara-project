  /* Homepage interactions and dynamic content */
  // Content that now lives in Payload CMS is injected server-side as
  // window.__PHIVARA_DATA__ (see src/lib/homeData.ts + the Home page
  // component). Falls back to an empty shape so this file never throws if
  // a page forgets to inject it.
  const cmsData = window.__PHIVARA_DATA__ || {};
  // Strings for the handful of hardcoded microcopy/category-title bits
  // below that aren't part of window.__PHIVARA_DATA__ — injected by
  // page.tsx via t()/UI_DICTIONARY, same mechanism as vip-modal.js's
  // window.__PHIVARA_VIP_MODAL__ (see that file's comment for why this
  // exists — the old data-th/data-en swap here never actually ran).
  // FALLBACK (Thai) only used if that global is somehow missing.
  const mainStrings = Object.assign({
    viewAllPrograms: 'ดูโปรแกรมทั้งหมด',
    programDetails: 'รายละเอียด →',
    noPrograms: 'ยังไม่มีโปรแกรมในหมวดนี้ในขณะนี้',
    readMore: 'อ่านต่อ →',
    readBranchDetails: 'อ่านข้อมูลสาขา',
    viewProfile: 'ดูประวัติแพทย์',
    book: 'จองปรึกษา →',
    categoryTitles: {
      plastic: 'ศิลปะการจัดแต่งสัดส่วน',
      longevity: 'ศิลปะแห่งกาลเวลา',
      dermatology: 'ศิลปะแห่งผิวเปล่งประกาย',
      wellness: 'ศิลปะแห่งความสมดุล',
    },
  }, window.__PHIVARA_MAIN_STRINGS__ || {});
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

/* Preloader.
   This script now loads via Next.js's `afterInteractive` strategy, which
   isn't guaranteed to run before the window 'load' event fires (unlike the
   original plain `defer` script tag) — so if 'load' already happened by
   the time we get here, hide the preloader immediately instead of waiting
   for an event that will never fire again. */
  (function hidePreloaderWhenReady(){
    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('done');
    };
    if (document.readyState === 'complete') {
      setTimeout(hide, reduceMotion ? 80 : 1150);
    } else {
      window.addEventListener('load', () => setTimeout(hide, reduceMotion ? 80 : 1150));
      // Safety net — never leave the preloader stuck if 'load' is delayed
      // or suppressed by a slow/blocked resource.
      setTimeout(hide, 4000);
    }
  })();

  /* Hero background slideshow images — now sourced from the `home-hero`
     Payload Global (window.__PHIVARA_DATA__.hero.backgroundImages, injected
     by src/app/(frontend)/page.tsx) instead of a hardcoded list, so staff
     can change the rotation from the CMS. Falls back to the original
     hardcoded set only if that data is ever missing/empty. */
  const cmsHeroImages = (window.__PHIVARA_DATA__ && window.__PHIVARA_DATA__.hero && window.__PHIVARA_DATA__.hero.backgroundImages) || [];
  const heroImages = cmsHeroImages.length ? cmsHeroImages : [
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

  /* Hero headline word-mask build.
     lang now defaults to document.documentElement.lang, which the server
     sets correctly per-request via <html lang={locale}> (see
     src/app/(frontend)/[locale]/layout.tsx) — previously this was
     hardcoded to 'th' on every page load regardless of language, and only
     ever corrected itself if a visitor manually clicked the old JS
     #langToggle (removed — see SiteHeader.tsx). Falls back to the
     server-rendered text already sitting in #heroHeadline (see
     page.tsx's t(data.hero.headlineTh, data.hero.headlineEn)) if somehow
     neither data-th nor data-en is present, instead of leaving it blank. */
  function buildHeroHeadline(lang = document.documentElement.lang || 'th'){
    const el = document.getElementById('heroHeadline');
    if (!el) return;
    const text = el.getAttribute('data-' + lang) || el.textContent || '';
    if (!text) return;
    const words = text.split(' ');
    el.innerHTML = words.map((w,i) => `<span class="word-mask"><span class="word" style="animation-delay:${reduceMotion ? 0 : 0.35 + i*0.075}s">${w}</span></span>`).join(' ');
  }
  buildHeroHeadline();

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

  /* Language toggle removed (i18n Phase 2) — language is now a real URL
     segment (/th/..., /en/...) picked via real <a> links in SiteHeader.tsx's
     .lang-toggle, not a client-side text swap. buildHeroHeadline() above
     already reads the correct language from document.documentElement.lang,
     which the server sets per-request — no client-side re-run needed. */

  /* Reveal + stagger observer */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in'); } });
  }, { threshold: 0.12, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.stagger').forEach(group => {
    Array.from(group.children).forEach((child,i) => { child.style.transitionDelay = (i*0.1)+'s'; });
  });

  /* Shared expertise category data and panel template.
     `key` maps each pillar to the matching Programs.category value in
     Payload so the card grid below can filter real programs per tab. */
  const expertiseCategories = [
    { key:'plastic', label:'Plastic Surgery', tag:'The Art of Form', title: mainStrings.categoryTitles.plastic },
    { key:'longevity', label:'Anti-Aging & Longevity', tag:'The Art of Time', title: mainStrings.categoryTitles.longevity },
    { key:'dermatology', label:'Dermatology', tag:'The Art of Glow', title: mainStrings.categoryTitles.dermatology },
    { key:'wellness', label:'Aesthetic Wellness', tag:'The Art of Balance', title: mainStrings.categoryTitles.wellness }
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
            <h3>${category.title}</h3>
          </div>
          <a href="/program?category=${category.key}" class="arrow-link go more">
            <span>${mainStrings.viewAllPrograms}</span>
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

  /* Scrollspy nav — only in-page anchors (#section) are spy-able; other
     nav items now point to real Next.js routes (e.g. /program) which
     aren't valid CSS selectors. */
  const navLinks = document.querySelectorAll('nav.main-nav a');
  const sections = Array.from(navLinks)
    .map(a => a.getAttribute('href'))
    .filter(href => href && href.startsWith('#'))
    .map(href => document.querySelector(href))
    .filter(Boolean);
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

  /* Reuse the program-card structure for expertise cards.
     Sourced from Payload's `programs` collection (see src/lib/homeData.ts),
     each item shaped as { slug, category, branchTh, branchEn, titleTh,
     titleEn, descriptionTh, descriptionEn, image, price }. */
  const homepagePrograms = cmsData.programs || [];
  const programsPerPanel = 4;
  function renderProgramCard(program){
    const { slug, branchTh, branchEn, titleTh, titleEn, descriptionTh, descriptionEn, image, price } = program;
    const href = `/program/${slug}`;
    const formattedPrice = Number(price || 0).toLocaleString('en-US');

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
          <span>${formattedPrice}</span>
          <a class="card-link" href="${href}">${mainStrings.programDetails}</a>
        </div>
      </div>
    </div>`;
  }

  document.querySelectorAll('.exp-panel').forEach((panel, panelIndex) => {
    const grid = panel.querySelector('.exp-card-grid');
    if(!grid) return;
    const categoryKey = expertiseCategories[panelIndex] && expertiseCategories[panelIndex].key;
    const matching = homepagePrograms.filter(p => p.category === categoryKey);
    if(!matching.length){
      // No programs published under this pillar yet — show a placeholder
      // instead of a blank panel until staff add some via /admin.
      grid.innerHTML = `<p class="exp-empty">${mainStrings.noPrograms}</p>`;
      return;
    }
    grid.innerHTML = matching
      .slice(0, programsPerPanel)
      .map(renderProgramCard)
      .join('');
  });

  /* Shared journal data and card template.
     Sourced from Payload's `articles` collection — see src/lib/homeData.ts. */
  const journalArticles = cmsData.articles || [];
  const journalGrid = document.getElementById('journalGrid');
  journalGrid.innerHTML = journalArticles.map((article,index) => {
    const href = `/article/${article.id}`;
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
          <a class="journal-card__link" href="${href}">${mainStrings.readMore}</a>
        </div>
      </div>
    </article>`;
  }).join('');

  /* Awards data + card template.
     Sourced from Payload's `awards` collection — see src/lib/homeData.ts. */
  const awards = cmsData.awards || [];
  const awardTrack = document.getElementById('awardTrack');
  awardTrack.innerHTML = awards.map(award => `
    <div class="award-card">
      <div class="photo-wrap"><img class="ph-photo" src="${award.image}" alt="${award.captionEn}" onerror="this.hidden=true"></div>
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

  /* Branch content comes from Payload's `branches` collection (injected
     server-side), same shape the site's footer/header used to share. */
  const branches = cmsData.branches || [];
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
          <a href="/branch/${branch.id}" class="arrow-link flagship-link">
            <span>${mainStrings.readBranchDetails}</span>
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

    /* Sourced from Payload's `doctors` collection — see src/lib/homeData.ts. */
    const doctorProfiles = cmsData.doctors || [];
    function renderDoctorCard(profile){
      const profileHref = `/doctor/${profile.id}`;
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
          <a class="btn-doc-detail" href="${profileHref}">${mainStrings.viewProfile}</a>
          <a href="#contact" class="go vip-trigger" data-doc-name="${profile.nameTh}">${mainStrings.book}</a>
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
