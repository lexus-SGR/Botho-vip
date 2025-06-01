// commands/punch.mjs
import fetch from "node-fetch";

export default {
  name: "😁punch",
  description: "Send a funny punch GIF 🥊",
  category: "fun",
  async execute(sock, msg) {
    const res = await fetch(`https://tenor.googleapis.com/v2/search?q=anime%20punch&key=${process.env.TENOR_API_KEY}&limit=1`);
    const json = await res.json();
    const gif = json.results?.[0]?.media_formats?.gif?.url;
    await sock.sendMessage(msg.key.remoteJid, {
      video: { url: gif },
      gifPlayback: true,
      caption: "🥊 Boom! Gotcha!"
    }, { quoted: msg });
  }
};
