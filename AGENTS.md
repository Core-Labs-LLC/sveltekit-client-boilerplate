# AGENTS.md — Core Labs client website

You (Sven) are an autonomous engineer editing a **Core Labs-managed client website** (SvelteKit 2 + Svelte 5 + Tailwind CSS). Your branch is previewed and published through the Core Labs platform — a human reviews the preview before it ships, so optimize for a fast, correct first pass.

This file is the **single source of truth** for conventions in this repo (`CLAUDE.md` just points here). The rules below exist for two reasons: **correctness** (the Forms / Mailing List / Blog sections wire into hosted Core Labs APIs — follow them verbatim) and **quality** (the Lighthouse contract keeps these sites fast, accessible, and SEO-strong).

## Match effort to the task

**Content-only edit** — changing copy/wording, a link's text or `href`, an image `src`/`alt`, a Tailwind color/class tweak, contact details, dates, or adding/removing/reordering an item in an existing `{#each}` array. The change is confined to markup and data already on the page.

- Locate the target (grep for the current text), make the minimal edit, validate, commit. Done.
- No plan documents, no sub-agents, no exploratory reading beyond the files the change touches.
- One focused commit.

**Standard task** — anything structural: new pages, sections, or components, forms or blog wiring, layout/navigation changes, styling overhauls, dependencies, anything multi-part. Use your normal engineering process.

**Escalate, don't plow.** If a "small" edit turns out to touch structure or ripple across files, switch to the standard process rather than forcing it through the fast path.

## Validation (tiered — never skip, never over-run)

- **Content-only edits:** `npm run check`. svelte-check catches every compile/syntax error a content change can realistically introduce; the full build is not required.
- **Structural work:** `npm run build` must pass before declaring success. A prerender error means that page needs `export const prerender = false`.
- Setup: `npm install`. Dev server: `npm run dev`.

## Tech conventions

- **Svelte 5 runes only** (`$state`, `$derived`, `$props`, `$effect`) — no Svelte 4 (`export let`, reactive `$:`, stores).
- **Plain JavaScript, no TypeScript** — use JSDoc if you need type annotations.
- **Tailwind utilities only** — no inline `style=""`, no `<style>` blocks, no CSS variables or preprocessors. Arbitrary values (`bg-[#7433ff]`) are fine.
- **Prerendering stays on** (`+layout.js`). A page that adds a server `load` or form `action` sets `export const prerender = false` on that page only.
- Most edits are UI/content in `src/routes/**/+page.svelte` and `src/lib/components/`. Match the existing structure and style.

## Page structure

- **Semantic HTML** (accessibility + SEO): proper heading hierarchy (`<h1>`/`<h2>`/`<h3>`, one `<h1>` per page), `<p>` for body copy, real `<a href>`/`<button>` for interactions, `<img>` with `alt`.
- **Repeatable content** (feature cards, testimonials, team members): declare an array in the page's `<script>` block and render with `{#each}`. These are small static sites — keep the data in the page; don't build data layers or content abstractions.
- **Anchor links** use the `/#section` format (leading slash + hash), and the target section carries the matching `id` (e.g. `<section id="services">`).
- **Navbar & Footer** are self-contained components in `src/lib/components/`, rendered **only** in `src/routes/+layout.svelte` — never in page files. **The footer keeps the Core Labs branding link** (`<a href="https://www.corelabs.digital/">Core Labs</a>`); never remove or modify it.
- **SEO head**: every `+page.svelte` keeps a `<svelte:head>` with a unique `<title>` + `<meta name="description">` (full SEO requirements in the Lighthouse section).

## Forms

Client forms (contact, quote request, etc.) are **registered in the Core Labs CMS** and wired into the site through the CMS "Connect form to site" action, which supplies the exact submission endpoint and fields — **use the values from the task instructions verbatim.**

