import { cookies } from 'next/headers';
import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import MailRuProvider from 'next-auth/providers/mailru';
import SlackProvider from 'next-auth/providers/slack';
import VkProvider from 'next-auth/providers/vk';
import YandexProvider from 'next-auth/providers/yandex';

import { loginUser } from '@/actions/auth/login-user';
import { Provider, UserRole } from '@/constants/auth';
import { TEN_MINUTE_SEC } from '@/constants/common';
import { OTP_SECRET_SECURE } from '@/constants/otp';

import { fetchCachedData } from './cache';
import { db } from './db';
import { isString } from './guard';
import { encrypt } from './utils';

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
      const hasOtpSecret = cookies().has(OTP_SECRET_SECURE);

      if (Object.values(Provider).includes(account?.provider as Provider) && isString(email)) {
        const dbUser = await loginUser(email, user.name, user.image);

        if (!hasOtpSecret && dbUser.otpSecret) {
          return `/otp-verification?code=${encodeURIComponent(encrypt({ secret: dbUser.otpSecret, userId: dbUser.id, provider: account?.provider }, process.env.OTP_SECRET as string))}`;
        }

        user.id = dbUser.id;
        user.email = email;
        user.image = dbUser.image;
        user.isPublic = Boolean(dbUser.isPublic);
        user.name = dbUser.name;
        user.role = dbUser.role;

        return true;
      }

      return false;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.email = user.email;
        token.isPublic = user.isPublic;
        token.role = user.role;
      }

      if (trigger === 'update') {
        if (session?.name) {
          token.name = session.name;
        }

        if (session?.pictureUrl) {
          token.picture = session.pictureUrl;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.email = token.email;
          session.user.isPublic = Boolean(token.isPublic);
          session.user.userId = token.sub;
        }

        if (token.role) {
          session.user.role = (token.role as string) || UserRole.STUDENT;
        }

        const updatedToken = await fetchCachedData(
          `token-change-${token.email}`,
          async () => {
            const updatedUser = await db.user.findUnique({
              where: { id: session?.user?.userId },
              select: { role: true },
            });

            return { role: updatedUser?.role };
          },
          TEN_MINUTE_SEC,
        );

        if (updatedToken?.role && updatedToken.role !== session?.user?.role) {
          session.user.role = updatedToken.role;
        }
      }

      return session;
    },
  },
} satisfies NextAuthOptions;
