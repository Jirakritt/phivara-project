(function () {
  'use strict';

  const branches = window.PhivaraSiteShell?.branches || [];
  const grid = document.getElementById('branchGrid');

  if (!grid) return;

  grid.innerHTML = branches.map((branch, index) => {
    const detailHref = `branch-${branch.id}.html`;
    const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.addressTh)}`;
    const numStr = String(index + 1).padStart(2, '0');

    return `
      <article class="branch-card">
        <div class="branch-card__media">
          <img src="${branch.image}" alt="PHIVARA ${branch.nameEn}" loading="lazy" decoding="async">
          <span class="branch-card__number">LOCATION ${numStr}</span>
        </div>
        <div class="branch-card__body">
          <p class="eyebrow">PHIVARA LOCATION ${numStr}</p>
          <h3 data-th="PHIVARA ${branch.nameTh}" data-en="PHIVARA ${branch.nameEn}">PHIVARA ${branch.nameTh}</h3>
          <p class="branch-card__service" data-th="${branch.titleTh}" data-en="${branch.titleEn}">${branch.titleTh}</p>
          <p class="branch-card__description" data-th="${branch.descriptionTh}" data-en="${branch.descriptionEn}">${branch.descriptionTh}</p>
          <div class="branch-card__address">
            <span class="branch-card__label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span data-th="ที่อยู่" data-en="Address">ที่อยู่</span>
            </span>
            <p data-th="${branch.addressTh}" data-en="${branch.addressEn}">${branch.addressTh}</p>
          </div>
          <div class="branch-card__meta">
            <div>
              <span class="branch-card__label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span data-th="เวลาทำการ" data-en="Opening Hours">เวลาทำการ</span>
              </span>
              <strong data-th="${branch.hoursTh}" data-en="${branch.hoursEn}">${branch.hoursTh}</strong>
            </div>
            <div>
              <span class="branch-card__label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span data-th="เบอร์โทร" data-en="Telephone">เบอร์โทร</span>
              </span>
              <strong>${branch.phone}</strong>
            </div>
            <div>
              <span class="branch-card__label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>LINE</span>
              </span>
              <strong>${branch.line}</strong>
            </div>
          </div>
          <div class="branch-card__actions">
            <a class="branch-map-link" href="${mapHref}" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span data-th="เปิดใน Google Maps" data-en="Open in Google Maps">เปิดใน Google Maps</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </a>
            <a class="branch-detail-trigger" href="${detailHref}">
              <span data-th="ดูรายละเอียดสาขาเพิ่มเติม →" data-en="View Branch Details →">ดูรายละเอียดสาขาเพิ่มเติม →</span>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
})();
