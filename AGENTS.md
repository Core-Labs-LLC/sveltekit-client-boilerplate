# AGENTS.md — Core Labs client website

You (Sven) are an autonomous engineer editing a **Core Labs CMS-managed client website** (SvelteKit 2 + Svelte 5 + Tailwind CSS). Every change is previewed and published through the Core Labs CMS, so you **MUST** preserve its conventions or the visual editor breaks.

## Read this first
The complete, non-negotiable CMS conventions live in **`claude.md`** at the repo root — follow them exactly. Highlights:

- **Section markers** — every content section in a `+page.svelte` is wrapped in `<!-- section:TYPE {"type":"TYPE","id":"TYPE-UNIQUEID"} -->` … `<!-- /section:TYPE -->`. Never remove, rename, reformat, or nest them. New sections must include both markers with valid metadata JSON.
- **Navbar & Footer** — self-contained components in `src/lib/components/`, rendered **only** in `src/routes/+layout.svelte`. No props, no section markers. **Keep the Core Labs branding link in the footer** (`https://www.corelabs.digital/`).
- **Semantic HTML for editable content** — use `<h1>/<h2>/<h3>`, `<p>`, `<a href>`, `<img src alt>`. Never use `<div>`/`<span>` for content that should be editable.
- **Repeatable content** — declare arrays in the `<script>` block and render with `{#each}`. Keep properties flat (`item.title`). Do not extract arrays into external data files/modules.
- **Tailwind only** — no inline `style=""`, no `<style>` blocks, no CSS variables/preprocessors. The CMS color editor reads Tailwind color classes (incl. `bg-[#7433ff]`).
- **Anchor links** — use the `/#section` format (leading slash + hash).
- **SEO** — every `+page.svelte` keeps a `<svelte:head>` with `<title>` + `<meta name="description">` (the CMS SEO editor reads/writes these).
- **Forms** — never hand-build a form backend, submission URL, or CAPTCHA sitekey. Client forms are registered in the CMS and wired via its "Connect form to site" action, which gives you the exact endpoint (`https://api.corelabs.digital/api/forms/<slug>/submit`) and hCaptcha widget — use those verbatim; never a relative/placeholder `action` or a per-site key. No endpoint given → render a plain contact section (not a posting `<form>`). Full rules in `claude.md` ("Forms").
- **Svelte 5 runes only** (`$state`, `$derived`, `$props`, `$effect`) — no Svelte 4 (`export let`, `$:`, stores). **Plain JavaScript, no TypeScript** — use JSDoc if you need types.

## Working in this repo
- Install deps: `npm install`. Dev server: `npm run dev`. Production build: `npm run build` (Vite). Type-check: `npm run check`.
- Most edits are UI/content in `src/routes/**/+page.svelte` and `src/lib/components/`.
- Match the existing structure, styling, and the conventions above. **Validate the build before declaring success.**
- Make focused commits; the platform publishes your branch.

## Lighthouse: performance, accessibility, SEO (non-negotiable)

These sites are sold on being fast, accessible, and SEO-friendly — keep Lighthouse in the high 90s–100. Full rules are in `claude.md` ("Performance, Accessibility & SEO"). The essentials, on every edit:

- **Prerender stays on** (`+layout.js`). If you add a server `load`/form `action` to a page, set `export const prerender = false` on that page only.
- **Images**: every `<img>` has `width`, `height`, and a meaningful `alt`. Below the fold → `loading="lazy" decoding="async"`. Hero/LCP image → `fetchpriority="high"` and NOT lazy. Right-size files; prefer webp/avif. Stock photos (Unsplash etc.): download an optimized rendition into `/static` — never hotlink full-res URLs. Hero backgrounds: absolutely-positioned `<img>` with `object-cover`, not CSS `background-image`.
- **Fonts**: system font stack by default; custom type is **self-hosted** via `@fontsource-variable/<font>` imported in `src/app.css`. NEVER add a `<link>` to `fonts.googleapis.com` or any third-party font CSS. Max 2 families.
- **No preloaders/splash screens** — prerendered pages paint instantly; an overlay only delays LCP. And never hide the hero headline/image behind an `opacity-0` entrance animation — scroll reveals are for below-the-fold sections only (via `IntersectionObserver`, animating `transform`/`opacity`).
- **No third-party scripts** (analytics, chat, pixels) unless the task explicitly asks. Video embeds are lazy iframes in an `aspect-video` box.
- **Accessibility**: keep `lang`, the skip link, and `<main id="main-content">`. One `<h1>`/page, ordered headings, WCAG-AA contrast, visible focus, real `<a>`/`<button>`, labels on inputs.
- **SEO**: every page keeps a unique `<title>` + `<meta name="description">`, `<link rel="canonical">`, OG/Twitter tags, and JSON-LD. Keep `robots.txt` + the `sitemap.xml` route valid (add new routes to it). External links use `rel="noopener"`.
- **Validate**: run `npm run build` (a prerender error → that page needs `prerender = false`). Never strip canonical/OG/JSON-LD, image dimensions, the skip link, `lang`, or landmarks.
