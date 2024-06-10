import { Baloo_2 } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const baloo2 = Baloo_2({ subsets: ['latin'], weight: ['400', '500'] });

type LogoProps = {
  isChat?: boolean;
  onlyLogoIcon?: boolean;
};

export const Logo = ({ isChat = false, onlyLogoIcon = false }: LogoProps) => {
  return (
    <Link href="/">
      <div
        className={cn(
          'items-center gap-x-3 md:flex hover:opacity-75 transition-opacity',
          !isChat && 'hidden',
        )}
      >
        <Image src="/assets/logo.svg" alt="Nova LMS Logo" height={40} width={40} />
        {!onlyLogoIcon && (
          <div className={cn(baloo2.className, isChat && 'hidden md:block')}>
            <p className="font-semibold text-base text-neutral-700 dark:text-neutral-300">
              Nova LMS
            </p>
            <p className="text-xs text-muted-foreground">Educational&nbsp;portal</p>
          </div>
        )}
      </div>
    </Link>
  );
};
