import { OpenAIStream, StreamingTextResponse } from 'ai';
import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { openai } from '@/server/openai';

export const POST = async (req: NextRequest) => {
  try {
    const { prompt } = await req.json();

    console.log(prompt);

    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      stream: true,
      max_tokens: 512,
      messages: [
        { role: 'system', content: 'You are a helpful assistant in learning portal.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log('[OPEN_AI]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
