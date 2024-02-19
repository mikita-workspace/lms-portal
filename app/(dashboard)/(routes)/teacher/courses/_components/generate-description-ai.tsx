'use client';

import { StopCircle } from 'lucide-react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsStars } from 'react-icons/bs';

import { Button } from '@/components/ui';
import { ChatCompletionRole, DEFAULT_MODEL } from '@/constants/open-ai';
import { fetcher } from '@/lib/fetcher';

type GenerateDescriptionAiProps = {
  callback: Dispatch<SetStateAction<string>>;
  isSubmitting?: boolean;
  isValid?: boolean;
  messages: { role: string; content: string }[];
};

export const GenerateDescriptionAi = ({
  callback,
  isSubmitting,
  isValid,
  messages,
}: GenerateDescriptionAiProps) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isImproving, setIsImproving] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsImproving(true);

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const completionStream = await fetcher.post('/api/openai/completions', {
        body: {
          messages,
          system: {
            role: ChatCompletionRole.SYSTEM,
            content: 'You are the creator of various courses on a special learning platform.',
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

        callback((prev) => prev + chunk);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error(String(error?.message));
      }
    } finally {
      setIsImproving(false);
    }
  };

  const handleAbortGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <Button
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:text-white font-medium z-10 px-2"
      disabled={isSubmitting || !isValid}
      variant="outline"
      size="sm"
      onClick={isImproving ? handleAbortGenerating : handleGenerate}
    >
      {!isImproving && <BsStars className="mr-1" />}
      {isImproving && <StopCircle className="w-4 h-4 mr-1" />}
      {isImproving ? 'Stop' : 'Improve'}
    </Button>
  );
};
