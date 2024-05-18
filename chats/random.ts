import {
  HMM_REGEX,
  IRUKA_REGEX,
  MUNEATSU_REGEX,
  MIURA_REGEX,
  NO_COMMENT,
  UHO_PALLETE,
  UHO_REGEX,
} from "../constants";
import { ChatFunction } from "../types";
import { shuffleWord, useMessage } from "../utils";

const chat: ChatFunction = async ({ message }) => {
  const { reply, instantPost } = useMessage(message);

  // 便乗
  if (MIURA_REGEX.test(message.content.split(/\n/g).at(-1) ?? "")) {
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
  [
    "やるぞ！",
    "やるか！",
    "頑張るぞ",
    "頑張るぞ！",
    "やってやる！",
    "やってやるぞ",
  ].forEach((mes) =>
    instantPost(mes, [
      "やったれ！",
      "やろうぜ！",
      "やろう！",
      "やれ！",
      "お前ならできる！",
    ])
  );

  // ゴリラ語
  if (message.content === "ウホッ") {
    await reply(`いい<@${message.author.id}>・・・`);
  } else if (UHO_REGEX.test(message.content)) {
    await reply(
      Array.from(
        { length: (Math.random() * 10) | 0 },
        () => UHO_PALLETE[Math.floor(Math.random() * UHO_PALLETE.length)]
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

  // 胸が熱くなる
  if (MUNEATSU_REGEX.test(message.content))
    return await reply(shuffleWord(["これは胸熱！", "胸熱！", "胸熱"]));
};

export default chat;
