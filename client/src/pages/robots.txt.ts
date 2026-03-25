import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
  const siteOrigin = url.origin;

  const robotsTxt = `# robots.txt for PROTON Fire & Rescue
# ${siteOrigin}/robots.txt

User-agent: *
Allow: /

# Disallow admin or private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/

# Sitemap location
Sitemap: ${siteOrigin}/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1

# Specific bot rules
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
