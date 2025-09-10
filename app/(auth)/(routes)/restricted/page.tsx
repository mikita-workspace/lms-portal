import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Restricted',
  description: 'Educational portal',
};

const RestrictedPage = async () => {
  const t = await getTranslations('restricted');

  return (
    <div className="relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <h1 className="text-xl md:text-3xl font-semibold">{t('title')}</h1>
        <p className="text-sm md:text-lg text-center">{t('body')}</p>
        <Link href="/">
          <Button variant="secondary">{t('goBackHome')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default RestrictedPage;
