import fetch from "node-fetch";

export default {
  name: "😁kill",
  description: "Send a funny kill GIF 🔪",
  category: "fun",
  async execute(sock, msg) {
    try {
      // Pata GIF kutoka Tenor API kwa neno 'anime kill'
      const res = await fetch(`https://tenor.googleapis.com/v2/search?q=anime%20kill&key=${process.env.TENOR_API_KEY}&limit=1`);
      const json = await res.json();

      // Chagua URL ya GIF
      const gif = json.results?.[0]?.media_formats?.gif?.url;
      if (!gif) throw new Error("Hakuna GIF iliyopatikana");

      // Tuma video GIF na caption
      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: gif },
        gifPlayback: true,
        caption: "🔪 Oops, you’re dead!"
      }, { quoted: msg });

    } catch (error) {
      console.error("Kill command error:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: "❌ Hitilafu wakati wa kutuma kill GIF." }, { quoted: msg });
    }
  }
};
