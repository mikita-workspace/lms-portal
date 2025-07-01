'use client';

import { Category } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { CategoryItem } from './category-item';

type CategoryProps = { items: Category[] };

export const Categories = ({ items }: CategoryProps) => {
  const t = useTranslations('courses.category');

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {[{ id: 'all', name: t('all') }, ...items].map((item) => (
        <CategoryItem key={item.id} label={item.name} value={item.id} />
      ))}
    </div>
  );
};
