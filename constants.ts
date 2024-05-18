import fs from "fs";
import { EnvJSON } from "./types";

export const DB_PATH = "./db.json";

const ENV_JSON: Partial<EnvJSON> = (() => {
  try {
    return JSON.parse(fs.readFileSync("./env.json", { encoding: "utf8" }));
  } catch {
    console.log("env.json is not found");
    return {};
  }
})();
const ENV = {
  ...process.env,
  ...ENV_JSON,
};
export const DISCORD_BOT_TOKEN = ENV.DISCORD_BOT_TOKEN ?? "";
export const NO_REPLY_USERS_ID = (ENV.NO_REPLY_USERS_ID_COMMA ?? "").split(
  /,/g
);
export const MISSKEY_API_TOKENS = {
  io: ENV.MISSKEY_IO_API_TOKEN ?? "",
  gamelore: ENV.MISSKEY_GAMELORE_API_TOKEN ?? "",
};
export const EXPAND_BOT_USER_ID = ENV.EXPAND_BOT_USER_ID;

export const PLAYING_ON = "はど開発室";
export const PREFIX = "alxo?";

export const MAOU_REGEX = /魔王$/;
export const MIURA_REGEX =
  /.+(かな[ぁあ]?|かね[ぇえ]?|かよ[ぉお]?|すか|すね[ぇえ]?|だな[ぁあ]?|だね[ぇえ]?|だよ[ぉおねぇえ]?|やね[ぇえ]?|やな[ぁあ]?|よな[ぁあ]?|よね[ぇえ]?|るか[ぁあ]?|るな[ぁあ]?)([。！？ｗ・,…‥～ー])?$/u;
export const HMM_REGEX =
  /^(うーん|あれ[ー～？]?|あら(ま[ぁあ]?)?|あれまぁ?|変だな|おかしいな|なんか(変|おかしいな?))$/;
export const IRUKA_REGEX = /お(前|まえ)を(消|け)す/;
export const DELETE_REGEX =
  /^(削除|(消|け)して|やっぱ?なし|やめて?|なしで?|delete|kesite|yame)$/;
export const TWITTER_DOMAIN_RAGEX = /(twitter|x)\.com/;
export const TWITTER_REGEX = /^https:\/\/(twitter|x)\.com\/.+$/;
export const POSTED_REGEX = /\[POSTED BY <@(\d+?)>\]/;
export const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
export const MUNEATSU_REGEX = /胸(熱|が熱|が厚|が暑)|宗(篤|厚)/;

export const UHO_REGEX = /^[ウゥホッォオー～・！？。、…\n]+$/;
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
export const UHO_PALLETE = [
  ...UHO_BASIC,
  ...UHO_BASIC.map((x) => `${x}！`),
  ...UHO_BASIC.map((x) => `${x}？`),
];

export const NO_COMMENT = "・・・。";

export const TWEET_IS_ERROR = Symbol("TWEET_IS_ERROR");
export const TWEET_IS_NSFW = Symbol("TWEET_IS_NSFW");
export const TWEET_IS_PROFILE = Symbol("TWEET_IS_PROFILE");
export const TWEET_IS_TWEET = Symbol("TWEET_IS_TWEET");

// export const MISSKEY_HOSTS = [
//   {
//     host: "misskey.io",
//     token: MISSKEY_API_TOKENS.io,
//   },
//   {
//     host: "misskey.gamelore.fun",
//     token: MISSKEY_API_TOKENS.gamelore,
//   },
// ];
