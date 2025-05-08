'use server';

import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { ResponseCreateParamsBase } from 'openai/resources/responses/responses.mjs';

import { AI_PROVIDER, ChatCompletionRole } from '@/constants/ai';

import { getCurrentUser } from '../auth/get-current-user';
import { getTargetProvider } from './get-target-provider';

type GenerateCompletion = Omit<ResponseCreateParamsBase, 'model'> & {
  model?: string;
};

export const generateCompletion = async ({
  input,
  instructions,
  model,
  stream = false,
}: GenerateCompletion) => {
  const user = await getCurrentUser();

  const { provider, providerName, targetTextModel } = await getTargetProvider(model);

  if (!user?.hasSubscription && targetTextModel.isSubscription) {
    return { completion: null, model: targetTextModel.value };
  }

  const completion =
    providerName === AI_PROVIDER.openai
      ? await provider.responses.create({
          input,
          instructions,
          model: targetTextModel.value,
          stream,
        })
      : await provider.chat.completions.create({
          messages: [
            ...(instructions ? [{ role: ChatCompletionRole.SYSTEM, content: instructions }] : []),
            ...input,
          ] as ChatCompletionMessageParam[],
          model: targetTextModel.value,
          stream,
        });

  if (stream) {
    const encoder = new TextEncoder();
    const stream_response = new TransformStream();

    (async () => {
      const writer = stream_response.writable.getWriter();

      try {
        for await (const event of completion as any) {
          if (providerName === AI_PROVIDER.openai && event.type === 'response.output_text.delta') {
            await writer.write(
              encoder.encode(
                `data: ${JSON.stringify({
                  item_id: event.item_id,
                  output_index: event.output_index,
                  content_index: event.content_index,
                  delta: event.delta,
                })}\n\n`,
              ),
            );
          } else if (
            [AI_PROVIDER.deepseek, AI_PROVIDER.ollama].includes(providerName as AI_PROVIDER) &&
            event.choices[0].finish_reason !== 'stop'
          ) {
            await writer.write(encoder.encode(event.choices[0].delta.content ?? ''));
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);

        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ error: 'Stream processing error' })}\n\n`),
        );
      } finally {
        await writer.close();
      }
    })();

    return { completion: stream_response.readable, model: targetTextModel.value };
  }

  return { completion, model: targetTextModel.value };
};
