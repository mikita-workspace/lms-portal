export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/teacher/:path*', '/courses/:path*', '/leaderboard/:path*'],
};
