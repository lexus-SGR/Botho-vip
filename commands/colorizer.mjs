// commands/deepai_colorizer.mjs
import fetch from "node-fetch";

export default {
  name: "😁colorize",
  description: "Fanya picha ya Black & White kuwa rangi (DeepAI)",
  category: "deepai",
  async execute(sock, msg) {
    if (!msg.message.imageMessage && !msg.message.extendedTextMessage) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Tuma picha au reply picha ya B&W." }, { quoted: msg });
    }

    let mediaMsg = msg.message.imageMessage ? msg.message.imageMessage : msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    if (!mediaMsg) return sock.sendMessage(msg.key.remoteJid, { text: "Reply picha tu." }, { quoted: msg });

    const buffer = await sock.downloadMediaMessage({ message: { imageMessage: mediaMsg } });

    const form = new FormData();
    form.append('image', buffer, 'image.jpg');

    const response = await fetch('https://api.deepai.org/api/colorizer', {
      method: 'POST',
      headers: { 'api-key': process.env.DEEPAI_API_KEY },
      body: form
    });

    const json = await response.json();
    if (json.output_url) {
      await sock.sendMessage(msg.key.remoteJid, { image: { url: json.output_url }, caption: "Picha imekuwa na rangi! 🌈" }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { text: "Haitaki kufanya colorize. Jaribu tena." }, { quoted: msg });
    }
  }
};
