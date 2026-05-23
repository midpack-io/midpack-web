/* ============================================================
   <bundle-stepper> · light-DOM web component
   Stage-stepper row + active-stage detail bar.

   Default template = Variant A · "In progress"
     Stage 03 active. Marta = performer (and viewer), Olena = approver.
     3 days in stage, due Tue · Nov 12.
   Used by:
     - components/stepper.html (playground)
     - 01-default-desktop.html
     - 02-preview-open.html
   Loads styles from components/stepper.css (linked by host page).
   ============================================================ */

(function () {
  /* ---------- icons ---------- */
  const ICO = {
    tick:    '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M2.8 6l2.2 2.2 4.2-4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    play:    '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M4 3l5 3-5 3z" fill="currentColor"/></svg>',
    back:    '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M7.5 3.2L4.2 6l3.3 2.8M4.4 6h4.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowR:  '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M3 6h6m0 0L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    navL:    '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M7.5 3L4 6l3.5 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    navR:    '<svg viewBox="0 0 12 12" fill="none" width="12" height="12"><path d="M4.5 3L8 6l-3.5 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dotMenu: '<svg viewBox="0 0 14 14" fill="currentColor" width="14" height="14"><circle cx="3.5" cy="7" r="1.1"/><circle cx="7" cy="7" r="1.1"/><circle cx="10.5" cy="7" r="1.1"/></svg>',
  };

  const STATUS_CHIP_IN_PROGRESS = `
    <button class="status-chip in-progress" type="button" title="Change status">
      ${ICO.play}<span>In Progress</span>
    </button>`;

  /* ---------- pill helpers ---------- */
  function passedPill(label) {
    return `
      <div class="pill passed" title="${label}">
        <span class="status-ico">${ICO.tick}</span>
        <span class="stage-label">${label}</span>
      </div>`;
  }
  function todoPill(label, n) {
    return `
      <div class="pill todo" title="${label} · stage ${n}">
        <span class="status-ico"></span>
        <span class="stage-label">${label}</span>
      </div>`;
  }
  function activePill(label, n) {
    // The active pill embeds the full status chip in place of the small
    // status-ico — matches Variant A in components/stepper.html.
    return `
      <div class="pill active has-chip" title="${label} · stage ${n}">
        ${STATUS_CHIP_IN_PROGRESS}
        <span class="stage-label">${label}</span>
        <span class="role-stack">
          <span class="avatar-mini av-marta" title="Marta K. · performer">M</span>
          <span class="avatar-mini av-olena approver" title="Olena P. · approver">O</span>
        </span>
        <span class="you-tag" title="Needs your attention">⚠</span>
      </div>`;
  }
  const connector = '<div class="pill-connector"></div>';

  const PILLS = [
    passedPill('Ідея'),
    passedPill('Ескізи'),
    activePill('Тех-пак', '03'),
    todoPill('Закупівля', '04'),
    todoPill('Лекала', '05'),
    todoPill('Перший зразок', '06'),
    todoPill('Примірка', '07'),
    todoPill('Градація', '08'),
    todoPill('Виробництво', '09'),
  ].join(connector);

  /* ---------- active-detail bar ---------- */
  const PERFORMER_CHIP = `
    <button class="person-chip" type="button" title="Click to replace">
      <span class="avatar av-marta" style="width: 20px; height: 20px; font-size: 9px;">M</span>
      <span class="person-name">Marta K.</span>
      <span class="person-meta">· you</span>
    </button>`;

  const APPROVER_CHIP = `
    <button class="person-chip" type="button" title="Click to replace">
      <span class="avatar av-olena" style="width: 20px; height: 20px; font-size: 9px;">O</span>
      <span class="person-name">Olena P.</span>
    </button>`;

  // Note: the status chip lives inside the active pill (see activePill),
  // not in this bar — matches the post-render mutation in the playground.
  const ACTIVE_DETAIL = `
    <div class="active-detail tone-accent">
      <div class="detail-group">
        <span class="detail-label">Performer</span>
        ${PERFORMER_CHIP}
      </div>
      <div class="detail-divider"></div>
      <div class="detail-group">
        <span class="detail-label">Approver</span>
        ${APPROVER_CHIP}
      </div>
      <div class="detail-divider"></div>
      <div class="detail-group">
        <span class="detail-label">Due</span>
        <span class="deadline-line"><span class="due">Tue · Nov 12</span></span>
      </div>
      <div class="detail-divider"></div>
      <div class="detail-group">
        <span class="detail-label">In stage</span>
        <span class="time-in-stage">3 days</span>
      </div>
      <div class="detail-cta">
        <button class="btn btn-sm">Return…</button>
        <button class="btn btn-sm">Hand off ${ICO.arrowR}</button>
        <button class="btn primary btn-sm">Submit for review</button>
        <button class="icon-btn" type="button" title="Stage actions" aria-label="Stage actions">${ICO.dotMenu}</button>
      </div>
    </div>`;

  const TEMPLATE = `
<div class="bundle-stepper">
  <div class="stepper-wrap">
    <div class="stepper-row" data-at-start="true">
      <button class="stepper-nav prev is-disabled" aria-label="Scroll left">${ICO.navL}</button>
      <div class="stepper">${PILLS}</div>
      <button class="stepper-nav next" aria-label="Scroll right">${ICO.navR}</button>
    </div>
    ${ACTIVE_DETAIL}
  </div>
</div>`;

  class BundleStepper extends HTMLElement {
    connectedCallback() {
      if (!this._rendered) {
        this.innerHTML = TEMPLATE;
        this._rendered = true;
        this._initRow();
      }
    }

    _initRow() {
      const row = this.querySelector('.stepper-row');
      if (!row) return;
      const scroller = row.querySelector('.stepper');
      const prev = row.querySelector('.stepper-nav.prev');
      const next = row.querySelector('.stepper-nav.next');
      const wrap = this.querySelector('.bundle-stepper');
      const detail = wrap && wrap.querySelector('.active-detail');

      // Anchor the small vertical connector from the active pill down to
      // the seam between the row and the detail bar.
      const findActivePill = () =>
        scroller.querySelector('.pill.is-selected') ||
        scroller.querySelector('.pill.active, .pill.in-review, .pill.returned, .pill.reopened');

      const updateConnector = () => {
        if (!detail) return;
        const activePill = findActivePill();
        if (!activePill) { detail.removeAttribute('data-has-active'); return; }
        const pillBox = activePill.getBoundingClientRect();
        const barBox = detail.getBoundingClientRect();
        const x = (pillBox.left + pillBox.width / 2) - barBox.left;
        const gap = Math.max(0, barBox.top - pillBox.bottom);
        const rowBox = row.getBoundingClientRect();
        const visible = pillBox.right > rowBox.left + 30 && pillBox.left < rowBox.right - 30;
        if (!visible) { detail.removeAttribute('data-has-active'); return; }
        detail.style.setProperty('--active-x', x + 'px');
        detail.style.setProperty('--connector-gap', gap + 'px');
        detail.dataset.hasActive = 'true';
      };

      const update = () => {
        const max = scroller.scrollWidth - scroller.clientWidth;
        const x = scroller.scrollLeft;
        row.dataset.noOverflow = (max <= 1) ? 'true' : 'false';
        row.dataset.atStart = (x <= 1) ? 'true' : 'false';
        row.dataset.atEnd = (x >= max - 1) ? 'true' : 'false';
        prev.classList.toggle('is-disabled', x <= 1);
        next.classList.toggle('is-disabled', x >= max - 1);
        updateConnector();
      };
      const step = () => Math.max(160, Math.floor(scroller.clientWidth * 0.6));
      prev.addEventListener('click', () => scroller.scrollBy({ left: -step(), behavior: 'smooth' }));
      next.addEventListener('click', () => scroller.scrollBy({ left:  step(), behavior: 'smooth' }));
      scroller.addEventListener('scroll', update, { passive: true });
      if (window.ResizeObserver) new ResizeObserver(update).observe(scroller);
      window.addEventListener('resize', updateConnector, { passive: true });
      update();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
    }

    // Hook for future state variants:
    //   <bundle-stepper state="approval-pending">
    static get observedAttributes() { return ["state"]; }
    attributeChangedCallback() {
      const root = this.querySelector(".bundle-stepper");
      if (!root) return;
      root.dataset.state = this.getAttribute("state") || "default";
    }
  }

  if (!customElements.get("bundle-stepper")) {
    customElements.define("bundle-stepper", BundleStepper);
  }
})();