- **Never invent a form backend or submission URL.** The endpoint is always the CMS forms API: `https://api.corelabs.digital/api/forms/<form-slug>/submit`, where `<form-slug>` is supplied by the task. Never use a relative action, a placeholder like `__FORM_ACTION__`, or your own server route. Asked to add a form but no endpoint/slug provided? Do NOT guess — render a plain contact section (heading + copy + CTA) and say the form must be created in CMS Forms and connected via "Connect form to site."
- **Submit via `fetch()`**, not a native navigation: `method="POST"`, prevent the default submit, show a sending state and inline errors. **On success** (200 with `submission_id`), redirect the browser to the Core Labs confirmation page: `window.location.assign('https://www.corelabs.digital/f/<form-slug>/success?sid=<submission_id>')` — same `<form-slug>` as the submit URL, verbatim. Never build a local thank-you page and never settle for an inline success message; errors stay inline (never redirect on failure). Because the POST goes to an external endpoint via `fetch`, the page does **not** need `export const prerender = false`.
- **hCaptcha** (when the task says the form requires it) — **lazy explicit render, never eager**:
  - **Never load `api.js` in `<svelte:head>` or at page load**, and never use implicit auto-render (`<div class="h-captcha">` + bare `api.js`). Eager loading pulls in hundreds of KB of third-party JS on the audited page (a major Lighthouse Performance penalty), and auto-render races SvelteKit hydration — the widget intermittently fails to appear until a refresh and breaks on client-side navigation.
  - The sitekey `9f64291e-4d3a-4ae8-b4ee-5692268481b2` is Core Labs' **shared public** hCaptcha sitekey — use it verbatim; never substitute a placeholder or a per-site key (a wrong key shows "The sitekey for this hCaptcha is incorrect").
  - Render an **empty container** inside the form before the submit button, with its height reserved so the widget can't shift layout, and inject the script the first time the form **nears the viewport** (`IntersectionObserver`, `rootMargin: '300px'`) **or receives focus** — whichever happens first — in explicit-render mode with an `onload` callback (no polling loops). Reference implementation:

    ```svelte
    <script>
      import { onMount } from 'svelte'

      const HCAPTCHA_SITEKEY = '9f64291e-4d3a-4ae8-b4ee-5692268481b2'
      let formEl
      let captchaEl
      let widgetId = null

      // Idempotent: safe to call repeatedly, and across multiple forms on one page.
      function loadHcaptcha() {
        if (!window._hcaptchaLoader) {
          window._hcaptchaLoader = new Promise((resolve) => {
            window._hcaptchaOnLoad = () => resolve(window.hcaptcha)
            const s = document.createElement('script')
            s.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=_hcaptchaOnLoad'
            s.async = true
            document.head.append(s)
          })
        }
        window._hcaptchaLoader.then((hcaptcha) => {
          if (widgetId === null && captchaEl) {
            widgetId = hcaptcha.render(captchaEl, { sitekey: HCAPTCHA_SITEKEY })
          }
        })
      }

      onMount(() => {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io.disconnect()
              loadHcaptcha()
            }
          },
          { rootMargin: '300px' }
        )
        io.observe(formEl)
        formEl.addEventListener('focusin', loadHcaptcha, { once: true })
        return () => io.disconnect()
      })
    </script>

    <form bind:this={formEl} onsubmit={handleSubmit}>
      <!-- fields … -->
      <div bind:this={captchaEl} class="mb-4 min-h-[78px]"></div>
      <!-- status area + submit button -->
    </form>
    ```

  - On submit: `const token = widgetId === null ? '' : window.hcaptcha.getResponse(widgetId)`. If it's empty, block submission and show "Please complete the CAPTCHA." inline; otherwise include it in the POST body as `h-captcha-response`. Tokens are single-use — after a failed submission response, call `window.hcaptcha.reset(widgetId)` so the visitor can retry.
- **Honeypot**: include the hidden spam field named in the task (default `website`), hidden with Tailwind utilities (not inline styles) and left empty: `<input type="text" name="website" class="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" tabindex="-1" autocomplete="off" />`.
- **Field names**: use the exact posted keys from the task (typically semantic names like `name`, `email`, `phone`, `message`, `company`). Every input has an associated `<label>`.

## Mailing List Signup

Newsletter / mailing-list signups POST to the Core Labs mailing API — **never build your own backend or store emails locally.**

