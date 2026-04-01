// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro'
import { resolveBackendUrl } from '@/utils/server'
import { productUrl } from '@/utils/slugify'

const escapeXml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const GET: APIRoute = async (context) => {
  const SITE_URL = (context.site?.origin ?? 'http://localhost:1337').replace(
    /\/$/,
    ''
  )
  const STRAPI_URL = resolveBackendUrl({ astro: context })
  const now = new Date().toISOString()

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/productos?fields[0]=updatedAt&fields[1]=slug&fields[2]=name&populate[categories][fields][0]=name&populate[images][fields][0]=url&populate[images][fields][1]=alternativeText&pagination[pageSize]=200`
    )
    const { data } = await response.json()

    const categoriesResponse = await fetch(
      `${STRAPI_URL}/api/categories?fields[0]=name&pagination[pageSize]=200`
    )
    const { data: categories } = await categoriesResponse.json()

    const staticPages = [
      { path: '', changefreq: 'monthly', priority: '1.0' },
      { path: '/productos', changefreq: 'monthly', priority: '0.9', image: `${SITE_URL}/images/products.webp`, imageTitle: 'Equipos de Bomberos y Rescate - PROTON Fire & Rescue' },
      { path: '/productos/f-500', changefreq: 'monthly', priority: '0.8', image: `${SITE_URL}/f-500/product_present.webp`, imageTitle: 'F-500 EA Agente Encapsulador' },
      { path: '/productos/flaim', changefreq: 'monthly', priority: '0.8', image: `${SITE_URL}/flaim/flaim_body.webp`, imageTitle: 'FLAIM FTS Sistema de Formación VR' },
      { path: '/catalogo/all', changefreq: 'monthly', priority: '0.8' },
      { path: '/servicios', changefreq: 'monthly', priority: '0.7', image: `${SITE_URL}/images/services.webp`, imageTitle: 'Servicios PROTON Fire & Rescue' },
      { path: '/nosotros', changefreq: 'monthly', priority: '0.6', image: `${SITE_URL}/images/hero-home.webp`, imageTitle: 'Quiénes Somos - PROTON Fire & Rescue' },
      { path: '/contactanos', changefreq: 'monthly', priority: '0.6', image: `${SITE_URL}/images/Contactanos.webp`, imageTitle: 'Contáctanos - PROTON Fire & Rescue' },
      { path: '/privacidad', changefreq: 'yearly', priority: '0.3' },
      { path: '/terminos', changefreq: 'yearly', priority: '0.3' },
      { path: '/cookies', changefreq: 'yearly', priority: '0.3' }
    ]

    // Helper: genera tags <image:image> para un array de imágenes Strapi
    const imageTagsFromStrapi = (images: any[]) =>
      images
        .filter((img: any) => img?.url)
        .map((img: any) => {
          const imgUrl = img.url.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`
          const caption = img.alternativeText ? `\n      <image:caption>${escapeXml(img.alternativeText)}</image:caption>` : ''
          return `    <image:image>\n      <image:loc>${escapeXml(imgUrl)}</image:loc>${caption}\n    </image:image>`
        })
        .join('\n')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages
  .map(
    ({ path, changefreq, priority, image, imageTitle }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${image ? `\n    <image:image>\n      <image:loc>${escapeXml(image)}</image:loc>${imageTitle ? `\n      <image:title>${escapeXml(imageTitle)}</image:title>` : ''}\n    </image:image>` : ''}
  </url>`
  )
  .join('\n')}
${(data ?? [])
  .map((prod: any) => {
    const catName = prod.categories?.[0]?.name ?? 'producto'
    const url = productUrl(catName, prod.slug)
    const images = prod.images ?? []
    const imgTags = imageTagsFromStrapi(images)
    return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${prod.updatedAt ?? now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imgTags ? `\n${imgTags}` : ''}
  </url>`
  })
  .join('\n')}
${(categories ?? [])
  .map(
    (cat: any) => `  <url>
    <loc>${SITE_URL}/catalogo/${encodeURIComponent(cat.name)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
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
  <url><loc>${SITE_URL}/privacidad</loc><lastmod>${now}</lastmod><priority>0.3</priority></url>
  <url><loc>${SITE_URL}/terminos</loc><lastmod>${now}</lastmod><priority>0.3</priority></url>
  <url><loc>${SITE_URL}/cookies</loc><lastmod>${now}</lastmod><priority>0.3</priority></url>
</urlset>`
    return new Response(fallback, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    })
  }
}
