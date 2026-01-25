import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey) console.error("STREAM_API_KEY is missing from process.env");
if (!apiSecret) console.error("STREAM_API_SECRET is missing from process.env");
if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    // Stream has a limit on user data size (approx 5KB).
    // Large Base64 images will cause a "Payload Too Large" error.
    // We filter them out here if they are too big, preserving the rest of the user data.
    const streamUser = { ...userData };
    if (streamUser.image && streamUser.image.length > 4000) {
      delete streamUser.image;
    }

    await streamClient.upsertUsers([streamUser]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};
