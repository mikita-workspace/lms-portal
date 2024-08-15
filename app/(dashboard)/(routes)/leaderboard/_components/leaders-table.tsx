'use client';

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
    picture: string | null;
    userId: string;
    xp: number;
  }[];
  hasSubscription?: boolean;
  userId?: string;
};

export const LeadersTable = ({ leaders, hasSubscription = false, userId }: LeadersTableProps) => {
  const filteredLeaders = leaders.filter((leader) => leader.userId !== userId);
  const currentLeader = leaders.find((leader) => leader.userId === userId);

  return (
    <Table className="w-full md:w-4/5 mx-auto">
      {!leaders.length && <TableCaption>There are no leaders here yet</TableCaption>}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Points</TableHead>
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
                  {leader.userId === userId && <TextBadge label="You" variant="indigo" />}
                  {hasSubscription && <TextBadge label="Nova&nbsp;Plus" variant="lime" />}
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
