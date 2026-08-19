<script>
  // Footer — self-contained component (CMS convention): rendered only in
  // +layout.svelte, no props, no section markers. The Core Labs branding link
  // below MUST remain.
  //
  // Contrast floor: secondary text here is `text-gray-600` (7.2:1 on gray-50).
  // Never drop to gray-400/gray-300 — those measure ~2.4:1 and are a WCAG AA
  // failure that automated accessibility scanners flag as "serious".
  import { legal } from '$lib/legal/site.js'

  const links = [
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ]

  // Legal pages. Keep all three linked from every page — a conspicuous privacy
  // link is a legal requirement, and a visible accessibility contact is what
  // gives someone a route to report a barrier instead of escalating.
  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
  ]

  const year = new Date().getFullYear()
</script>

<footer class="border-t border-gray-200 bg-gray-50">
  <div class="mx-auto max-w-6xl px-6 py-10">
    <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p class="text-sm text-gray-600">© {year} {legal.tradeName}. All rights reserved.</p>
      <nav aria-label="Footer">
        <ul class="flex gap-6">
          {#each links as link}
            <li>
              <a href={link.href} class="text-sm text-gray-600 hover:text-gray-900">{link.label}</a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>

    <div
      class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row"
    >
      <nav aria-label="Legal">
        <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {#each legalLinks as link}
            <li>
              <a href={link.href} class="text-xs text-gray-600 underline hover:text-gray-900"
                >{link.label}</a
              >
            </li>
          {/each}
        </ul>
      </nav>
      <p class="text-xs text-gray-600">
        Built by <a href="https://www.corelabs.digital/" class="underline hover:text-gray-900"
          >Core Labs</a
        >
      </p>
    </div>
  </div>
</footer>
