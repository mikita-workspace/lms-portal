'use server';

import { getLocale } from 'next-intl/server';
import { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';

import { ONE_DAY_SEC } from '@/constants/common';
import { ChatCompletionRole, DEFAULT_MODEL } from '@/constants/open-ai';
import { fetchCachedData } from '@/lib/cache';
import { openai } from '@/server/openai';

export const getLoginCite = async () => {
  const locale = await getLocale();

  try {
    const response = await fetchCachedData(
      `login-cite-[${locale}]`,
      async () => {
        const response = await openai.chat.completions.create({
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
      ONE_DAY_SEC,
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
