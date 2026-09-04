# REAL JAPAN NOW — landing page

Multilingual landing page for an inbound-tourism experience booking platform in
Tokyo. Three experiences, four languages, and a seven-step booking flow.

**Main copy:** *Not tourism. Join everyday life in Japan.*

---

## Two ways to look at it

| | What it is | How to run |
|---|---|---|
| **`preview/index.html`** | The whole page as one self-contained file — no build, no server, no network needed. Open it in a browser. | double-click, or `open preview/index.html` |
| **Next.js app** | The production implementation: App Router, TypeScript, component-per-section. | `npm install && npm run dev` |

Both are generated from **the same sources**, so they cannot drift:

```
messages/{en,ko,zh-TW,fr}.json   all copy, all four languages
src/icons.json                   the icon set (SVG path data)
public/art/*.svg                 the three scene illustrations
src/styles/lp.css                the entire design system
```

`npm run preview` rebuilds `preview/index.html` (and `preview/artifact.html`, the
same page without the `<html>/<head>/<body>` shell) from those files.

---

## Stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript** (strict)
- **Tailwind CSS** — configured and available for utilities. The design system
  itself lives in plain CSS (`src/styles/lp.css`) because that file is shared
  verbatim with the standalone preview. Tailwind's preflight is disabled since
  `lp.css` ships its own reset.
- **Framer Motion** — the language dropdown's open/close animation.
- SEO: metadata API, JSON-LD (`Organization`, `WebSite`, 3 × `Product` with
  offers, `FAQPage`), `sitemap.xml`, `robots.txt`, and a real `og.png`.
- PWA: `manifest.webmanifest` + a network-first service worker (production only).
- Analytics: GA4 and GTM, both **inert unless the env var is set**.

```bash
npm run dev        # localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run preview    # regenerate the standalone preview
```

Copy `.env.example` to `.env.local` to set the site URL and analytics IDs.

---

## Languages

English (default), 한국어, 繁體中文, Français.

The globe button sits in the header at every breakpoint. Clicking it opens a
white dropdown (8px radius, soft shadow) listing flag + language name, with the
active language in the accent red and a check mark. Every row is a 44px tap
target. It closes on outside click and on `Escape`, and the arrow keys move
between rows.

- On first visit the language is detected from `navigator.languages`.
  `zh-Hant`, `zh-TW`, `zh-HK` and `zh-MO` map to Traditional Chinese; a bare
  `zh` deliberately does not.
- The choice is stored in `localStorage` and survives reloads.
- `<html lang>` and `<html data-locale>` update on every switch, which is what
  drives the per-language font stack.
- **Korean and Traditional Chinese webfonts are only fetched when someone
  actually switches to that language** — the Latin faces ship in the document
  head. Loading all four families up front would cost roughly a megabyte for a
  visitor who never leaves English.

### Known trade-off: one URL for all four languages

Language switching is client-side, so the page never reloads and there is a
single canonical URL. That is the right call for a one-page LP, but it means
there are no per-language URLs for search engines to index.

If per-language SEO becomes a requirement, move to `next-intl` with a
`src/app/[locale]/` segment and emit `hreflang` alternates. The message files
are already shaped for it — `messages/*.json` is the format `next-intl` expects,
and every locale is validated to have an identical key shape.

---

## Structure

```
messages/                 copy for all four languages
preview/
  render.mjs              page renderer, shared by the build script and browser
  index.html              generated — standalone page
  artifact.html           generated — page contents only
scripts/build-preview.mjs generates the two files above
public/art/               vintage.svg, cooking.svg, jdm.svg
src/
  app/                    layout, page, sitemap, robots, globals.css
  components/             one component per section
  i18n/                   locale config + LanguageProvider
  styles/lp.css           the design system
  icons.json              icon path data
```

Sections in order: Header → Hero → 3 Experiences → Why us → How to book →
Before booking → FAQ → CTA → Footer, plus a mobile-only sticky booking bar.

---

## Design notes

- Accent red `#e63946`, structural navy `#1d3557`, on white with `#f6f7f9` /
  `#faf8f5` alternating sections. Hairline borders, generous whitespace.
- Mobile-first. Breakpoints at 640 / 900 / 1024px. Desktop nav and the header
  CTA appear at 900px and 1024px respectively; below 900px the sticky bottom bar
  takes over after the hero.
- Type: Inter + Poppins for Latin, Noto Sans KR / TC swapped in per locale. Body
  16px, headings clamp fluidly.
- The scroll reveal is a **progressive enhancement**: content is visible by
  default and only hidden once an inline script sets `html[data-js]`. Nothing
  disappears if JavaScript fails. `prefers-reduced-motion` disables it entirely.
- Anchor targets carry `scroll-margin-top` so they clear the sticky header.

### The artwork is placeholder

`public/art/*.svg` are hand-drawn scene illustrations standing in for
photography — a vintage shop interior, a home-cooked meal, and a JDM coupe on
the expressway at night. They keep the layout honest at real proportions.

To swap in real photos: replace the `src` on the `<img>` in `Hero.tsx` and
`Experiences.tsx` with your WebP assets (both are marked with a comment), or
switch those to `next/image`. The image config in `next.config.mjs` already
requests AVIF/WebP. Everything below the hero is already `loading="lazy"`.

---

## Not built yet

The page is the front door only. These are referenced but not implemented:

- The booking funnel itself (React Hook Form + Zod, Stripe / LINE Pay, ID upload
  to Supabase Storage with the 30-day auto-delete). The CTAs link to `#how`.
- The legal pages (`/terms`, `/privacy`, …) that the footer links to.
- Real social profile URLs.

---

## Copy accuracy

The supplied translations were used almost verbatim. Four deliberate changes:

1. **Korean step 7** contained Japanese text (`次回 할인 쿠폰`) — corrected to
   `다음에 쓸 수 있는 할인 쿠폰`.
2. **Korean FAQ 4** contained Japanese text (`대응을 心がけています`) — rewritten
   as natural Korean.
3. **Korean tone** was normalised to 해요체 throughout, as the brief specified.
   The supplied strings mixed 해요체 and 합니다체.
4. **Traditional Chinese** used 房主 ("landlord") for *host*. That reads oddly
   for a JDM driver or a fashion guide, so it is 主人 / 在地主人 throughout.

The long run-on notices were also split into bullet lists in every language —
same wording, easier to scan.
