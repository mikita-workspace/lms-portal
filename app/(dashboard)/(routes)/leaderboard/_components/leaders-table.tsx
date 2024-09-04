'use client';

import { useTranslations } from 'next-intl';

import { TextBadge } from '@/components/common/text-badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { getFallbackName } from '@/lib/utils';

type LeadersTableProps = {
  leaders: {
    name: string;
    hasSubscription?: boolean;
    picture: string | null;
    userId: string;
    xp: number;
  }[];
  userId?: string;
};

export const LeadersTable = ({ leaders, userId }: LeadersTableProps) => {
  const t = useTranslations('leaderboard');

  const filteredLeaders = leaders.filter((leader) => leader.userId !== userId);
  const currentLeader = leaders.find((leader) => leader.userId === userId);

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
        {[...(currentLeader ? [currentLeader] : []), ...filteredLeaders].map((leader, index) => (
          <TableRow key={leader.userId} className="space-y-6">
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <div className="flex space-x-2 items-center">
                <div>
                  <Avatar>
                    <AvatarImage src={leader.picture || ''} />
                    <AvatarFallback>{getFallbackName(leader.name as string)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex space-x-2 items-center">
                  <p className="text-small font-semibold">{leader.name}</p>
                  {leader.userId === userId && <TextBadge label={t('you')} variant="indigo" />}
                  {leader.hasSubscription && <TextBadge label="Nova&nbsp;Plus" variant="lime" />}
                </div>
              </div>
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
