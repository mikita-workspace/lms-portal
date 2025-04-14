'use server';

import { getLocale } from 'next-intl/server';
import { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';

import { ChatCompletionRole } from '@/constants/ai';
import { ONE_DAY_SEC } from '@/constants/common';
import { fetchCachedData } from '@/lib/cache';
import { AIProvider } from '@/server/ai-provider';

import { getAppConfig } from '../configs/get-app-config';

export const getChatInitial = async () => {
  const locale = await getLocale();
  const config = await getAppConfig();

  const provider = AIProvider(config?.ai?.provider as string);

  const DEFAULT_MODEL = (config?.ai?.['text-models']?.[0] as Record<string, string>)?.value;

  try {
    const introMessages = await fetchCachedData(
      `chat-initial-[${locale}]`,
      async () => {
        const response = await provider.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a machine that only returns array format.',
            },
            {
              content: `Generate 4 questions ranging from 120 to 150 characters long for an intelligent chat on the topic of programming. Language code is ${locale}. Write the result to an array.`,
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

    return {
      introMessages: JSON.parse(introMessages.choices[0].message.content || '[]'),
    };
  } catch (error) {
    console.error('[GET_CHAT_INITIAL_ACTION]', error);

    return {
      introMessages: [],
    };
  }
};
