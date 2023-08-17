//@ts-check

import { NO_COMMENT } from "./constants.js";

export const shuffleWord = (arr) => {
  let cumulativeWeight = 0;
  return arr.find((_, i) => {
    cumulativeWeight += 1 / Math.pow(2, i);
    return (
      Math.random() * arr.reduce((acc, _, i) => acc + 1 / Math.pow(2, i), 0) <=
      cumulativeWeight
    );
  });
};

export const useMessage = (messageObj) => {
  const reply = async (mes) => messageObj.reply(mes || NO_COMMENT);
  const instantPost = async (mes, replies) =>
    messageObj.content === mes && (await reply(shuffleWord(replies)));
  return { reply, instantPost };
};
