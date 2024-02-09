'use client';

import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { IconBadge } from '@/components/common/icon-badge';
import { TextBadge } from '@/components/common/text-badge';
import { Currency, Locale } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

type CourseCardProps = {
  category?: string;
  chaptersLength: number;
  id: string;
  imageUrl: string | null;
  price: number | null;
  progress: number | null;
  title: string;
};

export const CourseCard = ({
  category,
  chaptersLength,
  id,
  imageUrl,
  price,
  progress,
  title,
}: CourseCardProps) => {
  price = 0;
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition duration-300 overflow-hidden border rounded-lg p-3 h-full dark:bg-neutral-900">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image className="object-cover" fill alt={title} src={imageUrl!} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 dark:group-hover:text-sky-600 transition duration-300 line-clamp-2">
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
          {progress ? null : (
            <div>
              {Boolean(price && price > 0) && (
                <p className="text-md md:text-small font-medium text-neutral-700 dark:text-neutral-300 ">
                  {formatPrice(price, { locale: Locale.EN_US, currency: Currency.USD })}
                </p>
              )}
              {price === 0 && <TextBadge variant="lime" label="Free" />}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
