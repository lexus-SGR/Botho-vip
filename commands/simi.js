const fetch = require("node-fetch");

module.exports = {
  name: "simi",
  description: "Chat with Simi AI 🤖",
  usage: "simi <your message>",
  category: "ai",
  react: "🤖",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    const text = args.join(" ");
    if (!text) {
      return sock.sendMessage(from, { text: "💬 Please provide a message to talk to Simi: `.simi hello`" }, { quoted: msg });
    }

    try {
      const res = await fetch(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=en`);
      const data = await res.json();
      const reply = data.success || "🤖 Sorry, I didn't understand that.";

      await sock.sendMessage(from, { text: `🗣️ ${reply}` }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(from, { text: "⚠️ Failed to connect to Simi API." }, { quoted: msg });
    }
  }
};
