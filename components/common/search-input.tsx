'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';

import { Input } from '../ui';

export const SearchInput = () => {
  const [value, setValue] = useState('');

  const debouncedValue = useDebounce(value);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: { categoryId: currentCategoryId, tittle: debouncedValue },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-primary" />
      <Input
        className="w-full md:w-[300px] pl-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-900/40"
        placeholder="Search for a course..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
};
