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
- Ensure the target section exists with matching section markers

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