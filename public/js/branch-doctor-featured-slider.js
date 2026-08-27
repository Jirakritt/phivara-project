/* "แพทย์หลักประจำสาขา" (featured lead doctor) slide — active only when a
   branch has more than 1 doctor with isBranchFeatured checked (see
   cms/collections/Doctors.ts and src/app/[locale]/(public)/branch/[slug]/
   page.tsx, which only renders this markup at all when there are >1 —
   exactly 1 renders a single static .branch-doctor-featured card with no
   slider chrome, and this script no-ops in that case).

   Modeled on the Awards carousel in main.js (dots, translateX track) —
   reuses its .award-viewport/.award-track/.award-dots classes from
   main.css. No prev/next arrows (dots + autoplay only, per design), and
   always shows exactly 1 slide at a time instead of Awards' responsive
   1/2/4. */
(function () {
  const track = document.getElementById('branchFeaturedTrack');
  const slides = track ? Array.from(track.children) : [];
  if (!track || slides.length < 2) return;

  const viewport = track.parentElement;
  const dotsWrap = document.getElementById('branchFeaturedDots');
  if (!viewport || !dotsWrap) return;

  const maxIndex = slides.length - 1;
  let index = 0;
  let timer = null;

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.i = i;
      b.addEventListener('click', () => { goTo(i); restart(); });
      dotsWrap.appendChild(b);
    }
  }

  function updateDots() {
    Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function update() {
    const step = slides[0].getBoundingClientRect().width + 28;
    track.style.transform = `translateX(${-index * step}px)`;
    updateDots();
  }

  function goTo(i) {
    index = Math.max(0, Math.min(maxIndex, i));
    update();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index >= maxIndex ? 0 : index + 1), 6000);
  }

  window.addEventListener('resize', update);

  buildDots();
  update();
  restart();
})();
