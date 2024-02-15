import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

import { openai } from '@/server/openai';

export const GET = async () => {
  try {
    const modelsList = await openai.models.list();

    return NextResponse.json(modelsList);
  } catch (error) {
    console.log('[OPEN_AI_LIST]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
