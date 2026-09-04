/* Renders the whole landing page from a message dictionary.
   Used twice: at build time in Node to bake the English HTML into the file,
   and again in the browser to re-render instantly on a language switch. */

export const LOCALE_META = [
  { code: 'en', name: 'English', flag: '\u{1F1FA}\u{1F1F8}', htmlLang: 'en' },
  { code: 'ko', name: '한국어', flag: '\u{1F1F0}\u{1F1F7}', htmlLang: 'ko' },
  { code: 'zh-TW', name: '繁體中文', flag: '\u{1F1F9}\u{1F1FC}', htmlLang: 'zh-Hant-TW' },
  { code: 'fr', name: 'Français', flag: '\u{1F1EB}\u{1F1F7}', htmlLang: 'fr' },
]

const NAV_KEYS = [
  ['#experiences', 'experiences'],
  ['#why', 'why'],
  ['#how', 'how'],
  ['#notices', 'notices'],
  ['#faq', 'faq'],
]
const TRUST_ICONS = ['shield', 'users', 'lang', 'clock']
const FEATURE_ICONS = ['tea', 'shield', 'users', 'chat']
const STEP_ICONS = ['compass', 'user', 'id', 'card', 'mail', 'pin', 'star']
const NOTICE_ICONS = { id: 'id', health: 'heart', camera: 'camera', shield: 'shield' }
const PHASE_RANGES = [[1, 2], [3, 5], [6, 7]]
const SCENE_KEYS = ['vintage', 'cooking', 'jdm']
const LEGAL_HREFS = ['/terms', '/privacy', '/cancellation-policy', '/code-of-conduct', '/disclaimer', '/contact']
const SOCIAL_HREFS = ['#instagram', '#tiktok', '#x', '#line']

export function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function icon(ctx, name, cls, sw) {
  const paths = (ctx.icons[name] || []).map((d) => `<path d="${d}"/>`).join('')
  return (
    `<svg viewBox="0 0 24 24"${cls ? ` class="${cls}"` : ''} fill="none" stroke="currentColor" ` +
    `stroke-width="${sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`
  )
}

/**
 * Each scene is inlined twice (hero panel and experience card), so its gradient
 * ids are namespaced per placement to keep them unique in the document.
 */