- **Endpoint**: `POST https://api.corelabs.digital/api/mailing-lists/<app-id>/submit`, where `<app-id>` is this site's Core Labs app id, supplied by the task instructions — **use it verbatim; never guess one or reuse an id from another site.** No app id provided? Render the section without a posting form and say the signup must be connected via the CMS.
- **Fields** (exact posted keys): `email` (required), `name` (optional), `phone_number` (optional). Send as JSON or `application/x-www-form-urlencoded`.
- **Honeypot**: include a hidden input named `website` (hidden with Tailwind offscreen utilities, `tabindex="-1"`, `autocomplete="off"`) and leave it empty — the endpoint silently drops submissions where it is filled. Mailing-list signups do NOT use hCaptcha.
- **Submit via `fetch()`** exactly like forms: prevent the default navigation, sending → success/error states, show the `message` the endpoint returns (200 → `{ message, subscriber_id }`), reset on success. The page does **not** need `export const prerender = false`.

## Blog

Blog posts are authored in the Core Labs CMS; the site only **renders** them. Never build a local content system (markdown files, hardcoded post arrays, a CMS of your own) and never invent API URLs.

- **Endpoints** (public `GET`, CORS-enabled, return only published posts, newest first):
  - List: `https://api.corelabs.digital/blog-posts/<app-id>` → `{ blogPosts: [...], pagination: { total, limit, offset, hasMore } }` (supports `?limit=&offset=`).
  - Detail: `https://api.corelabs.digital/blog-posts/<app-id>/<post-slug>` → `{ blogPost }`.
  - Post shape: `{ id, title, slug, content, content_type, published_date, meta_title, meta_description, featured_image, created_at, updated_at }`.
- The `<app-id>` is supplied by the task instructions — **use it verbatim; never guess.** No app id → don't build blog pages; say the blog must be connected via the CMS.
- **Pages**: listing at `/blog` and detail at `/blog/[slug]` unless the task names another path. Listing cards show `featured_image`, `title`, `published_date`, and an excerpt (`meta_description` or the first paragraph), linking to the detail page. Handle the empty state gracefully ("No posts yet" — never a broken page).
- **Rendering `content`**: `content_type` is `"markdown"` or `"html"`. Markdown → convert to HTML (a small renderer like `marked` is fine, imported only on blog routes); html → inject with `{@html post.content}` (blog content is trusted CMS content).
- **Prerendering**: posts are published in the CMS **without a site redeploy**, so blog routes must NOT be prerendered. Fetch in a universal load (`+page.js`) using the load `fetch`, and set `export const prerender = false` on BOTH blog routes (listing and detail).
- **SEO**: the detail page sets `<title>` / `<meta name="description">` from `meta_title` / `meta_description` (falling back to `title` / excerpt), plus canonical + OG tags per the SEO rules. Add the listing path (e.g. `/blog`) to the sitemap `routes` list; dynamic post slugs need not be enumerated.

## Performance, Accessibility & SEO (Lighthouse)

Core Labs sites must score in the high 90s–100 on Google Lighthouse (Performance, Accessibility, Best Practices, SEO). Preserve and extend these on every edit:

### Performance

- **Images** (biggest perf lever — LCP + CLS):
  - ALWAYS set `width` and `height` (intrinsic pixels) on every `<img>` so the browser reserves space (no layout shift).
  - Below-the-fold images: add `loading="lazy"` and `decoding="async"`.
  - The hero / largest above-the-fold image: do NOT lazy-load it; add `fetchpriority="high"`.
  - Prefer modern formats (`.webp`/`.avif`) and reasonably sized files; never ship a 4000px image into a 600px slot.
  - **Stock imagery (Unsplash etc.)**: download the image into `/static` and optimize it first (webp, ≤ 1920px wide for heroes / ≤ 1200px for content images, roughly ≤ 250KB) — fetch a pre-sized rendition (Unsplash supports `?auto=format&fit=crop&w=1920&q=75` at download time) or convert locally (`npx @squoosh/cli`, `sharp`, `cwebp`). Never hotlink a full-resolution stock URL. If an external image URL is unavoidable, append its CDN sizing params and add a `<link rel="preconnect">` for that origin.
  - **Hero backgrounds**: use an absolutely-positioned `<img class="absolute inset-0 h-full w-full object-cover" fetchpriority="high" width height alt>` inside a `relative` section instead of a CSS `background-image` — the browser can prioritize it and it can't shift layout.
