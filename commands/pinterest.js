const fetch = require("node-fetch");

module.exports = {
  name: "pinterest",
  description: "Download image from Pinterest",
  usage: "pinterest <Pinterest image URL>",
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide a Pinterest image URL." }, { quoted: msg });

    const url = args[0];
    if (!url.includes("pin.it") && !url.includes("pinterest.com")) {
      return sock.sendMessage(from, { text: "❌ Invalid Pinterest URL." }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: "⏳ Downloading image..." }, { quoted: msg });

    try {
      // This example uses a free third-party API (replace with your own scraper if preferred)
      const apiUrl = `https://api.vhtear.com/pinterestdl?link=${encodeURIComponent(url)}&apikey=demo`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data || !data.result) return sock.sendMessage(from, { text: "❌ Failed to retrieve image." }, { quoted: msg });

      await sock.sendMessage(from, {
        image: { url: data.result },
        caption: "📌 Pinterest image"
      }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Error occurred while downloading Pinterest image." }, { quoted: msg });
    }
  }
};
