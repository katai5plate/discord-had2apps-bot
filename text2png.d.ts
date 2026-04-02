declare module "text2png" {
  interface Text2PngOptions {
    font?: string;
    textAlign?: "left" | "center" | "right";
    color?: string;
    textColor?: string;
    backgroundColor?: string;
    bgColor?: string;
    lineSpacing?: number;
    strokeWidth?: number;
    strokeColor?: string;
    padding?: number;
    paddingLeft?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    borderWidth?: number;
    borderLeftWidth?: number;
    borderTopWidth?: number;
    borderRightWidth?: number;
    borderBottomWidth?: number;
    borderColor?: string;
    localFontPath?: string;
    localFontName?: string;
    output?: "buffer" | "stream" | "dataURL" | "canvas";
  }
  function text2png(text: string, options?: Text2PngOptions): Buffer;
  export = text2png;
}
