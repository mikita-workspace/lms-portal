'use server';

import { getLocale } from 'next-intl/server';
import { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';

import { ChatCompletionRole } from '@/constants/ai';
import { TEN_MINUTE_SEC } from '@/constants/common';
import { fetchCachedData } from '@/lib/cache';
import { AIProvider } from '@/server/ai-provider';

import { getAppConfig } from '../configs/get-app-config';

export const getLoginQuote = async () => {
  const locale = await getLocale();
  const config = await getAppConfig();

  const provider = AIProvider(config?.ai?.provider as string);

  const DEFAULT_MODEL = config?.ai?.['text-models']?.[0].value;

  try {
    const response = await fetchCachedData(
      `login-quote-[${locale}]`,
      async () => {
        const response = await provider.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'You are a machine that only returns JSON object format without unnecessary symbols.',
            },
            {
              content: `Generate a quote from a famous philosopher. Language code is ${locale}. Write it down in JSON format - {"quote": "Quote", "author": "Quote the author"}`,
              role: ChatCompletionRole.USER as unknown as ChatCompletionUserMessageParam['role'],
            },
          ],
          model: DEFAULT_MODEL,
          temperature: 0.8,
        });

        return response;
      },
      TEN_MINUTE_SEC,
    );

    const generatedQuote = JSON.parse(response.choices[0].message.content || '{}');

    return {
      author: generatedQuote?.author ?? '',
      model: DEFAULT_MODEL,
      quote: generatedQuote?.quote ?? '',
    };
  } catch (error) {
    console.error('[GET_LOGIN_CITE_ACTION]', error);

    return {
      author: '',
      model: DEFAULT_MODEL,
      quote: '',
    };
  }
};
