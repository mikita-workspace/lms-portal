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
        'py-2 px-3 text-sm/6 border rounded-lg flex items-center transition duration-300 space-x-1 font-semibold',
        isSelected &&
          'bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20',
      )}
      variant="outline"
      onClick={handleClick}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </Button>
  );
};
