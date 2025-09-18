import { Metadata } from 'next';
import { Suspense } from 'react';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getLeaders } from '@/actions/courses/get-leaders';
import { LeaderBoardSkeleton } from '@/components/loaders/leaderboard-skeleton';

import { LeadersTable } from './_components/leaders-table';
import { PLATFORM_DESCRIPTION } from '@/constants/common';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description: PLATFORM_DESCRIPTION,
};

const LeaderBoard = async () => {
  const user = await getCurrentUser();
  const leaders = await getLeaders();

  return (
    <Suspense fallback={<LeaderBoardSkeleton />}>
      <div className="p-6 space-y-4">
        <LeadersTable leaders={leaders} userId={user?.userId} />
      </div>
    </Suspense>
  );
};

export default LeaderBoard;
