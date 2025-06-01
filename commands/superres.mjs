// commands/deepai_superres.mjs
import fetch from "node-fetch";

export default {
  name: "😁superres",
  description: "Boresha picha kwa super resolution (DeepAI)",
  category: "deepai",
  async execute(sock, msg) {
    if (!msg.message.imageMessage && !msg.message.extendedTextMessage) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Tuma picha au reply picha." }, { quoted: msg });
    }

    let mediaMsg = msg.message.imageMessage ? msg.message.imageMessage : msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    if (!mediaMsg) return sock.sendMessage(msg.key.remoteJjid, { text: "Reply picha tu." }, { quoted: msg });

    const buffer = await sock.downloadMediaMessage({ message: { imageMessage: mediaMsg } });

    const form = new FormData();
    form.append('image', buffer, 'image.jpg');

    const response = await fetch('https://api.deepai.org/api/torch-srgan', {
      method: 'POST',
      headers: { 'api-key': process.env.DEEPAI_API_KEY },
      body: form
    });

    const json = await response.json();
    if (json.output_url) {
      await sock.sendMessage(msg.key.remoteJid, { image: { url: json.output_url }, caption: "Picha imboreshwa! 🔥" }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { text: "Imeshindikana kuboresha picha. Jaribu tena." }, { quoted: msg });
    }
  }
};
