const axios = require("axios");

module.exports = {
  name: "gif",
  description: "Search GIF using Tenor API",
  usage: "gif <keyword>",
  category: "fun",
  react: "🎞️",
  sudo: false,
  async execute(sock, msg, args, from, sender) {
    if (!args.length) return sock.sendMessage(from, { text: "❌ Enter a keyword to search GIF." }, { quoted: msg });

    const query = args.join(" ");
    try {
      await sock.sendMessage(from, { react: { text: "🎞️", key: msg.key }});

      const apiKey = process.env.TENOR_API_KEY;
      const url = `https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=${apiKey}&limit=1`;

      const res = await axios.get(url);
      const gif = res.data.results[0];

      if (!gif) return sock.sendMessage(from, { text: "❌ No GIF found." }, { quoted: msg });

      const gifUrl = gif.media[0].gif.url;

      await sock.sendMessage(from, {
        video: { url: gifUrl },
        mimetype: "video/gif",
        caption: `🎞️ GIF: ${query}`
      }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: "⚠️ Error fetching GIF." }, { quoted: msg });
    }
  }
};
