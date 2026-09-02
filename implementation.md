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

{{LOGO_INSTRUCTIONS — e.g. "Logo is at /logo.png in the static folder. Set the logo size to 120px in the navbar (including when scrolling) and 90px in the footer." or "Use text-only branding with the company name."}}

### Design Direction

<!-- This is where you define the look and feel. Be as specific as you want — specific directives produce better results than generic ones. -->

Redesign this landing page to look like it was built by a top-tier modern design agency charging $60k+.

Focus on:

{{DESIGN_DIRECTIVES — replace this block with your specific design instructions. Examples below:}}

- Subtle, sophisticated animations (micro-interactions, smooth transitions)
- A cohesive, premium color palette (avoid anything that feels "template-y")
- Polished details: shadows, gradients, borders that feel intentional and high-end
- Visual rhythm and alignment that feels considered
- Use refined typography that aligns with the company's industry and brand identity (self-hosted via `@fontsource-variable` — see Performance rules; never a Google Fonts `<link>`)
- Add a hero section background image that visually represents their core services or products. If the client supplied none, follow the sourcing rules in `AGENTS.md` ("Finding imagery when the client has supplied none") — **not** an arbitrary stock site. Download and optimize into `/static` per the Performance rules; never hotlink at full resolution. **A site with no photographs reads as a wireframe however good the type is** — if no image source is available, build properly sized image slots and say so in your summary rather than shipping a page with none.
- Animate every stat/number on the page from 0, counting up when it scrolls into view (use `tabular-nums` and reserve the final width so digits don't shift the layout)
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

### Reference Websites

<!-- Two or three sites whose design hits the target. Fill this in — it is the highest-signal
     field in this brief. A URL you can look at beats any amount of prose describing a feeling:
     "warm and editorial" is unfalsifiable, three sites that nail it are executable. -->

{{REFERENCE_SITES — e.g. "stripe.com, linear.app — clean layout with lots of whitespace"}}

**Open these before designing anything.** Actually load each one and look at it — do not infer the
design from the domain name. Note what specifically is worth taking (the type pairing, the spacing,
the photographic treatment) and what is not. References are a target to hit, not a thing to copy.

### Competitive Context *(recommended)*

<!-- What do this client's competitors' sites look like, and where should we deliberately go
     instead? This is what differentiates a client WITHIN their industry rather than just making
     the site look like its category. It is the difference a client can actually feel. -->

{{COMPETITORS — e.g. "Every other chimney sweep in Pittsburgh runs red-and-black with stock fire
photography. Go warm neutral with real crew photography and generous whitespace."}}

### Signature Move

<!-- Name ONE memorable thing this site does. Generic sites have none, and a model with no
     instruction here will average toward the mean. It must be specific enough to point at in
     review — an unusual layout, a typographic choice, a photographic treatment. -->

{{SIGNATURE — e.g. "Oversized tabular numerals in the stats band, set in the display face at 8rem"}}

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

Overwrite these 4 stubs:

1. **`src/lib/components/Navbar.svelte`** — Site navigation bar
2. **`src/lib/components/Footer.svelte`** — Site footer
3. **`src/routes/+layout.svelte`** — App shell that imports shared components
4. **`src/routes/+page.svelte`** — Homepage, which **composes** the section components below

Plus **one file per page section** in `src/lib/components/sections/`:

- One component per section — `Hero.svelte`, `Services.svelte`, `Testimonials.svelte`, `Faq.svelte`, `Cta.svelte`, and so on. Name it for what the section IS, not where it sits.
- **Content comes in as props; the component owns only presentation and layout.** A section that hardcodes this client's copy cannot be reused on the next site, and reuse is the point.
- `+page.svelte` holds the content — the data arrays and the strings — and passes them down. It stays the one predictable place to change wording.

This split exists so that well-made sections can be lifted into a shared catalogue later, and so that editing one section doesn't mean loading the whole homepage. A single monolithic `+page.svelte` is not acceptable, however good it looks.

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
- MUST keep the skip-to-content link from the boilerplate (accessibility)
- Do NOT wrap `{@render children()}` in `<main>` — each page provides its own `<main id="main-content">` (the skip link's target); a second `<main>` breaks landmarks
- Use Svelte 5 children snippet pattern:
  ```svelte
  <script>
    import '../app.css'
    import Navbar from '$lib/components/Navbar.svelte'
    import Footer from '$lib/components/Footer.svelte'
    let { children } = $props()
  </script>
  <!-- keep the boilerplate's skip-to-content link here -->
  <Navbar />
  {@render children()}
  <Footer />
  ```

**`src/lib/components/sections/*.svelte`:**
- One component per page section, presentation only
- Takes its content via `let { … } = $props()` — no hardcoded client copy, no fetching, no side effects
- Owns its own layout, spacing and responsive behaviour, and its own scroll-reveal wiring

**+page.svelte:**
- Do NOT include Navbar or Footer — they come from the layout
- Imports the section components and renders them in order — it is the composition, not the markup
- All section data (services array, testimonials array, headline strings, etc.) goes in the `<script>` block and is passed to the sections as props
- Use `{#each}` loops **inside the section components** to render repeatable content from the arrays they receive
- MUST include a `<svelte:head>` block with an SEO-optimized `<title>` and `<meta name="description">`

### Svelte 5 Requirements

- Use Svelte 5 syntax with runes: `$state`, `$derived`, `$effect`, `$props`
- Runes are **built-in** — NEVER write `import { $state } from 'svelte'`
- Use `let { children } = $props()` in +layout.svelte, NOT `<slot />`
- Use plain JavaScript — NO TypeScript. Use `<script>` NOT `<script lang="ts">`

### Responsive (verify, don't assume)

Most visitors to these sites are on a phone. A layout that breaks at 375px is a
visible failure however good it looks at 1440px, so this is checked, not hoped for.

**Build mobile-first**: base classes are the phone layout, `sm:`/`md:`/`lg:`
progressively widen it. Writing the desktop layout first and patching it down is
how you end up with the failures below.

**Verify at three widths before declaring success** — 375px (the boilerplate's
`xs` breakpoint), 768px, and 1440px:

- **No horizontal scroll on `<body>` at any width.** The single most common
  failure. Usually a fixed width, a negative margin, an image without
  `max-width`, or a grid that won't collapse.
- **No text overflowing its container** — long words, URLs and headings included.
  Long unbroken strings need `break-words`.
- **Images stay inside their box** and keep their aspect ratio.
- **The nav collapses** to the mobile menu and the menu opens, closes, and is
  scrollable if it is taller than the screen.
- **Multi-column grids collapse** to one column on a phone. Three cards side by
  side at 375px is unreadable.
- **Tap targets are at least 44×44px** with visible spacing between them.
- **Nothing relies on hover** to be usable — a phone has no hover.
- **Tables and code blocks scroll inside their own container**
  (`overflow-x: auto`), never widen the page.

If a section cannot be made to work at 375px, change the layout rather than
hiding it — `hidden sm:block` on real content means the phone visitor, who is
most of the traffic, simply never sees it.

### Styling Requirements

- Use Tailwind CSS for ALL styling — NO inline styles, NO `<style>` blocks, NO custom CSS
- The boilerplate has Tailwind configured with `@tailwindcss/typography` and a custom `xs: 375px` breakpoint

**Fill in the brand tokens first.** `src/app.css` has a `:root` block — `--brand`,
`--brand-ink`, `--accent`, `--surface`, `--surface-alt`, `--ink`, `--ink-muted`,
`--line`, `--radius`, `--font-display`, `--font-body`. Set them from the client's
brand colours before writing any markup. Colours are space-separated RGB channels
(`--brand: 30 58 138;`), not hex, which is what makes `bg-brand/10` work.

Then style by ROLE, not by colour: `bg-brand`, `text-ink`, `text-ink-muted`,
`border-line`, `bg-surface`, `rounded-token`, `font-display`. **Section components
must never contain a raw colour** — no `bg-blue-600`, no `text-gray-900`, no
`text-[#192b28]`. `npm run check:tokens` enforces this and CI fails on it.

Leaving the tokens at their defaults is how every client site ends up looking
identical. They are a starting point, not a palette.

### Navigation & Links

- All anchor links MUST use the `/#section` format (e.g. `href="/#services"`, `href="/#contact"`)
- Add smooth scrolling via Tailwind's `scroll-smooth` class on the outermost wrapper, OR add an `$effect` in the layout that sets `document.documentElement.style.scrollBehavior = 'smooth'`

### Scroll Animations

- Add scroll-triggered entrance animations to page sections using `IntersectionObserver`
- Write the observer ONCE as a Svelte action in `src/lib/actions/scrollReveal.js` and use it from each section (`<div use:scrollReveal>`). Now that sections are separate components, an observer written per section is the same code copied ten times.
  1. The action observes its element and adds a class when it enters the viewport
  2. Use Tailwind classes: `opacity-0 translate-y-8` → `opacity-100 translate-y-0` with `transition-all duration-700`
  3. Stagger child elements within a section for a cascading reveal effect
  4. Keep animations subtle and professional — no bouncing or spinning
- **The hero section is exempt**: the hero headline and hero image must be visible in the initial HTML — never `opacity-0` waiting for JS. Hiding the LCP element behind an entrance animation destroys the Lighthouse performance score. Scroll reveals are for below-the-fold sections only.
- No full-page preloaders or splash screens — the site is prerendered static HTML and must paint instantly.

### Performance & Lighthouse (non-negotiable)

These sites are sold on near-perfect Lighthouse scores. The boilerplate already prerenders every page (`+layout.js`), ships a skip link, focus styles, `robots.txt`, and a sitemap — keep all of it. On top of that:

- Every `<img>` gets `width`, `height`, and meaningful `alt`; below-the-fold images get `loading="lazy" decoding="async"`; the hero image gets `fetchpriority="high"` and is never lazy-loaded
- Stock imagery is downloaded and optimized into `/static` (webp, ≤ 1920px wide, ~≤ 250KB) — never hotlink full-resolution stock URLs
- Hero backgrounds use an absolutely-positioned `<img>` with `object-cover`, not CSS `background-image`
- Fonts: system stack, or self-hosted via `@fontsource-variable/<font>` imported in `src/app.css` and wired into `tailwind.config.js` — NEVER a `<link>` to fonts.googleapis.com or other third-party font CSS; max 2 families
- No third-party scripts (analytics, chat widgets, pixels) unless explicitly requested
- Every page keeps a unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, OG/Twitter tags, and JSON-LD structured data (`LocalBusiness` for local clients) — see the boilerplate's `+page.svelte` for the pattern
- Run `npm run build` and `npm run check:tokens`, and verify the layout at 375/768/1440, before declaring success

### Forms

Do NOT hand-build a form backend, submission URL, or CAPTCHA sitekey during initial generation. Client forms are registered in the Core Labs CMS (which mints the real submission endpoint) and then wired into the site through the CMS "Connect form to site" action — that flow supplies Sven the exact endpoint and hCaptcha widget to render. The full, authoritative form convention lives in `AGENTS.md` ("Forms"); follow it there. If a page needs a placeholder contact section before a form is connected, use plain semantic markup (heading + copy + a CTA) — no `<form>` posting to an invented or placeholder URL.

### Design Excellence

This is the most important part. Think **Stripe, Linear, Vercel, Apple** level design quality:

- **Typography**: Refined hierarchy — large bold headings, lighter subtext, consistent sizing (fonts self-hosted per the Performance rules)
- **Animations**: Smooth hover transitions, fade-ins, scroll-triggered reveals — subtle and sophisticated (hero stays visible on first paint; below-the-fold only)
- **Color palette**: Cohesive and premium, derived from the brand colors — never generic or template-y
- **Polish**: Refined shadows, subtle gradients, intentional borders and spacing
- **Rhythm**: Consistent padding, alignment, and whitespace that feels considered
- **Responsive**: mobile-first, and actually verified at 375/768/1440 — see the Responsive rules above for what to check
- **Content**: Write rich, real-sounding copy — not lorem ipsum. Compelling headlines and descriptions tailored to the business

---

## Generate Now

Create the files listed above in this repository — the 4 stubs plus one component per page section. Write each file completely — no partial code or placeholders. Every file should be production-ready. Do not add a posting `<form>`; forms are wired later through the CMS (see "Forms" above).
