# AI Tools

Small local helpers for Codex work in this repository.

## read-utf8

PowerShell output can mojibake Japanese text even when the files are valid UTF-8.
Use this reader when normal terminal output is suspicious.

```sh
node ai-tools/read-utf8.mjs constants.ts
node ai-tools/read-utf8.mjs index.ts --lines --start=1 --end=80
ai-tools\read-utf8.cmd README.md --lines
```
