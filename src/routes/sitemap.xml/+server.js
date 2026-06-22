// Dynamic sitemap (prerendered at build time). Add each public route to `routes`
// as the site grows — Google uses this for discovery/indexing.
export const prerender = true

const SITE = 'https://example.com'
const routes = ['/']

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE}${r === '/' ? '' : r}/</loc></url>`).join('\n')}
</urlset>`
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=0, s-maxage=3600' },
  })
}
