import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      sizeLimit: 10 * 1024 * 1024, // 10MB
      security: {
        allowedTypes: ['image/*', 'video/*', 'application/pdf'],
        deniedTypes: [
          'application/x-sh',
          'application/x-dosexec',
          'application/x-msdownload',
          'application/x-msdos-program',
        ],
      },
    },
  },
});

export default config;
