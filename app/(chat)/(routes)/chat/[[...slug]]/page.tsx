import { notFound } from 'next/navigation';

import { getChatConversations } from '@/actions/chat/get-chat-conversations';
import { getChatInitial } from '@/actions/chat/get-chat-initial';

import { Chat } from './_components/chat-main/chat';

type ChatPageProps = Readonly<{
  params: Promise<{ slug: string[] }>;
}>;

const ChatPage = async ({ params }: ChatPageProps) => {
  const { slug } = await params;

  const isEmbed = slug?.includes('embed');
  const isShared = slug?.includes('shared');

  const initialData = await getChatInitial();
  const conversations =
    isEmbed || isShared
      ? await getChatConversations({
          sharedConversationId: isShared ? slug[1] : '',
        })
      : [];

  if (isShared && !conversations.length) {
    notFound();
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <Chat
        conversations={conversations}
        initialData={initialData}
        isEmbed={isEmbed}
        isShared={isShared}
      />
    </div>
  );
};

export default ChatPage;
