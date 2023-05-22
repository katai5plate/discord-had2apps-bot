const express = require("express");
const discord = require("discord.js");
const app = express();
const client = new discord.Client({
  partials: Object.values(discord.Partials),
  intents: Object.values(discord.IntentsBitField.Flags),
});

const ENV_JSON = (() => {
  try {
    return require("./env.json");
  } catch {
    console.log("env.json is not found");
    return {};
  }
})();

const { DISCORD_BOT_TOKEN, NO_REPLY_USERS_ID_COMMA } = {
  ...process.env,
  ...ENV_JSON,
};
const NO_REPLY_USERS_ID = NO_REPLY_USERS_ID_COMMA.split(/,/g);

const PLAYING_ON = "はど開発室";
const PREFIX = "alxo?";

const MUR_REGEX =
  /.+(かな[ぁあ]?|かね[ぇえ]?|かよ[ぉお]?|すか|すね[ぇえ]?|だな[ぁあ]?|だね[ぇえ]?|だよ[ぉおねぇえ]?|やね[ぇえ]?|やな[ぁあ]?|よな[ぁあ]?|よね[ぇえ]?|るか[ぁあ]?|るな[ぁあ]?)([。！？ｗ・,…‥～ー])?$/u;
const HMM_REGEX =
  /^(うーん|あれ[ー～？]?|あら(ま[ぁあ]?)?|あれまぁ?|変だな|おかしいな|なんか(変|おかしいな?))$/;

const shuffleWord = (arr) => arr.at((Math.random() * arr.length) | 0);

try {
  app.get("/", (req, res) => {
    res.send("Bot is ONLINE!");
  });

  app.listen(3000, () => {});

  client.on("ready", (message) => {
    console.log("Bot is running!");
    client.user.setActivity(PLAYING_ON, {
      type: discord.ActivityType.Playing,
    });
  });

  client.on("messageCreate", async (message) => {
    if (message.author.id == client.user.id || message.author.bot) return;
    console.log({ message });
    // メンション時のメッセージ
    if (message.mentions.has(client.user)) {
      // await message.reply("うんち");
    }
    // 返信しないリストに入っていないユーザーの発言
    if (!NO_REPLY_USERS_ID.includes(message.author.id)) {
      // 便乗
      if (MUR_REGEX.test(message.content.split(/\n/g).at(-1))) {
        await message.reply(shuffleWord(["そうだよ（便乗）"]));
      }
      // どうした？
      if (HMM_REGEX.test(message.content)) {
        await message.reply(
          shuffleWord([
            "どうした？",
            "どしたん？",
            "話きこか？",
            "なんかあった？",
            "ほう？",
          ])
        );
      }
      // ほう
      if (message.content === "ほう") {
        await message.reply(shuffleWord(["ほう"]));
      }
    }
    // プレフィックスコマンド
    if (message.content.startsWith(PREFIX)) {
      const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
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
  });
  if (DISCORD_BOT_TOKEN == undefined) {
    console.log("DISCORD_BOT_TOKEN is not defined!");
    process.exit(0);
  }

  client.login(DISCORD_BOT_TOKEN);
} catch (e) {
  console.log(e);
}
