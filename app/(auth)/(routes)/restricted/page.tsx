import { Ban } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import withCompanyLabel from '@/hoc/with-company-label';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { decrypt } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Restricted',
  description: 'Educational portal',
};

type RestrictedPageProps = {
  searchParams: { code: string };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RestrictedPage = async ({ searchParams: { code } }: RestrictedPageProps) => {
  const t = await getTranslations('restricted');

  // FIXME: Add blocking functionality for users
  // const info = JSON.parse(decrypt(decodeURIComponent(code), process.env.NEXTAUTH_SECRET as string));

  return (
    <div className="relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <Ban className="w-10 h-10" />
        <p className="text-sm md:text-lg text-center">{t('body')}</p>
        <Link href="/">
          <Button variant="secondary">{t('goBackHome')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default withCompanyLabel(RestrictedPage);
