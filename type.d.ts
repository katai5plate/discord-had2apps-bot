import discord from "discord.js";

export interface EnvJSON {
  DISCORD_BOT_TOKEN: string;
  NO_REPLY_USERS_ID_COMMA: string;
  // IGNORE_ANALYZE_CHANNEL_ID_COMMA: string;
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
  media: {
    all?: (FixTweetAPIPhoto | FixTweetAPIVideo)[];
    external?: FixTweetAPIYouTube[];
    photos?: FixTweetAPIPhoto[];
    videos?: FixTweetAPIVideo[];
    mosaic?: FixTweetAPIMosaic;
  };
}
export interface FixTweetAPI {
  code: 200 | 401 | 404 | 500;
  message: "OK" | "PRIVATE_TWEET" | "NOT_FOUND" | "API_FAIL";
  tweet?: FixTweetAPITweet;
}
