import withPlaiceholder from '@plaiceholder/next';
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
import npmConfig from './package.json' assert { type: 'json' };

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
  publicRuntimeConfig: {
    version: npmConfig?.version,
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'avatars.yandex.net' },
      { protocol: 'https', hostname: 'filin.mail.ru/' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'media.licdn.com/' },
      { protocol: 'https', hostname: 'sun23-2.userapi.com/' },
      { protocol: 'https', hostname: 'utfs.io' },
    ],
  },
};

export default withPlaiceholder(withNextIntl(nextConfig));
