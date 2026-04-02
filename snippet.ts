import { FixPixivAPI, FixTweetAPITweet, Message } from "types";

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
export const pixivStatus = (pixiv: FixPixivAPI) =>
  `${pixiv.comment_count} 💬 \t ${pixiv.bookmark_count} 💾 \t ${pixiv.like_count} 💖 \t ${pixiv.view_count} 👁️ \t ${pixiv.ai_generated ? "🤖" : ""}`;
export const snsUser = (name: string, id?: string, note?: string) =>
  `> ${name}${id ? ` (@${id}${!note ? "" : `, ${note}`})` : ""}`;
export const link = (name: string, href: string, noPreview = false) =>
  `[${name}](${noPreview ? offLink(href) : href})`;
export const code = (content: string) => "`" + content + "`";
export const bold = (content: string) => "**" + content + "**";
