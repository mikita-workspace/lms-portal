import { cookies } from 'next/headers';
import { NextAuthOptions } from 'next-auth';

import { getUpdatedUser } from '@/actions/auth/get-updated-user';
import { loginUser } from '@/actions/auth/login-user';
import { getUserSubscription } from '@/actions/stripe/get-user-subscription';
import { Provider, UserRole } from '@/constants/auth';
import { OTP_SECRET_SECURE } from '@/constants/otp';

import { isString } from '../guard';
import { encrypt } from '../utils';

export const callbacks: NextAuthOptions['callbacks'] = {
  async signIn({ user, account }) {
    const email = user?.email ?? account?.email;

    const otpSecret = cookies().get(OTP_SECRET_SECURE)?.value;
    const hasOtpSecret = otpSecret ? otpSecret.split(':')[0] === user?.email : false;

    if (Object.values(Provider).includes(account?.provider as Provider) && isString(email)) {
      const dbUser = await loginUser(email, user.name, user?.image, user?.password);

      if (!hasOtpSecret && dbUser.otpSecret) {
        return `/otp-verification?code=${encodeURIComponent(encrypt({ secret: dbUser.otpSecret, userId: dbUser.id, provider: account?.provider }, process.env.OTP_SECRET as string))}`;
      }

      user.email = email;
      user.hasSubscription = dbUser.hasSubscription;
      user.id = dbUser.id;
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
      token.hasSubscription = user.hasSubscription;
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
        session.user.hasSubscription = Boolean(token.subscription);
        session.user.isPublic = Boolean(token.isPublic);
        session.user.userId = token.sub;
      }

      if (token.role) {
        session.user.role = (token.role as string) || UserRole.STUDENT;
      }

      const userId = session?.user?.userId;

      const updatedToken = await getUpdatedUser(userId);
      const userSubscription = await getUserSubscription(userId);

      if (updatedToken?.role && updatedToken.role !== session?.user?.role) {
        session.user.role = updatedToken.role;
      }

      session.user.hasSubscription = Boolean(userSubscription);
    }

    return session;
  },
};
