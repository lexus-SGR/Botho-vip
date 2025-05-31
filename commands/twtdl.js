const twUrl = require("twitter-url-direct");

module.exports = {
  name: "twtdl",
  description: "Download Twitter video or photo",
  usage: "twtdl <tweet_link>",
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide a tweet URL." }, { quoted: msg });

    const url = args[0];
    if (!url.includes("twitter.com")) {
      return sock.sendMessage(from, { text: "❌ Invalid Twitter URL." }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: "⏳ Downloading from Twitter..." }, { quoted: msg });

    try {
      const info = await twUrl(url);
      if (!info || info.length === 0) {
        return sock.sendMessage(from, { text: "❌ No media found in tweet." }, { quoted: msg });
      }

      // Pick the highest quality video or first photo
      const media = info.find(m => m.type === "video") || info[0];

      if (media.type === "video") {
        await sock.sendMessage(from, {
          video: { url: media.url },
          mimetype: "video/mp4",
          caption: "Twitter video"
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, {
          image: { url: media.url },
          caption: "Twitter image"
        }, { quoted: msg });
      }
    } catch (err) {
      console.error(err);
      await sock.sendMessage(from, { text: "⚠️ Error downloading Twitter media." }, { quoted: msg });
    }
  }
};
