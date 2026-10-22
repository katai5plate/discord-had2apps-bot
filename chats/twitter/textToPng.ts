import { createCanvas } from "@napi-rs/canvas";

const FONT = "24px sans-serif";
const PADDING = 16;
const LINE_HEIGHT = 24;
const LINE_SPACING = 8;

export const textToPng = (text: string): Buffer => {
  const lines = text.split("\n");
  const measureCanvas = createCanvas(1, 1);
  const measureContext = measureCanvas.getContext("2d");
  measureContext.font = FONT;

  const textWidth = Math.max(
    ...lines.map((line) => measureContext.measureText(line).width),
  );
  const width = Math.max(1, Math.ceil(textWidth + PADDING * 2));
  const height =
    PADDING * 2 +
    lines.length * LINE_HEIGHT +
    Math.max(0, lines.length - 1) * LINE_SPACING;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillStyle = "#2b2d31";
  context.fillRect(0, 0, width, height);
  context.font = FONT;
  context.fillStyle = "white";
  context.textBaseline = "top";

  for (const [index, line] of lines.entries()) {
    context.fillText(line, PADDING, PADDING + index * (LINE_HEIGHT + LINE_SPACING));
  }

  return canvas.toBuffer("image/png");
};
