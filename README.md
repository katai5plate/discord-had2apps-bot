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
  "PRIVATE_VALUES_LOCATIONS": ["https://discord.com/channels/.../.../..."]
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

<img width="1049" height="247" alt="image" src="https://github.com/user-attachments/assets/93a0e8c3-278e-4736-ad42-8478ca87b93d" />

#### プラス構文

```json
// ./env.json
{
  "PRIVATE_VALUES_LOCATIONS": [
    "https://discord.com/channels/1234567890/.../1",
    "https://discord.com/channels/1234567890/.../2",
    "https://discord.com/channels/1234567890/.../3"
  ]
}

// https://discord.com/channels/1234567890/.../1
{
  "USERS+mods": {
    "12345": "太郎"
  }
}

// https://discord.com/channels/1234567890/.../2
{
  "USERS+users": {
    "67890": "二郎"
  }
}

// https://discord.com/channels/1234567890/.../3
{
  "USERS": {
    "45678": "ジョン"
  }
}

// 内部マージ結果
{
  "USERS": {
    "12345": "太郎"
    "67890": "二郎"
    "45678": "ジョン"
  }
}
```

#### アット構文

USERS で定義したユーザー名をユーザーIDに変換できる。

```json
{
  "NO_REPLY_USER_IDS": ["@二郎", "76543"],
  "TAIHEKI": {
    "@ジョン": { ... }
  }
}
```
