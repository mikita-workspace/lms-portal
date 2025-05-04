import { format } from 'date-fns';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { getGithubReleases } from '@/actions/github/get-releases';
import { MarkdownText } from '@/components/common/markdown-text';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';

export const metadata: Metadata = {
  title: 'Releases notes',
  description: 'Educational portal',
};

type ReleasesPagePageProps = {
  searchParams: Promise<{ pageIndex: string; pageSize: string }>;
};

const ReleasesPage = async (props: ReleasesPagePageProps) => {
  const searchParams = await props.searchParams;
  const t = await getTranslations('releases');

  const releases = await getGithubReleases(searchParams);

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex flex-col items-start">
        {releases.map((release, index) => (
          <div className="mb-8" key={release.name}>
            {index === 0 && (
              <h1 className="text-2xl font-bold mb-8 self-start">{t('releasesNotes')}</h1>
            )}
            <div className="flex flex-col mb-4">
              {release.html_url && (
                <Link href={release.html_url} target="_blank">
                  <h2 className="font-bold text-xl">{release.name}</h2>
                </Link>
              )}
              {release.publishedAt && (
                <p className="text-sm text-muted-foreground mb-4">
                  {format(release.publishedAt, TIMESTAMP_TEMPLATE)}
                </p>
              )}
            </div>
            <MarkdownText className="max-w-screen-md" text={release.body} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReleasesPage;
