import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getAppConfig } from '@/actions/configs/get-app-config';
import { OPEN_AI_MODELS, SYSTEM_TRANSLATE_PROMPT } from '@/constants/ai';
import { isOwner } from '@/lib/owner';
import { AIProvider } from '@/server/ai-provider';

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  const user = await getCurrentUser();
  const config = await getAppConfig();

  const provider = AIProvider(config?.ai?.provider);

  try {
    const { messages, model, system } = await req.json();

    const isTranslator = system?.content === SYSTEM_TRANSLATE_PROMPT;

    if (!isTranslator && !user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const models = (isOwner(user?.userId) ? OPEN_AI_MODELS : OPEN_AI_MODELS.slice(0, 2)).map(
      ({ value }) => value,
    );

    if (!models.includes(model)) {
      console.error('[OPEN_AI_FORBIDDEN_MODEL]', user);

      return new NextResponse(ReasonPhrases.FORBIDDEN, {
        status: StatusCodes.FORBIDDEN,
      });
    }

    const completion = await provider.chat.completions.create({
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
