'use client';

import { Button } from '@/components/ui';

type ErrorProps = { error: Error & { digest?: string }; reset: () => void };

const Error = ({ error }: ErrorProps) => {
  return (
    <div className="h-full flex gap-y-4 items-center w-full">
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
    </div>
  );
};

export default Error;
