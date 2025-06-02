import fetch from "node-fetch";

export default {
  name: "dance",
  description: "💃 Tuma dancing GIF",
  category: "fun",
  async execute(sock, msg, args, from) {
    try {
      const res = await fetch(`https://tenor.googleapis.com/v2/search?q=dance&key=${process.env.TENOR_API_KEY}&limit=1`);
      const json = await res.json();
      const gif = json.results?.[0]?.media_formats?.gif?.url;

      if (!gif) {
        return await sock.sendMessage(from, {
          text: "❌ Samahani, siwezi kupata dancing GIF kwa sasa."
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        video: { url: gif },
        gifPlayback: true,
        caption: "💃 Let’s dance!"
      }, { quoted: msg });

      // Emoji reaction
      await sock.sendMessage(from, {
        react: { text: "💃", key: msg.key }
      });

    } catch (error) {
      console.error("❌ Dance command error:", error);
      await sock.sendMessage(from, {
        text: "❌ Hitilafu imetokea wakati wa kutuma dancing GIF."
      }, { quoted: msg });
    }
  }
};
