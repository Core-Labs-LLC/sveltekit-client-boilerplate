<script>
  // Navbar — self-contained component (CMS convention): rendered only in
  // +layout.svelte, no props, no section markers. Hardcode content here.
  const links = [
    { label: 'Home', href: '/#hero' },
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ]
</script>

<header class="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/#hero" class="text-xl font-bold text-gray-900">Your Brand</a>
    <ul class="hidden gap-8 md:flex">
      {#each links as link}
        <li><a href={link.href} class="text-sm text-gray-600 hover:text-gray-900">{link.label}</a></li>
      {/each}
    </ul>
    <a
      href="/#contact"
      class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
    >
      Get in touch
    </a>
  </nav>
</header>
