// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: 'https://www.protonfire.com',

  vite: {
    plugins: [tailwindcss()]  
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/admin/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ]
});