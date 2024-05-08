import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import MailRuProvider from 'next-auth/providers/mailru';
import SlackProvider from 'next-auth/providers/slack';
import VkProvider from 'next-auth/providers/vk';
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
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      authorization: {
        params: { scope: 'openid profile email' },
      },
      issuer: 'https://www.linkedin.com/oauth',
      jwks_endpoint: 'https://www.linkedin.com/oauth/openid/jwks',
      profile(profile) {
        return {
          email: profile.email,
          id: profile.id,
          image: profile?.picture,
          name: profile.name,
          role: UserRole.STUDENT,
        };
      },
    }),
    MailRuProvider({
      clientId: process.env.MAILRU_CLIENT_ID as string,
      clientSecret: process.env.MAILRU_CLIENT_SECRET as string,
      authorization: 'https://oauth.mail.ru/login',
      token: 'https://oauth.mail.ru/token',
      userinfo: {
        async request(context) {
          const res = await fetch(
            `https://oauth.mail.ru/userinfo?access_token=${context.tokens.access_token}`,
          );
          return await res.json();
        },
      },
      profile(profile) {
        return {
          email: profile.email,
          id: profile.id,
          image: profile?.image,
          name: profile.name,
          role: UserRole.STUDENT,
        };
      },
    }),
    VkProvider({
      clientId: process.env.VK_CLIENT_ID as string,
      clientSecret: process.env.VK_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const email = user?.email ?? account?.email;

      if (
        Object.values(Provider).includes(account?.provider as Provider) &&
        typeof email === 'string'
      ) {
        const dbUser = await LoginUser(email, user.name, user.image);

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
