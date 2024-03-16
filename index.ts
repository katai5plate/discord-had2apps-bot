import express from "express";
import discord, { GatewayIntentBits, Partials } from "discord.js";
import * as db from "./db";
import { DISCORD_BOT_TOKEN, NO_REPLY_USERS_ID, PLAYING_ON } from "./constants";
import maou from "./chats/maou";
import random from "./chats/random";
import twitter from "./chats/twitter";
import remove from "./chats/remove";
import prefix from "./chats/prefix";
import exception from "./chats/exception";
import misskey from "./chats/misskey";
import { Connect } from "./types";

const app = express();
const client = new discord.Client({
  partials: Object.values(discord.Partials) as Partials[],
  intents: Object.values(discord.IntentsBitField.Flags) as GatewayIntentBits[],
});

try {
  app.get("/", (_, res) => {
    res.send("Bot is ONLINE!");
  });

  app.listen(3023, () => {});

  client.on("ready", async (_) => {
    console.log("Bot is running!");
    client.user?.setActivity(PLAYING_ON, {
      type: discord.ActivityType.Playing,
    });
    db.init();
  });

  client.on("messageCreate", async (message) => {
    if (message.author.id === client.user?.id || message.author.bot) return;

    const connect: Connect = { message, client };

    try {
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
      await misskey(connect);
      // 指示者と同じ人限定で bot の発言を消せる機能
      await remove(connect);
      // プレフィックスコマンド
      await prefix(connect);
    } catch (e) {
      await exception({ ...connect, error: e as Error });
    }

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
