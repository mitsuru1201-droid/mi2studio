/**
 * Generates the Material 3 colour roles from the brand colours and writes
 * src/styles/m3-color.css.
 *
 * The brief was "stay close to the original palette", so rather than letting a
 * single seed colour derive everything, the two brand colours are pinned
 * directly as the primary and secondary tonal palettes, and the neutrals are
 * given the navy's hue at very low chroma so surfaces land on the same cool
 * off-whites the original design used (#f6f7f9 and friends).
 *
 * Run with: npm run tokens
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  argbFromHex,
  hexFromArgb,
  Hct,
  TonalPalette,
  DynamicScheme,
  MaterialDynamicColors,
} from '@material/material-color-utilities'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const BRAND = {
  red: '#e63946', // original accent  -> primary
  navy: '#1d3557', // original heading -> secondary
  sand: '#d9a441', // ochre from the vintage artwork -> tertiary
}

/**
 * Variant.TONAL_SPOT — M3's default derivation. The fidelity/content variants
 * make *-container roles the source colour itself, which turned every container
 * into saturated red; tonal spot gives the usual light container tones. Brand
 * fidelity is handled by pinning the palettes and the primary tone below, so
 * nothing is lost by using the standard derivation here.
 */
const VARIANT_TONAL_SPOT = 2

const navyHct = Hct.fromInt(argbFromHex(BRAND.navy))
const redPalette = TonalPalette.fromInt(argbFromHex(BRAND.red))
const navyPalette = TonalPalette.fromInt(argbFromHex(BRAND.navy))

/* ---------------------------------------------------------------------------
 * Two deliberate departures from a stock M3 scheme, both to keep the original
 * palette recognisable. Each is computed, not eyeballed.
 * ------------------------------------------------------------------------- */

function relativeLuminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((pair) => {
      const v = parseInt(pair, 16) / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const WCAG_AA = 4.5

/**
 * M3 puts light-theme primary at tone 40, which reads a good deal deeper than
 * the brand red. The brand's own tone is 52, but white text on it only reaches
 * 4.17:1 — the original design's buttons failed WCAG AA. So: take the lightest
 * tone at or below the brand's that still clears AA against white.
 */
function brandFaithfulPrimaryTone() {
  const brandTone = Math.round(Hct.fromInt(argbFromHex(BRAND.red)).tone)
  for (let tone = brandTone; tone >= 30; tone--) {
    if (contrast(hexFromArgb(redPalette.tone(tone)), '#ffffff') >= WCAG_AA) return tone
  }
  throw new Error('no accessible tone found for the brand red')
}

const PRIMARY_TONE_LIGHT = brandFaithfulPrimaryTone()

/**
 * The original used the navy for every heading. Strict M3 would render those
 * as on-surface (near-black) and the page would lose that character, so the
 * navy is exposed as one documented custom role at its own tone.
 */
const HEADING_TONE = { light: Math.round(navyHct.tone), dark: 90 }

function buildScheme(isDark) {
  return new DynamicScheme({
    sourceColorArgb: argbFromHex(BRAND.red),
    variant: VARIANT_TONAL_SPOT,
    contrastLevel: 0,
    isDark,
    primaryPalette: TonalPalette.fromInt(argbFromHex(BRAND.red)),
    secondaryPalette: TonalPalette.fromInt(argbFromHex(BRAND.navy)),
    tertiaryPalette: TonalPalette.fromInt(argbFromHex(BRAND.sand)),
    // Cool, near-achromatic neutrals so surfaces stay close to the original
    // white / #f6f7f9 rather than picking up a warm red tint.
    neutralPalette: TonalPalette.fromHueAndChroma(navyHct.hue, 5),
    neutralVariantPalette: TonalPalette.fromHueAndChroma(navyHct.hue, 8),
  })
}

/** Every DynamicColor exposed by MaterialDynamicColors, as kebab-case roles. */
function roles(scheme) {
  const out = {}
  for (const key of Object.keys(MaterialDynamicColors)) {
    const value = MaterialDynamicColors[key]
    if (!value || typeof value.getArgb !== 'function') continue
    const name = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    out[name] = hexFromArgb(value.getArgb(scheme))
  }
  return out
}

const light = roles(buildScheme(false))
const dark = roles(buildScheme(true))

light.primary = hexFromArgb(redPalette.tone(PRIMARY_TONE_LIGHT))
light.heading = hexFromArgb(navyPalette.tone(HEADING_TONE.light))
dark.heading = hexFromArgb(navyPalette.tone(HEADING_TONE.dark))

/* Fail loudly rather than shipping unreadable text. */
const CHECKS = [
  ['primary / on-primary', light.primary, light['on-primary']],
  ['heading / surface', light.heading, light.surface],
  ['on-surface / surface', light['on-surface'], light.surface],
  ['on-surface-variant / surface', light['on-surface-variant'], light.surface],
  ['dark primary / on-primary', dark.primary, dark['on-primary']],
  ['dark heading / surface', dark.heading, dark.surface],
  ['dark on-surface / surface', dark['on-surface'], dark.surface],
  ['dark on-surface-variant / surface', dark['on-surface-variant'], dark.surface],
  ['primary-container pair', light['on-primary-container'], light['primary-container']],
  ['secondary-container pair', light['on-secondary-container'], light['secondary-container']],
  ['tertiary-container pair', light['on-tertiary-container'], light['tertiary-container']],
  ['on-surface / surface-container-highest', light['on-surface'], light['surface-container-highest']],
  ['dark primary-container pair', dark['on-primary-container'], dark['primary-container']],
  ['dark secondary-container pair', dark['on-secondary-container'], dark['secondary-container']],
  ['dark tertiary-container pair', dark['on-tertiary-container'], dark['tertiary-container']],
]
const failures = CHECKS.filter(([, a, b]) => contrast(a, b) < WCAG_AA)

const names = Object.keys(light).sort()
const block = (map, indent) =>
  names.map((n) => `${indent}--md-sys-color-${n}: ${map[n]};`).join('\n')

const css = `/* =========================================================================
   Material 3 colour roles — GENERATED, do not edit by hand.
   Source: scripts/generate-color-tokens.mjs (npm run tokens)
   Seeded from the brand palette: primary ${BRAND.red}, secondary ${BRAND.navy},
   tertiary ${BRAND.sand}.
   ========================================================================= */

:root {
  color-scheme: light dark;

${block(light, '  ')}
}

/* Follows the OS unless the page has explicitly opted into light. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${block(dark, '    ')}
  }
}

/* Explicit override always wins, in both directions. */
:root[data-theme='dark'] {
${block(dark, '  ')}
}

:root[data-theme='light'] {
${block(light, '  ')}
}
`

fs.writeFileSync(path.join(root, 'src/styles/m3-color.css'), css)
console.log(`src/styles/m3-color.css — ${names.length} roles x light/dark`)
console.log(`  primary tone ${PRIMARY_TONE_LIGHT} (brand red is tone 52, which fails AA)`)
for (const [label, a, b] of CHECKS) {
  console.log(`  ${contrast(a, b) >= WCAG_AA ? 'PASS' : 'FAIL'}  ${label.padEnd(34)} ${a} on ${b}  ${contrast(a, b).toFixed(2)}:1`)
}
if (failures.length) {
  console.error('\nContrast check failed for: ' + failures.map((f) => f[0]).join(', '))
  process.exit(1)
}
