import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';
import { createWebSocketNotification } from '@/lib/notifications';

export const POST = async (req: NextRequest) => {
  try {
    const t = await getTranslations('csm-modal.notifications');

    const user = await getCurrentUser();

    const { email, categoryId, description, files } = await req.json();

    const lastIssueInDb = await db.csmIssue.findMany({ orderBy: { createdAt: 'desc' }, take: 1 });
    const issueNumber = `CSM-${lastIssueInDb.length ? Number(lastIssueInDb[0].name.split('-')[1]) + 1 : 1}`;

    const issue = await db.csmIssue.create({
      data: {
        categoryId,
        description,
        email,
        name: issueNumber,
        userId: user?.userId,
      },
    });

    await db.csmAttachment.createMany({
      data: files.map((file: { url: string; name: string }) => ({
        csmIssueId: issue.id,
        name: file.name,
        url: file.url,
      })),
    });

    if (user) {
      const userId = user.userId;

      await createWebSocketNotification({
        channel: `notification_channel_${userId}`,
        data: {
          body: t('success'),
          title: `${issue.name}`.toUpperCase(),
          userId,
        },
        event: `private_event_${userId}`,
      });
    }

    const ownerId = process.env.NEXT_PUBLIC_OWNER_ID as string;

    await createWebSocketNotification({
      channel: `notification_channel_${ownerId}`,
      data: {
        body: t('ownerSuccess', { user: user?.name || email }),
        title: `${issue.name}`.toUpperCase(),
        userId: ownerId,
      },
      event: `private_event_${ownerId}`,
    });

    return NextResponse.json({ issueNumber: issue.name });
  } catch (error) {
    console.error('[CSM_CREATE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
