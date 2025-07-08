'use server';

import { ONE_DAY_SEC } from '@/constants/common';
import { fetchCachedData } from '@/lib/cache';

import { getGlobalProgress } from '../courses/get-global-progress';

export const getNovaPulse = async (userId: string) => {
  try {
    const response = await fetchCachedData(
      `nova-pulse::${userId}`,
      async () => {
        const globalProgress = await getGlobalProgress(userId);

        return {
          xp: globalProgress?.total ?? 0,
        };
      },
      ONE_DAY_SEC,
    );

    return response;
  } catch (error) {
    console.error('[GET_NOVA_PULSE]', error);

    return {
      xp: 0,
    };
  }
};
