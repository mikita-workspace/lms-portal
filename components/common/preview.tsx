'use client';

import 'react-quill/dist/quill.bubble.css';

import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';
import { useMemo, useState } from 'react';

import { ChatCompletionRole, USER_TRANSLATE_PROMPT } from '@/constants/ai';
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

  return (
    <>
      {Boolean(user?.userId) && enableTranslate && language !== currentLocale && (
        <div className="p-4">
          <GenerateTextResponseAi
            cacheKey={`chapter-description-[${id}]-[${currentLocale}]`}
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
