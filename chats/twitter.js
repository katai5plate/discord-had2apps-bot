//@ts-check
import axios from "axios";
import {
  TWEET_IS_ERROR,
  TWEET_IS_NSFW,
  TWT_DOMAIN_RAGEX,
  TWT_REGEX,
} from "../constants.js";
import { useMessage, useTweet } from "../utils.js";
/** @typedef {import("../type.d.ts").FixTweetAPITweet} FixTweetAPITweet */
/** @typedef {import("../type.d.ts").ChatFunction} ChatFunction */

/** @type {ChatFunction} */
export default async ({ message }) => {
  const { post } = useMessage(message);

  if (TWT_REGEX.test(message.content)) {
    const tweet = await useTweet(message.content);

    if (tweet === TWEET_IS_ERROR) return message.react("❌");
    if (tweet === TWEET_IS_NSFW) {
      const nsfwPost = await post(
        [
          `[POSTED BY <@${message.author.id}>]`,
          message.content
            .replace(TWT_DOMAIN_RAGEX, "twitter.com")
            .replace(/\?.+$/, ""),
        ].join("\n")
      );
      await message.delete();
      return await nsfwPost.react("🔞");
    }

    /** @type {string[]} */
    const texts = [tweet.text];
    /** @type {string[]} */
    const previews = [];
    const { quote, views } = tweet;
    const { all, mosaic } = tweet.media ?? {};

    /** @param {FixTweetAPITweet["author"]} author */
    const getAuthor = (author) => `> ${author.name} (@${author.screen_name})`;

    /** @param {FixTweetAPITweet["media"]["all"]} all */
    const getPreviews = (all) => {
      /** @type {string[]} */
      const results = [];
      if (all) {
        // メディアは１つ以下
        if (all.length <= 1) {
          results.push(all.at(0)?.url ?? "");
        }
        // メディアはそれ以上
        else if (all.length > 1) {
          // モザイクプレビューがあるならモザイク＋リンクのみ
          if (mosaic) {
            results.push(`${mosaic.formats.webp ?? mosaic.formats.jpeg}`);
            for (const i in all) {
              const { url } = all[i];
              results.push(`${+i + 1} <${url}>`);
            }
          }
          // モザイクプレビューがないなら１枚目だけ表示
          else {
            for (const i in all) {
              const { url } = all[i];
              results.push(
                `${+i + 1} ${+i === 0 ? `${url} (表示)` : `<${url}>`}`
              );
            }
          }
        }
      }
      return results;
    };

    // メディアがある
    for (const mainPreview of getPreviews(all)) {
      previews.push(mainPreview);
    }

    // 引用がある
    if (quote) {
      const lines = quote.text.split(/\n/g);
      texts.push(`| ${getAuthor(quote.author)}`);
      for (const i in lines) {
        const text = lines[i];
        texts.push(`| ${text}`);
      }
      const quoteAll = quote.media.all;
      if (quoteAll) {
        previews.push("引用:");
        for (const quotePreview of getPreviews(quoteAll)) {
          previews.push(quotePreview);
        }
      }
    }

    await post(
      [
        `[POSTED BY <@${message.author.id}>]`,
        `<${tweet.url}> \`\`\``,
        getAuthor(tweet.author),
        ...texts,
        `${tweet.replies} 💬 \t ${tweet.retweets} 🔁 \t ${tweet.likes} 💖 \t ${
          views ? `${views} 👁️` : ""
        }`,
        `\`\`\``,
        ...previews,
      ].join("\n")
    );
    await message.delete();
  }
};

// await reply({
//   embeds: [
//     {
//       title: tweet.author.name,
//       url: tweet.url,
//       author: {
//         name: `@${tweet.author.screen_name}`,
//         icon_url: tweet.author.avatar_url,
//         url: `https://twitter.com/${tweet.author.screen_name}`,
//       },
//       description: tweet.text,
//       footer: {
//         text: `${tweet.replies} 💬 \t ${tweet.retweets} 🔁 \t ${tweet.likes} ❤️ \t ${tweet.views} 👁️\n`,
//       },
//     },
//     ...media.map(({ url }, index) => ({
//       description: index + 1,
//       image: {
//         url,
//       },
//     })),
//   ],
// });
