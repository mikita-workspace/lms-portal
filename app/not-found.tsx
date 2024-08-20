import { Metadata } from 'next';
import Link from 'next/link';

import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '404',
  description: 'Educational portal',
};

const NotFoundPage = () => {
  return (
    <div className="relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground">
        <h1 className="text-xl md:text-3xl font-semibold">404</h1>
        <p className="text-sm md:text-lg">We could not find the page you were looking for.</p>
        <Link href="/">
          <Button variant="secondary">Go back home</Button>
        </Link>
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

export default NotFoundPage;
