<script>
  import { page } from '$app/state'

  const notFound = $derived(page.status === 404)
  const heading = $derived(notFound ? 'Page not found' : 'Something went wrong')
  const detail = $derived(
    notFound
      ? "The page you're looking for doesn't exist or may have moved."
      : 'An unexpected error occurred. Please try again in a moment.',
  )
</script>

<svelte:head>
  <title>{heading}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main id="main-content">
  <section class="bg-white">
    <div class="mx-auto max-w-6xl px-6 py-24 text-center">
      <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">{page.status}</p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{heading}</h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600">{detail}</p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href="/"
          class="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >Back to home</a>
        <a
          href="/#contact"
          class="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50"
        >Contact us</a>
      </div>
    </div>
  </section>
</main>
