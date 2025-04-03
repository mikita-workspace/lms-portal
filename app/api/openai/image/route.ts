import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { uploadFiles } from '@/actions/uploadthing/upload-files';
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

    const models = OPEN_AI_IMAGE_MODELS.map(({ value }) => value);

    if (!models.includes(model)) {
      console.error('[OPEN_AI_FORBIDDEN_IMAGE_MODEL]', user);

      return new NextResponse(ReasonPhrases.FORBIDDEN, {
        status: StatusCodes.FORBIDDEN,
      });
    }

    const response = await openai.images.generate({
      model,
      n: 1,
      prompt,
      quality: 'hd',
      response_format: 'b64_json',
      size: '1024x1024',
    });

    const files = await uploadFiles([
      {
        name: `${uuidv4()}.png`,
        base64: response.data[0].b64_json ?? '',
        contentType: 'image/png',
      },
    ]);

    return NextResponse.json({
      revisedPrompt: response.data[0].revised_prompt,
      url: files[0].data?.url,
    });
  } catch (error) {
    console.error('[OPEN_AI_IMAGE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
