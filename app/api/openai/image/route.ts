import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { OPEN_AI_IMAGE_MODELS } from '@/constants/open-ai';
import { openai } from '@/server/openai';

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    const { model, prompt } = await req.json();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    if (!OPEN_AI_IMAGE_MODELS.includes(model)) {
      console.error('[OPEN_AI_FORBIDDEN_IMAGE_MODEL]', user);

      return new NextResponse(ReasonPhrases.FORBIDDEN, {
        status: StatusCodes.FORBIDDEN,
      });
    }

    const response = await openai.images.generate({
      model,
      prompt,
      n: 1,
      size: '1024x1024',
    });

    return NextResponse.json({
      revisedPrompt: response.data[0].revised_prompt,
      url: response.data[0].url,
    });
  } catch (error) {
    console.error('[OPEN_AI_IMAGE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
