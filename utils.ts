import axios from "axios";
import fs from "fs";
import {
  NO_COMMENT,
  TWEET_IS_ERROR,
  TWEET_IS_NSFW,
  TWT_DOMAIN_RAGEX,
  URl_REGEX,
} from "./constants";
import { FixTweetAPI, FixTweetAPITweet, Message } from "./types";

export const shuffleWord = (arr: string[]) => {
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

export const useMessage = (messageObj: Message) => {
  const reply = async (mes: string) => messageObj.reply(mes || NO_COMMENT);
  const post = async (mes: string | string[]) =>
    messageObj.channel.send(
      typeof mes === "string" ? mes : mes.join("\n") || NO_COMMENT
    );
  const instantPost = async (mes: string, replies: string[]) =>
    messageObj.content === mes && (await reply(shuffleWord(replies)));
  return { reply, post, instantPost };
};

export const useTweet = async (
  url: string
): Promise<FixTweetAPITweet | typeof TWEET_IS_ERROR | typeof TWEET_IS_NSFW> => {
  const res: FixTweetAPI | typeof TWEET_IS_ERROR | typeof TWEET_IS_NSFW =
    await (async () => {
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

export const tryit = async <T>(
  fn: () => Promise<T>,
  err: (e: any) => void = () => {}
): Promise<T | null> => {
  try {
    return await fn();
  } catch (e) {
    err(e);
    return null;
  }
};

export const textToUrls = (text: string): string[] =>
  Array.from(text.matchAll(new RegExp(URl_REGEX, "g")), (match) => match[0]);

export const exportLog = (name: string, obj: object) =>
  fs.writeFileSync(`${name}.log`, JSON.stringify(obj, null, 2));
