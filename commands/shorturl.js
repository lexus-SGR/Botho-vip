const fetch = require("node-fetch");

module.exports = {
  name: "shorturl",
  description: "Shorten a long URL 🔗",
  usage: "shorturl <link>",
  category: "tools",
  react: "🔗",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    const url = args[0];
    if (!url || !/^https?:\/\//.test(url)) {
      return sock.sendMessage(from, { text: "🔗 Please provide a valid URL to shorten." }, { quoted: msg });
    }

    try {
      const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.ok) {
        await sock.sendMessage(from, { text: `✅ Shortened URL:\n${data.result.full_short_link}` }, { quoted: msg });
      } else {
        throw new Error();
      }
    } catch {
      await sock.sendMessage(from, { text: "❌ Failed to shorten URL. Try again later." }, { quoted: msg });
    }
  }
};
