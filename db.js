//@ts-check

import fs from "fs/promises";
import { DB_PATH } from "./constants.js";

let cache = {};

export const init = async () => {
  try {
    await fs.access(DB_PATH);
    cache = JSON.parse(await fs.readFile(DB_PATH, "utf8"));
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(cache));
  }
};

export const read = async (key) => (key ? cache[key] : cache);

export const write = async (key, fn, init = null) => {
  cache[key] = fn(cache[key] ?? init);
  await fs.writeFile(DB_PATH, JSON.stringify(cache));
};
