import { Baloo_2 } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

const baloo2 = Baloo_2({ subsets: ['latin'], weight: ['400', '500'] });

type LogoProps = {
  isCopilot?: boolean;
  isLoader?: boolean;
  onlyDarkMode?: boolean;
  onlyLogoIcon?: boolean;
};

export const Logo = ({
  isCopilot = false,
  isLoader = false,
  onlyDarkMode = false,
  onlyLogoIcon = false,
}: LogoProps) => {
  const t = useTranslations('app');

  const Logo = () => (
    <div
      className={cn(
        'items-center gap-x-3 md:flex',
        !isLoader && 'hidden',
        !onlyLogoIcon && 'hover:opacity-75 transition-opacity',
      )}
    >
      <Image
        src={`/assets/${isCopilot ? 'copilot' : 'logo'}.svg`}
        alt={`${isCopilot ? 'Copilot' : t('name')} Logo`}
        height={40}
        width={40}
      />
      {!onlyLogoIcon && (
        <div className={cn(baloo2.className, isLoader && 'hidden md:block')}>
          <p
            className={cn(
              'font-semibold text-base',
              onlyDarkMode ? 'text-neutral-300' : 'text-neutral-700 dark:text-neutral-300',
            )}
          >
            {isCopilot ? 'Nova Copilot' : t('name')}
          </p>
          <p className={cn(onlyDarkMode ? 'text-neutral-400' : 'text-muted-foreground', 'text-xs')}>
            {t('description')}
          </p>
        </div>
      )}
    </div>
  );

  return onlyLogoIcon ? (
    <Logo />
  ) : (
    <Link href="/">
      <Logo />
    </Link>
  );
};
