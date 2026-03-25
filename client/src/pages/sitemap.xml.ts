import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
  const siteOrigin = url.origin;
  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${siteOrigin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>${siteOrigin}/nosotros</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Products Main Page -->
  <url>
    <loc>${siteOrigin}/productos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Catalog Page -->
  <url>
    <loc>${siteOrigin}/catalogo</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Services Page -->
  <url>
    <loc>${siteOrigin}/servicios</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Contact Page -->
  <url>
    <loc>${siteOrigin}/contactanos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Product Pages -->
  <url>
    <loc>${siteOrigin}/productos/flaim</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${siteOrigin}/flaim/flaim_body.jpg</image:loc>
      <image:title>FLAIM FTS - Sistema de Formación de Bomberos</image:title>
    </image:image>
  </url>
  
  <url>
    <loc>${siteOrigin}/productos/f-500</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${siteOrigin}/f-500/product_present.webp</image:loc>
      <image:title>F-500 EA - Agente Encapsulador</image:title>
    </image:image>
  </url>
  
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
