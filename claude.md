# CMS Compatibility Rules

This site is managed through the Core Labs CMS (WYSIWYG editor). All changes MUST preserve the following conventions or the visual editor will break. These rules are non-negotiable.

## Section Markers

Every content section in `+page.svelte` files MUST be wrapped with HTML comment markers. The CMS parser uses these to identify, edit, reorder, and delete sections.

```html
<!-- section:hero {"type":"hero","id":"hero-1679012345"} -->
<section class="...">
  ...section content...
</section>
<!-- /section:hero -->
```

Rules:
- The opening marker format is: `<!-- section:TYPE {"type":"TYPE","id":"TYPE-UNIQUEID"} -->`
- The closing marker format is: `<!-- /section:TYPE -->`
- Opening and closing TYPE values must match exactly
- Every section must have a unique id in its metadata JSON
- NEVER remove, rename, or reformat these comment markers
- NEVER nest section markers inside other section markers
- When adding a new section, always include both markers with valid metadata JSON
- Valid section types: hero, features, text, image, gallery, testimonials, cta, pricing, contact, faq, stats, services, team
- navbar and footer are NOT page sections - they do NOT get section markers (see below)

## Navbar & Footer

- Navbar and Footer are self-contained Svelte components in `src/lib/components/`
- They are imported and rendered in `+layout.svelte`, NEVER in individual page files
- They must NOT accept props - all content is hardcoded within the component
- They must NOT have section markers
- Footer MUST include Core Labs branding: `<a href="https://www.corelabs.digital/">Core Labs</a>`
- Do not remove or modify the Core Labs branding link

## HTML Structure Requirements

The CMS extracts editable properties by matching semantic HTML tags. Use the correct tags so the editor can find and replace content:

- Headings: Use `<h1>`, `<h2>`, `<h3>` tags for headlines/titles (the editor searches for these by tag)
- Body text: Use `<p>` tags for paragraphs, descriptions, and subheadlines
- Links/Buttons: Use `<a href="...">` for CTAs and navigation links (the editor reads both the text content and the `href` attribute)
- Images: Use `<img src="..." alt="...">` for images (the editor reads and replaces `src` and `alt` attributes)
- Do NOT use non-semantic elements (e.g. `<div>` or `<span>`) for content that should be editable - the parser won't find them

## Repeatable/Dynamic Content Pattern

For repeatable content (feature cards, testimonials, team members, service items, etc.), use JavaScript arrays in the `<script>` block with `{#each}` loops. The CMS AI analyzer detects this pattern and exposes each item's fields as individually editable properties.

```svelte
<script>
  let services = [
    { title: 'Design', description: 'Beautiful interfaces', icon: '🎨' },
    { title: 'Development', description: 'Robust code', icon: '💻' }
  ];
</script>

{#each services as service}
  <div>
    <h3>{service.title}</h3>
    <p>{service.description}</p>
  </div>
{/each}
```

Rules:
- Array variable declarations must be in the `<script>` block (not imported from another file)
- Use simple, flat object properties (e.g. `service.title`, not `service.meta.title`)
- The array variable name and property names become the edit paths (e.g. `services[0].title`) - keep them clear and stable
- Do NOT refactor arrays into imported data files or external modules - the analyzer reads the script block directly

## Styling

- Tailwind CSS utility classes ONLY - no inline `style=""` attributes, no `<style>` blocks, no external CSS files
- Colors specified via Tailwind classes (`bg-blue-600`, `text-gray-900`, `border-green-500`) are detected as editable color fields by the CMS
- Tailwind arbitrary color values (`bg-[#7433ff]`) are also detected - the hex value is extracted
- Do NOT use CSS custom properties, CSS variables, or preprocessors

## Anchor Links

All internal anchor links MUST use the `/#section` format:

```html
<a href="/#services">Our Services</a>
<a href="/#contact">Get in Touch</a>
```

