'use server';

import { getLocale } from 'next-intl/server';
import { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';

import { ONE_DAY_SEC } from '@/constants/common';
import { ChatCompletionRole, DEFAULT_MODEL } from '@/constants/open-ai';
import { fetchCachedData } from '@/lib/cache';
import { openai } from '@/server/openai';

export const getChatInitial = async () => {
  const locale = await getLocale();

  try {
    const introMessages = await fetchCachedData(
      `chat-initial-[${locale}]`,
      async () => {
        const response = await openai.chat.completions.create({
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
