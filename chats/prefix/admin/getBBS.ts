import discord from "discord.js";
import { bold } from "../../../snippet";

interface Thread {
  type: "thread";
  name: string;
  id: string;
}
interface Channel {
  type: "text" | "voice" | "other";
  name: string;
  id: string;
  topic?: string | null;
  threads?: Thread[];
  permissions?: { id: string; name: string }[];
}
interface Category {
  type: "category";
  name: string;
  id: string;
  channels: Channel[];
  permissions?: { id: string; name: string }[];
}

interface Role {
  type: "role";
  name: string;
  id: string;
}

const getThreadData = (thread: discord.ThreadChannel): Thread => {
  return {
    type: "thread",
    name: thread.name,
    id: thread.id,
  };
};

const getChannelPermissions = (
  channel: discord.TextChannel | discord.VoiceChannel | discord.CategoryChannel
): Role[] => {
  return channel.permissionOverwrites.cache
    .filter((overwrite) =>
      overwrite.allow.has(discord.PermissionFlagsBits.ViewChannel)
    )
    .map((overwrite) => ({
      type: "role",
      id: overwrite.id,
      name: channel.guild.roles.cache.get(overwrite.id)?.name || "Unknown",
    }));
};

const getChannelData = (channel: any): Channel | Thread => {
  if (channel instanceof discord.TextChannel) {
    return {
      type: "text",
      name: channel.name,
      id: channel.id,
      topic: channel.topic ?? null,
      threads: channel.threads.cache.map((thread: discord.ThreadChannel) =>
        getThreadData(thread)
      ),
      permissions: getChannelPermissions(channel),
    };
  } else if (channel instanceof discord.VoiceChannel) {
    return {
      type: "voice",
      name: channel.name,
      id: channel.id,
      permissions: getChannelPermissions(channel),
    };
  } else if (channel instanceof discord.ThreadChannel) {
    return getThreadData(channel);
  } else {
    return {
      type: "other",
      name: channel.name,
      id: channel.id,
      permissions: getChannelPermissions(channel),
    };
  }
};

export const getBBS = (guild: discord.Guild) => {
  const categories = guild.channels.cache
    .filter((channel) => channel instanceof discord.CategoryChannel)
    .sort(
      (a, b) =>
        (a as discord.CategoryChannel).rawPosition -
        (b as discord.CategoryChannel).rawPosition
    )
    .map(
      (category) =>
        ({
          name: category.name,
          id: category.id,
          type: "category",
          channels: guild.channels.cache
            .filter((channel) => channel.parentId === category.id)
            .sort(
              (a, b) =>
                (a as discord.TextChannel).rawPosition -
                (b as discord.TextChannel).rawPosition
            )
            .map((channel) => getChannelData(channel)),
          permissions: getChannelPermissions(
            category as discord.CategoryChannel
          ),
        } as Category)
    );

  const uncategorizedChannels = guild.channels.cache
    .filter(
      (channel) =>
        !channel.parentId && !(channel instanceof discord.CategoryChannel)
    )
    .sort(
      (a, b) =>
        (a as discord.TextChannel).rawPosition -
        (b as discord.TextChannel).rawPosition
    )
    .map((channel) => getChannelData(channel)) as Channel[];

  const emptyCategory: Category = {
    type: "category",
    name: "$$EMPTY$$",
    id: "",
    channels: uncategorizedChannels,
  };

  return [...categories, emptyCategory];
};

export const createBBSDoc = (guild: discord.Guild) => {
  let result = ["# チャンネル一覧"];
  getBBS(guild).forEach((category) => {
    result.push(`\n## ${category.name}`);
    if (category.permissions?.length) {
      result.push(`- 権限`);
      category.permissions.forEach((role) => {
        result.push(`  - ${role.name}`);
      });
    }
    category.channels.forEach((channel) => {
      result.push(
        `\n### ${
          {
            text: "📝",
            voice: "🔊",
            other: "❓",
          }[channel.type]
        }${channel.name}`
      );
      if (channel.topic) {
        result.push(`- 説明`);
        result.push(`  - ${channel.topic}`);
      }
      if (channel.threads?.length) {
        result.push(`- スレッド`);
        channel.threads.forEach((thread) => {
          result.push(`  - ${thread.name}`);
        });
      }
      if (channel.permissions?.length) {
        result.push(`- 権限`);
        channel.permissions.forEach((role) => {
          result.push(`  - ${role.name}`);
        });
      }
    });
  });
  return result.join("\n");
};

export const createBBSPost = (guild: discord.Guild) => {
  let result: string[] = [];
  getBBS(guild).forEach((category) => {
    result.push("\n``` ```" + bold(`「${category.name}」カテゴリ`));
    category.channels.forEach((channel) => {
      result.push(`<#${channel.id}> \`#${channel.name}\``);
      if (channel.topic) {
        result.push(`-> ${channel.topic}`);
      }
    });
  });
  return result.join("\n");
};