- The format is `/#sectionType` (hash prefixed with forward slash)
- Do NOT use `#services` (without the leading slash) - smooth scrolling and the CMS link editor depend on the `/#` format
- The target section element MUST carry a matching `id` (e.g. `<section id="services">`) so the anchor resolves. Prerendering validates these — a missing id only warns (it won't fail the build), but keep them in sync

## SEO Tags

Every `+page.svelte` MUST include a `<svelte:head>` block:

```svelte
<svelte:head>
  <title>Page Title - Site Name</title>
  <meta name="description" content="A clear description of this page." />
</svelte:head>
```

- Do NOT remove or omit these tags - the CMS has a dedicated SEO editor that reads and writes them
- Keep the `<svelte:head>` block at the top of the template markup (after the script block)

## Forms

Client forms (contact, quote request, newsletter signup, etc.) are **registered in the Core Labs CMS** and wired into the site through the CMS "Connect form to site" action. That action gives you the exact submission endpoint and the fields to render — **use the values from the task instructions verbatim.**

- **Never invent a form backend or submission URL.** The endpoint is always the CMS forms API: `https://api.corelabs.digital/api/forms/<form-slug>/submit`, where `<form-slug>` is supplied by the task. Never use a relative action, a placeholder like `__FORM_ACTION__`, or your own server route. If you are asked to add a form but no endpoint/slug was provided, do NOT guess one — render a plain contact section (heading + copy + CTA) and tell the user to create the form in CMS Forms, then use "Connect form to site."
- **Submit via `fetch()`**, not a native navigation: `method="POST"`, prevent the default submit, show a sending → success/error state, and reset the form on success. Because the POST goes to an external endpoint via `fetch`, the page does **not** need `export const prerender = false`.
- **hCaptcha** (when the task says the form requires it):
  - Load the script once in `<svelte:head>`: `<script src="https://js.hcaptcha.com/1/api.js" async defer></script>`.
  - Render the widget inside the form, before the submit button: `<div class="h-captcha" data-sitekey="9f64291e-4d3a-4ae8-b4ee-5692268481b2"></div>`. This is Core Labs' **shared public** hCaptcha sitekey — use it verbatim; never substitute a placeholder or a per-site key (a wrong key shows "The sitekey for this hCaptcha is incorrect").
  - On submit, read the token from `[name="h-captcha-response"]` and include it in the POST body as `h-captcha-response`. If it's empty, block submission, ask the user to complete the CAPTCHA, and call `hcaptcha.reset()`.
- **Honeypot**: include the hidden spam field named in the task (default `website`), hidden with Tailwind utilities (not inline styles) and left empty: `<input type="text" name="website" class="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" tabindex="-1" autocomplete="off" />`.
- **Field names**: use the exact posted keys from the task (typically semantic names like `name`, `email`, `phone`, `message`, `company`). Every input has an associated `<label>`.

## Mailing List Signup

Newsletter / mailing-list signups POST to the Core Labs mailing API — **never build your own backend or store emails locally.**

- **Endpoint**: `POST https://api.corelabs.digital/api/mailing-lists/<app-id>/submit`, where `<app-id>` is this site's Core Labs app id. The app id is supplied by the task instructions — **use it verbatim; never guess one or reuse an id from another site.** If asked to add a signup but no app id was provided, render the section without a posting form and say the signup must be connected via the CMS.
- **Fields** (exact posted keys): `email` (required), `name` (optional), `phone_number` (optional). Send as JSON or `application/x-www-form-urlencoded`.
- **Honeypot**: include a hidden input named `website` (hidden with Tailwind offscreen utilities, `tabindex="-1"`, `autocomplete="off"`) and leave it empty — the endpoint silently drops submissions where it is filled. Mailing-list signups do NOT use hCaptcha.
- **Submit via `fetch()`** exactly like forms: prevent the default navigation, sending → success/error states, show the `message` the endpoint returns (200 → `{ message, subscriber_id }`), reset on success. Because the POST is a `fetch` to an external endpoint, the page does **not** need `export const prerender = false`.

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
- **Section markers**: markup rendered from the blog API is data-driven, not CMS-editable — do NOT wrap the fetched listing/detail content in section markers. Static sections on those pages (a hero above the list, a CTA below) keep their markers as usual.

## Svelte Conventions

- Svelte 5 runes only: Use `$state`, `$derived`, `$effect`, `$props` - NOT the legacy Svelte 4 API (`export let`, reactive `$:` statements, stores)
- No TypeScript - plain JavaScript only. Type annotations should use JSDoc if needed
- Keep component files self-contained where possible

## What NOT to Do

- Do NOT remove or reformat section comment markers for "cleanliness" - they are functional, not decorative
- Do NOT move Navbar/Footer into page files or add section markers to them
- Do NOT extract page content arrays into separate data files or modules
- Do NOT replace semantic HTML tags (`h1`, `h2`, `p`, `a`, `img`) with generic elements (`div`, `span`)
- Do NOT use inline styles or `<style>` blocks - the color editor depends on Tailwind classes
- Do NOT change anchor link format away from `/#section`
- Do NOT remove `<svelte:head>` SEO tags
- Do NOT add TypeScript syntax
- Do NOT remove the Core Labs branding from the footer
- Do NOT build local backends or storage for forms, mailing lists, or blog posts - those live in the Core Labs CMS and the site talks to its public API
- Do NOT invent or reuse app ids / form slugs from other sites - identifiers always come verbatim from the task instructions
## Performance, Accessibility & SEO (Lighthouse)

Core Labs sites must score in the high 90s–100 on Google Lighthouse (Performance, Accessibility, Best Practices, SEO). Preserve and extend these on every edit:

### Performance
- **Prerendering**: pages are prerendered to static HTML via `+layout.js` (`export const prerender = true`). Keep it. A page that adds a server `load` or a form `action` must set `export const prerender = false` on THAT page only. Contact forms that POST via `fetch` to an external endpoint do NOT need this.
- **Images** (biggest perf lever — LCP + CLS):
  - ALWAYS set `width` and `height` (intrinsic pixels) on every `<img>` so the browser reserves space (no layout shift).
  - Below-the-fold images: add `loading="lazy"` and `decoding="async"`.
  - The hero / largest above-the-fold image: do NOT lazy-load it; add `fetchpriority="high"`.
  - Prefer modern formats (`.webp`/`.avif`) and reasonably sized files; never ship a 4000px image into a 600px slot.
  - **Stock imagery (Unsplash etc.)**: download the image into `/static` and optimize it first (webp, ≤ 1920px wide for heroes / ≤ 1200px for content images, roughly ≤ 250KB) — fetch a pre-sized rendition (Unsplash supports `?auto=format&fit=crop&w=1920&q=75` at download time) or convert locally (`npx @squoosh/cli`, `sharp`, `cwebp`). Never hotlink a full-resolution stock URL. If an external image URL is unavoidable, append its CDN sizing params (Unsplash: `?auto=format&fit=crop&w=1600&q=75`) and add a `<link rel="preconnect">` for that origin.
  - **Hero backgrounds**: use an absolutely-positioned `<img class="absolute inset-0 h-full w-full object-cover" fetchpriority="high" width height alt>` inside a `relative` section instead of a CSS `background-image` — the browser can prioritize it, it can't shift layout, and it stays editable in the CMS (the parser reads `<img>` tags, not CSS urls).
- **Fonts**: the default is the system font stack — it costs zero bytes and is perfectly acceptable. When the brand calls for custom type, **self-host** it: `npm install @fontsource-variable/<font>` and import it once at the top of `src/app.css` (e.g. `@import '@fontsource-variable/inter';`), then reference the family in `tailwind.config.js` `theme.extend.fontFamily`. The files ship same-origin, cached immutably, with `font-display: swap` built in. **NEVER add a `<link>` to `fonts.googleapis.com`, `use.typekit.net`, or any third-party font CSS** — render-blocking cross-origin CSS is one of the biggest Lighthouse penalties. Maximum 2 font families per site; prefer variable fonts (one file covers all weights).
- **No preloaders or splash screens.** These pages are prerendered static HTML that paints almost instantly; a loading overlay only *delays* first paint and tanks FCP/LCP. If a task asks for a "preloader", deliver polished entrance styling instead and note why.
- **Animations must not hide the LCP element.** The hero headline and hero image must render visible immediately — never start them at `opacity-0` waiting for JS (Lighthouse measures LCP at the element's final paint). Scroll-triggered reveals are for below-the-fold sections only, driven by `IntersectionObserver` (never scroll listeners), animating only `transform`/`opacity`. Count-up stat numbers: add Tailwind `tabular-nums` and render the final value in markup (animate after hydration) so there's no layout shift and no empty content for crawlers.
- **Third-party scripts & embeds**: add NO analytics, chat widgets, or tracking pixels unless the task explicitly asks; each one costs Lighthouse points. Required scripts (e.g. hCaptcha) load `async defer`. Video embeds: `<iframe loading="lazy">` inside an `aspect-video` container, or better, a thumbnail facade that injects the iframe on click.
- Tailwind utility classes only (CSS is purged + tiny). No large client-side JS libraries; Svelte ships almost none by default — keep it that way.
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

### Validate
- Run `npm run build` before declaring success (a prerender error means a page needs `export const prerender = false`). Keep these guarantees intact — do not strip canonical/OG/JSON-LD, image dimensions, the skip link, `lang`, or landmark elements for "cleanliness".
