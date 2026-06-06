#!/usr/bin/env node
/* Regenerates the translation keys for the longread by reading the *live* DOM
 * (so keys match the browser's innerHTML serialization byte-for-byte).
 *
 *   node tools/i18n-extract.mjs > /tmp/keys.json
 *
 * Requires Playwright:  npx playwright install chromium
 *
 * Output: { title, strings: [{key, html, tag, cls, cyr}], attrs: [{attr,value,cyr}] }
 *   - `key`  is the normalized innerHTML — this is what i18n/en.js strings keys must equal.
 *   - `cyr`  flags strings/attrs that contain Cyrillic (i.e. need an English value).
 *
 * SEL and norm() MUST stay byte-identical to assets/i18n.js.
 */
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = pathToFileURL(resolve(__dirname, '..', 'index.html')).href;

const SEL = [
  'h1','h2','h3','h4','h5','h6',
  'p',
  'li',
  'figcaption',
  'th','td',
  '.eyebrow','.docmeta',
  '.lbl','.sub','.ded','.note','.badge','.nt','.nd',
  '.rname','.rrole','.who','.pl','.vstatus','.vname','.vperf','.nm','.tlabel','.pb',
  '.st','.ht','.hs','.fk-foot',
  '.cmodal-eyebrow','.cmodal-title','.cmodal-sub','.crow-l',
  '.pslab-eyebrow','.pslab-meta','.ptag','.pcta-k','.pcta-t','.exch-h',
  '.metric .mlabel','.metric .mv','.metric .mt','.metric .was',
  '.cl','.cs','.runfoot span',
  '.tt',
  '.q','.a',
  '.mode','.pkg-foot','.cta',
  '.conflict-tag',
  '.ends span',
  '.sidenav-link','.sidenav-brand .wm',
  '.xbtn','.pcta-btn','.sidenav-toggle',
  '.wf-canvas text','.chips .chip','.gives .chip','.pc-b .fitem',
  '.hires','.field .fl','.src','.prod','.pc-h .t','.pc-h .s'
].join(',');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(FILE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600); // let inline scripts run

const data = await page.evaluate((SEL) => {
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const hasCyr = (s) => /[Ѐ-ӿ]/.test(s);

  const els = Array.from(document.querySelectorAll(SEL + ', [data-i18n]'));
  const seen = new Set();
  const strings = [];
  for (const el of els) {
    if (el.querySelector(SEL)) continue; // skip ancestors of matched elements
    const html = el.innerHTML;
    const key = norm(html);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    strings.push({ key, html, tag: el.tagName.toLowerCase(), cls: el.className || '', cyr: hasCyr(key) });
  }

  const attrs = [];
  const aseen = new Set();
  for (const el of Array.from(document.querySelectorAll('[alt],[aria-label],[title],[placeholder]'))) {
    for (const a of ['alt','aria-label','title','placeholder']) {
      if (!el.hasAttribute(a)) continue;
      const v = el.getAttribute(a);
      if (!v || !v.trim()) continue;
      const k = norm(v);
      if (aseen.has(k)) continue;
      aseen.add(k);
      attrs.push({ attr: a, value: v, cyr: hasCyr(v) });
    }
  }
  return { title: document.title, strings, attrs };
}, SEL);

console.log(JSON.stringify(data, null, 2));
await browser.close();
