//@ts-check
import { DEL_REGEX, POSTED_REGEX } from "../constants.js";
import { tryit, useMessage } from "../utils.js";
/** @typedef {import("../type.d.ts").ChatFunction} ChatFunction */

/** @type {ChatFunction} */
export default async ({ message }) => {
  const { reply } = useMessage(message);

  if (DEL_REGEX.test(message.content)) {
    const botMes = await tryit(() =>
      message.channel.messages.fetch(message.reference?.messageId ?? "")
    );
    // 返信先がボットの投稿
    if (botMes?.author.bot) {
      const deleteMes = async () => {
        await botMes.delete();
        await message.delete();
      };
      const callMes = await tryit(() =>
        message.channel.messages.fetch(botMes.reference?.messageId ?? "")
      );
      // ボットの返信先が同じユーザーなら削除
      if (callMes?.author?.id === message.author.id) return await deleteMes();
      // POSTED_REGEX と同じユーザーなら削除
      if (botMes.content.match(POSTED_REGEX)?.at(1) === message.author.id)
        return await deleteMes();
      return await reply(
        "消す権限があるのかどうかの判断材料がないから消せんわ・・・すまんな"
      );
    }
    if (botMes?.content.match(POSTED_REGEX)) return await reply("自演やめろ");
  }
};
