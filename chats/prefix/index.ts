import { writeFileSync } from "fs";
import { PREFIX } from "../../constants";
import { ChatFunction } from "../../types";
import { createBBSDoc, createBBSPost, getBBS } from "./admin/getBBS";

const chat: ChatFunction = async ({ message, guild }) => {
  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();
    switch (command) {
      case "channel": {
        if (message.author.id === guild.ownerId) {
          const bbs = getBBS(guild);
          writeFileSync("./channels.log", JSON.stringify(bbs, null, 2), {
            encoding: "utf8",
          });
          writeFileSync("./channels.ignore.md", createBBSDoc(guild), {
            encoding: "utf8",
          });
          writeFileSync("./channels.ignore.txt", createBBSPost(guild), {
            encoding: "utf8",
          });
          message.reply("内部のチャンネル情報を更新したぞ");
        }
        break;
      }
      case "help": {
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
  }
};

export default chat;
