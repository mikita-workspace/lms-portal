import { Metadata } from 'next';

import { ChatAi } from './_components/chat-ai';

export const metadata: Metadata = {
  title: 'Chat AI',
  description: 'LMS Portal for educational purposes',
};

const ChatPage = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <ChatAi />
    </div>
  );
};

export default ChatPage;
