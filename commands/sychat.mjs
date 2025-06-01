import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default {
  name: "📝syschat",
  description: "AI chat na maelekezo maalum ya system",
  category: "openai",
  async execute(sock, msg, args) {
    if (!args.length) return sock.sendMessage(msg.key.remoteJid, { text: "Andika swali au maelezo." }, { quoted: msg });

    const userPrompt = args.join(" ");
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "We are a friendly WhatsApp AI bot, jibu kwa lugha rahisi na yenye heshima." },
          { role: "user", content: userPrompt }
        ]
      });
      const answer = response.choices[0].message.content;
      await sock.sendMessage(msg.key.remoteJid, { text: answer }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: "Kosa limetokea, jaribu tena." }, { quoted: msg });
    }
  }
};
