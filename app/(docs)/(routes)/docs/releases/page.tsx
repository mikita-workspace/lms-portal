import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { getGithubReleases } from '@/actions/github/get-releases';
import { MarkdownText } from '@/components/common/markdown-text';
import { Button } from '@/components/ui';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';

export const metadata: Metadata = {
  title: 'Releases notes',
  description: 'Educational portal',
};

type ReleasesPagePageProps = {
  searchParams: { pageIndex: string; pageSize: string };
};

const ReleasesPage = async ({ searchParams }: ReleasesPagePageProps) => {
  const t = await getTranslations('releases');

  const releases = await getGithubReleases(searchParams);

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex flex-col items-center">
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
              {release.zipUrl && (
                <Link href={release.zipUrl}>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {t('download')}
                  </Button>
                </Link>
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
