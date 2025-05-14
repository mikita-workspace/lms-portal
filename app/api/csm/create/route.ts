import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { createCsmIssue } from '@/actions/csm/create-csm-issue';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    const { email, categoryId, description, files } = await req.json();

    const csmIssue = await createCsmIssue({
      categoryId,
      description,
      email,
      files,
      userId: user?.userId,
    });

    return NextResponse.json({ issueNumber: csmIssue.issueNumber });
  } catch (error) {
    console.error('[CSM_CREATE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
