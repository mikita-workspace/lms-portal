export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/courses/:path*',
    '/dashboard/:path*',
    '/leaderboard/:chat*',
    '/leaderboard/:path*',
    '/teacher/:path*',
  ],
};
