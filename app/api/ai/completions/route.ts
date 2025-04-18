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
    const { input, model, instructions } = await req.json();

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
      stream: true,
    });

    return completion;
  } catch (error) {
    console.error('[OPEN_AI_COMPLETIONS]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
