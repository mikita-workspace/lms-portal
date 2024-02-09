'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { IconType } from 'react-icons';

import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type CategoryItemProps = {
  icon?: IconType;
  label: string;
  value?: string;
};

export const CategoryItem = ({ icon: Icon, label, value = 'all' }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');
  const currentTitle = searchParams.get('title');

  const isSelected = currentCategoryId === value || (value === 'all' && !currentCategoryId);

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: { title: currentTitle, categoryId: isSelected || value === 'all' ? null : value },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <Button
      className={cn(
        'py-2 px-3 text-xs border rounded-lg flex items-center transition duration-300 space-x-1 font-semibold',
        isSelected &&
          'border-sky-700 bg-sky-200/20 text-sky-800 hover:bg-sky-200/40 dark:border-sky-200/20 dark:bg-sky-600/80 dark:text-primary dark:hover:bg-sky-600',
      )}
      variant="outline"
      onClick={handleClick}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </Button>
  );
};
