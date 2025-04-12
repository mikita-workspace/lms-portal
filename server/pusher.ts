import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  useTLS: true,
});
