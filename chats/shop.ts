import { AMAZON_AFFILIATE_REGEX } from "../constants";
import { ChatFunction } from "../types";
import { useMessage } from "../utils";
import { postedBy } from "../snippet";

const chat: ChatFunction = async ({ message }) => {
  if (AMAZON_AFFILIATE_REGEX.test(message.content)) {
    const { post } = useMessage(message);
    await post([postedBy(message.author), `PR ${message.content}`]);
    await message.delete();
  }
};

export default chat;
