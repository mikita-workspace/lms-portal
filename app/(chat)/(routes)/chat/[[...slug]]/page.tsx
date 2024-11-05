import { getChatConversations } from '@/actions/chat/get-chat-conversations';
import { getChatInitial } from '@/actions/chat/get-chat-initial';

import { Chat } from './_components/chat';

const ChatPage = async () => {
  const initialData = await getChatInitial();
  const conversations = await getChatConversations();

  return (
    <div className="w-full h-full overflow-hidden">
      <Chat conversations={conversations} initialData={initialData} />
    </div>
  );
};

export default ChatPage;
