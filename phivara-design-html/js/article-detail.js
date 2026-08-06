'use strict';

const readingProgress = document.getElementById('readingProgress');
const articleBody = document.getElementById('articleBody');
const copyToast = document.getElementById('copyToast');

function updateReadingProgress() {
  if (!readingProgress || !articleBody) return;

  const articleRect = articleBody.getBoundingClientRect();
  const start = window.scrollY + articleRect.top - window.innerHeight * .25;
  const end = start + articleBody.offsetHeight - window.innerHeight * .55;
  const progress = end > start ? (window.scrollY - start) / (end - start) * 100 : 0;
  readingProgress.style.width = `${Math.max(0, Math.min(100, progress))}%`;
}

window.addEventListener('scroll', updateReadingProgress, { passive: true });
updateReadingProgress();

const tocLinks = [...document.querySelectorAll('.toc a')];
const tocSections = tocLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (tocSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      tocLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  tocSections.forEach((section) => sectionObserver.observe(section));
}

const headingObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('gold-line-in');
    headingObserver.unobserve(entry.target);
  });
}, { threshold: .35 });

document.querySelectorAll('.prose h2').forEach((heading) => headingObserver.observe(heading));

function showCopyToast() {
  if (!copyToast) return;
  copyToast.classList.add('show');
  window.setTimeout(() => copyToast.classList.remove('show'), 1800);
}

async function copyArticleLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showCopyToast();
  } catch {
    window.prompt('Copy this link', window.location.href);
  }
}

function openShareWindow(url) {
  window.open(url, '_blank', 'noopener,noreferrer,width=640,height=520');
}

document.querySelectorAll('[data-share]').forEach((button) => {
  button.addEventListener('click', () => {
    const articleUrl = encodeURIComponent(window.location.href);
    const shareType = button.dataset.share;

    if (shareType === 'facebook') {
      openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`);
    } else if (shareType === 'line') {
      openShareWindow(`https://social-plugins.line.me/lineit/share?url=${articleUrl}`);
    } else if (shareType === 'copy') {
      copyArticleLink();
    }
  });
});
