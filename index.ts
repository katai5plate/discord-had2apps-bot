import fs from "fs";
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
  PRIVATE_VALUES_LOCATIONS,
} from "./constants";
// import * as db from "./db";
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
    // db.init();

    if (PRIVATE_VALUES_LOCATIONS.length > 0) {
      const raws = await Promise.all(
        PRIVATE_VALUES_LOCATIONS.map(async (loc) => {
          const { message } = await getFromMessageUri(client, loc);
          const raw = message.content.match(/```(?:\w+\n)?([\s\S]+?)```/)?.[1];
          if (!raw) {
            console.error("設定値が不正", loc, message.content);
            throw new Error("設定値が不正");
          }
          try {
            return JSON.parse(raw.trim()) as Record<string, unknown>;
          } catch (e) {
            console.error(e, loc, message.content);
            throw new Error("JSONが不正");
          }
        }),
      );

      fs.writeFileSync(
        "./private-values-raws.log",
        JSON.stringify(raws, null, 2),
      );

      const merged: Record<string, unknown> = {};
      for (const obj of raws) {
        for (const [rawKey, value] of Object.entries(obj)) {
          const key = rawKey.split("+")[0];
          const existing = merged[key];
          if (Array.isArray(existing) && Array.isArray(value)) {
            merged[key] = [...existing, ...value];
          } else if (
            existing !== null &&
            typeof existing === "object" &&
            !Array.isArray(existing) &&
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
          ) {
            merged[key] = { ...existing, ...(value as object) };
          } else {
            merged[key] = value;
          }
        }
      }

      const users = merged["USERS"] as Record<string, string> | undefined;
      const resolveAlias = (v: string): string => {
        if (!v.startsWith("@")) return v;
        const alias = v.slice(1);
        const id = Object.entries(users ?? {}).find(
          ([, name]) => name === alias,
        )?.[0];
        if (!id) console.warn(`USERS に "${alias}" が見つかりません`);
        return id ?? v;
      };
      const resolveAliasesDeep = (value: unknown): unknown => {
        if (typeof value === "string") return resolveAlias(value);
        if (Array.isArray(value)) return value.map(resolveAliasesDeep);
        if (value !== null && typeof value === "object")
          return Object.fromEntries(
            Object.entries(value as object).map(([k, v]) => [
              resolveAlias(k),
              resolveAliasesDeep(v),
            ]),
          );
        return value;
      };

      privateValues = Object.fromEntries(
        Object.entries(merged).map(([k, v]) =>
          k === "USERS" ? [k, v] : [k, resolveAliasesDeep(v)],
        ),
      );

      console.log({ PRIVATE_VALUES_LOCATIONS, privateValues });
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

    // // ログ集計
    // await db.write(
    //   "messages",
    //   (mes) => [
    //     ...mes,
    //     {
    //       guildId: message.guild?.id,
    //       channelId: message.channel.id,
    //       authorId: message.author.id,
    //       createdAt: message.createdAt,
    //       size: message.content.length,
    //     },
    //   ],
    //   [],
    // );
  });

  client.login(DISCORD_BOT_TOKEN);
} catch (e) {
  console.log(e);
}
