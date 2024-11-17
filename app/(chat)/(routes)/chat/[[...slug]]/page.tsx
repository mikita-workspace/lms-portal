import { notFound } from 'next/navigation';

import { getChatConversations } from '@/actions/chat/get-chat-conversations';
import { getChatInitial } from '@/actions/chat/get-chat-initial';

import { Chat } from './_components/chat-main/chat';

type ChatPageProps = Readonly<{
  params: { slug: string[] };
}>;

const ChatPage = async ({ params }: ChatPageProps) => {
  const isEmbed = params.slug?.includes('embed');
  const isShared = params.slug?.includes('shared');

  const initialData = await getChatInitial();
  const conversations =
    isEmbed || isShared
      ? await getChatConversations({
          isEmbed,
          sharedConversationId: isShared ? params.slug[1] : '',
        })
      : [];

  if (isShared && !conversations.length) {
    notFound();
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <Chat conversations={conversations} initialData={initialData} isShared={isShared} />
    </div>
  );
};

export default ChatPage;
