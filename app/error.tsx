'use client';

import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: '500',
  description: 'Educational portal',
};

type ErrorProps = { error: Error & { digest?: string }; reset: () => void };

const Error = ({ error }: ErrorProps) => {
  const t = useTranslations('error');

  return (
    <div className=" relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <h1 className="text-xl md:text-3xl font-semibold">{t('title')}</h1>
        <div className="flex flex-col items-center gap-1 px-4 md:max-w-2xl">
          <p className="text-sm md:text-lg"> {t('body')}</p>
          {process.env.NODE_ENV !== 'production' && error?.message && (
            <p className="text-xs">({error.message})</p>
          )}
        </div>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          {t('tryAgain')}
        </Button>
      </div>
    </div>
  );
};

export default Error;
