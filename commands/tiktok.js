const { tiktokdl } = require("@bochilteam/scraper");

module.exports = {
  name: "tiktok",
  description: "Download TikTok video without watermark",
  usage: "tiktok <TikTok video URL>",
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide a TikTok video URL." }, { quoted: msg });

    const url = args[0];
    if (!url.includes("tiktok.com")) {
      return sock.sendMessage(from, { text: "❌ Invalid TikTok URL." }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: "⏳ Downloading TikTok video..." }, { quoted: msg });

    try {
      const data = await tiktokdl(url);
      if (!data || !data.nowatermark) {
        return sock.sendMessage(from, { text: "❌ Failed to retrieve video." }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        video: { url: data.nowatermark },
        mimetype: "video/mp4",
        caption: "🎥 TikTok video (no watermark)"
      }, { quoted: msg });
    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Error occurred while downloading TikTok video." }, { quoted: msg });
    }
  }
};
