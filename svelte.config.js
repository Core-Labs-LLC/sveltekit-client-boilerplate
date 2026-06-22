import adapter from '@sveltejs/adapter-vercel'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // Pages are prerendered for performance. Marketing sites frequently link to
    // /#section anchors for sections that don't exist yet (e.g. while Sven builds
    // the site incrementally) — warn on a missing anchor target instead of
    // failing the whole build.
    prerender: {
      handleMissingId: 'warn',
    },
  },
}

export default config
