import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
   {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': [
            "'self'",
            'https:',
            'https://res.cloudinary.com',         // Imágenes servidas
            'https://api.cloudinary.com',          // Upload API
          ],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://res.cloudinary.com',          // ✅ Crítico para previsualizar imágenes
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:1337',
        'http://localhost:4321',
        'http://localhost:3000',
        'https://webprotonfire-production.up.railway.app', // Tu Strapi en Railway
        'https://protonfire.com',                          // Tu frontend en Cloudflare
      ],
    },
  },
  'strapi::logger',
  'strapi::errors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
