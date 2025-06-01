// commands/kiss.mjs
import fetch from "node-fetch";

export default {
  name: "😁kiss",
  description: "Send a kiss GIF 😘",
  category: "fun",
  async execute(sock, msg) {
    const res = await fetch(`https://tenor.googleapis.com/v2/search?q=kiss&key=${process.env.TENOR_API_KEY}&limit=1`);
    const json = await res.json();
    const gif = json.results?.[0]?.media_formats?.gif?.url;
    await sock.sendMessage(msg.key.remoteJid, {
      video: { url: gif },
      gifPlayback: true,
      caption: "😘 Hapo kiss!"
    }, { quoted: msg });
  }
};
