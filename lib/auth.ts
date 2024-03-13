import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import SlackProvider from 'next-auth/providers/slack';
import YandexProvider from 'next-auth/providers/yandex';

import { LoginUser } from '@/actions/auth/login-user';
import { Provider, UserRole } from '@/constants/auth';

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
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID as string,
      clientSecret: process.env.YANDEX_CLIENT_SECRET as string,
    }),
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID as string,
      clientSecret: process.env.SLACK_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (Object.values(Provider).includes(account?.provider as Provider) && user?.email) {
        const dbUser = await LoginUser(user.email, user.name, user.image);

        user.id = dbUser.id;
        user.image = dbUser.image;
        user.isPublic = Boolean(dbUser.isPublic);
        user.name = dbUser.name;
        user.role = dbUser.role;

        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isPublic = user.isPublic;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.isPublic = Boolean(token.isPublic);
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
