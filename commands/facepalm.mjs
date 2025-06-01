// commands/facepalm.mjs
import fetch from "node-fetch";

export default {
  name: "😁facepalm",
  description: "Send a facepalm GIF 🤦",
  category: "fun",
  async execute(sock, msg) {
    const res = await fetch(`https://tenor.googleapis.com/v2/search?q=facepalm&key=${process.env.TENOR_API_KEY}&limit=1`);
    const json = await res.json();
    const gif = json.results?.[0]?.media_formats?.gif?.url;
    await sock.sendMessage(msg.key.remoteJid, {
      video: { url: gif },
      gifPlayback: true,
      caption: "🤦 Oops!"
    }, { quoted: msg });
  }
};
