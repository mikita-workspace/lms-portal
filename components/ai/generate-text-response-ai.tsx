'use client';

import { StopCircle } from 'lucide-react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsStars } from 'react-icons/bs';

import { SYSTEM_COURSE_PROMPT } from '@/constants/ai';
import { ChatCompletionRole, DEFAULT_MODEL } from '@/constants/open-ai';
import { fetcher } from '@/lib/fetcher';

type GenerateTextResponseAiProps = {
  callback: Dispatch<SetStateAction<string>>;
  isSubmitting?: boolean;
  isValid?: boolean;
  messages: { role: string; content: string }[];
};

export const GenerateTextResponseAi = ({
  callback,
  isSubmitting,
  isValid,
  messages,
}: GenerateTextResponseAiProps) => {
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
            content: SYSTEM_COURSE_PROMPT,
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
    <button
      disabled={isSubmitting || !isValid}
      onClick={isImproving ? handleAbortGenerating : handleGenerate}
    >
      <div className="relative group z-10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="relative px-3 py-2 h-8 bg-white text-black rounded-md flex items-center text-sm">
          {!isImproving && <BsStars className="mr-1" />}
          {isImproving && <StopCircle className="w-4 h-4 mr-1" />}
          {isImproving ? 'Stop' : 'Improve'}
        </div>
      </div>
    </button>
  );
};
