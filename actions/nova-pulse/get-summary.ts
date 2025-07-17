'use server';

import { getLocale } from 'next-intl/server';
import { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';

import { ChatCompletionRole, NOVA_PULSE_SUMMARY } from '@/constants/ai';

import { generateCompletion } from '../ai/generate-completion';

export const getSummary = async <T>(data: T) => {
  const locale = await getLocale();

  try {
    const response: any = await generateCompletion({
      instructions:
        'You are a machine that only returns JSON object format without unnecessary symbols.',
      input: [
        {
          content: NOVA_PULSE_SUMMARY(data, locale),
          role: ChatCompletionRole.USER as unknown as ChatCompletionUserMessageParam['role'],
        },
      ],
    });

    const generatedSummary = JSON.parse(
      response.completion.output_text ?? response.completion.choices[0].message.content ?? '{}',
    );
    const model = response.model ?? '';

    return {
      body: generatedSummary?.body ?? '',
      color: generatedSummary?.color ?? '',
      model,
      title: generatedSummary?.title ?? '',
    };
  } catch (error) {
    console.error('[GET_SUMMARY_ACTION]', error);

    return {
      body: '',
      color: '',
      model: '',
      title: '',
    };
  }
};
