'use client';

import { BookOpen } from 'lucide-react';

import { IconBadge } from '@/components/common/icon-badge';
import { TextBadge } from '@/components/common/text-badge';
import { Currency, Locale } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

type PreviewDescriptionProps = {
  categories: string[];
  chaptersLength: number;
  description: string;
  price?: number | null;
  title: string;
};

export const PreviewDescription = ({
  categories,
  chaptersLength,
  description,
  price,
  title,
}: PreviewDescriptionProps) => {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-x-2 mb-1">
        <IconBadge size="sm" icon={BookOpen} />
        <span className="text-xs text-muted-foreground">
          {chaptersLength} {chaptersLength > 1 ? 'Chapters' : 'Chapter'}
        </span>
      </div>
      <h3 className="font-semibold text-lg md:text-2xl mb-2 capitalize">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex gap-x-2 items-center">
        {categories.map((category) => (
          <TextBadge key={category} label={category} variant="indigo" />
        ))}
      </div>
      <div className="mt-4">
        {!price ? (
          <TextBadge variant="lime" label="Free" />
        ) : (
          <p className="text-md md:text-small font-bold text-neutral-700 dark:text-neutral-300">
            {formatPrice(price, { locale: Locale.EN_US, currency: Currency.USD })}
          </p>
        )}
      </div>
    </div>
  );
};
