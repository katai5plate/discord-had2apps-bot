import { POSTED_REGEX } from "../constants";
import { ChatFunction } from "../types";

const chat: ChatFunction = async ({ message, client }) => {
  if (!message.reference?.messageId) return;

  const referenced = await message.channel.messages.fetch(
    message.reference.messageId,
  );

  if (referenced.author.id !== client.user?.id) return;

  const match = referenced.content.match(POSTED_REGEX);
  if (!match) return;

  const originalUserId = match[1];
  if (originalUserId === message.author.id) return;

  await message.channel.send(`cc: <@${originalUserId}>`);
};

export default chat;
