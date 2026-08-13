import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

const PLACEHOLDER = 'example.com'
const SCAN_DIRS = ['src', 'static']
const SCAN_EXTENSIONS = ['.svelte', '.js', '.txt', '.xml', '.html']

/** @param {string} dir @returns {string[]} */
function scanForPlaceholder(dir) {
  const hits = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) hits.push(...scanForPlaceholder(path))
    else if (SCAN_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      if (readFileSync(path, 'utf-8').includes(PLACEHOLDER)) hits.push(path)
    }
  }
  return hits
}

/**
 * Placeholder-SEO guard: `example.com` in robots.txt/sitemap/llms.txt/page
 * heads must never reach a launched site. A fresh clone of the template still
 * deploys fine to its *.vercel.app URL (warning only) — the build hard-fails
 * only once a custom production domain is attached, which is the moment
 * placeholder SEO would leak onto the live site.
 */
function placeholderSeoGuard() {
  return {
    name: 'placeholder-seo-guard',
    apply: 'build',
    buildStart() {
      const hits = SCAN_DIRS.flatMap((dir) => scanForPlaceholder(dir))
      if (hits.length === 0) return
      const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || ''
      const launched = productionUrl && !productionUrl.endsWith('.vercel.app')
      const message = `'${PLACEHOLDER}' placeholder still present in: ${hits.join(', ')} — replace with the site's real domain`
      if (launched) throw new Error(`${message} (custom domain ${productionUrl} is attached)`)
      this.warn(message)
    },
  }
}

export default defineConfig({
  plugins: [sveltekit(), placeholderSeoGuard()],
})
