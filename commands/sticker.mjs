import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export default {
  command: ["sticker", "stik", "s", "🧃sticker"],
  description: "Convert image, video or gif to sticker",
  category: "media",
  async execute(sock, msg, text, store) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || msg.message?.imageMessage || msg.message?.videoMessage;

    if (!quoted) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "📌 Please reply to an image, video or gif to convert to sticker.",
      }, { quoted: msg });
      return;
    }

    const mediaType = Object.keys(quoted)[0];
    const mediaPath = path.join("./temp", `${Date.now()}`);
    const webpPath = `${mediaPath}.webp`;

    try {
      const stream = await downloadMediaMessage(
        { message: quoted },
        "buffer",
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const inputPath = `${mediaPath}.${mediaType === "videoMessage" ? "mp4" : "jpg"}`;
      fs.writeFileSync(inputPath, stream);

      exec(`ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -vcodec libwebp -lossless 1 -loop 0 -an -preset picture -y ${webpPath}`, async (err) => {
        if (err) {
          console.error("FFmpeg error:", err);
          return sock.sendMessage(msg.key.remoteJid, {
            text: "❌ Failed to create sticker. Ensure ffmpeg is installed.",
          }, { quoted: msg });
        }

        const stickerData = fs.readFileSync(webpPath);
        await sock.sendMessage(msg.key.remoteJid, {
          sticker: stickerData
        }, { quoted: msg });

        fs.unlinkSync(inputPath);
        fs.unlinkSync(webpPath);
      });
    } catch (error) {
      console.error("Download error:", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Failed to process media. Please try again.",
      }, { quoted: msg });
    }
  }
};
