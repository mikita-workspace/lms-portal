'use client';

import { Search, XIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';

import { Input } from '../ui';

export const SearchInput = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useState('');

  const debouncedValue = useDebounce(value);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: { categoryId: currentCategoryId, title: debouncedValue },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-primary" />
      {Boolean(value) && (
        <span className="hover:cursor-pointer" onClick={() => setValue('')}>
          <XIcon className="h-4 w-4 absolute top-3 right-3 text-primary" />
        </span>
      )}
      <Input
        className="w-full md:w-[350px] pl-9 pr-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 focus-visible:ring-neutral-200 dark:focus-visible:ring-neutral-900/40"
        placeholder="Search for a course..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
};
