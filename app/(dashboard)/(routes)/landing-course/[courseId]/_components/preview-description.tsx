'use client';

import { BookOpen } from 'lucide-react';

import { IconBadge } from '@/components/common/icon-badge';
import { TextBadge } from '@/components/common/text-badge';

type PreviewDescriptionProps = {
  categories: string[];
  chaptersLength: number;
  description: string;
  title: string;
};

export const PreviewDescription = ({
  categories,
  chaptersLength,
  description,
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
    </div>
  );
};
