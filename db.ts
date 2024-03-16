import fs from "fs/promises";
import { DB_PATH } from "./constants";
import { DatabaseJSON } from "./types";

let cache: DatabaseJSON = { messages: [] };

export const init = async () => {
  try {
    await fs.access(DB_PATH);
    cache = JSON.parse(await fs.readFile(DB_PATH, "utf8"));
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(cache));
  }
};

export const read = async (key: keyof DatabaseJSON) =>
  key ? cache[key] : cache;

export const write = async <K extends keyof DatabaseJSON>(
  key: K,
  fn: (prev: DatabaseJSON[K]) => DatabaseJSON[K],
  init: DatabaseJSON[K] | null = null
) => {
  cache[key] = fn(cache[key] ?? init);
  await fs.writeFile(DB_PATH, JSON.stringify(cache));
};
