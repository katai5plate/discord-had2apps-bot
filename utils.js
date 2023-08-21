//@ts-check
import axios from "axios";
import fs from "fs";
import {
  NO_COMMENT,
  TWEET_IS_ERROR,
  TWEET_IS_NSFW,
  TWT_DOMAIN_RAGEX,
  URl_REGEX,
} from "./constants.js";
/** @typedef {import("./type").Message} Message */
/** @typedef {import("./type").FixTweetAPI} FixTweetAPI */
/** @typedef {import("./type").FixTweetAPITweet} FixTweetAPITweet */

/** @param {string[]} arr */
export const shuffleWord = (arr) => {
  let cumulativeWeight = 0;
  return (
    arr.find((_, i) => {
      cumulativeWeight += 1 / Math.pow(2, i);
      return (
        Math.random() *
          arr.reduce((acc, _, i) => acc + 1 / Math.pow(2, i), 0) <=
        cumulativeWeight
      );
    }) ?? ""
  );
};

/** @param {Message} messageObj */
export const useMessage = (messageObj) => {
  /** @param {string} mes */
  const reply = async (mes) => messageObj.reply(mes || NO_COMMENT);
  /** @param {string} mes */
  const post = async (mes) => messageObj.channel.send(mes || NO_COMMENT);
  /**
   * @param {string} mes
   * @param {string[]} replies
   */
  const instantPost = async (mes, replies) =>
    messageObj.content === mes && (await reply(shuffleWord(replies)));
  return { reply, post, instantPost };
};

/**
 * @param {string} url
 * @returns {Promise<FixTweetAPITweet | typeof TWEET_IS_ERROR |typeof TWEET_IS_NSFW>}
 */
export const useTweet = async (url) => {
  /** @type {FixTweetAPI | typeof TWEET_IS_ERROR |typeof TWEET_IS_NSFW} */
  const res = await (async () => {
    try {
      return await axios
        .get(url.replace(TWT_DOMAIN_RAGEX, "api.fxtwitter.com"))
        .then(({ data }) => data);
    } catch (error) {
      // なぜかこれでないと取れない
      const status = JSON.parse(JSON.stringify(error)).status;
      if (status === 500) return TWEET_IS_NSFW;
      return TWEET_IS_ERROR;
    }
  })();
  if (!res) return TWEET_IS_ERROR;
  if (res === TWEET_IS_ERROR) return TWEET_IS_ERROR;
  if (res === TWEET_IS_NSFW) return TWEET_IS_NSFW;
  return res?.tweet ?? TWEET_IS_ERROR;
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

/**
 * @param {string} text
 * @returns {string[]}
 */
export const textToUrls = (text) =>
  Array.from(text.matchAll(new RegExp(URl_REGEX, "g")), (match) => match[0]);

export const exportLog = (name, obj) =>
  fs.writeFileSync(`${name}.log`, JSON.stringify(obj, null, 2));
