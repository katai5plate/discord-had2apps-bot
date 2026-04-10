import { ChatFunction } from "../types";
import { useMessage } from "../utils";

const chat: ChatFunction = async ({ message, error }) => {
  console.log("EXCEPTION AT", new Date().toLocaleString());
  if (message.system) {
    console.log("システムメッセージエラー揉み消し:", message.content);
    return;
  }
  const { reply, post } = useMessage(message);

  try {
    const content = `問題が発生したよ。${error?.name}: ${error?.message}`;
    await reply(content);
  } catch {
    const content = `問題が発生したよ。${error?.name}: ${error?.message}\nあとリプライにも失敗したよ。`;
    await post(content);
  }
  console.log(error?.stack);
};

export default chat;
