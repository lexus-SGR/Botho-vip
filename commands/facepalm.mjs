import fetch from "node-fetch";

export default {
  name: "facepalm",
  description: "🤦 Tuma GIF ya facepalm",
  category: "fun",
  async execute(sock, msg) {
    try {
      const res = await fetch(`https://tenor.googleapis.com/v2/search?q=facepalm&key=${process.env.TENOR_API_KEY}&limit=1`);
      const json = await res.json();
      const gif = json.results?.[0]?.media_formats?.gif?.url;
      if (!gif) throw new Error("Hakuna GIF imepatikana");

      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: gif },
        gifPlayback: true,
        caption: "🤦 Oops!"
      }, { quoted: msg });

      await sock.sendMessage(msg.key.remoteJid, {
        react: { text: "🤦", key: msg.key }
      });
    } catch (error) {
      console.error("Facepalm command error:", error);
      await sock.sendMessage(msg.key.remoteJid, { text: "❌ Hitilafu wakati wa kutuma facepalm GIF." }, { quoted: msg });
    }
  }
};
