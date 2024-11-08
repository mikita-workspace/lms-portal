'use server';

import { ONE_DAY_SEC } from '@/constants/common';
import { PAGE_SIZES } from '@/constants/paginations';
import { fetchCachedData } from '@/lib/cache';
import { fetcher } from '@/lib/fetcher';

type GetGithubReleases = {
  pageIndex?: string | number;
  pageSize?: string | number;
};

export const getGithubReleases = async ({
  pageIndex = 0,
  pageSize = PAGE_SIZES[0],
}: GetGithubReleases): Promise<
  {
    body: string | null;
    html_url: string | null;
    name: string | null;
    publishedAt: string | null;
    zipUrl: string | null;
  }[]
> => {
  try {
    const githubReleases = await fetchCachedData(
      'github-releases',
      async () => {
        const res = await fetcher.get(
          `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/releases?per_page=${pageSize}&page=${pageIndex}`,
          {
            responseType: 'json',
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
          },
        );

        return res.map((release: any) => ({
          body: release.body,
          html_url: release.html_url,
          name: release.name,
          publishedAt: release.published_at,
          zipUrl: release.zipball_url,
        }));
      },
      ONE_DAY_SEC,
    );
    return githubReleases;
  } catch (error) {
    console.error('[GET_GITHUB_RELEASES]', error);

    return [];
  }
};
