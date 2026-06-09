/* Vercel Web Analytics — custom events for the Midpack concept longread.
 *
 * Purely additive instrumentation: every listener here is attached on top of the
 * page's own handlers, so it never changes behaviour. Events go through the
 * `window.va` queue set up in index.html and only actually report from the
 * deployed Vercel domain — over file:// / localhost the calls are harmless no-ops.
 *
 * LOAD ORDER (matters): this must be the FIRST deferred script in index.html,
 * before i18n/en.js + assets/i18n.js. Deferred scripts run in document order, so
 * loading it first means our `mp:langchange` listener is registered before
 * i18n.js fires the boot event (assets/i18n.js:201) — that's how we capture the
 * language the visitor actually lands/reads in. (A DOMContentLoaded fallback
 * below reads window.MPI18N.lang directly in case the order is ever wrong.)
 *
 * Event reference lives in midpack-concept/CLAUDE.md. Custom-event data values
 * must be primitives (string|number|boolean|null), no nesting, <=255 chars each.
 */
(function () {
  'use strict';

  // Single guarded sink. `va` only sends from a deployed Vercel domain; elsewhere
  // it just queues, so calling it is always safe. Never let analytics throw.
  function track(name, data) {
    try {
      if (typeof window.va === 'function') {
        window.va('event', data ? { name: name, data: data } : { name: name });
      }
    } catch (e) { /* swallow — instrumentation must never break the page */ }
  }

  function on(el, type, fn) { if (el) el.addEventListener(type, fn, false); }
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ---- 1. Language ---------------------------------------------------------
   * mp:langchange fires once on boot (the language actually read) and again on
   * every UA/EN toggle. First hit -> language_initial; subsequent -> language_switch.
   */
  var sawInitialLang = false;
  window.addEventListener('mp:langchange', function (e) {
    var lang = (e && e.detail && e.detail.lang) || 'uk';
    if (!sawInitialLang) { sawInitialLang = true; track('language_initial', { language: lang }); }
    else track('language_switch', { to: lang });
  });
  // Fallback: if the boot event somehow fired before this listener (wrong load
  // order), still record the initial language from the i18n public surface.
  ready(function () {
    if (!sawInitialLang && window.MPI18N && window.MPI18N.lang) {
      sawInitialLang = true;
      track('language_initial', { language: window.MPI18N.lang });
    }
  });

  /* ---- 2. Stepper ----------------------------------------------------------
   * The stepper's own click handlers (registered at parse time, before this
   * deferred script) run render() synchronously, so by the time our listener
   * fires the DOM already reflects the new stage. We derive the stage by its
   * index in #ix-stepper so the value is language-independent (the visible label
   * is localized). Slugs mirror the `stages` array in index.html, in order.
   */
  var STAGE_SLUGS = ['idea', 'sketches', 'tech_pack', 'sourcing', 'patterns', 'sample', 'fitting', 'production'];
  function activeStage() {
    var spills = document.querySelectorAll('#ix-stepper .spill');
    for (var i = 0; i < spills.length; i++) {
      if (spills[i].classList.contains('active')) return STAGE_SLUGS[i] || ('stage_' + i);
    }
    return 'completed'; // moved past the last stage
  }
  ready(function () {
    var fwd = document.getElementById('ix-fwd');
    var back = document.getElementById('ix-back');
    if (!fwd && !back) return;
    var engaged = false;
    function step(direction) {
      return function () {
        if (!engaged) { engaged = true; track('stepper_first_interaction'); }
        track('stepper_step', { direction: direction, stage: activeStage() });
      };
    }
    on(fwd, 'click', step('forward'));
    on(back, 'click', step('back'));
  });

  /* ---- 3. Partner CTA + contact channels -----------------------------------
   * The CTA opens the contact modal; the modal offers Telegram / email / phone,
   * each as a link (.crow-main) plus a copy button (.crow-copy). Delegated so it
   * works no matter when the modal is shown.
   */
  function channelFromHref(href) {
    if (!href) return 'unknown';
    if (href.indexOf('mailto:') === 0) return 'email';
    if (href.indexOf('tel:') === 0) return 'phone';
    if (/t\.me|telegram/i.test(href)) return 'telegram';
    return 'unknown';
  }
  ready(function () {
    on(document.getElementById('partner-cta'), 'click', function () { track('partner_cta_open'); });
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var link = t.closest('.crow-main');
    if (link) { track('contact_click', { channel: channelFromHref(link.getAttribute('href')) }); return; }

    var copy = t.closest('.crow-copy');
    if (copy) {
      var row = copy.closest('.crow');
      var rowLink = row && row.querySelector('.crow-main');
      track('contact_copy', { channel: channelFromHref(rowLink && rowLink.getAttribute('href')) });
      return;
    }

    // Screenshot enlarged in the lightbox (the page binds the lightbox to `.window img`).
    if (t.tagName === 'IMG' && t.closest('.window')) {
      track('screenshot_open', { image: shotName(t.getAttribute('src')) });
    }
  });
  function shotName(src) {
    if (!src) return 'unknown';
    var file = src.split('/').pop().split('?')[0];        // e.g. shot-product.png
    return file.replace(/^shot-/, '').replace(/\.[a-z0-9]+$/i, '') || file; // -> product
  }

  /* ---- 4. Partner section reached (funnel top) ----------------------------- */
  ready(function () {
    var sec = document.getElementById('s-partners');
    if (!sec || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { track('partner_section_view'); io.disconnect(); break; }
      }
    }, { threshold: 0.25 });
    io.observe(sec);
  });

  /* ---- 5. Scroll depth ----------------------------------------------------- */
  (function () {
    var marks = [25, 50, 75, 100];
    var fired = {};
    var ticking = false;
    function check() {
      ticking = false;
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return; // nothing to scroll
      var pct = ((window.pageYOffset || doc.scrollTop) / scrollable) * 100;
      for (var i = 0; i < marks.length; i++) {
        var m = marks[i];
        if (!fired[m] && pct >= m - 0.5) { fired[m] = true; track('scroll_depth', { percent: m }); }
      }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(check); }
    }, { passive: true });
    ready(check); // short pages / restored scroll position
  })();

  /* ---- 6. Reading time (rough engagement) ----------------------------------
   * Sent once, on the first time the tab is hidden / the page is unloaded.
   */
  (function () {
    var hasPerf = !!(window.performance && performance.now);
    var t0 = hasPerf ? performance.now() : Date.now();
    var sent = false;
    function bucket(sec) {
      if (sec < 30) return '0-30s';
      if (sec < 60) return '30-60s';
      if (sec < 180) return '1-3m';
      if (sec < 600) return '3-10m';
      return '10m+';
    }
    function flush() {
      if (sent) return;
      sent = true;
      var now = hasPerf ? performance.now() : Date.now();
      track('reading_time', { bucket: bucket(Math.round((now - t0) / 1000)) });
    }
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') flush();
    });
    window.addEventListener('pagehide', flush);
  })();
})();
