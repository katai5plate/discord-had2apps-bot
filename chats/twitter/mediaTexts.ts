import { link } from "../../snippet";
import { FixTweetAPIMedia } from "../../types";

export const mediaTexts = (media?: FixTweetAPIMedia) => {
  const { all, mosaic } = media ?? {};
  let results: string[] = [];
  if (all) {
    // メディアは１つ以下
    if (all.length <= 1) {
      results.push(all.at(0)?.url ?? "");
    }
    // メディアはそれ以上
    else if (all.length > 1) {
      // モザイクプレビューがあるならモザイク＋リンクのみ
      if (mosaic) {
        results = [
          ...results,
          [
            link("■", mosaic.formats.webp ?? mosaic.formats.jpeg),
            ...all.map(({ url }, i) => link(`画像${i + 1}`, url, true)),
          ].join(" , "),
        ];
      }
      // モザイクプレビューがないなら１枚目だけ表示
      else {
        results = [
          ...results,
          all
            .map(({ url }, i) => link(`画像${i + 1}`, url, i !== 0))
            .join(" , "),
        ];
      }
    }
  }
  return results;
};
