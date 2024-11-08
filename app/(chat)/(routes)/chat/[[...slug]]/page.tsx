import { getChatConversations } from '@/actions/chat/get-chat-conversations';
import { getChatInitial } from '@/actions/chat/get-chat-initial';

import { Chat } from './_components/chat-main/chat';

type ChatPageProps = Readonly<{
  params: { slug: string[] };
}>;

const ChatPage = async ({ params }: ChatPageProps) => {
  const isEmbed = params.slug?.includes('embed');

  const initialData = await getChatInitial();
  const conversations = isEmbed ? await getChatConversations(isEmbed) : [];

  return (
    <div className="w-full h-full overflow-hidden">
      <Chat conversations={conversations} initialData={initialData} />
    </div>
  );
};

export default ChatPage;
