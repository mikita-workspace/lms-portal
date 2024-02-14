import { Chat } from './_components/chat';

// const delay = (delayInms) => {
//   return new Promise((resolve) => setTimeout(resolve, delayInms));
// };

const ChatPage = async () => {
  // await delay(5000);

  return (
    <div className="w-full h-full overflow-hidden">
      <Chat />
    </div>
  );
};

export default ChatPage;
