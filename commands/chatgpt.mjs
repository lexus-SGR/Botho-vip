import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default {
  name: "🤖chatgpt",
  description: "Uliza AI swali kwa ChatGPT",
  category: "openai",
  async execute(sock, msg, args) {
    if (!args.length) return sock.sendMessage(msg.key.remoteJid, { text: "Andika swali lako kwa AI." }, { quoted: msg });
    const prompt = args.join(" ");
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      });
      const answer = response.choices[0].message.content;
      await sock.sendMessage(msg.key.remoteJid, { text: answer }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Kosa linapotokea, jaribu tena baadaye." }, { quoted: msg });
    }
  }
};
