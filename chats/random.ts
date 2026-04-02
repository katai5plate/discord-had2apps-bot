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
import text2png from "text2png";
import { AttachmentBuilder } from "discord.js";

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
      ]),
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
      ]),
    );
  }

  // text2png テスト
  if (message.content === "てすと１") {
    const longText = [
      "吾輩は猫である。名前はまだ無い。",
      "どこで生れたかとんと見当がつかぬ。",
      "何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。",
      "吾輩はここで始めて人間というものを見た。",
      "しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。",
      "この書生というのは時々我々を捕えて煮て食うという話である。",
      "しかし当時は何という考もなかったから別段恐しいとも思わなかった。",
      "ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。",
    ]
      .join("\n")
      .repeat(10);
    const buf = text2png(longText, {
      font: "24px sans-serif",
      color: "white",
      bgColor: "#2b2d31",
      padding: 16,
      lineSpacing: 8,
    });
    await message.channel.send({
      files: [new AttachmentBuilder(buf, { name: "test.png" })],
    });
    return;
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
    ]),
  );

  // 下の句（意味深）
  ["うほっ", "ウホッ"].forEach((mes) =>
    instantPost(mes, [
      "いい男・・・",
      "やらないか",
      "アッー！",
      "あぁ＾～",
      `いい<@${message.author.id}>・・・`,
    ]),
  );

  // ゴリラ語
  if (
    UHO_REGEX.test(message.content) &&
    !["うほっ", "ウホッ"].includes(message.content)
  ) {
    await reply(
      Array.from(
        { length: (Math.random() * 10) | 0 },
        () => UHO_PALLETE[Math.floor(Math.random() * UHO_PALLETE.length)],
      ).join("") || NO_COMMENT,
    );
  }

  // 下の句２（迫真）
  ["すごく", "すごく・・・", "すごく…", "凄く", "凄く・・・", "凄く…"].forEach(
    (mes) => instantPost(mes, ["大きいです・・・"]),
  );
  ["ああ＾～", "あぁ＾～", "あ＾～", "ああ～", "あぁ～"].forEach((mes) =>
    instantPost(mes, [
      "いいっすね～",
      "たまらねえぜ",
      "心がぴょんぴょんするんじゃぁ＾～",
    ]),
  );

  // イルカ語
  if (IRUKA_REGEX.test(message.content))
    return await reply(
      shuffleWord([
        "🐬 ＜ ・・・。",
        "🐬 ＜ お、やんのか？",
        "🐬 ＜ 俺がお前を消してやってもいいんだぜ",
      ]),
    );

  // 胸が熱くなる
  if (MUNEATSU_REGEX.test(message.content))
    return await reply(shuffleWord(["これは胸熱！", "胸熱！", "胸熱"]));
};

export default chat;
