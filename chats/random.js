//@ts-check
import {
  HMM_REGEX,
  IRUKA_REGEX,
  MUR_REGEX,
  NO_COMMENT,
  UHOS,
  UHO_REGEX,
} from "../constants.js";
import { shuffleWord, useMessage } from "../utils.js";
/** @typedef {import("../type.d.ts").ChatFunction} ChatFunction */

/** @type {ChatFunction} */
export default async ({ message }) => {
  const { reply, instantPost } = useMessage(message);

  // 便乗
  if (MUR_REGEX.test(message.content.split(/\n/g).at(-1) ?? "")) {
    await reply(
      shuffleWord([
        "そうだよ（便乗）",
        "そうだよ（便乗）",
        "そうだよ²（二乗）",
        "ソーダよ（炭酸）",
        "そうだ！（ひらめき）",
        "そう・・・かなぁ？（疑問）",
        "違うなぁ（否定）",
      ])
    );
  }

  // どうした？
  if (HMM_REGEX.test(message.content)) {
    await reply(
      shuffleWord([
        "どうした？",
        "どしたん？",
        "どした？",
        "話きこか？",
        "なんかあった？",
        "ほう？",
      ])
    );
  }

  // 単発系
  instantPost("ほう", ["ほう"]);
  instantPost("ふむ", ["ふむ"]);
  instantPost("なるほど", ["なるほど？"]);
  instantPost("おぱんつ", ["大好き丸だぁ・・・", "ギャルのパンティおくれ！"]);
  instantPost("レターパックで現金送れ", ["はすべて詐欺です"]);
  instantPost("やらないか", [
    "アッー！",
    "アッーーー！",
    `うほっ、いい<@${message.author.id}>・・・`,
  ]);

  // ゴリラ語
  if (message.content === "ウホッ") {
    await reply(`いい<@${message.author.id}>・・・`);
  } else if (UHO_REGEX.test(message.content)) {
    await reply(
      Array.from(
        { length: (Math.random() * 10) | 0 },
        () => UHOS[Math.floor(Math.random() * UHOS.length)]
      ).join("") || NO_COMMENT
    );
  }

  // イルカ語
  if (IRUKA_REGEX.test(message.content))
    return await reply(
      shuffleWord([
        "🐬 ＜ ・・・。",
        "🐬 ＜ お、やんのか？",
        "🐬 ＜ 俺がお前を消してやってもいいんだぜ",
      ])
    );
};
