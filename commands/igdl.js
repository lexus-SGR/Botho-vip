const fetch = require("node-fetch");

module.exports = {
  name: "igdl",
  description: "Download Instagram photo or video (no API key)",
  usage: "igdl <instagram_post_url>",
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Please provide an Instagram post URL." }, { quoted: msg });

    const url = args[0];
    if (!url.includes("instagram.com")) {
      return sock.sendMessage(from, { text: "❌ Invalid Instagram URL." }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: "⏳ Fetching Instagram media..." }, { quoted: msg });

    try {
      const res = await fetch(`https://api.otakudesuapi.xyz/api/instagram?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!data || !data.url) {
        return sock.sendMessage(from, { text: "❌ Could not fetch media." }, { quoted: msg });
      }

      const mediaUrl = data.url;
      const isVideo = mediaUrl.endsWith(".mp4");

      await sock.sendMessage(from, isVideo
        ? { video: { url: mediaUrl }, mimetype: "video/mp4", caption: "Instagram video" }
        : { image: { url: mediaUrl }, caption: "Instagram photo" }, { quoted: msg });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(from, { text: "⚠️ Error fetching Instagram media." }, { quoted: msg });
    }
  }
};
