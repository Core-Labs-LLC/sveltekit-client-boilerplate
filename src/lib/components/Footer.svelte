<script>
  // Footer — self-contained component (CMS convention): rendered only in
  // +layout.svelte, no props, no section markers. The Core Labs branding link
  // below MUST remain.
  const links = [
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ]
</script>

<footer class="border-t border-gray-200 bg-gray-50">
  <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
    <p class="text-sm text-gray-500">© Your Brand. All rights reserved.</p>
    <nav class="flex gap-6">
      {#each links as link}
        <a href={link.href} class="text-sm text-gray-500 hover:text-gray-900">{link.label}</a>
      {/each}
    </nav>
    <p class="text-xs text-gray-400">
      Built by <a href="https://www.corelabs.digital/" class="underline hover:text-gray-700">Core Labs</a>
    </p>
  </div>
</footer>
