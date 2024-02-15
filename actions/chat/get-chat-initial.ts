'use server';

import { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';

import { ChatCompletionRole, DEFAULT_MODEL } from '@/constants/open-ai';
import { openai } from '@/server/openai';

export const getChatInitial = async () => {
  try {
    const { data: models } = await openai.models.list();

    const introMessages = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a machine that only returns array format.',
        },
        {
          content:
            'Generate 4 questions ranging from 120 to 150 characters long for an intelligent chat. Write the result to an array.',
          role: ChatCompletionRole.USER as unknown as ChatCompletionUserMessageParam['role'],
        },
      ],
      model: DEFAULT_MODEL,
      temperature: 0.8,
    });

    return {
      introMessages: JSON.parse(introMessages.choices[0].message.content || '[]'),
      models: models
        .map((model) => ({ value: model.id, label: model.id }))
        .filter((model) => model.value.startsWith('gpt')),
    };
  } catch (error) {
    console.error('[GET_CHAT_INITIAL_ACTION]', error);

    return {
      introMessages: [],
      models: [],
    };
  }
};
