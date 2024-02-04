import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  ignoredRoutes: ['/((?!api|trpc))(_next.*|.+.[w]+$)'],
  publicRoutes: ['/', '/marketing', '/api/uploadthing'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
