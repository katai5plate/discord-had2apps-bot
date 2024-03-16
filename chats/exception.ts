import { ChatFunction } from "../types";
import { useMessage } from "../utils";

const chat: ChatFunction = async ({ message, error }) => {
  const { reply } = useMessage(message);

  await reply(`問題が発生したよ。${error?.name}: ${error?.message}`);
  console.log(error?.stack);
};

export default chat;
