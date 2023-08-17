//@ts-check
import axios from "axios";
import { TWT_REGEX } from "../constants.js";
import { useMessage, useTweet } from "../utils.js";
/** @typedef {import("../type.d.ts").ChatFunction} ChatFunction */

/** @type {ChatFunction} */
export default async ({ message }) => {
  const { reply, post } = useMessage(message);

  if (TWT_REGEX.test(message.content)) {
    const tweet = await useTweet(message.content);
    if (!tweet) return await reply("ツイートが取得できなかったよ");
    let result = "";
    if (tweet.media.all?.length === 1) {
      result = tweet.media.all.at(0)?.url ?? "";
    } else {
      result = `${(
        tweet.media.all?.map(
          ({ url }, i) => `${i + 1} ${i === 0 ? url : `<${url}>`}`
        ) ?? []
      ).join("\n")}`;
    }
    await post(
      `||[POSTED BY <@${message.author.id}>]||\n元ツイ: <${tweet.url}>\n${result}`
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
