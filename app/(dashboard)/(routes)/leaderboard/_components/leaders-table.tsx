'use client';

import { Coffee } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Leader } from '@/actions/courses/get-leaders';
import { TextBadge } from '@/components/common/text-badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';

import { LeaderItem } from './leader-item';

type LeadersTableProps = {
  leaders: Leader[];
  userId?: string;
};

export const LeadersTable = ({ leaders, userId }: LeadersTableProps) => {
  const t = useTranslations('leaderboard');

  const [filteredLeaders, currentLeader] = leaders.reduce<[Leader[], Leader | null]>(
    ([filteredLeaders, currentLeader], leader) => {
      if (leader.userId !== userId) {
        filteredLeaders.push(leader);
      } else {
        currentLeader = leader;
      }

      return [filteredLeaders, currentLeader];
    },
    [[], null],
  );

  return (
    <Table className="w-full md:w-4/5 mx-auto">
      {!leaders.length && <TableCaption>{t('notFound')}</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">{t('rank')}</TableHead>
          <TableHead>{t('user')}</TableHead>
          <TableHead className="text-right">{t('points')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentLeader && (
          <TableRow>
            <TableCell className="font-medium">
              <Coffee className="w-4 h-4" />
            </TableCell>
            <TableCell>
              <LeaderItem leader={currentLeader} userId={userId} />
            </TableCell>
            <TableCell className="text-right">
              <TextBadge label={String(currentLeader.xp)} variant="yellow" />
            </TableCell>
          </TableRow>
        )}
        {filteredLeaders.map((leader, index) => (
          <TableRow key={leader.userId} className="space-y-6">
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <LeaderItem leader={leader} />
            </TableCell>
            <TableCell className="text-right">
              <TextBadge label={String(leader.xp)} variant="yellow" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
