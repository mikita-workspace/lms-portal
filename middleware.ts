export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/courses/:path*',
    '/dashboard/:path*',
    '/leaderboard/:path*',
    '/owner/:path*',
    '/settings/:path*',
    '/teacher/:path*',
  ],
};
