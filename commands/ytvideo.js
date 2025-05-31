const { ytdl } = require("@bochilteam/scraper");

module.exports = {
  name: "ytvideo",
  description: "Download YouTube video 🎥",
  usage: "ytvideo <youtube link>",
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide a YouTube link." }, { quoted: msg });

    const url = args[0];
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return sock.sendMessage(from, { text: "❌ Invalid YouTube link." }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: "⏳ Downloading video..." }, { quoted: msg });

    try {
      const info = await ytdl(url);
      const videoUrl = info.video?.url;
      if (!videoUrl) return sock.sendMessage(from, { text: "❌ Failed to get video stream." }, { quoted: msg });

      await sock.sendMessage(from, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        fileName: `${info.title}.mp4`,
        caption: `🎥 Here's your video: *${info.title}*`
      }, { quoted: msg });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(from, { text: "⚠️ Error occurred while downloading." }, { quoted: msg });
    }
  }
};
