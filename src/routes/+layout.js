// Prerender every page to static HTML for top performance (fast TTFB + LCP,
// served straight from the CDN — a major Lighthouse performance win).
//
// A page that genuinely needs per-request work (a server `load` that reads
// cookies/headers, or a form `action`) must override this on that page with:
//   export const prerender = false
// Most client sites are fully static; contact forms that POST via `fetch` to an
// external endpoint do NOT need this override.
export const prerender = true

// Trailing-slash consistency helps canonical URLs + avoids duplicate-content SEO issues.
export const trailingSlash = 'never'
