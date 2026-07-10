#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);

const usage = () => {
  console.error(
    [
      "Usage:",
      "  node ai-tools/read-utf8.mjs <file> [--lines] [--start=N] [--end=N]",
      "",
      "Examples:",
      "  node ai-tools/read-utf8.mjs constants.ts",
      "  node ai-tools/read-utf8.mjs index.ts --lines --start=1 --end=80",
    ].join("\n"),
  );
};

const file = args.find((arg) => !arg.startsWith("--"));
if (!file) {
  usage();
  process.exit(1);
}

const hasFlag = (name) => args.includes(`--${name}`);
const getOptionNumber = (name) => {
  const raw = args.find((arg) => arg.startsWith(`--${name}=`));
  if (!raw) return undefined;
  const value = Number(raw.slice(name.length + 3));
  if (!Number.isInteger(value) || value < 1) {
    console.error(`Invalid --${name}; expected a positive integer.`);
    process.exit(1);
  }
  return value;
};

const withLineNumbers = hasFlag("lines");
const start = getOptionNumber("start") ?? 1;
const end = getOptionNumber("end");

if (end !== undefined && end < start) {
  console.error("--end must be greater than or equal to --start.");
  process.exit(1);
}

const content = readFileSync(resolve(file), "utf8");
const lines = content.split(/\r?\n/);
const selected = lines.slice(start - 1, end);

const output = withLineNumbers
  ? selected
      .map((line, index) => `${String(start + index).padStart(4, " ")}: ${line}`)
      .join("\n")
  : selected.join("\n");

process.stdout.write(output);
if (!output.endsWith("\n")) process.stdout.write("\n");
