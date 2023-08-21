//@ts-check
import { useMessage } from "../utils.js";
/** @typedef {import("../type").ChatFunction} ChatFunction */

/** @type {ChatFunction} */
export default async ({ message, error }) => {
  const { reply } = useMessage(message);

  await reply(`問題が発生したよ。${error?.name}: ${error?.message}`);
  console.log(error?.stack);
};
