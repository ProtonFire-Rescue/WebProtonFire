// @ts-check
import { defineConfig, fontProviders } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

import cloudflare from '@astrojs/cloudflare'


// import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: 'https://protonfire.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react()
  ],

  experimental: {
    fonts: [{
      provider: fontProviders.google(),
      name: 'Questrial',
      cssVariable: '--font-questrial',
    }]
  }
})
