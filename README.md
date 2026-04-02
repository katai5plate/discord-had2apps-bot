# discord-had2apps-bot

はど開発室専用ボット

## はど開発室はこちら

https://had2apps.com/discord

## Usage

### ./env.json の設定

```json
{
  "GUILD_ID": "",
  "DISCORD_BOT_TOKEN": "",
  "PRIVATE_VALUES_LOCATION": "https://discord.com/channels/.../.../..."
}
```

### PrivateValues の書き方

JSON コードブロックで単発記述。

```json
{
  "NO_REPLY_USER_IDS": [""],
  "BOT_USER_ID_TABLE": {
    "EXPAND": ""
  }
}
```
