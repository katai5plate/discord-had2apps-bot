import {
  TWEET_IS_ERROR,
  TWEET_IS_NSFW,
  TWEET_IS_PROFILE,
  TWEET_IS_TWEET,
  TWITTER_DOMAIN_RAGEX,
  TWITTER_REGEX,
} from "../../constants";
import { textToUrls, useMessage, useTweet } from "../../utils";
import { ChatFunction } from "../../types";
import {
  offLink,
  codeBlock,
  postedBy,
  tweetStatus,
  snsUser,
  link,
  code,
  bold,
} from "../../snippet";
import { pollTexts } from "./pollTexts";
import { mediaTexts } from "./mediaTexts";
import text2png from "text2png";
import { AttachmentBuilder } from "discord.js";

const chat: ChatFunction = async ({ message }) => {
  const { post } = useMessage(message);

  if (TWITTER_REGEX.test(message.content)) {
    const [tweetType, tweet] = await useTweet(message.content);

    if (tweetType === TWEET_IS_ERROR) return message.react("❌");
    if (tweetType === TWEET_IS_NSFW) {
      const nsfwPost = await post(
        [
          postedBy(message.author),
          message.content
            .replace(TWITTER_DOMAIN_RAGEX, "twitter.com")
            .replace(/\?.+$/, ""),
        ].join("\n"),
      );
      await message.delete();
      return await nsfwPost.react("🔞");
    }

    if (tweetType === TWEET_IS_PROFILE) {
      const urls = textToUrls(tweet.description);
      await post([
        postedBy(message.author),
        offLink(tweet.url),
        bold(`${tweet.name} ${code(`@${tweet.screen_name}`)} (${tweet.id})`),
        codeBlock(tweet.description) +
          codeBlock([
            `| フォロワー: ${tweet.followers || "不明"}`,
            `| フォロー: ${tweet.following || "不明"}`,
            `| ツイート: ${tweet.tweets || "不明"}`,
            `| いいね: ${tweet.likes || "不明"}`,
            `| 場所: ${tweet.location || "なし"}`,
            `| 利用開始: ${new Date(tweet.joined).toLocaleString()}`,
            `| 誕生日: ${
              tweet.birthday
                ? `${tweet.birthday.month} 月 ${tweet.birthday.day} 日`
                : "不明"
            }`,
          ]),
        `WEBサイト: ${
          tweet.website
            ? link(tweet.website.display_url, tweet.website.url)
            : "なし"
        }`,
        [
          tweet.avatar_url ? link("サムネ", tweet.avatar_url) : "",
          tweet.banner_url ? link("背景", tweet.banner_url) : "",
        ].join(" "),
        ...(urls.length ? ["リンク：", ...urls] : []),
      ]);
      await message.delete();
      return;
    }

    if (tweetType === TWEET_IS_TWEET) {
      let mainTexts: string[] = [
        tweet.translation?.provider === "grok"
          ? tweet.translation.text
          : tweet.text,
      ];
      let mediaPreviewTexts: string[] = [];
      const { poll, quote } = tweet;

      // 投票がある
      mainTexts = [...mainTexts, ...pollTexts(poll)];

      // メディアがある
      mediaPreviewTexts = [...mediaPreviewTexts, ...mediaTexts(tweet.media)];

      // 引用がある
      if (quote) {
        mainTexts.push(
          `| ${snsUser(quote.author.name, quote.author.screen_name)}`,
        );
        const lines = quote.text.split(/\n/g);
        for (const i in lines) {
          const text = lines[i];
          mainTexts.push(`| ${text}`);
        }
        if (quote.media) {
          mediaPreviewTexts = [
            ...mediaPreviewTexts,
            "引用:",
            ...mediaTexts(quote.media),
          ];
        }
      }

      // URLが添付されている
      const urls = textToUrls(mainTexts.join("\n"));
      if (urls.length) {
        mediaPreviewTexts = [...mediaPreviewTexts, "シェア:", ...urls];
      }

      const codeBlockContent = [
        snsUser(tweet.author.name, tweet.author.screen_name),
        ...mainTexts,
        tweetStatus(tweet),
      ];
      const textMessage = [
        postedBy(message.author),
        `${offLink(tweet.url)} ${codeBlock(codeBlockContent)}`,
        ...mediaPreviewTexts,
      ].join("\n");

      if (textMessage.length <= 2) {
        await post(textMessage);
      } else {
        const buf = text2png(mainTexts.join("\n"), {
          font: "24px sans-serif",
          color: "white",
          bgColor: "#2b2d31",
          padding: 16,
          lineSpacing: 8,
        });
        await message.channel.send({
          content: [
            postedBy(message.author),
            `${offLink(tweet.url)} ${codeBlock([
              snsUser(tweet.author.name, tweet.author.screen_name),
              tweetStatus(tweet),
            ])}`,
            ...mediaPreviewTexts,
          ].join("\n"),
          files: [new AttachmentBuilder(buf, { name: "tweet.png" })],
        });
      }
      await message.delete();
      return;
    }
  }
};

export default chat;
