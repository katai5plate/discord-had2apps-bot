import { PIXIV_REGEX } from "../constants";
import { codeBlock, link, pixivStatus, postedBy, snsUser } from "../snippet";
import { ChatFunction, FixPixivAPI } from "../types";
import { useMessage } from "../utils";

const chat: ChatFunction = async ({ message }) => {
  if (PIXIV_REGEX.test(message.content)) {
    const [m, _1, _2, id] = message.content.match(PIXIV_REGEX) ?? [];
    if (!m) return;
    const { post } = useMessage(message);
    const res = (await (
      await fetch(`https://www.phixiv.net/api/info?id=${id}`)
    ).json()) as FixPixivAPI;
    const isSafe =
      res.x_restrict > 0 ? (message.channel as { nsfw: boolean }).nsfw : true;
    await post([
      postedBy(message.author),
      `<${res.url}>`,
      codeBlock([
        snsUser(res.author_name),
        res.title,
        res.tags.join(", "),
        pixivStatus(res),
      ]),
      isSafe
        ? res.x_restrict === 2
          ? "※グロ注意なのでリンクから見てください"
          : res.image_proxy_urls[0]
        : "※えっちなので画像はリンクから見てください",
      "画像 " +
        res.image_proxy_urls
          .map((url, i) => link(`${i + 1}`, url, true))
          .join(" "),
    ]);
    await message.delete();
  }
};

export default chat;
