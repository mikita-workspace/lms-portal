export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/chat/:path*',
    '/courses/:path*',
    '/dashboard/:path*',
    '/leaderboard/:path*',
    '/settings/:path*',
    '/teacher/:path*',
  ],
};
