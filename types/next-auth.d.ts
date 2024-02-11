import { DefaultSession, User as AuthUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      userId: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User extends AuthUser {
    role: string;
  }
}
