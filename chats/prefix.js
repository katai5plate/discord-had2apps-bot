//@ts-check

import { MAO_REGEX } from "../constants.js";
import { shuffleWord, useMessage } from "../utils.js";

export default async ({ message }) => {
  const { reply } = useMessage(message);

  if (MAO_REGEX.test(message.content)) await reply(shuffleWord(["把握"]));
};
