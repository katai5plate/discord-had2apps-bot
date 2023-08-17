//@ts-check

import { PREFIX } from "../constants.js";
import { useMessage } from "../utils.js";

export default async ({ message }) => {
  const { reply } = useMessage(message);

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();
    switch (command) {
      case "help":
        await message.channel.send({
          embeds: [
            {
              title: "ヘルプ",
              description: "なにもないよ",
              fields: [
                {
                  name: "ヘルプ",
                  value: "`help`",
                },
              ],
            },
          ],
        });
        break;
    }
  }
};
