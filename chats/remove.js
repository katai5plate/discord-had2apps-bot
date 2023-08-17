//@ts-check

import { DEL_REGEX } from "../constants.js";
import { useMessage } from "../utils.js";

export default async ({ message }) => {
  const { reply } = useMessage(message);

  try {
    const repliedId = message.reference?.messageId;
    if (repliedId && DEL_REGEX.test(message.content)) {
      const replied = await message.channel.messages.fetch(repliedId);
      if (replied.author.bot) {
        const originId = replied.reference?.messageId;
        if (originId) {
          const origin = await message.channel.messages.fetch(originId);
          if (origin.author.id === message.author.id) {
            await replied.delete();
          }
        }
      }
    }
  } catch (error) {
    await reply(
      `多分返信先のメッセージ消えてるから削除していいのかわからん。\nエラー: ${error.toString()}`
    );
  }
};
