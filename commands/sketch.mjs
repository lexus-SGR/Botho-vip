// commands/deepai_sketch.mjs
import fetch from "node-fetch";
import FormData from "form-data";

export default {
  name: "😁sketch",
  description: "Fanya picha kuwa sketch (DeepAI)",
  category: "deepai",
  async execute(sock, msg) {
    let media = msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
    if (!media) return sock.sendMessage(msg.key.remoteJid, { text: "Tuma picha au reply picha." }, { quoted: msg });
    
    const buffer = await sock.downloadMediaMessage({ message: { imageMessage: media } });
    const form = new FormData();
    form.append("image", buffer, "image.jpg");

    const response = await fetch("https://api.deepai.org/api/sketchify", {
      method: "POST",
      headers: { "api-key": process.env.DEEPAI_API_KEY },
      body: form
    });

    const json = await response.json();
    if (json.output_url) {
      await sock.sendMessage(msg.key.remoteJid, { image: { url: json.output_url }, caption: "Sketch imekamilika! ✏️" }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { text: "Imeshindikana kufanya sketch, jaribu tena." }, { quoted: msg });
    }
  }
};
