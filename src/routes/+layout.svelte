<script>
  import '../app.css'
  import Navbar from '$lib/components/Navbar.svelte'
  import Footer from '$lib/components/Footer.svelte'

  let { children } = $props()
</script>

<!-- Skip link (accessibility): lets keyboard/screen-reader users jump past the nav.
     Targets the `id="main-content"` on each page's <main> element. -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-gray-900 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
>
  Skip to content
</a>

<Navbar />
{@render children()}
<Footer />
