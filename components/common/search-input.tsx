'use client';

import { Search, XIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import { useSearchLineParams } from '@/hooks/use-search-params';

import { Input } from '../ui';

export const SearchInput = () => {
  const t = useTranslations('search-input');

  const [value, setValue] = useState('');

  const debouncedValue = useDebounce(value);
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');

  useSearchLineParams({ categoryId: currentCategoryId, title: debouncedValue });

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-primary" />
      {Boolean(value) && (
        <span className="hover:cursor-pointer" onClick={() => setValue('')}>
          <XIcon className="h-4 w-4 absolute top-3 right-3 text-primary" />
        </span>
      )}
      <Input
        className="w-full md:w-[264px] pl-9 pr-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-900/40"
        placeholder={t('searchFor')}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
};
