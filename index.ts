import discord, { GatewayIntentBits, Partials } from "discord.js";
import express from "express";
import cc from "./chats/cc";
import exception from "./chats/exception";
import maou from "./chats/maou";
import pixiv from "./chats/pixiv";
import prefix from "./chats/prefix";
import random from "./chats/random";
import remove from "./chats/remove";
import shop from "./chats/shop";
import shuzo from "./chats/shuzo";
import twitter from "./chats/twitter";
import {
  DISCORD_BOT_TOKEN,
  GUILD_ID,
  PLAYING_ON,
  PRIVATE_VALUES_LOCATION,
} from "./constants";
import * as db from "./db";
import { Connect, PrivateValues } from "./types";
import { getFromMessageUri } from "./utils";

const app = express();
const client = new discord.Client({
  partials: Object.values(discord.Partials) as Partials[],
  intents: Object.values(discord.IntentsBitField.Flags) as GatewayIntentBits[],
});

let privateValues: PrivateValues = {};

try {
  if (DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKEN is not defined!");
    process.exit(0);
  }

  app.get("/", (_, res) => {
    res.send("Bot is ONLINE!");
  });

  app.listen(3023, () => {});

  client.on("ready", async (_) => {
    console.log("Bot is running!\n");
    client.user?.setActivity(PLAYING_ON, {
      type: discord.ActivityType.Playing,
    });
    db.init();

    if (PRIVATE_VALUES_LOCATION) {
      const { message } = await getFromMessageUri(
        client,
        PRIVATE_VALUES_LOCATION,
      );
      const raw = message.content.match(/```(?:\w+\n)?([\s\S]+?)```/)?.[1];
      if (!raw) {
        console.error("設定値が不正", PRIVATE_VALUES_LOCATION, message.content);
        throw new Error("設定値が不正");
      }
      try {
        privateValues = JSON.parse(raw.trim());
      } catch (e) {
        console.error(e, PRIVATE_VALUES_LOCATION, message.content);
        throw new Error("JSONが不正");
      }
      console.log({
        PRIVATE_VALUES_LOCATION,
        privateValues,
      });
    }
  });

  client.on("messageCreate", async (message) => {
    if (message.author.id === client.user?.id || message.author.bot) return;

    const connect: Connect = {
      message,
      client,
      guild: client.guilds.cache.get(GUILD_ID) as discord.Guild,
    };

    try {
      // メンション時のメッセージ
      if (client?.user && message.mentions.has(client.user)) {
        await maou(connect, privateValues);
      }
      // 返信しないリストに入っていないユーザーの発言
      if (
        !privateValues.NO_REPLY_USER_IDS?.find((id) => id === message.author.id)
      ) {
        await random(connect, privateValues);
      }
      // 全ユーザー向け ------------
      // Twitter 展開
      await twitter(connect, privateValues);
      // Pixiv 展開
      await pixiv(connect, privateValues);
      // アフィリンク
      await shop(connect, privateValues);
      // POSTED BY への返信
      await cc(connect, privateValues);
      // 松岡修造
      await shuzo(connect, privateValues);
      // 指示者と同じ人限定で bot の発言を消せる機能
      await remove(connect, privateValues);
      // プレフィックスコマンド
      await prefix(connect, privateValues);
    } catch (e) {
      await exception({ ...connect, error: e as Error }, privateValues);
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
      [],
    );
  });

  client.login(DISCORD_BOT_TOKEN);
} catch (e) {
  console.log(e);
}
