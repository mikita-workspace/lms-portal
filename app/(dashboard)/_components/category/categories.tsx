'use client';

import { Category } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { IconType } from 'react-icons';
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from 'react-icons/fc';

import { CategoryItem } from './category-item';

const iconMap: Record<Category['name'], IconType> = {
  'Computer Science': FcMultipleDevices,
  Accounting: FcSalesPerformance,
  Engineering: FcEngineering,
  Filming: FcFilmReel,
  Fitness: FcSportsMode,
  Music: FcMusic,
  Photography: FcOldTimeCamera,
};

type CategoryProps = { items: Category[] };

export const Categories = ({ items }: CategoryProps) => {
  const t = useTranslations('courses.category');

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {[{ id: 'all', name: t('all') }, ...items].map((item) => (
        <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
      ))}
    </div>
  );
};
