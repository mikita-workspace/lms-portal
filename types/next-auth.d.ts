import { DefaultSession, User as AuthUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      isPublic?: boolean;
      role: string;
      userId: string;
    } & DefaultSession['user'];
  }

  interface User extends AuthUser {
    isPublic?: boolean;
    role: string;
  }
}
