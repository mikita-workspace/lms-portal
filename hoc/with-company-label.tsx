import type { NextPage } from 'next';
import { getTranslations } from 'next-intl/server';

import { Logo } from '@/components/common/logo';

const withCompanyLabel =
  <T extends object>(WrappedComponent: NextPage<T>) =>
  // eslint-disable-next-line react/display-name
  async (props: T) => {
    const t = await getTranslations('app');

    return (
      <>
        <WrappedComponent {...props} />
        <div className="absolute flex justify-center items-center mb-8 bottom-0 gap-x-1 w-full text-sm text-muted-foreground">
          {t('poweredBy')}
          <div className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-x-1">
            <div className="h-4 w-4">
              <Logo onlyLogoIcon isLoader />
            </div>
            <span>{t('name')}</span>
          </div>
        </div>
      </>
    );
  };

export default withCompanyLabel;
