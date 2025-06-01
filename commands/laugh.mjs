// commands/laugh.mjs
import fetch from "node-fetch";

export default {
  name: "😁laugh",
  description: "Send a random laughing GIF 😂",
  category: "fun",
  async execute(sock, msg) {
    const res = await fetch(`https://tenor.googleapis.com/v2/search?q=funny%20laugh&key=${process.env.TENOR_API_KEY}&limit=1`);
    const json = await res.json();
    const gif = json.results?.[0]?.media_formats?.gif?.url;
    await sock.sendMessage(msg.key.remoteJid, {
      video: { url: gif },
      gifPlayback: true,
      caption: "😂 That was hilarious!"
    }, { quoted: msg });
  }
};
