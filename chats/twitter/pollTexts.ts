import { FixTweetAPITweet } from "types";

export const pollTexts = (poll: FixTweetAPITweet["poll"]) => {
  let texts = [];
  if (poll) {
    texts.push("");
    for (const { label, count, percentage } of poll.choices) {
      texts.push(`${label}`);
      texts.push(
        `: ${"█".repeat(percentage / 5) || "|"} ${percentage}% (${count}/${
          poll.total_votes
        })`
      );
    }
    texts.push(`投票終了: ${new Date(poll.ends_at).toLocaleString()}`);
  }
  return texts;
};
