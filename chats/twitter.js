//@ts-check

import axios from "axios";
import { TWT_REGEX } from "../constants.js";
import { useMessage } from "../utils.js";

/** @type {import("../type.d.ts").ChatFunction} */
export default async ({ message }) => {
  const { reply } = useMessage(message);

  if (TWT_REGEX("^").test(message.content)) {
    const url = message.content;
    try {
      const fix = url.replace(/(twitter|x)\.com/, "fxtwitter.com");
      await reply(fix);
    } catch (error) {
      await reply(`エラー: ${error.toString()}`);
    }
  }
  if (TWT_REGEX("^ex ").test(message.content)) {
    const url = message.content;
    try {
      const api = (url.match(/^ex (.+?)$/)?.at(1) ?? "").replace(
        /(twitter|x)\.com/,
        "api.fxtwitter.com"
      );
      const { tweet } = (await axios.get(api)).data;
      const media = tweet?.media?.all ?? [];
      await reply({
        embeds: [
          {
            title: tweet.author.name,
            url: tweet.url,
            author: {
              name: `@${tweet.author.screen_name}`,
              icon_url: tweet.author.avatar_url,
              url: `https://twitter.com/${tweet.author.screen_name}`,
            },
            description: tweet.text,
            footer: {
              text: `${tweet.replies} 💬 \t ${tweet.retweets} 🔁 \t ${tweet.likes} ❤️ \t ${tweet.views} 👁️\n`,
            },
          },
          ...media.map(({ url }, index) => ({
            description: index + 1,
            image: {
              url,
            },
          })),
        ],
      });
    } catch (error) {
      await reply(`エラー: ${error.toString()}`);
    }
  }
};
