import fetch from "node-fetch";

export default {
  name: "punch",
  description: "🥊 Tuma funny anime punch GIF",
  async execute(sock, msg, args, from) {
    try {
      // Tafuta GIF kutoka Tenor API
      const res = await fetch(`https://tenor.googleapis.com/v2/search?q=anime%20punch&key=${process.env.TENOR_API_KEY}&limit=1`);
      const json = await res.json();
      const gif = json.results?.[0]?.media_formats?.gif?.url;

      if (!gif) {
        return await sock.sendMessage(from, {
          text: "❌ Samahani, siwezi kupata GIF kwa sasa."
        }, { quoted: msg });
      }

      // Tuma kama GIF
      await sock.sendMessage(from, {
        video: { url: gif },
        gifPlayback: true,
        caption: "🥊 Boom! Gotcha!"
      }, { quoted: msg });

      // React
      await sock.sendMessage(from, {
        react: { text: "🥊", key: msg.key }
      });

    } catch (error) {
      console.error("❌ Punch command error:", error);
      await sock.sendMessage(from, {
        text: "❌ Hitilafu imetokea wakati wa kutuma punch GIF."
      }, { quoted: msg });
    }
  }
};
