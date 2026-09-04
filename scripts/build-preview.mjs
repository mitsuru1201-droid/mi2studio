/**
 * Bakes a single self-contained HTML file from the same sources the Next.js
 * app uses: messages/*.json, src/icons.json, public/art/*.svg and
 * src/styles/lp.css. Nothing is duplicated by hand.
 *
 * Emits:
 *   preview/index.html    — full standalone document, open it directly
 *   preview/artifact.html — same page without the <html>/<head>/<body> shell
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderBody, LOCALE_META } from '../preview/render.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const readJson = (p) => JSON.parse(read(p))

const LOCALES = ['en', 'ko', 'zh-TW', 'fr']
const messages = Object.fromEntries(LOCALES.map((l) => [l, readJson(`messages/${l}.json`)]))
const icons = readJson('src/icons.json')
const css = read('src/styles/lp.css')

/**
 * Inline the scene art, letting CSS own the sizing. Only the root <svg> tag
 * loses its width/height — the inner shapes need theirs.
 */
const art = Object.fromEntries(
  ['vintage', 'cooking', 'jdm'].map((name) => [
    name,
    read(`public/art/${name}.svg`)
      .trim()
      .replace(/^<svg\b[^>]*>/, (tag) => tag.replace(/\s(?:width|height)="\d+"/g, '')),
  ]),
)

const ctx = { icons, art, locale: 'en' }
const bakedBody = renderBody(messages.en, ctx)

/** The render module, made browser-ready by dropping ES module syntax. */
const renderSource = read('preview/render.mjs').replace(/^export /gm, '')

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?' +
  'family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap">'

const BOOT = `
document.documentElement.setAttribute('data-js','');
`

const APP = `
(function () {
  var MESSAGES = window.__RJN.messages;
  var CTX = { icons: window.__RJN.icons, art: window.__RJN.art, locale: 'en' };
  var STORAGE_KEY = 'rjn.locale';
  var app = document.getElementById('app');
  var state = { locale: 'en', open: false };

  var CJK = {
    ko: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap',
    'zh-TW': 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'
  };
  function ensureFont(locale) {
    var href = CJK[locale];
    if (!href || document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function resolveLocale(tags) {
    for (var i = 0; i < tags.length; i++) {
      var tag = String(tags[i]).toLowerCase();
      if (tag.indexOf('ko') === 0) return 'ko';
      if (tag.indexOf('fr') === 0) return 'fr';
      if (tag.indexOf('en') === 0) return 'en';
      if (tag.indexOf('zh') === 0) {
        if (tag.indexOf('hant') > -1 || tag.indexOf('-tw') > -1 || tag.indexOf('-hk') > -1 || tag.indexOf('-mo') > -1) {
          return 'zh-TW';
        }
      }
    }
    return 'en';
  }

  var revealObserver = null;
  function initReveals() {
    if (revealObserver) revealObserver.disconnect();
    if (!('IntersectionObserver' in window)) {
      [].forEach.call(document.querySelectorAll('.reveal'), function (el) { el.classList.add('is-in'); });
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    [].forEach.call(document.querySelectorAll('.reveal'), function (el) { revealObserver.observe(el); });
  }

  function onScroll() {
    var header = document.querySelector('.site-header');
    if (header) header.setAttribute('data-scrolled', String(window.scrollY > 8));
    var bar = document.querySelector('.sticky-cta');
    if (bar) {
      var past = window.scrollY > window.innerHeight * 0.7;
      var nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 320;
      var visible = past && !nearBottom;
      bar.setAttribute('data-visible', String(visible));
      bar.setAttribute('aria-hidden', String(!visible));
      var link = bar.querySelector('a');
      if (link) link.setAttribute('tabindex', visible ? '0' : '-1');
    }
  }

  function setMenu(open) {
    state.open = open;
    var btn = document.getElementById('langBtn');
    var menu = document.getElementById('langMenu');
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  }

  function mount(locale, keepScroll) {
    var y = keepScroll ? window.scrollY : 0;
    state.locale = locale;
    // The re-render replaces the menu with a fresh, closed one.
    state.open = false;
    CTX.locale = locale;
    var meta = LOCALE_META.filter(function (m) { return m.code === locale; })[0] || LOCALE_META[0];
    document.documentElement.lang = meta.htmlLang;
    document.documentElement.setAttribute('data-locale', locale);
    ensureFont(locale);
    app.innerHTML = renderBody(MESSAGES[locale], CTX);
    initReveals();
    onScroll();
    if (keepScroll) window.scrollTo(0, y);
  }

  function setLocale(locale) {
    if (!MESSAGES[locale]) return;
    try { window.localStorage.setItem(STORAGE_KEY, locale); } catch (e) {}
    mount(locale, true);
    var btn = document.getElementById('langBtn');
    if (btn) btn.focus();
  }

  document.addEventListener('click', function (e) {
    var option = e.target.closest && e.target.closest('.lang__option');
    if (option) { setLocale(option.getAttribute('data-locale')); return; }
    if (e.target.closest && e.target.closest('.lang__btn')) { setMenu(!state.open); }
  });

  document.addEventListener('pointerdown', function (e) {
    if (state.open && !(e.target.closest && e.target.closest('.lang'))) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.open) {
      setMenu(false);
      var btn = document.getElementById('langBtn');
      if (btn) btn.focus();
      return;
    }
    if (!state.open || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    var menu = document.getElementById('langMenu');
    if (!menu || !menu.contains(document.activeElement)) return;
    e.preventDefault();
    var opts = [].slice.call(menu.querySelectorAll('.lang__option'));
    var idx = opts.indexOf(document.activeElement);
    var next = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
    var target = opts[(next + opts.length) % opts.length];
    if (target) target.focus();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  var initial = 'en';
  try {
    var stored = window.localStorage.getItem(STORAGE_KEY);
    initial = MESSAGES[stored] ? stored : resolveLocale(navigator.languages || [navigator.language]);
  } catch (e) {
    initial = resolveLocale(navigator.languages || [navigator.language]);
  }
  mount(initial, false);
})();
`

const dataScript =
  '<script>window.__RJN=' +
  JSON.stringify({ messages, icons, art }).replace(/<\//g, '<\\/') +
  ';</script>'

const scripts = `${dataScript}<script>${renderSource}\n${APP}</script>`
const title = `${messages.en.meta.title}`

const description = messages.en.meta.description.replace(/"/g, '&quot;')
const headFor = (docTitle) =>
  `<title>${docTitle}</title>` +
  `<meta name="description" content="${description}">` +
  FONTS +
  `<style>${css}</style>`

// The standalone file carries the full SEO title; the artifact wants a short
// name, since its <title> becomes the tab and gallery label.
const head = headFor(title)
const artifactHead = headFor('REAL JAPAN NOW')

const full = `<!doctype html>
<html lang="en" data-locale="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>${BOOT}</script>
${head}
</head>
<body>
<div id="app">${bakedBody}</div>
${scripts}
</body>
</html>
`

// Artifact hosts supply the document shell, so emit the page contents only.
const artifact = `${artifactHead}
<script>${BOOT}</script>
<div id="app">${bakedBody}</div>
${scripts}
`

fs.writeFileSync(path.join(root, 'preview/index.html'), full)
fs.writeFileSync(path.join(root, 'preview/artifact.html'), artifact)

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB'
console.log('preview/index.html   ', kb(full))
console.log('preview/artifact.html', kb(artifact))
