const yts = require("yt-search");
const { ytdl } = require("@bochilteam/scraper");

module.exports = {
  name: "play",
  description: "Search and download audio from YouTube 🎶",
  category: "media",
  usage: "play <song name>",
  react: "🎵",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    // Hapa ni code yako yote ulivyoandika...
    await sock.sendMessage(from, { react: { text: "🎵", key: msg.key }});

    if (!args.length) {
      return sock.sendMessage(from, { text: "❌ Please enter a song name to search." }, { quoted: msg });
    }

    const query = args.join(" ");
    await sock.sendMessage(from, { text: `🔎 Searching for: *${query}*...` }, { quoted: msg });

    try {
      const search = await yts(query);
      const video = search.videos[0];
      if (!video) {
        return sock.sendMessage(from, { text: "❌ No results found on YouTube." }, { quoted: msg });
      }

      const info = await ytdl(video.url);
      const audioUrl = info.audio?.url;

      if (!audioUrl) {
        return sock.sendMessage(from, { text: "❌ Failed to fetch audio stream." }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        ptt: false,
        fileName: `${video.title}.mp3`,
        caption: `🎶 Now Playing: *${video.title}*`
      }, { quoted: msg });

    } catch (err) {
      console.error("Play command error:", err);
      await sock.sendMessage(from, { text: "⚠️ Error processing your request. Please try again later." }, { quoted: msg });
    }
  }
};
