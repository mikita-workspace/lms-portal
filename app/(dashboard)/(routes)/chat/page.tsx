import { Metadata } from 'next';

import { ChatBody } from './_components/chat-body';
import { ChatInput } from './_components/chat-input';

export const metadata: Metadata = {
  title: 'Chat AI',
  description: 'LMS Portal for educational purposes',
};

const ChatPage = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="flex h-full w-full">
        <div className="flex h-full w-full flex-col overflow-auto bg-background outline-none">
          <div className="flex h-full w-full flex-col justify-between">
            <ChatBody />
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
