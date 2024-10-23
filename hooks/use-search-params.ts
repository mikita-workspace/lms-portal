import { usePathname, useRouter } from 'next/navigation';
import qs from 'query-string';
import { useEffect } from 'react';

import { useHydration } from './use-hydration';

export const useSearchLineParams = (
  searchParams: Record<string, string | number | null>,
  ignore = false,
) => {
  const { isMounted } = useHydration();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ignore) {
      return;
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: searchParams,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pathname, ...Object.values(searchParams)]);

  if (!isMounted) {
    return null;
  }
};
