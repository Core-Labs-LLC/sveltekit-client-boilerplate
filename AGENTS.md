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
- **Svelte 5 runes only** (`$state`, `$derived`, `$props`, `$effect`) — no Svelte 4 (`export let`, `$:`, stores). **Plain JavaScript, no TypeScript** — use JSDoc if you need types.

## Working in this repo
- Install deps: `npm install`. Dev server: `npm run dev`. Production build: `npm run build` (Vite). Type-check: `npm run check`.
- Most edits are UI/content in `src/routes/**/+page.svelte` and `src/lib/components/`.
- Match the existing structure, styling, and the conventions above. **Validate the build before declaring success.**
- Make focused commits; the platform publishes your branch.
