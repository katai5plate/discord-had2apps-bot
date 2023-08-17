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

export interface Connect {
  message: discord.Message<boolean>;
  client: discord.Client<boolean>;
}
export type ChatFunction = (connect: Connect) => Promise<void>;
