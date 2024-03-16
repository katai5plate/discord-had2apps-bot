import { MAO_REGEX } from "../constants";
import { ChatFunction } from "../types";
import { shuffleWord, useMessage } from "../utils";

const chat: ChatFunction = async ({ message }) => {
  const { reply } = useMessage(message);

  if (MAO_REGEX.test(message.content)) await reply(shuffleWord(["把握"]));
};

export default chat;
