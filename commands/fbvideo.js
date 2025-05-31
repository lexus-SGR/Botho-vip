const fetch = require("node-fetch");

module.exports = {
  name: "fbvideo",
  description: "Download Facebook video by URL (no API key)",
  usage: "fbvideo <Facebook video URL>",
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide a Facebook video URL." }, { quoted: msg });

    const url = args[0];
    if (!url.includes("facebook.com")) {
      return sock.sendMessage(from, { text: "❌ Invalid Facebook URL." }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: "⏳ Downloading Facebook video..." }, { quoted: msg });

    try {
      // Using third-party free API example (may vary)
      const apiUrl = `https://fbdownloader.net/api/button?url=${encodeURIComponent(url)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data || !data.sd) {
        return sock.sendMessage(from, { text: "❌ Failed to retrieve video." }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        video: { url: data.sd },
        mimetype: "video/mp4",
        caption: "📹 Facebook video downloaded"
      }, { quoted: msg });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(from, { text: "⚠️ Error occurred while downloading Facebook video." }, { quoted: msg });
    }
  }
};
