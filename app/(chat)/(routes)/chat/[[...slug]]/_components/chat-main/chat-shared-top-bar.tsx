'use client';

import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

import { TIMESTAMP_PREVIEW_TEMPLATE } from '@/constants/common';

type ChatSharedTopBarProps = {
  expiredAt?: Date | null;
  title: string;
};

export const ChatSharedTopBar = ({ expiredAt, title }: ChatSharedTopBarProps) => {
  const t = useTranslations('chat.shared');

  return (
    <div className={'w-full h-[75px]'}>
      <div className="flex flex-1 flex-col text-base md:px-5 lg:px-1 xl:px-5 mx-auto md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] pt-4 px-4">
        <div className="font-medium">{title}</div>
        {expiredAt && (
          <div className="text-xs text-muted-foreground">
            {t('expiredAt', { date: format(expiredAt, TIMESTAMP_PREVIEW_TEMPLATE) })}
          </div>
        )}
      </div>
    </div>
  );
};
