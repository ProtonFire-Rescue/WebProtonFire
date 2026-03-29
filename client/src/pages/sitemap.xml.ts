// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro'
import { resolveBackendUrl } from '@/utils/server'

export const GET: APIRoute = async (context) => {
  const SITE_URL = (context.site?.origin ?? 'http://localhost:1337').replace(
    /\/$/,
    ''
  )
  const STRAPI_URL = resolveBackendUrl({ astro: context })
  const now = new Date().toISOString()

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/productos?fields[0]=updatedAt&fields[1]=slug&pagination[pageSize]=200`
    )
    const { data } = await response.json()

    const categoriesResponse = await fetch(
      `${STRAPI_URL}/api/categories?fields[0]=name&pagination[pageSize]=200`
    )
    const { data: categories } = await categoriesResponse.json()

    const staticPages = [
      { path: '', changefreq: 'monthly', priority: '1.0' },
      { path: '/productos', changefreq: 'monthly', priority: '0.9' },
      { path: '/productos/f-500', changefreq: 'monthly', priority: '0.8' },
      { path: '/productos/flaim', changefreq: 'monthly', priority: '0.8' },
      { path: '/catalogo/all', changefreq: 'monthly', priority: '0.8' },
      { path: '/servicios', changefreq: 'monthly', priority: '0.7' },
      { path: '/nosotros', changefreq: 'monthly', priority: '0.6' },
      { path: '/contactanos', changefreq: 'monthly', priority: '0.6' }
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages
  .map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}

${(data ?? [])
  .map(
    (prod: any) => `  <url>
    <loc>${SITE_URL}/producto/${prod.documentId}/${prod.slug}</loc>
    <lastmod>${prod.updatedAt ?? now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  `
  )
  .join('\n')}

  ${(categories ?? [])
    .map(
      (cat: any) => `  <url>
    <loc>${SITE_URL}/catalogo/${cat.name}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  `
    )
    .join('\n')}
</urlset>`

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    // Fallback: devolver sitemap solo con páginas estáticas
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc><lastmod>${now}</lastmod><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/productos</loc><lastmod>${now}</lastmod><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/catalogo</loc><lastmod>${now}</lastmod><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/servicios</loc><lastmod>${now}</lastmod><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/nosotros</loc><lastmod>${now}</lastmod><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/contactanos</loc><lastmod>${now}</lastmod><priority>0.6</priority></url>
</urlset>`
    return new Response(fallback, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    })
  }
}
