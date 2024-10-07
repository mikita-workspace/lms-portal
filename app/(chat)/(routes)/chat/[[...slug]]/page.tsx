import { getChatInitial } from '@/actions/chat/get-chat-initial';

import { Chat } from './_components/chat';

const ChatPage = async () => {
  const initialData = await getChatInitial();

  return (
    <div className="w-full h-full overflow-hidden">
      <Chat initialData={initialData} />
    </div>
  );
};

export default ChatPage;
