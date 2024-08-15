import { Baloo_2 } from 'next/font/google';

import { Logo } from '../common/logo';

const baloo2 = Baloo_2({ subsets: ['latin'], weight: ['400', '500'] });

export const PrettyLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2">
      <Logo onlyLogoIcon isChat />
      <div className={baloo2.className}>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-base text-neutral-700 dark:text-neutral-300">Nova LMS</p>
          <div className="flex">
            <span className="w-1 h-1 mr-1 rounded-full bg-neutral-400 inline-block animate-flash"></span>
            <span className="w-1 h-1 mr-1 rounded-full bg-neutral-400 inline-block animate-flash [animation-delay:0.2s]"></span>
            <span className="w-1 h-1 mr-1 rounded-full bg-neutral-400 inline-block animate-flash [animation-delay:0.4s]"></span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Educational&nbsp;portal</p>
      </div>
    </div>
  );
};
