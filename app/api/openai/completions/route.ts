import { OpenAIStream, StreamingTextResponse } from 'ai';
import { HttpStatusCode } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { openai } from '@/server/openai';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: StatusCodes.UNAUTHORIZED });
    }

    const { messages, model } = await req.json();

    const completion = await openai.chat.completions.create({
      messages,
      model,
      top_p: 0.5,
      max_tokens: 2096,
      stream: true,
    });

    const stream = OpenAIStream(completion);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('[OPEN_AI_COMPLETIONS]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
