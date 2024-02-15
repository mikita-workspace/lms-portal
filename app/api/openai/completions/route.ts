import { OpenAIStream, StreamingTextResponse } from 'ai';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { openai } from '@/server/openai';

export const POST = async (req: NextRequest) => {
  try {
    const { messages, model } = await req.json();

    const completion = await openai.chat.completions.create({
      messages,
      model,
      top_p: 0.5,
      stream: true,
    });

    const stream = OpenAIStream(completion);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log('[OPEN_AI_COMPLETIONS]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
