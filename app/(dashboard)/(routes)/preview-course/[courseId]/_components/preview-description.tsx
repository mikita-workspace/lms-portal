'use client';

import { Fee } from '@prisma/client';
import { BookOpen } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { GenerateTextResponseAi } from '@/components/ai/generate-text-response-ai';
import { IconBadge } from '@/components/common/icon-badge';
import { Price } from '@/components/common/price';
import { TextBadge } from '@/components/common/text-badge';
import { USER_TRANSLATE } from '@/constants/ai';
import { ChatCompletionRole } from '@/constants/open-ai';
import { useCurrentUser } from '@/hooks/use-current-user';

type PreviewDescriptionProps = {
  categories: string[];
  chaptersLength: number;
  customRates: string | null;
  customTags?: string[];
  description: string;
  fees?: Fee[];
  hasPurchase?: boolean;
  id: string;
  language: string | null;
  price: number | null;
  title: string;
};

export const PreviewDescription = ({
  categories,
  chaptersLength,
  customRates,
  customTags,
  description,
  fees,
  hasPurchase,
  id,
  language,
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
                  content: USER_TRANSLATE(description, currentLocale),
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
      {!hasPurchase && (
        <div className="mt-4">
          <Price customRates={customRates} price={price} fees={fees} showFeesAccordion />
        </div>
      )}
    </div>
  );
};
