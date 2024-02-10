'use client';

import { TextBadge } from '@/components/common/text-badge';

type PreviewDescriptionProps = {
  categories: string[];
  description: string;
  title: string;
};

export const PreviewDescription = ({ categories, description, title }: PreviewDescriptionProps) => {
  return (
    <div className="border rounded-lg p-6">
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
