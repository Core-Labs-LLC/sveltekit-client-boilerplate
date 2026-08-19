// Accessibility gate — the machine check behind the claim on /accessibility.
//
// Builds are scanned with axe-core against WCAG 2.0/2.1 Level A + AA in a real
// browser (contrast and target-size can't be evaluated without layout, so a
// DOM-only runner is not enough). Every prerendered page is checked at a mobile
// and a desktop viewport. Any `serious` or `critical` violation fails the run.
//
// Usage:  npm run a11y            (builds, then scans)
//         node scripts/a11y.mjs   (scans an existing build)
//
// Browser: uses the Chrome/Chromium already installed on the machine via
// playwright-core, so no 150MB browser download is added to `npm install`.

import { createReadStream, existsSync, readFileSync, readdirSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, relative, sep } from 'node:path'
import { chromium } from 'playwright-core'

const BUILD_DIR = '.vercel/output/static'
const FAIL_ON = new Set(['serious', 'critical'])
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]
// The WCAG levels we hold the sites to. `best-practice` rules are excluded:
// they are useful advice but are not WCAG failures, and gating on them would
// block work for reasons we can't defend in an accessibility statement.
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

/** Every prerendered page in the build, as site-root-relative URL paths. */
async function findPages(dir, base = dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    // `_app` holds hashed build assets, never pages.
    if (entry.isDirectory()) {
      if (entry.name !== '_app') out.push(...(await findPages(path, base)))
    } else if (entry.name.endsWith('.html')) {
      const rel = relative(base, path).split(sep).join('/')
      out.push('/' + rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, ''))
    }
  }
  return out.sort()
}

/** Static file server over the build output, mirroring how Vercel resolves. */
function serve(root) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0])
    const candidates = url.endsWith('/')
      ? [join(root, url, 'index.html'), join(root, url.slice(0, -1) + '.html')]
      : [join(root, url), join(root, url + '.html'), join(root, url, 'index.html')]
    const hit = candidates.find((p) => existsSync(p) && extname(p))
    if (!hit) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(hit)] || 'application/octet-stream' })
    createReadStream(hit).pipe(res)
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }))
  })
}

/**
 * Every place a Chrome-family browser might plausibly live. The gate must not
 * add a browser download to `npm install`, so it uses what the machine has:
 * Chrome on a CI runner, whatever the developer already browses with locally.
 * Set A11Y_CHROME_PATH to override.
 */
function candidateExecutables() {
  const home = process.env.HOME || ''
  const paths = [
    // Linux / CI runners.
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    // macOS applications.
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  ]
  // Browsers downloaded by puppeteer or playwright for other projects.
  for (const [cache, ...rest] of [
    [join(home, '.cache/puppeteer/chrome')],
    [join(home, 'Library/Caches/ms-playwright')],
    [join(home, '.cache/ms-playwright')],
  ]) {
    void rest
    if (!existsSync(cache)) continue
    for (const version of readdirSync(cache)) {
      const base = join(cache, version)
      paths.push(
        join(base, 'chrome-linux64/chrome'),
        join(base, 'chrome-linux/chrome'),
        join(base, 'chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
        join(base, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
        join(base, 'chrome-mac/Chromium.app/Contents/MacOS/Chromium'),
        join(base, 'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium'),
      )
    }
  }
  return paths
}

/** Launch whichever Chrome-family browser this machine already has. */
async function launch() {
  const args = ['--no-sandbox', '--disable-dev-shm-usage']
  const override = process.env.A11Y_CHROME_PATH
  if (override) return chromium.launch({ executablePath: override, args })

  const attempts = []
  for (const channel of ['chrome', 'chromium', 'msedge']) {
    try {
      return await chromium.launch({ channel, args })
    } catch (error) {
      attempts.push(`channel:${channel}`)
    }
  }
  for (const executablePath of candidateExecutables()) {
    if (!existsSync(executablePath)) continue
    try {
      return await chromium.launch({ executablePath, args })
    } catch (error) {
      attempts.push(executablePath)
    }
  }
  throw new Error(
    'No Chrome-family browser found — the accessibility gate needs one.\n' +
      'Install Google Chrome, or point A11Y_CHROME_PATH at an existing binary.\n' +
      `Tried: ${attempts.join(', ') || 'nothing'}`,
  )
}

async function main() {
  if (!existsSync(BUILD_DIR)) {
    console.error(`No build found at ${BUILD_DIR}. Run \`npm run build\` first.`)
    process.exit(1)
  }

  const pages = await findPages(BUILD_DIR)
  if (pages.length === 0) {
    console.error(`No prerendered pages found in ${BUILD_DIR}.`)
    process.exit(1)
  }

  const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf-8')
  const { server, port } = await serve(BUILD_DIR)
  const browser = await launch()

  /** @type {Map<string, { impact: string, help: string, helpUrl: string, targets: Set<string> }>} */
  const findings = new Map()
  let checks = 0

  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: 'reduce',
      })
      for (const path of pages) {
        const page = await context.newPage()
        await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: 'load' })
        await page.addScriptTag({ content: axeSource })
        const result = await page.evaluate(
          (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
          AXE_TAGS,
        )
        checks++
        for (const violation of result.violations) {
          const key = `${violation.id}::${path}`
          if (!findings.has(key)) {
            findings.set(key, {
              id: violation.id,
              impact: violation.impact,
              help: violation.help,
              helpUrl: violation.helpUrl,
              path,
              viewports: new Set(),
              targets: new Set(),
            })
          }
          const entry = findings.get(key)
          entry.viewports.add(viewport.name)
          for (const node of violation.nodes) entry.targets.add(node.html.slice(0, 120))
        }
        await page.close()
      }
      await context.close()
    }
  } finally {
    await browser.close()
    server.close()
  }

  const all = [...findings.values()]
  const blocking = all.filter((f) => FAIL_ON.has(f.impact))
  const advisory = all.filter((f) => !FAIL_ON.has(f.impact))

  console.log(
    `\nAccessibility scan — ${pages.length} page(s) × ${VIEWPORTS.length} viewport(s) = ${checks} checks`,
  )
  console.log(`WCAG 2.1 Level AA (axe tags: ${AXE_TAGS.join(', ')})\n`)

  const report = (title, list) => {
    if (list.length === 0) return
    console.log(`${title}`)
    for (const f of list) {
      console.log(`  ${f.impact.toUpperCase().padEnd(8)} ${f.id}  ${f.path}  [${[...f.viewports].join(', ')}]`)
      console.log(`           ${f.help}`)
      for (const t of [...f.targets].slice(0, 3)) console.log(`           → ${t}`)
      if (f.targets.size > 3) console.log(`           → …and ${f.targets.size - 3} more`)
      console.log(`           ${f.helpUrl}`)
    }
    console.log('')
  }

  report(`BLOCKING (${blocking.length}) — serious/critical, these fail the build`, blocking)
  report(`ADVISORY (${advisory.length}) — minor/moderate, fix when you're in the file`, advisory)

  if (blocking.length > 0) {
    console.error(
      `Accessibility gate FAILED: ${blocking.length} serious/critical issue(s).\n` +
        `Fix them, or if one is a genuine false positive, say so in the PR — do not silence the gate.\n`,
    )
    process.exit(1)
  }

  console.log(
    advisory.length > 0
      ? `Accessibility gate PASSED with ${advisory.length} advisory issue(s).\n`
      : `Accessibility gate PASSED — no WCAG 2.1 AA violations found.\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
