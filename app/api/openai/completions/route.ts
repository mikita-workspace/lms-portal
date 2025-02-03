import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { OPEN_AI_MODELS } from '@/constants/open-ai';
import { isOwner } from '@/lib/owner';
import { openai } from '@/server/openai';

// Only for Hobby Plan on Vercel Cloud. For normal use, 60s is enough.
export const maxDuration = 10;

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const models = (isOwner(user?.userId) ? OPEN_AI_MODELS : OPEN_AI_MODELS.slice(0, 2)).map(
      ({ value }) => value,
    );

    const { messages, model, system } = await req.json();

    if (!models.includes(model)) {
      console.error('[OPEN_AI_FORBIDDEN_MODEL]', user);

      return new NextResponse(ReasonPhrases.FORBIDDEN, {
        status: StatusCodes.FORBIDDEN,
      });
    }

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
