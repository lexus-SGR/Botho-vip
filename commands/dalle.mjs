import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default {
  name: "🖼️dalle",
  description: "Tengeneza picha kwa maelezo (DALL·E)",
  category: "openai",
  async execute(sock, msg, args) {
    if (!args.length) return sock.sendMessage(msg.key.remoteJid, { text: "Andika maelezo ya picha unayotaka." }, { quoted: msg });
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: args.join(" "),
        size: "1024x1024",
        n: 1
      });
      const image_url = response.data[0].url;
      await sock.sendMessage(msg.key.remoteJid, { image: { url: image_url }, caption: "Hii ndio picha yako kutoka DALL·E." }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Kosa linapotokea katika kutengeneza picha, jaribu tena." }, { quoted: msg });
    }
  }
};
