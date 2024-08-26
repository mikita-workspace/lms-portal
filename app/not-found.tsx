import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import withCompanyLabel from '@/hoc/with-company-label';

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
    </div>
  );
};

export default withCompanyLabel(NotFoundPage);
