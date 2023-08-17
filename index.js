//@ts-check
import express from "express";
import discord from "discord.js";
import * as db from "./db.js";
import {
  DISCORD_BOT_TOKEN,
  NO_REPLY_USERS_ID,
  PLAYING_ON,
} from "./constants.js";
import maou from "./chats/maou.js";
import random from "./chats/random.js";
import twitter from "./chats/twitter.js";
import remove from "./chats/remove.js";
import prefix from "./chats/prefix.js";
/** @typedef {import("./type.d.ts").Connect} Connect */

const app = express();
const client = new discord.Client({
  //@ts-ignore
  partials: Object.values(discord.Partials),
  //@ts-ignore
  intents: Object.values(discord.IntentsBitField.Flags),
});

try {
  app.get("/", (req, res) => {
    res.send("Bot is ONLINE!");
  });

  app.listen(3023, () => {});

  client.on("ready", async (message) => {
    console.log("Bot is running!");
    client.user?.setActivity(PLAYING_ON, {
      type: discord.ActivityType.Playing,
    });
    db.init();
  });

  client.on("messageCreate", async (message) => {
    if (message.author.id === client.user?.id || message.author.bot) return;

    /** @type {Connect} */
    const connect = { message, client };

    // メンション時のメッセージ
    if (client?.user && message.mentions.has(client.user)) {
      await maou(connect);
    }

    // 返信しないリストに入っていないユーザーの発言
    if (!NO_REPLY_USERS_ID.includes(message.author.id)) {
      await random(connect);
    }

    // 全ユーザー向け
    await twitter(connect);

    // 指示者と同じ人限定で bot の発言を消せる機能
    await remove(connect);

    // プレフィックスコマンド
    await prefix(connect);

    // ログ集計
    await db.write(
      "messages",
      (mes) => [
        ...mes,
        {
          guildId: message.guild?.id,
          channelId: message.channel.id,
          authorId: message.author.id,
          createdAt: message.createdAt,
          size: message.content.length,
        },
      ],
      []
    );
  });

  if (DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKEN is not defined!");
    process.exit(0);
  }

  client.login(DISCORD_BOT_TOKEN);
} catch (e) {
  console.log(e);
}
