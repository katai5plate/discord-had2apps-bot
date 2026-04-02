import { ChatFunction } from "../types";
import { shuffleWord } from "../utils";

const CHEER_NORMAL = [
  "大丈夫！皆ちゃんと頑張ってる所、見てるよ！",
  "焦らなくていいから、自分のペースで頑張って！",
  "頑張っててえらい！諦めずに前に進んでいこう！",
  "ここまで来たんだから、きっと大丈夫！",
  "小さな一歩でも、一歩ずつ踏みしめていけば大丈夫！",
  "その調子その調子！焦らず一歩一歩ね！",
];

const CHEER_MORE = [
  "今は先が見えなくても、いつか必ず「あのときがあったから」って思える日が来るよ！",
  "しんどくても、一人じゃないよ！ここにみんないるから！",
  "うまくいかなくたって、頑張ってきた事実は消えないから！",
  "もう十分頑張ってるよ！本当にえらいよ！だから挫けないで！",
  "やろうとしてる気持ち、ちゃんと伝わってるよ！",
  "完璧じゃなくていいんだ。今できることをやろう！",
];

const THANKS = ["こちらこそ！", "なんのその！", "そいつはよかった！"];

const CHEER_TRIGGERS = [
  "応援して",
  "応援して！",
  "挫けそう",
  "つらい",
  "つらみ",
  "疲れた",
  "もうやだ",
  "病み",
];

const isCheerTrigger = (content: string) =>
  CHEER_TRIGGERS.some((t) => content.includes(t));

const chat: ChatFunction = async ({ message, client }) => {
  const isMention = client.user != null && message.mentions.has(client.user);

  // ボットへの返信
  if (message.reference?.messageId) {
    const referenced = await message.channel.messages.fetch(
      message.reference.messageId,
    );
    if (referenced.author.id === client.user?.id) {
      if (message.content.includes("もっと応援して")) {
        await message.reply(shuffleWord(CHEER_MORE));
        return;
      }
      if (isCheerTrigger(message.content)) {
        await message.reply(shuffleWord([...CHEER_NORMAL, ...CHEER_MORE]));
        return;
      }
      if (message.content.includes("ありがとう")) {
        await message.reply(shuffleWord(THANKS));
        return;
      }
    }
  }

  // メンション
  if (isMention && isCheerTrigger(message.content)) {
    await message.reply(shuffleWord(CHEER_NORMAL));
  }
};

export default chat;
