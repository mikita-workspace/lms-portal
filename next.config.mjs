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
    ],
  },
};

export default nextConfig;
