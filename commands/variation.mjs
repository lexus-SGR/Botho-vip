import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default {
  name: "🎨variation",
  description: "Tengeneza variation ya picha (DALL·E)",
  category: "openai",
  async execute(sock, msg) {
    let media = msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    if (!media) return sock.sendMessage(msg.key.remoteJid, { text: "Tuma picha au reply picha." }, { quoted: msg });

    try {
      const buffer = await sock.downloadMediaMessage({ message: { imageMessage: media } });
      fs.writeFileSync("./tmp/original.png", buffer);

      const response = await openai.images.createVariation({
        file: fs.createReadStream("./tmp/original.png"),
        model: "dall-e-3",
        n: 1,
        size: "1024x1024"
      });

      const image_url = response.data[0].url;
      await sock.sendMessage(msg.key.remoteJid, { image: { url: image_url }, caption: "Hii ni variation ya picha yako." }, { quoted: msg });

      fs.unlinkSync("./tmp/original.png");
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Kosa limejitokeza katika variation." }, { quoted: msg });
    }
  }
};
