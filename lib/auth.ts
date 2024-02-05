import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

import { Provider } from '@/constants/auth';

import { db } from './db';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === Provider.GITHUB && user?.email) {
        const dbUser = await db.user.upsert({
          where: {
            email: user.email,
          },
          update: {
            name: user.name,
          },
          create: {
            email: user.email,
            name: user.name,
          },
        });

        user.id = dbUser.id;

        return true;
      }

      return false;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.userId = token.sub;
      }

      return session;
    },
  },
} satisfies NextAuthOptions;
