#!/usr/bin/env node
/**
 * Section components must name the ROLE a colour plays, never the colour.
 *
 * `bg-brand`, `text-ink-muted`, `border-line` — not `bg-blue-600`, not
 * `text-gray-900`, not `text-[#192b28]`. That is the single rule that lets one
 * section component look completely different on two client sites, and it is
 * why a shared catalogue does not produce fourteen identical sites.
 *
 * It is enforced rather than documented because it does not survive on trust:
 * one hurried build hardcodes `bg-slate-900`, the next copies it, and within a
 * quarter the catalogue is a theme.
 *
 * Zero dependencies on purpose — every client site inherits this repo's
 * package.json, and a lint rule is not worth a dependency in fourteen sites.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/** Only the catalogue is governed. Navbar/Footer are per-site by design. */
const ROOT = 'src/lib/components/sections'

/** Tailwind's built-in palettes — the ones that ignore a site's brand. */
const PALETTES =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
/** Utilities that take a colour. */
const PREFIXES =
  'bg|text|border|from|via|to|ring|fill|stroke|shadow|decoration|outline|accent|caret|divide|placeholder'

const RULES = [
  {
    id: 'palette-utility',
    re: new RegExp(`\\b(?:${PREFIXES})-(?:${PALETTES})-\\d{2,3}\\b`, 'g'),
    hint: 'use a token: bg-brand, bg-surface, text-ink, text-ink-muted, border-line',
  },
  {
    id: 'absolute-colour',
    re: new RegExp(`\\b(?:${PREFIXES})-(?:white|black)\\b`, 'g'),
    hint: 'use bg-surface / text-ink / text-brand-ink — a section that hardcodes white cannot follow a dark brand',
  },
  {
    id: 'hex',
    // Catches raw hex and Tailwind arbitrary values alike: text-[#192b28].
    re: /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g,
    hint: 'hex belongs in src/app.css as a token value, never in a component',
  },
]

/** Comments are prose — a hex in a note is not a violation. */
function stripComments(source) {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1')
}

/** @returns {string[]} */
function svelteFilesUnder(dir) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return [] // no catalogue yet — the ratchet engages with the first component
  }
  const out = []
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...svelteFilesUnder(full))
    else if (entry.endsWith('.svelte')) out.push(full)
  }
  return out
}

const files = svelteFilesUnder(ROOT)
const findings = []

for (const file of files) {
  const lines = stripComments(readFileSync(file, 'utf8')).split('\n')
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      rule.re.lastIndex = 0
      for (const match of line.matchAll(rule.re)) {
        findings.push({
          file: relative(process.cwd(), file),
          line: i + 1,
          match: match[0],
          hint: rule.hint,
        })
      }
    }
  })
}

if (!findings.length) {
  console.log(
    files.length
      ? `✓ design tokens: ${files.length} section component(s) clean`
      : '✓ design tokens: no section components yet',
  )
  process.exit(0)
}

console.error(`\n✗ ${findings.length} raw colour(s) in section components.\n`)
console.error('Section components carry STRUCTURE. Brand comes from tokens the site')
console.error('fills in at src/app.css, which is what stops every client site looking')
console.error('the same. Replace these with a token:\n')
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  ${f.match}`)
  console.error(`    → ${f.hint}`)
}
console.error('')
process.exit(1)
