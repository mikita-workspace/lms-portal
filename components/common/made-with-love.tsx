'use client';

import { FaHeart } from 'react-icons/fa';

import { cn } from '@/lib/utils';

import packageJson from '../../package.json';

type MadeWithLoveProps = {
  className?: string;
};

export const MadeWithLove = ({ className }: MadeWithLoveProps) => {
  return (
    <div
      className={cn(className, 'flex items-center')}
      title={`${packageJson?.name}:${packageJson?.version}`}
    >
      <span>Made&nbsp;with&nbsp;</span>
      <FaHeart className="text-red-400 h-3 w-3" />
      <span>&nbsp;in&nbsp;Belarus</span>
    </div>
  );
};