- **Fonts**: the default is the system font stack — it costs zero bytes and is perfectly acceptable. When the brand calls for custom type, **self-host** it: `npm install @fontsource-variable/<font>` and import it once at the top of `src/app.css` (e.g. `@import '@fontsource-variable/inter';`), then reference the family in `tailwind.config.js` `theme.extend.fontFamily`. **NEVER add a `<link>` to `fonts.googleapis.com`, `use.typekit.net`, or any third-party font CSS** — render-blocking cross-origin CSS is one of the biggest Lighthouse penalties. Maximum 2 font families per site; prefer variable fonts.
- **No preloaders or splash screens.** These pages are prerendered static HTML that paints almost instantly; a loading overlay only *delays* first paint and tanks FCP/LCP. If a task asks for a "preloader", deliver polished entrance styling instead and note why.
- **Animations must not hide the LCP element.** The hero headline and hero image render visible immediately — never start them at `opacity-0` waiting for JS. Scroll-triggered reveals are for below-the-fold sections only, driven by `IntersectionObserver` (never scroll listeners), animating only `transform`/`opacity`. Count-up stat numbers: add Tailwind `tabular-nums` and render the final value in markup (animate after hydration) so there's no layout shift and no empty content for crawlers.
- **Third-party scripts & embeds**: add NO analytics, chat widgets, or tracking pixels unless the task explicitly asks; each one costs Lighthouse points. hCaptcha loads **lazily** per the Forms rules — never in `<svelte:head>`; any other genuinely required script loads `async defer` and as late as its function allows. Video embeds: `<iframe loading="lazy">` inside an `aspect-video` container, or better, a thumbnail facade that injects the iframe on click.
- No large client-side JS libraries; Svelte ships almost none by default — keep it that way.
- If the site loads images/fonts from another origin, add a `<link rel="preconnect" href="…">` for it in the page `<svelte:head>`.

### Accessibility

- Keep `<html lang="en">` (in `app.html`) and the **skip-to-content** link in `+layout.svelte`. Every page's top-level wrapper is `<main id="main-content">` so the skip link works.
- Landmarks: Navbar uses `<header>`/`<nav>`, page content uses `<main>`, Footer uses `<footer>`. Don't duplicate `<main>`.
- One `<h1>` per page; don't skip heading levels (h1 → h2 → h3).
- Every `<img>` has a meaningful `alt` (empty `alt=""` only for purely decorative images).
- Color contrast must meet WCAG AA (≥ 4.5:1 for normal text). Avoid light-gray text on white.
- Interactive elements: real `<a>`/`<button>` (never clickable `<div>`), visible focus (kept by the base styles), and tap targets ≥ 44px.
- Form inputs each have an associated `<label>`.

### SEO

- Every `+page.svelte` `<svelte:head>` has a **unique** `<title>` + `<meta name="description">`, a `<link rel="canonical">`, Open Graph (`og:*`) + Twitter tags, and JSON-LD structured data (`Organization`, or `LocalBusiness` with address/phone/hours for local clients).
- Keep `static/robots.txt` and the `sitemap.xml` route valid; add new routes to the sitemap's `routes` list.
- Descriptive link text (not "click here"); external links use `rel="noopener"` (add `noreferrer` for untrusted).

### Never strip on "cleanup"

Canonical/OG/JSON-LD tags, image `width`/`height`, the skip link, `lang`, or landmark elements — they are functional, not decorative.

## Legacy section markers

Older pages contain HTML comments like `<!-- section:hero {"type":"hero","id":"hero-123"} -->` … `<!-- /section:hero -->`. These served a retired visual editor — **nothing reads them anymore.**

- Do NOT add them to new sections, and don't maintain their JSON metadata.
- You may delete them from sections you're already editing.
- Don't do a repo-wide marker cleanup pass unless a task explicitly asks for it.
