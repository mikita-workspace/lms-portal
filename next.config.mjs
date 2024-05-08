/** @type {import('next').NextConfig} */

import npmConfig from './package.json' assert { type: 'json' };

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
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'https://avatars.yandex.net' },
      { protocol: 'https', hostname: 'https://filin.mail.ru/' },
      { protocol: 'https', hostname: 'https://media.licdn.com/' },
      { protocol: 'https', hostname: 'https://sun23-2.userapi.com/' },
    ],
  },
};

export default nextConfig;
