import { FixTweetAPITweet, Message } from "types";

export const postedBy = (author: Message["author"]) =>
  `[POSTED BY <@${author.id}>]`;
export const codeBlock = (content: string | string[]) =>
  "```\n" +
  (typeof content === "string" ? content : content.join("\n")) +
  "\n```";
export const offLink = (url: string) => `<${url}>`;
export const tweetStatus = (tweet: FixTweetAPITweet) =>
  `${tweet.replies} 💬 \t ${tweet.retweets} 🔁 \t ${tweet.likes} 💖 \t ${
    tweet.views ? `${tweet.views} 👁️` : ""
  }`;
export const snsUser = (name: string, id: string) => `> ${name} (@${id})`;
