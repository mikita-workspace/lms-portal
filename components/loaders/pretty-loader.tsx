import { Poppins } from 'next/font/google';
import Image from 'next/image';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500'] });

export const PrettyLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image src="/assets/pretty-loader.gif" alt="Pretty Loader" width={60} height={60} />
      <div className={poppins.className}>
        <p className="font-semibold text-base text-neutral-700 dark:text-neutral-300">Nova LMS</p>
        <p className="text-xs text-muted-foreground">Portal&nbsp;for&nbsp;educational purposes</p>
      </div>
    </div>
  );
};