function artFor(ctx, key, suffix) {
  return (ctx.art[key] || '')
    .replace(/id="([^"]+)"/g, 'id="$1-' + suffix + '"')
    .replace(/url\(#([^)]+)\)/g, 'url(#$1-' + suffix + ')')
}

function brand() {
  return (
    '<span class="brand__seal" aria-hidden="true"></span>' +
    '<span>REAL JAPAN <span class="brand__now">NOW</span></span>'
  )
}

function header(t, ctx) {
  const current = LOCALE_META.find((m) => m.code === ctx.locale) || LOCALE_META[0]
  const nav = NAV_KEYS.map(
    ([href, key]) => `<a class="md-btn md-btn--text md-state" href="${href}">${esc(t.nav[key])}</a>`,
  ).join('')
  const options = LOCALE_META.map((m) => {
    const selected = m.code === ctx.locale
    return (
      `<button type="button" class="lang__option md-state" role="option" aria-selected="${selected}" ` +
      `lang="${m.htmlLang}" data-locale="${m.code}">` +
      `<span class="lang__flag" aria-hidden="true">${m.flag}</span>` +
      `<span class="lang__name">${esc(m.name)}</span>` +
      (selected ? icon(ctx, 'check', 'lang__check', 2.4) : '') +
      '</button>'
    )
  }).join('')

  return (
    '<header class="m3-top-app-bar" data-scrolled="false"><div class="shell top-app-bar__inner">' +
    `<a class="brand md-state" href="#top">${brand()}</a>` +
    `<nav class="nav" aria-label="Primary">${nav}</nav>` +
    '<div class="top-app-bar__actions">' +
    `<a class="md-btn md-btn--filled md-state top-app-bar__cta" href="#how">${esc(t.hero.cta)}</a>` +
    '<div class="lang">' +
    `<button type="button" class="lang__btn md-state" id="langBtn" aria-label="${esc(t.langSwitcher.label)}" ` +
    'aria-haspopup="listbox" aria-expanded="false" aria-controls="langMenu">' +
    icon(ctx, 'globe', 'lang__globe') +
    `<span class="lang__code">${esc(current.code.toUpperCase())}</span>` +
    icon(ctx, 'caret', 'lang__caret', 2.2) +
    '</button>' +
    `<div class="lang__menu lang__menu--anim" id="langMenu" role="listbox" aria-label="${esc(t.langSwitcher.heading)}" hidden>` +
    `<p class="lang__heading">${esc(t.langSwitcher.heading)}</p>${options}</div>` +
    '</div></div></div></header>'
  )
}

function hero(t, ctx) {
  const panels = SCENE_KEYS.map(
    (key, i) =>
      `<figure class="hero-panel">${artFor(ctx, key, 'hero')}` +
      `<figcaption class="hero-panel__tag">${esc(t.hero.scenes[i])}</figcaption></figure>`,
  ).join('')

  const trust = t.hero.trust
    .map((label, i) => `<li class="md-chip">${icon(ctx, TRUST_ICONS[i], '', 2)}${esc(label)}</li>`)
    .join('')

  return (
    '<section class="hero" id="top"><div class="shell hero-grid"><div class="hero-copy">' +
    `<p class="md-chip md-chip--tonal hero-eyebrow">${esc(t.hero.eyebrow)}</p>` +
    `<h1 class="hero-title">${esc(t.hero.title)}</h1>` +
    `<p class="hero-sub">${esc(t.hero.subtitle)}</p>` +
    '<div class="hero-actions">' +
    `<a class="md-btn md-btn--md md-btn--filled md-state" href="#how">${esc(t.hero.cta)}${icon(ctx, 'arrow', 'md-btn__arrow', 2)}</a>` +
    `<a class="md-btn md-btn--md md-btn--outlined md-state" href="#experiences">${esc(t.hero.ctaSecondary)}</a></div>` +
    `<ul class="trust">${trust}</ul></div>` +
    `<div class="hero-art" aria-hidden="true">${panels}</div></div></section>`
  )
}

function sectionHead(t, eyebrow, title, lead, id) {
  return (
    '<div class="sec-head">' +
    `<p class="eyebrow">${esc(eyebrow)}</p>` +
    `<h2 class="sec-title" id="${id}">${esc(title)}</h2>` +
    `<p class="sec-lead">${esc(lead)}</p></div>`
  )
}

function experiences(t, ctx) {
  const cards = t.experiences.items
    .map((item, i) => {
      const l = t.experiences.labels
      const list = (items, mod) =>
        `<ul class="exp-list exp-list--${mod}">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
      return (
        `<div class="reveal" style="transition-delay:${i * 80}ms"><article class="md-card md-card--elevated exp-card">` +
        `<div class="exp-media">${artFor(ctx, item.id, 'card')}` +
        `<span class="exp-media__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span></div>` +
        '<div class="exp-body">' +
        `<h3 class="exp-title">${esc(item.title)}</h3>` +
        `<p class="exp-price">${esc(item.price)}</p>` +
        '<ul class="exp-facts">' +
        `<li class="md-chip">${icon(ctx, 'clock')}<span class="visually-hidden">${esc(l.duration)}: </span>${esc(item.duration)}</li>` +
        `<li class="md-chip">${icon(ctx, 'users')}<span class="visually-hidden">${esc(l.group)}: </span>${esc(item.group)}</li>` +
        '</ul>' +
        `<p class="exp-desc">${esc(item.description)}</p>` +
        '<div class="exp-lists">' +
        `<div><p class="exp-list__title">${esc(l.included)}</p>${list(item.included, 'yes')}</div>` +
        `<div><p class="exp-list__title">${esc(l.notIncluded)}</p>${list(item.notIncluded, 'no')}</div>` +
        '</div>' +
        `<div class="exp-cta"><a class="md-btn md-btn--outlined md-btn--block md-state" href="#how">${esc(l.book)}</a></div>` +
        '</div></article></div>'
      )
    })
    .join('')

  return (
    '<section class="section" id="experiences" aria-labelledby="experiences-title"><div class="shell">' +
    sectionHead(t, t.experiences.eyebrow, t.experiences.heading, t.experiences.lead, 'experiences-title') +
    `<div class="exp-grid">${cards}</div></div></section>`
  )
}

