//@ts-check
import axios from "axios";
import { NO_COMMENT } from "./constants.js";
/** @typedef {import("./type.d.ts").FixTweetAPI} FixTweetAPI */
/** @typedef {import("./type.d.ts").FixTweetAPITweet} FixTweetAPITweet */

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
  const post = async (mes) => messageObj.channel.send(mes || NO_COMMENT);
  const instantPost = async (mes, replies) =>
    messageObj.content === mes && (await reply(shuffleWord(replies)));
  return { reply, post, instantPost };
};

/**
 * @param {string} url
 * @returns {Promise<FixTweetAPITweet | null>}
 */
export const useTweet = async (url) => {
  /** @type {FixTweetAPI} */
  const res = (
    await axios.get(url.replace(/(twitter|x)\.com/, "api.fxtwitter.com"))
  ).data;
  return res.tweet ?? null;
};

/**
 * @template T
 * @param {() => Promise<T>} fn
 * @param {(e: any) => void} err
 * @returns {Promise<T | null>}
 */
export const tryit = async (fn, err = () => {}) => {
  try {
    return await fn();
  } catch (e) {
    err(e);
    return null;
  }
};
