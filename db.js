//@ts-check
import fs from "fs/promises";
import { DB_PATH } from "./constants.js";
/** @typedef {import("./type.d.ts").DatabaseJSON} DatabaseJSON */

/** @type {DatabaseJSON} */
let cache = { messages: [] };

export const init = async () => {
  try {
    await fs.access(DB_PATH);
    cache = JSON.parse(await fs.readFile(DB_PATH, "utf8"));
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(cache));
  }
};

/** @param {keyof DatabaseJSON} key */
export const read = async (key) => (key ? cache[key] : cache);

/**
 * @template {keyof DatabaseJSON} K
 * @param {K} key
 * @param {(prev: DatabaseJSON[K]) => DatabaseJSON[K]} fn
 * @param {DatabaseJSON[K] | null} init
 */
export const write = async (key, fn, init = null) => {
  cache[key] = fn(cache[key] ?? init);
  await fs.writeFile(DB_PATH, JSON.stringify(cache));
};
