import withPlaiceholder from '@plaiceholder/next';
import { createRequire } from 'module';
import createNextIntlPlugin from 'next-intl/plugin';

const require = createRequire(import.meta.url);
const npmConfig = require('./package.json');

/** @type {import('next').NextConfig} */
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
  publicRuntimeConfig: {
    version: npmConfig?.version,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      { protocol: 'https', hostname: 'avatars.yandex.net' },
      { protocol: 'https', hostname: 'filin.mail.ru' },
      { protocol: 'https', hostname: 'media.licdn.com' },
      { protocol: 'https', hostname: 'sun23-2.userapi.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default withPlaiceholder(withNextIntl(nextConfig));
