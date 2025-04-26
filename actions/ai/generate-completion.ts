'use server';

import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { ResponseCreateParamsBase } from 'openai/resources/responses/responses.mjs';

import { AI_PROVIDER, ChatCompletionRole } from '@/constants/ai';
import { isOwner } from '@/lib/owner';
import { AIProvider } from '@/server/ai-provider';

import { getCurrentUser } from '../auth/get-current-user';
import { getAppConfig } from '../configs/get-app-config';

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
  const config = await getAppConfig();

  const aiModel = model ?? config?.ai?.['text-models']?.[0].value ?? '';
  const provider = AIProvider(config?.ai?.provider);

  const TEXT_MODELS = config?.ai?.['text-models'] ?? [];
  const models = (isOwner(user?.userId) ? TEXT_MODELS : TEXT_MODELS.slice(0, 2)).map(
    ({ value }) => value,
  );

  if (!models.includes(aiModel)) {
    return { completion: null, model: aiModel };
  }

  const completion =
    config?.ai?.provider === AI_PROVIDER.openai
      ? await provider.responses.create({
          input,
          instructions,
          model: aiModel,
          stream,
        })
      : await provider.chat.completions.create({
          messages: [
            ...(instructions ? [{ role: ChatCompletionRole.SYSTEM, content: instructions }] : []),
            ...input,
          ] as ChatCompletionMessageParam[],
          model: aiModel,
          stream,
        });

  if (stream) {
    const encoder = new TextEncoder();
    const stream_response = new TransformStream();

    (async () => {
      const writer = stream_response.writable.getWriter();

      try {
        for await (const event of completion as any) {
          if (event.type === 'response.output_text.delta') {
            const data = {
              item_id: event.item_id,
              output_index: event.output_index,
              content_index: event.content_index,
              delta: event.delta,
            };
            await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
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

    return { completion: stream_response.readable, model: aiModel };
  }

  return { completion, model: aiModel };
};
