import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500'] });

export const Logo = () => {
  return (
    <Link href="/">
      <div className="items-center gap-x-2 hidden md:flex hover:opacity-75 transition-opacity">
        <Image src="/assets/logo.svg" alt="Nova LMS Logo" height={36} width={36} />
        <div className={poppins.className}>
          <p className="font-semibold text-base text-neutral-700 dark:text-neutral-300">Nova LMS</p>
          <p className="text-xs text-muted-foreground">Portal for educational purposes</p>
        </div>
      </div>
    </Link>
  );
};
