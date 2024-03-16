import axios from "axios";
import { MISSKEY_HOSTS } from "../constants";
import { tryit, useMessage } from "../utils";
import { ChatFunction, MisskeyAPINoteShow } from "../types";

const chat: ChatFunction = async ({ message }) => {
  const { post } = useMessage(message);
  for (const { host, token: i } of MISSKEY_HOSTS) {
    const regex = new RegExp(
      `${host.replace(/\./g, "\\.")}\\/notes\\/([0-9a-z]+)`
    );
    if (regex.test(message.content)) {
      const [, noteId] = message.content.match(regex) ?? [];
      const res = await tryit(() =>
        axios.post(`https://${host}/api/notes/show`, {
          noteId,
          i,
        })
      );
      if (!res) return message.react("❌");

      const note: MisskeyAPINoteShow = res.data;

      const texts: string[] = [note.text];
      const previews: string[] = [];

      let isNSFW: boolean = false;

      const getUser = (user: MisskeyAPINoteShow["user"]) =>
        `> ${user.name} (@${user.username})`;

      // 投票がある
      if (note.poll) {
        const { poll } = note;
        texts.push("");
        const total = poll.choices.reduce((p, c) => p + c.votes, 0);
        for (const { text, votes } of poll.choices) {
          texts.push(`${text}`);
          const percentage = (votes / total) * 100;
          texts.push(
            `: ${
              "█".repeat(percentage / 5) || "|"
            } ${percentage}% (${votes}/${total})`
          );
        }
        texts.push(`投票終了: ${new Date(poll.expiresAt).toLocaleString()}`);
      }

      // ファイルがある
      if (note.files) {
        const { files } = note;
        for (const file of files) {
          if (file.isSensitive) isNSFW = true;
          previews.push(file.url);
        }
      }

      // 引用がある
      if (note.renote) {
        const { renote } = note;
        const lines = renote.text.split(/\n/g);
        texts.push(`| ${getUser(renote.user)}`);
        for (const i in lines) {
          const text = lines[i];
          texts.push(`| ${text}`);
        }
        const { files } = renote;
        if (files?.length) {
          previews.push("引用:");
          for (const file of files) {
            if (file.isSensitive) isNSFW = true;
            previews.push(file.url);
          }
        }
      }

      const emojis = Object.entries(note.reactions)
        .filter(([k]) => /^(\p{Emoji_Presentation})$/u.test(k))
        .sort(([, a], [, b]) => b - a)
        .map(([k]) => k)
        .join(" ");

      const posted = await post(
        [
          `[POSTED BY <@${message.author.id}>]`,
          `<${message.content}> \`\`\``,
          getUser(note.user),
          ...texts,
          emojis,
          `\`\`\``,
          ...previews,
        ].join("\n")
      );
      if (isNSFW) posted.react("🔞");
      await message.delete();
    }
  }
};

export default chat;
