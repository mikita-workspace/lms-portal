'use client';

import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui';

type ErrorProps = { error: Error & { digest?: string }; reset: () => void };

const Error = ({ error }: ErrorProps) => {
  return (
    <div className=" relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <h1 className="text-xl md:text-3xl font-semibold">500</h1>
        <div className="flex flex-col items-center gap-1 px-4 md:max-w-2xl">
          <p className="text-sm md:text-lg">An unexpected application error has occurred.</p>
          {process.env.NODE_ENV !== 'production' && error?.message && (
            <p className="text-xs">({error.message})</p>
          )}
        </div>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
      <div className="absolute flex justify-center items-center mb-8 bottom-0 gap-x-1 w-full text-sm text-muted-foreground">
        Powered by
        <div className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-x-1">
          <div className="h-4 w-4">
            <Logo onlyLogoIcon isChat />
          </div>
          <span>Nova LMS</span>
        </div>
      </div>
    </div>
  );
};

export default Error;
