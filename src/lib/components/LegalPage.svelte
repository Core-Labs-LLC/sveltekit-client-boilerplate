<script>
  // Shared chrome for the /privacy, /terms, and /accessibility pages: page
  // heading, effective date, and prose styling. Each legal page owns its own
  // <svelte:head> (the CMS SEO round-trip reads titles/descriptions from the
  // page's own head — never from a layout or a shared component).
  import { effectiveDateLabel } from '$lib/legal/site.js'

  /** @type {{ title: string, intro?: string, children: import('svelte').Snippet }} */
  let { title, intro = '', children } = $props()
</script>

<main id="main-content">
  <article class="mx-auto max-w-3xl px-6 py-16 sm:py-24">
    <h1 class="text-4xl font-bold tracking-tight text-gray-900">{title}</h1>
    <p class="mt-3 text-sm text-gray-600">Effective {effectiveDateLabel()}</p>
    {#if intro}
      <p class="mt-6 text-lg text-gray-700">{intro}</p>
    {/if}
    <div
      class="prose prose-gray mt-10 max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-gray-900"
    >
      {@render children()}
    </div>
  </article>
</main>
