import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';
import { pusher } from '@/server/pusher';

export const POST = async (req: NextRequest) => {
  try {
    const t = await getTranslations('csm-modal.notifications');

    const user = await getCurrentUser();

    const { categoryId, description, files } = await req.json();

    const lastIssueInDb = await db.csmIssue.findMany({ orderBy: { createdAt: 'desc' }, take: 1 });
    const issueNumber = `CSM-${lastIssueInDb.length ? Number(lastIssueInDb[0].name.split('-')[1]) + 1 : 1}`;

    const issue = await db.csmIssue.create({
      data: {
        categoryId,
        description,
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

      await db.notification.create({
        data: {
          body: t('success'),
          title: `${issue.name}`.toUpperCase(),
          userId,
        },
      });

      await pusher.trigger(`notification_channel_${userId}`, `private_event_${userId}`, {
        trigger: true,
      });
    }

    const ownerId = process.env.NEXT_PUBLIC_OWNER_ID as string;

    await db.notification.create({
      data: {
        body: t('ownerSuccess', { user: user?.name || 'User' }),
        title: `${issue.name}`.toUpperCase(),
        userId: ownerId,
      },
    });

    await pusher.trigger(`notification_channel_${ownerId}`, `private_event_${ownerId}`, {
      trigger: true,
    });

    return NextResponse.json({ issueNumber: issue.name });
  } catch (error) {
    console.error('[CSM_CREATE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
