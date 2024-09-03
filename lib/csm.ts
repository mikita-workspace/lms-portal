import { CsmCategory } from '@prisma/client';

export const getSortedCategories = (categories: CsmCategory[]) => {
  const otherCategory = categories.find((ct) => ct.name === 'other');
  const sortedCategories = categories.filter((ct) => ct.name !== 'other');

  return otherCategory ? [...sortedCategories, otherCategory] : sortedCategories;
};
