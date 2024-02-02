import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center flex">
        <Image src="/assets/logo.svg" alt="Nova LMS Logo" height={36} width={36} />
        <span className="text-2xl text-neutral-700 ml-3 font-semibold whitespace-nowrap font-sans">
          Nova LMS
        </span>
      </div>
    </Link>
  );
};
