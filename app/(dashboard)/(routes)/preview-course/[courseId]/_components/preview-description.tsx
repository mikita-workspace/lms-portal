'use client';

import { Fee } from '@prisma/client';
import { format } from 'date-fns';
import { BookA, BookOpen, CalendarDays } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { GenerateTextResponseAi } from '@/components/ai/generate-text-response-ai';
import { IconBadge } from '@/components/common/icon-badge';
import { Price } from '@/components/common/price';
import { TextBadge } from '@/components/common/text-badge';
import { USER_TRANSLATE_PROMPT } from '@/constants/ai';
import { TIMESTAMP_PREVIEW_TEMPLATE } from '@/constants/common';
import { ChatCompletionRole } from '@/constants/open-ai';
import { useCurrentUser } from '@/hooks/use-current-user';

type PreviewDescriptionProps = {
  author?: string | null;
  categories: string[];
  chaptersLength: number;
  customRates: string | null;
  customTags?: string[];
  description: string;
  fees?: Fee[];
  hasPurchase?: boolean;
  id: string;
  language: string | null;
  lastUpdate: Date;
  price: number | null;
  title: string;
};

export const PreviewDescription = ({
  author,
  categories,
  chaptersLength,
  customRates,
  customTags,
  description,
  fees,
  hasPurchase,
  id,
  language,
  lastUpdate,
  price,
  title,
}: PreviewDescriptionProps) => {
  const t = useTranslations('courses.preview.preview');

  const currentLocale = useLocale();
  const { user } = useCurrentUser();

  const [translatedDescription, setTranslatedDescription] = useState('');

  const showTranslateButton = Boolean(
    language && language !== currentLocale && user?.hasSubscription,
  );

  const cacheKey = `course-description-[${id}]-[${currentLocale}]`;

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1 text-neutral-500 mb-1">
          <IconBadge size="sm" icon={BookOpen} />
          <span className="text-xs">{t('chapter', { amount: chaptersLength })}</span>
        </div>
        {showTranslateButton && (
          <div className="my-2">
            <GenerateTextResponseAi
              cacheKey={cacheKey}
              isTranslateButton
              callback={setTranslatedDescription}
              messages={[
                {
                  role: ChatCompletionRole.USER,
                  content: USER_TRANSLATE_PROMPT(description, currentLocale),
                },
              ]}
            />
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg md:text-2xl mb-2 capitalize">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{translatedDescription || description}</p>
      {Boolean(customTags?.length) && (
        <div className="flex gap-2 items-center mb-2 flex-wrap">
          {customTags?.map((tag) => <TextBadge key={tag} label={tag} variant="yellow" />)}
        </div>
      )}
      {Boolean(categories.length) && (
        <div className="flex gap-x-2 items-center">
          {categories.map((category) => (
            <TextBadge key={category} label={category} variant="indigo" />
          ))}
        </div>
      )}
      <div className="mt-4 gap-y-1">
        {author && (
          <div className="flex items-center gap-x-1 text-neutral-500 mb-1">
            <BookA className="h-4 w-4" />
            <span className="text-xs">{t('author', { author })}</span>
          </div>
        )}
        <div className="flex items-center gap-x-1 text-neutral-500 mb-1">
          <CalendarDays className="h-4 w-4" />
          <span className="text-xs">
            {t('lastUpdated')}&nbsp;{format(lastUpdate, TIMESTAMP_PREVIEW_TEMPLATE)}
          </span>
        </div>
      </div>
      {!hasPurchase && (
        <div className="mt-4">
          <Price customRates={customRates} price={price} fees={fees} showFeesAccordion />
        </div>
      )}
    </div>
  );
};
