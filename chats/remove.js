//@ts-check
import { DEL_REGEX } from "../constants.js";
import { tryit, useMessage } from "../utils.js";
/** @typedef {import("../type.d.ts").ChatFunction} ChatFunction */

/** @type {ChatFunction} */
export default async ({ message }) => {
  const { reply } = useMessage(message);

  if (DEL_REGEX.test(message.content)) {
    const botMes = await tryit(() =>
      message.channel.messages.fetch(message.reference?.messageId ?? "")
    );
    if (botMes?.author.bot) {
      const deleteMes = async () => {
        await botMes.delete();
        await message.delete();
      };
      const callMes = await tryit(() =>
        message.channel.messages.fetch(botMes.reference?.messageId ?? "")
      );
      if (callMes?.author?.id === message.author.id) return await deleteMes();
      const [, postedUser] =
        botMes.content.match(/\[POSTED BY <@(.*?)>\]/) ?? [];
      if (postedUser === message.author.id) return await deleteMes();
    }
    return await reply("消していいのか判断つかない・・・すまんな");
  }
};
