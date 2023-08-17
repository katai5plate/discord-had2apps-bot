import discord from "discord.js";

export interface Connect {
  message: discord.Message<boolean>;
  client: discord.Client<boolean>;
}
export type ChatFunction = (connect: Connect) => Promise<void>;
