import { writeFileSync, unlinkSync } from "fs";
import { exec } from "child_process";

export default {
  name: "sticker",
  description: "🖼️ Convert image or video to sticker / Badilisha picha/video kuwa sticker",
  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "🖼️", key: msg.key } });

      // Check if message has media (image/video)
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const mediaMsg = msg.message.imageMessage || msg.message.videoMessage || quoted?.imageMessage || quoted?.videoMessage;

      if (!mediaMsg) {
        await sock.sendMessage(from, { text: "⚠️ Please reply to an image or video to make a sticker.\nTafadhali jibu picha au video kutengeneza sticker." });
        return;
      }

      // Download media buffer
      const mediaType = mediaMsg.imageMessage ? "image" : "video";
      const buffer = await sock.downloadMediaMessage(msg);

      // Save media temporarily
      const inputFile = `/tmp/input.${mediaType === "image" ? "jpg" : "mp4"}`;
      const outputFile = `/tmp/output.webp`;
      writeFileSync(inputFile, buffer);

      // Convert using ffmpeg to webp sticker
      await new Promise((resolve, reject) => {
        exec(
          `ffmpeg -i ${inputFile} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${outputFile}`,
          (error) => {
            unlinkSync(inputFile);
            if (error) reject(error);
            else resolve();
          }
        );
      });

      // Read sticker buffer and send
      const stickerBuffer = require("fs").readFileSync(outputFile);
      unlinkSync(outputFile);

      await sock.sendMessage(from, { sticker: stickerBuffer });

    } catch (error) {
      await sock.sendMessage(from, { text: "❌ Error creating sticker.\nHitilafu kutengeneza sticker." });
      console.error("Sticker command error:", error);
    }
  },
};
