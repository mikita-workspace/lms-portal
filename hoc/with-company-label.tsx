import type { NextPage } from 'next';

import { Logo } from '@/components/common/logo';

const withCompanyLabel =
  <T extends object>(WrappedComponent: NextPage<T>) =>
  // eslint-disable-next-line react/display-name
  (props: T) => {
    return (
      <>
        <WrappedComponent {...props} />
        <div className="absolute flex justify-center items-center mb-8 bottom-0 gap-x-1 w-full text-sm text-muted-foreground">
          Powered by
          <div className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-x-1">
            <div className="h-4 w-4">
              <Logo onlyLogoIcon isChat />
            </div>
            <span>Nova LMS</span>
          </div>
        </div>
      </>
    );
  };

export default withCompanyLabel;
