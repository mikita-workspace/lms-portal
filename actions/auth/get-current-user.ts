'use server';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth/auth';

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);

  return session?.user;
};