function features(t, ctx) {
  const items = t.features.items
    .map(
      (item, i) =>
        `<div class="reveal" style="transition-delay:${i * 70}ms"><div class="md-card md-card--filled feat">` +
        `<div class="feat__icon">${icon(ctx, FEATURE_ICONS[i])}</div>` +
        `<h3 class="feat__title">${esc(item.title)}</h3>` +
        `<p class="feat__body">${esc(item.body)}</p></div></div>`,
    )
    .join('')

  return (
    '<section class="section section--container-low" id="why" aria-labelledby="why-title"><div class="shell">' +
    sectionHead(t, t.features.eyebrow, t.features.heading, t.features.lead, 'why-title') +
    `<div class="feat-grid">${items}</div></div></section>`
  )
}

function flow(t, ctx) {
  const phases = t.flow.phases
    .map((phase, i) => {
      const [from, to] = PHASE_RANGES[i]
      return (
        '<li class="flow-phase-chip">' +
        `<span class="num" aria-hidden="true">${i + 1}</span><span class="label">${esc(phase)}</span>` +
        `<span class="range">${esc(t.flow.stepLabel)} ${from}–${to}</span></li>`
      )
    })
    .join('')

  const steps = t.flow.steps
    .map(
      (step, i) =>
        '<li class="flow-step">' +
        `<span class="flow-step__node" aria-hidden="true">${i + 1}</span>` +
        `<div class="reveal md-card md-card--outlined flow-step__card" style="transition-delay:${i * 40}ms">` +
        `<span class="flow-step__label">${esc(t.flow.stepLabel)} ${i + 1}</span>` +
        '<div class="flow-step__head">' +
        icon(ctx, STEP_ICONS[i], 'flow-step__icon') +
        `<h3 class="flow-step__title">${esc(step.title)}</h3></div>` +
        `<p class="flow-step__body">${esc(step.body)}</p></div></li>`,
    )
    .join('')

  return (
    '<section class="section flow" id="how" aria-labelledby="how-title"><div class="shell">' +
    sectionHead(t, t.flow.eyebrow, t.flow.heading, t.flow.lead, 'how-title') +
    `<ul class="flow-phases">${phases}</ul>` +
    `<ol class="flow-rail">${steps}</ol>` +
    `<div class="flow-cta"><a class="md-btn md-btn--filled md-state" href="#experiences">${esc(t.flow.cta)}${icon(ctx, 'arrow', 'md-btn__arrow', 2)}</a></div>` +
    '</div></section>'
  )
}

function notices(t, ctx) {
  const groups = t.notices.groups
    .map((group, i) => {
      const conduct = group.icon === 'shield'
      return (
        `<div class="reveal" style="transition-delay:${i * 60}ms">` +
        `<div class="md-card md-card--outlined notice${conduct ? ' notice--conduct' : ''}">` +
        '<div class="notice__head">' +
        icon(ctx, NOTICE_ICONS[group.icon] || 'shield', 'notice__icon') +
        `<h3 class="notice__title">${esc(group.title)}</h3></div>` +
        (group.intro ? `<p class="notice__intro">${esc(group.intro)}</p>` : '') +
        `<ul class="notice__list">${group.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` +
        '</div></div>'
      )
    })
    .join('')

  return (
    '<section class="section section--container" id="notices" aria-labelledby="notices-title"><div class="shell">' +
    sectionHead(t, t.notices.eyebrow, t.notices.heading, t.notices.lead, 'notices-title') +
    `<div class="notice-grid">${groups}</div></div></section>`
  )
}

