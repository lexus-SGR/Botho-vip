const axios = require("axios");

module.exports = {
  name: "simi",
  description: "Chat with Simi AI 🤖",
  usage: "simi Hello there!",
  category: "ai",
  react: "💬",
  sudo: false,
  async execute(sock, msg, args, from, sender, isGroup) {
    if (!args[0]) {
      return sock.sendMessage(from, { text: "💡 Please type something to chat with Simi.\n\nExample: `!simi hello`" }, { quoted: msg });
    }

    const apiKey = process.env.SIMI_API_KEY;
    if (!apiKey) {
      return sock.sendMessage(from, { text: "⚠️ Simi API key not set in environment variables." }, { quoted: msg });
    }

    const query = args.join(" ");
    try {
      const { data } = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(query)}&lc=en&key=${apiKey}`);
      if (data.success) {
        await sock.sendMessage(from, { text: `🤖 ${data.success}` }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { text: "❌ Sorry, I didn't understand that." }, { quoted: msg });
      }
    } catch (err) {
      await sock.sendMessage(from, { text: "⚠️ Error connecting to Simi API." }, { quoted: msg });
    }
  }
};
