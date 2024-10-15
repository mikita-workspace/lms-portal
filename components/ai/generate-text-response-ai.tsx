'use client';

import { Languages, StopCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { BsStars } from 'react-icons/bs';

import { useToast } from '@/components/ui/use-toast';
import { SYSTEM_COURSE_PROMPT, SYSTEM_TRANSLATE_PROMPT } from '@/constants/ai';
import { TEN_MINUTE_SEC } from '@/constants/common';
import { ChatCompletionRole, DEFAULT_MODEL } from '@/constants/open-ai';
import { getValueFromMemoryCache, setValueToMemoryCache } from '@/lib/cache';
import { fetcher } from '@/lib/fetcher';

import { Button } from '../ui';

type GenerateTextResponseAiProps = {
  cacheKey?: string;
  callback: Dispatch<SetStateAction<string>>;
  isSubmitting?: boolean;
  isTranslateButton?: boolean;
  isValid?: boolean;
  messages: { role: string; content: string }[];
};

export const GenerateTextResponseAi = ({
  cacheKey,
  callback,
  isSubmitting,
  isTranslateButton,
  isValid,
  messages,
}: GenerateTextResponseAiProps) => {
  const t = useTranslations('ai-generate');

  const { toast } = useToast();

  const abortControllerRef = useRef<AbortController | null>(null);

  const [isImproving, setIsImproving] = useState(false);
  const [alreadyTranslated, setAlreadyTranslated] = useState(false);

  const shouldCacheResponse = isTranslateButton && cacheKey;

  const handleGenerate = async () => {
    try {
      setIsImproving(true);

      if (shouldCacheResponse) {
        const cachedResponse = await getValueFromMemoryCache(cacheKey);

        if (cachedResponse) {
          callback(cachedResponse);
          return;
        }
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const completionStream = await fetcher.post('/api/openai/completions', {
        body: {
          messages,
          system: {
            role: ChatCompletionRole.SYSTEM,
            content: isTranslateButton ? SYSTEM_TRANSLATE_PROMPT : SYSTEM_COURSE_PROMPT,
          },
          model: DEFAULT_MODEL,
        },
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });

      const reader = completionStream.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      callback('');
      let text = '';

      while (true) {
        const rawChunk = await reader?.read();

        if (!rawChunk) {
          throw new Error('Unable to process chunk');
        }

        const { done, value } = rawChunk;

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);

        text += chunk;
        callback((prev) => prev + chunk);
      }

      if (shouldCacheResponse) {
        await setValueToMemoryCache(cacheKey, text, TEN_MINUTE_SEC);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({ description: String(error?.message), isError: true });
      }
    } finally {
      setIsImproving(false);
      setAlreadyTranslated(true);
    }
  };

  const handleAbortGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleReturnOriginalText = () => {
    callback('');
    setAlreadyTranslated(false);
  };

  if (isTranslateButton) {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={isImproving}
        onClick={alreadyTranslated ? handleReturnOriginalText : handleGenerate}
      >
        <Languages className="mr-2 h-4 w-4" />
        {t(alreadyTranslated ? 'original' : 'translate')}
      </Button>
    );
  }

  return (
    <button
      disabled={isSubmitting || !isValid}
      onClick={isImproving ? handleAbortGenerating : handleGenerate}
    >
      <div className="relative group z-10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="relative px-3 py-2 h-8 bg-white text-black rounded-md flex items-center text-sm">
          {!isImproving && <BsStars className="mr-1" />}
          {isImproving && <StopCircle className="w-4 h-4 mr-1" />}
          {t(isImproving ? 'stop' : 'improve')}
        </div>
      </div>
    </button>
  );
};
