'use client';

import { Download, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '../ui';

type FileDownloadProps = {
  fileName: string;
  isRemoveButtonDisabled?: boolean;
  onFileRemove?: () => void;
  showDownloadButton?: boolean;
  url: string;
};

export const FileDownload = ({
  fileName,
  isRemoveButtonDisabled = false,
  onFileRemove,
  showDownloadButton = false,
  url,
}: FileDownloadProps) => {
  const t = useTranslations('file-download');

  const [name, extension] = fileName.split('.');

  return (
    <div className="flex items-center justify-between p-3 w-full rounded-md border mb-2">
      <div className="flex items-center">
        <FileText className="h-4 w-4 mr-3 flex-shrink-0 text-red-500" />
        <div className="flex flex-col">
          <p className="text-primary font-medium text-sm">{name}</p>
          <p className="text-muted-foreground text-xs">{`.${extension}`}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {showDownloadButton && (
          <Link href={url} target="_blank">
            <Button variant="outline" title={t('download')}>
              <Download className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {Boolean(onFileRemove) && (
          <Button
            variant="outline"
            disabled={isRemoveButtonDisabled}
            onClick={onFileRemove!}
            title="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
