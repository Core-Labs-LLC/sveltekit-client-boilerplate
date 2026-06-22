<script>
  // Per-site SEO values — keep these accurate. Sven/the CMS updates the title +
  // description; update siteUrl to the live domain when the site goes live.
  const siteName = 'Your Brand'
  const siteUrl = 'https://example.com'
  const title = `${siteName} — Tagline goes here`
  const description = 'A short, compelling description of the business for search results and social shares.'

  // Structured data: switch @type to "LocalBusiness" (with address/telephone/
  // openingHours) for local clients — it powers rich results in Google.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    description,
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={siteUrl} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={siteUrl} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />

  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<main id="main-content">
  <!-- section:hero {"type":"hero","id":"hero-1"} -->
  <section id="hero" class="bg-white">
    <div class="mx-auto max-w-6xl px-6 py-24 text-center">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Your headline here</h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
        A clear, benefit-driven subheadline that tells visitors what you do and why it matters.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href="/#contact"
          class="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >Get started</a>
        <a
          href="/#services"
          class="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50"
        >Learn more</a>
      </div>
    </div>
  </section>
  <!-- /section:hero -->
</main>
