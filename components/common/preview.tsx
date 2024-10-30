'use client';

import 'react-quill/dist/quill.bubble.css';

import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { useMemo, useState } from 'react';

import { USER_TRANSLATE_PROMPT } from '@/constants/ai';
import { ChatCompletionRole } from '@/constants/open-ai';
import { useCurrentUser } from '@/hooks/use-current-user';

import { GenerateTextResponseAi } from '../ai/generate-text-response-ai';

type PreviewProps = {
  enableTranslate?: boolean;
  id: string;
  language?: string | null;
  value: string;
};

export const Preview = ({ enableTranslate, id, language, value }: PreviewProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  const currentLocale = useLocale();
  const { user } = useCurrentUser();

  const [translatedDescription, setTranslatedDescription] = useState('');

  const showTranslateButton = Boolean(
    enableTranslate && language && language !== currentLocale && user?.hasSubscription,
  );

  const cacheKey = `chapter-description-[${id}]-[${currentLocale}]`;

  return (
    <>
      {showTranslateButton && (
        <div className="p-4">
          <GenerateTextResponseAi
            cacheKey={cacheKey}
            isTranslateButton
            callback={setTranslatedDescription}
            messages={[
              {
                role: ChatCompletionRole.USER,
                content: USER_TRANSLATE_PROMPT(value, currentLocale),
              },
            ]}
          />
        </div>
      )}
      <ReactQuill
        className="dark:bg-neutral-950 text-primary"
        theme="bubble"
        value={translatedDescription || value}
        readOnly
      />
    </>
  );
};
