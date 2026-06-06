/* Midpack longread — lightweight runtime i18n.
 *
 * Source language is Ukrainian and lives in the HTML itself. Translations live
 * in i18n/<lang>.js, which assign a dictionary onto window.MP_I18N[<lang>] and
 * are loaded via a <script> tag (so this works when opening index.html directly
 * over file:// — no server / no fetch needed). Each dictionary is keyed by the
 * *normalized innerHTML* of each text block, so the keys are the readable source
 * strings. On switching to a non-source language we walk a fixed set of
 * selectors, look each block's source up in the dictionary and swap in the
 * translation; the original UK markup is cached so switching back is exact.
 * Attributes (alt / aria-label / title) and the <title> are translated too.
 *
 * IMPORTANT: SEL and norm() must stay byte-identical to the extractor that
 * generated the dictionary keys (tools/i18n-extract.mjs), or lookups silently miss.
 */
(function () {
  'use strict';

  var DEFAULT = 'uk';
  var SUPPORTED = ['uk', 'en'];
  var STORAGE_KEY = 'mp-lang';

  // Selector set — must match tools/i18n-extract.mjs exactly.
  var SEL = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p',
    'li',
    'figcaption',
    'th', 'td',
    '.eyebrow', '.docmeta',
    '.lbl', '.sub', '.ded', '.note', '.badge', '.nt', '.nd',
    '.rname', '.rrole', '.who', '.pl', '.vstatus', '.vname', '.vperf', '.nm', '.tlabel', '.pb',
    '.st', '.ht', '.hs', '.fk-foot',
    '.cmodal-eyebrow', '.cmodal-title', '.cmodal-sub', '.crow-l',
    '.pslab-eyebrow', '.pslab-meta', '.ptag', '.pcta-k', '.pcta-t', '.exch-h',
    '.metric .mlabel', '.metric .mv', '.metric .mt', '.metric .was',
    '.cl', '.cs', '.runfoot span',
    '.tt',
    '.q', '.a',
    '.mode', '.pkg-foot', '.cta',
    '.conflict-tag',
    '.ends span',
    '.sidenav-link', '.sidenav-brand .wm',
    '.xbtn', '.pcta-btn', '.sidenav-toggle',
    '.wf-canvas text', '.chips .chip', '.gives .chip', '.pc-b .fitem',
    '.hires', '.field .fl', '.src', '.prod', '.pc-h .t', '.pc-h .s'
  ].join(',');

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

  // SVG elements don't reliably support innerHTML across browsers; their labels
  // are plain text, so read/write textContent for them and innerHTML otherwise.
  function isSVG(el) { return el.namespaceURI === 'http://www.w3.org/2000/svg'; }
  function getInner(el) { return isSVG(el) ? el.textContent : el.innerHTML; }
  function setInner(el, v) { if (isSVG(el)) el.textContent = v; else el.innerHTML = v; }

  // ---- state ----
  var applied = DEFAULT;          // currently applied language
  var origText = new WeakMap();   // el -> original (UK) innerHTML
  var origAttr = new WeakMap();   // el -> { attr: originalValue }
  var origTitle = document.title;
  var origMetaDesc = (function () {
    var m = document.querySelector('meta[name="description"]');
    return m ? m.getAttribute('content') : null;
  })();

  // dictionaries are supplied by i18n/<lang>.js via window.MP_I18N[<lang>]
  function getDict(lang) {
    if (lang === DEFAULT) return null;
    return (window.MP_I18N && window.MP_I18N[lang]) ? window.MP_I18N[lang] : null;
  }

  function readInitialLang() {
    try {
      var u = new URLSearchParams(location.search).get('lang');
      if (u && SUPPORTED.indexOf(u) !== -1) return u;
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && SUPPORTED.indexOf(s) !== -1) return s;
    } catch (e) {}
    return DEFAULT;
  }

  // Translate one element's innerHTML by its cached source key.
  function applyEl(el, lang, table) {
    if (!origText.has(el)) origText.set(el, getInner(el));
    var src = origText.get(el);
    if (lang === DEFAULT) { if (getInner(el) !== src) setInner(el, src); return; }
    var t = table[norm(src)];
    if (t != null && getInner(el) !== t) setInner(el, t);
  }

  function applyAttrs(el, lang, table) {
    var names = ['alt', 'aria-label', 'title', 'placeholder'];
    var store = origAttr.get(el);
    for (var i = 0; i < names.length; i++) {
      var a = names[i];
      if (!el.hasAttribute(a)) continue;
      if (!store) { store = {}; origAttr.set(el, store); }
      if (!(a in store)) store[a] = el.getAttribute(a);
      var src = store[a];
      if (src == null) continue;
      if (lang === DEFAULT) { el.setAttribute(a, src); continue; }
      var t = table[norm(src)];
      if (t != null) el.setAttribute(a, t);
    }
  }

  function applyLang(lang) {
    var dict = getDict(lang);
    var table = (dict && dict.strings) ? dict.strings : {};

    // text blocks (skip any element that contains another matched element)
    var els = document.querySelectorAll(SEL + ', [data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.querySelector(SEL)) continue;
      applyEl(el, lang, table);
    }

    // translatable attributes
    var attrEls = document.querySelectorAll('[alt],[aria-label],[title],[placeholder]');
    for (var j = 0; j < attrEls.length; j++) applyAttrs(attrEls[j], lang, table);

    // <title> + meta description
    if (dict && dict.meta) {
      if (dict.meta.title) document.title = dict.meta.title;
      if (dict.meta.description) setMetaDesc(dict.meta.description);
    } else {
      document.title = origTitle;
      if (origMetaDesc != null) setMetaDesc(origMetaDesc);
    }

    document.documentElement.setAttribute('lang', lang);
    applied = lang;
  }

  function setMetaDesc(v) {
    var m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', v);
  }

  function reveal() { document.documentElement.classList.remove('i18n-pending'); }

  function syncToggle(lang) {
    var btns = document.querySelectorAll('.lang-opt');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-lang') === lang;
      btns[i].classList.toggle('active', on);
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function persist(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    try {
      var url = new URL(location.href);
      if (lang === DEFAULT) url.searchParams.delete('lang');
      else url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    } catch (e) {}
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT;
    persist(lang);
    syncToggle(lang);
    applyLang(lang);
    window.dispatchEvent(new CustomEvent('mp:langchange', { detail: { lang: lang } }));
  }

  // public surface (also used by inline widget scripts for dynamic strings)
  window.MPI18N = {
    get lang() { return applied; },
    set: set,
    t: function (uk, fallback) {
      var dict = getDict(applied);
      if (dict && dict.strings) {
        var v = dict.strings[norm(String(uk))];
        if (v != null) return v;
      }
      return fallback != null ? fallback : uk;
    }
  };

  // wire the toggle
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.lang-opt');
    if (!b) return;
    e.preventDefault();
    set(b.getAttribute('data-lang'));
  });

  // ---- boot ----
  // i18n/<lang>.js is loaded by a <script> before this file, so dictionaries are
  // already on window.MP_I18N by now. If a requested dict is missing we fall back
  // to the source language (the page is never left blank or stuck).
  var initial = readInitialLang();
  syncToggle(initial);
  try { applyLang(initial); } catch (e) { applyLang(DEFAULT); }
  window.dispatchEvent(new CustomEvent('mp:langchange', { detail: { lang: applied } }));
  reveal();
})();
