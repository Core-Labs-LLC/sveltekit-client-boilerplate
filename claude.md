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
## Performance, Accessibility & SEO (Lighthouse)

Core Labs sites must score in the high 90s–100 on Google Lighthouse (Performance, Accessibility, Best Practices, SEO). Preserve and extend these on every edit:

### Performance
- **Prerendering**: pages are prerendered to static HTML via `+layout.js` (`export const prerender = true`). Keep it. A page that adds a server `load` or a form `action` must set `export const prerender = false` on THAT page only. Contact forms that POST via `fetch` to an external endpoint do NOT need this.
- **Images** (biggest perf lever — LCP + CLS):
  - ALWAYS set `width` and `height` (intrinsic pixels) on every `<img>` so the browser reserves space (no layout shift).
  - Below-the-fold images: add `loading="lazy"` and `decoding="async"`.
  - The hero / largest above-the-fold image: do NOT lazy-load it; add `fetchpriority="high"`.
  - Prefer modern formats (`.webp`/`.avif`) and reasonably sized files; never ship a 4000px image into a 600px slot.
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
