'use client';

import { CheckCircle, Clock } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import qs from 'query-string';

import { IconBadge } from '@/components/common/icon-badge';
import { FilterStatus } from '@/constants/courses';
import { cn } from '@/lib/utils';

type InfoCardProps = {
  courseStatus: FilterStatus;
  numberOfItems: number;
};

const filterMap = {
  [FilterStatus.PROGRESS]: {
    filter: FilterStatus.PROGRESS,
    icon: Clock,
    key: 'inProgress',
    variant: 'default',
  },
  [FilterStatus.COMPLETED]: {
    filter: FilterStatus.COMPLETED,
    icon: CheckCircle,
    key: 'completed',
    variant: 'success',
  },
};

export const InfoCard = ({ courseStatus, numberOfItems }: InfoCardProps) => {
  const t = useTranslations('courses.info-card');

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterInfo = filterMap[courseStatus];
  const currentFilter = searchParams.get('filter');

  const isSelected = currentFilter === filterInfo.filter;

  const handleOnClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: { filter: currentFilter === filterInfo.filter ? null : filterInfo.filter },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <button onClick={handleOnClick}>
      <div
        className={cn(
          'border rounded-lg flex items-center gap-x-2 p-3 transition duration-300 hover:bg-accent hover:text-accent-foreground',
          isSelected &&
            'bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20',
        )}
      >
        <IconBadge icon={filterInfo.icon} variant={filterInfo.variant as 'default' | 'success'} />
        <div>
          <p className="font-medium">{t(filterInfo.key)}</p>
          <p className="text-secondary-foreground text-sm text-left">
            {t('course', { amount: numberOfItems })}
          </p>
        </div>
      </div>
    </button>
  );
};
