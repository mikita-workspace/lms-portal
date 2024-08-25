import withPlaiceholder from '@plaiceholder/next';
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
import npmConfig from './package.json' assert { type: 'json' };

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
      { protocol: 'https', hostname: 'https://avatars.yandex.net' },
      { protocol: 'https', hostname: 'https://filin.mail.ru/' },
      { protocol: 'https', hostname: 'https://media.licdn.com/' },
      { protocol: 'https', hostname: 'https://sun23-2.userapi.com/' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default withPlaiceholder(withNextIntl(nextConfig));
