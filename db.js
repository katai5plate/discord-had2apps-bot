const fs = require("fs/promises");

const PATH = "./db.json";

let cache = {};

module.exports.init = async () => {
  try {
    await fs.access(PATH);
    cache = JSON.parse(await fs.readFile(PATH, "utf8"));
  } catch {
    await fs.writeFile(PATH, JSON.stringify(cache));
  }
};

module.exports.read = async (key) => (key ? cache[key] : cache);

module.exports.write = async (key, fn, init = null) => {
  cache[key] = fn(cache[key] ?? init);
  await fs.writeFile(PATH, JSON.stringify(cache));
};
