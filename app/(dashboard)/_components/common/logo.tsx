import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500'] });

type LogoProps = {
  isChat?: boolean;
};

export const Logo = ({ isChat }: LogoProps) => {
  return (
    <Link href="/">
      <div
        className={cn(
          'items-center gap-x-3 md:flex hover:opacity-75 transition-opacity',
          !isChat && 'hidden',
        )}
      >
        <Image src="/assets/logo.svg" alt="Nova LMS Logo" height={40} width={40} />
        <div className={cn(poppins.className, isChat && 'hidden md:block')}>
          <p className="font-semibold text-base text-neutral-700 dark:text-neutral-300">Nova LMS</p>
          <p className="text-xs text-muted-foreground">Portal&nbsp;for&nbsp;educational purposes</p>
        </div>
      </div>
    </Link>
  );
};