function faq(t) {
  const items = t.faq.items
    .map(
      (item) =>
        '<details class="faq-item"><summary class="md-state">' +
        '<span class="faq-item__q" aria-hidden="true">Q</span>' +
        `<span class="faq-item__text">${esc(item.q)}</span>` +
        '<span class="faq-item__sign" aria-hidden="true"></span></summary>' +
        `<div class="faq-item__a"><span class="mark" aria-hidden="true">A</span><p>${esc(item.a)}</p></div></details>`,
    )
    .join('')

  return (
    '<section class="section" id="faq" aria-labelledby="faq-title"><div class="shell">' +
    sectionHead(t, t.faq.eyebrow, t.faq.heading, t.faq.lead, 'faq-title') +
    `<div class="faq-list">${items}</div></div></section>`
  )
}

function finalCta(t, ctx) {
  return (
    '<section class="cta-band" aria-labelledby="cta-title"><div class="shell cta-band__inner">' +
    `<h2 id="cta-title">${esc(t.finalCta.heading)}</h2><p>${esc(t.finalCta.body)}</p>` +
    `<a class="md-btn md-btn--md md-btn--filled md-state" href="#experiences">${esc(t.finalCta.button)}${icon(ctx, 'arrow', 'md-btn__arrow', 2)}</a>` +
    '</div></section>'
  )
}

function footer(t) {
  const legal = t.footer.legal
    .map((label, i) => `<li><a class="md-state" href="${LEGAL_HREFS[i]}">${esc(label)}</a></li>`)
    .join('')
  const social = t.footer.social
    .map((label, i) => `<a class="md-chip md-state" role="listitem" href="${SOCIAL_HREFS[i]}">${esc(label)}</a>`)
    .join('')

  return (
    '<footer class="site-footer"><div class="shell"><div class="footer-grid">' +
    `<div class="footer-brand"><span class="brand">${brand()}</span>` +
    `<p class="footer-tagline">${esc(t.footer.tagline)}</p></div>` +
    '<nav aria-labelledby="footer-legal">' +
    `<p class="footer-heading" id="footer-legal">${esc(t.footer.legalHeading)}</p>` +
    `<ul class="footer-links">${legal}</ul></nav>` +
    `<div><p class="footer-heading" id="footer-social">${esc(t.footer.followHeading)}</p>` +
    `<div class="footer-social" role="list" aria-labelledby="footer-social">${social}</div></div>` +
    '</div><div class="footer-bottom">' +
    `<span>${esc(t.footer.copyright)}</span><span>Tokyo, Japan</span>` +
    '</div></div></footer>'
  )
}

function stickyCta(t) {
  return (
    '<div class="bottom-bar" data-visible="false" aria-hidden="true">' +
    `<div class="bottom-bar__price">` +
    `<span class="val">${esc(t.experiences.items[0].price)}</span></div>` +
    `<a class="md-fab md-state" href="#how" tabindex="-1">${esc(t.hero.cta)}</a></div>`
  )
}

export function renderBody(t, ctx) {
  return (
    '<a class="skip-link" href="#main">Skip to content</a>' +
    header(t, ctx) +
    '<main id="main">' +
    hero(t, ctx) +
    experiences(t, ctx) +
    features(t, ctx) +
    flow(t, ctx) +
    notices(t, ctx) +
    faq(t) +
    finalCta(t, ctx) +
    '</main>' +
    footer(t) +
    stickyCta(t)
  )
}
