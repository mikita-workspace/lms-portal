'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type CategoryItemProps = {
  label: string;
  value?: string;
};

export const CategoryItem = ({ label, value = 'all' }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryIds = JSON.parse(searchParams.get('categoryIds') ?? '[]');
  const currentTitle = searchParams.get('title');
  const isSelected =
    currentCategoryIds.includes(value) || (value === 'all' && !currentCategoryIds?.length);

  const handleClick = () => {
    const categoryIds = isSelected
      ? currentCategoryIds.filter((item: string) => item !== value)
      : [...currentCategoryIds, value];

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryIds: value === 'all' || !categoryIds.length ? null : JSON.stringify(categoryIds),
          title: currentTitle,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <Button
      className={cn(
        'py-2 px-3 text-sm/6 border rounded-lg flex items-center transition duration-300 space-x-1 font-semibold',
        isSelected &&
          'bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20',
      )}
      variant="outline"
      onClick={handleClick}
    >
      <div className="truncate">{label}</div>
    </Button>
  );
};
