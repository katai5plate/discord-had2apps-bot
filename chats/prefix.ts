import { PREFIX } from "../constants";
import { ChatFunction } from "../types";

const chat: ChatFunction = async ({ message }) => {
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

export default chat;
