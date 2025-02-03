'use client';

import { useTranslations } from 'next-intl';

import { Leader } from '@/actions/courses/get-leaders';
import { TextBadge } from '@/components/common/text-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getFallbackName } from '@/lib/utils';

type LeaderItemProps = { leader: Leader; userId?: string };

export const LeaderItem = ({ leader, userId }: LeaderItemProps) => {
  const t = useTranslations('leaderboard');

  return (
    <div className="flex space-x-2 items-center">
      <div>
        <Avatar className="border dark:border-muted-foreground">
          <AvatarImage src={leader.picture ?? ''} />
          <AvatarFallback>{getFallbackName(leader.name as string)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex space-x-2 items-center">
        <p className="text-small font-semibold">{leader.name}</p>
        {leader.userId === userId && <TextBadge label={t('you')} variant="indigo" />}
        {leader.hasSubscription && !leader.isOwner && (
          <TextBadge label="Nova&nbsp;Plus" variant="lime" />
        )}
        {leader.isOwner && <TextBadge label="Owner" variant="indigo" />}
      </div>
    </div>
  );
};
