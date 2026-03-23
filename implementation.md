# Implementation Prompt

> Fill in the **Client Brief** section for each new project. The **Technical Rules** section is constant — don't modify it unless the boilerplate or CMS requirements change.

---

## Client Brief

### Objective

<!-- What is this project? Who is the client? What do they do, who do they serve, and what is the goal of this website? Write this as a narrative — the more context you provide, the better the design and copy will be. -->

{{OBJECTIVE — e.g. "I am building a website for my new client, Waterproof Charts. Waterproof Charts provides durable, weather-resistant nautical charts and marine reference materials designed specifically for use in harsh maritime environments..."}}

### Existing Website *(optional)*

<!-- If the client has a current site, link it here. Useful for matching color schemes and understanding their current brand. -->

{{EXISTING_SITE_URL — e.g. "https://waterproofcharts.com/"}}

### Business Details

- **Company Name**: {{COMPANY_NAME}}
- **Industry**: {{INDUSTRY}}
- **Services/Products**: {{SERVICES}}
- **Target Audience**: {{TARGET_AUDIENCE}}
- **Address**: {{ADDRESS}}
- **Phone**: {{PHONE}}
- **Email**: {{EMAIL}}

### Brand Colors

{{BRAND_COLORS — e.g. "Match the color scheme to the original website" or "Use these colors: #7433ff, #334fff, #1a1a2e"}}

### Logo

<!-- Place the logo file in the /static folder before generating. -->

{{LOGO_INSTRUCTIONS — e.g. "Logo is at /logo.png in the static folder. Set the logo size to 120px in the navbar (including when scrolling), 160px on the preloader, and 90px in the footer." or "Use text-only branding with the company name."}}

### Design Direction

<!-- This is where you define the look and feel. Be as specific as you want — specific directives produce better results than generic ones. -->

Redesign this landing page to look like it was built by a top-tier modern design agency charging $60k+.

Focus on:

{{DESIGN_DIRECTIVES — replace this block with your specific design instructions. Examples below:}}

- Subtle, sophisticated animations (micro-interactions, smooth transitions)
- A cohesive, premium color palette (avoid anything that feels "template-y")
- Polished details: shadows, gradients, borders that feel intentional and high-end
- Visual rhythm and alignment that feels considered
- Use refined typography that aligns with the company's industry and brand identity
- Include a modern preloader animation that displays the company logo while the page loads
- Add a hero section background image that visually represents their core services or products, using an image sourced from Unsplash if none is provided
- Animate every stat/number on the page from 0, counting up when it scrolls into view
- Add a CTA section before the contact details suited for a modern layout
- Add a combined contact details + message form section before the footer
- Make sure the page scrolls to the top when clicking the company logo and when refreshing the page

### Page Sections & CTAs

<!-- Define the sections you want and the primary calls-to-action. Delete or add as needed. -->

Include these sections in order:
{{SECTIONS — e.g.}}
1. Hero with background image and primary CTA
2. Features / Services overview
3. Stats / Numbers (with count-up animation on scroll)
4. About / Why Choose Us
5. Testimonials
6. Pricing *(optional)*
7. CTA banner
8. Contact details + message form (combined section)
9. FAQ *(optional)*

Primary CTAs: {{CTAS — e.g. "Get a Free Quote", "Schedule a Consultation", "Shop Now"}}

### Reference Websites *(optional)*

<!-- Sites to draw design inspiration from. -->

{{REFERENCE_SITES — e.g. "stripe.com, linear.app — clean layout with lots of whitespace"}}

### Copywriting

<!-- Provide raw source material for the copy. Paste the client's own words, their "About Us" page, service descriptions, anything. Claude will rewrite it into polished marketing copy for the website. -->

Take full liberty with the copywriting for this website. In the client's own words, this is how they describe themselves and their services. This information needs to be conveyed in a way that is well-marketed and compelling to the end user.

___

{{CLIENT_COPY — paste the client's raw content here: about page text, service descriptions, unique selling points, anything relevant}}

___

---

## Technical Rules

> **Do not modify this section.** These rules ensure compatibility with the Core Labs CMS and the SvelteKit boilerplate in this repo.

### Files to Generate

Generate exactly **4 files**, overwriting the existing stubs:

1. **`src/lib/components/Navbar.svelte`** — Site navigation bar
2. **`src/lib/components/Footer.svelte`** — Site footer
3. **`src/routes/+layout.svelte`** — App shell that imports shared components
4. **`src/routes/+page.svelte`** — Homepage with all page sections

### Component Architecture

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
- The boilerplate has Tailwind configured with `@tailwindcss/typography` and a custom `xs: 375px` breakpoint

### Navigation & Links

- All anchor links MUST use the `/#section` format (e.g. `href="/#services"`, `href="/#contact"`)
- Add smooth scrolling via Tailwind's `scroll-smooth` class on the outermost wrapper, OR add an `$effect` in the layout that sets `document.documentElement.style.scrollBehavior = 'smooth'`

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

### Design Excellence

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
