# Implementation Prompt

> **Instructions**: Fill in the placeholders below (marked with `{{...}}`), then feed this file to Claude Code. Delete any optional sections that don't apply.

---

## Task

You are generating a production-ready single-page landing page using the SvelteKit boilerplate in this repository. Generate exactly **4 files**, overwriting the existing stubs:

1. **`src/lib/components/Navbar.svelte`** — Site navigation bar
2. **`src/lib/components/Footer.svelte`** — Site footer
3. **`src/routes/+layout.svelte`** — App shell that imports shared components
4. **`src/routes/+page.svelte`** — Homepage with all page sections

---

## Business Information

- **Company Name**: {{COMPANY_NAME}}
- **Industry**: {{INDUSTRY}}
- **Services/Products**: {{SERVICES}}
- **Target Audience**: {{TARGET_AUDIENCE}}
- **Address**: {{ADDRESS}}
- **Phone**: {{PHONE}}
- **Email**: {{EMAIL}}
- **Call-to-Actions**: {{CTAS — e.g. "Get a Free Quote", "Schedule a Consultation"}}

## Brand Colors

Use these colors in the design: {{BRAND_COLORS — e.g. #7433ff, #334fff, #1a1a2e}}

## Logo

{{LOGO_INSTRUCTIONS — e.g. "The logo is at /logo.png in the static folder. Include it in the navbar." or "Use text-only branding with the company name."}}

## Design Style *(optional)*

Style preference: {{STYLE — e.g. "Modern and minimal", "Bold and colorful", "Corporate and clean"}}

## Additional Design Instructions *(optional)*

{{DESIGN_INSTRUCTIONS — e.g. "Use a dark theme with light accents", "Include a video hero section"}}

## Reference Websites *(optional)*

{{REFERENCE_SITES — e.g. "stripe.com, linear.app — clean layout with lots of whitespace"}}

---

## Architecture Rules

### File Structure

**Navbar.svelte:**
- Self-contained component — no props, no external imports
- Mobile menu toggle using `$state`
- Logo/brand name, navigation links, and a CTA button
- Sticky/fixed positioning with scroll effects

**Footer.svelte:**
- Self-contained component — no props, no external imports
- Links, contact info, social icons, copyright
- **MUST** include "Proudly made by Core Labs" where "Core Labs" links to `https://www.corelabs.digital/` as a standard dofollow link (no `rel="nofollow"` or `rel="sponsored"`)

**+layout.svelte:**
- MUST import `'../app.css'` for Tailwind CSS
- MUST import and render Navbar and Footer from `'$lib/components/'`
- Use Svelte 5 children snippet pattern:
  ```svelte
  <script>
    import '../app.css'
    import Navbar from '$lib/components/Navbar.svelte'
    import Footer from '$lib/components/Footer.svelte'
    let { children } = $props()
  </script>
  <Navbar />
  <main>
    {@render children()}
  </main>
  <Footer />
  ```

**+page.svelte:**
- Do NOT include Navbar or Footer — they come from the layout
- Include 6–8 content sections: hero, features/services, stats, about/text, pricing, testimonials, CTA, contact, FAQ
- All section data (services array, testimonials array, etc.) goes in the `<script>` block
- Use `{#each}` loops to render repeatable content from data arrays
- MUST include a `<svelte:head>` block with an SEO-optimized `<title>` and `<meta name="description">`

### Svelte 5 Requirements

- Use Svelte 5 syntax with runes: `$state`, `$derived`, `$effect`, `$props`
- Runes are **built-in** — NEVER write `import { $state } from 'svelte'`
- Use `let { children } = $props()` in +layout.svelte, NOT `<slot />`
- Use plain JavaScript — NO TypeScript. Use `<script>` NOT `<script lang="ts">`

### Styling Requirements

- Use Tailwind CSS for ALL styling — NO inline styles, NO `<style>` blocks, NO custom CSS
- The boilerplate already has Tailwind configured with the `@tailwindcss/typography` plugin and a custom `xs: 375px` breakpoint

### Navigation & Links

- All anchor links MUST use the `/#section` format (e.g. `href="/#services"`, `href="/#contact"`)
- Add smooth scrolling: include `scroll-behavior: smooth` on the html element via Tailwind's `scroll-smooth` class on the outermost wrapper, OR add an `$effect` in the layout that sets `document.documentElement.style.scrollBehavior = 'smooth'`

### Scroll Animations

- Add scroll-triggered entrance animations to page sections using Svelte `$effect` and `IntersectionObserver`
- In +page.svelte, create a reusable scroll animation pattern:
  1. A function that observes elements and adds a class when they enter the viewport
  2. Use Tailwind classes: `opacity-0 translate-y-8` → `opacity-100 translate-y-0` with `transition-all duration-700`
  3. Stagger child elements within sections for a cascading reveal effect
  4. Keep animations subtle and professional — no bouncing or spinning

### Section Markers (Required for CMS)

Wrap each logical section of **+page.svelte only** with HTML comment markers for the visual block editor:

```html
<!-- section:TYPE {"type":"TYPE","id":"TYPE-UNIQUEID"} -->
  ...content...
<!-- /section:TYPE -->
```

Valid types: `hero`, `features`, `text`, `image`, `gallery`, `testimonials`, `cta`, `pricing`, `contact`, `faq`, `stats`, `services`, `team`

Do NOT add section markers to Navbar.svelte or Footer.svelte. Every distinct section in +page.svelte MUST be wrapped with these markers.

### Forms

When generating a contact form, quote request form, newsletter signup, or any form that collects user input:

- Set the form action to exactly: `action="__FORM_ACTION__"` — this placeholder will be replaced with the real submission endpoint after import.
- Set `method="POST"` on the form element.
- Include a hidden honeypot spam field inside the form:
  ```html
  <input type="text" name="website" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden" tabindex="-1" autocomplete="off" />
  ```
- Include the hCaptcha widget inside the form before the submit button:
  - Add in `<svelte:head>`: `<script src="https://js.hcaptcha.com/1/api.js" async defer></script>`
  - Add inside the form: `<div class="h-captcha" data-sitekey="{{HCAPTCHA_SITE_KEY}}"></div>`
- Handle form submission with JavaScript using `$state` for status tracking. On submit:
  1. Prevent default form submission
  2. Collect form data with `FormData`, convert to object
  3. Read `h-captcha-response`: `document.querySelector('[name="h-captcha-response"]')?.value`
  4. Include it in the POST body as `"h-captcha-response"`
  5. POST as JSON to the form's action URL with `Content-Type: application/json`
  6. Show success message on 200, error message otherwise
  7. Reset the form and hCaptcha widget on success: `if (typeof hcaptcha !== 'undefined') hcaptcha.reset()`
- Use semantic field names: `"name"`, `"email"`, `"phone"`, `"message"`, `"company"`, etc.
- Do NOT hardcode any submission URL — use only `__FORM_ACTION__`.

---

## Design Excellence

This is the most important part. Think **Stripe, Linear, Vercel, Apple** level design quality:

- **Typography**: Refined hierarchy — large bold headings, lighter subtext, consistent sizing
- **Animations**: Smooth hover transitions, fade-ins, scroll-triggered reveals — subtle and sophisticated
- **Color palette**: Cohesive and premium, derived from the brand colors — never generic or template-y
- **Polish**: Refined shadows, subtle gradients, intentional borders and spacing
- **Rhythm**: Consistent padding, alignment, and whitespace that feels considered
- **Responsive**: Mobile-first with breakpoints that look great at every size
- **Content**: Write rich, real-sounding copy — not lorem ipsum. Compelling headlines and descriptions tailored to the business

---

## Generate Now

Create the 4 files listed above in this repository. Write each file completely — no partial code or placeholders (except `__FORM_ACTION__` for forms). Every file should be production-ready.
