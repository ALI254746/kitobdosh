import Pusher from "pusher";

const configured = ["PUSHER_APP_ID", "PUSHER_KEY", "PUSHER_SECRET", "PUSHER_CLUSTER"].every(key => process.env[key]);
export const pusherServer = configured ? new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
}) : { trigger: async () => { throw new Error("Pusher sozlanmagan"); } };
