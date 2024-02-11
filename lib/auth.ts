import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { Provider, UserRole } from '@/constants/auth';

import { db } from './db';

export const authOptions = {
  pages: {
    signIn: '/sign-in',
  },

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (
        [Provider.GITHUB, Provider.GOOGLE].includes(account?.provider as Provider) &&
        user?.email
      ) {
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
        user.role = dbUser.role;

        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.userId = token.sub;
        }

        if (token.role) {
          session.user.role = (token.role as string) || UserRole.STUDENT;
        }
      }

      return session;
    },
  },
} satisfies NextAuthOptions;
