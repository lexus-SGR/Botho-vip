import fetch from "node-fetch";

export default {
  name: "askai",
  description: "Uliza AI swali lolote (ChatGPT)",
  category: "ai",
  usage: "!askai Je, maana ya ndoto ni nini?",
  async execute(sock, msg, args) {
    const question = args.join(" ");
    if (!question) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ Tafadhali andika swali. Mfano: `!askai Jinsi ya kupika wali`",
      }, { quoted: msg });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Samahani, siwezi jibu hilo sasa.";

    await sock.sendMessage(msg.key.remoteJid, { text: `🤖 ${answer}` }, { quoted: msg });
    await sock.sendMessage(msg.key.remoteJid, { react: { text: "✅", key: msg.key } });
  }
};
