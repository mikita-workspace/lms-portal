import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getAppConfig } from '@/actions/configs/get-app-config';
import { isOwner } from '@/lib/owner';
import { AIProvider } from '@/server/ai-provider';

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  const user = await getCurrentUser();
  const config = await getAppConfig();

  const provider = AIProvider(config?.ai?.provider as string);

  try {
    const { input, instructions, model, stream } = await req.json();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const TEXT_MODELS = config?.ai?.['text-models'] ?? [];
    const models = (isOwner(user?.userId) ? TEXT_MODELS : TEXT_MODELS.slice(0, 2)).map(
      ({ value }) => value,
    );

    if (!models.includes(model)) {
      console.error('[OPEN_AI_FORBIDDEN_MODEL]', user);

      return new NextResponse(ReasonPhrases.FORBIDDEN, {
        status: StatusCodes.FORBIDDEN,
      });
    }

    const completion = await provider.responses.create({
      input,
      instructions,
      model,
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

      return new NextResponse(stream_response.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    return NextResponse.json({ completion });
  } catch (error) {
    console.error('[OPEN_AI_COMPLETIONS]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
