import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { openai } from '@/server/openai';

// TODO: Only for Hobby Plan on vercel
export const maxDuration = 10;

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { messages, model, system } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [...(system ? [system] : []), ...messages],
      model,
      top_p: 0.5,
      stream: true,
    });

    const stream = OpenAIStream(completion);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('[OPEN_AI_COMPLETIONS]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
