'use client';

import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { IconBadge } from '@/components/common/icon-badge';
import { ProgressBar } from '@/components/common/progress-bar';
import { TextBadge } from '@/components/common/text-badge';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { useCurrentUser } from '@/hooks/use-current-user';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

type CourseCardProps = {
  category?: string;
  chaptersLength: number;
  id: string;
  imageUrl: string | null;
  isPublished?: boolean;
  price: number | null;
  progress: number | null;
  title: string;
};

export const CourseCard = ({
  category,
  chaptersLength,
  id,
  imageUrl,
  isPublished,
  price,
  progress,
  title,
}: CourseCardProps) => {
  const { user } = useCurrentUser();

  const href = `/${user?.userId ? 'courses' : 'landing-course'}/${id}`;

  return (
    <Link href={href} title={title} className={cn(!isPublished && 'pointer-events-none')}>
      <div
        className={cn(
          'group hover:shadow-sm transition duration-300 overflow-hidden border rounded-lg p-3 h-full dark:bg-neutral-900 hover:bg-blue-500/10 dark:hover:bg-neutral-900/75',
          !isPublished && 'select-none blur-sm',
        )}
      >
        <div className="w-full aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
          <Image className="object-cover" fill alt={title} src={imageUrl!} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-blue-700 dark:group-hover:text-blue-400 transition duration-300 line-clamp-1">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-neutral-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength > 1 ? 'Chapters' : 'Chapter'}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <ProgressBar
              showText
              variant={progress < 100 ? 'default' : 'success'}
              size="sm"
              value={progress}
            />
          ) : (
            <div>
              {!price ? (
                <TextBadge variant="lime" label="Free" />
              ) : (
                <p className="text-md md:text-small font-medium text-neutral-700 dark:text-neutral-300 ">
                  {formatPrice(price, { locale: DEFAULT_LOCALE, currency: DEFAULT_CURRENCY })}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
