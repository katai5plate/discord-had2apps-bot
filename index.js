const express = require("express");
const discord = require("discord.js");
const app = express();
const client = new discord.Client({
  partials: Object.values(discord.Partials),
  intents: Object.values(discord.IntentsBitField.Flags),
});
const { default: axios } = require("axios");

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
const UHO_REGEX = /^[ウゥホッォオー～・！？。、…\n]+$/;
const UHO_BASIC = [
  "ウホ",
  "ウホホ",
  "ウッホ",
  "ウホッ",
  "ウホウ",
  "ホッ",
  "ウッホォ",
  "ウオゥ",
];
const UHOS = [
  ...UHO_BASIC,
  ...UHO_BASIC.map((x) => `${x}！`),
  ...UHO_BASIC.map((x) => `${x}？`),
];
const NO_COMMENT = "・・・。";

const shuffleWord = (arr) => {
  let cumulativeWeight = 0;
  return arr.find((_, i) => {
    cumulativeWeight += 1 / Math.pow(2, i);
    return (
      Math.random() * arr.reduce((acc, _, i) => acc + 1 / Math.pow(2, i), 0) <=
      cumulativeWeight
    );
  });
};

try {
  app.get("/", (req, res) => {
    res.send("Bot is ONLINE!");
  });

  app.listen(3023, () => {});

  client.on("ready", (message) => {
    console.log("Bot is running!");
    client.user.setActivity(PLAYING_ON, {
      type: discord.ActivityType.Playing,
    });
  });

  client.on("messageCreate", async (message) => {
    const reply = async (mes) => message.reply(mes || NO_COMMENT);
    const instantPost = async (mes, replies) =>
      message.content === mes && (await reply(shuffleWord(replies)));

    if (message.author.id == client.user.id || message.author.bot) return;

    // メンション時のメッセージ
    if (message.mentions.has(client.user)) {
      if (/魔王$/.test(message.content)) await reply(shuffleWord(["把握"]));
    }
    // 返信しないリストに入っていないユーザーの発言
    if (!NO_REPLY_USERS_ID.includes(message.author.id)) {
      // 便乗
      if (MUR_REGEX.test(message.content.split(/\n/g).at(-1))) {
        await reply(
          shuffleWord([
            "そうだよ（便乗）",
            "そうだよ（便乗）",
            "そうだよ²（二乗）",
            "ソーダよ（炭酸）",
            "そうだ！（ひらめき）",
            "そう・・・かなぁ？（疑問）",
            "違うなぁ（否定）",
          ])
        );
      }
      // どうした？
      if (HMM_REGEX.test(message.content)) {
        await reply(
          shuffleWord([
            "どうした？",
            "どしたん？",
            "どした？",
            "話きこか？",
            "なんかあった？",
            "ほう？",
          ])
        );
      }
      // 単発系
      instantPost("ほう", ["ほう"]);
      instantPost("ふむ", ["ふむ"]);
      instantPost("なるほど", ["なるほど？"]);
      instantPost("おぱんつ", [
        "大好き丸だぁ・・・",
        "ギャルのパンティおくれ！",
      ]);
      instantPost("レターパックで現金送れ", ["はすべて詐欺です"]);
      instantPost("やらないか", [
        "アッー！",
        "アッーーー！",
        `うほっ、いい<@${message.author.id}>・・・`,
      ]);
      // ゴリラ語
      if (message.content === "ウホッ") {
        await reply(`いい<@${message.author.id}>・・・`);
      } else if (UHO_REGEX.test(message.content)) {
        await reply(
          Array.from(
            { length: (Math.random() * 10) | 0 },
            () => UHOS[Math.floor(Math.random() * UHOS.length)]
          ).join("") || NO_COMMENT
        );
      }
    }
    // 全ユーザー向け
    if (/^https:\/\/(twitter|x)\.com\/.+$/.test(message.content)) {
      const url = message.content;
      try {
        const fix = url.replace(/(twitter|x)\.com/, "fxtwitter.com");
        await reply(fix);
      } catch (error) {
        await reply(`エラー: ${error.toString()}`);
      }
    }
    if (/^ex https:\/\/(twitter|x)\.com\/.+$/.test(message.content)) {
      const url = message.content;
      try {
        const api = url
          .match(/^ex (.+?)$/)
          .at(1)
          .replace(/(twitter|x)\.com/, "api.fxtwitter.com");
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
