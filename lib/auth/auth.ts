import type { NextAuthOptions } from 'next-auth';

import { callbacks } from './callbacks';
import { providers } from './providers';

export const authOptions = {
  pages: {
    signIn: '/sign-in',
  },
  providers,
  callbacks,
} satisfies NextAuthOptions;
