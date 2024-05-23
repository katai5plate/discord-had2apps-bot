import discord from "discord.js";

export interface EnvJSON {
  GUILD_ID: string;
  DISCORD_BOT_TOKEN: string;
  NO_REPLY_USERS_ID_COMMA: string;
  // IGNORE_ANALYZE_CHANNEL_ID_COMMA: string;
  MISSKEY_IO_API_TOKEN: string;
  MISSKEY_GAMELORE_API_TOKEN: string;
  EXPAND_BOT_USER_ID: string;
}

export interface DatabaseJSON {
  messages: {
    guildId?: string;
    channelId: string;
    authorId: string;
    createdAt: Date;
    size: number;
  }[];
}

export type Message = discord.Message<boolean>;
export interface Connect {
  message: Message;
  client: discord.Client<boolean>;
  guild: discord.Guild;
  error?: Error | TypeError;
}
export type ChatFunction = (connect: Connect) => Promise<any>;

interface FixTweetAPIYouTube {
  type: "video";
  url: string;
  height: number;
  width: number;
  duration: number;
}
interface FixTweetAPIPhoto {
  type: "photo";
  url: string;
  width: number;
  height: number;
  altText?: string;
}
interface FixTweetAPIVideo {
  type: "video" | "gif";
  url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  format: "video/mp4";
}
interface FixTweetAPIMosaic {
  type: "mosaic_photo";
  width: number;
  height: number;
  formats: {
    webp: string;
    jpeg: string;
  };
}
export interface FixTweetAPIMedia {
  all?: (FixTweetAPIPhoto | FixTweetAPIVideo)[];
  external?: FixTweetAPIYouTube[];
  photos?: FixTweetAPIPhoto[];
  videos?: FixTweetAPIVideo[];
  mosaic?: FixTweetAPIMosaic;
}
export interface FixTweetAPITweet {
  id: string;
  url: string;
  text: string;
  created_at: string;
  created_timestamp: number;
  color: string;
  lang: string | null;
  replying_to: string | null;
  replying_to_status: string | null;
  twitter_card: "tweet" | "summary" | "summary_large_image" | "player";
  author: {
    name: string;
    screen_name: string;
    avatar_url?: string;
    avatar_color?: string;
    banner_url?: string;
  };
  source: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number | null;
  quote?: FixTweetAPITweet;
  poll?: {
    choices: {
      label: string;
      count: number;
      percentage: number;
    }[];
    total_votes: number;
    ends_at: string;
    time_left_en: string;
  };
  translation?: {
    text: string;
    source_lang: string;
    target_lang: string;
  };
  media?: FixTweetAPIMedia;
}
export interface FixTweetAPIUser {
  url: string;
  id: string;
  followers: number;
  following: number;
  likes: number;
  tweets: number;
  name: string;
  screen_name: string;
  description: string;
  location: string;
  banner_url?: string;
  avatar_url?: string;
  joined: string;
  birthday?: { day: number; month: number };
  website?: { url: string; display_url: string };
}
export interface FixTweetAPI {
  code: 200 | 401 | 404 | 500;
  message: "OK" | "PRIVATE_TWEET" | "NOT_FOUND" | "API_FAIL";
  tweet?: FixTweetAPITweet;
  user?: FixTweetAPIUser;
}

export interface MisskeyAPINoteShowFile {
  id: string;
  createdAt: string;
  name: string;
  type: string;
  md5: string;
  size: number;
  isSensitive: boolean;
  blurhash: string;
  properties: {
    width: number;
    height: number;
  };
  url: string;
  thumbnailUrl: string;
  comment?: unknown;
  folderId?: unknown;
  folder?: unknown;
  userId?: unknown;
  user?: unknown;
}
export interface MisskeyAPINoteShowPoll {
  multiple: boolean;
  expiresAt: string;
  choices: {
    text: string;
    votes: number;
    isVoted: boolean;
  }[];
}
export interface MisskeyAPINoteShow {
  id: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    host?: string;
    avatarUrl: string;
    avatarBlurhash: string;
    isBot: boolean;
    isCat: boolean;
    emojis: Record<string, number>;
    onlineStatus: string;
    badgeRoles: {
      name: string;
      iconUrl: string;
      displayOrder: number;
    }[];
  };
  text: string;
  cw?: unknown;
  visibility: string;
  localOnly: boolean;
  reactionAcceptance?: unknown;
  renoteCount: number;
  repliesCount: number;
  reactions: Record<string, number>;
  reactionEmojis: Record<string, number>;
  fileIds: string[];
  files?: MisskeyAPINoteShowFile[];
  replyId?: unknown;
  renoteId?: unknown;
  poll?: MisskeyAPINoteShowPoll;
  renote?: MisskeyAPINoteShow;
}
