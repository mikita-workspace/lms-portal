import { Metadata } from 'next';

import { Chat } from './_components/chat';

export const metadata: Metadata = {
  title: 'Chat AI',
  description: 'LMS Portal for educational purposes',
};

const ChatPage = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <Chat />
    </div>
  );
};

export default ChatPage;
