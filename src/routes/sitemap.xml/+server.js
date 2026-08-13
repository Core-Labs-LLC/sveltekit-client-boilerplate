// Dynamic sitemap, rendered per request and CDN-cached for an hour, so blog
// posts published from the CMS (which never redeploy the site) appear within
// the hour. Add each public route to `routes` as the site grows — Google uses
// this for discovery/indexing.
export const prerender = false

const SITE = 'https://example.com'
const routes = ['/']

// Wire this when the site has a connected blog, using the same app id the
// blog pages fetch with (supplied by the task instructions — never guessed):
// const BLOG = { appId: '<app-id>', basePath: '/blog' }
const BLOG = null

/** @param {typeof fetch} fetchFn */
async function blogPostUrls(fetchFn) {
  if (!BLOG) return []
  const urls = []
  try {
    // The API caps limit at 100 — page through, bounded so a runaway
    // pagination bug can never stall sitemap responses.
    for (let offset = 0; offset < 500; offset += 100) {
      const res = await fetchFn(
        `https://api.corelabs.digital/blog-posts/${BLOG.appId}?limit=100&offset=${offset}`,
      )
      if (!res.ok) break
      const { blogPosts, pagination } = await res.json()
      for (const post of blogPosts ?? []) urls.push(`${SITE}${BLOG.basePath}/${post.slug}/`)
      if (!pagination?.hasMore) break
    }
  } catch {
    // The static routes must still serve when the blog API is unreachable.
  }
  return urls
}

export async function GET({ fetch }) {
  const urls = [...routes.map((r) => `${SITE}${r === '/' ? '' : r}/`), ...(await blogPostUrls(fetch))]
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=0, s-maxage=3600' },
  })
}
